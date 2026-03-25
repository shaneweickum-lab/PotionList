import { useState, useRef } from 'react'
import { signOut, completeProfile, validateHandle } from '../../hooks/useAuth.js'
import { useStore } from '../../store/index.js'
import Button from '../ui/Button.jsx'
import { showToast } from '../ui/ToastNotification.jsx'
import { THEMES, getTheme, applyTheme } from '../../lib/theme.js'
import styles from './SettingsPanel.module.css'

const AVATAR_EMOJIS = [
  '⚗️', '🧙', '🧝', '🧚', '🧜', '🔮', '🌙', '⭐',
  '🌿', '🍄', '🦋', '🐉', '🦊', '🐺', '🦅', '💎',
  '⚔️', '🛡️', '🌺', '🌸', '🔥', '❄️', '⚡', '🌊',
]

function Section({ title, children }) {
  return (
    <div className={styles.section}>
      <div className={styles.sectionTitle}>{title}</div>
      {children}
    </div>
  )
}

function AvatarPickerInline({ value, onChange }) {
  const fileRef = useRef(null)
  const isCustom = value && !AVATAR_EMOJIS.includes(value)

  const handleFile = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) { showToast('Image must be under 2 MB.', 'error'); return }
    const reader = new FileReader()
    reader.onload = (ev) => onChange(ev.target.result)
    reader.readAsDataURL(file)
  }

  return (
    <div className={styles.avatarPicker}>
      <div className={styles.emojiGrid}>
        {AVATAR_EMOJIS.map(em => (
          <button key={em} type="button"
            className={`${styles.emojiBtn} ${value === em ? styles.emojiBtnActive : ''}`}
            onClick={() => onChange(em)}
          >{em}</button>
        ))}
        <button type="button"
          className={`${styles.emojiBtn} ${isCustom ? styles.emojiBtnActive : ''}`}
          onClick={() => fileRef.current?.click()}
          title="Upload image"
        >
          {isCustom ? <img src={value} alt="avatar" className={styles.uploadPreview} /> : '📷'}
        </button>
      </div>
      <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />
    </div>
  )
}

function ProfileSection() {
  const { username, handle, nickname, bio, avatarUrl } = useStore()
  const [editing, setEditing] = useState(false)

  // Edit form state
  const [editUsername, setEditUsername] = useState(username ?? '')
  const [editHandle, setEditHandle] = useState(handle ?? '')
  const [editHandleError, setEditHandleError] = useState(null)
  const [editHandleTouched, setEditHandleTouched] = useState(false)
  const [editNickname, setEditNickname] = useState(nickname ?? '')
  const [editBio, setEditBio] = useState(bio ?? '')
  const [editAvatar, setEditAvatar] = useState(avatarUrl ?? '⚗️')
  const [saving, setSaving] = useState(false)

  const startEdit = () => {
    setEditUsername(username ?? '')
    setEditHandle(handle ?? '')
    setEditHandleError(null)
    setEditHandleTouched(false)
    setEditNickname(nickname ?? '')
    setEditBio(bio ?? '')
    setEditAvatar(avatarUrl ?? '⚗️')
    setEditing(true)
  }

  const handleHandleChange = (val) => {
    const clean = val.toLowerCase().replace(/[^a-z0-9_]/g, '')
    setEditHandle(clean)
    setEditHandleError(validateHandle(clean))
    setEditHandleTouched(true)
  }

  const handleSave = async () => {
    const err = validateHandle(editHandle)
    if (err) { setEditHandleError(err); setEditHandleTouched(true); return }
    if (!editUsername.trim()) { showToast('Username is required.', 'error'); return }
    setSaving(true)
    const result = await completeProfile({
      username: editUsername,
      handle: editHandle,
      nickname: editNickname,
      bio: editBio,
      avatarUrl: editAvatar,
    })
    setSaving(false)
    if (result.error) showToast(result.error, 'error')
    else { showToast('Profile updated!', 'success'); setEditing(false) }
  }

  const isEmoji = avatarUrl && AVATAR_EMOJIS.includes(avatarUrl)

  if (editing) {
    return (
      <div className={styles.profileEdit}>
        <AvatarPickerInline value={editAvatar} onChange={setEditAvatar} />

        <div className={styles.editField}>
          <label className={styles.editLabel}>Username</label>
          <input className={styles.editInput} type="text" value={editUsername}
            onChange={e => setEditUsername(e.target.value)} maxLength={30} placeholder="Display name" />
        </div>

        <div className={styles.editField}>
          <label className={styles.editLabel}>Handle</label>
          <div className={styles.handleRow}>
            <span className={styles.atSign}>@</span>
            <input
              className={`${styles.editInput} ${styles.handleInput} ${editHandleError && editHandleTouched ? styles.inputError : ''}`}
              type="text" value={editHandle}
              onChange={e => handleHandleChange(e.target.value)} maxLength={20} placeholder="yourhandle"
            />
          </div>
          {editHandleError && editHandleTouched && <p className={styles.fieldError}>{editHandleError}</p>}
          {!editHandleError && editHandle.length >= 3 && <p className={styles.fieldOk}>@{editHandle}</p>}
        </div>

        <div className={styles.editField}>
          <label className={styles.editLabel}>Nickname <span className={styles.optional}>(optional)</span></label>
          <input className={styles.editInput} type="text" value={editNickname}
            onChange={e => setEditNickname(e.target.value)} maxLength={20} placeholder="Short alias" />
        </div>

        <div className={styles.editField}>
          <label className={styles.editLabel}>Bio <span className={styles.optional}>(optional)</span></label>
          <textarea className={`${styles.editInput} ${styles.editTextarea}`}
            value={editBio} onChange={e => setEditBio(e.target.value)}
            maxLength={160} rows={3} placeholder="Tell other alchemists about yourself…" />
          <p className={styles.charCount}>{editBio.length}/160</p>
        </div>

        <div className={styles.editActions}>
          <Button variant="gold" fullWidth disabled={saving || !!editHandleError || !editUsername.trim()} onClick={handleSave}>
            {saving ? 'Saving…' : 'Save Profile'}
          </Button>
          <button type="button" className={styles.cancelEdit} onClick={() => setEditing(false)}>Cancel</button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.profileCard}>
      <div className={styles.profileAvatar}>
        {isEmoji
          ? <span className={styles.profileEmoji}>{avatarUrl}</span>
          : avatarUrl
            ? <img src={avatarUrl} alt="avatar" className={styles.profileImg} />
            : <span className={styles.profileEmoji}>⚗️</span>
        }
      </div>
      <div className={styles.profileInfo}>
        <span className={styles.profileUsername}>{username}</span>
        {handle && <span className={styles.profileHandle}>@{handle}</span>}
        {nickname && <span className={styles.profileNickname}>"{nickname}"</span>}
        {bio && <p className={styles.profileBio}>{bio}</p>}
      </div>
      <button className={styles.editBtn} onClick={startEdit}>Edit</button>
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

      <Section title="Profile">
        <ProfileSection />
      </Section>

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
