// XP required to reach each level: floor(100 * level^1.4)
export function xpForLevel(level) {
  return Math.floor(100 * Math.pow(level, 1.4))
}

// Compute cumulative XP thresholds for levels 1-100
export const LEVEL_XP_THRESHOLDS = Array.from({ length: 100 }, (_, i) => {
  const level = i + 1
  if (level === 1) return 0
  let total = 0
  for (let l = 1; l < level; l++) {
    total += xpForLevel(l)
  }
  return total
})

// Given total XP, return { level, currentLevelXP, xpToNextLevel, progress }
export function getLevelInfo(totalXP) {
  let level = 1
  let remaining = totalXP
  for (let l = 1; l <= 99; l++) {
    const needed = xpForLevel(l)
    if (remaining < needed) break
    remaining -= needed
    level = l + 1
  }
  const xpToNext = level >= 100 ? Infinity : xpForLevel(level)
  return {
    level: Math.min(level, 100),
    currentLevelXP: remaining,
    xpToNextLevel: xpToNext,
    progress: xpToNext === Infinity ? 1 : remaining / xpToNext,
  }
}

// Task XP range: 10-22
export const TASK_XP_MIN = 10
export const TASK_XP_MAX = 22

// Growth XP per task completion
export const TASK_GROWTH_XP = 8

// Time reduction per task completion: 30-90 seconds
export const TASK_TIME_REDUCTION_MIN = 30
export const TASK_TIME_REDUCTION_MAX = 90

// Titles by level range
export const TITLES = [
  { minLevel: 1, maxLevel: 4, title: 'Apprentice' },
  { minLevel: 5, maxLevel: 9, title: 'Student of the Art' },
  { minLevel: 10, maxLevel: 14, title: 'Herbalist' },
  { minLevel: 15, maxLevel: 19, title: 'Brewer' },
  { minLevel: 20, maxLevel: 24, title: 'Alchemist' },
  { minLevel: 25, maxLevel: 29, title: 'Forge-Touched' },
  { minLevel: 30, maxLevel: 39, title: 'Established Alchemist' },
  { minLevel: 40, maxLevel: 49, title: 'Loreseeker' },
  { minLevel: 50, maxLevel: 59, title: 'Keeper of the Garden' },
  { minLevel: 60, maxLevel: 69, title: 'Master of the Cauldron' },
  { minLevel: 70, maxLevel: 79, title: 'Lorekeeper' },
  { minLevel: 80, maxLevel: 89, title: 'Void-Touched' },
  { minLevel: 90, maxLevel: 99, title: 'Keeper of the Old Ways' },
  { minLevel: 100, maxLevel: 100, title: 'Eternal Alchemist' },
]

export function getTitleForLevel(level) {
  const entry = TITLES.find(t => level >= t.minLevel && level <= t.maxLevel)
  return entry?.title ?? 'Apprentice'
}
