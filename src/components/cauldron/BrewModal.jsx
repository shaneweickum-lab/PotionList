import { useState } from 'react'
import Modal from '../ui/Modal.jsx'
import Button from '../ui/Button.jsx'
import { useStore } from '../../store/index.js'
import { HERB_MAP } from '../../constants/herbs.js'
import { MUSHROOM_MAP } from '../../constants/mushrooms.js'
import { BUG_MAP } from '../../constants/bugs.js'
import { showToast } from '../ui/ToastNotification.jsx'
import styles from './BrewModal.module.css'

function getItem(id) {
  return HERB_MAP[id] ?? MUSHROOM_MAP[id] ?? BUG_MAP[id]
}

function formatTime(s) {
  if (s < 60) return `${s}s`
  if (s < 3600) return `${Math.floor(s / 60)}m`
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60)
  return m > 0 ? `${h}h ${m}m` : `${h}h`
}

export default function BrewModal({ potion, onClose }) {
  const [qty, setQty] = useState(1)
  const { startBrew, inventory, owned } = useStore()
  const alembicOwned = (owned ?? []).includes('silver_alembic')
  const inv = inventory ?? {}

  const maxQty = Math.min(
    10,
    ...Object.entries(potion.ingredients).map(([id, needed]) => Math.floor((inv[id] ?? 0) / needed))
  )

  const handleBrew = () => {
    const result = startBrew(potion.id, qty)
    if (result.error) {
      showToast(result.error, 'error')
    } else {
      const yield_ = alembicOwned ? qty * 2 : qty
      showToast(`Brewing ${yield_}× ${potion.name}...`, 'success')
      onClose()
    }
  }

  return (
    <Modal title={potion.name} onClose={onClose}>
      <div className={styles.content}>
        <div className={styles.potionHeader}>
          <div className={styles.potionDot} style={{ background: potion.color }} />
          <p className="lore">{potion.lore}</p>
        </div>

        <div className={styles.section}>
          <span className={styles.sectionLabel}>Ingredients</span>
          {Object.entries(potion.ingredients).map(([id, needed]) => {
            const item = getItem(id)
            const have = inv[id] ?? 0
            return (
              <div key={id} className={styles.ing}>
                <span className={styles.ingName}>{item?.name ?? id}</span>
                <span className={have >= needed * qty ? styles.ingHave : styles.ingMissing}>
                  {have} / {needed * qty}
                </span>
              </div>
            )
          })}
        </div>

        <div className={styles.section}>
          <span className={styles.sectionLabel}>Quantity</span>
          <div className={styles.qtyRow}>
            <button className={styles.qtyBtn} onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
            <span className={styles.qtyNum}>{qty}</span>
            <button className={styles.qtyBtn} onClick={() => setQty(q => Math.min(maxQty, q + 1))} disabled={qty >= maxQty}>+</button>
          </div>
          {alembicOwned && <span className={styles.alembicNote}>Alembic doubles yield → {qty * 2} potions</span>}
        </div>

        <div className={styles.meta}>
          <span>⏱ {formatTime(potion.brewTime)}</span>
          <span>+{potion.xpReward * qty} XP</span>
        </div>

        <Button variant="purple" fullWidth onClick={handleBrew} disabled={maxQty < 1}>
          Start Brewing
        </Button>
      </div>
    </Modal>
  )
}
