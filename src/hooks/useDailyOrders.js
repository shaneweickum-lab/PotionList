import { useEffect } from 'react'
import { useStore } from '../store/index.js'
import { getMsUntilMidnightUTC } from '../lib/orderSeed.js'

export function useDailyOrders() {
  const refreshOrders = useStore(s => s.refreshOrders)

  useEffect(() => {
    refreshOrders()

    // Schedule refresh at next midnight UTC
    function scheduleRefresh() {
      const ms = getMsUntilMidnightUTC()
      const timer = setTimeout(() => {
        refreshOrders()
        scheduleRefresh()
      }, ms)
      return timer
    }

    const timer = scheduleRefresh()
    return () => clearTimeout(timer)
  }, [])
}
