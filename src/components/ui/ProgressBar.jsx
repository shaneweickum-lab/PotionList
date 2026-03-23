import styles from './ProgressBar.module.css'

export default function ProgressBar({ value = 0, color = 'gold', height = 6, label, showPercent }) {
  const pct = Math.min(1, Math.max(0, value)) * 100
  return (
    <div className={styles.wrap}>
      {label && <span className={styles.label}>{label}</span>}
      <div className={styles.track} style={{ height }}>
        <div
          className={`${styles.fill} ${styles[color]}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showPercent && <span className={styles.pct}>{Math.round(pct)}%</span>}
    </div>
  )
}
