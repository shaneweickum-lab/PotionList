import { rollBugFind } from '../../lib/loot.js'
import { SEED_MAP } from '../../constants/seeds.js'

const INITIAL_SLOTS = 2
const MAX_GARDEN_SLOTS = 20
// Passive growth: 1 minute of real time per threshold point (e.g. threshold 40 = 40 min)
const GROWTH_MS_PER_POINT = 60_000

export function createGardenSlice(set, get) {
  return {
    // garden: array of { slotId, seedId, plantedAt, growthXPAtPlant }
    garden: Array.from({ length: INITIAL_SLOTS }, (_, i) => ({
      slotId: i,
      seedId: null,
      plantedAt: null,
      growthXPAtPlant: 0,
    })),
    gardenSlotCount: INITIAL_SLOTS,
    gardenPlotsBought: 0,

    plantSeed: (slotId, seedId) => {
      const state = get()
      const seeds = state.seeds ?? {}
      if (!seeds[seedId] || seeds[seedId] < 1) return false
      const garden = state.garden
      const slot = garden.find(s => s.slotId === slotId)
      if (!slot || slot.seedId !== null) return false

      // Deduct seed
      set(state => ({
        seeds: { ...state.seeds, [seedId]: (state.seeds[seedId] ?? 0) - 1 },
        garden: state.garden.map(s => s.slotId === slotId
          ? { ...s, seedId, plantedAt: Date.now(), growthXPAtPlant: state.growthXP }
          : s
        ),
      }))
      // Discover
      const seedDef = SEED_MAP[seedId]
      if (seedDef) get().discoverItem(seedDef.type === 'herb' ? 'herbs' : 'mushrooms', seedDef.yields)
      return true
    },

    harvestPlot: (slotId) => {
      const state = get()
      const slot = state.garden.find(s => s.slotId === slotId)
      if (!slot?.seedId) return null

      const seedDef = SEED_MAP[slot.seedId]
      if (!seedDef) return null

      // Check growth using the same combined time+XP progress as isSlotReady
      if (get().getGrowthProgress(slot.slotId) < 1) return null

      const yieldId = seedDef.yields
      const bugFound = rollBugFind()
      const baseQty = 1
        + (get().hasSkill?.('abundant_harvest') ? 1 : 0)
        + (get().hasSkill?.('rare_soil') && Math.random() < 0.20 ? 1 : 0)
      const recoveredSeed = get().hasSkill?.('seed_luck') && Math.random() < 0.30
      const doAutoReplant = get().hasSkill?.('eternal_garden') && Math.random() < 0.25
        && (get().seeds?.[slot.seedId] ?? 0) > 0

      // Add to inventory, discover, clear (or replant) slot
      set(state => {
        const seedDelta = (recoveredSeed ? 1 : 0) - (doAutoReplant ? 1 : 0)
        return {
          inventory: {
            ...state.inventory,
            [yieldId]: (state.inventory[yieldId] ?? 0) + baseQty,
            ...(bugFound ? { [bugFound]: (state.inventory[bugFound] ?? 0) + 1 } : {}),
          },
          seeds: seedDelta !== 0
            ? { ...state.seeds, [slot.seedId]: Math.max(0, (state.seeds[slot.seedId] ?? 0) + seedDelta) }
            : state.seeds,
          garden: state.garden.map(s => s.slotId === slotId
            ? doAutoReplant
              ? { ...s, plantedAt: Date.now(), growthXPAtPlant: state.growthXP }
              : { ...s, seedId: null, plantedAt: null, growthXPAtPlant: 0 }
            : s
          ),
        }
      })

      // Discover items
      get().discoverItem(seedDef.type === 'herb' ? 'herbs' : 'mushrooms', yieldId)
      if (bugFound) get().discoverItem('bugs', bugFound)

      // 1% chance to discover a hidden lore entry
      get().rollLoreFind()

      return { yieldId, bugFound }
    },

    isSlotReady: (slotId) => get().getGrowthProgress(slotId) >= 1,

    getGrowthProgress: (slotId) => {
      const state = get()
      const slot = state.garden.find(s => s.slotId === slotId)
      if (!slot?.seedId) return 0
      const seedDef = SEED_MAP[slot.seedId]
      if (!seedDef) return 0
      const growthMod = get().getGrowthMod()
      // Time-based passive growth: completes on its own over real time
      const timeMod = get().hasSkill?.('green_thumb') ? 0.85 : 1
      const timeProgress = slot.plantedAt
        ? (Date.now() - slot.plantedAt) / (seedDef.growthThreshold * GROWTH_MS_PER_POINT * timeMod)
        : 0
      // XP-based growth: completing tasks speeds things up
      const xpProgress = (state.growthXP - slot.growthXPAtPlant) / (seedDef.growthThreshold * growthMod)
      return Math.min(1, timeProgress + xpProgress)
    },

    getGrowthMod: () => {
      const owned = get().owned ?? []
      let mod = 1
      if (owned.includes('watering_can')) mod *= 0.9
      if (owned.includes('greenhouse')) mod *= 0.8
      return mod
    },

    expandGarden: (slots) => {
      const current = get().gardenSlotCount
      const actual = Math.min(slots, MAX_GARDEN_SLOTS - current)
      if (actual <= 0) return
      const newCount = current + actual
      set(state => ({
        gardenSlotCount: newCount,
        garden: [
          ...state.garden,
          ...Array.from({ length: actual }, (_, i) => ({
            slotId: current + i,
            seedId: null,
            plantedAt: null,
            growthXPAtPlant: 0,
          })),
        ],
      }))
    },

    incrementPlotsBought: () => set(state => ({ gardenPlotsBought: (state.gardenPlotsBought ?? 0) + 1 })),
    getNextPlotCost: () => Math.round(500 * Math.pow(1.5, get().gardenPlotsBought ?? 0)),
  }
}
