#!/usr/bin/env python3
"""Machinations-style internal-economy simulator (pools, sources, drains, converters,
feedback) with Monte Carlo runs.

Adams & Dormans' point: you can't see an economy's dynamics on paper. Positive
feedback, stalls, snowballing leaders and dead strategies only show up when you run
the loop many times. This script runs a small text spec of your economy and reports
how each resource behaves over time, how fast the game ends, and warning signs.

Usage
  python economy_sim.py econ.json [--runs 500] [--steps 60] [--csv out.csv]
  python economy_sim.py --example > econ.json

Spec (JSON):
{
  "pools":   {"gold": 10, "mines": 1, "soldiers": 0, "enemy_hp": 200},
  "flows": [                                   # applied in order every step
    {"name": "mining",  "from": "source", "to": "gold", "rate": "3*mines"},
    {"name": "upkeep",  "from": "gold",   "to": "drain", "rate": "0.5*soldiers"},
    {"name": "raid",    "from": "enemy_hp", "to": "drain", "rate": "soldiers*randint(0,2)"}
  ],
  "converters": [                               # 'artificial player' choices / production
    {"name": "build_mine", "when": "gold >= 15 and mines < 6",
     "consume": {"gold": 15}, "produce": {"mines": 1}},
    {"name": "train", "when": "gold >= 5", "consume": {"gold": 5}, "produce": {"soldiers": 1},
     "max_per_step": 2}
  ],
  "end": [{"when": "enemy_hp <= 0", "label": "win"}, {"when": "gold < 0", "label": "bankrupt"}],
  "track": ["gold", "mines", "soldiers", "enemy_hp"]
}
Expressions may use pool names, numbers, + - * / // % ** ( ), comparisons, and/or/not,
min, max, abs, floor, ceil, randint(a,b), random(), chance(p) (True with probability p),
and 'step' (current step number). Pools never drop below 0 from flows: a flow moves
only what the source pool holds (the Machinations 'pull' rule). Converters fire
only when they can pay their full cost.
"""
import argparse
import signal
import ast
import csv
import json
import math
import random
import statistics
import sys

EXAMPLE = {
    "pools": {"gold": 10, "mines": 1, "soldiers": 0, "enemy_hp": 300},
    "flows": [
        {"name": "mining", "from": "source", "to": "gold", "rate": "3*mines"},
        {"name": "upkeep", "from": "gold", "to": "drain", "rate": "0.5*soldiers"},
        {"name": "raid", "from": "enemy_hp", "to": "drain", "rate": "soldiers*randint(0,2)"},
        {"name": "casualties", "from": "soldiers", "to": "drain", "rate": "1 if chance(0.2) else 0"},
    ],
    "converters": [
        {"name": "build_mine", "when": "gold >= 15 and mines < 6", "consume": {"gold": 15}, "produce": {"mines": 1}},
        {"name": "train", "when": "gold >= 5 and mines >= 3", "consume": {"gold": 5}, "produce": {"soldiers": 1}, "max_per_step": 2},
    ],
    "end": [{"when": "enemy_hp <= 0", "label": "win"}],
    "track": ["gold", "mines", "soldiers", "enemy_hp"],
}

ALLOWED_NODES = (ast.Expression, ast.BoolOp, ast.BinOp, ast.UnaryOp, ast.Compare, ast.IfExp,
                 ast.Call, ast.Name, ast.Load, ast.Constant, ast.And, ast.Or, ast.Not, ast.Add,
                 ast.Sub, ast.Mult, ast.Div, ast.FloorDiv, ast.Mod, ast.Pow, ast.USub, ast.UAdd,
                 ast.Eq, ast.NotEq, ast.Lt, ast.LtE, ast.Gt, ast.GtE)
FUNCS = {"min", "max", "abs", "floor", "ceil", "randint", "random", "chance"}


def compile_expr(src, names):
    tree = ast.parse(str(src), mode="eval")
    for node in ast.walk(tree):
        if not isinstance(node, ALLOWED_NODES):
            sys.exit(f"Expression '{src}': '{type(node).__name__}' isn't allowed.")
        if isinstance(node, ast.Call) and not (isinstance(node.func, ast.Name) and node.func.id in FUNCS):
            sys.exit(f"Expression '{src}': only {sorted(FUNCS)} may be called.")
        if isinstance(node, ast.Name) and node.id not in names and node.id not in FUNCS and node.id != "step":
            sys.exit(f"Expression '{src}': unknown name '{node.id}'. Pools are {sorted(names)}.")
    return compile(tree, "<expr>", "eval")


def run_once(spec, steps, rng, compiled):
    pools = {k: float(v) for k, v in spec["pools"].items()}
    env_funcs = {"min": min, "max": max, "abs": abs, "floor": math.floor, "ceil": math.ceil,
                 "randint": rng.randint, "random": rng.random, "chance": lambda p: rng.random() < p}
    history = []
    fired = {c["name"]: 0 for c in spec.get("converters", [])}
    for step in range(1, steps + 1):
        env = dict(pools, step=step, **env_funcs)
        for f, rate in compiled["flows"]:
            amt = max(0.0, float(eval(rate, {"__builtins__": {}}, env)))
            if f["from"] != "source":
                amt = min(amt, pools[f["from"]])
                pools[f["from"]] -= amt
            if f["to"] != "drain":
                pools[f["to"]] += amt
            env.update(pools)
        for c, when in compiled["converters"]:
            n = 0
            while n < c.get("max_per_step", 1) and eval(when, {"__builtins__": {}}, dict(pools, step=step, **env_funcs)):
                if any(pools[k] < v for k, v in c["consume"].items()):
                    break
                for k, v in c["consume"].items():
                    pools[k] -= v
                for k, v in c.get("produce", {}).items():
                    pools[k] += v
                n += 1
            fired[c["name"]] += n
        history.append(dict(pools))
        for e, when in compiled["end"]:
            if eval(when, {"__builtins__": {}}, dict(pools, step=step, **env_funcs)):
                return history, e["label"], step, fired
    return history, "timeout", steps, fired


def pct(xs, q):
    xs = sorted(xs)
    return xs[min(len(xs) - 1, int(q * len(xs)))]


def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("spec", nargs="?")
    p.add_argument("--runs", type=int, default=500)
    p.add_argument("--steps", type=int, default=60)
    p.add_argument("--seed", type=int, default=7)
    p.add_argument("--csv", help="write mean trajectory per step to this CSV")
    p.add_argument("--example", action="store_true")
    a = p.parse_args()
    if a.example:
        print(json.dumps(EXAMPLE, indent=2))
        return
    if not a.spec:
        p.error("spec.json required (or --example)")
    spec = json.load(open(a.spec))
    names = set(spec["pools"])
    for f in spec.get("flows", []):
        for end in (f["from"], f["to"]):
            if end not in names | {"source", "drain"}:
                sys.exit(f"Flow '{f.get('name')}' references unknown pool '{end}'.")
    compiled = {
        "flows": [(f, compile_expr(f["rate"], names)) for f in spec.get("flows", [])],
        "converters": [(c, compile_expr(c.get("when", "True"), names)) for c in spec.get("converters", [])],
        "end": [(e, compile_expr(e["when"], names)) for e in spec.get("end", [])],
    }
    track = spec.get("track", list(names))
    rng = random.Random(a.seed)
    outcomes, lengths, runs, fired_tot = {}, [], [], {}
    for _ in range(a.runs):
        h, label, n, fired = run_once(spec, a.steps, rng, compiled)
        outcomes[label] = outcomes.get(label, 0) + 1
        lengths.append(n)
        runs.append(h)
        for k, v in fired.items():
            fired_tot[k] = fired_tot.get(k, 0) + v

    print(f"{a.runs} runs, up to {a.steps} steps\n")
    print("Outcomes: " + ", ".join(f"{k} {v/a.runs*100:.0f}%" for k, v in sorted(outcomes.items(), key=lambda x: -x[1])))
    print(f"Game length (steps): mean {statistics.mean(lengths):.1f}, p10 {pct(lengths,.1)}, p90 {pct(lengths,.9)}")
    print("Converter use per run: " + ", ".join(f"{k} {v/a.runs:.1f}" for k, v in fired_tot.items()))

    checkpoints = sorted({1, max(1, a.steps // 4), max(1, a.steps // 2), max(1, 3 * a.steps // 4), a.steps})
    print("\nMean (p10..p90) of tracked pools at checkpoints (finished runs hold their last value):")
    print(f"{'step':>6}" + "".join(f"{t[:14]:>22}" for t in track))
    mean_traj = []
    for s in range(1, a.steps + 1):
        mean_traj.append({t: statistics.mean(h[min(s, len(h)) - 1][t] for h in runs) for t in track})
    for s in checkpoints:
        row = f"{s:>6}"
        for t in track:
            vals = [h[min(s, len(h)) - 1][t] for h in runs]
            row += f"{statistics.mean(vals):>10.1f} ({pct(vals,.1):.0f}..{pct(vals,.9):.0f})".rjust(22)
        print(row)

    print("\nSignals:")
    said = False
    for t in track:
        q = [m[t] for m in mean_traj]
        third = max(1, len(q) // 3)
        early, late = q[third] - q[0], q[-1] - q[-third - 1]
        if early > 0 and late > 2.5 * early and q[-1] > 5 * max(1, q[0]):
            print(f"  ACCELERATING: '{t}' grows faster and faster (positive feedback). Expect a snowballing leader; "
                  "consider a stopping mechanism or dynamic friction.")
            said = True
        if all(abs(x - q[0]) < 1e-9 for x in q):
            print(f"  FLAT: '{t}' never changes. Is anything connected to it?")
            said = True
        spread = [h[-1][t] for h in runs]
        if statistics.mean(spread) and statistics.pstdev(spread) / (abs(statistics.mean(spread)) or 1) > 1.0:
            print(f"  SWINGY: final '{t}' varies more than its mean. Randomness may be outweighing player choice.")
            said = True
    for k, v in fired_tot.items():
        if v == 0:
            print(f"  DEAD OPTION: converter '{k}' never fires. Its condition or cost is out of reach.")
            said = True
    if outcomes.get("timeout", 0) > 0.5 * a.runs:
        print("  NO ENDING: most runs hit the step limit. Add a win/lose condition or stronger drains.")
        said = True
    if not said:
        print("  No obvious runaway, dead option or stall at these values.")

    if a.csv:
        with open(a.csv, "w", newline="") as fh:
            w = csv.DictWriter(fh, fieldnames=["step"] + track)
            w.writeheader()
            for i, m in enumerate(mean_traj, 1):
                w.writerow(dict(step=i, **{k: round(v, 3) for k, v in m.items()}))
        print(f"\nWrote mean trajectory to {a.csv}")


if __name__ == "__main__":
    signal.signal(signal.SIGPIPE, signal.SIG_DFL)
    main()
