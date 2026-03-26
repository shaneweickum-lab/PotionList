import {
  generateDailyOrders,
  generateWeeklyOrders,
  generateMonthlyOrders,
  getTodayUTCString,
  getThisWeekUTCString,
  getThisMonthUTCString,
} from '../../lib/orderSeed.js'

export function createOrdersSlice(set, get) {
  return {
    dailyOrders:   [],
    ordersDate:    null,
    ordersTier:    null,

    weeklyOrders:      [],
    weeklyOrdersDate:  null,
    weeklyOrdersTier:  null,

    monthlyOrders:      [],
    monthlyOrdersDate:  null,
    monthlyOrdersTier:  null,

    refreshOrders: () => {
      const today = getTodayUTCString()
      const tier  = get().cauldronTier ?? 1
      const hasOldFormat = (get().dailyOrders ?? []).some(o => o.potionId && !o.items)
      if (get().ordersDate === today && get().ordersTier === tier && !hasOldFormat) return
      set({ dailyOrders: generateDailyOrders(today, tier), ordersDate: today, ordersTier: tier })
    },

    refreshWeeklyOrders: () => {
      const week = getThisWeekUTCString()
      const tier = get().cauldronTier ?? 1
      if (get().weeklyOrdersDate === week && get().weeklyOrdersTier === tier) return
      set({ weeklyOrders: generateWeeklyOrders(week, tier), weeklyOrdersDate: week, weeklyOrdersTier: tier })
    },

    refreshMonthlyOrders: () => {
      const month = getThisMonthUTCString()
      const tier  = get().cauldronTier ?? 1
      if (get().monthlyOrdersDate === month && get().monthlyOrdersTier === tier) return
      set({ monthlyOrders: generateMonthlyOrders(month, tier), monthlyOrdersDate: month, monthlyOrdersTier: tier })
    },

    // orderType: 'daily' | 'weekly' | 'monthly'
    fulfillOrder: (orderId, orderType = 'daily') => {
      const state = get()
      const listKey = orderType === 'weekly' ? 'weeklyOrders' : orderType === 'monthly' ? 'monthlyOrders' : 'dailyOrders'
      const order = (state[listKey] ?? []).find(o => o.id === orderId)
      if (!order || order.fulfilled) return { error: 'Order not available' }

      const potions = state.potionInventory ?? {}
      const inv     = state.inventory ?? {}

      // Check all items are in stock
      for (const item of order.items) {
        const have = item.type === 'potion' ? (potions[item.id] ?? 0) : (inv[item.id] ?? 0)
        if (have < item.qty) return { error: 'Not enough items' }
      }

      // Deduct items
      const newPotions = { ...potions }
      const newInv     = { ...inv }
      for (const item of order.items) {
        if (item.type === 'potion') {
          newPotions[item.id] = (newPotions[item.id] ?? 0) - item.qty
        } else {
          newInv[item.id] = (newInv[item.id] ?? 0) - item.qty
        }
      }

      set(state => ({
        potionInventory: newPotions,
        inventory: newInv,
        [listKey]: state[listKey].map(o => o.id === orderId ? { ...o, fulfilled: true } : o),
      }))

      get().addGold(order.goldReward)
      if (order.xpReward) get().awardXP(order.xpReward)
      applyOrderBonus(order.bonus, get, set)

      return { success: true }
    },
  }
}

function applyOrderBonus(bonus, get, set) {
  if (!bonus) return
  switch (bonus.type) {
    case 'gold':
      get().addGold(bonus.amount)
      break
    case 'xp':
      get().awardXP(bonus.amount)
      break
    case 'seed':
      get().addSeed(bonus.seedId, bonus.qty ?? 1)
      break
    case 'ore':
      set(state => ({
        oreInventory: { ...state.oreInventory, [bonus.oreId]: (state.oreInventory[bonus.oreId] ?? 0) + bonus.qty },
      }))
      break
  }
}
