'use strict';

importScripts('./scripts/apiclientlib/ApiClient.js');
importScripts('./scripts/apiclientlib/Endpoint.js');
importScripts('./scripts/chuckNorrisIOApiClient.js');

// durch cacheName ist Versionierung möglich
let cacheName = 'seminar2_demo_pwa_1.0.2';
let filesToCache = [
    '/',
    '/index.html',
    '/scripts/apiclientlib/ApiClient.js',
    '/scripts/apiclientlib/Endpoint.js',
    '/scripts/chuckNorrisIOApiClient.js',
    '/scripts/app.js',
    '/scripts/main.js',
    '/styles/inline.css',
    '/images/ic_refresh_white_24px.svg',
    '/images/chuck-norris.png',
    '/images/chucknorris_logo.png',
    '/images/chuck-norris-badge.png'
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
    // Möglichkeit fetch requests zu ignorieren die nicht gecached werden sollen
    if (e.request.url.startsWith(ChuckNorrisIOApiClient.baseUrl)) {
        return;
    }

    console.log('[ServiceWorker] Fetch', e.request.url);
    e.respondWith(
        caches.match(e.request).then((response) => {
            return response || fetch(e.request);
        })
    );
});

// sync event kann als proxy betrachtet werden
self.addEventListener('sync', (e) => {
    if (e.tag.startsWith('loadJokeSync_')) {
        let chuckNorrisApi = new ChuckNorrisIOApiClient();
        e.waitUntil(chuckNorrisApi.getRandomJoke((data) => {
            self.clients.matchAll().then(all => {
                for (let i = 0; i < all.length; i++) {
                    all[i].postMessage({joke: data});
                }
            });
            let bodyPreview = data.value.substr(0, 30);
            if (bodyPreview.length < data.value.length) {
                bodyPreview += '...';
            }
            showNewCNFactNotification(bodyPreview);
        }, (error) => {
            console.log('Error: ' + error.message);
        }));
    }
    else {
        console.log('Some other sync tag that shouldn\'t trigger a notification: ' + e.tag);
    }
});

self.addEventListener('notificationclick', (e) => {
    console.log('[Service Worker] Notification clicked');
    // notification schließen
    e.notification.close();

    // setze fokus auf ein offenes app fenster. wenn keins offen ist, öffne ein neues
    e.waitUntil(clients.matchAll({
        type: 'window'
    }).then((clientList) => {
        for (let i = 0; i < clientList.length; i++) {
            const client = clientList[i];
            if ('focus' in client) {
                return client.focus();
            }
        }
        return clients.openWindow('/');
    }));
});

function showNewCNFactNotification(bodyPreview) {
    if (Notification.permission === 'granted') {
        self.registration.showNotification('Fetched new Chuck Norris Fact', {
            tag: 'chuck-norris-fact',
            body: bodyPreview,
            badge: '/images/chuck-norris-badge.png',
            icon: '/images/chucknorris_logo.png'
        });

    }
}
