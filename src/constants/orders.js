export const ORDER_CHARACTERS = [
  {
    id: 'mira_dunvale',
    name: 'Mira Dunvale',
    title: 'Innkeeper',
    color: '#c9a227',
    flavour: 'Mira runs the Ashfen Inn on the north road. Her guests leave healthy.',
    preferredPotions: ['minor_healing', 'healing', 'stamina', 'clarity'],
  },
  {
    id: 'serevane',
    name: 'Serevane',
    title: 'Witch of the Hollow',
    color: '#9b6bb5',
    flavour: 'She arrives at irregular hours. She never explains what the potions are for.',
    preferredPotions: ['moonbrew', 'void_tincture', 'moonmite_serum', 'dusk_elixir', 'shadow_oil'],
  },
  {
    id: 'aldric_fenn',
    name: 'Aldric Fenn',
    title: 'Cartographer',
    color: '#5a9e6f',
    flavour: 'Maps the roads between towns. Always needs more potions for "field work."',
    preferredPotions: ['stamina', 'clarity', 'goldvein_tonic', 'cold_extract'],
  },
  {
    id: 'olwen',
    name: 'Olwen',
    title: 'Herbalist Elder',
    color: '#7ab8a0',
    flavour: 'She knew these recipes before your cauldron was cast. She tests your work carefully.',
    preferredPotions: ['verdant_draught', 'healing', 'minor_healing', 'fire_tonic'],
  },
  {
    id: 'commander_thresh',
    name: 'Commander Thresh',
    title: 'City Watch Commander',
    color: '#8a8070',
    flavour: 'Sends a courier. Never arrives himself. Payment is always exact.',
    preferredPotions: ['fire_tonic', 'stamina', 'ember_salve', 'void_dissolution'],
  },
  {
    id: 'voss',
    name: 'Voss the Scholar',
    title: 'Arcane Researcher',
    color: '#88b8d8',
    flavour: 'Studies the theoretical basis of alchemy. Orders the results of the practice.',
    preferredPotions: ['clarity', 'stellar_brew', 'void_tincture', 'grand_elixir', 'moonmite_serum'],
  },
]

export const CHARACTER_MAP = Object.fromEntries(ORDER_CHARACTERS.map(c => [c.id, c]))

// Bonus types for orders
export const ORDER_BONUSES = [
  { type: 'gold', label: 'Bonus Gold', icon: '💰' },
  { type: 'seed', label: 'Rare Seed', icon: '🌱' },
  { type: 'ore', label: 'Ore Bundle', icon: '⛏️' },
  { type: 'xp', label: 'Bonus XP', icon: '✨' },
]
