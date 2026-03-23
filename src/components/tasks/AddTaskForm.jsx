import { useState } from 'react'
import { useStore } from '../../store/index.js'
import styles from './AddTaskForm.module.css'

export default function AddTaskForm() {
  const [text, setText] = useState('')
  const addTask = useStore(s => s.addTask)

  const submit = (e) => {
    e.preventDefault()
    if (!text.trim()) return
    addTask(text)
    setText('')
  }

  return (
    <form className={styles.form} onSubmit={submit}>
      <input
        className={styles.input}
        type="text"
        placeholder="Add a task to the list..."
        value={text}
        onChange={e => setText(e.target.value)}
        maxLength={120}
      />
      <button type="submit" className={styles.addBtn} disabled={!text.trim()}>
        +
      </button>
    </form>
  )
}
