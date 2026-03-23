import { useStore } from '../../store/index.js'
import { POTION_MAP } from '../../constants/potions.js'
import Timer from '../ui/Timer.jsx'
import ProgressBar from '../ui/ProgressBar.jsx'
import styles from './BrewQueue.module.css'

export default function BrewQueue() {
  const { brewing } = useStore()
  const active = brewing.filter(b => b.finishAt > Date.now())

  if (active.length === 0) return (
    <div className={styles.empty}>
      <p className="lore">The cauldron sits quiet. Choose a recipe to begin.</p>
    </div>
  )

  return (
    <div className={styles.queue}>
      {active.map(brew => {
        const potion = POTION_MAP[brew.potionId]
        const elapsed = Date.now() - brew.startedAt
        const progress = Math.min(1, elapsed / brew.totalTime)

        return (
          <div key={brew.id} className={styles.brewItem}>
            <div className={styles.potionDot} style={{ background: potion?.color ?? '#888' }} />
            <div className={styles.info}>
              <div className={styles.topRow}>
                <span className={styles.name}>{potion?.name ?? brew.potionId}</span>
                {brew.qty > 1 && <span className={styles.qty}>×{brew.qty}</span>}
              </div>
              <ProgressBar value={progress} color="purple" height={4} />
            </div>
            <Timer finishAt={brew.finishAt} compact />
          </div>
        )
      })}
    </div>
  )
}
