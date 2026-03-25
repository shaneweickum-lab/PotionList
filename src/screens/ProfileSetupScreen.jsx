import { useState, useRef } from 'react'
import { completeProfile, validateHandle, signOut } from '../hooks/useAuth.js'
import Button from '../components/ui/Button.jsx'
import { showToast } from '../components/ui/ToastNotification.jsx'
import styles from './ProfileSetupScreen.module.css'

const AVATAR_EMOJIS = [
  '⚗️', '🧙', '🧝', '🧚', '🧜', '🔮', '🌙', '⭐',
  '🌿', '🍄', '🦋', '🐉', '🦊', '🐺', '🦅', '💎',
  '⚔️', '🛡️', '🌺', '🌸', '🔥', '❄️', '⚡', '🌊',
]

function AvatarPicker({ value, onChange }) {
  const fileRef = useRef(null)
  const isCustom = value && !AVATAR_EMOJIS.includes(value)

  const handleFile = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) {
      showToast('Image must be under 2 MB.', 'error')
      return
    }
    const reader = new FileReader()
    reader.onload = (ev) => onChange(ev.target.result)
    reader.readAsDataURL(file)
  }

  return (
    <div className={styles.avatarPicker}>
      <p className={styles.pickerLabel}>Choose an avatar</p>
      <div className={styles.emojiGrid}>
        {AVATAR_EMOJIS.map(em => (
          <button
            key={em}
            type="button"
            className={`${styles.emojiBtn} ${value === em ? styles.emojiBtnActive : ''}`}
            onClick={() => onChange(em)}
          >
            {em}
          </button>
        ))}
        {/* Custom image slot */}
        <button
          type="button"
          className={`${styles.emojiBtn} ${styles.uploadBtn} ${isCustom ? styles.emojiBtnActive : ''}`}
          onClick={() => fileRef.current?.click()}
          title="Upload image"
        >
          {isCustom
            ? <img src={value} alt="avatar" className={styles.uploadPreview} />
            : '📷'}
        </button>
      </div>
      <input ref={fileRef} type="file" accept="image/*" className={styles.hiddenFile} onChange={handleFile} />
      {isCustom && (
        <button type="button" className={styles.clearCustom} onClick={() => onChange(AVATAR_EMOJIS[0])}>
          Remove image
        </button>
      )}
    </div>
  )
}

export default function ProfileSetupScreen() {
  const [username, setUsername] = useState('')
  const [handleInput, setHandleInput] = useState('')
  const [handleError, setHandleError] = useState(null)
  const [handleTouched, setHandleTouched] = useState(false)
  const [nickname, setNickname] = useState('')
  const [bio, setBio] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('⚗️')
  const [loading, setLoading] = useState(false)

  const handleHandleChange = (val) => {
    const clean = val.toLowerCase().replace(/[^a-z0-9_]/g, '')
    setHandleInput(clean)
    setHandleError(validateHandle(clean))
    setHandleTouched(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const err = validateHandle(handleInput)
    if (err) { setHandleError(err); setHandleTouched(true); return }
    if (!username.trim()) { showToast('Please enter a username.', 'error'); return }

    setLoading(true)
    const result = await completeProfile({ username, handle: handleInput, nickname, bio, avatarUrl })
    setLoading(false)

    if (result.error) showToast(result.error, 'error')
    // On success, App.jsx detects username is now set and transitions to AuthenticatedApp
  }

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <div className={styles.flask}>
          {avatarUrl && AVATAR_EMOJIS.includes(avatarUrl)
            ? <span className={styles.heroEmoji}>{avatarUrl}</span>
            : avatarUrl
              ? <img src={avatarUrl} alt="avatar" className={styles.heroImg} />
              : <span className={styles.heroEmoji}>⚗️</span>
          }
        </div>
        <h1 className={styles.title}>Create Your Profile</h1>
        <p className={styles.subtitle}>How shall the world know you, Alchemist?</p>
      </div>

      <div className={styles.card}>
        <form onSubmit={handleSubmit} className={styles.form}>

          {/* Avatar */}
          <AvatarPicker value={avatarUrl} onChange={setAvatarUrl} />

          <div className={styles.divider} />

          {/* Username */}
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Username <span className={styles.required}>*</span></label>
            <input
              className={styles.input}
              type="text"
              placeholder="Your display name"
              value={username}
              onChange={e => setUsername(e.target.value)}
              maxLength={30}
              required
            />
            <p className={styles.hint}>This is how other players see you.</p>
          </div>

          {/* Handle */}
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Handle <span className={styles.required}>*</span></label>
            <div className={styles.handleRow}>
              <span className={styles.atSign}>@</span>
              <input
                className={`${styles.input} ${styles.handleField} ${handleError && handleTouched ? styles.inputError : ''}`}
                type="text"
                placeholder="yourhandle"
                value={handleInput}
                onChange={e => handleHandleChange(e.target.value)}
                maxLength={20}
                required
              />
            </div>
            {handleError && handleTouched && (
              <p className={styles.fieldError}>{handleError}</p>
            )}
            {!handleError && handleInput.length >= 3 && (
              <p className={styles.fieldOk}>@{handleInput} is available!</p>
            )}
            <p className={styles.hint}>Unique identifier others use to find you. Lowercase letters, numbers, underscores.</p>
          </div>

          {/* Nickname */}
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Nickname <span className={styles.optional}>(optional)</span></label>
            <input
              className={styles.input}
              type="text"
              placeholder="A short nickname or alias"
              value={nickname}
              onChange={e => setNickname(e.target.value)}
              maxLength={20}
            />
          </div>

          {/* Bio */}
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Bio <span className={styles.optional}>(optional)</span></label>
            <textarea
              className={`${styles.input} ${styles.textarea}`}
              placeholder="Tell other alchemists a little about yourself…"
              value={bio}
              onChange={e => setBio(e.target.value)}
              maxLength={160}
              rows={3}
            />
            <p className={styles.charCount}>{bio.length}/160</p>
          </div>

          <Button variant="gold" fullWidth disabled={loading || !!handleError || !username.trim() || !handleInput}>
            {loading ? 'Setting up…' : 'Enter the Workshop'}
          </Button>
        </form>
      </div>

      <button className={styles.cancelLink} type="button" onClick={() => signOut()}>
        Cancel — sign out
      </button>
    </div>
  )
}
