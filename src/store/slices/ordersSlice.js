import { generateDailyOrders, getTodayUTCString } from '../../lib/orderSeed.js'
import { POTION_MAP } from '../../constants/potions.js'

export function createOrdersSlice(set, get) {
  return {
    dailyOrders: [],
    ordersDate: null,

    refreshOrders: () => {
      const today = getTodayUTCString()
      if (get().ordersDate === today) return
      const orders = generateDailyOrders(today)
      set({ dailyOrders: orders, ordersDate: today })
    },

    fulfillOrder: (orderId) => {
      const state = get()
      const order = state.dailyOrders.find(o => o.id === orderId)
      if (!order || order.fulfilled) return { error: 'Order not available' }

      const potions = state.potionInventory ?? {}
      if ((potions[order.potionId] ?? 0) < order.qty) return { error: 'Not enough potions' }

      // Deduct potions
      set(state => ({
        potionInventory: {
          ...state.potionInventory,
          [order.potionId]: state.potionInventory[order.potionId] - order.qty,
        },
        dailyOrders: state.dailyOrders.map(o => o.id === orderId ? { ...o, fulfilled: true } : o),
      }))

      // Award gold
      get().addGold(order.goldReward)

      // Award bonus
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
      get().addSeed(bonus.seedId, 1)
      break
    case 'ore':
      set(state => ({
        oreInventory: { ...state.oreInventory, [bonus.oreId]: (state.oreInventory[bonus.oreId] ?? 0) + bonus.qty },
      }))
      break
  }
}
