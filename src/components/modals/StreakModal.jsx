import Modal from '../ui/Modal.jsx'
import Button from '../ui/Button.jsx'
import styles from './StreakModal.module.css'

function streakLore(day) {
  if (day <= 3)  return 'The first steps forge the path.'
  if (day <= 7)  return 'The rhythm is taking hold.'
  if (day <= 14) return 'The cauldron grows warmer every day.'
  if (day <= 21) return 'Three weeks of discipline. The valley watches.'
  if (day <= 30) return 'Nearly a month. The village has started to talk.'
  if (day <= 60) return 'The craft is becoming a part of you.'
  if (day <= 90) return 'Your name echoes in the old codex.'
  if (day <= 180) return 'The old ways remember those who persist.'
  return 'Beyond measure. The alchemists of old would be proud.'
}

export default function StreakModal({ gift, milestone, continued, onClose }) {
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
            {milestone.reward.seeds?.map(s => <div key={s} className={styles.reward}>🌱 {s.replace(/_/g, ' ')}</div>)}
            {milestone.reward.ores?.map(o => <div key={o} className={styles.reward}>⛏️ {o.replace(/_/g, ' ')}</div>)}
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

  if (continued) {
    return (
      <Modal onClose={onClose}>
        <div className={styles.content}>
          <div className={styles.flameWrap}>
            <span className={styles.flameBig}>🔥</span>
          </div>
          <div className={styles.streakNum}>{continued}</div>
          <div className={styles.streakLabel}>Day Streak</div>
          <p className="lore">{streakLore(continued)}</p>
          <Button variant="ember" fullWidth onClick={onClose}>Keep Going!</Button>
        </div>
      </Modal>
    )
  }

  return null
}
