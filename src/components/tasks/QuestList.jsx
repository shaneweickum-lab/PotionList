import { useState } from 'react'
import { DndContext, closestCenter, PointerSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable'
import { restrictToVerticalAxis, restrictToParentElement } from '@dnd-kit/modifiers'
import { useStore } from '../../store/index.js'
import QuestItem from './QuestItem.jsx'
import AddQuestModal from './AddQuestModal.jsx'
import styles from './QuestList.module.css'

function timeUntil(ts) {
  const diff = ts - Date.now()
  if (diff <= 0) return 'soon'
  const days  = Math.floor(diff / 86400000)
  const hours = Math.floor((diff % 86400000) / 3600000)
  const mins  = Math.floor((diff % 3600000) / 60000)
  if (days > 0)  return `${days}d ${hours}h`
  if (hours > 0) return `${hours}h ${mins}m`
  return `${mins}m`
}

export default function QuestList() {
  const { quests, reorderQuests } = useStore()
  const [showAdd, setShowAdd] = useState(false)
  const now = Date.now()

  const active  = quests.filter(q => !q.nextDueAt || q.nextDueAt <= now)
  const resting = quests.filter(q => q.nextDueAt && q.nextDueAt > now)
  const visible = active.filter(q => !q.chestOpened)
  const claimed = active.filter(q => q.chestOpened)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 6 } }),
  )

  const handleDragEnd = ({ active: a, over }) => {
    if (!over || a.id === over.id) return
    const oldIndex = visible.findIndex(q => q.id === a.id)
    const newIndex = visible.findIndex(q => q.id === over.id)
    if (oldIndex !== -1 && newIndex !== -1) {
      reorderQuests(arrayMove(visible, oldIndex, newIndex).map(q => q.id))
    }
  }

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

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis, restrictToParentElement]}
      >
        <SortableContext items={visible.map(q => q.id)} strategy={verticalListSortingStrategy}>
          {visible.map(q => <QuestItem key={q.id} quest={q} />)}
        </SortableContext>
      </DndContext>

      {resting.length > 0 && (
        <>
          <div className={styles.sectionLabel}>Resting</div>
          {resting.map(q => (
            <div key={q.id} className={styles.restingRow}>
              <span className={styles.restingIcon}>↺</span>
              <span className={styles.restingTitle}>{q.title}</span>
              <span className={styles.restingTime}>{timeUntil(q.nextDueAt)}</span>
            </div>
          ))}
        </>
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
