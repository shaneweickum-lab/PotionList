import styles from './Button.module.css'

export default function Button({ children, variant = 'gold', size = 'md', disabled, onClick, className = '', fullWidth }) {
  return (
    <button
      className={`${styles.btn} ${styles[variant]} ${styles[size]} ${fullWidth ? styles.fullWidth : ''} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}
