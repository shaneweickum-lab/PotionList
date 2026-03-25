import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'
import styles from './AuthCallbackScreen.module.css'

export default function AuthCallbackScreen({ onDone }) {
  const [status, setStatus] = useState('verifying') // 'verifying' | 'success' | 'error'
  const [message, setMessage] = useState('')

  useEffect(() => {
    async function handleCallback() {
      const params = new URLSearchParams(window.location.search)
      const code = params.get('code')
      const errorParam = params.get('error')
      const errorDescription = params.get('error_description')

      if (errorParam) {
        setStatus('error')
        setMessage(errorDescription ?? errorParam)
        return
      }

      if (code) {
        // PKCE flow — exchange the code for a session
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (error) {
          setStatus('error')
          setMessage(error.message)
          return
        }
      }

      // For hash-based flow the Supabase client handles it automatically.
      // Either way, wait a beat for onAuthStateChange to fire, then proceed.
      setStatus('success')
      setTimeout(() => {
        // Clean up the URL so the callback params don't persist
        window.history.replaceState({}, document.title, '/')
        onDone()
      }, 1200)
    }

    handleCallback()
  }, [])

  return (
    <div className={styles.container}>
      <div className={styles.flask}>⚗️</div>

      {status === 'verifying' && (
        <>
          <p className={styles.title}>Verifying your account…</p>
          <div className={styles.dots}>
            <span /><span /><span />
          </div>
        </>
      )}

      {status === 'success' && (
        <>
          <p className={styles.title}>You're in!</p>
          <p className={styles.sub}>Welcome to AlchemList.</p>
        </>
      )}

      {status === 'error' && (
        <>
          <p className={styles.titleError}>Verification failed</p>
          <p className={styles.sub}>{message}</p>
          <button className={styles.back} onClick={() => { window.history.replaceState({}, document.title, '/'); onDone() }}>
            Back to sign in
          </button>
        </>
      )}
    </div>
  )
}
