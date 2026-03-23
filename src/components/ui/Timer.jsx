import { useState, useEffect } from 'react'
import styles from './Timer.module.css'

export default function Timer({ finishAt, onComplete, compact }) {
  const [remaining, setRemaining] = useState(Math.max(0, finishAt - Date.now()))

  useEffect(() => {
    if (remaining <= 0) {
      onComplete?.()
      return
    }
    const id = setInterval(() => {
      const r = Math.max(0, finishAt - Date.now())
      setRemaining(r)
      if (r <= 0) {
        clearInterval(id)
        onComplete?.()
      }
    }, 500)
    return () => clearInterval(id)
  }, [finishAt])

  const secs = Math.floor(remaining / 1000)
  const h = Math.floor(secs / 3600)
  const m = Math.floor((secs % 3600) / 60)
  const s = secs % 60

  const display = h > 0
    ? `${h}h ${String(m).padStart(2, '0')}m`
    : `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`

  if (remaining <= 0) return <span className={`${styles.done} ${compact ? styles.compact : ''}`}>Ready</span>

  return <span className={`${styles.timer} ${compact ? styles.compact : ''}`}>{display}</span>
}
