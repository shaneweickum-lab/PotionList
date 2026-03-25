import { useStore } from '../../store/index.js'
import { SKILL_BRANCHES } from '../../constants/skills.js'
import { showToast } from '../ui/ToastNotification.jsx'
import styles from './SkillTree.module.css'

export default function SkillTree() {
  const {
    getSkillPointsEarned,
    getSkillPointsSpent,
    getSkillPointsAvailable,
    unlockedSkills,
    purchaseSkill,
  } = useStore()

  const earned = getSkillPointsEarned()
  const spent = getSkillPointsSpent()
  const available = getSkillPointsAvailable()
  const unlocked = unlockedSkills ?? []

  const handlePurchase = (skillId) => {
    const result = purchaseSkill(skillId)
    if (result.error) showToast(result.error, 'error')
    else showToast('Skill unlocked!', 'success')
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <div className={styles.pointsRow}>
          <span className={styles.available}>{available}</span>
          <span className={styles.pointsLabel}> skill {available === 1 ? 'point' : 'points'} available</span>
        </div>
        <div className={styles.earned}>Earned: {earned} · Spent: {spent}</div>
        <p className={styles.hint}>Gain 1 skill point per level. Spend them on passive bonuses below.</p>
      </div>

      <div className={styles.branches}>
        {SKILL_BRANCHES.map(branch => (
          <div key={branch.id} className={styles.branch}>
            <div className={styles.branchHeader} style={{ color: branch.color }}>
              <span className={styles.branchIcon}>{branch.icon}</span>
              <span className={styles.branchLabel}>{branch.label}</span>
            </div>

            <div className={styles.nodes}>
              {branch.nodes.map((node, i) => {
                const isUnlocked = unlocked.includes(node.id)
                const prereqMet = !node.requires || unlocked.includes(node.requires)
                const canAfford = available >= node.cost
                const canBuy = !isUnlocked && prereqMet && canAfford

                return (
                  <div key={node.id} className={styles.nodeWrap}>
                    {i > 0 && (
                      <div
                        className={`${styles.connector} ${unlocked.includes(branch.nodes[i - 1].id) ? styles.connectorActive : ''}`}
                        style={{ '--branch-color': branch.color }}
                      />
                    )}
                    <div
                      className={[
                        styles.node,
                        isUnlocked ? styles.nodeOwned : '',
                        canBuy ? styles.nodeAvailable : '',
                        !prereqMet ? styles.nodeLocked : '',
                      ].join(' ')}
                      style={isUnlocked ? { '--branch-color': branch.color, borderColor: branch.color } : {}}
                    >
                      <div className={styles.nodeTop}>
                        <span className={styles.nodeName}>{node.name}</span>
                        <span className={`${styles.nodeCost} ${isUnlocked ? styles.nodeCostOwned : ''}`}>
                          {isUnlocked ? '✓' : `${node.cost}★`}
                        </span>
                      </div>
                      <p className={styles.nodeDesc}>{node.desc}</p>
                      {canBuy && (
                        <button
                          className={styles.buyBtn}
                          style={{ background: branch.color }}
                          onClick={() => handlePurchase(node.id)}
                        >
                          Unlock
                        </button>
                      )}
                      {!isUnlocked && !prereqMet && (
                        <span className={styles.lockedLabel}>Locked</span>
                      )}
                      {!isUnlocked && prereqMet && !canAfford && (
                        <span className={styles.cantAfford}>Need {node.cost - available} more ★</span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
