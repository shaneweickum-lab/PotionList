import { useState } from 'react'
import { useStore } from '../../store/index.js'
import { getLevelInfo, getTitleForLevel } from '../../constants/xp.js'
import styles from './Header.module.css'

export default function Header({ onOpenIAP }) {
  const { xp, gold, streak, founderUnlocked } = useStore()
  const { level, currentLevelXP, xpToNextLevel, progress } = getLevelInfo(xp)
  const title = getTitleForLevel(level)

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <div className={styles.levelBadge}>
          <span className={styles.levelNum}>{level}</span>
        </div>
        <div className={styles.info}>
          <div className={styles.titleRow}>
            <span className={styles.titleText}>{title}</span>
            {founderUnlocked && <span className={styles.founderBadge}>Founder</span>}
            {streak > 0 && <span className={styles.streak}>🔥 {streak}</span>}
          </div>
          <div className={styles.xpBar}>
            <div className={styles.xpFill} style={{ width: `${progress * 100}%` }} />
          </div>
          <span className={styles.xpText}>{currentLevelXP} / {xpToNextLevel === Infinity ? '—' : xpToNextLevel} XP</span>
        </div>
      </div>
      <div className={styles.right}>
        <div className={styles.gold}>
          <span className={styles.goldIcon}>✦</span>
          <span className={styles.goldAmount}>{gold.toLocaleString()}</span>
        </div>
        <button className={styles.gemBtn} onClick={onOpenIAP} aria-label="Store">
          💎
        </button>
      </div>
    </header>
  )
}
