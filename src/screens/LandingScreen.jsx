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
  const [awaitingConfirmation, setAwaitingConfirmation] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const result = mode === 'login'
      ? await signIn(email, password)
      : await signUp(email, password, username)
    setLoading(false)
    if (result.error) {
      showToast(result.error, 'error')
    } else if (result.confirmEmail) {
      setAwaitingConfirmation(true)
    } else {
      showToast('Welcome back.', 'success')
    }
  }

  if (awaitingConfirmation) {
    return (
      <div className={styles.container}>
        <div className={styles.hero}>
          <div className={styles.flask}>⚗️</div>
          <h1 className={styles.title}>AlchemList</h1>
        </div>
        <div className={styles.card}>
          <div className={styles.confirmBox}>
            <p className={styles.confirmIcon}>📬</p>
            <p className={styles.confirmTitle}>Check your email</p>
            <p className={styles.confirmSub}>
              We sent a confirmation link to <strong>{email}</strong>.
              Click it to activate your account, then sign in.
            </p>
            <button className={styles.backLink} onClick={() => { setAwaitingConfirmation(false); setMode('login') }}>
              Back to sign in
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <div className={styles.flask}>⚗️</div>
        <h1 className={styles.title}>AlchemList</h1>
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
