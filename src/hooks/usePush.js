import { useEffect } from 'react'
import { useStore } from '../store/index.js'
import { subscribeToPush } from '../lib/pushNotifications.js'

export function usePush() {
  const userId = useStore(s => s.userId)

  useEffect(() => {
    if (!userId || !('Notification' in window)) return
    if (Notification.permission === 'granted') {
      subscribeToPush(userId)
    }
  }, [userId])
}
