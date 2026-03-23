import { IAP_PRODUCTS } from '../../constants/shop.js'

// Reward tables for each IAP product
const IAP_REWARDS = {
  seed_packet: {
    seeds: ['moonbloom_seed', 'firethorn_seed', 'silverleaf_seed', 'dewcap_seed', 'coldvine_seed'],
  },
  alchemist_pouch: {
    gold: 800,
    seeds: ['spiritmint_seed', 'verdant_moss_seed', 'gloomcap_spore'],
    ores: { copper_ore: 5, silver_ore: 3 },
  },
  wanderers_cache: {
    gold: 2000,
    seeds: ['goldthread_seed', 'spectral_cap_spore', 'shadowfung_spore'],
    ores: { gold_ore: 3, mithril_ore: 2, moonstone: 1 },
    bugs: ['moonmite', 'ashcrawler', 'glowgrub'],
  },
  founders_chest: {
    gold: 5000,
    seeds: ['embervine_seed', 'voidleaf_seed', 'moonshroom_spore', 'voidmold_spore', 'nightshade_pale_seed'],
    ores: { voidite: 2, embershard: 2, stardust: 3, mithril_ore: 3 },
    bugs: ['cinderfly', 'voidweevil', 'moonmite', 'ashcrawler', 'glowgrub'],
    extras: ['brom_trip2', 'garden_plots_5', 'cauldron_skip', 'title_founder'],
  },
}

export function createIAPSlice(set, get) {
  return {
    iapPurchases: [],
    iapLoading: false,
    iapError: null,

    recordIAPPurchase: (productId) => {
      set(state => ({
        iapPurchases: [...new Set([...state.iapPurchases, productId])],
      }))
    },

    applyIAPRewards: (productId) => {
      const rewards = IAP_REWARDS[productId]
      if (!rewards) return

      if (rewards.gold) get().addGold(rewards.gold)

      if (rewards.seeds) {
        rewards.seeds.forEach(seedId => get().addSeed(seedId, 1))
      }

      if (rewards.ores) {
        Object.entries(rewards.ores).forEach(([oreId, qty]) => {
          set(state => ({
            oreInventory: { ...state.oreInventory, [oreId]: (state.oreInventory[oreId] ?? 0) + qty },
          }))
        })
      }

      if (rewards.bugs) {
        rewards.bugs.forEach(bugId => {
          get().addToInventory(bugId, 1)
          get().discoverItem('bugs', bugId)
        })
      }

      if (rewards.extras) {
        if (rewards.extras.includes('brom_trip2')) {
          set({ bromTrip2Unlocked: true })
        }
        if (rewards.extras.includes('garden_plots_5')) {
          get().expandGarden(5)
        }
        if (rewards.extras.includes('cauldron_skip')) {
          set({ cauldronSkipAvailable: true })
        }
        if (rewards.extras.includes('title_founder')) {
          get().addTitle('Founder')
          get().setFounderUnlocked()
        }
      }

      get().recordIAPPurchase(productId)
    },

    hasIAPPurchase: (productId) => get().iapPurchases.includes(productId),
  }
}
