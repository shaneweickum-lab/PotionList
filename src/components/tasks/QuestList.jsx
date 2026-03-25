import { useState } from 'react'
import { useStore } from '../../store/index.js'
import QuestItem from './QuestItem.jsx'
import AddQuestModal from './AddQuestModal.jsx'
import styles from './QuestList.module.css'

function timeUntilMidnight() {
  const now = new Date()
  const midnight = new Date()
  midnight.setHours(24, 0, 0, 0)
  const ms = midnight - now
  const h = Math.floor(ms / 3600000)
  const m = Math.floor((ms % 3600000) / 60000)
  return h > 0 ? `${h}h ${m}m` : `${m}m`
}

export default function QuestList() {
  const quests = useStore(s => s.quests)
  const [showAdd, setShowAdd] = useState(false)
  const now = Date.now()

  const active   = quests.filter(q => !q.nextDueAt || q.nextDueAt <= now)
  const resting  = quests.filter(q => q.nextDueAt && q.nextDueAt > now)
  // For non-daily completed quests (chestOpened but no nextDueAt)
  const claimed  = active.filter(q => q.chestOpened)
  const visible  = active.filter(q => !q.chestOpened)

  return (
    <div className={styles.list}>
      <div className={styles.bar}>
        <button className={styles.addBtn} onClick={() => setShowAdd(true)}>+ New Quest</button>
      </div>

      {quests.length === 0 && (
        <div className={styles.empty}>
          <p className={styles.emptyTitle}>No quests active.</p>
          <p className="lore">Add a quest to begin your errand.</p>
        </div>
      )}

      {visible.map(q => <QuestItem key={q.id} quest={q} />)}

      {resting.length > 0 && (
        <div className={styles.restingRow}>
          <span className={styles.restingIcon}>↺</span>
          <span>
            {resting.length === 1
              ? `1 daily quest returns in ${timeUntilMidnight()}`
              : `${resting.length} daily quests return in ${timeUntilMidnight()}`}
          </span>
        </div>
      )}

      {claimed.length > 0 && (
        <>
          <div className={styles.sectionLabel}>Completed</div>
          {claimed.map(q => <QuestItem key={q.id} quest={q} />)}
        </>
      )}

      {showAdd && <AddQuestModal onClose={() => setShowAdd(false)} />}
    </div>
  )
}
