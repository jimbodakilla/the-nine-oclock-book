// Offline support: app shell cached; story files cached after first open; manifest always fresh when online.
const C = "bookofnights-v13";
const SHELL = ["./", "index.html", "manifest.webmanifest", "icon-512.png", "icon-180.png", "art/lock-wide.webp", "art/lock-tall.webp", "art/home-sky.webp", "art/card-mystery.webp", "art/card-tonight.webp", "art/end-night.webp",
  "fonts/Fraunces-SemiBold.woff", "fonts/Fraunces-SemiBoldItalic.woff", "fonts/Alegreya-Regular.woff",
  "fonts/Alegreya-Italic.woff", "fonts/Alegreya-Bold.woff"];
self.addEventListener("install", (e) => { e.waitUntil(caches.open(C).then((c) => c.addAll(SHELL))); self.skipWaiting(); });
self.addEventListener("activate", (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== C).map((k) => caches.delete(k))))); self.clients.claim(); });
self.addEventListener("fetch", (e) => {
  const u = new URL(e.request.url);
  if (u.origin !== location.origin) return;
  const fresh = u.pathname.endsWith("manifest.json") || u.pathname.endsWith("/") || u.pathname.endsWith("index.html");
  if (fresh) {
    e.respondWith(fetch(e.request).then((r) => { const cl = r.clone(); caches.open(C).then((c) => c.put(e.request, cl)); return r; }).catch(() => caches.match(e.request)));
  } else {
    e.respondWith(caches.match(e.request).then((hit) => hit || fetch(e.request).then((r) => { const cl = r.clone(); caches.open(C).then((c) => c.put(e.request, cl)); return r; })));
  }
});
