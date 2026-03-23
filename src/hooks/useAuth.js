import { useEffect } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase.js'
import { useStore } from '../store/index.js'
import { loadFromCloud } from '../store/middleware/syncMiddleware.js'
import { initRevenueCat } from '../lib/revenuecat.js'

export function useAuth() {
  const { setUserId, setUsername, setAuthReady } = useStore()

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setAuthReady()
      return
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        handleLogin(session.user)
      } else {
        // No active session — clear any stale game data left from a previous session
        localStorage.removeItem('potionlist-v1')
      }
      setAuthReady()
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) handleLogin(session.user)
      if (event === 'SIGNED_OUT') {
        // Wipe local game data so it never persists without an account
        localStorage.removeItem('potionlist-v1')
        window.location.reload()
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function handleLogin(user) {
    setUserId(user.id)
    await initRevenueCat(user.id)

    // Ensure user row exists
    await supabase.from('users').upsert({ id: user.id }, { onConflict: 'id' })

    // Fetch username
    const { data } = await supabase.from('users').select('username').eq('id', user.id).single()
    if (data?.username) setUsername(data.username)

    // Cloud save load
    const cloudSave = await loadFromCloud(user.id)
    if (cloudSave) {
      const localLastSaved = useStore.getState().lastSaved ?? 0
      const cloudUpdatedAt = new Date(cloudSave.updated_at).getTime()
      if (cloudUpdatedAt > localLastSaved) {
        // Cloud is newer — load it
        useStore.setState({ ...cloudSave.data, userId: user.id })
      }
    }
  }
}

export async function signIn(email, password) {
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  return error ? { error: error.message } : { success: true }
}

export async function signUp(email, password, username) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: window.location.origin },
  })
  if (error) return { error: error.message }
  if (data.user) {
    await supabase.from('users').upsert({ id: data.user.id, username })
    useStore.getState().setUsername(username)
  }
  // session is null when Supabase requires email confirmation
  return { success: true, confirmEmail: !data.session }
}

export async function signOut() {
  await supabase.auth.signOut()
}

export async function signInWithGoogle() {
  const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' })
  return error ? { error: error.message } : { success: true }
}

export async function signInWithApple() {
  const { error } = await supabase.auth.signInWithOAuth({ provider: 'apple' })
  return error ? { error: error.message } : { success: true }
}
