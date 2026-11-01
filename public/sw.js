const CACHE_NAME = 'fileforge-v1';

// Assets to cache on install for offline support
const STATIC_ASSETS = [
  '/',
  '/image-to-pdf',
  '/merge-pdf',
  '/compress-pdf',
  '/unlock-pdf',
  '/compress-image',
];

// Install: cache shell assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAMEgi)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch: network-first with cache fallback
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests and browser-extension requests
  if (event.request.method !== 'GET') return;
  if (!event.request.url.startsWith('http')) return;
  
  // Skip Next.js HMR and Webpack requests to prevent infinite loops in development
  if (event.request.url.includes('/_next/webpack-hmr') || event.request.url.includes('.hot-update.')) return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Clone and cache successful responses
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, clone);
        });
        return response;
      })
      .catch(() => {
        // Fallback to cache when offline
        return caches.match(event.request);
      })
  );
});
