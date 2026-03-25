export const SKILL_BRANCHES = [
  {
    id: 'alchemy',
    label: 'Alchemy',
    icon: '🫧',
    color: '#9B40D4',
    nodes: [
      { id: 'boil_mastery',        name: 'Boil Mastery',        cost: 1, requires: null,                desc: 'Brew time −15%.' },
      { id: 'double_draft',        name: 'Double Draft',        cost: 3, requires: 'boil_mastery',      desc: '15% chance to brew an extra potion.' },
      { id: 'potent_extract',      name: 'Potent Extract',      cost: 5, requires: 'double_draft',      desc: 'Potions sell for 25% more.' },
      { id: 'grand_cauldron',      name: 'Grand Cauldron',      cost: 7, requires: 'potent_extract',    desc: 'Task completions reduce brew timers by an extra 30 seconds.' },
      { id: 'philosophers_reserve', name: "Philosopher's Reserve", cost: 9, requires: 'grand_cauldron', desc: '5% chance each brew creates 1 extra potion of a random type you can already brew.' },
    ],
  },
  {
    id: 'garden',
    label: 'Garden',
    icon: '🌿',
    color: '#2EE890',
    nodes: [
      { id: 'green_thumb',      name: 'Green Thumb',      cost: 1, requires: null,              desc: 'Plants grow 15% faster.' },
      { id: 'seed_luck',        name: 'Seed Luck',        cost: 3, requires: 'green_thumb',     desc: '30% chance to recover 1 seed on harvest.' },
      { id: 'abundant_harvest', name: 'Abundant Harvest', cost: 5, requires: 'seed_luck',       desc: 'Each harvest yields +1 herb or mushroom.' },
      { id: 'rare_soil',        name: 'Rare Soil',        cost: 7, requires: 'abundant_harvest', desc: '20% chance to harvest one additional item.' },
      { id: 'eternal_garden',   name: 'Eternal Garden',   cost: 9, requires: 'rare_soil',       desc: '25% chance a harvested plot auto-replants with the same seed if you have one.' },
    ],
  },
  {
    id: 'mining',
    label: 'Mining',
    icon: '⛏️',
    color: '#FFB840',
    nodes: [
      { id: 'broms_pace',  name: "Brom's Pace",  cost: 1, requires: null,         desc: 'Mine trips take 15% less time.' },
      { id: 'keen_eye',    name: 'Keen Eye',      cost: 3, requires: 'broms_pace', desc: 'Brom finds +1 ore every trip.' },
      { id: 'deep_vein',   name: 'Deep Vein',     cost: 5, requires: 'keen_eye',   desc: 'Brom finds ore as if the mine is 1 tier higher.' },
      { id: 'forge_speed', name: 'Forge Speed',   cost: 7, requires: 'deep_vein',  desc: 'Smelting and forging take 25% less time.' },
      { id: 'void_diver',  name: 'Void Diver',    cost: 9, requires: 'forge_speed', desc: 'Brom can run one additional simultaneous mine trip.' },
    ],
  },
  {
    id: 'discipline',
    label: 'Discipline',
    icon: '📋',
    color: '#00C8DC',
    nodes: [
      { id: 'task_focus',  name: 'Task Focus',  cost: 1, requires: null,          desc: 'Task XP rewards +20%.' },
      { id: 'gold_finder', name: 'Gold Finder', cost: 3, requires: 'task_focus',  desc: 'Double gold find chance on task completion.' },
      { id: 'lore_sense',  name: 'Lore Sense',  cost: 5, requires: 'gold_finder', desc: 'Hidden lore find chance doubled (1% → 2%).' },
      { id: 'indomitable', name: 'Indomitable', cost: 7, requires: 'lore_sense',  desc: 'All items sell for 25% more.' },
      { id: 'iron_will',   name: 'Iron Will',   cost: 9, requires: 'indomitable', desc: '+5g awarded for every completed task.' },
    ],
  },
]

export const SKILL_MAP = Object.fromEntries(
  SKILL_BRANCHES.flatMap(b => b.nodes).map(n => [n.id, n])
)

export const ALL_SKILL_IDS = SKILL_BRANCHES.flatMap(b => b.nodes.map(n => n.id))
