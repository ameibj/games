// configuration
`use strict`;

const
    version = '1.0.0',
    CACHE = version + '::2048',
    installFilesEssential = [
        '/',
        '/manifest.json',
        '/2048.css',
        '/2048.js',
        '/animation.js',
        '/touch.js',
        '/images/logo/logo152.png',
        '/amei_favicon.ico',
        '/2048.png',
        '/2048game.jpg',
        '/wxqr.jpg'
    ];

// install static assets
function installStaticFiles() {

    return caches.open(CACHE)
        .then(cache => {
            return cache.addAll(installFilesEssential);

        });

}

// clear old caches
function clearOldCaches() {

    return caches.keys()
        .then(keylist => {

            return Promise.all(
                keylist
                    .filter(key => key !== CACHE)
                    .map(key => caches.delete(key))
            );

        });

}

// application installation
self.addEventListener('install', event => {

    console.log('service worker: install');

    // cache core files
    event.waitUntil(
        installStaticFiles()
            .then(() => self.skipWaiting())
    );

});


// application activated
self.addEventListener('activate', event => {

    console.log('service worker: activate');

    // delete old caches
    event.waitUntil(
        clearOldCaches()
            .then(() => self.clients.claim())
    );

});


// application fetch network data
self.addEventListener('fetch', event => {

    // abandon non-GET requests
    if (event.request.method !== 'GET') return;

    let url = event.request.url;

    event.respondWith(
        caches.open(CACHE)
            .then(cache => {

                return cache.match(event.request)
                    .then(response => {

                        if (response) {
                            // return cached file
                            console.log('cache fetch: ' + url);
                            return response;
                        }

                        // make network request
                        return fetch(event.request)
                            .then(newreq => {

                                console.log('network fetch: ' + url);
                                if (newreq.ok) cache.put(event.request, newreq.clone());
                                return newreq;

                            })
                            // app is offline
                            .catch(()=>{
                                // 我添加的
                                console.log('没网访问呢！！')
                            });

                    });

            })
    );

});
