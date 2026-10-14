#!/usr/bin/env python3
"""Exact probability distributions for dice expressions and weighted outcome tables.

Use it to check what a randomizer really does before it goes into a design doc:
bell curves vs flat ranges, the odds of a critical, whether a 70/30 split "feels"
the way you intend, and whether every row of a percentile table adds up to 100.

Examples
  python dice_odds.py roll 2d6
  python dice_odds.py roll 3d6+2
  python dice_odds.py roll 1d20 --at-least 15          # chance to hit DC 15
  python dice_odds.py roll 4d6kh3                       # roll 4, keep highest 3
  python dice_odds.py roll 2d20kl1                      # disadvantage
  python dice_odds.py sticks 4                          # Senet-style binary throws
  python dice_odds.py table combat_table.csv            # validate a d100 table
  python dice_odds.py compare 2d6 1d12 3d4              # mean/sd side by side

Table CSV format (header required):  low,high,result
  1,5,Miss
  6,15,Glancing (75%)
  ...
Ranges must be contiguous and cover the die (default d100; override with --die).
"""
import argparse
import signal
import csv
import itertools
import math
import re
import sys
from collections import Counter
from fractions import Fraction

EXPR = re.compile(r"^(\d*)d(\d+)(?:(kh|kl)(\d+))?([+-]\d+)?$", re.I)


def parse(expr):
    m = EXPR.match(expr.replace(" ", ""))
    if not m:
        sys.exit(f"Can't parse '{expr}'. Use NdS, NdS+M, NdSkhK or NdSklK (e.g. 2d6, 4d6kh3, 1d20+5).")
    n = int(m.group(1) or 1)
    sides = int(m.group(2))
    keep_mode = (m.group(3) or "").lower()
    keep = int(m.group(4)) if m.group(4) else n
    mod = int(m.group(5) or 0)
    if keep > n:
        sys.exit("Can't keep more dice than you roll.")
    return n, sides, keep_mode, keep, mod


def distribution(expr):
    n, sides, keep_mode, keep, mod = parse(expr)
    if not keep_mode:
        # convolution: fast for any N
        dist = Counter({0: 1})
        for _ in range(n):
            nxt = Counter()
            for total, ways in dist.items():
                for face in range(1, sides + 1):
                    nxt[total + face] += ways
            dist = nxt
    else:
        if sides ** n > 5_000_000:
            sys.exit("Too many combinations for keep-highest/lowest; reduce dice.")
        dist = Counter()
        for faces in itertools.product(range(1, sides + 1), repeat=n):
            s = sorted(faces, reverse=(keep_mode == "kh"))
            dist[sum(s[:keep])] += 1
    total = sum(dist.values())
    return {k + mod: Fraction(v, total) for k, v in sorted(dist.items())}


def stats(dist):
    mean = sum(k * p for k, p in dist.items())
    var = sum((k - mean) ** 2 * p for k, p in dist.items())
    return float(mean), math.sqrt(float(var))


def bar(p, width=40, peak=1.0):
    return "#" * max(1, round(float(p) / peak * width)) if p > 0 else ""


def cmd_roll(a):
    dist = distribution(a.expr)
    mean, sd = stats(dist)
    peak = float(max(dist.values()))
    print(f"{a.expr}: mean {mean:.2f}, sd {sd:.2f}, range {min(dist)}..{max(dist)}")
    print(f"{'result':>6} {'chance':>8} {'>=this':>8}  ")
    at_least = Fraction(1)
    for k, p in dist.items():
        print(f"{k:>6} {float(p)*100:7.2f}% {float(at_least)*100:7.2f}%  {bar(p, peak=peak)}")
        at_least -= p
    if a.at_least is not None:
        p = sum(v for k, v in dist.items() if k >= a.at_least)
        print(f"\nP(result >= {a.at_least}) = {float(p)*100:.2f}%")
    if a.at_most is not None:
        p = sum(v for k, v in dist.items() if k <= a.at_most)
        print(f"P(result <= {a.at_most}) = {float(p)*100:.2f}%")


def cmd_sticks(a):
    n = a.n
    total = 2 ** n
    print(f"{n} two-sided throws ({total} combinations): spaces moved = number of 'up' sides")
    for k in range(n + 1):
        ways = math.comb(n, k)
        print(f"{k:>3}: {ways:>4}/{total}  {ways/total*100:6.2f}%  {bar(Fraction(ways, total), peak=math.comb(n, n//2)/total)}")


def cmd_table(a):
    rows = []
    with open(a.csv, newline="") as fh:
        for r in csv.DictReader(fh):
            rows.append((int(r["low"]), int(r["high"]), r["result"]))
    rows.sort()
    lo, hi = 1, a.die
    problems = []
    expect = lo
    for low, high, res in rows:
        if low != expect:
            problems.append(f"gap/overlap before {low}-{high} (expected start {expect})")
        if high < low:
            problems.append(f"range {low}-{high} is reversed")
        expect = high + 1
    if expect - 1 != hi:
        problems.append(f"table ends at {expect-1}, die goes to {hi}")
    width = hi - lo + 1
    print(f"{'range':>9}  {'chance':>7}  result")
    for low, high, res in rows:
        print(f"{low:>4}-{high:<4}  {(high-low+1)/width*100:6.1f}%  {res}")
    if len(rows) > 12:
        print(f"\nNote: {len(rows)} outcomes. Players can't predict a table this wide; "
              "consider merging rows (Moore: too many outcomes frustrates).")
    near_even = [r for r in rows if abs((r[1]-r[0]+1)/width - 0.5) < 0.03]
    if near_even:
        print("Note: an outcome near 50% will read to players as a coin flip.")
    print("\nOK: ranges are contiguous and cover the die." if not problems else "\nPROBLEMS:\n  " + "\n  ".join(problems))
    sys.exit(1 if problems else 0)


def cmd_compare(a):
    print(f"{'expr':>10} {'min':>5} {'max':>5} {'mean':>7} {'sd':>6}  shape")
    for e in a.exprs:
        d = distribution(e)
        mean, sd = stats(d)
        spread = sd / ((max(d) - min(d)) or 1)
        shape = "flat" if spread > 0.27 else ("bell" if spread > 0.16 else "tight bell")
        print(f"{e:>10} {min(d):>5} {max(d):>5} {mean:7.2f} {sd:6.2f}  {shape}")


def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = p.add_subparsers(dest="cmd", required=True)
    r = sub.add_parser("roll"); r.add_argument("expr"); r.add_argument("--at-least", type=int); r.add_argument("--at-most", type=int)
    r.set_defaults(fn=cmd_roll)
    s = sub.add_parser("sticks"); s.add_argument("n", type=int); s.set_defaults(fn=cmd_sticks)
    t = sub.add_parser("table"); t.add_argument("csv"); t.add_argument("--die", type=int, default=100); t.set_defaults(fn=cmd_table)
    c = sub.add_parser("compare"); c.add_argument("exprs", nargs="+"); c.set_defaults(fn=cmd_compare)
    a = p.parse_args()
    a.fn(a)


if __name__ == "__main__":
    signal.signal(signal.SIGPIPE, signal.SIG_DFL)
    main()
