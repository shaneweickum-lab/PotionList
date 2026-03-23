import { useState } from 'react'
import { signIn, signUp, signOut } from '../../hooks/useAuth.js'
import { useStore } from '../../store/index.js'
import Button from '../ui/Button.jsx'
import { showToast } from '../ui/ToastNotification.jsx'
import styles from './AuthPanel.module.css'

export default function AuthPanel() {
  const { userId, username } = useStore()
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState('')
  const [loading, setLoading] = useState(false)

  if (userId) {
    return (
      <div className={styles.loggedIn}>
        <div className={styles.avatar}>👤</div>
        <div className={styles.username}>{username ?? 'Alchemist'}</div>
        <div className={styles.userId}>{userId.slice(0, 8)}...</div>
        <Button variant="ghost" onClick={async () => { await signOut(); showToast('Signed out', 'info') }}>
          Sign Out
        </Button>
      </div>
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    let result
    if (mode === 'login') {
      result = await signIn(email, password)
    } else {
      result = await signUp(email, password, user)
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
          <input className={styles.input} type="text" placeholder="Username" value={user} onChange={e => setUser(e.target.value)} required />
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
