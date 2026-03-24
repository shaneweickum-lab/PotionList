import { ALL_SEEDS, SEED_MAP } from '../constants/seeds.js'
import { HERBS } from '../constants/herbs.js'
import { MUSHROOMS } from '../constants/mushrooms.js'
import { BUGS } from '../constants/bugs.js'
import { MINE_TIERS } from '../constants/ores.js'

// Build rarity buckets once at load time
const RARITY_POOLS = { common: [], uncommon: [], rare: [], epic: [] }
ALL_SEEDS.forEach(s => {
  const yieldDef = [...HERBS, ...MUSHROOMS].find(h => h.id === s.yields)
  const r = yieldDef?.rarity ?? 'common'
  if (RARITY_POOLS[r]) RARITY_POOLS[r].push(s.id)
})

function lerp(a, b, t) { return a + (b - a) * t }

// Rarity weights by level.
// Level  1: common=85  uncommon=12  rare=3   epic=0
// Level 50: common=18  uncommon=37  rare=28  epic=17
function rarityWeights(level) {
  const t = Math.min(1, Math.max(0, (level - 1) / 49))
  return {
    common:   lerp(85, 18, t),
    uncommon: lerp(12, 37, t),
    rare:     lerp(3,  28, t),
    epic:     lerp(0,  17, t),
  }
}

// 35% chance to find a seed; rarity distribution scales with player level
export function rollSeedFind(level = 1) {
  if (Math.random() > 0.35) return null

  const w = rarityWeights(level)
  const total = w.common + w.uncommon + w.rare + w.epic
  let r = Math.random() * total
  let rarity
  if ((r -= w.common)   <= 0) rarity = 'common'
  else if ((r -= w.uncommon) <= 0) rarity = 'uncommon'
  else if ((r -= w.rare)     <= 0) rarity = 'rare'
  else                              rarity = 'epic'

  const pool = RARITY_POOLS[rarity]
  if (!pool?.length) {
    const fallback = RARITY_POOLS.common
    return fallback[Math.floor(Math.random() * fallback.length)] ?? null
  }
  return pool[Math.floor(Math.random() * pool.length)]
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
