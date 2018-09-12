const cacheName = 'v3';

const cacheAssets = [
    'offline.html'
];

// Call Install Event
self.addEventListener('install', (e) => {
    console.log('Service Worker: Installed');
    e.waitUntil(
        caches
            .open(cacheName)
            .then(cache => {
                console.log('Service Worker: Caching Files');
                cache.addAll(cacheAssets);
            })
            .then(() => self.skipWaiting())
    );
});

// Call Activate Event
self.addEventListener('activate', (e) => {
    console.log('Service Worker: Activated');
    // Remove unwanted caches
    e.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if(cache !== cacheName) {
                       console.log('Service Worker: Clearing old cache!');
                       return caches.delete(cache);      
                    }
                })
            )
        })
    );
});

// Call Fetch Event
self.addEventListener('fetch', event => {
    console.log('Service Worker: Fetching');
    var request = event.request;
    if (request.method === "GET") {
        event.respondWith(
            fetch(request).catch(e => {
                console.error('[onfetch] Failed. Serving cached offline fallback ' + e);
                return caches.open(cacheName).then(cache => {
                    return cache.match('offline.html');
                });
            })
        );
    }
});