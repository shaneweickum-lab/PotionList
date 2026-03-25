import { rollSeedFind } from './loot.js'

export const CHEST_TIERS = {
  common:   { name: 'Wooden Chest',  icon: '📦', color: '#7a5030', textColor: '#d4a870' },
  uncommon: { name: 'Iron Chest',    icon: '🗃️', color: '#6a7888', textColor: '#b0c0d4' },
  rare:     { name: 'Gold Chest',    icon: '🏆', color: '#c9a227', textColor: '#f0c842' },
  epic:     { name: 'Arcane Chest',  icon: '💎', color: '#8050b8', textColor: '#d090ff' },
}

export function getChestTier(level) {
  if (level >= 51) return 'epic'
  if (level >= 26) return 'rare'
  if (level >= 11) return 'uncommon'
  return 'common'
}

const GOLD_RANGE = {
  common:   [20,  60],
  uncommon: [50,  130],
  rare:     [100, 280],
  epic:     [250, 600],
}

const SEED_CHANCE = { common: 0.35, uncommon: 0.55, rare: 0.75, epic: 1.0 }
const ORE_CHANCE  = { common: 0,    uncommon: 0,    rare: 0.40, epic: 0.70 }

const ORE_POOL = {
  rare: ['copper_ore', 'iron_ore'],
  epic: ['silver_ore', 'gold_ore', 'mithril_ore'],
}

function rand(min, max) {
  return min + Math.floor(Math.random() * (max - min + 1))
}

export function rollChestLoot(level) {
  const tier = getChestTier(level)
  const [min, max] = GOLD_RANGE[tier]
  const gold = rand(min, max)
  const seed = Math.random() < SEED_CHANCE[tier] ? rollSeedFind(level) : null
  let ore = null
  if (Math.random() < ORE_CHANCE[tier]) {
    const pool = ORE_POOL[tier]
    if (pool) ore = pool[Math.floor(Math.random() * pool.length)]
  }
  return { tier, gold, seed, ore }
}
