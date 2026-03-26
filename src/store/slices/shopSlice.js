import { SEED_MAP } from '../../constants/seeds.js'
import { HERB_MAP } from '../../constants/herbs.js'
import { MUSHROOM_MAP } from '../../constants/mushrooms.js'

function todayDate() {
  return new Date().toISOString().slice(0, 10)
}

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function buildDailyStock() {
  const all = Object.values(SEED_MAP)

  // 5 common seeds/spores chosen at random
  const commonPool = shuffle(all.filter(s => s.rarity === 'common'))

  // 1 featured slot: uncommon or rare that has a goldCost (epic = task-only, no goldCost)
  const featuredPool = shuffle(
    all.filter(s => (s.rarity === 'uncommon' || s.rarity === 'rare') && s.goldCost)
  )

  return {
    lastResetDate: todayDate(),
    commonSlots: commonPool.slice(0, 5).map(s => ({ seedId: s.id, stock: 3, maxStock: 3 })),
    featuredSlot: featuredPool[0]
      ? { seedId: featuredPool[0].id, stock: 1, maxStock: 1 }
      : null,
  }
}

export function createShopSlice(set, get) {
  return {
    shopStock: {
      lastResetDate: null,
      commonSlots: [],
      featuredSlot: null,
    },

    refreshShopStock: () => {
      const { shopStock } = get()
      if (shopStock.lastResetDate === todayDate() && shopStock.commonSlots.length > 0) return
      set({ shopStock: buildDailyStock() })
    },

    buyShopSeed: (seedId) => {
      const state = get()
      const seed = SEED_MAP[seedId]
      if (!seed?.goldCost) return { error: 'Unknown seed' }
      if ((state.gold ?? 0) < seed.goldCost) return { error: 'Not enough gold' }

      const stock = state.shopStock
      const commonIdx = stock.commonSlots.findIndex(s => s.seedId === seedId)

      if (commonIdx !== -1) {
        if (stock.commonSlots[commonIdx].stock <= 0) return { error: 'Out of stock' }
        state.spendGold(seed.goldCost)
        state.addSeed(seedId, 1)
        set({
          shopStock: {
            ...stock,
            commonSlots: stock.commonSlots.map((s, i) =>
              i === commonIdx ? { ...s, stock: s.stock - 1 } : s
            ),
          },
        })
        return { success: true }
      }

      if (stock.featuredSlot?.seedId === seedId) {
        if (stock.featuredSlot.stock <= 0) return { error: 'Out of stock' }
        state.spendGold(seed.goldCost)
        state.addSeed(seedId, 1)
        set({
          shopStock: {
            ...stock,
            featuredSlot: { ...stock.featuredSlot, stock: 0 },
          },
        })
        return { success: true }
      }

      return { error: 'Not in shop' }
    },
  }
}

// Helper consumed by ShopTab to get display info for a seed
export function getSeedDisplayInfo(seedId) {
  const seed = SEED_MAP[seedId]
  if (!seed) return null
  const yieldItem = HERB_MAP[seed.yields] ?? MUSHROOM_MAP[seed.yields]
  return { seed, yieldItem }
}
