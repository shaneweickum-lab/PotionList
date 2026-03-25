import { SEEDS } from './seeds.js'

export const CONSUMABLES = [
  {
    id: 'bug_feed',
    name: 'Bug Feed',
    goldCost: 20,
    category: 'consumable',
    description: 'Nutritious compound for the bug farm. Required for breeding.',
  },
]

export const SHOP_ITEMS = {
  seeds: SEEDS.map(s => ({
    id: s.id,
    name: s.name,
    goldCost: s.goldCost,
    tab: 'seeds',
    category: 'seed',
    description: `Grows into ${s.name.replace(' Seed', '').replace(' Spore', '')}.`,
  })),

  tools: [
    {
      id: 'iron_hoe',
      name: 'Iron Hoe',
      goldCost: 180,
      tab: 'tools',
      category: 'tool',
      description: 'Unlocks 1 additional garden plot. Reduces future plot costs based on your level.',
      effect: 'gardenSlot+1',
      oneTime: true,
    },
    {
      id: 'watering_can',
      name: 'Watering Can',
      goldCost: 320,
      tab: 'tools',
      category: 'tool',
      description: 'Reduces all garden growth time by 10% (×0.9 multiplier). Stacks with Greenhouse.',
      effect: 'growthMod×0.9',
      oneTime: true,
    },
  ],

  garden: [
    {
      id: 'garden_plot',
      name: 'Garden Plot',
      goldCost: 500,
      tab: 'garden',
      category: 'plot',
      description: 'Adds 1 garden slot. Price increases with each purchase. Max 20 slots.',
      effect: 'gardenSlots+1',
      repeatable: true,
    },
    {
      id: 'greenhouse',
      name: 'Greenhouse',
      goldCost: 900,
      tab: 'garden',
      category: 'structure',
      description: 'Reduces all garden growth time by 20% (×0.8 multiplier). Stacks with Watering Can.',
      effect: 'growthMod×0.8',
      oneTime: true,
    },
    {
      id: 'herb_rack',
      name: 'Herb Rack',
      goldCost: 150,
      tab: 'garden',
      category: 'decor',
      description: 'A drying rack for your garden. Decorative but beloved.',
      effect: 'decor',
      oneTime: true,
    },
    {
      id: 'stone_path',
      name: 'Stone Path',
      goldCost: 120,
      tab: 'garden',
      category: 'decor',
      description: 'Neat cobblestone between the garden rows.',
      effect: 'decor',
      oneTime: true,
    },
    {
      id: 'moonlamp',
      name: 'Moonlamp',
      goldCost: 200,
      tab: 'garden',
      category: 'decor',
      description: 'A softly glowing lantern for night harvests.',
      effect: 'decor',
      oneTime: true,
    },
  ],
}

// Cauldron upgrades (forged in smithy)
export const CAULDRON_UPGRADES = [
  {
    id: 'copper_cauldron',
    name: 'Copper Cauldron',
    tier: 2,
    unlockLevel: 10,
    recipe: { copper_ingot: 3 },
    goldCost: 100,
    description: 'Unlocks 2-ingredient potions and faster brew times.',
  },
  {
    id: 'obsidian_cauldron',
    name: 'Obsidian Cauldron',
    tier: 3,
    unlockLevel: 25,
    recipe: { iron_ingot: 5, obsidian: 3 },
    goldCost: 300,
    description: 'Unlocks 3-ingredient potions and complex recipes.',
  },
  {
    id: 'starforged_cauldron',
    name: 'Starforged Cauldron',
    tier: 4,
    unlockLevel: 60,
    recipe: { mithril_ingot: 4, gold_ingot: 2, moonstone: 1 },
    goldCost: 800,
    description: 'The pinnacle of alchemical craft. All recipes unlocked.',
  },
]

// Silver Alembic (forged in smithy)
export const ALEMBIC = {
  id: 'silver_alembic',
  name: 'Silver Alembic',
  unlockLevel: 80,
  recipe: { silver_ingot: 6, mithril_ingot: 2 },
  goldCost: 1500,
  description: 'Doubles the yield of all brews. Distillation is an art.',
}

// IAP Products
export const IAP_PRODUCTS = [
  {
    id: 'seed_packet',
    name: "Wanderer's Seed Packet",
    price: '$1.99',
    priceAmount: 199,
    description: '5 curated seeds: 2 common, 2 uncommon, 1 rare.',
    icon: '🌱',
    color: '#5a9e6f',
    rcProductId: 'potionlist_seed_packet_199',
  },
  {
    id: 'alchemist_pouch',
    name: "Alchemist's Pouch",
    price: '$4.99',
    priceAmount: 499,
    description: '800 gold + a selection of seeds and ores to get you started.',
    icon: '👜',
    color: '#c9a227',
    rcProductId: 'potionlist_alchemist_pouch_499',
  },
  {
    id: 'wanderers_cache',
    name: "Wanderer's Cache",
    price: '$9.99',
    priceAmount: 999,
    description: '2000 gold + rare seeds + ores + 3 rare bugs.',
    icon: '🎒',
    color: '#9b6bb5',
    rcProductId: 'potionlist_wanderers_cache_999',
  },
  {
    id: 'founders_chest',
    name: "Founder's Chest",
    price: '$19.99',
    priceAmount: 1999,
    description: '5000 gold + epic seeds + ores + 5 bugs + early 2nd mine slot + 5 garden plots + cauldron skip + Founder title.',
    icon: '📦',
    color: '#e07b39',
    rcProductId: 'potionlist_founders_chest_1999',
    bestValue: true,
  },
]
