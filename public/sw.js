// PotionList Service Worker
// Uses injectManifest strategy — Workbox precache injected by vite-plugin-pwa

import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching'

// Injected by vite-plugin-pwa build
precacheAndRoute(self.__WB_MANIFEST ?? [])
cleanupOutdatedCaches()

// Push notification handler
self.addEventListener('push', (event) => {
  if (!event.data) return
  let data
  try {
    data = event.data.json()
  } catch {
    data = { title: 'PotionList', body: event.data.text() }
  }

  event.waitUntil(
    self.registration.showNotification(data.title ?? 'PotionList', {
      body: data.body ?? '',
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-192.png',
      tag: data.tag ?? 'potionlist',
      data: { screen: data.screen ?? 'tasks' },
    })
  )
})

// Notification click — focus or open the app
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const screen = event.notification.data?.screen ?? 'tasks'

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      for (const client of clients) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.postMessage({ type: 'NAVIGATE', screen })
          return client.focus()
        }
      }
      return self.clients.openWindow(`/?screen=${screen}`)
    })
  )
})

// Background sync for offline writes (optional)
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-save') {
    event.waitUntil(Promise.resolve())
  }
})
