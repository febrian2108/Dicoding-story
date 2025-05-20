const CACHE_NAME = "storyapps-v1";
const urlsToCache = [
    "/",
    "/index.html",
    "/manifest.json",
    "/favicon.png",
    "/src/styles/styles.css",
    "/src/main.js",
    "/src/public/favicon.png",
    "/src/public/services-worker.js",
    "/src/styles/base/layout.css",
    "/src/styles/base/reset.css",
    "/src/styles/base/typography.css",
    "/src/styles/base/variables.css",
    "/src/styles/components/app-bar.css",
    "/src/styles/components/buttons.css",
    "/src/styles/components/camera.css",
    "/src/styles/components/forms.css",
    "/src/styles/components/loading.css",
    "/src/styles/components/map.css",
    "/src/styles/components/story-item.css",
    "/src/styles/pages/add-story.css",
    "/src/styles/pages/auth.css",
    "/src/styles/pages/detail.css",
    "/src/styles/pages/home.css",
    "/src/scripts/app.js",
    "/src/scripts/config/api-config.js",
    "/src/scripts/data/api.js",
    "/src/scripts/data/auth-repository.js",
    "/src/scripts/data/story-repository.js",
    "/src/scripts/pages/home/home-page.js",
    "/src/scripts/pages/home/home-presenter.js",
];

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log("Cache opened");
            return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener("activate", event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames =>
            Promise.all(
                cacheNames.map(cacheName => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        console.log("Deleting old cache:", cacheName);
                        return caches.delete(cacheName);
                    }
                })
            )
        )
    );
});

self.addEventListener("fetch", event => {
    if (
        event.request.url.startsWith('http') &&
        !event.request.url.includes(self.location.origin)
    ) {
        event.respondWith(
            fetch(event.request)
                .then(response => {
                    return caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, response.clone());
                        return response;
                    });
                })
                .catch(() => caches.match(event.request))
        );
        return;
    }

    event.respondWith(
        caches.match(event.request).then(response => {
            return (
                response ||
                fetch(event.request).then(networkResponse => {
                    if (
                        !networkResponse ||
                        networkResponse.status !== 200 ||
                        networkResponse.type !== "basic"
                    ) {
                        return networkResponse;
                    }
                    const responseClone = networkResponse.clone();
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, responseClone);
                    });
                    return networkResponse;
                })
            );
        })
    );
});

self.addEventListener("push", event => {
    let notificationData = {};

    try {
        notificationData = event.data.json();
    } catch (error) {
        notificationData = {
            title: "New Notification",
            options: {
                body: event.data ? event.data.text() : "No content",
                icon: "/favicon.ico",
            },
        };
    }

    const title = notificationData.title || "StoryApps";
    const options = notificationData.options || {};

    event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", event => {
    event.notification.close();

    const urlToOpen = "/#/";

    event.waitUntil(
        clients.matchAll({ type: "window" }).then(clientList => {
            for (const client of clientList) {
                if (client.url === urlToOpen && "focus" in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow(urlToOpen);
            }
        })
    );
});
