export const SKILL_BRANCHES = [
  {
    id: 'alchemy',
    label: 'Alchemy',
    icon: '🫧',
    color: '#9B40D4',
    nodes: [
      { id: 'boil_mastery',   name: 'Boil Mastery',   cost: 1, requires: null,            desc: 'Brew time −15%.' },
      { id: 'double_draft',   name: 'Double Draft',   cost: 2, requires: 'boil_mastery',  desc: '15% chance to brew an extra potion.' },
      { id: 'potent_extract', name: 'Potent Extract', cost: 2, requires: 'double_draft',  desc: 'Potions sell for 25% more.' },
      { id: 'grand_cauldron', name: 'Grand Cauldron', cost: 3, requires: 'potent_extract', desc: 'Task completions reduce brew timers by an extra 30 seconds.' },
    ],
  },
  {
    id: 'garden',
    label: 'Garden',
    icon: '🌿',
    color: '#2EE890',
    nodes: [
      { id: 'green_thumb',       name: 'Green Thumb',      cost: 1, requires: null,              desc: 'Plants grow 15% faster.' },
      { id: 'seed_luck',         name: 'Seed Luck',         cost: 2, requires: 'green_thumb',     desc: '30% chance to recover 1 seed on harvest.' },
      { id: 'abundant_harvest',  name: 'Abundant Harvest',  cost: 2, requires: 'seed_luck',       desc: 'Each harvest yields +1 herb or mushroom.' },
      { id: 'rare_soil',         name: 'Rare Soil',         cost: 3, requires: 'abundant_harvest', desc: '20% chance to harvest one additional item.' },
    ],
  },
  {
    id: 'mining',
    label: 'Mining',
    icon: '⛏️',
    color: '#FFB840',
    nodes: [
      { id: 'broms_pace',  name: "Brom's Pace",  cost: 1, requires: null,         desc: 'Mine trips take 15% less time.' },
      { id: 'keen_eye',    name: 'Keen Eye',      cost: 2, requires: 'broms_pace', desc: 'Brom finds +1 ore every trip.' },
      { id: 'deep_vein',   name: 'Deep Vein',     cost: 2, requires: 'keen_eye',   desc: 'Brom finds ore as if the mine is 1 tier higher.' },
      { id: 'forge_speed', name: 'Forge Speed',   cost: 3, requires: 'deep_vein',  desc: 'Smelting and forging take 25% less time.' },
    ],
  },
  {
    id: 'discipline',
    label: 'Discipline',
    icon: '📋',
    color: '#00C8DC',
    nodes: [
      { id: 'task_focus',  name: 'Task Focus',  cost: 1, requires: null,          desc: 'Task XP rewards +20%.' },
      { id: 'gold_finder', name: 'Gold Finder', cost: 2, requires: 'task_focus',  desc: 'Double gold find chance on task completion.' },
      { id: 'lore_sense',  name: 'Lore Sense',  cost: 2, requires: 'gold_finder', desc: 'Hidden lore find chance doubled (1% → 2%).' },
      { id: 'indomitable', name: 'Indomitable', cost: 3, requires: 'lore_sense',  desc: 'All items sell for 25% more.' },
    ],
  },
]

export const SKILL_MAP = Object.fromEntries(
  SKILL_BRANCHES.flatMap(b => b.nodes).map(n => [n.id, n])
)

export const ALL_SKILL_IDS = SKILL_BRANCHES.flatMap(b => b.nodes.map(n => n.id))
