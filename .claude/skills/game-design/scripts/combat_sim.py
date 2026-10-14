#!/usr/bin/env python3
"""Monte Carlo combat simulator for balancing units, classes, weapons and monsters.

It runs Moore's step-by-step RPG algorithm (initiative -> modified AV - modified DV ->
weighted Combat Table -> optional Critical Hit Table -> subtract HP) thousands of
times and reports what a spreadsheet can't show: win rates, rounds-to-kill, how
swingy a fight is, and which unit beats which (the rock-paper-scissors matrix).

Usage
  python combat_sim.py spec.json                 # every unit vs every unit
  python combat_sim.py spec.json --duel knight goblin --trials 20000
  python combat_sim.py --example > spec.json     # write a starter spec

Spec (JSON):
{
  "rules": {
    "min_damage": 0,              # damage when final AV <= 0 (0 = Moore's "attack misses")
    "combat_table": [[5,"miss",0],[15,"glance",0.75],[65,"normal",1.0],
                     [80,"heavy",1.25],[95,"very heavy",1.5],[100,"critical",-1]],
                                  # [upper bound on d100, label, damage multiplier]; -1 = roll crit table
    "crit_table": [[50,2.0],[85,2.5],[100,3.0]],
    "initiative": {"dex": 0.75, "con": 0.25},   # weights; ties broken randomly
    "max_rounds": 100
  },
  "units": {
    "knight": {"hp": 40, "av": 12, "dv": 6, "dex": 8, "con": 12, "tags": ["melee"]},
    "archer": {"hp": 24, "av": 10, "dv": 3, "dex": 14, "con": 7, "first_strike": true},
    ...
  },
  "counters": [["archer","knight",1.5]]   # optional: attacker deals x1.5 to that target (RPS bonus)
}
Damage per hit = max(final AV, min_damage) x table multiplier (rounded up), where
final AV = attacker av - defender dv.
"""
import argparse
import signal
import json
import math
import random
import statistics
import sys

EXAMPLE = {
    "rules": {
        "min_damage": 1,
        "combat_table": [[5, "miss", 0], [15, "glance", 0.75], [65, "normal", 1.0],
                         [80, "heavy", 1.25], [95, "very heavy", 1.5], [100, "critical", -1]],
        "crit_table": [[50, 2.0], [85, 2.5], [100, 3.0]],
        "initiative": {"dex": 0.75, "con": 0.25},
        "max_rounds": 100,
    },
    "units": {
        "knight": {"hp": 40, "av": 10, "dv": 7, "dex": 7, "con": 12},
        "infantry": {"hp": 34, "av": 9, "dv": 5, "dex": 9, "con": 11},
        "archer": {"hp": 24, "av": 14, "dv": 3, "dex": 14, "con": 7},
    },
    "counters": [["knight", "infantry", 2.0], ["infantry", "archer", 2.0], ["archer", "knight", 2.0]],
}


def roll_table(table, r):
    for upper, *rest in table:
        if r <= upper:
            return rest
    return table[-1][1:]


def attack(att, dfn, rules, counters, rng):
    final_av = att["av"] - dfn["dv"]
    base = max(final_av, rules.get("min_damage", 0))
    if base <= 0:
        return 0, "miss"
    label, mult = roll_table(rules["combat_table"], rng.randint(1, 100))
    if mult == -1:
        (mult,) = roll_table(rules["crit_table"], rng.randint(1, 100))
        label = f"critical x{mult}"
    mult *= counters.get((att["_name"], dfn["_name"]), 1.0)
    return math.ceil(base * mult), label


def initiative(u, rules, rng):
    w = rules.get("initiative", {"dex": 1.0})
    return sum(u.get(k, 0) * v for k, v in w.items()) + rng.random() * 1e-3


def fight(a, b, rules, counters, rng):
    hp = {a["_name"]: a["hp"], b["_name"]: b["hp"]}
    if a["_name"] == b["_name"]:
        hp = {"A": a["hp"], "B": b["hp"]}
    keys = list(hp)
    units = dict(zip(keys, (a, b)))
    for rnd in range(1, rules.get("max_rounds", 100) + 1):
        order = sorted(keys, key=lambda k: initiative(units[k], rules, rng), reverse=True)
        if units[keys[0]].get("first_strike") and rnd == 1:
            order = [keys[0], keys[1]]
        elif units[keys[1]].get("first_strike") and rnd == 1:
            order = [keys[1], keys[0]]
        for k in order:
            other = keys[1] if k == keys[0] else keys[0]
            dmg, _ = attack(units[k], units[other], rules, counters, rng)
            hp[other] -= dmg
            if hp[other] <= 0:
                return (0 if k == keys[0] else 1), rnd, hp[k] / units[k]["hp"]
    return None, rules.get("max_rounds", 100), 0.0


def duel(spec, n1, n2, trials, rng):
    rules, units = spec["rules"], spec["units"]
    counters = {(x, y): m for x, y, m in spec.get("counters", [])}
    a = dict(units[n1], _name=n1)
    b = dict(units[n2], _name=n2)
    wins, rounds, left, stalls = 0, [], [], 0
    for _ in range(trials):
        w, r, rem = fight(a, b, rules, counters, rng)
        if w is None:
            stalls += 1
            continue
        rounds.append(r)
        if w == 0:
            wins += 1
            left.append(rem)
    decided = trials - stalls
    return {
        "win": wins / trials, "stall": stalls / trials,
        "rounds_mean": statistics.mean(rounds) if rounds else float("nan"),
        "rounds_sd": statistics.pstdev(rounds) if rounds else 0.0,
        "hp_left_when_winning": statistics.mean(left) if left else 0.0,
        "decided": decided,
    }


def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("spec", nargs="?")
    p.add_argument("--duel", nargs=2, metavar=("A", "B"))
    p.add_argument("--trials", type=int, default=5000)
    p.add_argument("--seed", type=int, default=1)
    p.add_argument("--example", action="store_true")
    a = p.parse_args()
    if a.example:
        print(json.dumps(EXAMPLE, indent=2))
        return
    if not a.spec:
        p.error("spec.json required (or --example)")
    spec = json.load(open(a.spec))
    rng = random.Random(a.seed)

    if a.duel:
        r = duel(spec, *a.duel, a.trials, rng)
        print(f"{a.duel[0]} vs {a.duel[1]} over {a.trials} fights")
        print(f"  {a.duel[0]} wins {r['win']*100:.1f}%   stalemates {r['stall']*100:.1f}%")
        print(f"  rounds to finish: {r['rounds_mean']:.1f} (sd {r['rounds_sd']:.1f})")
        print(f"  winner's HP left when {a.duel[0]} wins: {r['hp_left_when_winning']*100:.0f}%")
        return

    names = list(spec["units"])
    print(f"Win rate of ROW attacking-first-by-initiative vs COLUMN ({a.trials} fights each)\n")
    print(f"{'':>12}" + "".join(f"{n[:10]:>11}" for n in names) + f"{'avg':>8}")
    avgs = {}
    ttk = {}
    for x in names:
        row, vals = f"{x[:12]:>12}", []
        for y in names:
            r = duel(spec, x, y, a.trials, rng)
            vals.append(r["win"]) if x != y else None
            ttk[(x, y)] = r["rounds_mean"]
            row += f"{r['win']*100:10.0f}%"
        avgs[x] = statistics.mean(vals) if vals else 0.5
        print(row + f"{avgs[x]*100:7.0f}%")
    print("\nRounds per fight (pacing):")
    for x in names:
        print(f"{x[:12]:>12}" + "".join(f"{ttk[(x, y)]:11.1f}" for y in names))

    print("\nFindings:")
    found = False
    for x in names:
        others = [y for y in names if y != x]
        if others and all(duel(spec, x, y, 1000, rng)["win"] > 0.55 for y in others):
            print(f"  DOMINANT: {x} beats every other unit. Players will build only {x} (Moore: rock-paper-scissors).")
            found = True
        if others and all(duel(spec, x, y, 1000, rng)["win"] < 0.45 for y in others):
            print(f"  DOMINATED: {x} loses to everything. Give it a niche or cut it.")
            found = True
    for (x, y), t in ttk.items():
        if x != y and t > 15:
            print(f"  SLOG: {x} vs {y} takes {t:.0f} rounds. Raise damage or lower DV.")
            found = True
            break
    if not found:
        print("  No dominant or dominated unit at these values.")


if __name__ == "__main__":
    signal.signal(signal.SIGPIPE, signal.SIG_DFL)
    main()
