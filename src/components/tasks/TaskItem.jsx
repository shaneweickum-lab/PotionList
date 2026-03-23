import { useStore } from '../../store/index.js'
import { showToast } from '../ui/ToastNotification.jsx'
import { SEED_MAP } from '../../constants/seeds.js'
import styles from './TaskItem.module.css'

export default function TaskItem({ todo }) {
  const { completeTask, deleteTask } = useStore()

  const handleComplete = () => {
    if (todo.completed) return
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
  }

  return (
    <div className={`${styles.item} ${todo.completed ? styles.done : ''} fade-in`}>
      <button
        className={`${styles.check} ${todo.completed ? styles.checked : ''}`}
        onClick={handleComplete}
        aria-label="Complete task"
      >
        {todo.completed ? '✓' : ''}
      </button>
      <span className={styles.text}>{todo.text}</span>
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
