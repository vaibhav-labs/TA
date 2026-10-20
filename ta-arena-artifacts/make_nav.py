import json, glob, os, sys
HUB = "https://claude.ai/artifact/FzdEytVBojsBteGVMXXV4K"
# slot: (artifact title as listed, existing artifact URL)
ART = {
 "1-1": ("A Day With No Hellos", "https://claude.ai/artifact/GchqGmxabuBvvig2uWewn1"),
 "1-2": ("Sort the Nods", "https://claude.ai/artifact/2FG67GodMyXHnVkSLgX6F1"),
 "1-3": ("How Many Hellos?", "https://claude.ai/artifact/FQZTE26Tetb3Cqe7pBztVU"),
 "1-4": ("Small Talk or Real Talk", "https://claude.ai/artifact/PvVDedNSfj1X7PLJHdeJJr"),
 "1-5": ("Match the Table", "https://claude.ai/artifact/DTmRPSymTnbjSLs7LSwg6H"),
 "1-6": ("Break the Nod Rules", "https://claude.ai/artifact/W6MRqhzsHbP4sTJ8Nqirp2"),
 "2-1": ("Which Voice Is That?", "https://claude.ai/artifact/NHi7rFVjpwWgTUGCFLdcfJ"),
 "2-2": ("Five Faces of a Voice", "https://claude.ai/artifact/TgGgALj5WQgSvbU1YQcrMd"),
 "2-3": ("Your Voice Bars", "https://claude.ai/artifact/GDViWJ3SgtLWcASu7hCDtL"),
 "2-4": ("Four Ways to Check", "https://claude.ai/artifact/3c6qN2P5rn7JP6dEPuLptv"),
 "2-5": ("How a Child Learns a Trap", "https://claude.ai/artifact/3SZLhBJuzD2UqneYgNbf94"),
 "2-6": ("When Facts Get Muddied", "https://claude.ai/artifact/5FsXiRoMRB4anxTPuHmMa4"),
 "3-1": ("Draw the Arrow", "https://claude.ai/artifact/8nEQcyqpxd1UpWwRsnpXjV"),
 "3-2": ("Keep It Going", "https://claude.ai/artifact/Bq2wTtJbNR58JADVMzx4p6"),
 "3-3": ("Step Out of the Whine", "https://claude.ai/artifact/5JmSViMCTnndnUwR8s8ZAj"),
 "3-4": ("Replay the Call", "https://claude.ai/artifact/JxFsmUfmYHHSfLgvhnqkHu"),
 "3-5": ("Two Chats at Once", "https://claude.ai/artifact/UVN6pxYARCV84hSNzvFQTn"),
 "3-6": ("The Friendly Sales Line", "https://claude.ai/artifact/FpRyhcmjZ7AJwNxvXrwack"),
 "4-1": ("Trap or Just Talk?", "https://claude.ai/artifact/P5Musr4vb1yGbVUwtRftbk"),
 "4-2": ("Six Steps of a Trap", "https://claude.ai/artifact/7cTckACt6F8SNPuVgaBYDU"),
 "4-3": ("Traps That Last Years", "https://claude.ai/artifact/GZFLfTyw2M8TBA1GVgt4Xb"),
 "4-4": ("Traps at Home", "https://claude.ai/artifact/NpMzNHMxHxAeLB615QKBBX"),
 "4-5": ("Traps in the Room", "https://claude.ai/artifact/CiZTLP1gdtjsKkXr7uuvrk"),
 "4-6": ("The Yes-But Loop", "https://claude.ai/artifact/33B9mjWmYM2HqhaNhfmoL9"),
 "5-1": ("Real Feeling or Stand-In?", "https://claude.ai/artifact/U2PuUcjP1ZoFZFpHQrFNQm"),
 "5-2": ("Collecting Grudges", "https://claude.ai/artifact/Han4DXPaRMHX5fE2FXai9J"),
 "5-3": ("Shrinking the Problem", "https://claude.ai/artifact/XFTvLmBDuQ6zuY3Wwp5N8u"),
 "5-4": ("Four Ways to Do Nothing", "https://claude.ai/artifact/5SEWcMFkZqqcPGTiDWLJ8T"),
 "5-5": ("Two Halves of a Pair", "https://claude.ai/artifact/MZ84ez7MSZVgrUGML58jVF"),
 "5-6": ("Kind but Stuck", "https://claude.ai/artifact/BYTUPGB8c7aFFCU4JBJeFj"),
 "6-1": ("Four Corners of OK", "https://claude.ai/artifact/5eAxqr1fS5RN7aLnxkVjdV"),
 "6-2": ("Hear the Hidden Must", "https://claude.ai/artifact/3ckXKZfxfkrm5q1SAyGrqW"),
 "6-3": ("A Child's Hidden No", "https://claude.ai/artifact/Brhq7keSkDpZQM8AnkfkT5"),
 "6-4": ("Three Everyday Plans", "https://claude.ai/artifact/8yPoVaZnJyJqeeygNaEER8"),
 "6-5": ("Shape of a Life Story", "https://claude.ai/artifact/3k5L13vbHQbjDEWwa3m6YV"),
 "6-6": ("The Plan Board", "https://claude.ai/artifact/6ohNLgWTiVsxZKktMYnqJR"),
 "7-1": ("Help or Rescue", "https://claude.ai/artifact/Fq1W1u5y6FYvjQ7Rg2AczR"),
 "7-2": ("A Deal That Holds", "https://claude.ai/artifact/A4qJnVuGrgm46BSSVW4rXE"),
 "7-3": ("Green Light, Safety Net", "https://claude.ai/artifact/RgmJcyETexdoYozhtgrAJv"),
 "7-4": ("Stay Steady Under Pressure", "https://claude.ai/artifact/1MRVBfvZaDLPVqkX8TW4W1"),
 "7-5": ("Choose Your Own Move", "https://claude.ai/artifact/Xa8N3tZ8C3rvb1vkPgNETz"),
 "7-6": ("Keep It Real for Six Turns", "https://claude.ai/artifact/DNdVvbWSwdGBpAPTavJQuF"),
}
content = {}
for p in glob.glob("content/*.json"):
    g = json.load(open(p, encoding="utf-8"))
    content[os.path.basename(p)[:-5]] = g
problems = []
if len(ART) != 42 or set(ART) != set(content):
    problems.append(f"slot sets differ: art={len(ART)} content={len(content)}")
urls = [u for _, u in ART.values()]
if len(set(urls)) != len(urls):
    problems.append("duplicate URLs in mapping")
if HUB in urls:
    problems.append("hub URL reused as a game URL")
slots = {}
for key in sorted(ART, key=lambda k: [int(x) for x in k.split("-")]):
    title, url = ART[key]
    g = content[key]
    if g.get("title") != title:
        problems.append(f"title mismatch {key}: content={g.get('title')!r} artifact={title!r}")
    if not url.startswith("https://claude.ai/artifact/") or len(url.rsplit("/", 1)[-1]) != 22:
        problems.append(f"odd URL {key}: {url}")
    slots[key.replace("-", ".")] = {"title": title, "url": url}
if problems:
    print("\n".join(problems))
    sys.exit(1)
nav = {"hub": HUB, "slots": slots}
with open("engine/nav.json", "w", encoding="utf-8") as fh:
    json.dump(nav, fh, ensure_ascii=False, indent=2)
    fh.write("\n")
print(f"wrote engine/nav.json with {len(slots)} slots, all titles matched content")
