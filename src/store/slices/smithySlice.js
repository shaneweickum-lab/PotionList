import { INGOT_MAP, INGOTS } from '../../constants/ores.js'
import { CAULDRON_UPGRADES, ALEMBIC } from '../../constants/shop.js'
import { scheduleLocalNotification } from '../../lib/pushNotifications.js'

export function createSmithySlice(set, get) {
  return {
    smithing: [],  // { id, type, itemId, finishAt, totalTime, qty, startedAt }
    ingotInventory: {},

    startSmelt: (ingotId, qty = 1) => {
      const ingotDef = INGOT_MAP[ingotId]
      if (!ingotDef) return { error: 'Unknown ingot' }

      const oreNeeded = ingotDef.ratio * qty
      const oreInv = get().oreInventory ?? {}
      if ((oreInv[ingotDef.fromOre] ?? 0) < oreNeeded) return { error: 'Not enough ore' }

      // Deduct ore
      set(state => ({
        oreInventory: { ...state.oreInventory, [ingotDef.fromOre]: state.oreInventory[ingotDef.fromOre] - oreNeeded },
      }))

      const totalTime = ingotDef.smeltTime * qty * 1000
      const finishAt = Date.now() + totalTime
      const id = `smelt_${Date.now()}_${Math.random().toString(36).slice(2)}`

      set(state => ({
        smithing: [...state.smithing, { id, type: 'smelt', itemId: ingotId, finishAt, totalTime, qty, startedAt: Date.now() }],
      }))

      scheduleLocalNotification(
        'Smelting Complete',
        `Your ${ingotDef.name}${qty > 1 ? 's are' : ' is'} ready.`,
        totalTime,
        `smelt_${ingotId}`,
      )

      return { success: true, id }
    },

    completeSmelt: (smeltId) => {
      const smelt = get().smithing.find(s => s.id === smeltId)
      if (!smelt) return

      set(state => ({
        smithing: state.smithing.filter(s => s.id !== smeltId),
        ingotInventory: {
          ...state.ingotInventory,
          [smelt.itemId]: (state.ingotInventory[smelt.itemId] ?? 0) + smelt.qty,
        },
      }))
    },

    startForge: (upgradeId) => {
      const upgrade = [...CAULDRON_UPGRADES, ALEMBIC].find(u => u.id === upgradeId)
      if (!upgrade) return { error: 'Unknown upgrade' }

      // Check level
      if (get().level < upgrade.unlockLevel) return { error: `Requires level ${upgrade.unlockLevel}` }

      // Check ingredients
      const ingotInv = get().ingotInventory ?? {}
      const oreInv = get().oreInventory ?? {}
      for (const [itemId, qty] of Object.entries(upgrade.recipe)) {
        const fromIngots = (ingotInv[itemId] ?? 0)
        const fromOres = (oreInv[itemId] ?? 0)
        if (fromIngots < qty && fromOres < qty) return { error: `Need ${qty}x ${itemId}` }
      }

      // Check gold
      if ((get().gold ?? 0) < upgrade.goldCost) return { error: 'Not enough gold' }

      // Deduct
      const newIngotInv = { ...ingotInv }
      const newOreInv = { ...oreInv }
      for (const [itemId, qty] of Object.entries(upgrade.recipe)) {
        if ((newIngotInv[itemId] ?? 0) >= qty) {
          newIngotInv[itemId] -= qty
        } else {
          newOreInv[itemId] = (newOreInv[itemId] ?? 0) - qty
        }
      }
      get().spendGold(upgrade.goldCost)

      // Forge time: 30 minutes base
      const totalTime = 30 * 60 * 1000
      const finishAt = Date.now() + totalTime
      const id = `forge_${Date.now()}`

      set(state => ({
        ingotInventory: newIngotInv,
        oreInventory: newOreInv,
        smithing: [...state.smithing, { id, type: 'forge', itemId: upgradeId, finishAt, totalTime, qty: 1, startedAt: Date.now() }],
      }))

      return { success: true, id }
    },

    completeForge: (forgeId) => {
      const forge = get().smithing.find(s => s.id === forgeId)
      if (!forge) return

      set(state => ({
        smithing: state.smithing.filter(s => s.id !== forgeId),
        owned: [...(state.owned ?? []), forge.itemId],
      }))

      // Apply cauldron upgrade
      const upgrade = CAULDRON_UPGRADES.find(u => u.id === forge.itemId)
      if (upgrade) get().upgradeCauldron(upgrade.tier)
    },

    removeIngot: (ingotId, qty = 1) => {
      set(state => ({
        ingotInventory: {
          ...state.ingotInventory,
          [ingotId]: Math.max(0, (state.ingotInventory[ingotId] ?? 0) - qty),
        },
      }))
    },
  }
}
