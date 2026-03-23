export async function registerSW() {
  if (!('serviceWorker' in navigator)) return
  try {
    await navigator.serviceWorker.register('/sw.js', { scope: '/' })
  } catch (err) {
    console.warn('SW registration failed:', err)
  }
}

export async function requestPushPermission() {
  if (!('Notification' in window)) return 'unsupported'
  if (Notification.permission === 'granted') return 'granted'
  const result = await Notification.requestPermission()
  return result
}

export async function subscribeToPush(userId) {
  if (!('serviceWorker' in navigator)) return null
  const vapidKey = import.meta.env.VITE_VAPID_PUBLIC_KEY
  if (!vapidKey) return null

  try {
    const reg = await navigator.serviceWorker.ready
    const existing = await reg.pushManager.getSubscription()
    if (existing) return existing

    const sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidKey),
    })

    // Store subscription in Supabase
    const { supabase } = await import('./supabase.js').catch(() => ({ supabase: null }))
    if (!supabase) return sub
    await supabase.from('push_subscriptions').upsert({
      user_id: userId,
      endpoint: sub.endpoint,
      subscription: JSON.stringify(sub),
    })

    return sub
  } catch (err) {
    console.error('Push subscription failed:', err)
    return null
  }
}

export function scheduleLocalNotification(title, body, delayMs, tag) {
  if (!('serviceWorker' in navigator)) return
  if (Notification.permission !== 'granted') return
  setTimeout(async () => {
    const reg = await navigator.serviceWorker.ready
    reg.showNotification(title, {
      body,
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-192.png',
      tag,
      data: { tag },
    })
  }, Math.max(0, delayMs))
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = window.atob(base64)
  return new Uint8Array([...rawData].map(char => char.charCodeAt(0)))
}
