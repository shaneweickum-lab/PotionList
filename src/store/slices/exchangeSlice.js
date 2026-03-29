export function createExchangeSlice(set, get) {
  return {
    // portfolio: { [commodityId]: { units: number, avgBuyPrice: number } }
    portfolio: {},

    buyShares: (commodityId, units, price) => {
      const state = get()
      if (units < 1) return { error: 'Invalid quantity' }
      const total = units * price
      if ((state.gold ?? 0) < total) return { error: 'Not enough gold' }

      state.spendGold(total)

      const existing = state.portfolio?.[commodityId] ?? { units: 0, avgBuyPrice: 0 }
      const newUnits = existing.units + units
      const newAvg = Math.round(
        (existing.units * existing.avgBuyPrice + units * price) / newUnits
      )

      set(state => ({
        portfolio: {
          ...state.portfolio,
          [commodityId]: { units: newUnits, avgBuyPrice: newAvg },
        },
      }))

      return { success: true }
    },

    sellShares: (commodityId, units, price) => {
      const state = get()
      const existing = state.portfolio?.[commodityId]
      if (!existing || existing.units < units) return { error: 'Not enough shares' }
      if (units < 1) return { error: 'Invalid quantity' }

      const gold = units * price
      state.addGold(gold)

      const newUnits = existing.units - units
      set(state => ({
        portfolio: {
          ...state.portfolio,
          [commodityId]: newUnits > 0
            ? { ...existing, units: newUnits }
            : { units: 0, avgBuyPrice: 0 },
        },
      }))

      return { success: true, gold }
    },
  }
}
