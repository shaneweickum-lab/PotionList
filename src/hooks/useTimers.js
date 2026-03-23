import { useEffect } from 'react'
import { registerTimerCallback, startTimerEngine, stopTimerEngine } from '../lib/timerEngine.js'
import { useStore } from '../store/index.js'

export function useTimers() {
  useEffect(() => {
    // Check for past-due timers on mount (handles app-was-closed case)
    const { brewing, mineTrips, smithing, completeBrew, completeMineTrip, completeSmelt, completeForge } = useStore.getState()
    const now = Date.now()

    brewing.forEach(b => { if (b.finishAt <= now) completeBrew(b.id) })
    mineTrips.filter(t => !t.completed).forEach(t => { if (t.finishAt <= now) completeMineTrip(t.id) })
    smithing.forEach(s => {
      if (s.finishAt <= now) {
        if (s.type === 'forge') completeForge(s.id)
        else completeSmelt(s.id)
      }
    })

    // Register live tick
    const unregister = registerTimerCallback((now) => {
      const state = useStore.getState()
      state.brewing.forEach(b => { if (b.finishAt <= now) state.completeBrew(b.id) })
      state.mineTrips.filter(t => !t.completed).forEach(t => { if (t.finishAt <= now) state.completeMineTrip(t.id) })
      state.smithing.forEach(s => {
        if (s.finishAt <= now) {
          if (s.type === 'forge') state.completeForge(s.id)
          else state.completeSmelt(s.id)
        }
      })
    })

    startTimerEngine()
    return () => {
      unregister()
      stopTimerEngine()
    }
  }, [])
}
