import { useState } from 'react'
import AddTaskForm from '../components/tasks/AddTaskForm.jsx'
import TaskList from '../components/tasks/TaskList.jsx'
import QuestList from '../components/tasks/QuestList.jsx'
import { useStore } from '../store/index.js'
import styles from './TasksScreen.module.css'

export default function TasksScreen() {
  const { streak, longestStreak } = useStore()
  const [tab, setTab] = useState('tasks')

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

      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${tab === 'tasks' ? styles.tabActive : ''}`}
          onClick={() => setTab('tasks')}
        >
          Tasks
        </button>
        <button
          className={`${styles.tab} ${tab === 'quests' ? styles.tabActive : ''}`}
          onClick={() => setTab('quests')}
        >
          Quests
        </button>
      </div>

      {tab === 'tasks' && <><AddTaskForm /><TaskList /></>}
      {tab === 'quests' && <QuestList />}
    </div>
  )
}
