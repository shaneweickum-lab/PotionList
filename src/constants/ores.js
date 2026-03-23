export const ORES = [
  { id: 'copper_ore', name: 'Copper Ore', color: '#b87333', tier: 1 },
  { id: 'silver_ore', name: 'Silver Ore', color: '#c0c0c0', tier: 1 },
  { id: 'iron_ore', name: 'Iron Ore', color: '#8a8070', tier: 2 },
  { id: 'obsidian', name: 'Obsidian', color: '#282828', tier: 2 },
  { id: 'gold_ore', name: 'Gold Ore', color: '#c9a227', tier: 3 },
  { id: 'mithril_ore', name: 'Mithril Ore', color: '#88b8d8', tier: 3 },
  { id: 'moonstone', name: 'Moonstone', color: '#e8e8ff', tier: 3 },
  { id: 'stardust', name: 'Stardust', color: '#d8d0f8', tier: 4 },
  { id: 'voidite', name: 'Voidite', color: '#404060', tier: 4 },
  { id: 'embershard', name: 'Embershard', color: '#e07b39', tier: 4 },
]

export const INGOTS = [
  { id: 'copper_ingot', name: 'Copper Ingot', fromOre: 'copper_ore', ratio: 3, smeltTime: 600, color: '#b87333' },
  { id: 'silver_ingot', name: 'Silver Ingot', fromOre: 'silver_ore', ratio: 3, smeltTime: 900, color: '#c0c0c0' },
  { id: 'iron_ingot', name: 'Iron Ingot', fromOre: 'iron_ore', ratio: 3, smeltTime: 1200, color: '#8a8070' },
  { id: 'gold_ingot', name: 'Gold Ingot', fromOre: 'gold_ore', ratio: 4, smeltTime: 1800, color: '#c9a227' },
  { id: 'mithril_ingot', name: 'Mithril Ingot', fromOre: 'mithril_ore', ratio: 4, smeltTime: 2700, color: '#88b8d8' },
]

export const INGOT_MAP = Object.fromEntries(INGOTS.map(i => [i.id, i]))
export const ORE_MAP = Object.fromEntries(ORES.map(o => [o.id, o]))

export const MINE_TIERS = [
  {
    level: 1,
    name: 'Copper Vein',
    description: 'Shallow seams of copper and silver. Safe, steady.',
    tripTime: 4 * 3600,
    unlockLevel: 1,
    lootTable: [
      { id: 'copper_ore', weight: 55 },
      { id: 'silver_ore', weight: 35 },
      { id: 'iron_ore', weight: 10 },
    ],
    lootCount: { min: 4, max: 8 },
  },
  {
    level: 2,
    name: 'Iron Depths',
    description: 'Deeper shafts. Iron and obsidian veins. Brom takes a longer route.',
    tripTime: 3 * 3600,
    unlockLevel: 15,
    lootTable: [
      { id: 'iron_ore', weight: 45 },
      { id: 'obsidian', weight: 30 },
      { id: 'copper_ore', weight: 15 },
      { id: 'silver_ore', weight: 10 },
    ],
    lootCount: { min: 5, max: 8 },
  },
  {
    level: 3,
    name: 'Gold Seam',
    description: 'Old veins of gold and mithril. Requires experience and a good lantern.',
    tripTime: 2.5 * 3600,
    unlockLevel: 30,
    lootTable: [
      { id: 'gold_ore', weight: 30 },
      { id: 'mithril_ore', weight: 25 },
      { id: 'moonstone', weight: 20 },
      { id: 'iron_ore', weight: 15 },
      { id: 'obsidian', weight: 10 },
    ],
    lootCount: { min: 5, max: 9 },
  },
  {
    level: 4,
    name: 'The Void Hollow',
    description: 'A chamber discovered in the deepest mine. Brom doesn\'t speak of what he saw. Only what he found.',
    tripTime: 2 * 3600,
    unlockLevel: 50,
    lootTable: [
      { id: 'voidite', weight: 30 },
      { id: 'embershard', weight: 25 },
      { id: 'stardust', weight: 20 },
      { id: 'mithril_ore', weight: 15 },
      { id: 'moonstone', weight: 10 },
    ],
    lootCount: { min: 6, max: 10 },
  },
]

// Brom's barks — 5 per tier (tier index 0-3)
export const BROM_BARKS = [
  // Tier 1
  [
    "Found a good vein near the east wall. Arm's tired but the pack's heavy.",
    "Ceiling dripped on me for two hours. Worth it.",
    "Copper mostly. Some silver near the bottom. Not bad.",
    "Met the other miners. None of them talk much. I fit in.",
    "Quiet in there today. The good kind of quiet.",
  ],
  // Tier 2
  [
    "Obsidian cuts through gloves. Need new ones.",
    "Deep shafts today. Didn't see daylight for six hours.",
    "Found iron in a seam that shouldn't have iron in it. Brought it anyway.",
    "Something moved in the lower tunnel. I walked faster.",
    "Iron's heavy. Made two trips back to the surface.",
  ],
  // Tier 3
  [
    "Gold veins are thinner than the old-timers promised. Still gold.",
    "Mithril is cold to the touch. Even underground. Even in summer.",
    "Found a moonstone just sitting on the floor. Like it was waiting.",
    "The gold seam forks. Took the right branch. Good choice.",
    "Ran into a collapse. Took the long route home. Still worth it.",
  ],
  // Tier 4
  [
    "I won't describe what I saw down there. Here's what I brought back.",
    "The hollow is quiet in a way caves aren't supposed to be quiet.",
    "Voidite doesn't reflect light. It does something else.",
    "Lost track of time. Felt like two hours. Was seven.",
    "I'll go back. But not tomorrow.",
  ],
]

// Brom's hire dialogue (5 lines shown in sequence)
export const BROM_HIRE_DIALOGUE = [
  "Aye. Give me the coin and point me at the mountain.",
  "I know the mines better than the men who built the shafts.",
  "I don't ask what the ore's for. You don't ask what I find that I keep.",
  "Back by nightfall, or the morning after. Depends on the depth.",
  "Right then. I'll need my pick.",
]
