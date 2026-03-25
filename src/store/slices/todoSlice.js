import { randomTaskXP, randomTimeReduction, TASK_GROWTH_XP } from '../../lib/xpCalc.js'
import { rollSeedFind, rollTaskGold } from '../../lib/loot.js'

let nextId = Date.now()

function calcNextDue(recurrence) {
  if (recurrence === 'daily') {
    const d = new Date()
    d.setHours(24, 0, 0, 0)
    return d.getTime()
  }
  if (recurrence === 'weekly') {
    const d = new Date()
    d.setDate(d.getDate() + 7)
    d.setHours(0, 0, 0, 0)
    return d.getTime()
  }
  if (recurrence === 'monthly') {
    const d = new Date()
    d.setMonth(d.getMonth() + 1)
    d.setHours(0, 0, 0, 0)
    return d.getTime()
  }
  return null
}

export function createTodoSlice(set, get) {
  return {
    todos: [],
    lastCompletionReward: null,

    addTask: (options) => {
      const isString = typeof options === 'string'
      const text = isString ? options : options.text
      const priority = isString ? 'normal' : (options.priority ?? 'normal')
      const category = isString ? 'general' : (options.category ?? 'general')
      const recurrence = isString ? 'none' : (options.recurrence ?? 'none')
      const completionAnimation = isString ? 'fade' : (options.completionAnimation ?? 'fade')
      const targetCount = isString ? 1 : Math.max(1, options.targetCount ?? 1)

      set(state => ({
        todos: [...state.todos, {
          id: String(nextId++),
          text: text.trim(),
          createdAt: Date.now(),
          completed: false,
          priority,
          category,
          recurrence,
          completionAnimation,
          targetCount,
          currentCount: 0,
        }],
      }))
    },

    // Called for every tap that isn't the final one — awards XP but no full completion
    incrementTask: (id) => {
      const todo = get().todos.find(t => t.id === id)
      if (!todo) return null

      const newCount = (todo.currentCount ?? 0) + 1
      set(state => ({
        todos: state.todos.map(t => t.id === id ? { ...t, currentCount: newCount } : t),
      }))

      const xp = randomTaskXP()
      get().awardXP(xp)

      const hasPlants = get().garden.some(s => s.seedId !== null)
      if (hasPlants) get().awardGrowthXP(TASK_GROWTH_XP)

      return { xp, growthXP: hasPlants ? TASK_GROWTH_XP : 0, progress: newCount, total: todo.targetCount }
    },

    // Called only when the final tap completes the task
    completeTask: (id) => {
      const todo = get().todos.find(t => t.id === id)
      if (!todo) return null

      // Award XP for the final tap
      const xp = randomTaskXP()
      get().awardXP(xp)

      const hasPlants = get().garden.some(s => s.seedId !== null)
      if (hasPlants) get().awardGrowthXP(TASK_GROWTH_XP)

      // Seed find (35%)
      const foundSeed = rollSeedFind(get().level ?? 1)
      if (foundSeed) get().addSeed(foundSeed, 1)

      // Gold find (4%)
      const foundGold = rollTaskGold()
      if (foundGold) get().addGold(foundGold)

      // Time reduction on active brews/mine/smithy
      const reduction = randomTimeReduction()
      get().applyTimeReduction(reduction)

      // 1% chance to discover a hidden lore entry
      get().rollLoreFind()

      // Bug farm breeding progress
      get().advanceBreedProgress(id)

      // Persistent completion counter
      get().incrementTasksCompleted()

      // Streak handling
      get().checkStreak()

      if (todo.recurrence === 'none') {
        set(state => ({ todos: state.todos.filter(t => t.id !== id) }))
      } else {
        const nextDueAt = calcNextDue(todo.recurrence)
        set(state => ({
          todos: state.todos.map(t =>
            t.id === id ? { ...t, completedAt: Date.now(), nextDueAt, currentCount: 0 } : t
          ),
        }))
      }

      const reward = { xp, growthXP: hasPlants ? TASK_GROWTH_XP : 0, foundSeed, foundGold: foundGold || null, timeReduction: reduction }
      set({ lastCompletionReward: reward })
      return reward
    },

    deleteTask: (id) => {
      set(state => ({ todos: state.todos.filter(t => t.id !== id) }))
    },

    reorderTodos: (newOrderIds) => {
      set(state => {
        const idMap = Object.fromEntries(state.todos.map(t => [t.id, t]))
        const newSet = new Set(newOrderIds)
        const others = state.todos.filter(t => !newSet.has(t.id))
        return { todos: [...newOrderIds.map(id => idMap[id]).filter(Boolean), ...others] }
      })
    },
  }
}
