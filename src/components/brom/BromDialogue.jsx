import { useState } from 'react'
import Modal from '../ui/Modal.jsx'
import Button from '../ui/Button.jsx'
import { BROM_HIRE_DIALOGUE } from '../../constants/ores.js'
import styles from './BromDialogue.module.css'

export default function BromDialogue({ onConfirm, onClose }) {
  const [lineIndex, setLineIndex] = useState(0)

  const advance = () => {
    if (lineIndex < BROM_HIRE_DIALOGUE.length - 1) {
      setLineIndex(i => i + 1)
    } else {
      onConfirm()
    }
  }

  return (
    <Modal onClose={onClose}>
      <div className={styles.dialogue}>
        <div className={styles.portrait}>
          <div className={styles.portraitCircle}>⛏️</div>
          <div className={styles.portraitName}>Brom Ashvein</div>
          <div className={styles.portraitTitle}>Miner for Hire</div>
        </div>
        <div className={styles.textBox}>
          <p className={styles.line}>{BROM_HIRE_DIALOGUE[lineIndex]}</p>
        </div>
        <div className={styles.progress}>
          {BROM_HIRE_DIALOGUE.map((_, i) => (
            <div key={i} className={`${styles.dot} ${i <= lineIndex ? styles.dotActive : ''}`} />
          ))}
        </div>
      </div>
      <div className={styles.stickyFooter}>
        <Button variant="gold" fullWidth onClick={advance}>
          {lineIndex < BROM_HIRE_DIALOGUE.length - 1 ? 'Continue' : 'Hire Brom — 150g'}
        </Button>
      </div>
    </Modal>
  )
}
