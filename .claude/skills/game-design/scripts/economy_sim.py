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
  python economy_sim.py econ.json                       # with "strategies": side-by-side comparison
  python economy_sim.py econ.json --strategy boom       # full per-pool report for one strategy
  python economy_sim.py econ.json --set upkeep=0.8      # override a param without editing the file
  python economy_sim.py econ.json --sweep upkeep=0.25,0.5,1.0   # sensitivity sweep across strategies

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
  "track": ["gold", "mines", "soldiers", "enemy_hp"],
  "params": {"upkeep": 0.5},                    # named tuning knobs usable in any expression
  "strategies": {                              # artificial players: override params / converters / pools
    "rush": {"params": {"army_from_mines": 1}},
    "boom": {"converters": [ ... ]}
  }
}
Expressions may use pool names, param names, numbers, + - * / // % ** ( ), comparisons, and/or/not,
min, max, abs, floor, ceil, randint(a,b), random(), chance(p) (True with probability p),
and 'step' (current step number). Pools never drop below 0 from flows: a flow moves
only what the source pool holds (the Machinations 'pull' rule). Converters fire
only when they can pay their full cost; consume/produce amounts may be expressions
(e.g. "consume": {"gold": "10*1.5**mines"} for a rising-cost stopping mechanism).
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
from collections import defaultdict

EXAMPLE = {
    "params": {"mine_cost": 15, "mine_cap": 6, "soldier_cost": 5, "upkeep": 0.5, "army_from_mines": 3},
    "pools": {"gold": 10, "mines": 1, "soldiers": 0, "enemy_hp": 300},
    "flows": [
        {"name": "mining", "from": "source", "to": "gold", "rate": "3*mines"},
        {"name": "upkeep", "from": "gold", "to": "drain", "rate": "upkeep*soldiers"},
        {"name": "raid", "from": "enemy_hp", "to": "drain", "rate": "soldiers*randint(0,2)"},
        {"name": "casualties", "from": "soldiers", "to": "drain", "rate": "1 if chance(0.2) else 0"},
    ],
    "converters": [
        {"name": "build_mine", "when": "mines < mine_cap", "consume": {"gold": "mine_cost*1.3**(mines-1)"}, "produce": {"mines": 1}},
        {"name": "train", "when": "gold >= soldier_cost and mines >= army_from_mines", "consume": {"gold": "soldier_cost"}, "produce": {"soldiers": 1}, "max_per_step": 2},
    ],
    "strategies": {
        "rush": {"params": {"army_from_mines": 1}},
        "balanced": {"params": {"army_from_mines": 3}},
        "boom": {"params": {"army_from_mines": 6}},
    },
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


def run_once(spec, steps, rng, compiled, params):
    pools = {k: float(v) for k, v in spec["pools"].items()}
    env_funcs = dict(params)
    env_funcs.update({"min": min, "max": max, "abs": abs, "floor": math.floor, "ceil": math.ceil,
                 "randint": rng.randint, "random": rng.random, "chance": lambda p: rng.random() < p})
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
        for c, when, cons, prod in compiled["converters"]:
            n = 0
            while n < c.get("max_per_step", 1):
                cenv = dict(pools, step=step, **env_funcs)
                if not eval(when, {"__builtins__": {}}, cenv):
                    break
                cost = {k: float(eval(v, {"__builtins__": {}}, cenv)) for k, v in cons.items()}
                if any(pools[k] < v for k, v in cost.items()):
                    break
                gain = {k: float(eval(v, {"__builtins__": {}}, cenv)) for k, v in prod.items()}
                for k, v in cost.items():
                    pools[k] -= v
                for k, v in gain.items():
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


def prepare(spec, params):
    names = set(spec["pools"])
    known = names | set(params)
    for f in spec.get("flows", []):
        for end in (f["from"], f["to"]):
            if end not in names | {"source", "drain"}:
                sys.exit(f"Flow '{f.get('name')}' references unknown pool '{end}'.")
    for c in spec.get("converters", []):
        for k in list(c.get("consume", {})) + list(c.get("produce", {})):
            if k not in names:
                sys.exit(f"Converter '{c.get('name')}' references unknown pool '{k}'.")
    return {
        "flows": [(f, compile_expr(f["rate"], known)) for f in spec.get("flows", [])],
        "converters": [(c, compile_expr(c.get("when", "True"), known),
                        {k: compile_expr(v, known) for k, v in c.get("consume", {}).items()},
                        {k: compile_expr(v, known) for k, v in c.get("produce", {}).items()})
                       for c in spec.get("converters", [])],
        "end": [(e, compile_expr(e["when"], known)) for e in spec.get("end", [])],
    }


def simulate(spec, params, runs_n, steps, seed):
    compiled = prepare(spec, params)
    rng = random.Random(seed)
    outcomes, lengths, runs, fired_tot = {}, [], [], {c["name"]: 0 for c in spec.get("converters", [])}
    for _ in range(runs_n):
        h, label, n, fired = run_once(spec, steps, rng, compiled, params)
        outcomes[label] = outcomes.get(label, 0) + 1
        lengths.append(n)
        runs.append(h)
        for k, v in fired.items():
            fired_tot[k] = fired_tot.get(k, 0) + v
    track = spec.get("track", list(spec["pools"]))
    mean_traj = [{t: statistics.mean(h[min(s, len(h)) - 1][t] for h in runs) for t in track} for s in range(1, steps + 1)]
    signals = []
    for t in track:
        q = [m[t] for m in mean_traj]
        third = max(1, len(q) // 3)
        early, late = q[third] - q[0], q[-1] - q[-third - 1]
        if early > 0 and late > 2.5 * early and q[-1] > 5 * max(1, q[0]):
            signals.append(f"ACCELERATING: '{t}' grows faster and faster (positive feedback). Expect a snowballing "
                           "leader; consider a stopping mechanism or dynamic friction.")
        if all(abs(x - q[0]) < 1e-9 for x in q):
            signals.append(f"FLAT: '{t}' never changes. Is anything connected to it?")
        final = [h[-1][t] for h in runs]
        if statistics.mean(final) and statistics.pstdev(final) / (abs(statistics.mean(final)) or 1) > 1.0:
            signals.append(f"SWINGY: final '{t}' varies more than its mean. Randomness may be outweighing player choice.")
    signals += [f"DEAD OPTION: converter '{k}' never fires. Its condition or cost is out of reach."
                for k, v in fired_tot.items() if v == 0]
    if outcomes.get("timeout", 0) > 0.5 * runs_n:
        signals.append("NO ENDING: most runs hit the step limit. Add a win/lose condition or stronger drains.")
    return dict(outcomes=outcomes, lengths=lengths, runs=runs, fired=fired_tot, track=track,
                mean_traj=mean_traj, signals=signals, n=runs_n, steps=steps)


def report(r):
    n, steps, track, runs = r["n"], r["steps"], r["track"], r["runs"]
    print(f"{n} runs, up to {steps} steps\n")
    print("Outcomes: " + ", ".join(f"{k} {v/n*100:.0f}%" for k, v in sorted(r["outcomes"].items(), key=lambda x: -x[1])))
    L = r["lengths"]
    print(f"Game length (steps): mean {statistics.mean(L):.1f}, p10 {pct(L,.1)}, p90 {pct(L,.9)}")
    print("Converter use per run: " + ", ".join(f"{k} {v/n:.1f}" for k, v in r["fired"].items()))
    checkpoints = sorted({1, max(1, steps // 4), max(1, steps // 2), max(1, 3 * steps // 4), steps})
    print("\nMean (p10..p90) of tracked pools at checkpoints (finished runs hold their last value):")
    print(f"{'step':>6}" + "".join(f"{t[:14]:>22}" for t in track))
    for s in checkpoints:
        row = f"{s:>6}"
        for t in track:
            vals = [h[min(s, len(h)) - 1][t] for h in runs]
            row += f"{statistics.mean(vals):>10.1f} ({pct(vals,.1):.0f}..{pct(vals,.9):.0f})".rjust(22)
        print(row)
    print("\nSignals:")
    for x in r["signals"] or ["No obvious runaway, dead option or stall at these values."]:
        print("  " + x)


def write_csv(path, r):
    with open(path, "w", newline="") as fh:
        w = csv.DictWriter(fh, fieldnames=["step"] + r["track"])
        w.writeheader()
        for i, m in enumerate(r["mean_traj"], 1):
            w.writerow(dict(step=i, **{k: round(v, 3) for k, v in m.items()}))


def parse_set(items):
    out = {}
    for it in items or []:
        k, v = it.split("=", 1)
        out[k] = float(v)
    return out


def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("spec", nargs="?")
    p.add_argument("--runs", type=int, default=500)
    p.add_argument("--steps", type=int, default=60)
    p.add_argument("--seed", type=int, default=7)
    p.add_argument("--csv", help="write mean trajectory per step to this CSV (per strategy: NAME is inserted)")
    p.add_argument("--set", action="append", metavar="PARAM=VALUE", help="override a value in 'params' (repeatable)")
    p.add_argument("--sweep", metavar="PARAM=V1,V2,...", help="re-run for each value of one param")
    p.add_argument("--strategy", help="run only this strategy, with the full report")
    p.add_argument("--example", action="store_true")
    a = p.parse_args()
    if a.example:
        print(json.dumps(EXAMPLE, indent=2))
        return
    if not a.spec:
        p.error("spec.json required (or --example)")
    spec = json.load(open(a.spec))
    base_params = dict(spec.get("params", {}))
    base_params.update(parse_set(a.set))
    strategies = spec.get("strategies") or {}
    if a.strategy:
        if a.strategy not in strategies:
            sys.exit(f"Unknown strategy '{a.strategy}'. Have: {sorted(strategies)}")
        strategies = {a.strategy: strategies[a.strategy]}

    def variant(st):
        sp = dict(spec)
        if "converters" in st:
            sp["converters"] = st["converters"]
        if "pools" in st:
            sp["pools"] = dict(spec["pools"], **st["pools"])
        prm = dict(base_params, **st.get("params", {}))
        prm.update(parse_set(a.set))  # command-line overrides win
        return sp, prm

    sweep_vals = [None]
    if a.sweep:
        key, vals = a.sweep.split("=", 1)
        sweep_vals = [(key, float(v)) for v in vals.split(",")]

    if not strategies and not a.sweep:
        r = simulate(spec, base_params, a.runs, a.steps, a.seed)
        report(r)
        if a.csv:
            write_csv(a.csv, r)
            print(f"\nWrote mean trajectory to {a.csv}")
        return
    if len(strategies) == 1 and not a.sweep:
        (name, st), = strategies.items()
        sp, prm = variant(st)
        print(f"Strategy: {name}")
        r = simulate(sp, prm, a.runs, a.steps, a.seed)
        report(r)
        if a.csv:
            write_csv(a.csv.replace(".csv", f"_{name}.csv"), r)
        return

    strategies = strategies or {"default": {}}
    labels = sorted({l for e in spec.get("end", []) for l in [e["label"]]} | {"timeout"})
    print(f"Strategy comparison: {a.runs} runs each, up to {a.steps} steps"
          + (f"; sweeping {sweep_vals[0][0]}" if a.sweep else "") + "\n")
    head = f"{'strategy':<16}" + (f"{'value':>8}" if a.sweep else "") + "".join(f"{l[:9]:>10}" for l in labels) + f"{'len':>7}  flags"
    print(head)
    per_label = defaultdict(list)
    for sv in sweep_vals:
        for name, st in strategies.items():
            sp, prm = variant(st)
            if sv:
                prm[sv[0]] = sv[1]
            r = simulate(sp, prm, a.runs, a.steps, a.seed)
            row = f"{name[:16]:<16}" + (f"{sv[1]:>8g}" if sv else "")
            for l in labels:
                share = r["outcomes"].get(l, 0) / a.runs
                per_label[(sv, l)].append((share, name))
                row += f"{share*100:9.0f}%"
            flags = sorted({x.split(":")[0] for x in r["signals"]})
            print(row + f"{statistics.mean(r['lengths']):7.1f}  {','.join(flags) or '-'}")
            if a.csv:
                write_csv(a.csv.replace(".csv", f"_{name}" + (f"_{sv[1]:g}" if sv else "") + ".csv"), r)
    print()
    for sv in sweep_vals:
        for l in labels:
            vals = per_label[(sv, l)]
            if l == "timeout" or len(vals) < 2:
                continue
            best = max(vals)
            others = [v for v, nm in vals if nm != best[1]]
            if others and best[0] - max(others) > 0.25:
                print(f"  DOMINANT?{(' at ' + sv[0] + '=' + format(sv[1], 'g')) if sv else ''}: '{best[1]}' reaches "
                      f"'{l}' {best[0]*100:.0f}% vs next best {max(others)*100:.0f}%. Check it isn't the only viable plan.")
    print("Run with --strategy NAME for the full per-pool report of one strategy.")


if __name__ == "__main__":
    signal.signal(signal.SIGPIPE, signal.SIG_DFL)
    main()
