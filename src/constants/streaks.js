// Daily gifts for days 1-14 (awarded on first task each new streak day)
export const DAILY_GIFTS = [
  { day: 1, type: 'seeds', ids: ['whispergrass_seed', 'dewcap_seed'], lore: 'A beginning.' },
  { day: 2, type: 'gold', amount: 30, lore: 'The cauldron heats.' },
  { day: 3, type: 'seeds', ids: ['silverleaf_seed', 'ashroot_seed', 'gloomcap_spore'], lore: 'The garden deepens.' },
  { day: 4, type: 'gold', amount: 50, lore: 'Coin from a grateful merchant.' },
  { day: 5, type: 'seeds', ids: ['moonbloom_seed', 'spiritmint_seed'], lore: 'Uncommon growth.' },
  { day: 6, type: 'ore', ids: ['copper_ore', 'copper_ore', 'silver_ore'], lore: 'Brom left these at your door.' },
  { day: 7, type: 'gold', amount: 80, lore: 'A week of work. A week of reward.' },
  { day: 8, type: 'seeds', ids: ['firethorn_seed', 'verdant_moss_seed', 'crimson_puff_spore'], lore: 'Rarer stock.' },
  { day: 9, type: 'ore', ids: ['iron_ore', 'iron_ore', 'obsidian'], lore: 'Deeper veins.' },
  { day: 10, type: 'gold', amount: 120, lore: 'Your reputation grows.' },
  { day: 11, type: 'seeds', ids: ['shadowfung_spore', 'dewshroom_spore'], lore: 'Found in the dark.' },
  { day: 12, type: 'ore', ids: ['gold_ore', 'silver_ore', 'silver_ore'], lore: 'A gift from the mountain.' },
  { day: 13, type: 'gold', amount: 180, lore: 'Almost two weeks. Almost legendary.' },
  { day: 14, type: 'special', ids: ['spectral_cap_spore', 'coldvine_seed'], gold: 200, lore: 'Two weeks. The codex opens.' },
]

// Milestone rewards — never lost on streak break
export const MILESTONES = [
  {
    day: 30,
    title: 'Established Alchemist',
    reward: {
      type: 'multi',
      gold: 500,
      seeds: ['coldvine_seed', 'nightshade_pale_seed', 'embercrown_spore'],
      ores: ['mithril_ore', 'moonstone'],
      lore: 'The village has noticed. The orders have grown longer.',
    },
  },
  {
    day: 60,
    title: 'Master of the Cauldron',
    reward: {
      type: 'multi',
      gold: 1200,
      seeds: ['goldthread_seed', 'spectral_cap_spore', 'shadowfung_spore'],
      ores: ['gold_ore', 'mithril_ore', 'moonstone'],
      lore: 'Sixty days at the flame. The potions remember your hands.',
    },
  },
  {
    day: 90,
    title: 'Lorekeeper',
    reward: {
      type: 'multi',
      gold: 2500,
      seeds: ['embervine_seed', 'moonshroom_spore'],
      ores: ['embershard', 'stardust'],
      lore: 'The codex grows heavy. You know what grows where, and why.',
    },
  },
  {
    day: 180,
    title: 'Keeper of the Old Ways',
    reward: {
      type: 'multi',
      gold: 5000,
      seeds: ['voidleaf_seed', 'voidmold_spore'],
      ores: ['voidite', 'embershard', 'stardust'],
      lore: 'Half a year. The hollow below the mine knows your name.',
    },
  },
  {
    day: 365,
    title: 'Eternal Alchemist',
    reward: {
      type: 'multi',
      gold: 12000,
      seeds: ['voidleaf_seed', 'embervine_seed', 'moonshroom_spore', 'voidmold_spore'],
      ores: ['voidite', 'voidite', 'embershard', 'stardust', 'stardust'],
      lore: 'A full year. The garden is eternal. The cauldron never cools.',
    },
  },
]
