import { useState } from 'react'
import { signIn, signUp } from '../hooks/useAuth.js'
import Button from '../components/ui/Button.jsx'
import { showToast } from '../components/ui/ToastNotification.jsx'
import styles from './LandingScreen.module.css'

export default function LandingScreen() {
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const result = mode === 'login'
      ? await signIn(email, password)
      : await signUp(email, password, username)
    setLoading(false)
    if (result.error) showToast(result.error, 'error')
    else showToast(mode === 'login' ? 'Welcome back.' : 'Account created.', 'success')
  }

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <div className={styles.flask}>⚗️</div>
        <h1 className={styles.title}>PotionList</h1>
        <p className={styles.subtitle}>Brew your day. Complete your quests.</p>
      </div>

      <div className={styles.card}>
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${mode === 'login' ? styles.active : ''}`}
            onClick={() => setMode('login')}
          >
            Sign In
          </button>
          <button
            className={`${styles.tab} ${mode === 'signup' ? styles.active : ''}`}
            onClick={() => setMode('signup')}
          >
            Create Account
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {mode === 'signup' && (
            <input
              className={styles.input}
              type="text"
              placeholder="Username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
            />
          )}
          <input
            className={styles.input}
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            className={styles.input}
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <Button variant="gold" fullWidth disabled={loading}>
            {loading ? 'Working...' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </Button>
        </form>
      </div>
    </div>
  )
}
