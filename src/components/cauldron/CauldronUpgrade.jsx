import { useStore } from '../../store/index.js'
import { CAULDRON_UPGRADES } from '../../constants/shop.js'
import { INGOT_MAP } from '../../constants/ores.js'
import Button from '../ui/Button.jsx'
import { showToast } from '../ui/ToastNotification.jsx'
import styles from './CauldronUpgrade.module.css'

const TIER_NAMES = ['', 'Clay Cauldron', 'Copper Cauldron', 'Obsidian Cauldron', 'Starforged Cauldron']

export default function CauldronUpgrade() {
  const { cauldronTier, level, startForge, smithing, cauldronSkipAvailable, cauldronSkipUsed, useCauldronSkip } = useStore()
  const nextUpgrade = CAULDRON_UPGRADES.find(u => u.tier === cauldronTier + 1)
  const isForging = smithing?.some(s => CAULDRON_UPGRADES.some(u => u.id === s.itemId))

  const handleForge = () => {
    if (!nextUpgrade) return
    const result = startForge(nextUpgrade.id)
    if (result.error) showToast(result.error, 'error')
    else showToast('Forging in progress...', 'success')
  }

  const handleSkip = () => {
    const ok = useCauldronSkip()
    if (ok) showToast('Cauldron upgraded!', 'success')
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.current}>
        <div className={styles.cauldronEmoji}>🫧</div>
        <div>
          <div className={styles.tierName}>{TIER_NAMES[cauldronTier]}</div>
          <div className={styles.tierLabel}>Tier {cauldronTier} · {cauldronTier === 1 ? '1' : cauldronTier}-ingredient potions</div>
        </div>
      </div>

      {nextUpgrade && (
        <div className={styles.upgrade}>
          <div className={styles.upgradeTitle}>Upgrade: {nextUpgrade.name}</div>
          <div className={styles.upgradeReqs}>
            {Object.entries(nextUpgrade.recipe).map(([id, qty]) => {
              const ingot = INGOT_MAP[id]
              return <span key={id} className={styles.req}>{ingot?.name ?? id} ×{qty}</span>
            })}
            <span className={styles.req}>✦ {nextUpgrade.goldCost}g</span>
          </div>
          <div className={styles.upgradeActions}>
            {isForging ? (
              <span className={styles.forgingLabel}>Forging in progress...</span>
            ) : (
              <Button variant="ember" onClick={handleForge} disabled={level < nextUpgrade.unlockLevel}>
                Forge (Lv.{nextUpgrade.unlockLevel})
              </Button>
            )}
            {cauldronSkipAvailable && !cauldronSkipUsed && (
              <Button variant="purple" onClick={handleSkip}>
                Skip (Founder)
              </Button>
            )}
          </div>
        </div>
      )}

      {cauldronTier >= 4 && (
        <p className={styles.maxed}>The Starforged Cauldron. Nothing beyond this.</p>
      )}
    </div>
  )
}
