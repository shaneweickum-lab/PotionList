import { useEffect } from 'react'
import { useStore } from '../store/index.js'

const ACCOUNTS_KEY = 'alchemlist-accounts'
const INITIAL_SLOTS = 4

// Default game state for a brand-new account
const FRESH_STATE = {
  // player
  xp: 0, growthXP: 0, gold: 50, level: 1,
  streak: 0, lastTaskDay: null, longestStreak: 0,
  tasksCompleted: 0, milestonesClaimed: [], lastSaved: null, pendingSync: false,
  titles: [], founderUnlocked: false,
  // tasks
  todos: [],
  // garden
  garden: Array.from({ length: INITIAL_SLOTS }, (_, i) => ({
    slotId: i, seedId: null, plantedAt: null, growthXPAtPlant: 0,
  })),
  gardenSlotCount: INITIAL_SLOTS,
  // mine
  mineTrips: [], oreInventory: {}, mineLevel: 1,
  bromUnlocked: false, bromTrip2Unlocked: false,
  // inventory
  inventory: {}, seeds: {},
  discovered: { herbs: [], mushrooms: [], bugs: [] },
  discoveredLore: [], owned: [],
  // cauldron
  brewing: [], potionInventory: {}, cauldronTier: 1,
  cauldronSkipAvailable: false, cauldronSkipUsed: false,
  // orders
  dailyOrders: [], ordersDate: null,
  // smithy
  smithing: [], ingotInventory: {},
  // iap
  iapPurchases: [],
}

const GAME_KEYS = Object.keys(FRESH_STATE)

function getAccounts() {
  try { return JSON.parse(localStorage.getItem(ACCOUNTS_KEY) ?? '{}') } catch { return {} }
}

function saveCurrentAccount() {
  const state = useStore.getState()
  const { userId } = state
  if (!userId) return
  const snapshot = { username: state.username }
  for (const key of GAME_KEYS) {
    if (key in state) snapshot[key] = state[key]
  }
  const accounts = getAccounts()
  accounts[userId] = snapshot
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts))
}

export function useAuth() {
  const { setAuthReady } = useStore()
  useEffect(() => { setAuthReady() }, [])
}

export async function signIn(email, password) {
  const accounts = getAccounts()
  const saved = accounts[email]
  if (!saved) {
    return { error: 'No account found for this email on this device.' }
  }
  // Save whichever account is currently active before switching
  const { userId } = useStore.getState()
  if (userId && userId !== email) saveCurrentAccount()
  // Restore this account's full game state
  useStore.setState({ ...saved, userId: email, authReady: true })
  return { success: true }
}

export async function signUp(email, password, username) {
  const accounts = getAccounts()
  if (accounts[email]) {
    return { error: 'An account with this email already exists on this device. Try signing in.' }
  }
  // Save whichever account is currently active
  const { userId } = useStore.getState()
  if (userId) saveCurrentAccount()
  // Start fresh for the new account
  useStore.setState({ ...FRESH_STATE, username, userId: email, authReady: true })
  return { success: true }
}

export async function signOut() {
  saveCurrentAccount()
  useStore.setState({ username: null, userId: null })
}
