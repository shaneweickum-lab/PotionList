export function createBankSlice(set, get) {
  return {
    savingsBalance: 0,
    savingsGoal: 0,      // 0 = no goal
    savingsRate: 0,      // 0–50 percent
    savingsLocked: false,

    depositSavings: (amount) => {
      if (amount <= 0) return
      set(state => ({ savingsBalance: (state.savingsBalance ?? 0) + amount }))
    },

    // Withdraw directly sets both fields atomically to avoid re-triggering savingsRate
    withdrawSavings: (amount) => {
      const state = get()
      if (state.savingsLocked && state.savingsGoal > 0 && state.savingsBalance < state.savingsGoal) {
        return { error: `Locked until goal of ${state.savingsGoal}g is reached` }
      }
      if (amount <= 0 || amount > (state.savingsBalance ?? 0)) {
        return { error: 'Insufficient savings balance' }
      }
      set(s => ({
        savingsBalance: Math.max(0, (s.savingsBalance ?? 0) - amount),
        gold: (s.gold ?? 0) + amount,
      }))
      return { success: true }
    },

    setSavingsRate: (rate) => set({ savingsRate: Math.max(0, Math.min(50, rate)) }),
    setSavingsGoal: (goal) => set({ savingsGoal: Math.max(0, goal) }),
    setSavingsLocked: (locked) => set({ savingsLocked: locked }),
  }
}
