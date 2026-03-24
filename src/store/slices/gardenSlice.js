import { rollBugFind } from '../../lib/loot.js'
import { SEED_MAP } from '../../constants/seeds.js'

const INITIAL_SLOTS = 4
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

      // Check growth
      const currentGrowthXP = state.growthXP
      const growthAccumulated = currentGrowthXP - slot.growthXPAtPlant
      const growthMod = get().getGrowthMod()
      const threshold = seedDef.growthThreshold * growthMod
      if (growthAccumulated < threshold) return null

      const yieldId = seedDef.yields
      const bugFound = rollBugFind()

      // Add to inventory, discover, clear slot
      set(state => ({
        inventory: {
          ...state.inventory,
          [yieldId]: (state.inventory[yieldId] ?? 0) + 1,
          ...(bugFound ? { [bugFound]: (state.inventory[bugFound] ?? 0) + 1 } : {}),
        },
        garden: state.garden.map(s => s.slotId === slotId
          ? { ...s, seedId: null, plantedAt: null, growthXPAtPlant: 0 }
          : s
        ),
      }))

      // Discover items
      get().discoverItem(seedDef.type === 'herb' ? 'herbs' : 'mushrooms', yieldId)
      if (bugFound) get().discoverItem('bugs', bugFound)

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
      const timeProgress = slot.plantedAt
        ? (Date.now() - slot.plantedAt) / (seedDef.growthThreshold * GROWTH_MS_PER_POINT)
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
      const newCount = current + slots
      set(state => ({
        gardenSlotCount: newCount,
        garden: [
          ...state.garden,
          ...Array.from({ length: slots }, (_, i) => ({
            slotId: current + i,
            seedId: null,
            plantedAt: null,
            growthXPAtPlant: 0,
          })),
        ],
      }))
    },
  }
}
