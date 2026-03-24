import { useState } from 'react'
import AddTaskModal from './AddTaskModal.jsx'
import styles from './AddTaskForm.module.css'

export default function AddTaskForm() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div className={styles.bar}>
        <button className={styles.addBtn} onClick={() => setOpen(true)}>
          + Add Task
        </button>
      </div>
      {open && <AddTaskModal onClose={() => setOpen(false)} />}
    </>
  )
}
