self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open('my-cache').then((cache) => {
            return cache.addAll([
                '/',                  
                '/src/index.html',       
                '/src/styles/styles.css', 
                '/src/scripts/index.js', 
                '/src/public/favicon.png' 
            ]);
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});

self.addEventListener('push', function (event) {
    const options = {
        body: event.data.text(),
        icon: '/src/public/favicon.png',
        badge: '/src/public/favicon.png'
    };
    event.waitUntil(
        self.registration.showNotification('Notifikasi Baru', options)
    );
});

self.addEventListener('notificationclick', function (event) {
    event.notification.close();
    event.waitUntil(
        clients.openWindow('/')
    );
});
