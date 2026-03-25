import { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useStore } from '../../store/index.js'
import { showToast } from '../ui/ToastNotification.jsx'
import LootChestModal from './LootChestModal.jsx'
import { CHEST_TIERS, getChestTier } from '../../lib/chestLoot.js'
import { CATEGORY_MAP } from '../../constants/questCategories.js'
import styles from './QuestItem.module.css'

export default function QuestItem({ quest }) {
  const { toggleQuestStep, toggleShoppingItem, previewQuestChest, claimQuestChest, deleteQuest, level } = useStore()
  const [revealedLoot, setRevealedLoot] = useState(null)
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: quest.id })

  const doneCount = quest.steps.filter(s => s.done).length
  const allDone = doneCount === quest.steps.length
  const tier = CHEST_TIERS[getChestTier(level ?? 1)]
  const cat = quest.category ? CATEGORY_MAP[quest.category] : null

  const groceries = quest.shoppingItems ?? []
  const isShopping = quest.category === 'shopping' && groceries.length > 0
  const groceryDone = groceries.filter(g => g.done).length

  const handleChest = () => {
    const loot = previewQuestChest(quest.id)
    if (loot) setRevealedLoot(loot)
  }

  const handleClaim = () => {
    claimQuestChest(quest.id)
    setRevealedLoot(null)
  }

  const handleShoppingItem = (itemId) => {
    const reward = toggleShoppingItem(quest.id, itemId)
    if (reward) {
      let msg = `+${reward.xp} XP`
      if (reward.healthy) msg += '  · 🥦 Healthy bonus!'
      showToast(msg, reward.healthy ? 'success' : 'gold')
    }
  }

  const dragStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.45 : 1,
    zIndex: isDragging ? 50 : undefined,
  }

  return (
    <div
      ref={setNodeRef}
      style={dragStyle}
      className={`${styles.quest} ${allDone && !quest.chestOpened ? styles.questReady : ''} ${quest.chestOpened ? styles.questDone : ''}`}
    >

      {/* Header */}
      <div className={styles.header}>
        <button
          className={styles.dragHandle}
          {...attributes}
          {...listeners}
          aria-label="Drag to reorder"
          tabIndex={-1}
        >⠿</button>
        <span className={styles.title}>{quest.title}</span>
        <div className={styles.headerRight}>
          {quest.recurrence && quest.recurrence !== 'none' && (
            <span className={styles.dailyBadge}>↺ {quest.recurrence.charAt(0).toUpperCase() + quest.recurrence.slice(1)}</span>
          )}
          {cat && (
            <span className={styles.catBadge}>
              {cat.icon} {cat.label}
            </span>
          )}
          <span className={styles.count}>{doneCount}/{quest.steps.length}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className={styles.progressBar}>
        <div className={styles.progressFill} style={{ width: `${(doneCount / quest.steps.length) * 100}%` }} />
      </div>

      {/* Steps */}
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

      {/* Shopping list */}
      {isShopping && (
        <div className={styles.shoppingSection}>
          <div className={styles.shoppingHeader}>
            <span className={styles.shoppingLabel}>🛒 Shopping List</span>
            <span className={styles.shoppingCount}>{groceryDone}/{groceries.length}</span>
          </div>
          {groceries.map(item => (
            <button
              key={item.id}
              className={`${styles.groceryItem} ${item.done ? styles.groceryDone : ''}`}
              onClick={() => !quest.chestOpened && handleShoppingItem(item.id)}
              disabled={quest.chestOpened}
            >
              <span className={`${styles.checkbox} ${item.done ? styles.checkboxDone : ''}`}>
                {item.done ? '✓' : ''}
              </span>
              <span className={styles.groceryName}>{item.name}</span>
              {item.healthy && !item.done && (
                <span className={styles.healthyBadge}>🥦 +8 XP</span>
              )}
              {!item.healthy && !item.done && (
                <span className={styles.xpHint}>+3 XP</span>
              )}
              {item.done && item.healthy && (
                <span className={styles.healthyEarned}>🥦</span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Chest button */}
      {allDone && !quest.chestOpened && (
        <button className={styles.chestBtn} onClick={handleChest}>
          <span className={styles.chestIcon}>{tier.icon}</span>
          <span>Open {tier.name}</span>
          <span className={styles.chestSpark}>✦</span>
        </button>
      )}

      {/* Claimed row */}
      {quest.chestOpened && quest.loot && (
        <div className={styles.claimedRow}>
          <span className={styles.claimedBadge} style={{ color: CHEST_TIERS[quest.loot.tier].textColor }}>
            {CHEST_TIERS[quest.loot.tier].icon} {CHEST_TIERS[quest.loot.tier].name} claimed
          </span>
          <button className={styles.removeBtn} onClick={() => deleteQuest(quest.id)}>Remove</button>
        </div>
      )}

      {/* Abandon */}
      {!allDone && (
        <button className={styles.abandonBtn} onClick={() => deleteQuest(quest.id)}>Abandon</button>
      )}

      {revealedLoot && (
        <LootChestModal loot={revealedLoot} questTitle={quest.title} onClaim={handleClaim} />
      )}
    </div>
  )
}
