import Modal from '../ui/Modal.jsx'
import Button from '../ui/Button.jsx'
import { useStore } from '../../store/index.js'
import styles from './StreakModal.module.css'

export default function StreakModal({ gift, milestone, onClose }) {
  const { streak } = useStore()

  if (milestone) {
    return (
      <Modal onClose={onClose}>
        <div className={styles.content}>
          <div className={styles.icon}>🏆</div>
          <div className={styles.day}>{milestone.day} Day Milestone</div>
          <div className={styles.title}>{milestone.title}</div>
          <p className="lore">{milestone.reward.lore}</p>
          <div className={styles.rewards}>
            {milestone.reward.gold && <div className={styles.reward}>✦ {milestone.reward.gold}g</div>}
            {milestone.reward.seeds?.map(s => <div key={s} className={styles.reward}>🌱 {s}</div>)}
            {milestone.reward.ores?.map(o => <div key={o} className={styles.reward}>⛏️ {o}</div>)}
          </div>
          <Button variant="gold" fullWidth onClick={onClose}>Claim</Button>
        </div>
      </Modal>
    )
  }

  if (gift) {
    return (
      <Modal onClose={onClose}>
        <div className={styles.content}>
          <div className={styles.icon}>🔥</div>
          <div className={styles.day}>Day {gift.day} Streak!</div>
          <p className="lore">{gift.lore}</p>
          <div className={styles.rewards}>
            {gift.type === 'gold' && <div className={styles.reward}>✦ {gift.amount}g</div>}
            {gift.ids?.map(id => <div key={id} className={styles.reward}>🌱 {id.replace(/_/g, ' ')}</div>)}
            {gift.gold && <div className={styles.reward}>✦ {gift.gold}g</div>}
          </div>
          <Button variant="ember" fullWidth onClick={onClose}>Receive</Button>
        </div>
      </Modal>
    )
  }

  return null
}
