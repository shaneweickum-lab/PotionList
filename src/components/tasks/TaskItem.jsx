import { useState } from 'react'
import { useStore } from '../../store/index.js'
import { showToast } from '../ui/ToastNotification.jsx'
import { SEED_MAP } from '../../constants/seeds.js'
import styles from './TaskItem.module.css'

const CATEGORY_LABELS = {
  work: 'Work', health: 'Health', personal: 'Personal', study: 'Study',
}

const PRIORITY_CLASS = {
  high: styles.priorityHigh,
  urgent: styles.priorityUrgent,
}

const EXIT_DURATION = { fade: 380, dissolve: 480, shatter: 510, burn: 540, float: 480 }

export default function TaskItem({ todo }) {
  const { completeTask, incrementTask, deleteTask } = useStore()
  const [exiting, setExiting] = useState(false)

  const target = todo.targetCount ?? 1
  const current = todo.currentCount ?? 0
  const isLastTap = current + 1 >= target

  const handleComplete = () => {
    if (exiting) return

    if (!isLastTap) {
      const reward = incrementTask(todo.id)
      if (reward) {
        let msg = `+${reward.xp} XP`
        if (reward.growthXP) msg += `  ·  🌱 +${reward.growthXP}`
        msg += `  ·  ${reward.progress}/${reward.total}`
        showToast(msg, 'gold')
      }
      return
    }

    // Final tap — play exit animation then fully complete
    setExiting(true)
    const dur = EXIT_DURATION[todo.completionAnimation ?? 'fade'] ?? 400
    setTimeout(() => {
      const reward = completeTask(todo.id)
      if (reward) {
        let msg = `+${reward.xp} XP`
        if (reward.growthXP) msg += `  ·  🌱 +${reward.growthXP}`
        if (reward.foundSeed) {
          const seed = SEED_MAP[reward.foundSeed]
          const rarity = seed?.rarity ?? 'common'
          const rarityLabel = rarity === 'epic' ? ' ✦ Epic' : rarity === 'rare' ? ' · Rare' : ''
          msg += `  ·  Found ${seed?.name ?? reward.foundSeed}${rarityLabel}!`
          const type = rarity === 'epic' ? 'epic' : rarity === 'rare' ? 'rare' : 'success'
          showToast(msg, type)
        } else {
          showToast(msg, 'gold')
        }
      }
    }, dur)
  }

  const exitClass = exiting ? styles[`exit_${todo.completionAnimation ?? 'fade'}`] : ''
  const catLabel = CATEGORY_LABELS[todo.category]
  const priorityClass = PRIORITY_CLASS[todo.priority] ?? ''

  return (
    <div className={`${styles.item} ${exitClass} fade-in`}>
      <button
        className={styles.check}
        onClick={handleComplete}
        aria-label="Complete task"
      />

      <div className={styles.body}>
        <span className={styles.text}>{todo.text}</span>

        {target > 1 && (
          <div className={styles.progress}>
            {target <= 8
              ? Array.from({ length: target }, (_, i) => (
                  <span
                    key={i}
                    className={`${styles.dot} ${i < current ? styles.dotFilled : ''}`}
                  />
                ))
              : <span className={styles.fraction}>{current}<span className={styles.fractionTotal}>/{target}</span></span>
            }
          </div>
        )}

        <div className={styles.meta}>
          {todo.priority !== 'normal' && (
            <span className={`${styles.badge} ${priorityClass}`}>
              {todo.priority}
            </span>
          )}
          {catLabel && (
            <span className={`${styles.badge} ${styles[`cat_${todo.category}`]}`}>
              {catLabel}
            </span>
          )}
          {todo.recurrence !== 'none' && (
            <span className={`${styles.badge} ${styles.recur}`}>
              ↺ {todo.recurrence}
            </span>
          )}
        </div>
      </div>

      <button
        className={styles.delete}
        onClick={() => deleteTask(todo.id)}
        aria-label="Delete task"
      >
        ✕
      </button>
    </div>
  )
}
