// Community orders rotate weekly. Pool is grouped in sets of 3 — each week shows one set.
export const COMMUNITY_ORDER_POOL = [
  // Week group A
  {
    id: 'silverleaf_surge',
    name: 'Silverleaf Surge',
    description: 'The village healers are running low on their most basic stock. All alchemists are asked to contribute.',
    itemType: 'herb', itemId: 'silverleaf',
    totalQty: 120, rewardGold: 480, rewardXP: 200,
  },
  {
    id: 'healing_drive',
    name: 'Healing Drive',
    description: "Commander Thresh has requested potions for the city watch. Lives may depend on a full stock.",
    itemType: 'potion', itemId: 'minor_healing',
    totalQty: 40, rewardGold: 960, rewardXP: 300,
  },
  {
    id: 'stoneback_cache',
    name: 'Stoneback Cache',
    description: 'The miners burn stoneback mushrooms to light the deep shafts. They need a resupply.',
    itemType: 'mushroom', itemId: 'stoneback',
    totalQty: 100, rewardGold: 560, rewardXP: 220,
  },

  // Week group B
  {
    id: 'iron_stockpile',
    name: 'Iron Stockpile',
    description: "The smithy's furnaces go cold without iron. A bulk order from the eastern guild must be filled.",
    itemType: 'ore', itemId: 'iron_ore',
    totalQty: 150, rewardGold: 600, rewardXP: 240,
  },
  {
    id: 'moonbloom_gathering',
    name: 'Moonbloom Gathering',
    description: 'Serevane requires a large store of moonbloom for a ritual at the Hollow. She is not patient.',
    itemType: 'herb', itemId: 'moonbloom',
    totalQty: 80, rewardGold: 720, rewardXP: 280,
  },
  {
    id: 'stamina_reserves',
    name: 'Stamina Reserves',
    description: 'A merchant caravan is preparing for the mountain crossing. They need stamina brews for the journey.',
    itemType: 'potion', itemId: 'stamina',
    totalQty: 35, rewardGold: 980, rewardXP: 320,
  },

  // Week group C
  {
    id: 'whispergrass_harvest',
    name: 'Whispergrass Harvest',
    description: 'Olwen is training a new class of herbalists. Whispergrass is the foundation of every lesson.',
    itemType: 'herb', itemId: 'whispergrass',
    totalQty: 160, rewardGold: 520, rewardXP: 210,
  },
  {
    id: 'copper_rush',
    name: 'Copper Rush',
    description: 'A foundry in the capital placed a large copper order. Miners are encouraged to contribute.',
    itemType: 'ore', itemId: 'copper_ore',
    totalQty: 200, rewardGold: 560, rewardXP: 200,
  },
  {
    id: 'clarity_batch',
    name: 'Clarity Batch',
    description: "Voss the Scholar needs a stockpile of clarity potions. He claims it's for research. It's always research.",
    itemType: 'potion', itemId: 'clarity',
    totalQty: 30, rewardGold: 1100, rewardXP: 400,
  },
]

// ISO week string: "2025-W03"
export function getWeekString() {
  const now = new Date()
  const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))
  const day = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - day)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  const week = Math.ceil(((d - yearStart) / 86400000 + 1) / 7)
  return `${d.getUTCFullYear()}-W${String(week).padStart(2, '0')}`
}

// Milliseconds until next Monday 00:00 UTC (end of this ISO week)
export function getWeekEndMs() {
  const now = new Date()
  const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))
  const daysUntilMon = ((8 - (d.getUTCDay() || 7)) % 7) || 7
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + daysUntilMon) - Date.now()
}

// Pick a deterministic group of 3 orders for the given week
function hashWeek(weekStr) {
  let h = 0
  for (const c of weekStr) h = (Math.imul(h, 31) + c.charCodeAt(0)) >>> 0
  return h
}

export function getWeekOrders(weekString) {
  const groups = Math.floor(COMMUNITY_ORDER_POOL.length / 3)
  const g = hashWeek(weekString) % groups
  return COMMUNITY_ORDER_POOL.slice(g * 3, g * 3 + 3)
}
