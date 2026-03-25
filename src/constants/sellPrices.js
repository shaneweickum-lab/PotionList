import { HERB_MAP } from './herbs.js'
import { MUSHROOM_MAP } from './mushrooms.js'
import { SEED_MAP } from './seeds.js'
import { POTION_MAP } from './potions.js'
import { ORE_MAP, INGOT_MAP } from './ores.js'

// ── Rarity-based pricing ──────────────────────────────────────────────────────

const HERB_BY_RARITY     = { common: 5,  uncommon: 12, rare: 25, epic: 50 }
const MUSHROOM_BY_RARITY = { common: 6,  uncommon: 14, rare: 28, epic: 55 }
const SEED_BY_RARITY     = { common: 8,  uncommon: 16, rare: 32, epic: 60 }

export const HERB_SELL = Object.fromEntries(
  Object.entries(HERB_MAP).map(([id, h]) => [id, HERB_BY_RARITY[h.rarity] ?? 5])
)

export const MUSHROOM_SELL = Object.fromEntries(
  Object.entries(MUSHROOM_MAP).map(([id, m]) => [id, MUSHROOM_BY_RARITY[m.rarity] ?? 6])
)

export const SEED_SELL = Object.fromEntries(
  Object.entries(SEED_MAP).map(([id, seed]) => {
    const yieldDef = HERB_MAP[seed.yields] ?? MUSHROOM_MAP[seed.yields]
    return [id, SEED_BY_RARITY[yieldDef?.rarity ?? 'common']]
  })
)

// ── Usable bugs only (first 5 — potion ingredients) ───────────────────────────
export const USABLE_BUG_IDS = new Set(['glowgrub', 'moonmite', 'ashcrawler', 'voidweevil', 'cinderfly'])

export const BUG_SELL = {
  glowgrub:   12,
  moonmite:   22,
  ashcrawler: 22,
  voidweevil: 45,
  cinderfly:  90,
}

// ── Potions — use sellValue from potions.js ────────────────────────────────────
export const POTION_SELL = Object.fromEntries(
  Object.entries(POTION_MAP).map(([id, p]) => [id, p.sellValue ?? 10])
)

// ── Ores ──────────────────────────────────────────────────────────────────────
const ORE_PRICES = {
  copper_ore: 8,  silver_ore: 12, iron_ore: 16, obsidian: 20,
  gold_ore:   28, mithril_ore: 40, moonstone: 45,
  stardust:   65, voidite: 80,   embershard: 75,
}

export const ORE_SELL = Object.fromEntries(
  Object.entries(ORE_MAP).map(([id]) => [id, ORE_PRICES[id] ?? 10])
)

// ── Ingots ────────────────────────────────────────────────────────────────────
const INGOT_PRICES = {
  copper_ingot: 30,  silver_ingot: 40,  iron_ingot: 52,
  gold_ingot:   120, mithril_ingot: 175,
}

export const INGOT_SELL = Object.fromEntries(
  Object.entries(INGOT_MAP).map(([id]) => [id, INGOT_PRICES[id] ?? 20])
)
