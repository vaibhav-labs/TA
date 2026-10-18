// Bump VERSION on every deploy that changes content.
const CACHE = "arena-v1";
const ASSETS = ["./", "./1-1.html", "./1-2.html", "./1-3.html", "./1-4.html", "./1-5.html", "./1-6.html", "./2-1.html", "./2-2.html", "./2-3.html", "./2-4.html", "./2-5.html", "./2-6.html", "./3-1.html", "./3-2.html", "./3-3.html", "./3-4.html", "./3-5.html", "./3-6.html", "./4-1.html", "./4-2.html", "./4-3.html", "./4-4.html", "./4-5.html", "./4-6.html", "./5-1.html", "./5-2.html", "./5-3.html", "./5-4.html", "./5-5.html", "./5-6.html", "./6-1.html", "./6-2.html", "./6-3.html", "./6-4.html", "./6-5.html", "./6-6.html", "./7-1.html", "./7-2.html", "./7-3.html", "./7-4.html", "./7-5.html", "./7-6.html", "./index.html", "./manifest.json"];
self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)));
  self.skipWaiting();
});
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))));
  self.clients.claim();
});
// Network first, cache fallback (same approach as First Transaction): updates show when online, offline still works.
self.addEventListener("fetch", (e) => {
  const r = e.request;
  if (r.method !== "GET" || new URL(r.url).origin !== self.location.origin) return;
  e.respondWith(fetch(r).then((resp) => {
    if (resp && resp.ok) { const copy = resp.clone(); caches.open(CACHE).then((c) => c.put(r, copy)); }
    return resp;
  }).catch(() => caches.match(r).then((m) => m || caches.match("./"))));
});
