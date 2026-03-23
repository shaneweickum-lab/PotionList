import { useState, useEffect } from 'react'
import styles from './ToastNotification.module.css'

const toasts = []
let listeners = []

export function showToast(message, type = 'info', duration = 3000) {
  const id = Date.now() + Math.random()
  const toast = { id, message, type, duration }
  toasts.push(toast)
  listeners.forEach(fn => fn([...toasts]))
  setTimeout(() => {
    const idx = toasts.findIndex(t => t.id === id)
    if (idx !== -1) toasts.splice(idx, 1)
    listeners.forEach(fn => fn([...toasts]))
  }, duration)
}

export default function ToastContainer() {
  const [items, setItems] = useState([])

  useEffect(() => {
    const fn = (t) => setItems(t)
    listeners.push(fn)
    return () => { listeners = listeners.filter(l => l !== fn) }
  }, [])

  return (
    <div className={styles.container}>
      {items.map(t => (
        <div key={t.id} className={`${styles.toast} ${styles[t.type]} fade-in`}>
          {t.message}
        </div>
      ))}
    </div>
  )
}
