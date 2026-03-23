export const MUSHROOMS = [
  { id: 'gloomcap', name: 'Gloomcap', rarity: 'common', growthXP: 50, color: '#786868', lore: 'Thrives in darkness. Harvested before dawn by those who know where to look.' },
  { id: 'brightfungus', name: 'Brightfungus', rarity: 'common', growthXP: 45, color: '#e8d870', lore: 'Bioluminescent in moist conditions. Children collect them as lanterns. Adults boil them.' },
  { id: 'stoneback', name: 'Stoneback', rarity: 'common', growthXP: 55, color: '#989888', lore: 'Grows on cave walls at the edge of mineshafts. Brom brings them back sometimes.' },
  { id: 'crimson_puff', name: 'Crimson Puff', rarity: 'uncommon', growthXP: 80, color: '#c84848', lore: 'Explodes when overripe, releasing spores that sting the eyes for hours.' },
  { id: 'spectral_cap', name: 'Spectral Cap', rarity: 'rare', growthXP: 150, color: '#c8c8f0', lore: 'Semi-transparent. Found only in ruins. No one knows what it feeds on.' },
  { id: 'rotmoss', name: 'Rotmoss', rarity: 'common', growthXP: 40, color: '#687848', lore: 'Smells terrible. Heals infections better than anything that smells pleasant.' },
  { id: 'dewshroom', name: 'Dewshroom', rarity: 'uncommon', growthXP: 70, color: '#78b8c8', lore: 'Cap shaped to collect and concentrate morning dew. A natural bowl.' },
  { id: 'embercrown', name: 'Embercrown', rarity: 'rare', growthXP: 140, color: '#e89848', lore: 'Hot to the touch. The red ring on the cap is not decoration — it is a warning.' },
  { id: 'dustshroom', name: 'Dustshroom', rarity: 'common', growthXP: 45, color: '#c8b898', lore: 'Crumbles to powder when dried. That powder is the ingredient.' },
  { id: 'shadowfung', name: 'Shadowfung', rarity: 'uncommon', growthXP: 90, color: '#484858', lore: 'Leaves a dark stain on everything it touches. Difficult to harvest cleanly.' },
  { id: 'moonshroom', name: 'Moonshroom', rarity: 'epic', growthXP: 260, color: '#e8e8ff', lore: 'Glows faintly in a cycle matching the moon\'s phases. Potency follows accordingly.' },
  { id: 'voidmold', name: 'Voidmold', rarity: 'epic', growthXP: 310, color: '#282848', lore: 'Not quite a mushroom. Not quite anything else. The codex has no further entry.' },
]

export const MUSHROOM_MAP = Object.fromEntries(MUSHROOMS.map(m => [m.id, m]))
