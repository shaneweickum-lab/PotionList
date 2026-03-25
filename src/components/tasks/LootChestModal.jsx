import { CHEST_TIERS } from '../../lib/chestLoot.js'
import { SEED_MAP } from '../../constants/seeds.js'
import { ORE_MAP } from '../../constants/ores.js'
import styles from './LootChestModal.module.css'

export default function LootChestModal({ loot, questTitle, onClaim }) {
  const tier = CHEST_TIERS[loot.tier]
  const seed = loot.seed ? SEED_MAP[loot.seed] : null
  const ore  = loot.ore  ? ORE_MAP[loot.ore]   : null

  return (
    <div className={styles.overlay}>
      <div className={styles.panel}>
        <div className={styles.iconWrap}>
          <span className={styles.icon}>{tier.icon}</span>
          <div className={styles.glow} style={{ background: `radial-gradient(circle, ${tier.color}50 0%, transparent 70%)` }} />
        </div>

        <div className={styles.tierName} style={{ color: tier.textColor }}>{tier.name}</div>
        <div className={styles.questName}>"{questTitle}"</div>

        <div className={styles.divider} />

        <p className={styles.addingLabel}>Adding to your inventory:</p>

        <div className={styles.lootList}>
          <div className={styles.lootRow}>
            <span className={styles.lootIcon} style={{ color: '#FFD060' }}>✦</span>
            <span className={styles.lootText}>{loot.gold} Gold</span>
          </div>
          {seed && (
            <div className={styles.lootRow}>
              <span className={styles.lootIcon}>🌱</span>
              <span className={styles.lootText}>{seed.name}</span>
              <span className={`${styles.lootRarity} rarity-${seed.rarity}`}>{seed.rarity}</span>
            </div>
          )}
          {ore && (
            <div className={styles.lootRow}>
              <span className={styles.lootDot} style={{ background: ore.color }} />
              <span className={styles.lootText}>{ore.name}</span>
            </div>
          )}
        </div>

        <button
          className={styles.claimBtn}
          style={{ background: `linear-gradient(135deg, ${tier.color}, ${tier.textColor})` }}
          onClick={onClaim}
        >
          Confirm &amp; Claim
        </button>
      </div>
    </div>
  )
}
