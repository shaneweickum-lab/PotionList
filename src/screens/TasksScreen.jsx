import AddTaskForm from '../components/tasks/AddTaskForm.jsx'
import TaskList from '../components/tasks/TaskList.jsx'
import { useStore } from '../store/index.js'
import styles from './TasksScreen.module.css'

export default function TasksScreen() {
  const { streak, longestStreak } = useStore()

  return (
    <div className={styles.screen}>
      <div className={styles.streakBar}>
        <span className={styles.streakItem}>
          <span className={styles.streakIcon}>🔥</span>
          <span>{streak} day streak</span>
        </span>
        <span className={styles.streakItem}>
          <span className={styles.streakIcon}>🏆</span>
          <span>Best: {longestStreak}</span>
        </span>
      </div>
      <AddTaskForm />
      <TaskList />
    </div>
  )
}
