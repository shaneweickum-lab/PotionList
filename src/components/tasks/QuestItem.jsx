import { useState } from 'react'
import { useStore } from '../../store/index.js'
import LootChestModal from './LootChestModal.jsx'
import { CHEST_TIERS, getChestTier } from '../../lib/chestLoot.js'
import styles from './QuestItem.module.css'

export default function QuestItem({ quest }) {
  const { toggleQuestStep, openQuestChest, deleteQuest, level } = useStore()
  const [revealedLoot, setRevealedLoot] = useState(null)

  const doneCount = quest.steps.filter(s => s.done).length
  const allDone = doneCount === quest.steps.length
  const tier = CHEST_TIERS[getChestTier(level ?? 1)]

  const handleChest = () => {
    const loot = openQuestChest(quest.id)
    if (loot) setRevealedLoot(loot)
  }

  return (
    <div className={`${styles.quest} ${allDone && !quest.chestOpened ? styles.questReady : ''} ${quest.chestOpened ? styles.questDone : ''}`}>
      <div className={styles.header}>
        <span className={styles.title}>{quest.title}</span>
        <span className={styles.count}>{doneCount}/{quest.steps.length}</span>
      </div>

      <div className={styles.progressBar}>
        <div className={styles.progressFill} style={{ width: `${(doneCount / quest.steps.length) * 100}%` }} />
      </div>

      <div className={styles.steps}>
        {quest.steps.map(step => (
          <button
            key={step.id}
            className={`${styles.step} ${step.done ? styles.stepDone : ''}`}
            onClick={() => !quest.chestOpened && toggleQuestStep(quest.id, step.id)}
            disabled={quest.chestOpened}
          >
            <span className={`${styles.checkbox} ${step.done ? styles.checkboxDone : ''}`}>
              {step.done ? '✓' : ''}
            </span>
            <span className={styles.stepText}>{step.text}</span>
          </button>
        ))}
      </div>

      {allDone && !quest.chestOpened && (
        <button className={styles.chestBtn} onClick={handleChest}>
          <span className={styles.chestIcon}>{tier.icon}</span>
          <span>Open {tier.name}</span>
          <span className={styles.chestSpark}>✦</span>
        </button>
      )}

      {quest.chestOpened && quest.loot && (
        <div className={styles.claimedRow}>
          <span className={styles.claimedBadge} style={{ color: CHEST_TIERS[quest.loot.tier].textColor }}>
            {CHEST_TIERS[quest.loot.tier].icon} {CHEST_TIERS[quest.loot.tier].name} claimed
          </span>
          <button className={styles.removeBtn} onClick={() => deleteQuest(quest.id)}>Remove</button>
        </div>
      )}

      {!allDone && (
        <button className={styles.abandonBtn} onClick={() => deleteQuest(quest.id)}>Abandon</button>
      )}

      {revealedLoot && (
        <LootChestModal loot={revealedLoot} questTitle={quest.title} onClose={() => setRevealedLoot(null)} />
      )}
    </div>
  )
}
