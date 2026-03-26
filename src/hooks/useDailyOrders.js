import { useEffect } from 'react'
import { useStore } from '../store/index.js'
import { getMsUntilMidnightUTC, getMsUntilNextMondayUTC, getMsUntilNextMonthUTC } from '../lib/orderSeed.js'

export function useDailyOrders() {
  const refreshOrders        = useStore(s => s.refreshOrders)
  const refreshWeeklyOrders  = useStore(s => s.refreshWeeklyOrders)
  const refreshMonthlyOrders = useStore(s => s.refreshMonthlyOrders)

  useEffect(() => {
    refreshOrders()
    refreshWeeklyOrders()
    refreshMonthlyOrders()

    function scheduleDailyRefresh() {
      const timer = setTimeout(() => { refreshOrders(); scheduleDailyRefresh() }, getMsUntilMidnightUTC())
      return timer
    }
    function scheduleWeeklyRefresh() {
      const timer = setTimeout(() => { refreshWeeklyOrders(); scheduleWeeklyRefresh() }, getMsUntilNextMondayUTC())
      return timer
    }
    function scheduleMonthlyRefresh() {
      const timer = setTimeout(() => { refreshMonthlyOrders(); scheduleMonthlyRefresh() }, getMsUntilNextMonthUTC())
      return timer
    }

    const t1 = scheduleDailyRefresh()
    const t2 = scheduleWeeklyRefresh()
    const t3 = scheduleMonthlyRefresh()
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
}
