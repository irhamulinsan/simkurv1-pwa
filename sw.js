/* SIMKUR MA'HAD - Service Worker (tahap 1)
 * Minimal: cache app shell dengan strategi cache-first untuk asset statis.
 * Push notification BELUM diimplementasikan (tahap berikutnya).
 */

const CACHE_NAME = 'simkur-shell-v1';

const APP_SHELL = [
  '/index.html',
  '/css/style.css',
  '/js/app.js',
  '/js/api.js',
  '/manifest.json'
];

// Install: pre-cache app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

// Activate: bersihkan cache versi lama
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

// Fetch: cache-first untuk asset statis (GET saja).
// Request non-GET (mis. POST ke Google Apps Script) dibiarkan lewat ke network.
self.addEventListener('fetch', (event) => {
  const { request } = event;

  if (request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) {
        return cached;
      }

      return fetch(request).then((response) => {
        // Hanya cache response yang valid & same-origin
        if (
          response &&
          response.status === 200 &&
          response.type === 'basic'
        ) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        }
        return response;
      }).catch(() => cached);
    })
  );
});
