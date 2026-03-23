import { randomTaskXP, randomTimeReduction, TASK_GROWTH_XP } from '../../lib/xpCalc.js'
import { rollSeedFind } from '../../lib/loot.js'

let nextId = Date.now()

export function createTodoSlice(set, get) {
  return {
    todos: [],
    lastCompletionReward: null,

    addTask: (text) => {
      set(state => ({
        todos: [...state.todos, {
          id: String(nextId++),
          text: text.trim(),
          createdAt: Date.now(),
          completed: false,
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
