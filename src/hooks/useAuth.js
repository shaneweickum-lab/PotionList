import { useEffect } from 'react'
import { useStore } from '../store/index.js'
import { supabase, isSupabaseConfigured } from '../lib/supabase.js'

const ACCOUNTS_KEY = 'alchemlist-accounts'
const INITIAL_SLOTS = 2

// Default game state for a brand-new account
const FRESH_STATE = {
  // player
  xp: 0, growthXP: 0, gold: 50, level: 1,
  streak: 0, lastTaskDay: null, longestStreak: 0,
  tasksCompleted: 0, milestonesClaimed: [], lastSaved: null, pendingSync: false,
  titles: [], founderUnlocked: false,
  username: null,
  handle: null,
  bio: null,
  nickname: null,
  avatarUrl: null,
  // tasks
  todos: [],
  // garden
  garden: Array.from({ length: INITIAL_SLOTS }, (_, i) => ({
    slotId: i, seedId: null, plantedAt: null, growthXPAtPlant: 0,
  })),
  gardenSlotCount: INITIAL_SLOTS,
  gardenPlotsBought: 0,
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
  // quests
  quests: [],
  // bug farm
  bugFarm: {},
  activeBreed: null,
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

// Validate handle format: 3-20 chars, lowercase letters/numbers/underscores, must start with letter
export function validateHandle(handle) {
  if (!handle || handle.length < 3) return 'Handle must be at least 3 characters.'
  if (handle.length > 20) return 'Handle must be 20 characters or fewer.'
  if (!/^[a-z]/.test(handle)) return 'Handle must start with a letter.'
  if (!/^[a-z][a-z0-9_]*$/.test(handle)) return 'Handle can only contain lowercase letters, numbers, and underscores.'
  return null
}

// Check local accounts for taken username or handle
function checkLocalUniqueness(username, handle, excludeEmail = null) {
  const accounts = getAccounts()
  for (const [email, acc] of Object.entries(accounts)) {
    if (email === excludeEmail) continue
    if (acc.username && acc.username.toLowerCase() === username.toLowerCase()) {
      return `Username "${username}" is already taken.`
    }
    if (acc.handle && handle && acc.handle.toLowerCase() === handle.toLowerCase()) {
      return `Handle "@${handle}" is already taken.`
    }
  }
  return null
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
  const { userId } = useStore.getState()
  if (userId && userId !== email) saveCurrentAccount()
  useStore.setState({ ...saved, userId: email, authReady: true })
  return { success: true }
}

// Step 1: create account with just email + password
// username/handle/profile are set up separately via completeProfile
export async function signUp(email, password) {
  const accounts = getAccounts()
  if (accounts[email]) {
    return { error: 'An account with this email already exists on this device. Try signing in.' }
  }
  const { userId } = useStore.getState()
  if (userId) saveCurrentAccount()
  // username must be explicitly null so App.jsx routes to ProfileSetupScreen
  useStore.setState({ ...FRESH_STATE, username: null, userId: email, authReady: true })
  return { success: true }
}

// Step 2: complete profile after account creation (or first sign-in)
export async function completeProfile({ username, handle, nickname, bio, avatarUrl }) {
  const state = useStore.getState()
  if (!state.userId) return { error: 'Not signed in.' }

  if (!username?.trim()) return { error: 'Username is required.' }

  const handleErr = validateHandle(handle)
  if (handleErr) return { error: handleErr }

  // Check local uniqueness (exclude current user's own email in case they're updating)
  const localError = checkLocalUniqueness(username.trim(), handle.toLowerCase(), state.userId)
  if (localError) return { error: localError }

  // Check Supabase uniqueness if configured
  if (isSupabaseConfigured) {
    const { data: existingHandle } = await supabase
      .from('user_profiles')
      .select('user_id')
      .eq('handle', handle.toLowerCase())
      .neq('user_id', state.userId)
      .maybeSingle()
    if (existingHandle) return { error: `Handle "@${handle}" is already taken.` }

    const { data: existingUsername } = await supabase
      .from('user_profiles')
      .select('user_id')
      .ilike('username', username.trim())
      .neq('user_id', state.userId)
      .maybeSingle()
    if (existingUsername) return { error: `Username "${username}" is already taken.` }

    await supabase.from('user_profiles').upsert({
      user_id: state.userId,
      username: username.trim(),
      handle: handle.toLowerCase(),
    })
  }

  useStore.setState({
    username: username.trim(),
    handle: handle.toLowerCase(),
    nickname: nickname?.trim() || null,
    bio: bio?.trim() || null,
    avatarUrl: avatarUrl || null,
  })

  // Save to per-account storage so it persists across sign-out/sign-in
  saveCurrentAccount()
  return { success: true }
}

export async function signOut() {
  saveCurrentAccount()
  useStore.setState({ username: null, handle: null, userId: null })
}
