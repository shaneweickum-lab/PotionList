import { useState } from 'react'
import { useStore } from '../../store/index.js'
import { CHARACTER_MAP } from '../../constants/orders.js'
import { POTION_MAP } from '../../constants/potions.js'
import { HERB_MAP } from '../../constants/herbs.js'
import { MUSHROOM_MAP } from '../../constants/mushrooms.js'
import { BUG_MAP } from '../../constants/bugs.js'
import Button from '../ui/Button.jsx'
import { showToast } from '../ui/ToastNotification.jsx'
import {
  getMsUntilMidnightUTC,
  getMsUntilNextMondayUTC,
  getMsUntilNextMonthUTC,
} from '../../lib/orderSeed.js'
import Timer from '../ui/Timer.jsx'
import styles from './DailyOrders.module.css'

const TABS = ['daily', 'weekly', 'monthly']

function getItemName(type, id) {
  if (type === 'potion')   return POTION_MAP[id]?.name ?? id
  if (type === 'herb')     return HERB_MAP[id]?.name ?? id
  if (type === 'mushroom') return MUSHROOM_MAP[id]?.name ?? id
  if (type === 'bug')      return BUG_MAP[id]?.name ?? id
  return id
}

function getItemColor(type, id) {
  if (type === 'potion')   return POTION_MAP[id]?.color
  if (type === 'herb')     return HERB_MAP[id]?.color
  if (type === 'mushroom') return MUSHROOM_MAP[id]?.color
  if (type === 'bug')      return BUG_MAP[id]?.color
  return undefined
}

function checkHaveItem(type, id, qty, potionInventory, inventory) {
  const have = type === 'potion' ? (potionInventory?.[id] ?? 0) : (inventory?.[id] ?? 0)
  return { have, need: Math.max(0, qty - have), ok: have >= qty }
}

function ItemLine({ item, potionInventory, inventory }) {
  const name  = getItemName(item.type, item.id)
  const color = getItemColor(item.type, item.id)
  const { have, ok } = checkHaveItem(item.type, item.id, item.qty, potionInventory, inventory)
  const typeLabel = item.type.charAt(0).toUpperCase() + item.type.slice(1)

  return (
    <div className={styles.itemLine}>
      {color && <span className={styles.itemDot} style={{ background: color }} />}
      <span className={`${styles.itemLineName} ${ok ? '' : styles.itemLineShort}`}>
        {name}
      </span>
      <span className={styles.itemTypeTag}>{typeLabel}</span>
      <span className={`${styles.itemLineQty} ${ok ? styles.qtyOk : styles.qtyMissing}`}>
        {have}/{item.qty}
      </span>
    </div>
  )
}

function OrderCard({ order, orderType, potionInventory, inventory, fulfillOrder }) {
  const char = CHARACTER_MAP[order.characterId]

  const canFulfill = order.items.every(item =>
    checkHaveItem(item.type, item.id, item.qty, potionInventory, inventory).ok
  )

  const handleFulfill = () => {
    const result = fulfillOrder(order.id, orderType)
    if (result.error) showToast(result.error, 'error')
    else {
      const xpPart = order.xpReward ? ` +${order.xpReward} XP` : ''
      showToast(`Order fulfilled! +${order.goldReward}g${xpPart}`, 'gold')
    }
  }

  return (
    <div className={`${styles.order} ${order.fulfilled ? styles.fulfilled : ''} ${styles[orderType]}`}>
      <div className={styles.charRow}>
        <div className={styles.charDot} style={{ background: char?.color ?? '#888' }} />
        <div>
          <div className={styles.charName}>{char?.name ?? order.characterId}</div>
          <div className={styles.charTitle}>{char?.title}</div>
        </div>
      </div>

      <div className={styles.itemsLabel}>Requests:</div>
      <div className={styles.itemsList}>
        {order.items.map((item, i) => (
          <ItemLine key={i} item={item} potionInventory={potionInventory} inventory={inventory} />
        ))}
      </div>

      <div className={styles.orderReward}>
        <span className={styles.gold}>✦ {order.goldReward}g</span>
        {order.xpReward > 0 && <span className={styles.xp}>+ {order.xpReward} XP</span>}
        {order.bonus && (
          <span className={styles.bonus}>
            {order.bonus.type === 'gold'  && `+ ${order.bonus.amount}g bonus`}
            {order.bonus.type === 'xp'    && `+ ${order.bonus.amount} XP bonus`}
            {order.bonus.type === 'seed'  && `+ Rare Seed${(order.bonus.qty ?? 1) > 1 ? ` ×${order.bonus.qty}` : ''}`}
            {order.bonus.type === 'ore'   && `+ Ore ×${order.bonus.qty}`}
          </span>
        )}
      </div>

      {order.fulfilled ? (
        <span className={styles.fulfilledLabel}>Fulfilled</span>
      ) : (
        <Button
          variant={canFulfill ? 'gold' : 'ghost'}
          size="sm"
          disabled={!canFulfill}
          onClick={handleFulfill}
        >
          {canFulfill ? 'Fulfill' : 'Missing items'}
        </Button>
      )}
    </div>
  )
}

export default function DailyOrders() {
  const [tab, setTab] = useState('daily')
  const { dailyOrders, weeklyOrders, monthlyOrders, fulfillOrder, potionInventory, inventory } = useStore()

  const orders = tab === 'weekly' ? weeklyOrders : tab === 'monthly' ? monthlyOrders : dailyOrders
  const timerMs = tab === 'weekly'
    ? Date.now() + getMsUntilNextMondayUTC()
    : tab === 'monthly'
      ? Date.now() + getMsUntilNextMonthUTC()
      : Date.now() + getMsUntilMidnightUTC()

  const resetLabel = tab === 'weekly' ? 'Resets Monday' : tab === 'monthly' ? 'Resets next month' : 'Resets in'

  return (
    <div className={styles.wrap}>
      <div className={styles.tabs}>
        {TABS.map(t => (
          <button
            key={t}
            className={`${styles.tab} ${tab === t ? styles.tabActive : ''} ${styles[`tab_${t}`]}`}
            onClick={() => setTab(t)}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      <div className={styles.resets}>
        {resetLabel} <Timer finishAt={timerMs} compact />
      </div>

      <div className={styles.orders}>
        {!orders.length
          ? <p className="lore" style={{ padding: '16px' }}>No orders available.</p>
          : orders.map(order => (
              <OrderCard
                key={order.id}
                order={order}
                orderType={tab}
                potionInventory={potionInventory}
                inventory={inventory}
                fulfillOrder={fulfillOrder}
              />
            ))
        }
      </div>
    </div>
  )
}
