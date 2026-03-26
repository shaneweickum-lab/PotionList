import { useStore } from '../../store/index.js'
import { getLevelInfo, getTitleForLevel } from '../../constants/xp.js'
import styles from './StatsPanel.module.css'

export default function StatsPanel() {
  const { xp, gold, streak, longestStreak, tasksCompleted, totalPotionsBrewed, totalQuestsCompleted, owned, titles, founderUnlocked } = useStore()
  const { level, currentLevelXP, xpToNextLevel } = getLevelInfo(xp)

  const stats = [
    { label: 'Level', value: level },
    { label: 'XP', value: `${currentLevelXP} / ${xpToNextLevel === Infinity ? '—' : xpToNextLevel}` },
    { label: 'Gold', value: `${gold.toLocaleString()}g` },
    { label: 'Current Streak', value: `${streak} days` },
    { label: 'Longest Streak', value: `${longestStreak} days` },
    { label: 'Tasks Completed', value: tasksCompleted ?? 0 },
    { label: 'Quests Completed', value: totalQuestsCompleted ?? 0 },
    { label: 'Potions Brewed', value: totalPotionsBrewed ?? 0 },
    { label: 'Collectibles', value: (owned ?? []).length },
  ]

  return (
    <div className={styles.stats}>
      <div className={styles.titleRow}>
        <span className={styles.currentTitle}>{getTitleForLevel(level)}</span>
        {founderUnlocked && <span className={styles.founder}>Founder</span>}
      </div>
      {stats.map(s => (
        <div key={s.label} className={styles.stat}>
          <span className={styles.statLabel}>{s.label}</span>
          <span className={styles.statValue}>{s.value}</span>
        </div>
      ))}
      {titles.length > 0 && (
        <div className={styles.titlesSection}>
          <div className={styles.titlesLabel}>Titles Earned</div>
          <div className={styles.titlesList}>
            {titles.map(t => <span key={t} className={styles.titleChip}>{t}</span>)}
          </div>
        </div>
      )}
    </div>
  )
}
