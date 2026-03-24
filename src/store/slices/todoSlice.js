import { randomTaskXP, randomTimeReduction, TASK_GROWTH_XP } from '../../lib/xpCalc.js'
import { rollSeedFind } from '../../lib/loot.js'

let nextId = Date.now()

function calcNextDue(recurrence) {
  if (recurrence === 'daily') {
    const midnight = new Date()
    midnight.setHours(24, 0, 0, 0)
    return midnight.getTime()
  }
  if (recurrence === 'weekly') {
    return Date.now() + 7 * 24 * 60 * 60 * 1000
  }
  if (recurrence === 'monthly') {
    const next = new Date()
    next.setMonth(next.getMonth() + 1)
    return next.getTime()
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
        }],
      }))
    },

    completeTask: (id) => {
      const todo = get().todos.find(t => t.id === id)
      if (!todo || todo.completed) return null

      // Award XP
      const xp = randomTaskXP()
      get().awardXP(xp)
      get().awardGrowthXP(TASK_GROWTH_XP)

      // Seed find (35%)
      const foundSeed = rollSeedFind()
      if (foundSeed) get().addSeed(foundSeed, 1)

      // Time reduction on active brews/mine/smithy
      const reduction = randomTimeReduction()
      get().applyTimeReduction(reduction)

      // Streak handling
      get().checkStreak()

      if (todo.recurrence === 'none') {
        // Non-recurring: remove entirely so it disappears for good
        set(state => ({ todos: state.todos.filter(t => t.id !== id) }))
      } else {
        // Recurring: set nextDueAt — task hides itself until the window reopens
        const nextDueAt = calcNextDue(todo.recurrence)
        set(state => ({
          todos: state.todos.map(t =>
            t.id === id ? { ...t, completedAt: Date.now(), nextDueAt } : t
          ),
        }))
      }

      const reward = { xp, foundSeed, timeReduction: reduction }
      set({ lastCompletionReward: reward })
      return reward
    },

    deleteTask: (id) => {
      set(state => ({ todos: state.todos.filter(t => t.id !== id) }))
    },
  }
}
