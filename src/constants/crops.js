// Crops — grown in the garden purely for selling.
// They use the same `inventory` bucket as herbs/mushrooms but have no
// potion recipes or codex entries; they are a straightforward gold source.

export const CROPS = [
  // ── Common vegetables ──────────────────────────────────────────────────────
  { id: 'wheat',      name: 'Wheat',      rarity: 'common',   color: '#d4b860', sellPrice: 7,  lore: 'The backbone of every village larder. Bakers pay well, millers pay better.' },
  { id: 'corn',       name: 'Corn',       rarity: 'common',   color: '#f0d060', sellPrice: 8,  lore: 'Grows tall and proud. The merchants dry it for trade caravans heading east.' },
  { id: 'potato',     name: 'Potato',     rarity: 'common',   color: '#c8a870', sellPrice: 7,  lore: 'Humble, reliable, and worth more than it looks when the winter runs long.' },
  { id: 'garlic',     name: 'Garlic',     rarity: 'common',   color: '#e8e0d0', sellPrice: 9,  lore: 'Keeps the cold away. Keeps vampires away. Keeps most people away, too.' },
  { id: 'carrot',     name: 'Carrot',     rarity: 'common',   color: '#e87830', sellPrice: 8,  lore: 'Preferred by the stable hands and the healers alike, for entirely different reasons.' },
  { id: 'onion',      name: 'Onion',      rarity: 'common',   color: '#d8b8a0', sellPrice: 7,  lore: 'The cook\'s closest companion. Cried over, yet never abandoned.' },
  { id: 'cabbage',    name: 'Cabbage',    rarity: 'common',   color: '#90b870', sellPrice: 7,  lore: 'Unfashionable. Indispensable. The poor man\'s cure for a great many things.' },
  { id: 'turnip',     name: 'Turnip',     rarity: 'common',   color: '#d0a8c0', sellPrice: 7,  lore: 'Survives frost that kills everything else. Stubborn as the farmers who grow them.' },

  // ── Uncommon vegetables ────────────────────────────────────────────────────
  { id: 'pumpkin',    name: 'Pumpkin',    rarity: 'uncommon', color: '#d07028', sellPrice: 16, lore: 'Prized at harvest festivals and carved into lanterns by the village children.' },
  { id: 'pepper',     name: 'Red Pepper', rarity: 'uncommon', color: '#c82828', sellPrice: 15, lore: 'Traded at double the price north of the mountains where nothing so hot grows.' },

  // ── Common flowers ─────────────────────────────────────────────────────────
  { id: 'daisy',      name: 'Daisy',      rarity: 'common',   color: '#f0f0d8', sellPrice: 10, lore: 'The herbalist\'s plain cousin. Florists love them. Alchemists find them dull.' },
  { id: 'petunia',    name: 'Petunia',    rarity: 'common',   color: '#a868c8', sellPrice: 10, lore: 'Planted along every window box in the village. Cheerful to a fault.' },
  { id: 'marigold',   name: 'Marigold',   rarity: 'common',   color: '#f09020', sellPrice: 10, lore: 'Said to ward off pests. Whether this is true is a matter of ongoing debate.' },
  { id: 'bluebell',   name: 'Bluebell',   rarity: 'common',   color: '#6888d8', sellPrice: 10, lore: 'Rings silently in the breeze. Poets have written many things about this.' },

  // ── Uncommon flowers ───────────────────────────────────────────────────────
  { id: 'rose',       name: 'Rose',       rarity: 'uncommon', color: '#e82858', sellPrice: 18, lore: 'Worth three times more if red. Worth twice more if someone else grew it.' },
  { id: 'sunflower',  name: 'Sunflower',  rarity: 'uncommon', color: '#f0c020', sellPrice: 16, lore: 'Turns to follow the light all day. Merchants call it the merchant\'s bloom.' },
  { id: 'lavender',   name: 'Lavender',   rarity: 'uncommon', color: '#a080c0', sellPrice: 16, lore: 'Dried bundles fetch a fair price from the perfumers. Fresh bundles fetch more.' },
  { id: 'tulip',      name: 'Tulip',      rarity: 'uncommon', color: '#e85070', sellPrice: 15, lore: 'A single tulip bulb once bought a house. Those days are gone, but the price holds.' },
]

export const CROP_MAP = Object.fromEntries(CROPS.map(c => [c.id, c]))
