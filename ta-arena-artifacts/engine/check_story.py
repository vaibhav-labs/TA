#!/usr/bin/env python3
"""Check the extra stories for one game: python3 engine/check_story.py 1.1

Validates content/stories/<slot>.json with the build rules, runs the plain-words checks on its
text, counts where the right answers sit, and prints the humanize score for the prose."""
import json, os, re, subprocess, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import build  # noqa: E402

TA = os.path.dirname(HERE)
SCORE = ("/root/.claude/skills/synced/89a629a6-4c64-4fa1-a319-a5639eab874f_eb2f363c-fa32-43b6-b969-e43ca702010b/"
         "humanize-writing/scripts/score.js")
BAD = re.compile(r"—|\b(delve|tapestry|landscape|crucial|pivotal|seamless|genuinely|honestly|quietly|truly|deeply)\b"
                 r"|\b(1A|2B)\b|Elara|Lyra|Kael", re.I)


def texts(o, out):
    if isinstance(o, str): out.append(o)
    elif isinstance(o, list):
        for x in o: texts(x, out)
    elif isinstance(o, dict):
        for x in o.values(): texts(x, out)


def main():
    slot = sys.argv[1]
    results = build.load_games(os.path.join(TA, "content"))
    game = next((g for _, g, _ in results if isinstance(g, dict) and g.get("slot") == slot), None)
    probs = next((p for _, g, p in results if isinstance(g, dict) and g.get("slot") == slot), None)
    if game is None:
        print("no such game", slot); sys.exit(2)
    bad = False
    for level, path, msg in probs:
        print(f"{level.upper():8} {path}: {msg}")
        bad = bad or level == "error"
    more = game.get("moreStories") or []
    if not more:
        print("ERROR    no stories found (content/stories/%s.json)" % slot.replace(".", "-")); sys.exit(1)
    ans = []
    for st in more:
        for r in st["rounds"]:
            for it in r["items"]:
                if it.get("type") == "pick": ans.append(it["answer"])
    print("pick answers (index counts):", {i: ans.count(i) for i in sorted(set(ans))})
    allt = []
    texts(more, allt)
    blob = "\n".join(allt)
    for m in BAD.finditer(blob):
        print("BANNED   ", repr(blob[max(0, m.start() - 30):m.end() + 20])); bad = True
    prose = re.sub(r"<[^>]+>", " ", blob)
    tmp = os.path.join(TA, "out", f"prose-{slot.replace('.', '-')}-stories.txt")
    os.makedirs(os.path.dirname(tmp), exist_ok=True)
    open(tmp, "w", encoding="utf-8").write(prose)
    if os.path.exists(SCORE):
        out = subprocess.run(["node", SCORE, tmp], capture_output=True, text=True).stdout
        m = re.search(r"AI-likeness\D*(\d+)", out) or re.search(r"(\d+)\s*/\s*100", out)
        print("humanize score:", m.group(1) if m else out.strip()[:200])
    print("words:", len(prose.split()), "stories:", len(more))
    print("RESULT:", "FAIL" if bad else "ok")
    sys.exit(1 if bad else 0)

main()
