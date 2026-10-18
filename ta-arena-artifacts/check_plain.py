#!/usr/bin/env python3
"""Plain-words check for TA Arena content, weeks 1 to 4.

In weeks 1 to 4 the player must never meet a book term in the opener, the
round questions, the options, the explanations, the traps, the examples or
the intro cards. Book terms belong only in the debrief card (debrief,
bookTerm, bookIdea, bookSource). Titles are the names from the table and are
not checked.

Usage:
  python3 check_plain.py                 # every file in content/
  python3 check_plain.py content/2-1.json content/2-3.json

Prints one line per hit and exits 1 if there is any hit.
"""
import glob
import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
CONTENT = os.path.join(HERE, "content")

# Top-level keys that are not game body text.
SKIP_TOP = {"debrief", "bookTerm", "bookIdea", "bookSource", "title",
            "worldName", "weekName", "slot", "next", "mechanic", "week", "world"}
# Keys whose values are machine tags, not text.
SKIP_ANY = {"tag", "type", "level", "answer"}

# (pattern, flags, what it means in plain words)
PATTERNS = [
    (r"\b(Parent|Adult|Child)\b", 0, "ego-state label: use the Boss, the Pilot, the Kid"),
    (r"\bEgogram\b", re.I, "use: your voice-print"),
    (r"\bContamination\b", re.I, "use: a leak"),
    (r"\bExclusion\b", re.I, "use: a stuck voice"),
    (r"\bLittle Professor\b", re.I, "use: the Kid's own pilot"),
    (r"\bego states?\b", re.I, "use: the voices (the Boss, the Pilot, the Kid)"),
    (r"\bstrokes?\b", re.I, "use: a nod"),
    (r"\btransactions?\b", re.I, "use: a volley"),
    (r"(?<!this )\bgames?\b", re.I, "use: a trap (the word 'game' is the book term)"),
    (r"\b(pastime|withdrawal|ritual|intimacy|racket|discount|persecutor|rescuer|victim)s?\b",
     re.I, "book term from a later week; use the plain word"),
]
COMPILED = [(re.compile(p, f), note) for p, f, note in PATTERNS]


def strings(value, path, out):
    if isinstance(value, str):
        out.append((path, value))
    elif isinstance(value, dict):
        for key, item in value.items():
            if key in SKIP_ANY:
                continue
            strings(item, path + "." + key, out)
    elif isinstance(value, list):
        for i, item in enumerate(value):
            strings(item, path + "[%d]" % i, out)


def check_file(path):
    game = json.load(open(path, encoding="utf-8"))
    if game.get("week", 99) > 4:
        return []
    body = {k: v for k, v in game.items() if k not in SKIP_TOP}
    found = []
    collected = []
    strings(body, "", collected)
    for where, text in collected:
        for regex, note in COMPILED:
            m = regex.search(text)
            if m:
                a = max(0, m.start() - 45)
                b = min(len(text), m.end() + 45)
                found.append("%s %s [%s] ...%s... (%s)" % (
                    os.path.basename(path), where, m.group(0), text[a:b], note))
    return found


def main(argv):
    files = argv[1:] or sorted(glob.glob(os.path.join(CONTENT, "*.json")))
    total = []
    for f in files:
        total.extend(check_file(f))
    for line in total:
        print(line)
    print("hits: %d" % len(total))
    return 1 if total else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
