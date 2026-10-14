#!/usr/bin/env python3
"""Lint a game's design data tables (CSV) before they reach the engine.

Checks that catch the errors designers make most when hand-editing charts:
  * duplicate ids
  * random-range tables (low/high columns) with gaps, overlaps, or wrong coverage,
    checked per group (e.g. per map in an encounter table)
  * spell / outcome percentages per row that don't total 100 (columns ending in _pct)
  * references to other tables that don't resolve (e.g. encounter names -> entity chart)
  * empty required cells

Usage
  python validate_tables.py data/entity_chart.csv
  python validate_tables.py data/encounter_table.csv --group map --die 100
  python validate_tables.py data/encounter_table.csv --ref singular=data/entity_chart.csv:name
  python validate_tables.py data/*.csv          # run every applicable check on each file
Exit code 1 if any problem is found.
"""
import argparse
import csv
import re
import signal
import sys
from collections import defaultdict


def load(path):
    with open(path, newline="") as fh:
        return list(csv.DictReader(fh))


def check(path, a):
    rows = load(path)
    problems = []
    if not rows:
        return [f"{path}: no rows"]
    cols = rows[0].keys()
    if "id" in cols:
        seen = defaultdict(int)
        for r in rows:
            seen[r["id"]] += 1
        problems += [f"duplicate id {k} ({v}x)" for k, v in seen.items() if v > 1]
    if "low" in cols and "high" in cols:
        groups = defaultdict(list)
        for i, r in enumerate(rows, 2):
            g = r.get(a.group, "") if a.group and a.group in cols else ""
            try:
                groups[g].append((int(r["low"]), int(r["high"]), i))
            except ValueError:
                problems.append(f"line {i}: low/high not integers")
        for g, rs in groups.items():
            rs.sort()
            expect = 1
            for lo, hi, line in rs:
                if lo != expect:
                    problems.append(f"{a.group or 'table'} '{g}': line {line} starts at {lo}, expected {expect} (gap or overlap)")
                expect = hi + 1
            if expect - 1 != a.die:
                problems.append(f"{a.group or 'table'} '{g}': ends at {expect-1}, die is d{a.die}")
    pct_cols = [c for c in cols if re.search(r"spell\d+_pct$|outcome\d+_pct$", c)]
    if pct_cols:
        for i, r in enumerate(rows, 2):
            vals = [float(r[c] or 0) for c in pct_cols]
            if sum(vals) and abs(sum(vals) - 100) > 0.01:
                problems.append(f"line {i} ({r.get('name', r.get('id', ''))}): {'+'.join(pct_cols)} = {sum(vals):g}, not 100")
    for spec in a.ref or []:
        col, target = spec.split("=", 1)
        tpath, tcol = target.rsplit(":", 1)
        if col not in cols:
            continue
        valid = {r[tcol].strip().lower() for r in load(tpath)}
        for i, r in enumerate(rows, 2):
            v = r[col].strip()
            if v and v.upper() not in ("SPECIAL", "NA") and v.lower() not in valid:
                problems.append(f"line {i}: {col} '{v}' not found in {tpath}:{tcol}")
    for req in a.required or []:
        if req in cols:
            problems += [f"line {i}: empty '{req}'" for i, r in enumerate(rows, 2) if not r[req].strip()]
    return problems


def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("files", nargs="+")
    p.add_argument("--group", default="map", help="column to group random ranges by (default: map)")
    p.add_argument("--die", type=int, default=100)
    p.add_argument("--ref", action="append", help="col=other.csv:col reference check (repeatable)")
    p.add_argument("--required", action="append", help="column that must be non-empty (repeatable)")
    a = p.parse_args()
    bad = False
    for f in a.files:
        probs = check(f, a)
        print(f"{f}: " + ("OK" if not probs else f"{len(probs)} problem(s)"))
        for x in probs:
            print("   - " + x)
        bad |= bool(probs)
    sys.exit(1 if bad else 0)


if __name__ == "__main__":
    signal.signal(signal.SIGPIPE, signal.SIG_DFL)
    main()
