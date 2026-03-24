import { useState } from 'react'
import { useStore } from '../../store/index.js'
import Modal from '../ui/Modal.jsx'
import styles from './AddTaskModal.module.css'

const PRIORITIES = [
  { value: 'normal', label: 'Normal' },
  { value: 'high',   label: 'High'   },
  { value: 'urgent', label: 'Urgent' },
]

const CATEGORIES = [
  { value: 'general',  label: 'General'  },
  { value: 'work',     label: 'Work'     },
  { value: 'health',   label: 'Health'   },
  { value: 'personal', label: 'Personal' },
  { value: 'study',    label: 'Study'    },
]

const RECURRENCES = [
  { value: 'none',    label: 'None'    },
  { value: 'daily',   label: 'Daily'   },
  { value: 'weekly',  label: 'Weekly'  },
  { value: 'monthly', label: 'Monthly' },
]

const ANIMATIONS = [
  { value: 'fade',     label: 'Fade',    desc: 'Gently fades away'        },
  { value: 'dissolve', label: 'Dissolve', desc: 'Blurs into nothing'       },
  { value: 'shatter',  label: 'Shatter',  desc: 'Breaks apart'             },
  { value: 'burn',     label: 'Ember',    desc: 'Burns away in flames'     },
  { value: 'float',    label: 'Ascend',   desc: 'Drifts upward and vanishes' },
]

export default function AddTaskModal({ onClose }) {
  const [text, setText] = useState('')
  const [priority, setPriority] = useState('normal')
  const [category, setCategory] = useState('general')
  const [recurrence, setRecurrence] = useState('none')
  const [animation, setAnimation] = useState('fade')
  const addTask = useStore(s => s.addTask)

  const submit = (e) => {
    e.preventDefault()
    if (!text.trim()) return
    addTask({ text, priority, category, recurrence, completionAnimation: animation })
    onClose()
  }

  return (
    <Modal title="New Task" onClose={onClose}>
      <form className={styles.form} onSubmit={submit}>

        <input
          className={styles.input}
          type="text"
          placeholder="What must be done..."
          value={text}
          onChange={e => setText(e.target.value)}
          maxLength={120}
          autoFocus
        />

        <OptionRow label="Priority">
          {PRIORITIES.map(p => (
            <Pill
              key={p.value}
              active={priority === p.value}
              onClick={() => setPriority(p.value)}
              className={styles[`priority_${p.value}`]}
            >
              {p.label}
            </Pill>
          ))}
        </OptionRow>

        <OptionRow label="Category">
          {CATEGORIES.map(c => (
            <Pill
              key={c.value}
              active={category === c.value}
              onClick={() => setCategory(c.value)}
              className={styles[`cat_${c.value}`]}
            >
              {c.label}
            </Pill>
          ))}
        </OptionRow>

        <OptionRow label="Repeats">
          {RECURRENCES.map(r => (
            <Pill
              key={r.value}
              active={recurrence === r.value}
              onClick={() => setRecurrence(r.value)}
            >
              {r.label}
            </Pill>
          ))}
        </OptionRow>

        <OptionRow label="On complete">
          <div className={styles.animGrid}>
            {ANIMATIONS.map(a => (
              <button
                key={a.value}
                type="button"
                className={`${styles.animOption} ${animation === a.value ? styles.animActive : ''}`}
                onClick={() => setAnimation(a.value)}
              >
                <span className={styles.animLabel}>{a.label}</span>
                <span className={styles.animDesc}>{a.desc}</span>
              </button>
            ))}
          </div>
        </OptionRow>

        <button
          type="submit"
          className={styles.submit}
          disabled={!text.trim()}
        >
          Add Task
        </button>

      </form>
    </Modal>
  )
}

function OptionRow({ label, children }) {
  return (
    <div className={styles.row}>
      <span className={styles.rowLabel}>{label}</span>
      <div className={styles.rowOptions}>{children}</div>
    </div>
  )
}

function Pill({ active, onClick, children, className }) {
  return (
    <button
      type="button"
      className={`${styles.pill} ${active ? styles.pillActive : ''} ${className ?? ''}`}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
