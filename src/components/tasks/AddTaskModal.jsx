import { useState, useRef } from 'react'
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
  { value: 'fade',     label: 'Fade',    desc: 'Gently fades away'          },
  { value: 'dissolve', label: 'Dissolve', desc: 'Blurs into mist'           },
  { value: 'shatter',  label: 'Shatter',  desc: 'Breaks apart'              },
  { value: 'burn',     label: 'Ember',    desc: 'Burns away in fire'        },
  { value: 'float',    label: 'Ascend',   desc: 'Drifts upward and vanishes' },
]

// Must match durations in index.css keyframes
const ANIM_DURATION = { fade: 420, dissolve: 520, shatter: 550, burn: 580, float: 520 }

const ANIM_STYLE = {
  fade:     'taskExitFade     0.42s ease        forwards',
  dissolve: 'taskExitDissolve 0.52s ease        forwards',
  shatter:  'taskExitShatter  0.55s ease        forwards',
  burn:     'taskExitBurn     0.58s ease-in     forwards',
  float:    'taskExitFloat    0.52s ease-in-out forwards',
}

export default function AddTaskModal({ onClose }) {
  const [text, setText] = useState('')
  const [priority, setPriority] = useState('normal')
  const [category, setCategory] = useState('general')
  const [recurrence, setRecurrence] = useState('none')
  const [animation, setAnimation] = useState('fade')
  const [count, setCount] = useState(1)

  const [previewKey, setPreviewKey] = useState(0)
  const [previewAnim, setPreviewAnim] = useState(null)
  const previewTimer = useRef(null)

  const addTask = useStore(s => s.addTask)

  const selectAnim = (val) => {
    setAnimation(val)
    clearTimeout(previewTimer.current)
    // Reset the preview element (new key = remount = fresh animation state)
    setPreviewAnim(null)
    setPreviewKey(k => k + 1)
    requestAnimationFrame(() => {
      setPreviewAnim(val)
      previewTimer.current = setTimeout(
        () => setPreviewAnim(null),
        ANIM_DURATION[val] + 120,
      )
    })
  }

  const submit = (e) => {
    e.preventDefault()
    if (!text.trim()) return
    addTask({ text, priority, category, recurrence, completionAnimation: animation, targetCount: count })
    onClose()
  }

  return (
    <Modal title="New Task" onClose={onClose}>
      <form className={styles.form} onSubmit={submit}>

        <div className={styles.inputRow}>
          <input
            className={styles.input}
            type="text"
            placeholder="What must be done..."
            value={text}
            onChange={e => setText(e.target.value)}
            maxLength={120}
            autoFocus
          />
          <button
            type="submit"
            className={styles.plusBtn}
            disabled={!text.trim()}
          >+</button>
        </div>

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

        <div className={styles.row}>
          <span className={styles.rowLabel}>Times to complete</span>
          <div className={styles.stepper}>
            <button
              type="button"
              className={styles.stepBtn}
              onClick={() => setCount(c => Math.max(1, c - 1))}
              disabled={count <= 1}
            >−</button>
            <span className={styles.stepCount}>{count}</span>
            <button
              type="button"
              className={styles.stepBtn}
              onClick={() => setCount(c => Math.min(25, c + 1))}
              disabled={count >= 25}
            >+</button>
            {count > 1 && (
              <span className={styles.stepHint}>
                tap {count}× to complete
              </span>
            )}
          </div>
        </div>

        <div className={styles.row}>
          <span className={styles.rowLabel}>On complete</span>

          {/* Live preview */}
          <div className={styles.preview}>
            <div
              key={previewKey}
              className={styles.previewTask}
              style={previewAnim ? { animation: ANIM_STYLE[previewAnim], pointerEvents: 'none' } : {}}
            >
              <span className={styles.previewCheck}>✓</span>
              <span className={styles.previewText}>Brew a healing potion</span>
            </div>
            <button
              type="button"
              className={styles.previewBtn}
              onClick={() => selectAnim(animation)}
            >
              ▶ Preview
            </button>
          </div>

          <div className={styles.animGrid}>
            {ANIMATIONS.map(a => (
              <button
                key={a.value}
                type="button"
                className={`${styles.animOption} ${animation === a.value ? styles.animActive : ''}`}
                onClick={() => selectAnim(a.value)}
              >
                <span className={styles.animLabel}>{a.label}</span>
                <span className={styles.animDesc}>{a.desc}</span>
              </button>
            ))}
          </div>
        </div>

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
