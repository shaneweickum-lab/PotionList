import { useStore } from '../../store/index.js'
import TaskItem from './TaskItem.jsx'
import styles from './TaskList.module.css'

export default function TaskList() {
  const { todos, clearCompleted } = useStore()
  const activeTodos = todos.filter(t => !t.completed)
  const doneTodos = todos.filter(t => t.completed)

  return (
    <div className={styles.list}>
      {activeTodos.length === 0 && doneTodos.length === 0 && (
        <div className={styles.empty}>
          <p className={styles.emptyTitle}>The list is empty.</p>
          <p className="lore">Add a task and begin the work.</p>
        </div>
      )}
      {activeTodos.map(t => <TaskItem key={t.id} todo={t} />)}
      {doneTodos.length > 0 && (
        <>
          <div className={styles.sectionHeader}>
            <span>Completed</span>
            <button className={styles.clearBtn} onClick={clearCompleted}>Clear</button>
          </div>
          {doneTodos.map(t => <TaskItem key={t.id} todo={t} />)}
        </>
      )}
    </div>
  )
}
