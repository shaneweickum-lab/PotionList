import { useStore } from '../../store/index.js'
import { CHARACTER_MAP } from '../../constants/orders.js'
import { POTION_MAP } from '../../constants/potions.js'
import Button from '../ui/Button.jsx'
import { showToast } from '../ui/ToastNotification.jsx'
import { getMsUntilMidnightUTC } from '../../lib/orderSeed.js'
import Timer from '../ui/Timer.jsx'
import styles from './DailyOrders.module.css'

export default function DailyOrders() {
  const { dailyOrders, fulfillOrder, potionInventory } = useStore()
  const midnightMs = Date.now() + getMsUntilMidnightUTC()

  if (!dailyOrders.length) return <p className="lore" style={{ padding: '16px' }}>No orders today.</p>

  return (
    <div className={styles.orders}>
      <div className={styles.resets}>
        Resets in <Timer finishAt={midnightMs} compact />
      </div>
      {dailyOrders.map(order => {
        const char = CHARACTER_MAP[order.characterId]
        const potion = POTION_MAP[order.potionId]
        const haveEnough = (potionInventory?.[order.potionId] ?? 0) >= order.qty

        return (
          <div key={order.id} className={`${styles.order} ${order.fulfilled ? styles.fulfilled : ''}`}>
            <div className={styles.charRow}>
              <div className={styles.charDot} style={{ background: char?.color ?? '#888' }} />
              <div>
                <div className={styles.charName}>{char?.name ?? order.characterId}</div>
                <div className={styles.charTitle}>{char?.title}</div>
              </div>
            </div>
            <div className={styles.orderReq}>
              Wants: <span className={styles.potionName}>{potion?.name ?? order.potionId}</span> ×{order.qty}
            </div>
            <div className={styles.orderReward}>
              <span className={styles.gold}>✦ {order.goldReward}g</span>
              {order.bonus && (
                <span className={styles.bonus}>
                  {order.bonus.type === 'gold' && `+ ${order.bonus.amount}g`}
                  {order.bonus.type === 'xp' && `+ ${order.bonus.amount} XP`}
                  {order.bonus.type === 'seed' && `+ Rare Seed`}
                  {order.bonus.type === 'ore' && `+ Ore`}
                </span>
              )}
            </div>
            {order.fulfilled ? (
              <span className={styles.fulfilledLabel}>Fulfilled</span>
            ) : (
              <Button
                variant={haveEnough ? 'gold' : 'ghost'}
                size="sm"
                disabled={!haveEnough}
                onClick={() => {
                  const result = fulfillOrder(order.id)
                  if (result.error) showToast(result.error, 'error')
                  else showToast(`Order fulfilled! +${order.goldReward}g`, 'gold')
                }}
              >
                {haveEnough ? 'Fulfill' : `Need ${order.qty - (potionInventory?.[order.potionId] ?? 0)} more`}
              </Button>
            )}
          </div>
        )
      })}
    </div>
  )
}
