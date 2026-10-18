#!/usr/bin/env python3
"""Global-English check for TA Arena: no Pune references, no old character
names, no Hindi, Marathi or other non-English words, no currency amounts.

Scans content/*.json, world-intro.json and the engine files. Prints every hit
with its file and a short context, then "hits: N". Exit 1 if there is any hit.

Usage: python3 check_global.py
"""
import glob
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
FILES = (sorted(glob.glob(os.path.join(HERE, "content", "*.json")))
         + [os.path.join(HERE, "world-intro.json")]
         + [os.path.join(HERE, "engine", name)
            for name in ("template.html", "hub-template.html", "build.py")])

# Whole words, any case: old names, places, money, family words and Hindi slang.
# A name followed by an underscore (a flag such as tanvi_offered_1) still counts.
FORBIDDEN_ANY_CASE = [
    "Pune", "Mumbai", "Kothrud", "Baner", "Kesari", "Chai", "Aai", "Papa",
    "Beta", "Arre", "Diwali", "Goa", "Lumen", "rupee", "rupees", "flat 3B",
    "Rohan", "Tanvi", "Vikram", "Dev", "Sana", "Kabir", "Meera", "Reshma",
    "Priya", "Priyanka", "Anil", "Asha",
    "bhai", "didi", "yaar", "accha", "theek", "haan", "nahi", "kya", "hai",
    "beti", "nani", "dadi", "chalo", "bas",
]
# Short tokens that are only a problem in the exact case used.
FORBIDDEN_EXACT = ["Ma", "Rs"]

PATTERNS = [(re.compile(r"(?<![A-Za-z])" + re.escape(t) + r"(?![A-Za-z])", re.IGNORECASE), t)
            for t in FORBIDDEN_ANY_CASE]
PATTERNS += [(re.compile(r"(?<![A-Za-z])" + re.escape(t) + r"(?![A-Za-z])"), t)
             for t in FORBIDDEN_EXACT]
# Any Devanagari (Hindi, Marathi) character, and currency symbols.
NON_ENGLISH = re.compile(r"[ऀ-ॿ₹]")


def main():
    hits = []
    for path in FILES:
        if not os.path.exists(path):
            continue
        text = open(path, encoding="utf-8").read()
        name = os.path.relpath(path, HERE)
        for regex, term in PATTERNS:
            for m in regex.finditer(text):
                a = max(0, m.start() - 40)
                b = min(len(text), m.end() + 40)
                ctx = text[a:b].replace("\n", " ")
                hits.append("%s [%s] ...%s..." % (name, term, ctx))
        for m in NON_ENGLISH.finditer(text):
            a = max(0, m.start() - 40)
            b = min(len(text), m.end() + 40)
            hits.append("%s [non-English script] ...%s..." % (name, text[a:b].replace("\n", " ")))
    for line in hits:
        print(line)
    print("hits: %d" % len(hits))
    return 1 if hits else 0


if __name__ == "__main__":
    sys.exit(main())
