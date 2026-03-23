export function createInventorySlice(set, get) {
  return {
    inventory: {},     // herbId/mushroomId/bugId → count
    seeds: {},         // seedId → count
    discovered: {
      herbs: [],
      mushrooms: [],
      bugs: [],
    },
    owned: [],         // shop item IDs

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

    purchaseShopItem: (itemId) => {
      set(state => ({
        owned: state.owned.includes(itemId) ? state.owned : [...state.owned, itemId],
      }))
    },

    isOwned: (itemId) => get().owned.includes(itemId),
  }
}
