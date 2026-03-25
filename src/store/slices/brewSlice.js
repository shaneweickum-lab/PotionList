import { POTION_MAP } from '../../constants/potions.js'
import { scheduleLocalNotification } from '../../lib/pushNotifications.js'

export function createBrewSlice(set, get) {
  return {
    brewing: [],  // { id, potionId, finishAt, totalTime, qty, startedAt }
    potionInventory: {},
    cauldronTier: 1,
    cauldronSkipAvailable: false,
    cauldronSkipUsed: false,

    startBrew: (potionId, qty = 1) => {
      const potion = POTION_MAP[potionId]
      if (!potion) return { error: 'Unknown potion' }
      if (potion.cauldronTier > get().cauldronTier) return { error: 'Cauldron tier too low' }

      // Check ingredients
      const inv = get().inventory ?? {}
      for (const [ingId, needed] of Object.entries(potion.ingredients)) {
        if ((inv[ingId] ?? 0) < needed * qty) return { error: `Not enough ${ingId}` }
      }

      // Deduct ingredients
      const newInv = { ...inv }
      for (const [ingId, needed] of Object.entries(potion.ingredients)) {
        newInv[ingId] -= needed * qty
      }

      const totalTime = potion.brewTime * 1000
      const finishAt = Date.now() + totalTime
      const id = `brew_${Date.now()}_${Math.random().toString(36).slice(2)}`

      set(state => ({
        inventory: newInv,
        brewing: [...state.brewing, { id, potionId, finishAt, totalTime, qty, startedAt: Date.now() }],
      }))

      scheduleLocalNotification(
        `${potion.name} Ready`,
        `Your ${qty > 1 ? `${qty}x ` : ''}${potion.name} has finished brewing.`,
        totalTime,
        `brew_${potionId}`,
      )

      return { success: true, id }
    },

    completeBrew: (brewId) => {
      const state = get()
      const brew = state.brewing.find(b => b.id === brewId)
      if (!brew) return
      const potion = POTION_MAP[brew.potionId]
      const yield_ = (get().owned ?? []).includes('silver_alembic') ? brew.qty * 2 : brew.qty

      set(state => ({
        brewing: state.brewing.filter(b => b.id !== brewId),
        potionInventory: {
          ...state.potionInventory,
          [brew.potionId]: (state.potionInventory[brew.potionId] ?? 0) + yield_,
        },
      }))

      if (potion) get().awardXP(potion.xpReward * brew.qty)
    },

    removePotion: (potionId, qty = 1) => {
      set(state => ({
        potionInventory: {
          ...state.potionInventory,
          [potionId]: Math.max(0, (state.potionInventory[potionId] ?? 0) - qty),
        },
      }))
    },

    upgradeCauldron: (tier) => {
      set({ cauldronTier: tier })
    },

    useCauldronSkip: () => {
      const state = get()
      if (!state.cauldronSkipAvailable || state.cauldronSkipUsed) return false
      // Skip to next cauldron tier
      const current = state.cauldronTier
      if (current < 4) set({ cauldronTier: current + 1, cauldronSkipUsed: true })
      return true
    },

  }
}
