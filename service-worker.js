self.addEventListener('install', event => {
    event.waitUntil(
    caches.open('routine-cache-v1').then(cache => {
        return cache.addAll([
        'index.html',
        'app.js',
        'manifest.json',
        'icon.png'
        ]);
    })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
    caches.match(event.request).then(response => {
        return response || fetch(event.request);
    })
    );
});

self.addEventListener('push', event => {
    const data = event.data ? event.data.json() : {};
    const title = data.title || 'ルーティン通知';
    const body = data.body || 'タスクがあります！';

    event.waitUntil(
      self.registration.showNotification(title, {
        body: body,
        icon: 'icon.png',
      })
    );
  });