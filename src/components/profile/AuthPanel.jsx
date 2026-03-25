import { useState } from 'react'
import { signIn, signUp, signOut, validateHandle } from '../../hooks/useAuth.js'
import { useStore } from '../../store/index.js'
import Button from '../ui/Button.jsx'
import { showToast } from '../ui/ToastNotification.jsx'
import styles from './AuthPanel.module.css'

export default function AuthPanel() {
  const { userId, username, handle } = useStore()
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState('')
  const [handleInput, setHandleInput] = useState('')
  const [handleError, setHandleError] = useState(null)
  const [loading, setLoading] = useState(false)

  if (username) {
    return (
      <div className={styles.loggedIn}>
        <div className={styles.avatar}>👤</div>
        <div className={styles.username}>{username}</div>
        {handle && <div className={styles.userId}>@{handle}</div>}
        {!handle && userId && <div className={styles.userId}>{userId}</div>}
        <Button variant="ghost" onClick={async () => { await signOut(); showToast('Signed out', 'info') }}>
          Sign Out
        </Button>
      </div>
    )
  }

  const handleHandleChange = (val) => {
    // Enforce lowercase alphanumeric + underscore only
    const clean = val.toLowerCase().replace(/[^a-z0-9_]/g, '')
    setHandleInput(clean)
    setHandleError(validateHandle(clean))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (mode === 'signup') {
      const err = validateHandle(handleInput)
      if (err) { setHandleError(err); return }
    }
    setLoading(true)
    let result
    if (mode === 'login') {
      result = await signIn(email, password)
    } else {
      result = await signUp(email, password, user, handleInput)
    }
    setLoading(false)
    if (result.error) showToast(result.error, 'error')
    else showToast(mode === 'login' ? 'Welcome back.' : 'Account created.', 'success')
  }

  return (
    <div className={styles.auth}>
      <div className={styles.tabs}>
        <button className={`${styles.tab} ${mode === 'login' ? styles.active : ''}`} onClick={() => setMode('login')}>Sign In</button>
        <button className={`${styles.tab} ${mode === 'signup' ? styles.active : ''}`} onClick={() => setMode('signup')}>Create Account</button>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        {mode === 'signup' && (
          <>
            <input
              className={styles.input}
              type="text"
              placeholder="Username (display name)"
              value={user}
              onChange={e => setUser(e.target.value)}
              required
            />
            <div className={styles.handleRow}>
              <span className={styles.atPrefix}>@</span>
              <input
                className={`${styles.input} ${styles.handleField} ${handleError && handleInput ? styles.inputError : ''}`}
                type="text"
                placeholder="handle (e.g. brewmaster99)"
                value={handleInput}
                onChange={e => handleHandleChange(e.target.value)}
                required
              />
            </div>
            {handleError && handleInput && (
              <p className={styles.fieldError}>{handleError}</p>
            )}
            {!handleError && handleInput.length >= 3 && (
              <p className={styles.fieldOk}>@{handleInput} looks good!</p>
            )}
          </>
        )}
        <input className={styles.input} type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input className={styles.input} type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
        <Button variant="gold" fullWidth disabled={loading}>
          {loading ? 'Working...' : mode === 'login' ? 'Sign In' : 'Create Account'}
        </Button>
      </form>

    </div>
  )
}
