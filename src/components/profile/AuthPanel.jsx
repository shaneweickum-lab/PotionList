import { useState } from 'react'
import { signIn, signOut } from '../../hooks/useAuth.js'
import { useStore } from '../../store/index.js'
import Button from '../ui/Button.jsx'
import { showToast } from '../ui/ToastNotification.jsx'
import styles from './AuthPanel.module.css'

export default function AuthPanel() {
  const { userId, username, handle, avatarUrl } = useStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const isEmoji = avatarUrl && avatarUrl.length <= 2

  if (username) {
    return (
      <div className={styles.loggedIn}>
        <div className={styles.avatar}>
          {avatarUrl
            ? isEmoji
              ? <span className={styles.avatarEmoji}>{avatarUrl}</span>
              : <img src={avatarUrl} alt="avatar" className={styles.avatarImg} />
            : <span className={styles.avatarEmoji}>👤</span>
          }
        </div>
        <div className={styles.username}>{username}</div>
        {handle && <div className={styles.userId}>@{handle}</div>}
        {!handle && userId && <div className={styles.userId}>{userId}</div>}
        <Button variant="ghost" onClick={async () => { await signOut(); showToast('Signed out', 'info') }}>
          Sign Out
        </Button>
      </div>
    )
  }

  // Shown when switching to a different existing account from settings
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const result = await signIn(email, password)
    setLoading(false)
    if (result.error) showToast(result.error, 'error')
    else showToast('Welcome back.', 'success')
  }

  return (
    <div className={styles.auth}>
      <p className={styles.switchNote}>Sign in to switch to a different account on this device.</p>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input className={styles.input} type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input className={styles.input} type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
        <Button variant="gold" fullWidth disabled={loading}>
          {loading ? 'Working...' : 'Sign In'}
        </Button>
      </form>
    </div>
  )
}
