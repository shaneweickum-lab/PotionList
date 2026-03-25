import { useState } from 'react'
import { useStore } from '../../store/index.js'
import Modal from '../ui/Modal.jsx'
import { QUEST_CATEGORIES } from '../../constants/questCategories.js'
import { isHealthyItem } from '../../lib/healthyDetect.js'
import styles from './AddQuestModal.module.css'

export default function AddQuestModal({ onClose }) {
  const addQuest = useStore(s => s.addQuest)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState(null)
  const [daily, setDaily] = useState(false)
  const [steps, setSteps] = useState(['', ''])
  const [groceries, setGroceries] = useState([''])

  // ── Steps ──
  const updateStep = (i, v) => setSteps(s => s.map((x, idx) => idx === i ? v : x))
  const addStep = () => { if (steps.length < 20) setSteps(s => [...s, '']) }
  const removeStep = (i) => { if (steps.length > 2) setSteps(s => s.filter((_, idx) => idx !== i)) }

  // ── Shopping list ──
  const updateGrocery = (i, v) => setGroceries(s => s.map((x, idx) => idx === i ? v : x))
  const addGrocery = () => { if (groceries.length < 50) setGroceries(s => [...s, '']) }
  const removeGrocery = (i) => { if (groceries.length > 1) setGroceries(s => s.filter((_, idx) => idx !== i)) }

  const isShopping = category === 'shopping'
  const validSteps = steps.filter(s => s.trim())
  const validGroceries = isShopping
    ? groceries.filter(g => g.trim()).map(name => ({ name: name.trim(), healthy: isHealthyItem(name) }))
    : []
  const canSubmit = title.trim() && validSteps.length >= 2

  const submit = (e) => {
    e.preventDefault()
    if (!canSubmit) return
    addQuest({ title, category, recurrence: daily ? 'daily' : 'none', steps: validSteps, shoppingItems: validGroceries })
    onClose()
  }

  return (
    <Modal title="New Quest" onClose={onClose}>
      <form className={styles.form} onSubmit={submit}>

        {/* Title */}
        <input
          className={styles.titleInput}
          type="text"
          placeholder="Quest title..."
          value={title}
          onChange={e => setTitle(e.target.value)}
          maxLength={60}
        />

        {/* Category */}
        <div className={styles.section}>
          <span className={styles.sectionLabel}>Category</span>
          <div className={styles.catGrid}>
            {QUEST_CATEGORIES.map(cat => (
              <button
                key={cat.id}
                type="button"
                className={`${styles.catPill} ${category === cat.id ? styles.catPillActive : ''}`}
                onClick={() => setCategory(category === cat.id ? null : cat.id)}
              >
                <span className={styles.catIcon}>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Recurrence */}
        <button
          type="button"
          className={`${styles.dailyToggle} ${daily ? styles.dailyToggleOn : ''}`}
          onClick={() => setDaily(d => !d)}
        >
          <span className={styles.dailyIcon}>↺</span>
          <span>Daily Quest</span>
          {daily && <span className={styles.dailyNote}>resets at midnight after chest is claimed</span>}
        </button>

        {/* Steps */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionLabel}>Steps</span>
            <span className={styles.hint}>min 2, max 20</span>
          </div>
          <div className={styles.itemList}>
            {steps.map((step, i) => (
              <div key={i} className={styles.itemRow}>
                <span className={styles.itemNum}>{i + 1}</span>
                <input
                  className={styles.itemInput}
                  type="text"
                  placeholder={`Step ${i + 1}...`}
                  value={step}
                  onChange={e => updateStep(i, e.target.value)}
                  maxLength={80}
                />
                {steps.length > 2 && (
                  <button type="button" className={styles.removeBtn} onClick={() => removeStep(i)}>✕</button>
                )}
              </div>
            ))}
          </div>
          {steps.length < 20 && (
            <button type="button" className={styles.addItemBtn} onClick={addStep}>+ Add Step</button>
          )}
        </div>

        {/* Shopping list — only shown when shopping category */}
        {isShopping && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionLabel}>🛒 Shopping List</span>
              <span className={styles.hint}>optional · healthy items earn bonus XP</span>
            </div>
            <div className={styles.itemList}>
              {groceries.map((item, i) => {
                const healthy = item.trim() && isHealthyItem(item)
                return (
                  <div key={i} className={styles.itemRow}>
                    <span className={`${styles.healthyDot} ${healthy ? styles.healthyDotOn : ''}`} title={healthy ? 'Healthy item — bonus XP!' : ''}>
                      {healthy ? '🥦' : '·'}
                    </span>
                    <input
                      className={styles.itemInput}
                      type="text"
                      placeholder={`Item ${i + 1}...`}
                      value={item}
                      onChange={e => updateGrocery(i, e.target.value)}
                      maxLength={60}
                    />
                    {groceries.length > 1 && (
                      <button type="button" className={styles.removeBtn} onClick={() => removeGrocery(i)}>✕</button>
                    )}
                  </div>
                )
              })}
            </div>
            {groceries.length < 50 && (
              <button type="button" className={styles.addItemBtn} onClick={addGrocery}>+ Add Item</button>
            )}
          </div>
        )}

        <div className={styles.footer}>
          <button type="submit" className={styles.submit} disabled={!canSubmit}>
            Begin Quest
          </button>
        </div>
      </form>
    </Modal>
  )
}
