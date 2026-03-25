import { useState } from 'react'
import { useStore } from '../../store/index.js'
import { MINE_TIERS, BROM_BARKS, ORE_MAP } from '../../constants/ores.js'
import BromDialogue from '../brom/BromDialogue.jsx'
import Timer from '../ui/Timer.jsx'
import Button from '../ui/Button.jsx'
import ProgressBar from '../ui/ProgressBar.jsx'
import { showToast } from '../ui/ToastNotification.jsx'
import styles from './MineTab.module.css'

export default function MineTab() {
  const [showHireModal, setShowHireModal] = useState(false)
  const [showBark, setShowBark] = useState(null)
  const { bromUnlocked, hireBrom, mineTrips, startMineTrip, collectMineTrip, getMaxTripSlots, level, oreInventory } = useStore()

  const activeTrips = mineTrips.filter(t => !t.completed)
  const completedTrips = mineTrips.filter(t => t.completed)
  const maxSlots = getMaxTripSlots()
  const availableSlots = maxSlots - activeTrips.length

  const handleHire = () => {
    const result = hireBrom()
    if (result.error) showToast(result.error, 'error')
    else { setShowHireModal(false); showToast('Brom is ready for work.', 'success') }
  }

  const handleSend = (tier) => {
    const result = startMineTrip(tier)
    if (result.error) showToast(result.error, 'error')
    else showToast(`Brom heads to the ${MINE_TIERS.find(t => t.level === tier)?.name}...`, 'success')
  }

  const handleCollect = (trip) => {
    setShowBark({ trip, bark: BROM_BARKS[trip.tier - 1]?.[trip.barkIndex ?? 0] ?? '' })
    collectMineTrip(trip.id)
    const lootParts = Object.entries(trip.loot ?? {})
      .filter(([, qty]) => qty > 0)
      .map(([oreId, qty]) => `${ORE_MAP[oreId]?.name ?? oreId} ×${qty}`)
    if (lootParts.length > 0) showToast(`Collected: ${lootParts.join(', ')}`, 'success')
  }

  return (
    <div className={styles.mine}>
      {!bromUnlocked ? (
        <div className={styles.hireBrom}>
          <div className={styles.bromPortrait}>⛏️</div>
          <h3 className={styles.bromName}>Brom Ashvein</h3>
          <p className="lore">Knows every mine shaft in the region. Currently between employment.</p>
          <Button variant="gold" onClick={() => setShowHireModal(true)}>Hire Brom — 150g</Button>
        </div>
      ) : (
        <>
          {/* Active trips */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              Active Trips <span className={styles.slots}>{activeTrips.length}/{maxSlots}</span>
            </div>
            {activeTrips.map(trip => {
              const tier = MINE_TIERS.find(t => t.level === trip.mineLevel)
              const elapsed = Date.now() - trip.startedAt
              const progress = Math.min(1, elapsed / trip.totalTime)
              return (
                <div key={trip.id} className={styles.trip}>
                  <span className={styles.tripName}>{tier?.name ?? 'Mine'}</span>
                  <ProgressBar value={progress} color="ember" height={4} />
                  <Timer finishAt={trip.finishAt} compact />
                </div>
              )
            })}
            {availableSlots > 0 && (
              <div className={styles.tierSelect}>
                {MINE_TIERS.filter(t => t.unlockLevel <= level).map(t => (
                  <Button key={t.level} variant="ghost" size="sm" onClick={() => handleSend(t.level)}>
                    {t.name}
                  </Button>
                ))}
              </div>
            )}
          </div>

          {/* Completed trips */}
          {completedTrips.length > 0 && (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>Brom Has Returned</div>
              {completedTrips.map(trip => (
                <div key={trip.id} className={styles.completedTrip}>
                  <div className={styles.lootPreview}>
                    {Object.entries(trip.loot ?? {}).map(([oreId, qty]) => (
                      <span key={oreId} className={styles.lootItem}>
                        <span style={{ color: ORE_MAP[oreId]?.color ?? '#888' }}>●</span> {ORE_MAP[oreId]?.name ?? oreId} ×{qty}
                      </span>
                    ))}
                  </div>
                  <Button variant="gold" size="sm" onClick={() => handleCollect(trip)}>Collect</Button>
                </div>
              ))}
            </div>
          )}

          {/* Ore inventory */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>Ore Stash</div>
            <div className={styles.oreGrid}>
              {Object.entries(oreInventory ?? {}).filter(([_, q]) => q > 0).map(([id, qty]) => (
                <div key={id} className={styles.oreItem}>
                  <span className={styles.oreDot} style={{ background: ORE_MAP[id]?.color ?? '#888' }} />
                  <span className={styles.oreName}>{ORE_MAP[id]?.name ?? id}</span>
                  <span className={styles.oreQty}>×{qty}</span>
                </div>
              ))}
              {Object.values(oreInventory ?? {}).every(v => v === 0) && (
                <p className="lore" style={{ padding: '8px 0' }}>Nothing yet. Send Brom to the mines.</p>
              )}
            </div>
          </div>
        </>
      )}

      {showHireModal && (
        <BromDialogue onConfirm={handleHire} onClose={() => setShowHireModal(false)} />
      )}

      {showBark && (
        <div className={styles.barkOverlay} onClick={() => setShowBark(null)}>
          <div className={styles.barkBox} onClick={e => e.stopPropagation()}>
            <div className={styles.barkPortrait}>⛏️</div>
            <p className={styles.barkText}>"{showBark.bark}"</p>
            <p className={styles.barkDismiss}>— Brom Ashvein</p>
            <Button variant="ghost" fullWidth onClick={() => setShowBark(null)}>Dismiss</Button>
          </div>
        </div>
      )}
    </div>
  )
}
