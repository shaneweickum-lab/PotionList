import { ORDER_CHARACTERS, ORDER_BONUSES } from '../constants/orders.js'
import { POTIONS, POTION_MAP } from '../constants/potions.js'
import { RARE_SEEDS } from '../constants/seeds.js'

// Seeded PRNG (mulberry32)
function mulberry32(seed) {
  return function () {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function stringToSeed(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0
  }
  return hash
}

const APP_SALT = 'potionlist_orders_v1'

export function generateDailyOrders(dateStr) {
  // dateStr: 'YYYY-MM-DD' UTC
  const seed = stringToSeed(dateStr + APP_SALT)
  const rand = mulberry32(seed)

  const characters = [...ORDER_CHARACTERS]
  const orders = []

  // Pick 3 unique characters
  const used = new Set()
  while (orders.length < 3) {
    const charIdx = Math.floor(rand() * characters.length)
    const char = characters[charIdx]
    if (used.has(char.id)) continue
    used.add(char.id)

    // Pick a potion from that character's preferred list
    const potionId = char.preferredPotions[Math.floor(rand() * char.preferredPotions.length)]
    const potion = POTION_MAP[potionId]
    if (!potion) continue

    // Qty 1-3
    const qty = Math.floor(rand() * 3) + 1

    // Gold reward: ~1.4-2x market value * qty
    const goldReward = Math.floor(potion.sellValue * qty * (1.4 + rand() * 0.6))

    // Bonus
    const bonusType = ORDER_BONUSES[Math.floor(rand() * ORDER_BONUSES.length)]
    const bonus = buildBonus(bonusType, rand)

    orders.push({
      id: `${dateStr}_${char.id}`,
      characterId: char.id,
      potionId,
      qty,
      goldReward,
      bonus,
      fulfilled: false,
    })
  }

  return orders
}

function buildBonus(bonusType, rand) {
  switch (bonusType.type) {
    case 'gold':
      return { type: 'gold', amount: 50 + Math.floor(rand() * 150) }
    case 'seed': {
      const seed = RARE_SEEDS[Math.floor(rand() * RARE_SEEDS.length)]
      return { type: 'seed', seedId: seed.id }
    }
    case 'ore':
      return { type: 'ore', oreId: 'silver_ore', qty: 2 + Math.floor(rand() * 3) }
    case 'xp':
      return { type: 'xp', amount: 50 + Math.floor(rand() * 100) }
    default:
      return { type: 'gold', amount: 50 }
  }
}

export function getTodayUTCString() {
  const now = new Date()
  return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}-${String(now.getUTCDate()).padStart(2, '0')}`
}

export function getMsUntilMidnightUTC() {
  const now = new Date()
  const midnight = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1))
  return midnight.getTime() - now.getTime()
}
