import { randomTaskXP, randomTimeReduction, TASK_GROWTH_XP } from '../../lib/xpCalc.js'
import { rollSeedFind } from '../../lib/loot.js'

let nextId = Date.now()

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

      // Mark completed
      set(state => ({
        todos: state.todos.map(t => t.id === id ? { ...t, completed: true, completedAt: Date.now() } : t),
      }))

      // Award XP
      const xp = randomTaskXP()
      get().awardXP(xp)
      get().awardGrowthXP(TASK_GROWTH_XP)

      // Seed find (35%)
      const foundSeed = rollSeedFind()
      if (foundSeed) {
        get().addSeed(foundSeed, 1)
      }

      // Time reduction on active brews/mine/smithy
      const reduction = randomTimeReduction()
      get().applyTimeReduction(reduction)

      // Streak handling
      get().checkStreak()

      // Recurring tasks re-queue themselves after animation plays
      if (todo.recurrence !== 'none') {
        setTimeout(() => {
          get().addTask({
            text: todo.text,
            priority: todo.priority,
            category: todo.category,
            recurrence: todo.recurrence,
            completionAnimation: todo.completionAnimation,
          })
        }, 700)
      }

      const reward = { xp, foundSeed, timeReduction: reduction }
      set({ lastCompletionReward: reward })
      return reward
    },

    deleteTask: (id) => {
      set(state => ({ todos: state.todos.filter(t => t.id !== id) }))
    },

    clearCompleted: () => {
      set(state => ({ todos: state.todos.filter(t => !t.completed) }))
    },
  }
}
