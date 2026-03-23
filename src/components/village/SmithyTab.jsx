import { useStore } from '../../store/index.js'
import { INGOTS, INGOT_MAP, ORE_MAP } from '../../constants/ores.js'
import { CAULDRON_UPGRADES, ALEMBIC } from '../../constants/shop.js'
import Timer from '../ui/Timer.jsx'
import Button from '../ui/Button.jsx'
import ProgressBar from '../ui/ProgressBar.jsx'
import { showToast } from '../ui/ToastNotification.jsx'
import styles from './SmithyTab.module.css'

function formatTime(s) {
  if (s < 60) return `${s}s`
  if (s < 3600) return `${Math.floor(s / 60)}m`
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  return m > 0 ? `${h}h ${m}m` : `${h}h`
}

export default function SmithyTab() {
  const { oreInventory, ingotInventory, smithing, startSmelt, startForge, level, owned } = useStore()
  const activeSmelt = smithing?.filter(s => s.type === 'smelt') ?? []
  const activeForge = smithing?.filter(s => s.type === 'forge') ?? []

  const handleSmelt = (ingot) => {
    const result = startSmelt(ingot.id, 1)
    if (result.error) showToast(result.error, 'error')
    else showToast(`Smelting ${ingot.name}...`, 'success')
  }

  const handleForge = (upgrade) => {
    const result = startForge(upgrade.id)
    if (result.error) showToast(result.error, 'error')
    else showToast(`Forging ${upgrade.name}...`, 'success')
  }

  return (
    <div className={styles.smithy}>
      {/* Active smelts */}
      {activeSmelt.length > 0 && (
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Smelting</div>
          {activeSmelt.map(s => {
            const ingot = INGOT_MAP[s.itemId]
            const elapsed = Date.now() - s.startedAt
            return (
              <div key={s.id} className={styles.activeItem}>
                <span className={styles.itemName}>{ingot?.name ?? s.itemId}</span>
                <ProgressBar value={Math.min(1, elapsed / s.totalTime)} color="ember" height={4} />
                <Timer finishAt={s.finishAt} compact />
              </div>
            )
          })}
        </div>
      )}

      {/* Smelt recipes */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}>Smelt Ore</div>
        {INGOTS.map(ingot => {
          const oreCount = oreInventory?.[ingot.fromOre] ?? 0
          const canSmelt = oreCount >= ingot.ratio
          return (
            <div key={ingot.id} className={styles.smeltRow}>
              <div className={styles.smeltInfo}>
                <span className={styles.ingotName} style={{ color: ingot.color }}>{ingot.name}</span>
                <span className={styles.smeltRecipe}>
                  {ORE_MAP[ingot.fromOre]?.name} ×{ingot.ratio} → 1 ingot · {formatTime(ingot.smeltTime)}
                </span>
                <span className={styles.smeltHave}>Have: {oreCount} ore, {ingotInventory?.[ingot.id] ?? 0} ingots</span>
              </div>
              <Button variant="ember" size="sm" disabled={!canSmelt} onClick={() => handleSmelt(ingot)}>
                Smelt
              </Button>
            </div>
          )
        })}
      </div>

      {/* Forge upgrades */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}>Forge</div>
        {[...CAULDRON_UPGRADES, ALEMBIC].map(upgrade => {
          const alreadyForged = owned?.includes(upgrade.id)
          const isForging = activeForge.some(s => s.itemId === upgrade.id)
          const reqMet = level >= upgrade.unlockLevel
          return (
            <div key={upgrade.id} className={`${styles.forgeRow} ${alreadyForged ? styles.forged : ''}`}>
              <div className={styles.forgeInfo}>
                <span className={styles.forgeName}>{upgrade.name}</span>
                <span className={styles.forgeDesc}>{upgrade.description}</span>
                <span className={styles.forgeReq}>
                  {Object.entries(upgrade.recipe).map(([id, qty]) => `${id} ×${qty}`).join(' + ')} + {upgrade.goldCost}g · Lv.{upgrade.unlockLevel}
                </span>
              </div>
              {alreadyForged ? (
                <span className={styles.forgedLabel}>Forged</span>
              ) : isForging ? (
                <span className={styles.forgingLabel}>Forging...</span>
              ) : (
                <Button variant="ghost" size="sm" disabled={!reqMet} onClick={() => handleForge(upgrade)}>
                  Forge
                </Button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
