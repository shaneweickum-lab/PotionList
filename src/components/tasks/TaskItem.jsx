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

export default function TaskItem({ todo }) {
  const EXIT_DURATION = { fade: 380, dissolve: 480, shatter: 510, burn: 540, float: 480 }

  const { completeTask, deleteTask } = useStore()
  const [exiting, setExiting] = useState(false)

  const handleComplete = () => {
    if (todo.completed || exiting) return
    setExiting(true)
    const dur = EXIT_DURATION[todo.completionAnimation ?? 'fade'] ?? 400
    setTimeout(() => {
      const reward = completeTask(todo.id)
      if (reward) {
        let msg = `+${reward.xp} XP`
        if (reward.foundSeed) {
          const seed = SEED_MAP[reward.foundSeed]
          msg += ` · Found ${seed?.name ?? reward.foundSeed}!`
          showToast(msg, 'success')
        } else {
          showToast(msg, 'gold')
        }
      }
    }, dur)
  }

  const exitClass = exiting ? styles[`exit_${todo.completionAnimation ?? 'fade'}`] : ''
  const doneClass = todo.completed && !exiting ? styles.done : ''
  const catLabel = CATEGORY_LABELS[todo.category]
  const priorityClass = PRIORITY_CLASS[todo.priority] ?? ''

  return (
    <div className={`${styles.item} ${doneClass} ${exitClass} fade-in`}>
      <button
        className={`${styles.check} ${todo.completed ? styles.checked : ''}`}
        onClick={handleComplete}
        aria-label="Complete task"
      >
        {todo.completed ? '✓' : ''}
      </button>

      <div className={styles.body}>
        <span className={styles.text}>{todo.text}</span>
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
