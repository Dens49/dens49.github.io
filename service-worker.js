'use strict';

// durch cacheName ist Versionierung möglich
let cacheName = 'seminar2_demo_pwa_0.1.3';
let filesToCache = [
    '/',
    '/index.html',
    '/scripts/chuckNorrisIOApiClient.js',
    '/scripts/app.js',
    '/scripts/main.js',
    '/styles/inline.css',
    '/images/ic_add_white_24px.svg',
    '/images/ic_refresh_white_24px.svg'
];

// installiert alle Dateien die für die App Shell nötig sind
// das sind alle Dateien die benötigt werden, um die app offline zeigen zu können
self.addEventListener('install', (e) => {
    console.log('[ServiceWorker] Install');
    e.waitUntil(
        caches.open(cacheName)
            .then((cache) => {
                console.log('[ServiceWorker] Caching app shell');
                // fügt alle spezifizierten Dateien in den cache ein
                return cache.addAll(filesToCache);
            })
    );
});

// Cache kann geupdated werden
self.addEventListener('activate', function(e) {
    console.log('[ServiceWorker] Activate');
    e.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if (key !== cacheName) {
                    console.log('[ServiceWorker] Removing old cache', key);
                    return caches.delete(key);
                }
            }))
        })
    );
    return self.clients.claim();
});

// dadurch wird die webapp aus der gecacheten App Shell zur Verfügung gestellt
// damit ist sie auch offline verfügbar
self.addEventListener('fetch', (e) => {
    console.log('[ServiceWorker] Fetch', e.request.url);
    e.respondWith(
        caches.match(e.request).then((response) => {
            return response || fetch(e.request);
        })
    );
});

self.importScripts('/scripts/chuckNorrisIOApiClient.js');

// sync event kann als proxy betrachtet werden
self.addEventListener('sync', (e) => {
    if (e.tag.startsWith('loadJokeSync_')) {
        e.waitUntil(fetch(ChuckNorrisIOApiClient.url + ChuckNorrisIOApiClient.getRandomJokeEndpoint)
            .then((response) => {
                return response.json();
            }).then((data) => {
                self.clients.matchAll().then(all => {
                    for (let i = 0; i < all.length; i++) {
                        all[0].postMessage({joke: data});
                    }
                });
                self.registration.showNotification('Synced ' + e.tag + ': Fetched new random joke!');
            }).catch((error) => {
                console.log('Error: ' + error.message);
        }));
    }
    else {
        console.log('Some other sync tag that shouldn\'t trigger a notification: ' + e.tag);
    }
});

