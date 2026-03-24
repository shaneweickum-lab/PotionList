import { useState, useEffect, useRef } from 'react'
import { useStore } from '../../store/index.js'
import { SEED_MAP, ALL_SEEDS } from '../../constants/seeds.js'
import { HERB_MAP } from '../../constants/herbs.js'
import { MUSHROOM_MAP } from '../../constants/mushrooms.js'
import Modal from '../ui/Modal.jsx'
import ProgressBar from '../ui/ProgressBar.jsx'
import Button from '../ui/Button.jsx'
import { showToast } from '../ui/ToastNotification.jsx'
import styles from './PlotSlot.module.css'

const BAR_COLOR = { common: 'green', uncommon: 'green', rare: 'blue', epic: 'purple' }

function PlantVisual({ progress, isReady, type, color }) {
  const fontSize = 20 + progress * 16   // 20px seedling → 36px full grown
  const emoji    = type === 'mushroom' ? '🍄' : '🌿'
  const swaying  = !isReady && progress > 0.08

  return (
    <div className={styles.plantWrap}>
      <div className={styles.soilBase} />
      <div
        className={`${styles.plantIcon} ${isReady ? styles.plantFloat : swaying ? styles.sway : ''}`}
        style={{ fontSize, color }}
      >
        {emoji}
      </div>
      {isReady && (
        <div className={styles.sparkles}>
          <span className={`${styles.sp} ${styles.sp1}`}>✦</span>
          <span className={`${styles.sp} ${styles.sp2}`}>✦</span>
          <span className={`${styles.sp} ${styles.sp3}`}>✧</span>
          <span className={`${styles.sp} ${styles.sp4}`}>✦</span>
        </div>
      )}
    </div>
  )
}

export default function PlotSlot({ slot }) {
  const [showPlantModal, setShowPlantModal] = useState(false)
  const [, setTick] = useState(0)
  const { seeds, plantSeed, harvestPlot, isSlotReady, getGrowthProgress } = useStore()

  const isReady  = isSlotReady(slot.slotId)
  const progress = getGrowthProgress(slot.slotId)
  const seedDef  = slot.seedId ? SEED_MAP[slot.seedId] : null
  const itemDef  = seedDef ? (HERB_MAP[seedDef.yields] ?? MUSHROOM_MAP[seedDef.yields]) : null
  const rarity   = seedDef?.rarity ?? 'common'

  // Re-render every 5s so the time-based progress bar animates live
  useEffect(() => {
    if (!slot.seedId || isReady) return
    const id = setInterval(() => setTick(t => t + 1), 5000)
    return () => clearInterval(id)
  }, [slot.seedId, isReady])

  // Toast when a plant transitions from growing → ready
  const prevReadyRef = useRef(isReady)
  useEffect(() => {
    if (isReady && !prevReadyRef.current && slot.seedId) {
      const item = HERB_MAP[seedDef?.yields] ?? MUSHROOM_MAP[seedDef?.yields]
      showToast(`${item?.name ?? slot.seedId} is ready to harvest!`, 'success')
    }
    prevReadyRef.current = isReady
  }, [isReady])

  const availableSeeds = Object.entries(seeds ?? {}).filter(([_, qty]) => qty > 0)

  const handleHarvest = () => {
    const result = harvestPlot(slot.slotId)
    if (result) {
      const item = HERB_MAP[result.yieldId] ?? MUSHROOM_MAP[result.yieldId]
      let msg = `Harvested ${item?.name ?? result.yieldId}!`
      if (result.bugFound) msg += ` Found a bug!`
      showToast(msg, 'success')
    }
  }

  const handlePlant = (seedId) => {
    plantSeed(slot.slotId, seedId)
    setShowPlantModal(false)
  }

  // Empty slot
  if (!slot.seedId) {
    return (
      <>
        <div className={`${styles.slot} ${styles.empty}`} onClick={() => setShowPlantModal(true)}>
          <span className={styles.emptyIcon}>⊕</span>
          <span className={styles.emptyLabel}>Plant Seed</span>
        </div>
        {showPlantModal && (
          <Modal title="Choose a Seed" onClose={() => setShowPlantModal(false)}>
            {availableSeeds.length === 0 ? (
              <p className="lore">No seeds in your stash. Complete tasks or visit the village.</p>
            ) : (
              <div className={styles.seedList}>
                {availableSeeds.map(([seedId, qty]) => {
                  const sd   = SEED_MAP[seedId]
                  const item = sd ? (HERB_MAP[sd.yields] ?? MUSHROOM_MAP[sd.yields]) : null
                  return (
                    <button key={seedId} className={styles.seedOption} onClick={() => handlePlant(seedId)}>
                      <span className={`rarity-${item?.rarity ?? 'common'}`} style={{ fontSize: 22 }}>🌱</span>
                      <div className={styles.seedInfo}>
                        <span className={styles.seedName}>{sd?.name ?? seedId}</span>
                        <span className={styles.seedQty}>×{qty} available</span>
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </Modal>
        )}
      </>
    )
  }

  // Growing or ready
  return (
    <div
      className={`${styles.slot} ${isReady ? styles.ready : styles.growing}`}
      onClick={isReady ? handleHarvest : undefined}
    >
      <PlantVisual
        progress={isReady ? 1 : progress}
        isReady={isReady}
        type={seedDef?.type}
        color={itemDef?.color ?? '#5a9e6f'}
      />
      <span className={`${styles.plantName} rarity-${rarity}`}>{itemDef?.name ?? slot.seedId}</span>
      {isReady ? (
        <span className={styles.readyLabel}>✦ Harvest</span>
      ) : (
        <ProgressBar value={progress} color={BAR_COLOR[rarity] ?? 'green'} height={4} showPercent />
      )}
    </div>
  )
}
