import { getLevelInfo, TASK_XP_MIN, TASK_XP_MAX, TASK_GROWTH_XP, TASK_TIME_REDUCTION_MIN, TASK_TIME_REDUCTION_MAX } from '../constants/xp.js'

export { getLevelInfo }

export function randomTaskXP() {
  return Math.floor(Math.random() * (TASK_XP_MAX - TASK_XP_MIN + 1)) + TASK_XP_MIN
}

export function randomTimeReduction() {
  return (Math.floor(Math.random() * (TASK_TIME_REDUCTION_MAX - TASK_TIME_REDUCTION_MIN + 1)) + TASK_TIME_REDUCTION_MIN) * 1000
}

export { TASK_GROWTH_XP }

// Plot cost with iron hoe discount: max(50, 200 - level * 2)
export function plotCost(level) {
  return Math.max(50, 200 - level * 2)
}
