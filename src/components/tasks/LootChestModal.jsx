import { CHEST_TIERS } from '../../lib/chestLoot.js'
import { SEED_MAP } from '../../constants/seeds.js'
import Modal from '../ui/Modal.jsx'
import styles from './LootChestModal.module.css'

const ORE_LABELS = {
  copper_ore: 'Copper Ore', iron_ore: 'Iron Ore', silver_ore: 'Silver Ore',
  gold_ore: 'Gold Ore', mithril_ore: 'Mithril Ore', moonstone: 'Moonstone',
}

export default function LootChestModal({ loot, questTitle, onClose }) {
  const tier = CHEST_TIERS[loot.tier]
  const seed = loot.seed ? SEED_MAP[loot.seed] : null

  return (
    <Modal title="Quest Complete!" onClose={onClose}>
      <div className={styles.chest}>
        <div className={styles.iconWrap}>
          <span className={styles.icon}>{tier.icon}</span>
          <div className={styles.glow} style={{ background: `radial-gradient(circle, ${tier.color}40 0%, transparent 70%)` }} />
        </div>
        <div className={styles.tierName} style={{ color: tier.textColor }}>{tier.name}</div>
        <div className={styles.questName}>"{questTitle}"</div>

        <div className={styles.divider} />

        <div className={styles.lootList}>
          <div className={styles.lootRow}>
            <span className={styles.lootIcon} style={{ color: '#f0c842' }}>✦</span>
            <span className={styles.lootText}>{loot.gold} Gold</span>
          </div>
          {seed && (
            <div className={styles.lootRow}>
              <span className={styles.lootIcon}>🌱</span>
              <span className={styles.lootText}>{seed.name}</span>
            </div>
          )}
          {loot.ore && (
            <div className={styles.lootRow}>
              <span className={styles.lootIcon}>⛏️</span>
              <span className={styles.lootText}>{ORE_LABELS[loot.ore] ?? loot.ore}</span>
            </div>
          )}
        </div>

        <button className={styles.claimBtn} style={{ background: tier.color }} onClick={onClose}>
          Claim Loot
        </button>
      </div>
    </Modal>
  )
}
