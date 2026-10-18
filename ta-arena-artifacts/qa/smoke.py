#!/usr/bin/env python3
"""Smoke test for the TA Arena pages in out/ at a 390 x 844 phone viewport.

For each slot, two fresh playthroughs run one after the other in one Chromium:

  Run A (trap probe): right answers up to the first pick item, then one wrong option.
        Checks the trap explanation, presses Continue and checks that the next screen
        renders. Then stops.
  Run B (full game): right answer for every pick, best line for every scene beat (a game
        line once, in one scene), correct bins, correct order, counter inside the target
        band. Checks the debrief bookTerm and reaches "Case closed".

Every screen is checked for placeholder text, raw tags, escaped entities and horizontal
scroll. Results go to qa/results.json (one entry per slot).

Usage: python3 qa/smoke.py [slot ...]     (default: all 42 slots)

The game data is read from window.TA_GAME. The engine keeps its GAME variable inside a
closure, so page.evaluate("GAME") does not reach it on these pages.
"""
import html
import itertools
import json
import re
import sys
import time
from pathlib import Path

from playwright.sync_api import Error as PWError, sync_playwright

HERE = Path(__file__).resolve().parent
OUT_DIR = HERE.parent / "out"
RESULTS = HERE / "results.json"
CHROMIUM = "/opt/pw-browsers/chromium"
VIEWPORT = {"width": 390, "height": 844}
ALL_SLOTS = [f"{w}-{g}" for w in range(1, 8) for g in range(1, 7)]
STEP_MS = 6000
CONTINUE = "#card .nextbar button.next"
EXTERNAL_HOSTS = ("fonts.googleapis.com", "fonts.gstatic.com")
FORBIDDEN = [
    ("undefined", re.compile(r"undefined", re.I)),
    ("NaN", re.compile(r"\bNaN\b")),
    ("[object Object]", re.compile(r"\[object Object\]", re.I)),
    ("raw tag", re.compile(r"</?[a-zA-Z][a-zA-Z0-9]*\b[^<>]{0,60}>")),
    ("&amp;", re.compile(r"&amp;")),
    ("&lt;", re.compile(r"&lt;")),
    ("&gt;", re.compile(r"&gt;")),
]
SCREEN_JS = """() => ({
  text: document.body.innerText || "",
  sw: document.documentElement.scrollWidth,
  iw: window.innerWidth,
  cw: document.documentElement.clientWidth
})"""


class Stop(Exception):
    """A step could not be completed. The run ends and the page fails."""


def norm(s):
    return re.sub(r"\s+", " ", s or "").strip()


def plain(s):
    """Content text as a reader sees it: <b>, <i> and <br> removed, entities decoded."""
    s = re.sub(r"<\s*br\s*/?\s*>", " ", s or "", flags=re.I)
    s = re.sub(r"</?\s*[bi]\s*>", "", s, flags=re.I)
    return norm(html.unescape(s))


def flatten(game):
    return [it for rnd in game.get("rounds") or [] for it in rnd.get("items") or []]


def has_game_line(item):
    return any(ln.get("tag") == "game" for beat in item.get("beats") or [] for ln in beat.get("lines") or [])


def label_of(item, k):
    raw = item.get("title") or item.get("prompt") or item.get("text") or ""
    kind = item.get("type") + ("-order" if item.get("order") is True else "")
    return f"item {k + 1} ({kind}: {plain(raw)[:45]})"


def pick_subset(palette, target, tol, max_picks):
    """Smallest set of palette indices whose values land inside target +/- tol."""
    for k in range(1, min(max_picks, len(palette)) + 1):
        for combo in itertools.combinations(range(len(palette)), k):
            total = sum(palette[i]["value"] for i in combo)
            if abs(total - target) <= tol:
                return list(combo), total
    return None, None


def sel_choice(i):
    return f"#card button.choice[data-i='{i}']"


def sel_pal(i):
    return f"#card button.pal[data-i='{i}']"


def sel_pool(i):
    return f"#card .pool button.choice[data-i='{i}']"


class Run:
    """One fresh page load in its own browser context, driven by the page's own DOM."""

    def __init__(self, browser, url, tag):
        self.tag = tag
        self.ctx = browser.new_context(viewport=VIEWPORT, is_mobile=True, has_touch=True, device_scale_factor=2)
        self.page = self.ctx.new_page()
        self.page.set_default_timeout(STEP_MS)
        self.url = url
        self.problems, self.seen = [], set()
        self.console, self.external, self.page_errors, self.network = [], [], [], []
        self.game = None
        self.trap = None
        self.game_probe = None
        self.book_shown = False
        self.reached_end = False
        self.page.on("console", self._on_console)
        self.page.on("pageerror", lambda err: self.page_errors.append(str(err)))
        self.page.on("requestfailed", lambda req: self.network.append(f"{req.url} {req.failure or ''}".strip()))

    def _on_console(self, msg):
        if msg.type != "error":
            return
        src = (msg.location or {}).get("url", "")
        if any(h in src or h in msg.text for h in EXTERNAL_HOSTS):
            self.external.append(msg.text)
        else:
            self.console.append(f"{msg.text} ({src})" if src else msg.text)

    def problem(self, msg):
        self.problems.append(f"[{self.tag}] {msg}")

    def close(self):
        self.ctx.close()

    # ---- helpers ----

    def wait(self, selector, what, state="visible"):
        try:
            self.page.locator(selector).first.wait_for(state=state)
        except PWError:
            raise Stop(f"{what} not found ({selector})")

    def click(self, selector, what):
        try:
            self.page.locator(selector).first.click()
        except PWError as e:
            raise Stop(f"could not click {what} ({selector}): {str(e).splitlines()[0]}")

    def check(self, where):
        """Visible-text and horizontal-scroll checks for the current screen."""
        info = self.page.evaluate(SCREEN_JS)
        for token, rx in FORBIDDEN:
            m = rx.search(info["text"])
            if m:
                snippet = norm(info["text"][max(0, m.start() - 40): m.end() + 40])
                key = (token, snippet)
                if key not in self.seen:
                    self.seen.add(key)
                    self.problem(f'{where}: visible text contains "{token}" near "{snippet}"')
        # On mobile emulation innerWidth grows when a page overflows (the view zooms out),
        # so the limit is the 390px viewport itself, never innerWidth alone.
        limit = min(info["iw"], info["cw"], VIEWPORT["width"])
        if info["sw"] > limit + 1:
            key = ("scroll", info["sw"], limit)
            if key not in self.seen:
                self.seen.add(key)
                self.problem(f"{where}: horizontal scroll at 390px "
                             f"(scrollWidth {info['sw']}, viewport {limit})")

    # ---- flow ----

    def start(self):
        try:
            self.page.goto(self.url, wait_until="load", timeout=30000)
        except PWError as e:
            raise Stop(f"page did not load: {str(e).splitlines()[0]}")
        self.game = self.page.evaluate("() => window.TA_GAME")
        if not self.game or not self.game.get("rounds"):
            raise Stop("window.TA_GAME is missing or has no rounds")
        self.wait(CONTINUE, "intro Start button")
        self.check("intro")
        self.click(CONTINUE, "intro Start button")

    def play(self, item, k, probe_game=False):
        typ = item.get("type")
        where = label_of(item, k)
        self.check(where)
        if typ == "pick":
            self.play_pick(item, where)
        elif typ == "scene":
            self.play_scene(item, where, probe_game)
        elif typ == "sort" and item.get("order") is True:
            self.play_order(item, where)
        elif typ == "sort":
            self.play_bins(item, where)
        elif typ == "counter":
            self.play_counter(item, where)
        else:
            raise Stop(f"{where}: unknown item type {typ!r}")

    def play_pick(self, item, where):
        self.click(sel_choice(item["answer"]), f"{where}: correct option")
        self.wait("#card .why-box.ok", f"{where}: right-call feedback")
        self.check(where + " feedback")
        self.click(CONTINUE, f"{where}: Continue")

    def play_scene(self, item, where, probe_game):
        beats = item.get("beats") or []
        probed = False
        for _ in range(len(beats) + 3):
            if self.page.locator("#card .kicker", has_text="Scene over").count():
                self.check(where + " scene over")
                self.click(CONTINUE, f"{where}: Continue after scene")
                return
            header = self.page.locator("#card .kicker").first.inner_text()
            m = re.search(r"beat\s+(\d+)\s+of\s+(\d+)", header, re.I)
            if not m:
                raise Stop(f"{where}: no beat header on screen (saw {norm(header)!r})")
            bi = int(m.group(1)) - 1
            lines = beats[bi].get("lines") or []
            games = [i for i, ln in enumerate(lines) if ln.get("tag") == "game"]
            if probe_game and not probed and games:
                probed = True
                self.probe_game_line(item, where, bi, games[0])
                continue
            best = [i for i, ln in enumerate(lines) if ln.get("tag") == "best"]
            if not best:
                raise Stop(f"{where}: beat {bi + 1} has no best line")
            self.click(sel_choice(best[0]), f"{where}: beat {bi + 1} best line")
            self.wait("#card .why-box.ok", f"{where}: beat {bi + 1} feedback")
            self.check(f"{where} beat {bi + 1}")
            self.click(CONTINUE, f"{where}: beat {bi + 1} Continue")
        raise Stop(f"{where}: scene did not end")

    def probe_game_line(self, item, where, bi, idx):
        line = item["beats"][bi]["lines"][idx]
        self.click(sel_choice(idx), f"{where}: game line")
        self.wait("#card .why-box.cross", f"{where}: trap-move feedback")
        payoff = plain(item.get("payoff"))
        box = self.page.locator("#card .example", has_text="How it ends")
        shown = norm(box.first.inner_text()) if box.count() else ""
        shown_ok = bool(payoff) and payoff[:40] in shown
        self.game_probe = {"scene": plain(item.get("title")), "beat": bi + 1,
                           "line": plain(line.get("text"))[:120], "payoff_in_content": bool(payoff),
                           "payoff_shown": shown_ok, "payoff_text": shown[:240]}
        if not box.count():
            self.problem(f"{where}: game line showed no 'How it ends' payoff box")
        elif not payoff:
            self.problem(f"{where}: scene has no payoff text in content")
        elif not shown_ok:
            self.problem(f"{where}: payoff on screen does not match content")
        self.check(f"{where} game line")
        self.click(CONTINUE, f"{where}: Continue after game line")

    def play_bins(self, item, where):
        items = item.get("items") or []
        if not items:
            raise Stop(f"{where}: sort has no statements")
        for i, c in enumerate(items):
            wrap = self.page.locator("#card .sort-item").nth(i)
            try:
                wrap.wait_for(state="visible")
                wrap.locator(f"button.choice[data-i='{c['answer']}']").click()
            except PWError as e:
                raise Stop(f"{where}: statement {i + 1} could not be sorted: {str(e).splitlines()[0]}")
            try:
                wrap.locator(".why-box.ok").wait_for(state="visible")
            except PWError:
                raise Stop(f"{where}: no right-call feedback for statement {i + 1}")
        self.check(where + " sorted")
        self.click(CONTINUE, f"{where}: Continue after sort")

    def play_order(self, item, where):
        items = item.get("items") or []
        if not items:
            raise Stop(f"{where}: order has no cards")
        for idx in range(len(items)):
            self.click(sel_pool(idx), f"{where}: card {idx + 1}")
        placed = self.page.locator("#card .seq li").count()
        if placed != len(items):
            self.problem(f"{where}: {placed} of {len(items)} cards placed in the sequence")
        self.check(where + " ordered")
        self.click(CONTINUE, f"{where}: Continue after order")

    def play_counter(self, item, where):
        palette = item.get("palette") or []
        target, tol = float(item["target"]), float(item["tolerance"])
        max_picks = int(item.get("maxPicks") or len(palette))
        combo, total = pick_subset(palette, target, tol, max_picks)
        if combo is None:
            raise Stop(f"{where}: no palette combination lands in {target:g} +/- {tol:g} "
                       f"within {max_picks} picks")
        for j in combo:
            self.click(sel_pal(j), f"{where}: palette item {j}")
        shown = norm(self.page.locator("#card [data-total]").first.text_content())
        try:
            shown_val = float(shown)
        except ValueError:
            shown_val = None
        if shown_val is None or shown_val != float(total):
            self.problem(f"{where}: total shows {shown!r}, expected {total}")
        self.click("#card button[data-send]", f"{where}: Send")
        self.wait("#card .counter-fb .why-box.ok", f"{where}: in-band feedback")
        hit = plain(item.get("hitMsg"))
        fb = norm(self.page.locator("#card .counter-fb").first.inner_text())
        if hit and hit not in fb:
            self.problem(f"{where}: in-band message not shown")
        self.check(where + " sent")
        self.click(CONTINUE, f"{where}: Continue after counter")

    def probe_trap(self, item, where):
        options = item.get("options") or []
        answer = item["answer"]
        wrong = next((i for i in range(len(options)) if i != answer), None)
        if wrong is None:
            raise Stop(f"{where}: pick has no wrong option to test")
        self.check(where)
        self.click(sel_choice(wrong), f"{where}: wrong option")
        self.wait("#card .why-box.cross", f"{where}: trap feedback")
        box = self.page.locator("#card .why-box.cross").first
        box_text = norm(box.inner_text())
        para = box.locator(".feedback").first
        bold = norm(para.locator("b").first.inner_text()) if para.locator("b").count() else ""
        trap_shown = norm(para.inner_text())
        if bold:
            trap_shown = norm(trap_shown.replace(bold, "", 1))
        expected = plain((item.get("traps") or {}).get(str(wrong)))
        matches = bool(expected) and expected in box_text
        self.trap = {"item": where, "wrong_option": plain(options[wrong]), "feedback_shown": True,
                     "feedback_nonempty": bool(trap_shown), "trap_text": trap_shown[:240],
                     "matches_content": matches}
        if not trap_shown:
            self.problem(f"{where}: trap explanation is empty after wrong option {wrong}")
        if not expected:
            self.problem(f"{where}: content has no trap text for wrong option {wrong}")
        elif not matches:
            self.problem(f"{where}: trap text on screen differs from content for option {wrong}")
        if self.page.locator("#card button.choice.correct").count() != 1:
            self.problem(f"{where}: right answer not highlighted after a wrong pick")
        self.check(where + " trap feedback")
        self.click(CONTINUE, f"{where}: Continue after wrong pick")
        try:
            self.page.locator("#card .why-box.cross").first.wait_for(state="detached")
        except PWError:
            raise Stop(f"{where}: Continue after the wrong pick did not move on")
        self.check(where + " next screen")

    def finish(self):
        self.wait("#card h1:has-text('What Nadia would say')", "debrief screen")
        self.check("debrief")
        d = self.game.get("debrief") or {}
        term = plain(d.get("bookTerm") or self.game.get("bookTerm"))
        card_text = norm(self.page.locator("#card").first.inner_text())
        if not term:
            self.problem("debrief: no bookTerm in content")
        elif term in card_text:
            self.book_shown = True
        else:
            self.problem(f"debrief does not show bookTerm {term!r}")
        self.click(CONTINUE, "debrief: Continue")
        self.wait("#card textarea.reflect-box", "reflection screen")
        self.check("reflection")
        self.click(CONTINUE, "reflection: Continue")
        self.wait("#card .end-badge", "end card")
        self.check("end card")
        badge = norm(self.page.locator("#card .end-badge").first.inner_text())
        if "case closed" in badge.lower():
            self.reached_end = True
        else:
            self.problem(f"end card does not show 'Case closed' (shows {badge!r})")


def run_guarded(run, fn):
    try:
        fn()
    except Stop as e:
        run.problem(str(e))
    except Exception as e:  # harness or unexpected Playwright error: record it, never pass silently
        run.problem(f"harness error {type(e).__name__}: {(str(e).splitlines() or [''])[0]}")
    finally:
        run.close()


def dedupe(seq):
    return list(dict.fromkeys(seq))


def run_slot(browser, slot):
    entry = {"slot": slot, "file": f"out/{slot}.html", "passed": False, "reached_end": False,
             "items": 0, "trap_probe": None, "game_probe": None, "debrief_bookterm_shown": False,
             "problems": [], "console_errors": [], "page_errors": [], "network_failures": [],
             "external_font_errors_not_counted": []}
    path = OUT_DIR / f"{slot}.html"
    if not path.is_file():
        entry["problems"].append(f"missing file: {path}")
        return entry
    url = path.resolve().as_uri()

    run_a = Run(browser, url, "A")

    def trap_run():
        run_a.start()
        items = flatten(run_a.game)
        entry["items"] = len(items)
        first = next((k for k, it in enumerate(items) if it.get("type") == "pick"), None)
        if first is None:
            run_a.trap = {"skipped": "no pick item in this game"}
            return
        for k in range(first):
            run_a.play(items[k], k)
        run_a.probe_trap(items[first], label_of(items[first], first))

    run_guarded(run_a, trap_run)

    run_b = Run(browser, url, "B")

    def full_run():
        run_b.start()
        items = flatten(run_b.game)
        entry["items"] = len(items)
        probe_k = next((k for k, it in enumerate(items)
                        if it.get("type") == "scene" and has_game_line(it)), None)
        if probe_k is None:
            run_b.game_probe = {"skipped": "no scene has a game line"}
        for k, it in enumerate(items):
            run_b.play(it, k, probe_game=(k == probe_k))
        run_b.finish()

    run_guarded(run_b, full_run)

    for r in (run_a, run_b):
        entry["problems"] += r.problems
        entry["problems"] += [f"[{r.tag}] uncaught page error: {e}" for e in r.page_errors]
        entry["problems"] += [f"[{r.tag}] console error: {c}" for c in r.console]
        entry["console_errors"] += r.console
        entry["page_errors"] += r.page_errors
        entry["network_failures"] += r.network
        entry["external_font_errors_not_counted"] += r.external
    for key in ("problems", "console_errors", "page_errors", "network_failures",
                "external_font_errors_not_counted"):
        entry[key] = dedupe(entry[key])
    entry["trap_probe"] = run_a.trap
    entry["game_probe"] = run_b.game_probe
    entry["reached_end"] = run_b.reached_end
    entry["debrief_bookterm_shown"] = run_b.book_shown
    entry["passed"] = bool(run_b.reached_end and not entry["problems"])
    return entry


def summary(e):
    if e["passed"]:
        trap = e["trap_probe"] or {}
        game = e["game_probe"] or {}
        trap_s = "yes" if trap.get("feedback_nonempty") else "n/a"
        game_s = "yes" if game.get("payoff_shown") else "n/a"
        return f"{e['slot']:<5} PASS  items={e['items']} trap={trap_s} game={game_s} errors=0"
    first = e["problems"][0] if e["problems"] else "unknown"
    more = len(e["problems"]) - 1
    tail = f"  (+{more} more)" if more > 0 else ""
    return f"{e['slot']:<5} FAIL  {first[:200]}{tail}"


def main():
    slots = sys.argv[1:] or ALL_SLOTS
    results, started = [], time.time()
    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(executable_path=CHROMIUM, headless=True,
                                        args=["--no-sandbox", "--disable-dev-shm-usage"])
            try:
                for slot in slots:
                    entry = run_slot(browser, slot)
                    results.append(entry)
                    print(summary(entry), flush=True)
            finally:
                browser.close()
    finally:
        RESULTS.write_text(json.dumps(results, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    passed = sum(1 for e in results if e["passed"])
    print(f"TOTAL: {passed} of {len(slots)} passed in {time.time() - started:.0f}s; wrote {RESULTS}",
          flush=True)
    return 0 if results and passed == len(slots) else 1


if __name__ == "__main__":
    sys.exit(main())
