import { HERB_MAP } from './herbs.js'
import { MUSHROOM_MAP } from './mushrooms.js'

export const BREED_TASKS_REQUIRED = 7

// Level required to unlock each rarity tier
export const BREED_LEVEL_GATES = { common: 1, uncommon: 15, rare: 30, epic: 50 }

// Per-bug breeding requirements
export const BREED_DEFS = {
  glowgrub: {
    ingredient:  'whispergrass',
    feedQty:     1,
    levelReq:    1,
    rarity:      'common',
    hatchXP:     30,
    lore:        'Kept in damp moss with whispergrass. The glow intensifies when a clutch is near.',
  },
  moonmite: {
    ingredient:  'moonbloom',
    feedQty:     1,
    levelReq:    15,
    rarity:      'uncommon',
    hatchXP:     60,
    lore:        'Moonbloom must be added at dusk. The mites will not mate in direct light.',
  },
  ashcrawler: {
    ingredient:  'ashroot',
    feedQty:     1,
    levelReq:    15,
    rarity:      'uncommon',
    hatchXP:     60,
    lore:        'Ground ashroot mixed into the bedding. Shells calcify quickly in the nest.',
  },
  voidweevil: {
    ingredient:  'shadowfung',
    feedQty:     2,
    levelReq:    30,
    rarity:      'rare',
    hatchXP:     120,
    lore:        'Shadow-fungus lines the chamber walls. What happens inside is not well documented.',
  },
  cinderfly: {
    ingredient:  'embercrown',
    feedQty:     3,
    levelReq:    50,
    rarity:      'epic',
    hatchXP:     250,
    lore:        'Embercrown ash beneath a heat-treated lid. Handle the nest with thick gloves.',
  },
}

export const FARMABLE_BUG_IDS = Object.keys(BREED_DEFS)

/** Resolve the display definition (herb or mushroom) for a breed's ingredient */
export function getIngredientDef(bugId) {
  const def = BREED_DEFS[bugId]
  if (!def) return null
  return HERB_MAP[def.ingredient] ?? MUSHROOM_MAP[def.ingredient] ?? null
}
