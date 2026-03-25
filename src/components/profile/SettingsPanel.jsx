import { useState } from 'react'
import { signOut } from '../../hooks/useAuth.js'
import { showToast } from '../ui/ToastNotification.jsx'
import { THEMES, getTheme, applyTheme } from '../../lib/theme.js'
import styles from './SettingsPanel.module.css'

function Section({ title, children }) {
  return (
    <div className={styles.section}>
      <div className={styles.sectionTitle}>{title}</div>
      {children}
    </div>
  )
}

function NotificationsRow() {
  const [perm, setPerm] = useState(() =>
    'Notification' in window ? Notification.permission : 'unsupported'
  )

  const request = async () => {
    const result = await Notification.requestPermission()
    setPerm(result)
    if (result === 'granted') showToast('Notifications enabled', 'success')
  }

  if (perm === 'unsupported') {
    return <p className={styles.notifNote}>Not supported on this device.</p>
  }
  if (perm === 'granted') {
    return (
      <div className={styles.row}>
        <span className={styles.rowLabel}>Push Notifications</span>
        <span className={styles.badge}>On</span>
      </div>
    )
  }
  if (perm === 'denied') {
    return (
      <div className={styles.row}>
        <span className={styles.rowLabel}>Push Notifications</span>
        <span className={styles.badgeMuted}>Blocked — enable in browser settings</span>
      </div>
    )
  }
  return (
    <div className={styles.row}>
      <span className={styles.rowLabel}>Push Notifications</span>
      <button className={styles.enableBtn} onClick={request}>Enable</button>
    </div>
  )
}

export default function SettingsPanel() {
  const [theme, setThemeState] = useState(getTheme)

  const pickTheme = (id) => {
    applyTheme(id)
    setThemeState(id)
  }

  const handleSignOut = async () => {
    await signOut()
    showToast('Signed out', 'info')
  }

  return (
    <div className={styles.panel}>

      <Section title="Appearance">
        <div className={styles.themeGrid}>
          {THEMES.map(t => (
            <button
              key={t.id}
              className={`${styles.themeTile} ${theme === t.id ? styles.themeTileActive : ''}`}
              onClick={() => pickTheme(t.id)}
              title={t.label}
            >
              <span
                className={styles.swatch}
                style={{ background: `linear-gradient(135deg, ${t.bg} 50%, ${t.accent} 50%)` }}
              />
              <span className={styles.themeLabel}>{t.label}</span>
            </button>
          ))}
        </div>
      </Section>

      <Section title="Notifications">
        <NotificationsRow />
      </Section>

      <Section title="About">
        <div className={styles.about}>
          <div className={styles.aboutTitle}>AlchemList</div>
          <div className={styles.aboutByline}>by Wizards Playground</div>
          <div className={styles.aboutSub}>Brew your day. Complete your quests.</div>
          <div className={styles.aboutBody}>
            A gamified task manager for alchemists. Complete quests, grow your garden,
            brew potions, and uncover the secrets of the Valley.
          </div>
          <div className={styles.aboutVersion}>v1.0 — Local Edition</div>
        </div>
      </Section>

      <Section title="Account">
        <button className={styles.signOutBtn} onClick={handleSignOut}>
          Sign Out
        </button>
      </Section>

    </div>
  )
}
