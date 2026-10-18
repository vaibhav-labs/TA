#!/usr/bin/env python3
"""Build the You artifacts as an installable PWA into ../public/arena.

Run from ta-arena-artifacts/:  python3 make_pwa.py
Needs engine/build.py. Writes nav-pwa.json (absolute Pages URLs), builds the 42 games and the
hub, adds manifest/theme/service-worker tags, and writes manifest.json and sw.js.
Vite copies public/ into dist/, so the deploy workflow publishes it at BASE.
"""
import glob, json, os, re, shutil, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
BASE = "https://vaibhav-labs.github.io/TA/arena/"
PATH = "/TA/arena/"
OUT = os.path.join(HERE, "..", "public", "arena")
TMP = os.path.join(HERE, "out-pwa")
VERSION = "arena-v3"
THEME = "#171233"

games = {}
for f in sorted(glob.glob(os.path.join(HERE, "content", "*.json"))):
    d = json.load(open(f, encoding="utf-8"))
    games[d["slot"]] = d["title"]

nav = {"hub": BASE, "slots": {s: {"title": t, "url": f"{BASE}{s.replace('.', '-')}.html"} for s, t in games.items()}}
navfile = os.path.join(HERE, "engine", "nav-pwa.json")
json.dump(nav, open(navfile, "w", encoding="utf-8"), indent=2, ensure_ascii=False)

shutil.rmtree(TMP, ignore_errors=True)
for extra in ([], ["--hub"]):
    subprocess.run([sys.executable, os.path.join(HERE, "engine", "build.py"), "--nav", navfile,
                    "--out-dir", TMP] + extra, check=True)

shutil.rmtree(OUT, ignore_errors=True)
os.makedirs(OUT)

HEAD = (f'<link rel="manifest" href="{PATH}manifest.json">\n'
        f'<meta name="theme-color" content="{THEME}">\n'
        '<meta name="mobile-web-app-capable" content="yes">\n'
        '<meta name="apple-mobile-web-app-capable" content="yes">\n'
        '<meta name="apple-mobile-web-app-title" content="You">\n'
        f'<link rel="icon" href="{PATH}icon.svg" type="image/svg+xml">\n'
        f'<link rel="apple-touch-icon" href="{PATH}icon-192.png">\n')
REG = ("<script>if('serviceWorker' in navigator){window.addEventListener('load',function(){"
       "navigator.serviceWorker.register('sw.js',{scope:'%s'}).catch(function(){});});}</script>\n" % PATH)

pages = []
for f in sorted(glob.glob(os.path.join(TMP, "*.html"))):
    name = os.path.basename(f)
    dest = "index.html" if name == "hub.html" else name
    s = open(f, encoding="utf-8").read()
    s = s.replace("</head>", HEAD + "</head>", 1).replace("</body>", REG + "</body>", 1)
    open(os.path.join(OUT, dest), "w", encoding="utf-8").write(s)
    pages.append(dest)

json.dump({
    "name": "You", "short_name": "You",
    "description": "Forty-two short games that teach Transactional Analysis, in seven worlds.",
    "start_url": PATH, "scope": PATH, "display": "standalone",
    "background_color": THEME, "theme_color": THEME,
    "icons": [{"src": PATH + "icon-192.png", "sizes": "192x192", "type": "image/png", "purpose": "any maskable"},
              {"src": PATH + "icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any maskable"}]},
    open(os.path.join(OUT, "manifest.json"), "w"), indent=2)

for ic in ("icon-192.png", "icon-512.png", "icon.svg"):
    shutil.copy(os.path.join(HERE, "pwa-icons", ic), os.path.join(OUT, ic))
assets = ["./"] + ["./" + p for p in pages] + ["./manifest.json"]
sw = f"""// Bump VERSION on every deploy that changes content.
const CACHE = "{VERSION}";
const ASSETS = {json.dumps(assets)};
self.addEventListener("install", (e) => {{
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)));
  self.skipWaiting();
}});
self.addEventListener("activate", (e) => {{
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))));
  self.clients.claim();
}});
// Network first, cache fallback (same approach as First Transaction): updates show when online, offline still works.
self.addEventListener("fetch", (e) => {{
  const r = e.request;
  if (r.method !== "GET" || new URL(r.url).origin !== self.location.origin) return;
  e.respondWith(fetch(r).then((resp) => {{
    if (resp && resp.ok) {{ const copy = resp.clone(); caches.open(CACHE).then((c) => c.put(r, copy)); }}
    return resp;
  }}).catch(() => caches.match(r).then((m) => m || caches.match("./"))));
}});
"""
open(os.path.join(OUT, "sw.js"), "w").write(sw)
shutil.rmtree(TMP, ignore_errors=True)
print("wrote", len(pages), "pages to", os.path.normpath(OUT))
