/* Service Worker for Palta Practice Challenge - Utpal Chattopadhyay (c) 2026 */

/*
 * RELEASE CHECKLIST: whenever index.html or app.js changes, bump the number in
 * CACHE_NAME below (v1 -> v2 -> ...). This worker is cache-first, so installed copies
 * keep serving the old files until sw.js itself changes; changing that one line is
 * what makes browsers install the new release.
 *
 * This app and the Swara Ear Trainer both live on utpalch-math.github.io, and Cache
 * Storage is shared per origin. So activate must delete ONLY caches whose names start
 * with 'palta-cache-'. Never change it to "delete every other cache" - that would wipe
 * the other app's offline copy.
 */
const CACHE_NAME = 'palta-cache-v1';
const CACHE_PREFIX = 'palta-cache-';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './app.js',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // cache:'reload' bypasses the browser's own HTTP cache (GitHub Pages allows about
      // 10 minutes), so index.html and app.js are always fetched fresh together and can
      // never come from two different releases.
      return cache.addAll(ASSETS_TO_CACHE.map((url) => new Request(url, { cache: 'reload' })));
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});
