#!/usr/bin/env python3
"""Checks for out/hub.html in headless Chromium at 390 x 844 and 1280 x 900.

Checks: no horizontal scroll, seven world sections, 42 chips, the route stops jump to
their sections, the keyboard focus ring shows, and the chips with no URL are aria-disabled.
Writes qa/hub-390.png and qa/hub-1280.png (full page). Exit 1 on any failure.

Usage: python3 qa/hub_check.py
"""
import json
import sys
from pathlib import Path

from playwright.sync_api import sync_playwright

HERE = Path(__file__).resolve().parent
TA = HERE.parent
HUB = TA / "out" / "hub.html"
CHROMIUM = "/opt/pw-browsers/chromium"
EXTERNAL = ("fonts.googleapis.com", "fonts.gstatic.com")
VIEWPORTS = {"390": (390, 844), "1280": (1280, 900)}

STATS_JS = """() => {
  const de = document.documentElement;
  const over = [];
  for (const el of document.querySelectorAll('body *')) {
    const r = el.getBoundingClientRect();
    if (r.width > 0 && (r.right > window.innerWidth + 0.5 || r.left < -0.5)) {
      over.push(el.tagName.toLowerCase() + (el.className ? '.' + String(el.className).split(' ')[0] : ''));
    }
  }
  return {
    scrollWidth: de.scrollWidth, clientWidth: de.clientWidth, innerWidth: window.innerWidth,
    overflowing: over.length, overflowSample: over.slice(0, 8),
    worldSections: document.querySelectorAll('section.world').length,
    chips: document.querySelectorAll('li.chip').length,
    chipLinks: document.querySelectorAll('li.chip a[href]').length,
    disabledChips: document.querySelectorAll('[aria-disabled="true"]').length,
    bossChips: document.querySelectorAll('li.chip.boss').length,
    stops: document.querySelectorAll('nav.route a[href^="#world-"]').length,
    leads: document.querySelectorAll('.leads').length,
    h1: (document.querySelector('h1') || {}).textContent,
    h2Count: document.querySelectorAll('h2').length,
    worldH2: [...document.querySelectorAll('section.world h2')].map(h => h.textContent),
  };
}"""


def main():
    failures = []
    report = {}
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=CHROMIUM, headless=True)
        for label, (w, h) in VIEWPORTS.items():
            page = browser.new_page(viewport={"width": w, "height": h})
            page.route("**/*", lambda route: route.abort()
                       if any(host in route.request.url for host in EXTERNAL) else route.continue_())
            page.goto(HUB.as_uri(), wait_until="load")
            s = page.evaluate(STATS_JS)
            report[label] = s
            if s["scrollWidth"] > s["clientWidth"] or s["overflowing"]:
                failures.append(f"{label}: horizontal overflow (scrollWidth {s['scrollWidth']}, {s['overflowing']} boxes outside)")
            if s["worldSections"] != 7:
                failures.append(f"{label}: {s['worldSections']} world sections, want 7")
            if s["chips"] != 42 or s["chipLinks"] + s["disabledChips"] != 42:
                failures.append(f"{label}: chips {s['chips']}, links {s['chipLinks']}, disabled {s['disabledChips']}")
            if s["stops"] != 7 or s["leads"] != 6 or s["bossChips"] != 7:
                failures.append(f"{label}: stops {s['stops']}, leads {s['leads']}, boss chips {s['bossChips']}")

            jumps = []
            for n in range(1, 8):
                page.evaluate("window.scrollTo(0, 0)")
                page.click(f'nav.route a[href="#world-{n}"]')
                top = page.evaluate(f"document.getElementById('world-{n}').getBoundingClientRect().top")
                hashv = page.evaluate("location.hash")
                at_bottom = page.evaluate("window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2")
                jumps.append({"stop": n, "sectionTop": round(top), "hash": hashv, "atPageBottom": at_bottom})
                # A section near the end of the page cannot scroll to the top, so it is accepted
                # when the page is at its bottom and the section is on screen.
                lands = (-2 <= top <= 40) or (at_bottom and 0 <= top < page.viewport_size["height"])
                if not lands or hashv != f"#world-{n}":
                    failures.append(f"{label}: stop {n} did not jump to world {n} (top {top:.0f}, hash {hashv})")
            report[label]["jumps"] = jumps

            # Captured before the focus test adds its test link, so the picture shows the real page.
            shot = HERE / f"hub-{label}.png"
            page.screenshot(path=str(shot), full_page=True)
            report[label]["screenshot"] = str(shot)
            page.evaluate("window.scrollTo(0, 0)")
            if s["chipLinks"] == 0:
                # nav.json has no slot URLs yet, so no chip is a link. In the open page only, add one
                # test link to the first chip so the focus ring can be checked. The file is not changed.
                page.evaluate("""() => {
                  const a = document.createElement('a');
                  a.href = '#focus-test'; a.textContent = 'focus test';
                  document.querySelector('li.chip').appendChild(a);
                }""")
            page.focus("li.chip a[href]")
            page.keyboard.press("Shift+Tab")
            page.keyboard.press("Tab")
            ring = page.evaluate("getComputedStyle(document.activeElement.closest('li.chip')).outlineStyle")
            report[label]["focusRing"] = ring
            if ring != "solid":
                failures.append(f"{label}: keyboard focus ring not visible (outline {ring})")

            page.close()
        browser.close()

    print(json.dumps(report, ensure_ascii=False, indent=1))
    if failures:
        print("FAIL")
        for line in failures:
            print(" -", line)
        return 1
    print("PASS")
    return 0


if __name__ == "__main__":
    sys.exit(main())
