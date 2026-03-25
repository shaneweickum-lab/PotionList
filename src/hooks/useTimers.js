import { useEffect } from 'react'
import { registerTimerCallback, startTimerEngine, stopTimerEngine } from '../lib/timerEngine.js'
import { useStore } from '../store/index.js'
import { showToast } from '../components/ui/ToastNotification.jsx'
import { POTION_MAP } from '../constants/potions.js'
import { INGOT_MAP } from '../constants/ores.js'
import { CAULDRON_UPGRADES, ALEMBIC } from '../constants/shop.js'

function doCompleteBrew(state, b) {
  const potion = POTION_MAP[b.potionId]
  const hasAlembic = (state.owned ?? []).includes('silver_alembic')
  const yield_ = hasAlembic ? b.qty * 2 : b.qty
  state.completeBrew(b.id)
  if (potion) showToast(`${potion.name} ×${yield_} ready!`, 'success')
}

function doCompleteSmelt(state, s) {
  const ingot = INGOT_MAP[s.itemId]
  state.completeSmelt(s.id)
  if (ingot) showToast(`${ingot.name} ×${s.qty} smelted!`, 'success')
}

function doCompleteForge(state, s) {
  const upgrade = [...(CAULDRON_UPGRADES ?? []), ALEMBIC].find(u => u.id === s.itemId)
  state.completeForge(s.id)
  if (upgrade) showToast(`${upgrade.name} forged!`, 'success')
}

export function useTimers() {
  useEffect(() => {
    // Check for past-due timers on mount (handles app-was-closed case)
    const state = useStore.getState()
    const now = Date.now()

    state.brewing.forEach(b => { if (b.finishAt <= now) doCompleteBrew(state, b) })
    state.mineTrips.filter(t => !t.completed).forEach(t => { if (t.finishAt <= now) state.completeMineTrip(t.id) })
    state.smithing.forEach(s => {
      if (s.finishAt <= now) {
        if (s.type === 'forge') doCompleteForge(state, s)
        else doCompleteSmelt(state, s)
      }
    })

    // Register live tick
    const unregister = registerTimerCallback((now) => {
      const state = useStore.getState()
      state.brewing.forEach(b => { if (b.finishAt <= now) doCompleteBrew(state, b) })
      state.mineTrips.filter(t => !t.completed).forEach(t => { if (t.finishAt <= now) state.completeMineTrip(t.id) })
      state.smithing.forEach(s => {
        if (s.finishAt <= now) {
          if (s.type === 'forge') doCompleteForge(state, s)
          else doCompleteSmelt(state, s)
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
