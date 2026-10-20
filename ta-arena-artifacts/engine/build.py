#!/usr/bin/env python3
"""Build the You game pages and the hub.

Usage:
  python3 TA/engine/build.py                    games from TA/content into TA/out
  python3 TA/engine/build.py --content-dir DIR  games from another folder (tests)
  python3 TA/engine/build.py --hub              TA/out/hub.html from hub-template.html and TA/world-intro.json

Options: --out-dir DIR (default TA/out), --nav FILE (default TA/engine/nav.json if it exists),
--intro FILE (default TA/world-intro.json, the world text for the hub).
A game that fails validation is reported and not written. Valid games are still written.
Exit status is 1 when any game or the nav file has an error. Standard library only.
"""

import argparse
import glob
import html
import json
import os
import re
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from emblems import EMBLEMS, icon_vars_css

ENGINE = os.path.dirname(os.path.abspath(__file__))
TA = os.path.dirname(ENGINE)

ALLOWED_TAGS = ("b", "i", "br")
TAG_RE = re.compile(r"<[^<>]*>")
TAG_PARSE_RE = re.compile(r"^<\s*(/?)\s*([A-Za-z][A-Za-z0-9]*)\s*(/?)\s*>$")
SLOT_RE = re.compile(r"^([1-7])\.([1-6]|L[1-9]\d*)$")
LIBRARY_SUB_RE = re.compile(r"^L[1-9]\d*$")
SETTINGS = {"Home & Flatmates", "Work", "Family", "Relationships", "School & College", "Friends & Community"}
LEVELS = ("Spot", "Play", "Analyse")
LEVEL_COUNTS = {"Spot": (3, 5), "Play": (2, 3), "Analyse": (1, 2)}
ITEM_TYPES = ("pick", "scene", "sort", "counter")
LINE_TAGS = ("best", "ok", "game")
GAME_KEYS = ("slot", "title", "world", "worldName", "week", "weekName", "mechanic",
             "concept", "bookTerm", "bookIdea", "bookSource", "opener", "rounds",
             "debrief", "reflection", "next")
DATA_RE = re.compile(r"/\*__TA_DATA__\*/.*?/\*__TA_DATA__\*/", re.S)
NAV_RE = re.compile(r"/\*__TA_NAV__\*/.*?/\*__TA_NAV__\*/", re.S)
TITLE_RE = re.compile(r"<title>.*?</title>", re.S | re.I)


class Problems(list):
    """Collects (level, path, message) for one file."""

    def err(self, path, msg):
        self.append(("error", path, msg))

    def warn(self, path, msg):
        self.append(("warning", path, msg))

    def has_error(self):
        return any(level == "error" for level, _, _ in self)


def is_int(v):
    return isinstance(v, int) and not isinstance(v, bool)


def join(path, key):
    return f"{path}.{key}" if path else key


def need_str(p, obj, key, path, optional=False):
    v = obj.get(key)
    if optional and v is None:
        return
    if not isinstance(v, str) or not v.strip():
        p.err(join(path, key), "must be non-empty text")


def need_int(p, obj, key, path, lo, hi):
    v = obj.get(key)
    if not is_int(v) or not (lo <= v <= hi):
        p.err(join(path, key), f"must be a whole number from {lo} to {hi} (got {v!r})")


# ---------- text rules: markup, dashes, quotes ----------

def check_markup(p, path, s):
    stack = []
    for tag in TAG_RE.findall(s):
        m = TAG_PARSE_RE.match(tag)
        if not m:
            p.err(path, f"malformed tag {tag}")
            continue
        closing, name, self_close = m.group(1) == "/", m.group(2).lower(), m.group(3) == "/"
        if name not in ALLOWED_TAGS:
            p.err(path, f"tag <{name}> is not allowed, use only <b>, <i> and <br>")
        elif name == "br":
            if closing:
                p.err(path, "write <br>, not </br>")
        elif closing:
            if stack and stack[-1] == name:
                stack.pop()
            else:
                p.err(path, f"</{name}> has no matching <{name}>")
        elif self_close:
            p.err(path, f"write <{name}>...</{name}>, not <{name}/>")
        else:
            stack.append(name)
    for name in stack:
        p.err(path, f"<{name}> is never closed")


def check_text(p, path, s):
    check_markup(p, path, s)
    if "\u2014" in s:
        p.err(path, "em dash (U+2014) is not allowed, use a comma, full stop, colon or bracket")
    if "\u2013" in s and not path.endswith("title"):
        p.warn(path, "en dash (U+2013), check it is part of a name and not a number range")
    if '"' in s:
        p.warn(path, 'straight double quote, use curly quotes “ ” instead')


def walk_text(p, path, value):
    if isinstance(value, str):
        check_text(p, path, value)
    elif isinstance(value, dict):
        for k, v in value.items():
            walk_text(p, join(path, k), v)
    elif isinstance(value, list):
        for i, v in enumerate(value):
            walk_text(p, f"{path}[{i}]", v)


# ---------- item checks ----------

def reachable(values, target, tol, max_picks):
    """True if some set of at most max_picks palette lines (each used once) totals target +/- tol."""
    limit = target + tol
    states = {(0, 0)}
    for v in values:
        new = set(states)
        for count, total in states:
            if count < max_picks and total + v <= limit:
                new.add((count + 1, total + v))
        states = new
    return any(count >= 1 and target - tol <= total <= limit for count, total in states)


def check_pick(p, path, it):
    need_str(p, it, "who", path)
    need_str(p, it, "text", path)
    need_str(p, it, "cue", path, optional=True)
    need_str(p, it, "prompt", path, optional=True)
    opts = it.get("options")
    if not isinstance(opts, list) or not (2 <= len(opts) <= 4) or \
            not all(isinstance(o, str) and o.strip() for o in opts):
        p.err(join(path, "options"), "needs 2 to 4 non-empty labels")
        return
    ans = it.get("answer")
    if not is_int(ans) or not (0 <= ans < len(opts)):
        p.err(join(path, "answer"), f"must be an option index from 0 to {len(opts) - 1} (got {ans!r})")
        return
    need_str(p, it, "why", path)
    need_str(p, it, "example", path)
    traps = it.get("traps")
    wrong = [str(i) for i in range(len(opts)) if i != ans]
    if not isinstance(traps, dict):
        p.err(join(path, "traps"), "must be an object keyed by the wrong option indexes")
        return
    for k in wrong:
        if k not in traps:
            p.err(path, f"traps missing key '{k}'")
        elif not isinstance(traps[k], str) or not traps[k].strip():
            p.err(join(path, f"traps.{k}"), "must be non-empty text")
    for k in traps:
        if k not in wrong:
            p.err(path, f"traps has key '{k}', which is not a wrong option index")


def check_scene(p, path, it):
    need_str(p, it, "title", path)
    need_str(p, it, "setting", path)
    need_str(p, it, "example", path, optional=True)
    need_str(p, it, "payoff", path, optional=True)
    meters = it.get("meters")
    sim_ok = True
    if not isinstance(meters, dict):
        p.err(join(path, "meters"), "must be an object with you and them")
        sim_ok = False
    else:
        for who in ("you", "them"):
            need_int(p, meters, who, join(path, "meters"), 0, 100)
        sim_ok = all(is_int(meters.get(w)) and 0 <= meters[w] <= 100 for w in ("you", "them"))
    beats = it.get("beats")
    if not isinstance(beats, list) or not (3 <= len(beats) <= 8):
        p.err(join(path, "beats"), "needs 3 to 8 beats")
        return
    has_game = False
    best_lines = []
    for bi, b in enumerate(beats):
        bp = f"{path}.beats[{bi}]"
        if not isinstance(b, dict):
            p.err(bp, "beat must be an object")
            sim_ok = False
            best_lines.append(None)
            continue
        need_str(p, b, "who", bp)
        need_str(p, b, "text", bp)
        need_str(p, b, "cue", bp, optional=True)
        lines = b.get("lines")
        if not isinstance(lines, list) or not (2 <= len(lines) <= 4):
            p.err(join(bp, "lines"), "needs 2 to 4 lines")
            sim_ok = False
            best_lines.append(None)
            continue
        best = None
        for li, ln in enumerate(lines):
            lp = f"{bp}.lines[{li}]"
            if not isinstance(ln, dict):
                p.err(lp, "line must be an object")
                sim_ok = False
                continue
            need_str(p, ln, "text", lp)
            tag = ln.get("tag")
            if tag not in LINE_TAGS:
                p.err(join(lp, "tag"), f"must be best, ok or game (got {tag!r})")
            if tag == "game":
                has_game = True
            if tag == "best" and best is None:
                best = ln
            for key in ("you", "them"):
                if not is_int(ln.get(key)) or not (-10 <= ln[key] <= 10):
                    p.err(join(lp, key), f"must be a whole number from -10 to 10 (got {ln.get(key)!r})")
                    sim_ok = False
            need_str(p, ln, "outcome", lp)
            need_str(p, ln, "why", lp)
        if best is None:
            p.err(bp, "no line is tagged best")
        best_lines.append(best)
    if has_game and not (isinstance(it.get("payoff"), str) and it["payoff"].strip()):
        p.err(join(path, "payoff"), "required because a line is tagged game")
    fallout = it.get("fallout")
    if fallout is not None:
        if not isinstance(fallout, dict):
            p.err(join(path, "fallout"), "must be an object with you and them")
        else:
            for key in fallout:
                if key not in ("you", "them"):
                    p.err(join(path, "fallout"), f"unknown key '{key}'")
            need_str(p, fallout, "you", join(path, "fallout"), optional=True)
            need_str(p, fallout, "them", join(path, "fallout"), optional=True)
    # The best-only path must reach the end: no meter may hit 0 along it.
    if sim_ok and best_lines and all(b is not None for b in best_lines):
        cur = {"you": meters["you"], "them": meters["them"]}
        for bi, ln in enumerate(best_lines):
            for key in ("you", "them"):
                cur[key] = min(100, max(0, cur[key] + ln[key]))
            dead = [k for k in ("you", "them") if cur[k] <= 0]
            if dead:
                p.err(f"{path}.beats[{bi}]",
                      f"the best-only path drops {dead[0]} to 0 here, so the scene ends early")
                break


def check_sort(p, path, it):
    need_str(p, it, "prompt", path)
    need_str(p, it, "example", path, optional=True)
    order = it.get("order", False)
    if not isinstance(order, bool):
        p.err(join(path, "order"), "must be true or false")
        order = False
    items = it.get("items")
    if not isinstance(items, list) or not items:
        p.err(join(path, "items"), "needs at least one item")
        return
    bins, used = [], set()
    if order:
        if "bins" in it:
            p.warn(join(path, "bins"), "ignored when order is true, remove it")
        if len(items) < 2:
            p.err(join(path, "items"), "an ordering needs at least 2 cards")
    else:
        bins = it.get("bins")
        if not isinstance(bins, list) or not (2 <= len(bins) <= 6) or \
                not all(isinstance(b, str) and b.strip() for b in bins):
            p.err(join(path, "bins"), "needs 2 to 6 non-empty labels")
            return
    for i, c in enumerate(items):
        ip = f"{path}.items[{i}]"
        if not isinstance(c, dict):
            p.err(ip, "card must be an object")
            continue
        need_str(p, c, "text", ip)
        need_str(p, c, "why", ip)
        if not order:
            ans = c.get("answer")
            if is_int(ans) and 0 <= ans < len(bins):
                used.add(ans)
            else:
                p.err(join(ip, "answer"), f"must be a bin index from 0 to {len(bins) - 1} (got {ans!r})")
    if not order:
        for bi, label in enumerate(bins):
            if bi not in used:
                p.warn(join(path, "bins"), f"'{label}' is never the answer")


def check_counter(p, path, it):
    need_str(p, it, "prompt", path)
    for key in ("hitMsg", "underMsg", "overMsg", "why"):
        need_str(p, it, key, path)
    target, tol, max_picks = it.get("target"), it.get("tolerance"), it.get("maxPicks")
    ok_target = is_int(target) and 1 <= target <= 500
    ok_tol = is_int(tol) and 0 <= tol <= 500
    ok_max = is_int(max_picks) and 1 <= max_picks <= 50
    if not ok_target:
        p.err(join(path, "target"), f"must be a whole number from 1 to 500 (got {target!r})")
    if not ok_tol:
        p.err(join(path, "tolerance"), f"must be a whole number from 0 to 500 (got {tol!r})")
    elif ok_target and tol >= target:
        p.err(join(path, "tolerance"), "must be smaller than target")
    if not ok_max:
        p.err(join(path, "maxPicks"), f"must be a whole number from 1 to 50 (got {max_picks!r})")
    pal = it.get("palette")
    if not isinstance(pal, list) or len(pal) < 2:
        p.err(join(path, "palette"), "needs at least 2 lines")
        return
    values = []
    for i, c in enumerate(pal):
        cp = f"{path}.palette[{i}]"
        if not isinstance(c, dict):
            p.err(cp, "line must be an object")
            values = None
            continue
        need_str(p, c, "text", cp)
        need_str(p, c, "tag", cp, optional=True)
        v = c.get("value")
        if is_int(v) and 1 <= v <= 50:
            if values is not None:
                values.append(v)
        else:
            p.err(join(cp, "value"), f"must be a whole number from 1 to 50 (got {v!r})")
            values = None
    if values is not None and ok_target and ok_tol and ok_max and tol < target:
        if not reachable(values, target, tol, max_picks):
            p.err(path, f"target {target} is not reachable: no set of up to {max_picks} "
                        f"palette lines totals {target - tol} to {target + tol}")


def check_item(p, path, it):
    if not isinstance(it, dict):
        p.err(path, "item must be an object")
        return
    kind = it.get("type")
    if kind not in ITEM_TYPES:
        p.err(path, f"unknown type {kind!r}, use pick, scene, sort or counter")
        return
    path = f"{path} ({kind})"
    {"pick": check_pick, "scene": check_scene, "sort": check_sort, "counter": check_counter}[kind](p, path, it)


# ---------- game checks ----------

def expected_next(m):
    """None means slot.next must be null: either 7.6 (the last campaign game) or a
    library bonus slot (an "N.Lk" id), which sits outside the 1->42 chain entirely."""
    if LIBRARY_SUB_RE.match(m.group(2)):
        return None
    w, n = int(m.group(1)), int(m.group(2))
    if (w, n) == (7, 6):
        return None
    return f"{w}.{n + 1}" if n < 6 else f"{w + 1}.1"


def validate_game(g, p):
    if not isinstance(g, dict):
        p.err("", "the file must hold one JSON object")
        return
    for key in GAME_KEYS:
        if key not in g:
            p.err(key, "missing key")
    walk_text(p, "", g)

    slot = g.get("slot")
    m = SLOT_RE.match(slot) if isinstance(slot, str) else None
    if not m:
        p.err("slot", f"must look like '1.1' or a library bonus id like '1.L1' (got {slot!r})")
    else:
        is_library = bool(LIBRARY_SUB_RE.match(m.group(2)))
        if g.get("world") != int(m.group(1)):
            p.err("world", f"must be {m.group(1)} to match slot {slot}")
        want = expected_next(m)
        if want is None and g.get("next") is not None:
            reason = "library bonus games sit outside the chain" if is_library else "7.6 is the last game"
            p.err("next", f"must be null, because {reason}")
        elif want is not None and g.get("next") != want:
            p.err("next", f"must be {want!r} (the next slot in order), got {g.get('next')!r}")
        if is_library:
            need_str(p, g, "setting", "")
            if isinstance(g.get("setting"), str) and g["setting"] not in SETTINGS:
                p.err("setting", f"must be one of {sorted(SETTINGS)}, got {g['setting']!r}")
    for key in ("title", "worldName", "weekName", "mechanic", "concept",
                "bookTerm", "bookIdea", "bookSource"):
        need_str(p, g, key, "")
    for key, lo, hi in (("world", 1, 7), ("week", 1, 7)):
        need_int(p, g, key, "", lo, hi)

    op = g.get("opener")
    if not isinstance(op, dict):
        p.err("opener", "must be an object")
    else:
        need_str(p, op, "setting", "opener")
        need_str(p, op, "ask", "opener")
        lines = op.get("lines")
        if not isinstance(lines, list) or not lines:
            p.err("opener.lines", "needs at least one line")
        else:
            for i, ln in enumerate(lines):
                lp = f"opener.lines[{i}]"
                if not isinstance(ln, dict):
                    p.err(lp, "line must be an object")
                    continue
                need_str(p, ln, "who", lp)
                need_str(p, ln, "text", lp)
                need_str(p, ln, "cue", lp, optional=True)

    rounds = g.get("rounds")
    if not isinstance(rounds, list) or len(rounds) != 3:
        p.err("rounds", "must hold exactly 3 rounds, in the order Spot, Play, Analyse")
        rounds = []
    for i, rnd in enumerate(rounds):
        rp = f"rounds[{i}]"
        if not isinstance(rnd, dict):
            p.err(rp, "round must be an object")
            continue
        lvl = LEVELS[i]
        if rnd.get("level") != lvl:
            p.err(join(rp, "level"), f"must be {lvl!r} (got {rnd.get('level')!r})")
        need_str(p, rnd, "label", rp)
        need_str(p, rnd, "intro", rp, optional=True)
        items = rnd.get("items")
        if not isinstance(items, list) or not items:
            p.err(join(rp, "items"), "needs at least one item")
            continue
        lo, hi = LEVEL_COUNTS[lvl]
        if not lo <= len(items) <= hi:
            p.warn(join(rp, "items"), f"{lvl} has {len(items)} items, the brief asks for {lo} to {hi}")
        for j, it in enumerate(items):
            check_item(p, f"{rp}.items[{j}]", it)

    deb = g.get("debrief")
    if not isinstance(deb, dict):
        p.err("debrief", "must be an object")
    else:
        for key in ("nadia", "bookTerm", "bookNote"):
            need_str(p, deb, key, "debrief")
        if deb.get("bookTerm") != g.get("bookTerm"):
            p.warn("debrief.bookTerm", "differs from the game bookTerm")

    refl = g.get("reflection")
    if not isinstance(refl, dict):
        p.err("reflection", "must be an object")
    else:
        need_str(p, refl, "prompt", "reflection")


def load_games(content_dir):
    """Return a list of (file name, game or None, Problems) for every JSON file in content_dir."""
    results = []
    for path in sorted(glob.glob(os.path.join(content_dir, "*.json"))):
        fname = os.path.basename(path)
        p = Problems()
        try:
            with open(path, encoding="utf-8") as fh:
                game = json.load(fh)
        except (OSError, ValueError) as exc:
            p.err("", f"cannot read as JSON: {exc}")
            results.append((fname, None, p))
            continue
        validate_game(game, p)
        results.append((fname, game, p))
    seen = {}
    for fname, game, p in results:
        slot = game.get("slot") if isinstance(game, dict) else None
        if isinstance(slot, str):
            if slot in seen:
                p.err("slot", f"duplicate slot {slot}, also in {seen[slot]}")
            else:
                seen[slot] = fname
    return results


def report(fname, p):
    for level, path, msg in p:
        where = f"{fname}: {path}" if path else fname
        print(f"{level.upper():8} {where}: {msg}")


# ---------- nav ----------

def load_nav(path):
    nav = {"hub": None, "slots": {}}
    p = Problems()
    if not os.path.exists(path):
        return nav, p
    try:
        with open(path, encoding="utf-8") as fh:
            data = json.load(fh)
    except (OSError, ValueError) as exc:
        p.err("", f"cannot read as JSON: {exc}")
        return nav, p
    if not isinstance(data, dict):
        p.err("", "nav must be a JSON object")
        return nav, p
    hub = data.get("hub")
    if hub is not None and (not isinstance(hub, str) or not hub.strip()):
        p.err("hub", "must be a URL string or null")
    else:
        nav["hub"] = hub or None
    slots = data.get("slots", {})
    if not isinstance(slots, dict):
        p.err("slots", "must be an object keyed by slot")
        return nav, p
    for slot, entry in slots.items():
        sp = f"slots.{slot}"
        if not SLOT_RE.match(slot):
            p.err(sp, "key must be a slot such as 1.1")
            continue
        if not isinstance(entry, dict):
            p.err(sp, "must be an object with title and url")
            continue
        title, url = entry.get("title"), entry.get("url")
        if title is not None and (not isinstance(title, str) or not title.strip()):
            p.err(f"{sp}.title", "must be text or null")
        if url is not None and (not isinstance(url, str) or not url.strip()):
            p.err(f"{sp}.url", "must be a URL string or null")
        nav["slots"][slot] = {"title": title or None, "url": url or None}
    return nav, p


def next_entry(game, nav, titles):
    """The next block for TA_NAV: slot, title (from nav, else content) and url (from nav)."""
    slot = game.get("next")
    if not slot:
        return None
    entry = nav["slots"].get(slot, {})
    return {"slot": slot,
            "title": entry.get("title") or titles.get(slot),
            "url": entry.get("url")}


# ---------- page output ----------

def safe_json(obj):
    """JSON safe to place inside a <script> element."""
    text = json.dumps(obj, ensure_ascii=True, separators=(",", ":"))
    return text.replace("</", "<\\/").replace("<!--", "<\\u0021--")


def strip_tags(s):
    return re.sub(r"<[^<>]*>", "", s)


def fill_template(template, game, nav_obj):
    page = DATA_RE.sub(lambda m: safe_json(game), template, count=1)
    page = NAV_RE.sub(lambda m: safe_json(nav_obj), page, count=1)
    title = html.escape(strip_tags(game["title"])) + " · You"
    page = TITLE_RE.sub(lambda m: f"<title>{title}</title>", page, count=1)
    return page


def check_template(template):
    problems = []
    for name, rx in (("TA_DATA", DATA_RE), ("TA_NAV", NAV_RE)):
        if len(rx.findall(template)) != 1:
            problems.append(f"template.html must contain the /*__{name}__*/ placeholder exactly once")
    if len(TITLE_RE.findall(template)) != 1:
        problems.append("template.html must contain one <title> element")
    return problems


def build_games(args, nav):
    template_path = os.path.join(ENGINE, "template.html")
    with open(template_path, encoding="utf-8") as fh:
        template = fh.read()
    for msg in check_template(template):
        print(f"ERROR    template.html: {msg}")
        return 1
    results = load_games(args.content_dir)
    if not results:
        print(f"no .json files in {args.content_dir}")
    titles = {}
    for _, game, _ in results:
        if isinstance(game, dict) and isinstance(game.get("slot"), str):
            titles.setdefault(game["slot"], game.get("title"))
    failed = any(p.has_error() for _, _, p in results)
    os.makedirs(args.out_dir, exist_ok=True)
    for fname, game, p in results:
        report(fname, p)
        if p.has_error():
            print(f"skipped  {fname}: {sum(1 for x in p if x[0] == 'error')} error(s), not written")
            continue
        nav_obj = {"hub": nav["hub"], "next": next_entry(game, nav, titles)}
        out = os.path.join(args.out_dir, game["slot"].replace(".", "-") + ".html")
        with open(out, "w", encoding="utf-8") as fh:
            fh.write(fill_template(template, game, nav_obj))
        print(f"wrote    {out}")
    return 1 if failed else 0


# ---------- hub ----------

# World text (name, week name, intro, why, can, boss) comes from world-intro.json in the
# working folder, not from this file. The hub needs all seven worlds, so a missing or
# empty field is an error.
INTRO_PATH = os.path.join(TA, "world-intro.json")
WORLD_FIELDS = ("name", "weekName", "intro", "why", "can", "boss")
WORLD_NUMBERS = range(1, 8)


def load_intro(path):
    """Return ({n: world dict}, Problems) for worlds 1 to 7."""
    p = Problems()
    try:
        with open(path, encoding="utf-8") as fh:
            data = json.load(fh)
    except (OSError, ValueError) as exc:
        p.err("", f"cannot read as JSON: {exc}")
        return {}, p
    if not isinstance(data, dict):
        p.err("", "must be a JSON object keyed by world number 1 to 7")
        return {}, p
    for key in data:
        if key not in [str(n) for n in WORLD_NUMBERS]:
            p.err(key, "unknown world, keys must be 1 to 7")
    worlds = {}
    for n in WORLD_NUMBERS:
        key = str(n)
        w = data.get(key)
        if not isinstance(w, dict):
            p.err(key, "missing world entry")
            continue
        for field in WORLD_FIELDS:
            need_str(p, w, field, key)
        walk_text(p, key, w)
        worlds[n] = w
    return worlds, p


SMART_DQ_OPEN = re.compile(r'(^|[\s(\[])"')
SMART_SQ_OPEN = re.compile(r"(^|[\s(\[])'")


def smart(s):
    """Curly quotes for the hub text. Straight quotes are kept in the source files."""
    s = SMART_DQ_OPEN.sub(lambda m: m.group(1) + "“", s).replace('"', "”")
    s = SMART_SQ_OPEN.sub(lambda m: m.group(1) + "‘", s).replace("'", "’")
    return s


def plain(s):
    if not isinstance(s, str):
        return ""
    return html.escape(smart(strip_tags(s).strip()))


def split_boss(boss):
    """Split 'Name: rest' so the name can be shown in bold. Returns (name, rest)."""
    name, sep, rest = boss.partition(":")
    return (name.strip(), rest.strip()) if sep else ("", boss.strip())


def safe_url(u):
    return u if isinstance(u, str) and re.match(r"^https?://", u) else None


BOSS_SLOT = 6  # the sixth game in each world is the final challenge
ARROW = ('<svg class="arrow" viewBox="0 0 20 30" aria-hidden="true" focusable="false">'
         '<path d="M10 1v23M3.5 17.5 10 24l6.5-6.5"/></svg>')
LEADS = f'<div class="leads"><span>leads to</span>{ARROW}</div>'


def chip_html(slot, games, nav, library=False):
    """One game chip: slot number (or an Extra tag for a library bonus game), title (the
    link text), the Boss/Extra label or Opening soon, and a data-setting attribute used by
    the per-world setting filter."""
    g = games.get(slot, {})
    entry = nav["slots"].get(slot, {})
    title = g.get("title") or entry.get("title") or f"Game {slot}"
    url = safe_url(entry.get("url"))
    is_boss = (not library) and slot.endswith(f".{BOSS_SLOT}")
    tag = '<span class="boss-tag">Boss</span>' if is_boss else ('<span class="lib-tag">Extra</span>' if library else "")
    cls = "chip boss" if is_boss else ("chip lib" if library else "chip")
    setting = g.get("setting")
    set_attr = f' data-setting="{html.escape(setting, quote=True)}"' if isinstance(setting, str) and setting else ""
    if url:
        link = f'<a href="{html.escape(url, quote=True)}">{plain(title)}</a>'
        state = ""
    else:
        cls += " soon"
        link = f'<span class="gtitle" role="link" aria-disabled="true">{plain(title)}</span>'
        state = '<span class="state">Opening soon</span>'
    label = "Extra" if library else slot
    return f'<li class="{cls}"{set_attr}><span class="slot">{label}</span>{link}{tag}{state}</li>'


def library_slots_for(n, games):
    """Library bonus slots for world n (ids like '1.L1'), in authored order."""
    pat = re.compile(rf"^{n}\.L(\d+)$")
    found = [(int(pat.match(s).group(1)), s) for s in games if pat.match(s)]
    return [s for _, s in sorted(found)]


def world_html(n, w, games, nav):
    campaign_slots = [f"{n}.{k}" for k in range(1, 7)]
    lib_slots = library_slots_for(n, games)
    all_slots = campaign_slots + lib_slots
    chips = "\n    ".join(chip_html(s, games, nav, library=(s in lib_slots)) for s in all_slots)
    settings_present = sorted({games[s]["setting"] for s in all_slots
                                if isinstance(games.get(s, {}).get("setting"), str)})
    filter_html = ""
    if settings_present:
        buttons = ['<button type="button" class="setfil active" data-set="">All</button>']
        buttons += [f'<button type="button" class="setfil" data-set="{html.escape(s, quote=True)}">{plain(s)}</button>'
                    for s in settings_present]
        filter_html = f'  <div class="setfilters" role="group" aria-label="Filter by setting">{"".join(buttons)}</div>\n'
    name, rest = split_boss(w["boss"])
    boss = f"<strong>{plain(name)}</strong>: {plain(rest)}" if name else plain(w["boss"])
    prev_a = (f'<a class="prev" href="#world-{n-1}">← {plain(INTRO_NAMES[n-1])}</a>' if n > 1
              else '<a class="prev" href="#home">← The map</a>')
    next_a = (f'<a class="next" href="#world-{n+1}">{plain(INTRO_NAMES[n+1])} →</a>' if n < 7
              else '<a class="next" href="#home">Back to the map</a>')
    return (
        f'<section class="card world" id="world-{n}" aria-labelledby="world-{n}-title" hidden>\n'
        f'  <a class="back" href="#home">The map</a>\n'
        f'  <p class="kicker">World {n} of 7</p>\n'
        f'  <div class="head"><span class="emb-wrap">{EMBLEMS[n]}</span><h2 id="world-{n}-title">{plain(w["name"])}</h2></div>\n'
        f'  <p class="intro">{plain(w["intro"])}</p>\n'
        f'  <div class="box"><span class="label">Why it comes here</span>{plain(w["why"])}</div>\n'
        f'  <div class="box"><span class="label">After this world you can</span>{plain(w["can"])}.</div>\n'
        f'  <p class="boss-line">Final challenge: {boss}</p>\n'
        f'{filter_html}'
        f'  <ol class="chips">\n    {chips}\n  </ol>\n'
        f'  <nav class="worldnav" aria-label="Worlds">{prev_a}{next_a}</nav>\n'
        "</section>")


INTRO_NAMES = {}
PERSON = ('<svg viewBox="0 0 64 64" aria-hidden="true" focusable="false" fill="none" stroke="#fffc00" '
          'stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round">'
          '<circle cx="32" cy="21" r="9"/><path d="M13 54c1-12 9-18 19-18s18 6 19 18"/></svg>')


def map_html(intro):
    """Seven worlds on a ring around a person, clockwise from the top. Each node opens its world."""
    import math
    cx, cy, rx, ry, H = 50.0, 66.0, 36.0, 43.0, 130.0
    pts = []
    for i in range(7):
        a = math.radians(-90 + i * 360 / 7)
        pts.append((cx + rx * math.cos(a), cy + ry * math.sin(a)))
    spokes = "".join(f'<line class="spoke" x1="{cx}" y1="{cy}" x2="{x:.2f}" y2="{y:.2f}"/>' for x, y in pts)
    svg = (f'<svg class="ring" viewBox="0 0 100 130" aria-hidden="true" focusable="false">{spokes}'
           f'<ellipse class="loop" cx="{cx}" cy="{cy}" rx="{rx}" ry="{ry}"/></svg>')
    nodes = []
    for n, (x, y) in zip(WORLD_NUMBERS, pts):
        start = '<span class="start">Start here</span>' if n == 1 else ""
        nodes.append(
            f'<a class="node" id="node-{n}" href="#world-{n}" style="--x:{x:.2f}%;--y:{y / H * 100:.2f}%" '
            f'aria-label="World {n}: {html.escape(plain(intro[n]["name"]))}">'
            f'<span class="disc"><span class="emb-wrap">{EMBLEMS[n]}</span></span>'
            f'<span class="num">{n}</span>{start}<span class="nm">{plain(intro[n]["name"])}</span></a>')
    colours = "".join(f'#node-{n} {{ --wc: {c}; }}' for n, c in zip(WORLD_NUMBERS, WORLD_COLOURS))
    return (f'<style>{colours}</style>\n<div class="orbit" style="--cy:{cy / H * 100:.2f}%">{svg}'
            f'<div class="you" aria-hidden="true">{PERSON}<span>You</span></div>\n' + "\n".join(nodes) + "</div>")


WORLD_COLOURS = ["#ff9500", "#00e5ff", "#a855f7", "#f43f5e", "#06b6d4", "#10b981", "#f59e0b"]


def worlds_html(games, nav, intro):
    css = "<style>" + "".join(f"#world-{n} {{ --wc: {c}; }}" for n, c in zip(WORLD_NUMBERS, WORLD_COLOURS)) + "</style>\n"
    return css + "\n".join(world_html(n, intro[n], games, nav) for n in WORLD_NUMBERS)


def build_hub(args, nav):
    hub_path = os.path.join(ENGINE, "hub-template.html")
    with open(hub_path, encoding="utf-8") as fh:
        template = fh.read()
    for marker in ("<!--TA_MAP-->", "<!--TA_WORLDS-->", "/*__ICON_VARS__*/"):
        if template.count(marker) != 1:
            print(f"ERROR    hub-template.html: needs exactly one {marker} marker")
            return 1
    intro, intro_p = load_intro(args.intro)
    INTRO_NAMES.update({n: w["name"] for n, w in intro.items()})
    report(os.path.basename(args.intro), intro_p)
    if intro_p.has_error():
        print(f"skipped  hub.html: {os.path.basename(args.intro)} has errors, not written")
        return 1
    failed = False
    games = {}
    for fname, game, p in load_games(args.content_dir):
        report(fname, p)
        failed = failed or p.has_error()
        if isinstance(game, dict) and isinstance(game.get("slot"), str):
            games.setdefault(game["slot"], game)
    # Consistency notes only (they do not stop the build): content names versus world-intro names.
    for n in WORLD_NUMBERS:
        for k in range(1, 7):
            if f"{n}.{k}" not in games:
                print(f"WARNING  {n}.{k}: no content file, the chip shows a placeholder title")
    mismatch = {}
    for slot, game in sorted(games.items()):
        wn = game.get("worldName")
        if SLOT_RE.match(slot) and isinstance(wn, str):
            n = int(slot.split(".")[0])
            if wn != intro[n]["name"]:
                mismatch.setdefault(n, wn)
    for n, wn in sorted(mismatch.items()):
        print(f"WARNING  world {n}: content worldName {wn!r} differs from world-intro.json name "
              f"{intro[n]['name']!r}, the hub uses the world-intro name")
    page = (template.replace("<!--TA_MAP-->", map_html(intro))
                    .replace("/*__ICON_VARS__*/", icon_vars_css())
                    .replace("<!--TA_WORLDS-->", worlds_html(games, nav, intro)))
    os.makedirs(args.out_dir, exist_ok=True)
    out = os.path.join(args.out_dir, "hub.html")
    with open(out, "w", encoding="utf-8") as fh:
        fh.write(page)
    print(f"wrote    {out}")
    return 1 if failed else 0


def main(argv=None):
    ap = argparse.ArgumentParser(description="Build You pages.")
    ap.add_argument("--content-dir", default=os.path.join(TA, "content"))
    ap.add_argument("--out-dir", default=os.path.join(TA, "out"))
    ap.add_argument("--nav", default=os.path.join(ENGINE, "nav.json"))
    ap.add_argument("--intro", default=INTRO_PATH, help="world text for the hub (default world-intro.json)")
    ap.add_argument("--hub", action="store_true", help="build hub.html instead of game pages")
    args = ap.parse_args(argv)
    nav, nav_p = load_nav(args.nav)
    report("nav.json", nav_p)
    nav_failed = nav_p.has_error()
    if args.hub:
        status = build_hub(args, nav)
    else:
        status = build_games(args, nav)
    return 1 if (status or nav_failed) else 0


if __name__ == "__main__":
    sys.exit(main())
