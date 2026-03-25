import { rollMineLoot, rollMineGold } from '../../lib/loot.js'
import { MINE_TIERS } from '../../constants/ores.js'
import { scheduleLocalNotification } from '../../lib/pushNotifications.js'

export function createMineSlice(set, get) {
  return {
    mineTrips: [],  // { id, mineLevel, finishAt, totalTime, startedAt, completed, loot }
    oreInventory: {},
    mineLevel: 1,
    bromUnlocked: false,
    bromTrip2Unlocked: false,

    hireBrom: () => {
      const cost = 150
      if (!get().spendGold(cost)) return { error: 'Not enough gold' }
      set({ bromUnlocked: true })
      return { success: true }
    },

    getMaxTripSlots: () => {
      const { level, founderUnlocked, bromTrip2Unlocked } = get()
      const voidDiverBonus = get().hasSkill?.('void_diver') ? 1 : 0
      if (level >= 40) return 3 + voidDiverBonus
      if (level >= 20 || bromTrip2Unlocked || founderUnlocked) return 2 + voidDiverBonus
      return 1 + voidDiverBonus
    },

    startMineTrip: (mineLevel) => {
      if (!get().bromUnlocked) return { error: 'Hire Brom first' }
      const tier = MINE_TIERS.find(t => t.level === mineLevel)
      if (!tier) return { error: 'Invalid tier' }
      if (get().level < tier.unlockLevel) return { error: `Requires level ${tier.unlockLevel}` }

      const activeTrips = get().mineTrips.filter(t => !t.completed)
      if (activeTrips.length >= get().getMaxTripSlots()) return { error: 'No trip slots available' }

      const totalTime = tier.tripTime * 1000 * (get().hasSkill?.('broms_pace') ? 0.85 : 1)
      const finishAt = Date.now() + totalTime
      const id = `mine_${Date.now()}_${Math.random().toString(36).slice(2)}`

      set(state => ({
        mineTrips: [...state.mineTrips, {
          id,
          mineLevel,
          finishAt,
          totalTime,
          startedAt: Date.now(),
          completed: false,
          loot: null,
        }],
      }))

      scheduleLocalNotification(
        'Brom Has Returned',
        `Brom is back from the ${tier.name} with ore and a story.`,
        totalTime,
        `mine_${id}`,
      )

      return { success: true, id }
    },

    completeMineTrip: (tripId) => {
      const trip = get().mineTrips.find(t => t.id === tripId)
      if (!trip || trip.completed) return

      const effectiveLevel = get().hasSkill?.('deep_vein') ? Math.min(trip.mineLevel + 1, 5) : trip.mineLevel
      const loot = rollMineLoot(effectiveLevel)
      // keen_eye: add +1 ore of a random type in the loot
      if (get().hasSkill?.('keen_eye') && Object.keys(loot).length > 0) {
        const oreIds = Object.keys(loot)
        const bonusOre = oreIds[Math.floor(Math.random() * oreIds.length)]
        loot[bonusOre] = (loot[bonusOre] ?? 0) + 1
      }
      const tier = MINE_TIERS.find(t => t.level === trip.mineLevel)
      const barkIndex = Math.floor(Math.random() * 5)

      set(state => ({
        mineTrips: state.mineTrips.map(t => t.id === tripId
          ? { ...t, completed: true, loot, barkIndex, tier: trip.mineLevel }
          : t
        ),
        oreInventory: Object.entries(loot).reduce(
          (inv, [oreId, qty]) => ({ ...inv, [oreId]: (inv[oreId] ?? 0) + qty }),
          { ...state.oreInventory }
        ),
      }))

      // Gold find (10%)
      const foundGold = rollMineGold()
      if (foundGold) get().addGold(foundGold)

      // 1% chance to discover a hidden lore entry
      get().rollLoreFind()
    },

    collectMineTrip: (tripId) => {
      set(state => ({
        mineTrips: state.mineTrips.filter(t => t.id !== tripId),
      }))
    },

    unlockMineLevel: (level) => {
      set(state => ({ mineLevel: Math.max(state.mineLevel, level) }))
    },

    removeOre: (oreId, qty = 1) => {
      set(state => ({
        oreInventory: { ...state.oreInventory, [oreId]: Math.max(0, (state.oreInventory[oreId] ?? 0) - qty) },
      }))
    },
  }
}
