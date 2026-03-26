import { ORDER_CHARACTERS, ORDER_BONUSES } from '../constants/orders.js'
import { POTION_MAP } from '../constants/potions.js'
import { HERBS } from '../constants/herbs.js'
import { MUSHROOMS } from '../constants/mushrooms.js'
import { BUG_MAP } from '../constants/bugs.js'
import { RARE_SEEDS } from '../constants/seeds.js'
import { HERB_SELL, MUSHROOM_SELL, BUG_SELL, POTION_SELL } from '../constants/sellPrices.js'
import { USABLE_BUG_IDS } from '../constants/sellPrices.js'

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

const APP_SALT    = 'potionlist_orders_v2'
const WEEKLY_SALT = 'potionlist_weekly_v1'
const MONTHLY_SALT = 'potionlist_monthly_v1'

const USABLE_BUGS = Object.values(BUG_MAP).filter(b => USABLE_BUG_IDS.has(b.id))

function getItemValue(type, id) {
  if (type === 'potion')   return POTION_SELL[id] ?? 10
  if (type === 'herb')     return HERB_SELL[id] ?? 5
  if (type === 'mushroom') return MUSHROOM_SELL[id] ?? 6
  if (type === 'bug')      return BUG_SELL[id] ?? 12
  return 10
}

// Pick a single request item — potion (filtered by cauldron tier) or ingredient
function pickItem(rand, cauldronTier, preferredPotions, forceIngredient = false) {
  const eligiblePotions = preferredPotions.filter(id => {
    const p = POTION_MAP[id]
    return p && p.cauldronTier <= cauldronTier
  })

  const useIngredient = forceIngredient || eligiblePotions.length === 0 || rand() < 0.25

  if (!useIngredient) {
    const potionId = eligiblePotions[Math.floor(rand() * eligiblePotions.length)]
    const qty = Math.floor(rand() * 3) + 1
    return { type: 'potion', id: potionId, qty }
  }

  const roll = rand()
  if (roll < 0.4) {
    const herb = HERBS[Math.floor(rand() * HERBS.length)]
    const qty = Math.floor(rand() * 5) + 2
    return { type: 'herb', id: herb.id, qty }
  } else if (roll < 0.75) {
    const mushroom = MUSHROOMS[Math.floor(rand() * MUSHROOMS.length)]
    const qty = Math.floor(rand() * 5) + 2
    return { type: 'mushroom', id: mushroom.id, qty }
  } else {
    const bug = USABLE_BUGS[Math.floor(rand() * USABLE_BUGS.length)]
    const qty = Math.floor(rand() * 3) + 1
    return { type: 'bug', id: bug.id, qty }
  }
}

export function generateDailyOrders(dateStr, cauldronTier = 1) {
  const seed = stringToSeed(dateStr + APP_SALT + cauldronTier)
  const rand = mulberry32(seed)

  const characters = [...ORDER_CHARACTERS]
  const orders = []
  const used = new Set()
  let attempts = 0

  while (orders.length < 3 && attempts < 30) {
    attempts++
    const char = characters[Math.floor(rand() * characters.length)]
    if (used.has(char.id)) continue
    used.add(char.id)

    const item = pickItem(rand, cauldronTier, char.preferredPotions)
    const baseValue = getItemValue(item.type, item.id)
    const goldReward = Math.floor(baseValue * item.qty * (1.4 + rand() * 0.6))

    const bonusType = ORDER_BONUSES[Math.floor(rand() * ORDER_BONUSES.length)]
    const bonus = buildBonus(bonusType, rand, 'daily')

    orders.push({
      id: `${dateStr}_${char.id}`,
      characterId: char.id,
      items: [item],
      goldReward,
      bonus,
      fulfilled: false,
    })
  }

  return orders
}

export function generateWeeklyOrders(weekStr, cauldronTier = 1) {
  const seed = stringToSeed(weekStr + WEEKLY_SALT + cauldronTier)
  const rand = mulberry32(seed)

  const characters = [...ORDER_CHARACTERS]
  const orders = []
  const used = new Set()
  let attempts = 0

  while (orders.length < 3 && attempts < 30) {
    attempts++
    const char = characters[Math.floor(rand() * characters.length)]
    if (used.has(char.id)) continue
    used.add(char.id)

    // 3–5 items per weekly order, mix of potions and ingredients
    const itemCount = 3 + Math.floor(rand() * 3)
    const items = []
    for (let i = 0; i < itemCount; i++) {
      items.push(pickItem(rand, cauldronTier, char.preferredPotions))
    }

    const baseTotal = items.reduce((sum, it) => sum + getItemValue(it.type, it.id) * it.qty, 0)
    const goldReward = Math.floor(baseTotal * (2.5 + rand() * 1.5))
    const xpReward   = Math.floor(150 + rand() * 150)

    const bonusType = ORDER_BONUSES[Math.floor(rand() * ORDER_BONUSES.length)]
    const bonus = buildBonus(bonusType, rand, 'weekly')

    orders.push({
      id: `${weekStr}_w_${char.id}`,
      characterId: char.id,
      items,
      goldReward,
      xpReward,
      bonus,
      fulfilled: false,
    })
  }

  return orders
}

export function generateMonthlyOrders(monthStr, cauldronTier = 1) {
  const seed = stringToSeed(monthStr + MONTHLY_SALT + cauldronTier)
  const rand = mulberry32(seed)

  const characters = [...ORDER_CHARACTERS]
  const orders = []
  const used = new Set()
  let attempts = 0

  while (orders.length < 2 && attempts < 30) {
    attempts++
    const char = characters[Math.floor(rand() * characters.length)]
    if (used.has(char.id)) continue
    used.add(char.id)

    // 5–8 items per monthly order
    const itemCount = 5 + Math.floor(rand() * 4)
    const items = []
    for (let i = 0; i < itemCount; i++) {
      items.push(pickItem(rand, cauldronTier, char.preferredPotions))
    }

    const baseTotal = items.reduce((sum, it) => sum + getItemValue(it.type, it.id) * it.qty, 0)
    const goldReward = Math.floor(baseTotal * (4 + rand() * 2))
    const xpReward   = Math.floor(400 + rand() * 300)

    const bonusType = ORDER_BONUSES[Math.floor(rand() * ORDER_BONUSES.length)]
    const bonus = buildBonus(bonusType, rand, 'monthly')

    orders.push({
      id: `${monthStr}_m_${char.id}`,
      characterId: char.id,
      items,
      goldReward,
      xpReward,
      bonus,
      fulfilled: false,
    })
  }

  return orders
}

function buildBonus(bonusType, rand, tier) {
  const goldMin  = tier === 'monthly' ? 300 : tier === 'weekly' ? 120 : 50
  const goldMax  = tier === 'monthly' ? 500 : tier === 'weekly' ? 200 : 150
  const xpMin    = tier === 'monthly' ? 300 : tier === 'weekly' ? 150 : 50
  const xpMax    = tier === 'monthly' ? 400 : tier === 'weekly' ? 200 : 100
  const oreMin   = tier === 'monthly' ? 5 : tier === 'weekly' ? 3 : 2
  const oreMax   = tier === 'monthly' ? 4 : tier === 'weekly' ? 3 : 3

  switch (bonusType.type) {
    case 'gold':
      return { type: 'gold', amount: goldMin + Math.floor(rand() * (goldMax - goldMin)) }
    case 'seed': {
      const seed = RARE_SEEDS[Math.floor(rand() * RARE_SEEDS.length)]
      const qty  = tier === 'monthly' ? 2 + Math.floor(rand() * 2) : 1
      return { type: 'seed', seedId: seed.id, qty }
    }
    case 'ore':
      return { type: 'ore', oreId: tier === 'monthly' ? 'gold_ore' : 'silver_ore', qty: oreMin + Math.floor(rand() * oreMax) }
    case 'xp':
      return { type: 'xp', amount: xpMin + Math.floor(rand() * (xpMax - xpMin)) }
    default:
      return { type: 'gold', amount: goldMin }
  }
}

export function getTodayUTCString() {
  const now = new Date()
  return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}-${String(now.getUTCDate()).padStart(2, '0')}`
}

export function getThisWeekUTCString() {
  const now = new Date()
  const day = now.getUTCDay() // 0=Sun
  const daysBack = day === 0 ? 6 : day - 1
  const monday = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - daysBack))
  return `${monday.getUTCFullYear()}-${String(monday.getUTCMonth() + 1).padStart(2, '0')}-${String(monday.getUTCDate()).padStart(2, '0')}`
}

export function getThisMonthUTCString() {
  const now = new Date()
  return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}`
}

export function getMsUntilMidnightUTC() {
  const now = new Date()
  const midnight = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1))
  return midnight.getTime() - now.getTime()
}

export function getMsUntilNextMondayUTC() {
  const now = new Date()
  const day = now.getUTCDay()
  const daysAhead = day === 0 ? 1 : 8 - day
  const nextMonday = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + daysAhead))
  return nextMonday.getTime() - now.getTime()
}

export function getMsUntilNextMonthUTC() {
  const now = new Date()
  const nextMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1))
  return nextMonth.getTime() - now.getTime()
}
