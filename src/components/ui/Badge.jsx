import styles from './Badge.module.css'

export default function Badge({ rarity, label }) {
  return (
    <span className={`${styles.badge} ${styles[rarity]}`}>
      {label ?? rarity}
    </span>
  )
}
