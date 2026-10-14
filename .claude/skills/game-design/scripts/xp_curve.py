#!/usr/bin/env python3
"""Generate and sanity-check experience (XP) curves and level pacing.

Moore: decide the curve shape early, because switching from a formula to a
hand-authored table late in production causes "massive headaches". This tool
builds the table either way and tells you how long each level takes in real
play time, so you can see grind before testers do.

Usage
  python xp_curve.py --model doubling --base 50 --levels 20
  python xp_curve.py --model power --base 100 --exp 1.8 --levels 30
  python xp_curve.py --model linear --base 100 --step 25 --levels 15
  python xp_curve.py --model table --table 10,20,40,100,250,500,900   # authored per-level costs
  ... add pacing:  --xp-per-minute 12 --xp-growth 1.08   (XP earned per minute at level 1,
                    multiplied each level as enemies and quests pay more)
  ... --csv curve.csv   to write the table for the design doc / data files

Models (cost to go from level L to L+1):
  doubling   base * 2**(L-1)          paper-RPG style; explodes quickly
  power      base * L**exp            the common smooth curve (exp 1.5-2.2)
  exponential base * growth**(L-1)    set --growth (e.g. 1.15)
  linear     base + step*(L-1)
  table      your own list
"""
import argparse
import signal
import csv


def costs(a):
    out = []
    if a.model == "table":
        return [int(x) for x in a.table.split(",")]
    for L in range(1, a.levels):
        if a.model == "doubling":
            c = a.base * 2 ** (L - 1)
        elif a.model == "power":
            c = a.base * L ** a.exp
        elif a.model == "exponential":
            c = a.base * a.growth ** (L - 1)
        else:
            c = a.base + a.step * (L - 1)
        out.append(int(round(c)))
    return out


def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("--model", choices=["doubling", "power", "exponential", "linear", "table"], default="power")
    p.add_argument("--base", type=float, default=100)
    p.add_argument("--exp", type=float, default=1.8)
    p.add_argument("--growth", type=float, default=1.15)
    p.add_argument("--step", type=float, default=50)
    p.add_argument("--levels", type=int, default=20)
    p.add_argument("--table")
    p.add_argument("--xp-per-minute", type=float, help="XP earned per minute of play at level 1")
    p.add_argument("--xp-growth", type=float, default=1.0, help="multiplier on XP/minute per level")
    p.add_argument("--csv")
    a = p.parse_args()
    cs = costs(a)
    rows, total, minutes_total = [], 0, 0.0
    for i, c in enumerate(cs, 1):
        total += c
        row = {"from_level": i, "to_level": i + 1, "xp_to_next": c, "cumulative_xp": total}
        if a.xp_per_minute:
            rate = a.xp_per_minute * a.xp_growth ** (i - 1)
            m = c / rate
            minutes_total += m
            row.update(minutes=round(m, 1), cumulative_hours=round(minutes_total / 60, 2))
        rows.append(row)
    hdr = f"{'lvl':>7} {'xp to next':>11} {'cumulative':>11}"
    if a.xp_per_minute:
        hdr += f" {'minutes':>8} {'total hrs':>9}"
    print(hdr)
    for r in rows:
        line = f"{r['from_level']:>3}->{r['to_level']:<3} {r['xp_to_next']:>11,} {r['cumulative_xp']:>11,}"
        if a.xp_per_minute:
            line += f" {r['minutes']:>8.1f} {r['cumulative_hours']:>9.2f}"
        print(line)
    print("\nChecks:")
    ratios = [cs[i + 1] / cs[i] for i in range(len(cs) - 1) if cs[i]]
    if any(r < 1 for r in ratios):
        print("  A level costs less than the one before it; players will notice the dip.")
    if max(cs) > 99_999:
        print("  Late levels need 6-figure XP. Moore: keep in-play numbers small; show big numbers only on "
              "secondary screens, or rescale.")
    if a.xp_per_minute:
        mins = [r["minutes"] for r in rows]
        if mins[0] > 10:
            print(f"  First level-up takes {mins[0]:.0f} min. Give an early reward within the first few minutes.")
        if mins[-1] > 6 * mins[len(mins) // 2]:
            print("  Last levels take far longer than mid-game ones: grind risk. Raise late XP payouts or flatten the curve.")
        print(f"  Time to max level: {rows[-1]['cumulative_hours']:.1f} h of focused play (before exploration/story time).")
    if a.csv:
        with open(a.csv, "w", newline="") as fh:
            w = csv.DictWriter(fh, fieldnames=list(rows[0]))
            w.writeheader()
            w.writerows(rows)
        print(f"Wrote {a.csv}")


if __name__ == "__main__":
    signal.signal(signal.SIGPIPE, signal.SIG_DFL)
    main()
