import { useState } from 'react'
import { useStore } from '../../store/index.js'
import { POTIONS } from '../../constants/potions.js'
import { HERB_MAP } from '../../constants/herbs.js'
import { MUSHROOM_MAP } from '../../constants/mushrooms.js'
import { BUG_MAP } from '../../constants/bugs.js'
import BrewModal from './BrewModal.jsx'
import PotionShelf from './PotionShelf.jsx'
import styles from './RecipeBook.module.css'

function getItemName(id) {
  return HERB_MAP[id]?.name ?? MUSHROOM_MAP[id]?.name ?? BUG_MAP[id]?.name ?? id
}

function formatTime(seconds) {
  if (seconds < 60) return `${seconds}s`
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  return m > 0 ? `${h}h ${m}m` : `${h}h`
}

export default function RecipeBook() {
  const [selectedPotion, setSelectedPotion] = useState(null)
  const { cauldronTier, inventory, potionInventory } = useStore()

  return (
    <>
      <PotionShelf />
      <div className={styles.list}>
        {POTIONS.map(potion => {
          const locked = potion.cauldronTier > cauldronTier
          const inv = inventory ?? {}
          const canBrew = !locked && Object.entries(potion.ingredients).every(([id, qty]) => (inv[id] ?? 0) >= qty)
          const inInventory = potionInventory?.[potion.id] ?? 0

          return (
            <div
              key={potion.id}
              className={`${styles.recipe} ${locked ? styles.locked : ''} ${canBrew ? styles.canBrew : ''}`}
              onClick={() => !locked && setSelectedPotion(potion)}
            >
              <div className={styles.potionDot} style={{ background: potion.color }} />
              <div className={styles.info}>
                <div className={styles.topRow}>
                  <span className={styles.name}>{locked ? '???' : potion.name}</span>
                  {inInventory > 0 && <span className={styles.stock}>×{inInventory}</span>}
                </div>
                {!locked && (
                  <>
                    <div className={styles.ingredients}>
                      {Object.entries(potion.ingredients).map(([id, qty]) => (
                        <span
                          key={id}
                          className={`${styles.ing} ${(inv[id] ?? 0) >= qty ? styles.ingHave : styles.ingMissing}`}
                        >
                          {getItemName(id)} ×{qty}
                        </span>
                      ))}
                    </div>
                    <div className={styles.meta}>
                      <span className={styles.time}>⏱ {formatTime(potion.brewTime)}</span>
                      <span className={styles.xp}>+{potion.xpReward} XP</span>
                    </div>
                  </>
                )}
                {locked && (
                  <span className={styles.lockLabel}>Requires Tier {potion.cauldronTier} Cauldron</span>
                )}
              </div>
              {!locked && canBrew && <span className={styles.brewIcon}>🔥</span>}
            </div>
          )
        })}
      </div>
      {selectedPotion && (
        <BrewModal potion={selectedPotion} onClose={() => setSelectedPotion(null)} />
      )}
    </>
  )
}
