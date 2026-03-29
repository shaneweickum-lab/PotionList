import { getLevelInfo, getTitleForLevel } from '../../constants/xp.js'

export function createPlayerSlice(set, get) {
  return {
    xp: 0,
    growthXP: 0,
    gold: 50,
    level: 1,
    streak: 0,
    lastTaskDay: null,
    longestStreak: 0,
    tasksCompleted: 0,
    milestonesClaimed: [],
    lastSaved: null,
    pendingSync: false,
    username: null,
    handle: null,
    nickname: null,
    bio: null,
    avatarUrl: null,
    userId: null,
    authReady: false,
    titles: [],
    founderUnlocked: false,

    awardXP: (amount) => {
      set(state => {
        const newXP = state.xp + amount
        const { level } = getLevelInfo(newXP)
        return { xp: newXP, level }
      })
    },

    awardGrowthXP: (amount) => {
      set(state => ({ growthXP: state.growthXP + amount }))
    },

    addGold: (amount) => {
      if (amount <= 0) {
        set(state => ({ gold: Math.max(0, state.gold + amount) }))
        return
      }
      const rate = get().savingsRate ?? 0
      if (rate > 0) {
        const contribution = Math.floor(amount * rate / 100)
        const net = amount - contribution
        set(state => ({ gold: Math.max(0, state.gold + net) }))
        if (contribution > 0) get().depositSavings(contribution)
      } else {
        set(state => ({ gold: Math.max(0, state.gold + amount) }))
      }
    },

    spendGold: (amount) => {
      const current = get().gold
      if (current < amount) return false
      set({ gold: current - amount })
      return true
    },

    setUsername: (username) => set({ username }),
    setHandle: (handle) => set({ handle }),
    setUserId: (userId) => set({ userId }),
    setAuthReady: () => set({ authReady: true }),
    setFounderUnlocked: () => set({ founderUnlocked: true }),
    addTitle: (title) => set(state => ({
      titles: state.titles.includes(title) ? state.titles : [...state.titles, title],
    })),
    claimMilestone: (day) => set(state => ({
      milestonesClaimed: [...new Set([...state.milestonesClaimed, day])],
    })),
    incrementTasksCompleted: () => set(state => ({ tasksCompleted: (state.tasksCompleted ?? 0) + 1 })),
    setLastTaskDay: (day) => set({ lastTaskDay: day }),
    setStreak: (streak) => set(state => ({
      streak,
      longestStreak: Math.max(state.longestStreak, streak),
    })),
  }
}
