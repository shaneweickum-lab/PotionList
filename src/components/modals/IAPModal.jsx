import { useState } from 'react'
import Modal from '../ui/Modal.jsx'
import Button from '../ui/Button.jsx'
import { IAP_PRODUCTS } from '../../constants/shop.js'
import { purchaseProduct } from '../../lib/revenuecat.js'
import { useStore } from '../../store/index.js'
import { showToast } from '../ui/ToastNotification.jsx'
import styles from './IAPModal.module.css'

export default function IAPModal({ onClose }) {
  const [loading, setLoading] = useState(null)
  const [confirmed, setConfirmed] = useState(null)
  const { applyIAPRewards, hasIAPPurchase } = useStore()

  const handlePurchase = async (product) => {
    if (loading) return
    setLoading(product.id)
    const result = await purchaseProduct(product.rcProductId)
    setLoading(null)

    if (result.cancelled) return
    if (!result.success) return showToast(result.error ?? 'Purchase failed', 'error')

    applyIAPRewards(product.id)
    setConfirmed(product)
  }

  if (confirmed) {
    return (
      <Modal onClose={onClose} title="Purchase Complete">
        <div className={styles.success}>
          <div className={styles.successIcon}>{confirmed.icon}</div>
          <h3 className={styles.successTitle}>{confirmed.name}</h3>
          <p className="lore">Your rewards have been added to your inventory.</p>
          <Button variant="gold" fullWidth onClick={onClose}>Excellent</Button>
        </div>
      </Modal>
    )
  }

  return (
    <Modal title="The Store" onClose={onClose}>
      <div className={styles.store}>
        <p className={styles.subtitle}>Support the alchemist's work.</p>
        {IAP_PRODUCTS.map(product => (
          <div
            key={product.id}
            className={`${styles.product} ${product.bestValue ? styles.bestValue : ''}`}
            style={{ borderColor: product.bestValue ? product.color : undefined }}
          >
            {product.bestValue && <div className={styles.bestLabel}>Best Value</div>}
            <div className={styles.productHeader}>
              <span className={styles.productIcon}>{product.icon}</span>
              <div className={styles.productInfo}>
                <div className={styles.productName}>{product.name}</div>
                <div className={styles.productDesc}>{product.description}</div>
              </div>
            </div>
            <Button
              variant="gold"
              fullWidth
              onClick={() => handlePurchase(product)}
              disabled={loading !== null}
            >
              {loading === product.id ? 'Processing...' : product.price}
            </Button>
          </div>
        ))}
        <p className={styles.footer}>Purchases are final. Contact support for issues.</p>
      </div>
    </Modal>
  )
}
