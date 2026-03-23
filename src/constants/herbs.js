export const HERBS = [
  { id: 'silverleaf', name: 'Silverleaf', rarity: 'common', growthXP: 40, color: '#a8b8c8', lore: 'Pressed between the pages of every apprentice herbalist\'s first journal.' },
  { id: 'dewcap', name: 'Dewcap', rarity: 'common', growthXP: 45, color: '#7ab8a0', lore: 'Collects moisture even in the driest months. Old wives say it weeps at dawn.' },
  { id: 'ashroot', name: 'Ashroot', rarity: 'common', growthXP: 50, color: '#8a8078', lore: 'Grows only in soil that has known fire. Bitter to the tongue, vital to the cauldron.' },
  { id: 'moonbloom', name: 'Moonbloom', rarity: 'uncommon', growthXP: 80, color: '#c8b8e8', lore: 'Opens only at night. Those who harvest by lamplight find inferior petals.' },
  { id: 'ironwort', name: 'Ironwort', rarity: 'common', growthXP: 55, color: '#9a9878', lore: 'The stem breaks blades rather than bending. Ground to powder, it strengthens.' },
  { id: 'verdant_moss', name: 'Verdant Moss', rarity: 'uncommon', growthXP: 75, color: '#5a8858', lore: 'Spreads quietly across forgotten stones. A living record of patient time.' },
  { id: 'firethorn', name: 'Firethorn', rarity: 'uncommon', growthXP: 90, color: '#c87848', lore: 'The berries are decorative. The roots are what the alchemist wants.' },
  { id: 'coldvine', name: 'Coldvine', rarity: 'rare', growthXP: 130, color: '#88b8d8', lore: 'Spirals downward as though reaching for underground ice. Preserves what it touches.' },
  { id: 'duskpetal', name: 'Duskpetal', rarity: 'uncommon', growthXP: 85, color: '#c888a8', lore: 'The petals dissolve an hour after harvest. One must work quickly.' },
  { id: 'goldthread', name: 'Goldthread', rarity: 'rare', growthXP: 140, color: '#d4a830', lore: 'Woven through richer soil, it conducts something that cannot be named.' },
  { id: 'whispergrass', name: 'Whispergrass', rarity: 'common', growthXP: 35, color: '#a8c888', lore: 'Found in every meadow. Overlooked by most. Essential in three dozen recipes.' },
  { id: 'nightshade_pale', name: 'Pale Nightshade', rarity: 'rare', growthXP: 160, color: '#d8c8e8', lore: 'Not the poison. The cousin. Often confused by those who lack patience for distinction.' },
  { id: 'embervine', name: 'Embervine', rarity: 'epic', growthXP: 250, color: '#e8783a', lore: 'Found only in soil warmed by deep-buried ore veins. Worth more than the potions it makes.' },
  { id: 'spiritmint', name: 'Spiritmint', rarity: 'uncommon', growthXP: 70, color: '#98d8b8', lore: 'Clears the mind. Sharpens the eye. Alchemists keep sprigs above their workbenches.' },
  { id: 'voidleaf', name: 'Voidleaf', rarity: 'epic', growthXP: 300, color: '#4848a8', lore: 'Dark on both sides. Said to absorb light at the cellular level. Remarkable, and unsettling.' },
]

export const HERB_MAP = Object.fromEntries(HERBS.map(h => [h.id, h]))
