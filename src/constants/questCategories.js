export const QUEST_CATEGORIES = [
  { id: 'errands',  label: 'Errands',  icon: '🗺️' },
  { id: 'shopping', label: 'Shopping', icon: '🛒' },
  { id: 'chores',   label: 'Chores',   icon: '🧹' },
  { id: 'travel',   label: 'Travel',   icon: '✈️' },
  { id: 'work',     label: 'Work',     icon: '💼' },
  { id: 'personal', label: 'Personal', icon: '⭐' },
]

export const CATEGORY_MAP = Object.fromEntries(QUEST_CATEGORIES.map(c => [c.id, c]))
