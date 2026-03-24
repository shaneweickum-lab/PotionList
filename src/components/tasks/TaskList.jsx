import { useStore } from '../../store/index.js'
import TaskItem from './TaskItem.jsx'
import styles from './TaskList.module.css'

export default function TaskList() {
  const { todos } = useStore()
  const now = Date.now()

  const visible = todos.filter(t => !t.nextDueAt || t.nextDueAt <= now)
  const resting = todos.filter(t => t.nextDueAt && t.nextDueAt > now)

  const isEmpty = visible.length === 0

  return (
    <div className={styles.list}>
      {isEmpty && resting.length === 0 && (
        <div className={styles.empty}>
          <p className={styles.emptyTitle}>The list is empty.</p>
          <p className="lore">Add a task and begin the work.</p>
        </div>
      )}
      {isEmpty && resting.length > 0 && (
        <div className={styles.empty}>
          <p className={styles.emptyTitle}>All tasks complete.</p>
          <p className="lore">
            {resting.length === 1
              ? '1 task will return when its time comes.'
              : `${resting.length} tasks will return when their time comes.`}
          </p>
        </div>
      )}
      {visible.map(t => <TaskItem key={t.id} todo={t} />)}
    </div>
  )
}
