import { HERBS } from './herbs.js'
import { MUSHROOMS } from './mushrooms.js'

// rarity is embedded directly so shopSlice can filter without extra imports
export const SEEDS = [
  // ── Common herbs ──
  { id: 'silverleaf_seed',    yields: 'silverleaf',   type: 'herb',     rarity: 'common',   growthThreshold: 40,  goldCost: 40, name: 'Silverleaf Seed' },
  { id: 'dewcap_seed',        yields: 'dewcap',       type: 'herb',     rarity: 'common',   growthThreshold: 45,  goldCost: 42, name: 'Dewcap Seed' },
  { id: 'ashroot_seed',       yields: 'ashroot',      type: 'herb',     rarity: 'common',   growthThreshold: 50,  goldCost: 44, name: 'Ashroot Seed' },
  { id: 'ironwort_seed',      yields: 'ironwort',     type: 'herb',     rarity: 'common',   growthThreshold: 55,  goldCost: 45, name: 'Ironwort Seed' },
  { id: 'whispergrass_seed',  yields: 'whispergrass', type: 'herb',     rarity: 'common',   growthThreshold: 35,  goldCost: 38, name: 'Whispergrass Seed' },
  { id: 'spiritmint_seed',    yields: 'spiritmint',   type: 'herb',     rarity: 'common',   growthThreshold: 70,  goldCost: 48, name: 'Spiritmint Seed' },
  // ── Uncommon herbs ──
  { id: 'moonbloom_seed',     yields: 'moonbloom',    type: 'herb',     rarity: 'uncommon', growthThreshold: 80,  goldCost: 52, name: 'Moonbloom Seed' },
  { id: 'verdant_moss_seed',  yields: 'verdant_moss', type: 'herb',     rarity: 'uncommon', growthThreshold: 75,  goldCost: 50, name: 'Verdant Moss Seed' },
  { id: 'firethorn_seed',     yields: 'firethorn',    type: 'herb',     rarity: 'uncommon', growthThreshold: 90,  goldCost: 54, name: 'Firethorn Seed' },
  { id: 'duskpetal_seed',     yields: 'duskpetal',    type: 'herb',     rarity: 'uncommon', growthThreshold: 85,  goldCost: 53, name: 'Duskpetal Seed' },
  // ── Common mushrooms ──
  { id: 'gloomcap_spore',     yields: 'gloomcap',     type: 'mushroom', rarity: 'common',   growthThreshold: 50,  goldCost: 43, name: 'Gloomcap Spore' },
  { id: 'brightfungus_spore', yields: 'brightfungus', type: 'mushroom', rarity: 'common',   growthThreshold: 45,  goldCost: 41, name: 'Brightfungus Spore' },
  { id: 'stoneback_spore',    yields: 'stoneback',    type: 'mushroom', rarity: 'common',   growthThreshold: 55,  goldCost: 44, name: 'Stoneback Spore' },
  { id: 'rotmoss_spore',      yields: 'rotmoss',      type: 'mushroom', rarity: 'common',   growthThreshold: 40,  goldCost: 39, name: 'Rotmoss Spore' },
  { id: 'dustshroom_spore',   yields: 'dustshroom',   type: 'mushroom', rarity: 'common',   growthThreshold: 45,  goldCost: 41, name: 'Dustshroom Spore' },
  // ── Uncommon mushrooms ──
  { id: 'dewshroom_spore',    yields: 'dewshroom',    type: 'mushroom', rarity: 'uncommon', growthThreshold: 70,  goldCost: 50, name: 'Dewshroom Spore' },
  { id: 'crimson_puff_spore', yields: 'crimson_puff', type: 'mushroom', rarity: 'uncommon', growthThreshold: 80,  goldCost: 53, name: 'Crimson Puff Spore' },

  // ── Common crop seeds ──
  { id: 'wheat_seed',     yields: 'wheat',     type: 'crop', rarity: 'common',   growthThreshold: 30, goldCost: 22, name: 'Wheat Seed' },
  { id: 'corn_seed',      yields: 'corn',      type: 'crop', rarity: 'common',   growthThreshold: 35, goldCost: 25, name: 'Corn Seed' },
  { id: 'potato_seed',    yields: 'potato',    type: 'crop', rarity: 'common',   growthThreshold: 32, goldCost: 22, name: 'Potato Seed' },
  { id: 'garlic_seed',    yields: 'garlic',    type: 'crop', rarity: 'common',   growthThreshold: 38, goldCost: 26, name: 'Garlic Seed' },
  { id: 'carrot_seed',    yields: 'carrot',    type: 'crop', rarity: 'common',   growthThreshold: 33, goldCost: 24, name: 'Carrot Seed' },
  { id: 'onion_seed',     yields: 'onion',     type: 'crop', rarity: 'common',   growthThreshold: 30, goldCost: 22, name: 'Onion Seed' },
  { id: 'cabbage_seed',   yields: 'cabbage',   type: 'crop', rarity: 'common',   growthThreshold: 28, goldCost: 20, name: 'Cabbage Seed' },
  { id: 'turnip_seed',    yields: 'turnip',    type: 'crop', rarity: 'common',   growthThreshold: 28, goldCost: 20, name: 'Turnip Seed' },
  { id: 'daisy_seed',     yields: 'daisy',     type: 'crop', rarity: 'common',   growthThreshold: 35, goldCost: 26, name: 'Daisy Seed' },
  { id: 'petunia_seed',   yields: 'petunia',   type: 'crop', rarity: 'common',   growthThreshold: 35, goldCost: 26, name: 'Petunia Seed' },
  { id: 'marigold_seed',  yields: 'marigold',  type: 'crop', rarity: 'common',   growthThreshold: 33, goldCost: 25, name: 'Marigold Seed' },
  { id: 'bluebell_seed',  yields: 'bluebell',  type: 'crop', rarity: 'common',   growthThreshold: 33, goldCost: 25, name: 'Bluebell Seed' },
  // ── Uncommon crop seeds ──
  { id: 'pumpkin_seed',   yields: 'pumpkin',   type: 'crop', rarity: 'uncommon', growthThreshold: 65, goldCost: 42, name: 'Pumpkin Seed' },
  { id: 'pepper_seed',    yields: 'pepper',    type: 'crop', rarity: 'uncommon', growthThreshold: 60, goldCost: 40, name: 'Red Pepper Seed' },
  { id: 'rose_seed',      yields: 'rose',      type: 'crop', rarity: 'uncommon', growthThreshold: 70, goldCost: 44, name: 'Rose Seed' },
  { id: 'sunflower_seed', yields: 'sunflower', type: 'crop', rarity: 'uncommon', growthThreshold: 65, goldCost: 42, name: 'Sunflower Seed' },
  { id: 'lavender_seed',  yields: 'lavender',  type: 'crop', rarity: 'uncommon', growthThreshold: 68, goldCost: 43, name: 'Lavender Seed' },
  { id: 'tulip_seed',     yields: 'tulip',     type: 'crop', rarity: 'uncommon', growthThreshold: 62, goldCost: 40, name: 'Tulip Seed' },
]

// Rare/epic seeds — found via task rolls; rare ones can appear in the featured shop slot
export const RARE_SEEDS = [
  { id: 'coldvine_seed',        yields: 'coldvine',        type: 'herb',     rarity: 'rare',     growthThreshold: 130, goldCost: 85,  name: 'Coldvine Cutting' },
  { id: 'goldthread_seed',      yields: 'goldthread',      type: 'herb',     rarity: 'rare',     growthThreshold: 140, goldCost: 95,  name: 'Goldthread Cutting' },
  { id: 'nightshade_pale_seed', yields: 'nightshade_pale', type: 'herb',     rarity: 'rare',     growthThreshold: 160, goldCost: 110, name: 'Pale Nightshade Seed' },
  { id: 'embervine_seed',       yields: 'embervine',       type: 'herb',     rarity: 'epic',     growthThreshold: 250, name: 'Embervine Cutting' },
  { id: 'voidleaf_seed',        yields: 'voidleaf',        type: 'herb',     rarity: 'epic',     growthThreshold: 300, name: 'Voidleaf Seed' },
  { id: 'spectral_cap_spore',   yields: 'spectral_cap',    type: 'mushroom', rarity: 'rare',     growthThreshold: 150, goldCost: 90,  name: 'Spectral Cap Spore' },
  { id: 'embercrown_spore',     yields: 'embercrown',      type: 'mushroom', rarity: 'rare',     growthThreshold: 140, goldCost: 90,  name: 'Embercrown Spore' },
  { id: 'shadowfung_spore',     yields: 'shadowfung',      type: 'mushroom', rarity: 'uncommon', growthThreshold: 90,  goldCost: 58,  name: 'Shadowfung Spore' },
  { id: 'moonshroom_spore',     yields: 'moonshroom',      type: 'mushroom', rarity: 'epic',     growthThreshold: 260, name: 'Moonshroom Spore' },
  { id: 'voidmold_spore',       yields: 'voidmold',        type: 'mushroom', rarity: 'epic',     growthThreshold: 310, name: 'Voidmold Spore' },
]

export const ALL_SEEDS = [...SEEDS, ...RARE_SEEDS]

export const SEED_MAP = Object.fromEntries(ALL_SEEDS.map(s => [s.id, s]))

// Weighted pool for seed find rolls (35% chance on task complete)
export const SEED_ROLL_POOL = [
  ...SEEDS.filter(s => s.rarity === 'common').flatMap(s => Array(6).fill(s.id)),
  ...SEEDS.filter(s => s.rarity === 'uncommon').flatMap(s => Array(3).fill(s.id)),
  ...RARE_SEEDS.filter(s => s.rarity === 'rare').flatMap(s => Array(1).fill(s.id)),
]
