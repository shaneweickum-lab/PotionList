export const BUGS = [
  {
    id: 'glowgrub',
    name: 'Glowgrub',
    rarity: 'common',
    color: '#d8e868',
    lore: 'Found under damp leaves near the base of garden herbs. Bioluminescent larvae. Alchemists keep jars of them for light.',
  },
  {
    id: 'moonmite',
    name: 'Moonmite',
    rarity: 'uncommon',
    color: '#c8c8f0',
    lore: 'Microscopic in daylight, somehow visible at night. Collected by pressing cloth against moonlit leaves.',
  },
  {
    id: 'ashcrawler',
    name: 'Ashcrawler',
    rarity: 'uncommon',
    color: '#989898',
    lore: 'Lives in the dry crust around ashroot. Its shell is fire-resistant. Grinding it produces a fine grey powder.',
  },
  {
    id: 'voidweevil',
    name: 'Voidweevil',
    rarity: 'rare',
    color: '#5848a8',
    lore: 'Bores into voidleaf stems. Nobody planted them there. Nobody knows where they came from.',
  },
  {
    id: 'cinderfly',
    name: 'Cinderfly',
    rarity: 'epic',
    color: '#e07b39',
    lore: 'Wings that shed embers when disturbed. Found once in forty harvests, if that. Worth catching carefully.',
  },
]

export const BUG_MAP = Object.fromEntries(BUGS.map(b => [b.id, b]))
