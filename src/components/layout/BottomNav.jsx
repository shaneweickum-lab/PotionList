import styles from './BottomNav.module.css'

const NAV_ITEMS = [
  { id: 'tasks', label: 'Tasks', icon: '📋' },
  { id: 'garden', label: 'Garden', icon: '🌿' },
  { id: 'cauldron', label: 'Cauldron', icon: '🫧' },
  { id: 'village', label: 'Village', icon: '🏘️' },
  { id: 'profile', label: 'Profile', icon: '📜' },
]

export default function BottomNav({ active, onChange }) {
  return (
    <nav className={styles.nav}>
      {NAV_ITEMS.map(item => (
        <button
          key={item.id}
          className={`${styles.item} ${active === item.id ? styles.active : ''}`}
          onClick={() => onChange(item.id)}
        >
          <span className={styles.icon}>{item.icon}</span>
          <span className={styles.label}>{item.label}</span>
        </button>
      ))}
    </nav>
  )
}
