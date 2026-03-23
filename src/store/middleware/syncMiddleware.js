import { supabase, isSupabaseConfigured } from '../../lib/supabase.js'

let store = null
let syncTimeout = null

export function setupSyncMiddleware(zustandStore) {
  store = zustandStore

  window.addEventListener('online', () => {
    if (store.getState().pendingSync) triggerSync(store.getState())
  })

  store.subscribe((state) => {
    if (!state.userId || !isSupabaseConfigured) return
    if (!navigator.onLine) {
      store.setState({ pendingSync: true })
      return
    }
    clearTimeout(syncTimeout)
    syncTimeout = setTimeout(() => triggerSync(state), 3000)
  })
}

async function triggerSync(state) {
  if (!state.userId || !isSupabaseConfigured) return
  const saveData = buildSaveData(state)
  try {
    const { error } = await supabase
      .from('saves')
      .upsert({ user_id: state.userId, data: saveData, updated_at: new Date().toISOString() })
    if (error) throw error
    if (store) store.setState({ pendingSync: false, lastSaved: Date.now() })
  } catch (err) {
    console.warn('Sync failed:', err.message)
    if (store) store.setState({ pendingSync: true })
  }
}

function buildSaveData(state) {
  const { marketListings, marketLoading, marketError, iapLoading, iapError, lastCompletionReward, set: _set, ...rest } = state
  return rest
}

export async function loadFromCloud(userId) {
  if (!isSupabaseConfigured) return null
  const { data, error } = await supabase
    .from('saves')
    .select('data, updated_at')
    .eq('user_id', userId)
    .single()
  if (error || !data) return null
  return data
}
