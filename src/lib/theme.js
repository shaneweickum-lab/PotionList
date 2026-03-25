const THEME_KEY = 'alchemlist-theme'

export const THEMES = [
  { id: 'dark',     label: 'Dark Alchemy', bg: '#080705', accent: '#c9a227' },
  { id: 'midnight', label: 'Midnight',     bg: '#050810', accent: '#8bacd4' },
  { id: 'forest',   label: 'Forest',       bg: '#050a06', accent: '#c8922a' },
  { id: 'ember',    label: 'Ember',        bg: '#0a0603', accent: '#e07030' },
  { id: 'twilight', label: 'Twilight',     bg: '#080510', accent: '#b090d8' },
]

export function getTheme() {
  return localStorage.getItem(THEME_KEY) ?? 'dark'
}

export function applyTheme(themeId) {
  localStorage.setItem(THEME_KEY, themeId)
  if (themeId === 'dark') {
    document.documentElement.removeAttribute('data-theme')
  } else {
    document.documentElement.setAttribute('data-theme', themeId)
  }
}

// Call once on app startup
export function applyStoredTheme() {
  applyTheme(getTheme())
}
