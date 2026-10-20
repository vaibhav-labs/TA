// Bump this version string on every deploy that changes page content.
// Service workers only get re-checked when this file's own bytes change,
// so an unchanged version here means installed/cached clients never see updates.
const CACHE = "first-transaction-v3";
const ASSETS = [
  "./index.html",
  "./01-strokes.html",
  "./02-ego-states.html",
  "./03-transactions.html",
  "./04-games.html",
  "./05-life-positions.html",
  "./manifest.json",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

// Network-first: always try to serve the latest page when online, and only
// fall back to the cached copy if the network is unavailable (true offline
// use). A cache-first strategy here was the bug: it could silently freeze
// a visitor on the exact snapshot that existed the first time they opened
// the page, with no way for them to tell anything was stale.
self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  if (new URL(req.url).origin !== self.location.origin) return;

  event.respondWith(
    fetch(req)
      .then((resp) => {
        if (resp && resp.ok) {
          const copy = resp.clone();
          caches.open(CACHE).then((cache) => cache.put(req, copy));
        }
        return resp;
      })
      .catch(() => caches.match(req))
  );
});
