import { useState } from 'react'
import { useStore } from '../../store/index.js'
import Modal from '../ui/Modal.jsx'
import { showToast } from '../ui/ToastNotification.jsx'
import { BREED_DEFS, FARMABLE_BUG_IDS, getIngredientDef } from '../../constants/bugFarm.js'
import { BUG_MAP } from '../../constants/bugs.js'
import styles from './BugBreedModal.module.css'

const RARITY_COLOR = { common: 'var(--text-dim)', uncommon: '#b0c0d4', rare: 'var(--gold)', epic: 'var(--purple)' }

export default function BugBreedModal({ onClose }) {
  const { bugFarm, inventory, todos, level, startBreed } = useStore()
  const [selectedBug, setSelectedBug] = useState(null)
  const [selectedTaskId, setSelectedTaskId] = useState(null)

  const recurringTasks = todos.filter(t => t.recurrence !== 'none' && (!t.nextDueAt || t.nextDueAt <= Date.now() + 86400000 * 30))

  // Determine eligibility for each farmable bug
  const bugOptions = FARMABLE_BUG_IDS.map(bugId => {
    const def = BREED_DEFS[bugId]
    const bugDef = BUG_MAP[bugId]
    const farm = bugFarm[bugId] ?? { m: 0, f: 0 }
    const hasPair = farm.m >= 1 && farm.f >= 1
    const meetsLevel = (level ?? 1) >= def.levelReq
    const ingDef = getIngredientDef(bugId)
    const hasIngredient = (inventory[def.ingredient] ?? 0) >= 1
    const hasFeed = (inventory['bug_feed'] ?? 0) >= def.feedQty
    const canBreed = hasPair && meetsLevel && hasIngredient && hasFeed

    return { bugId, def, bugDef, farm, hasPair, meetsLevel, hasIngredient, hasFeed, canBreed, ingDef }
  })

  const sel = selectedBug ? bugOptions.find(b => b.bugId === selectedBug) : null

  const handleBegin = () => {
    if (!selectedBug || !selectedTaskId) return
    const task = todos.find(t => t.id === selectedTaskId)
    const result = startBreed({ bugId: selectedBug, taskId: selectedTaskId, taskText: task?.text ?? '' })
    if (result?.error) return showToast(result.error, 'error')
    showToast('Breeding begun. Complete your task 7 times to hatch.', 'success')
    onClose()
  }

  return (
    <Modal title="Start Breeding" onClose={onClose}>
      <div className={styles.form}>

        {/* Bug selector */}
        <div className={styles.section}>
          <div className={styles.sectionLabel}>Choose Bug</div>
          <div className={styles.bugGrid}>
            {bugOptions.map(({ bugId, def, bugDef, farm, hasPair, meetsLevel, canBreed }) => (
              <button
                key={bugId}
                className={`${styles.bugCard} ${selectedBug === bugId ? styles.bugCardActive : ''} ${!canBreed ? styles.bugCardLocked : ''}`}
                onClick={() => canBreed && setSelectedBug(bugId)}
                disabled={!canBreed}
              >
                <span className={styles.bugDot} style={{ background: bugDef?.color }} />
                <span className={styles.bugName} style={{ color: RARITY_COLOR[def.rarity] }}>{bugDef?.name}</span>
                {meetsLevel ? (
                  <span className={styles.bugPair}>
                    {hasPair ? `♂${farm.m} ♀${farm.f}` : <span className={styles.lockReason}>need pair</span>}
                  </span>
                ) : (
                  <span className={styles.lockReason}>lv.{def.levelReq}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Requirements for selected bug */}
        {sel && (
          <div className={styles.section}>
            <div className={styles.sectionLabel}>Requirements</div>
            <div className={styles.reqList}>
              <div className={`${styles.req} ${sel.hasFeed ? styles.reqMet : styles.reqMissing}`}>
                <span>{sel.hasFeed ? '✓' : '✗'}</span>
                <span>{sel.def.feedQty}× Bug Feed</span>
                <span className={styles.reqHave}>({inventory['bug_feed'] ?? 0} owned)</span>
              </div>
              <div className={`${styles.req} ${sel.hasIngredient ? styles.reqMet : styles.reqMissing}`}>
                <span>{sel.hasIngredient ? '✓' : '✗'}</span>
                <span>1× {sel.ingDef?.name ?? sel.def.ingredient}</span>
                {sel.ingDef && <span className={styles.reqIngColor} style={{ color: sel.ingDef.color }}>●</span>}
                <span className={styles.reqHave}>({inventory[sel.def.ingredient] ?? 0} owned)</span>
              </div>
            </div>
            <p className={styles.lore}>{sel.def.lore}</p>
          </div>
        )}

        {/* Task picker */}
        <div className={styles.section}>
          <div className={styles.sectionLabel}>Breeding Task <span className={styles.hint}>— complete 7 times to hatch</span></div>
          {recurringTasks.length === 0 ? (
            <p className={styles.noTasks}>No recurring tasks found. Add a daily or weekly task in the Tasks tab first.</p>
          ) : (
            <div className={styles.taskList}>
              {recurringTasks.map(task => (
                <button
                  key={task.id}
                  className={`${styles.taskRow} ${selectedTaskId === task.id ? styles.taskRowActive : ''}`}
                  onClick={() => setSelectedTaskId(task.id)}
                >
                  <span className={`${styles.taskCheck} ${selectedTaskId === task.id ? styles.taskCheckOn : ''}`} />
                  <span className={styles.taskText}>{task.text}</span>
                  <span className={styles.taskRecur}>↺ {task.recurrence}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className={styles.footer}>
          <button
            className={styles.beginBtn}
            onClick={handleBegin}
            disabled={!selectedBug || !selectedTaskId}
          >
            Begin Breeding
          </button>
        </div>
      </div>
    </Modal>
  )
}
