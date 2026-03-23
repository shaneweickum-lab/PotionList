import { SEED_ROLL_POOL } from '../constants/seeds.js'
import { BUGS } from '../constants/bugs.js'
import { MINE_TIERS } from '../constants/ores.js'

// 35% chance to find a seed on task completion
export function rollSeedFind() {
  if (Math.random() > 0.35) return null
  if (!SEED_ROLL_POOL.length) return null
  return SEED_ROLL_POOL[Math.floor(Math.random() * SEED_ROLL_POOL.length)]
}

// 18% chance to find a bug on garden harvest
const BUG_WEIGHTS = { common: 50, uncommon: 30, rare: 15, epic: 5 }
const BUG_POOL = BUGS.flatMap(b => Array(BUG_WEIGHTS[b.rarity] ?? 10).fill(b.id))

export function rollBugFind() {
  if (Math.random() > 0.18) return null
  return BUG_POOL[Math.floor(Math.random() * BUG_POOL.length)]
}

// Roll mine loot for a given tier
export function rollMineLoot(tierLevel) {
  const tier = MINE_TIERS.find(t => t.level === tierLevel) ?? MINE_TIERS[0]
  const count = tier.lootCount.min + Math.floor(Math.random() * (tier.lootCount.max - tier.lootCount.min + 1))
  const totalWeight = tier.lootTable.reduce((s, e) => s + e.weight, 0)
  const results = {}
  for (let i = 0; i < count; i++) {
    let r = Math.random() * totalWeight
    for (const entry of tier.lootTable) {
      r -= entry.weight
      if (r <= 0) {
        results[entry.id] = (results[entry.id] ?? 0) + 1
        break
      }
    }
  }
  return results
}
