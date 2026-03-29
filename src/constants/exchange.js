// Tradeable commodities on the Exchange (Bourse)
export const COMMODITIES = [
  { id: 'grain',    name: 'Grain Market',    symbol: 'GRN', basePrice: 50,  volatility: 0.18 },
  { id: 'botanica', name: 'Botanical Trade', symbol: 'BOT', basePrice: 120, volatility: 0.22 },
  { id: 'potions',  name: 'Potion Exchange', symbol: 'POT', basePrice: 200, volatility: 0.28 },
  { id: 'ores',     name: 'Ore Works',       symbol: 'ORE', basePrice: 85,  volatility: 0.20 },
  { id: 'exotic',   name: 'Exotic Reagents', symbol: 'EXO', basePrice: 380, volatility: 0.32 },
  { id: 'spores',   name: 'Spore Market',    symbol: 'SPR', basePrice: 95,  volatility: 0.24 },
]

export const COMMODITY_MAP = Object.fromEntries(COMMODITIES.map(c => [c.id, c]))

// Prices update every 5 minutes
export const TICK_MS = 5 * 60 * 1000

export function currentTick() {
  return Math.floor(Date.now() / TICK_MS)
}

// Deterministic price for a given commodity and tick
// Uses overlapping sine waves to create organic, smooth price movement
function deterministicPrice(commodityId, tick) {
  const def = COMMODITY_MAP[commodityId]
  if (!def) return 0

  // Commodity-specific seed so each commodity moves differently
  const idSeed = commodityId.split('').reduce((a, c) => a + c.charCodeAt(0), 0)

  const slow  = Math.sin(tick * 0.07 + idSeed * 0.41) * def.volatility
  const mid   = Math.sin(tick * 0.23 + idSeed * 1.13) * def.volatility * 0.5
  const fast  = Math.sin(tick * 0.61 + idSeed * 2.07) * def.volatility * 0.25

  const mult = 1 + slow + mid + fast
  return Math.max(
    Math.round(def.basePrice * 0.35),
    Math.round(def.basePrice * mult)
  )
}

export function getCommodityPrice(commodityId, tick = null) {
  return deterministicPrice(commodityId, tick ?? currentTick())
}

export function getPriceHistory(commodityId, ticks = 16) {
  const tick = currentTick()
  return Array.from({ length: ticks }, (_, i) =>
    deterministicPrice(commodityId, tick - ticks + 1 + i)
  )
}
