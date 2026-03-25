import { ALL_HIDDEN_LORE_IDS } from '../../constants/hiddenLore.js'

export function createInventorySlice(set, get) {
  return {
    inventory: {},     // herbId/mushroomId/bugId → count
    seeds: {},         // seedId → count
    discovered: {
      herbs: [],
      mushrooms: [],
      bugs: [],
    },
    discoveredLore: [], // hidden lore IDs found via 1% rolls
    owned: [],          // shop item IDs

    addToInventory: (itemId, qty = 1) => {
      set(state => ({
        inventory: { ...state.inventory, [itemId]: (state.inventory[itemId] ?? 0) + qty },
      }))
    },

    removeFromInventory: (itemId, qty = 1) => {
      set(state => ({
        inventory: { ...state.inventory, [itemId]: Math.max(0, (state.inventory[itemId] ?? 0) - qty) },
      }))
    },

    addSeed: (seedId, qty = 1) => {
      set(state => ({
        seeds: { ...state.seeds, [seedId]: (state.seeds[seedId] ?? 0) + qty },
      }))
    },

    removeSeed: (seedId, qty = 1) => {
      set(state => ({
        seeds: { ...state.seeds, [seedId]: Math.max(0, (state.seeds[seedId] ?? 0) - qty) },
      }))
    },

    discoverItem: (category, itemId) => {
      const current = get().discovered[category] ?? []
      if (current.includes(itemId)) return
      set(state => ({
        discovered: {
          ...state.discovered,
          [category]: [...(state.discovered[category] ?? []), itemId],
        },
      }))
    },

    discoverLore: (id) => {
      if (get().discoveredLore.includes(id)) return
      set(state => ({ discoveredLore: [...state.discoveredLore, id] }))
    },

    rollLoreFind: () => {
      if (Math.random() >= 0.01) return null
      const undiscovered = ALL_HIDDEN_LORE_IDS.filter(id => !get().discoveredLore.includes(id))
      if (!undiscovered.length) return null
      const id = undiscovered[Math.floor(Math.random() * undiscovered.length)]
      get().discoverLore(id)
      return id
    },

    purchaseShopItem: (itemId) => {
      set(state => ({
        owned: state.owned.includes(itemId) ? state.owned : [...state.owned, itemId],
      }))
    },

    isOwned: (itemId) => get().owned.includes(itemId),
  }
}
