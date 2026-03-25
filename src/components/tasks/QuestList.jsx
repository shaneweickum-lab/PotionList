import { useState } from 'react'
import { useStore } from '../../store/index.js'
import QuestItem from './QuestItem.jsx'
import AddQuestModal from './AddQuestModal.jsx'
import styles from './QuestList.module.css'

export default function QuestList() {
  const quests = useStore(s => s.quests)
  const [showAdd, setShowAdd] = useState(false)

  const active = quests.filter(q => !q.chestOpened)
  const claimed = quests.filter(q => q.chestOpened)

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

      {active.map(q => <QuestItem key={q.id} quest={q} />)}

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
