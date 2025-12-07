// [Commit: feat(pwa): Rewrite Service Worker to V2.0 for hard reset and cache fix]
// [The What: Simplified SW to core Install/Fetch/Activate cycle. Bumped version to V2.0-clean.]
// [The Why: A full rewrite and major version bump forces the browser to treat this as a brand new asset, permanently resolving the persistent V1-scope conflict that was preventing PWA installation.]
const CACHE_NAME = '0FluffStyle-v2-0-clean';

const urlsToCache = [
    './',
    'index.html',
    'script.js',
    'style.css',
    'manifest.json',
    'icon.png'
];

// Install: Cache all core assets
self.addEventListener('install', (event) => {
    self.skipWaiting(); 
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
    );
});

// Fetch: Serve from cache first, then fall back to network
self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;
    event.respondWith(
        caches.match(event.request).then((response) => response || fetch(event.request))
    );
});

// Activate: Clean up old caches (crucial for PWA updates)
self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim()); 
    event.waitUntil(
        caches.keys().then((cacheNames) => Promise.all(
            cacheNames.map((cacheName) => {
                // Delete any cache that doesn't match the new, clean name
                if (cacheName !== CACHE_NAME) return caches.delete(cacheName);
            })
        ))
    );
});
