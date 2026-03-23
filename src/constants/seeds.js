import { HERBS } from './herbs.js'
import { MUSHROOMS } from './mushrooms.js'

// Seeds purchasable in the village shop (common/uncommon herbs and mushrooms only)
export const SEEDS = [
  // Common herbs
  { id: 'silverleaf_seed', yields: 'silverleaf', type: 'herb', growthThreshold: 40, goldCost: 40, name: 'Silverleaf Seed' },
  { id: 'dewcap_seed', yields: 'dewcap', type: 'herb', growthThreshold: 45, goldCost: 42, name: 'Dewcap Seed' },
  { id: 'ashroot_seed', yields: 'ashroot', type: 'herb', growthThreshold: 50, goldCost: 44, name: 'Ashroot Seed' },
  { id: 'ironwort_seed', yields: 'ironwort', type: 'herb', growthThreshold: 55, goldCost: 45, name: 'Ironwort Seed' },
  { id: 'whispergrass_seed', yields: 'whispergrass', type: 'herb', growthThreshold: 35, goldCost: 38, name: 'Whispergrass Seed' },
  { id: 'spiritmint_seed', yields: 'spiritmint', type: 'herb', growthThreshold: 70, goldCost: 48, name: 'Spiritmint Seed' },
  // Uncommon herbs (shop tier 2)
  { id: 'moonbloom_seed', yields: 'moonbloom', type: 'herb', growthThreshold: 80, goldCost: 52, name: 'Moonbloom Seed' },
  { id: 'verdant_moss_seed', yields: 'verdant_moss', type: 'herb', growthThreshold: 75, goldCost: 50, name: 'Verdant Moss Seed' },
  { id: 'firethorn_seed', yields: 'firethorn', type: 'herb', growthThreshold: 90, goldCost: 54, name: 'Firethorn Seed' },
  { id: 'duskpetal_seed', yields: 'duskpetal', type: 'herb', growthThreshold: 85, goldCost: 53, name: 'Duskpetal Seed' },
  // Common mushrooms
  { id: 'gloomcap_spore', yields: 'gloomcap', type: 'mushroom', growthThreshold: 50, goldCost: 43, name: 'Gloomcap Spore' },
  { id: 'brightfungus_spore', yields: 'brightfungus', type: 'mushroom', growthThreshold: 45, goldCost: 41, name: 'Brightfungus Spore' },
  { id: 'stoneback_spore', yields: 'stoneback', type: 'mushroom', growthThreshold: 55, goldCost: 44, name: 'Stoneback Spore' },
  { id: 'rotmoss_spore', yields: 'rotmoss', type: 'mushroom', growthThreshold: 40, goldCost: 39, name: 'Rotmoss Spore' },
  { id: 'dustshroom_spore', yields: 'dustshroom', type: 'mushroom', growthThreshold: 45, goldCost: 41, name: 'Dustshroom Spore' },
  // Uncommon mushrooms (shop tier 2)
  { id: 'dewshroom_spore', yields: 'dewshroom', type: 'mushroom', growthThreshold: 70, goldCost: 50, name: 'Dewshroom Spore' },
  { id: 'crimson_puff_spore', yields: 'crimson_puff', type: 'mushroom', growthThreshold: 80, goldCost: 53, name: 'Crimson Puff Spore' },
]

// Rare/epic seeds — found via task seed rolls, not purchasable
export const RARE_SEEDS = [
  { id: 'coldvine_seed', yields: 'coldvine', type: 'herb', growthThreshold: 130, name: 'Coldvine Cutting' },
  { id: 'goldthread_seed', yields: 'goldthread', type: 'herb', growthThreshold: 140, name: 'Goldthread Cutting' },
  { id: 'nightshade_pale_seed', yields: 'nightshade_pale', type: 'herb', growthThreshold: 160, name: 'Pale Nightshade Seed' },
  { id: 'embervine_seed', yields: 'embervine', type: 'herb', growthThreshold: 250, name: 'Embervine Cutting' },
  { id: 'voidleaf_seed', yields: 'voidleaf', type: 'herb', growthThreshold: 300, name: 'Voidleaf Seed' },
  { id: 'spectral_cap_spore', yields: 'spectral_cap', type: 'mushroom', growthThreshold: 150, name: 'Spectral Cap Spore' },
  { id: 'embercrown_spore', yields: 'embercrown', type: 'mushroom', growthThreshold: 140, name: 'Embercrown Spore' },
  { id: 'shadowfung_spore', yields: 'shadowfung', type: 'mushroom', growthThreshold: 90, name: 'Shadowfung Spore' },
  { id: 'moonshroom_spore', yields: 'moonshroom', type: 'mushroom', growthThreshold: 260, name: 'Moonshroom Spore' },
  { id: 'voidmold_spore', yields: 'voidmold', type: 'mushroom', growthThreshold: 310, name: 'Voidmold Spore' },
]

export const ALL_SEEDS = [...SEEDS, ...RARE_SEEDS]
export const SEED_MAP = Object.fromEntries(ALL_SEEDS.map(s => [s.id, s]))

// Weighted pool for seed find rolls (35% chance on task complete)
// Common seeds get weight 60, uncommon 30, rare 8, epic 2
export const SEED_ROLL_POOL = [
  ...SEEDS.filter(s => {
    const herb = [...HERBS, ...MUSHROOMS.map(m => ({ ...m }))].find(h => h.id === s.yields)
    return herb?.rarity === 'common'
  }).flatMap(s => Array(6).fill(s.id)),
  ...SEEDS.filter(s => {
    const herb = [...HERBS, ...MUSHROOMS.map(m => ({ ...m }))].find(h => h.id === s.yields)
    return herb?.rarity === 'uncommon'
  }).flatMap(s => Array(3).fill(s.id)),
  ...RARE_SEEDS.filter(s => {
    const herb = [...HERBS, ...MUSHROOMS.map(m => ({ ...m }))].find(h => h.id === s.yields)
    return herb?.rarity === 'rare'
  }).flatMap(s => Array(1).fill(s.id)),
]
