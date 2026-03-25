import { useState } from 'react'
import { useStore } from '../../store/index.js'
import { showToast } from '../ui/ToastNotification.jsx'
import BugBreedModal from './BugBreedModal.jsx'
import { BREED_DEFS, BREED_TASKS_REQUIRED, FARMABLE_BUG_IDS, getIngredientDef } from '../../constants/bugFarm.js'
import { BUG_MAP } from '../../constants/bugs.js'
import styles from './BugFarmTab.module.css'

const RARITY_COLOR = { common: 'var(--text-dim)', uncommon: '#b0c0d4', rare: 'var(--gold)', epic: 'var(--purple)' }
const GENDER_LABEL = { m: '♂', f: '♀' }

export default function BugFarmTab() {
  const { bugFarm, activeBreed, inventory, level, addBugToFarm, hatchBreed, cancelBreed } = useStore()
  const [showBreedModal, setShowBreedModal] = useState(false)

  const handleAddToFarm = (bugId) => {
    const gender = addBugToFarm(bugId)
    if (!gender) return showToast('None in inventory', 'error')
    const bugDef = BUG_MAP[bugId]
    showToast(`${GENDER_LABEL[gender]} ${bugDef?.name ?? bugId} added to farm`, 'success')
  }

  const handleHatch = () => {
    const result = hatchBreed()
    if (!result) return
    const bugDef = BUG_MAP[result.bugId]
    showToast(`${GENDER_LABEL[result.gender]} ${bugDef?.name ?? result.bugId} hatched! +XP`, 'epic')
  }

  const handleCancel = () => {
    cancelBreed()
    showToast('Breed cancelled. Resources were used.', 'error')
  }

  const breed = activeBreed
  const breedBugDef = breed ? BUG_MAP[breed.bugId] : null
  const breedDef = breed ? BREED_DEFS[breed.bugId] : null
  const progress = breed?.progress ?? 0
  const isReady = breed?.status === 'ready'

  // Check if any bug is eligible to start a breed
  const canStartAny = !breed && FARMABLE_BUG_IDS.some(bugId => {
    const def = BREED_DEFS[bugId]
    const farm = bugFarm[bugId] ?? { m: 0, f: 0 }
    return farm.m >= 1 && farm.f >= 1 && (level ?? 1) >= def.levelReq
  })

  return (
    <div className={styles.farm}>

      {/* ── Active breed ── */}
      {breed ? (
        <div className={`${styles.breedPanel} ${isReady ? styles.breedReady : ''}`}>
          <div className={styles.breedHeader}>
            <span className={styles.breedDot} style={{ background: breedBugDef?.color }} />
            <span className={styles.breedTitle}>
              Breeding <span style={{ color: RARITY_COLOR[breedDef?.rarity ?? 'common'] }}>{breedBugDef?.name}</span>
            </span>
          </div>
          <div className={styles.breedTask}>
            Task: <em>"{breed.taskText}"</em>
          </div>
          <div className={styles.progressRow}>
            <div className={styles.progressTrack}>
              {Array.from({ length: BREED_TASKS_REQUIRED }, (_, i) => (
                <div key={i} className={`${styles.progressPip} ${i < progress ? styles.progressPipFilled : ''}`} />
              ))}
            </div>
            <span className={styles.progressLabel}>{progress}/{BREED_TASKS_REQUIRED}</span>
          </div>
          <div className={styles.breedActions}>
            <button className={styles.cancelBtn} onClick={handleCancel}>Cancel</button>
            {isReady && (
              <button className={styles.hatchBtn} onClick={handleHatch}>
                Hatch Egg ✦
              </button>
            )}
          </div>
          {!isReady && (
            <p className={styles.breedHint}>Complete <em>{breed.taskText}</em> {BREED_TASKS_REQUIRED - progress} more time{BREED_TASKS_REQUIRED - progress !== 1 ? 's' : ''}.</p>
          )}
        </div>
      ) : (
        <button
          className={`${styles.startBtn} ${!canStartAny ? styles.startBtnDisabled : ''}`}
          onClick={() => canStartAny && setShowBreedModal(true)}
          disabled={!canStartAny}
        >
          + Start Breeding
          {!canStartAny && <span className={styles.startBtnHint}> — need ♂ &amp; ♀ pair in farm</span>}
        </button>
      )}

      {/* ── Bug roster ── */}
      <div className={styles.roster}>
        <div className={styles.rosterLabel}>Farm Population</div>
        {FARMABLE_BUG_IDS.map(bugId => {
          const def = BREED_DEFS[bugId]
          const bugDef = BUG_MAP[bugId]
          const farm = bugFarm[bugId] ?? { m: 0, f: 0 }
          const inBag = inventory[bugId] ?? 0
          const levelLocked = (level ?? 1) < def.levelReq
          const ingDef = getIngredientDef(bugId)

          return (
            <div key={bugId} className={`${styles.bugRow} ${levelLocked ? styles.bugRowLocked : ''}`}>
              <div className={styles.bugInfo}>
                <span className={styles.bugDot} style={{ background: bugDef?.color }} />
                <div className={styles.bugDetails}>
                  <span className={styles.bugName} style={{ color: RARITY_COLOR[def.rarity] }}>
                    {bugDef?.name}
                  </span>
                  <div className={styles.bugMeta}>
                    {levelLocked
                      ? <span className={styles.levelGate}>Unlocks at level {def.levelReq}</span>
                      : <>
                          <span className={styles.genderCount}>♂ {farm.m}</span>
                          <span className={styles.genderCount}>♀ {farm.f}</span>
                          {ingDef && <span className={styles.ingNote} style={{ color: ingDef.color }}>· {ingDef.name}</span>}
                        </>
                    }
                  </div>
                </div>
              </div>
              {!levelLocked && (
                <button
                  className={styles.addBtn}
                  onClick={() => handleAddToFarm(bugId)}
                  disabled={inBag < 1}
                  title={inBag < 1 ? 'None in inventory' : `Add one to farm (${inBag} in bag)`}
                >
                  {inBag > 0 ? `+ Add (${inBag})` : '+ Add'}
                </button>
              )}
            </div>
          )
        })}
      </div>

      <p className={styles.explainer}>
        Harvest bugs from the garden, add them to the farm, then breed pairs to produce new specimens.
        Breeding requires a matching herb or mushroom plus Bug Feed from the shop.
      </p>

      {showBreedModal && <BugBreedModal onClose={() => setShowBreedModal(false)} />}
    </div>
  )
}
