import { useState } from 'react'
import { useStore } from '../../store/index.js'
import Modal from '../ui/Modal.jsx'
import styles from './AddQuestModal.module.css'

export default function AddQuestModal({ onClose }) {
  const addQuest = useStore(s => s.addQuest)
  const [title, setTitle] = useState('')
  const [steps, setSteps] = useState(['', ''])

  const updateStep = (i, val) => setSteps(s => s.map((v, idx) => idx === i ? val : v))
  const addStep = () => { if (steps.length < 20) setSteps(s => [...s, '']) }
  const removeStep = (i) => { if (steps.length > 2) setSteps(s => s.filter((_, idx) => idx !== i)) }

  const validSteps = steps.filter(s => s.trim())
  const canSubmit = title.trim() && validSteps.length >= 2

  const submit = (e) => {
    e.preventDefault()
    if (!canSubmit) return
    addQuest({ title, steps: validSteps })
    onClose()
  }

  return (
    <Modal title="New Quest" onClose={onClose}>
      <form className={styles.form} onSubmit={submit}>
        <input
          className={styles.titleInput}
          type="text"
          placeholder="Quest title..."
          value={title}
          onChange={e => setTitle(e.target.value)}
          maxLength={60}
        />

        <div className={styles.stepsHeader}>
          <span className={styles.stepsLabel}>Steps</span>
          <span className={styles.stepsHint}>min 2, max 20</span>
        </div>

        <div className={styles.stepsList}>
          {steps.map((step, i) => (
            <div key={i} className={styles.stepRow}>
              <span className={styles.stepNum}>{i + 1}</span>
              <input
                className={styles.stepInput}
                type="text"
                placeholder={`Step ${i + 1}...`}
                value={step}
                onChange={e => updateStep(i, e.target.value)}
                maxLength={80}
              />
              {steps.length > 2 && (
                <button type="button" className={styles.removeStep} onClick={() => removeStep(i)}>✕</button>
              )}
            </div>
          ))}
        </div>

        {steps.length < 20 && (
          <button type="button" className={styles.addStepBtn} onClick={addStep}>
            + Add Step
          </button>
        )}

        <div className={styles.stickyFooter}>
          <button type="submit" className={styles.submit} disabled={!canSubmit}>
            Begin Quest
          </button>
        </div>
      </form>
    </Modal>
  )
}
