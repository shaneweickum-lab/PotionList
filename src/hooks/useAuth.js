import { useEffect } from 'react'
import { useStore } from '../store/index.js'

export function useAuth() {
  const { setAuthReady } = useStore()

  useEffect(() => {
    setAuthReady()
  }, [])
}

export async function signIn(email, password) {
  const { userId, username } = useStore.getState()
  if (userId === email && username) {
    return { success: true }
  }
  return { error: 'No account found for this email on this device.' }
}

export async function signUp(email, password, username) {
  useStore.getState().setUsername(username)
  useStore.getState().setUserId(email)
  return { success: true }
}

export async function signOut() {
  useStore.getState().setUsername(null)
  useStore.getState().setUserId(null)
}
