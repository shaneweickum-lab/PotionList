import { useEffect } from 'react'
import { useStore } from '../store/index.js'

export function useAuth() {
  const { setAuthReady } = useStore()

  useEffect(() => {
    setAuthReady()
  }, [])
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
