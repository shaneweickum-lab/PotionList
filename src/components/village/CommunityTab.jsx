import { useState, useEffect } from 'react'
import { useStore } from '../../store/index.js'
import { COMMUNITY_ORDER_POOL, getWeekString, getWeekOrders, getWeekEndMs } from '../../constants/communityOrders.js'
import { SEED_MAP } from '../../constants/seeds.js'
import { HERB_MAP } from '../../constants/herbs.js'
import { MUSHROOM_MAP } from '../../constants/mushrooms.js'
import { ORE_MAP, INGOT_MAP } from '../../constants/ores.js'
import { POTION_MAP } from '../../constants/potions.js'
import MarketTab from './MarketTab.jsx'
import Button from '../ui/Button.jsx'
import Modal from '../ui/Modal.jsx'
import ProgressBar from '../ui/ProgressBar.jsx'
import { showToast } from '../ui/ToastNotification.jsx'
import { isSupabaseConfigured } from '../../lib/supabase.js'
import styles from './CommunityTab.module.css'

const SUB_TABS = [
  { id: 'market',  label: 'Market' },
  { id: 'requests', label: 'Requests' },
  { id: 'orders',  label: 'Community Orders' },
]

function getItemName(type, id) {
  if (type === 'potion')   return POTION_MAP[id]?.name   ?? id
  if (type === 'herb')     return HERB_MAP[id]?.name     ?? id
  if (type === 'mushroom') return MUSHROOM_MAP[id]?.name ?? id
  if (type === 'ore')      return ORE_MAP[id]?.name      ?? id
  if (type === 'ingot')    return INGOT_MAP[id]?.name    ?? id
  if (type === 'seed')     return SEED_MAP[id]?.name     ?? id
  return id
}

function formatTimeLeft(ms) {
  if (ms <= 0) return 'Ended'
  const d = Math.floor(ms / 86400000)
  const h = Math.floor((ms % 86400000) / 3600000)
  if (d > 0) return `${d}d ${h}h`
  const m = Math.floor((ms % 3600000) / 60000)
  return `${h}h ${m}m`
}

// ── Community Orders section ─────────────────────────────────────────────────

function CommunityOrdersSection() {
  const weekString = getWeekString()
  const weekOrders = getWeekOrders(weekString)
  const [timeLeft, setTimeLeft] = useState(getWeekEndMs())
  const [contributeModal, setContributeModal] = useState(null) // order or null

  const {
    communityOrderProgress, communityLoading,
    fetchCommunityOrderProgress, contributeToOrder,
    userId,
  } = useStore()

  useEffect(() => {
    fetchCommunityOrderProgress(weekString)
    const id = setInterval(() => setTimeLeft(getWeekEndMs()), 60000)
    return () => clearInterval(id)
  }, [weekString])

  return (
    <div className={styles.section}>
      <div className={styles.weekHeader}>
        <span className={styles.weekLabel}>Week {weekString}</span>
        <span className={styles.weekTimer}>Resets in {formatTimeLeft(timeLeft)}</span>
      </div>
      <p className={styles.sectionLore}>
        Large community goals that everyone can contribute to. Rewards are split proportionally — the more you give, the more you earn.
      </p>

      {weekOrders.map(order => {
        const contributed = communityOrderProgress[order.id] ?? 0
        const progress = Math.min(1, contributed / order.totalQty)
        const isFull = contributed >= order.totalQty
        return (
          <div key={order.id} className={`${styles.orderCard} ${isFull ? styles.orderFull : ''}`}>
            <div className={styles.orderHeader}>
              <span className={styles.orderName}>{order.name}</span>
              {isFull && <span className={styles.orderComplete}>Complete</span>}
            </div>
            <p className={styles.orderDesc}>{order.description}</p>
            <div className={styles.orderNeed}>
              <span className={styles.needLabel}>Needs:</span>
              <span className={styles.needItem}>{getItemName(order.itemType, order.itemId)}</span>
              <span className={styles.needQty}>{Math.min(contributed, order.totalQty).toLocaleString()} / {order.totalQty.toLocaleString()}</span>
            </div>
            <ProgressBar value={progress} color={isFull ? 'gold' : 'green'} height={5} />
            <div className={styles.orderReward}>
              <span className={styles.rewardLabel}>Reward pool:</span>
              <span className={styles.rewardGold}>{order.rewardGold}g</span>
              <span className={styles.rewardXP}>+{order.rewardXP} XP</span>
              <span className={styles.rewardNote}>(split by contribution)</span>
            </div>
            {!isFull && (
              <Button
                variant="ghost"
                size="sm"
                disabled={!userId}
                onClick={() => setContributeModal(order)}
              >
                Contribute
              </Button>
            )}
          </div>
        )
      })}

      {contributeModal && (
        <ContributeModal
          order={contributeModal}
          weekString={weekString}
          currentProgress={communityOrderProgress[contributeModal.id] ?? 0}
          contributeToOrder={contributeToOrder}
          onClose={() => setContributeModal(null)}
        />
      )}
    </div>
  )
}

function ContributeModal({ order, weekString, currentProgress, contributeToOrder, onClose }) {
  const [qty, setQty] = useState(1)
  const store = useStore()

  const invKey = order.itemType === 'potion' ? 'potionInventory'
    : order.itemType === 'ore' ? 'oreInventory'
    : order.itemType === 'ingot' ? 'ingotInventory'
    : order.itemType === 'seed' ? 'seeds'
    : 'inventory'
  const available = store[invKey]?.[order.itemId] ?? 0
  const remaining = Math.max(0, order.totalQty - currentProgress)

  const effectiveQty = Math.min(qty, remaining)
  const fraction = effectiveQty / order.totalQty
  const estGold = Math.floor(fraction * order.rewardGold)
  const estXP   = Math.floor(fraction * order.rewardXP)

  const handleContribute = async () => {
    if (qty < 1 || available < qty) return
    const result = await contributeToOrder({ poolId: order.id, qty, weekString, order })
    if (result.error) showToast(result.error, 'error')
    else {
      showToast(`Contributed ${qty}× ${getItemName(order.itemType, order.itemId)}! +${result.goldReward}g +${result.xpReward}XP`, 'gold')
      onClose()
    }
  }

  return (
    <Modal title={`Contribute — ${order.name}`} onClose={onClose}>
      <div className={styles.contributeForm}>
        <p className={styles.contributeNeed}>
          Needs: <strong>{getItemName(order.itemType, order.itemId)}</strong>
          &nbsp;· You have: <strong>{available}</strong>
          &nbsp;· Remaining: <strong>{remaining}</strong>
        </p>
        <div className={styles.qtyRow}>
          <label className={styles.qtyLabel}>Quantity</label>
          <input
            type="number"
            className={styles.numInput}
            value={qty}
            min={1}
            max={Math.min(available, remaining)}
            onChange={e => setQty(Math.max(1, Math.min(available, remaining, Number(e.target.value))))}
          />
        </div>
        <div className={styles.estReward}>
          Estimated reward: <span className={styles.rewardGold}>{estGold}g</span> + <span className={styles.rewardXP}>{estXP} XP</span>
        </div>
        <Button variant="gold" fullWidth onClick={handleContribute} disabled={available < 1 || qty < 1}>
          Contribute {qty}×
        </Button>
      </div>
    </Modal>
  )
}

// ── Requests section ─────────────────────────────────────────────────────────

const ITEM_TYPES = [
  { value: 'herb',     label: 'Herb' },
  { value: 'mushroom', label: 'Mushroom' },
  { value: 'seed',     label: 'Seed' },
  { value: 'potion',   label: 'Potion' },
  { value: 'ore',      label: 'Ore' },
  { value: 'ingot',    label: 'Ingot' },
]

function RequestsSection() {
  const [showPostModal, setShowPostModal] = useState(false)
  const {
    itemRequests, requestsLoading,
    fetchItemRequests, fulfillRequest, cancelRequest,
    userId,
  } = useStore()

  useEffect(() => {
    if (isSupabaseConfigured) fetchItemRequests()
  }, [])

  const handleFulfill = async (req) => {
    const result = await fulfillRequest(req.id)
    if (result.error) showToast(result.error, 'error')
    else showToast(`Fulfilled! +${result.goldEarned}g`, 'gold')
  }

  const handleCancel = async (req) => {
    const result = await cancelRequest(req.id)
    if (result.error) showToast(result.error, 'error')
    else showToast('Request cancelled. Gold returned.', 'success')
  }

  return (
    <div className={styles.section}>
      <div className={styles.toolbar}>
        <div>
          <p className={styles.sectionLore}>Post what you need and set your price. Others can fulfill your request and collect the gold.</p>
        </div>
        <Button variant="gold" size="sm" disabled={!userId} onClick={() => setShowPostModal(true)}>
          Post Request
        </Button>
      </div>

      {!isSupabaseConfigured && (
        <p className={styles.notice}>Requests require Supabase configuration.</p>
      )}

      {requestsLoading && <p className={styles.loading}>Loading requests…</p>}

      {!requestsLoading && itemRequests.length === 0 && (
        <div className={styles.empty}>
          <p className="lore">The request board is empty. Be the first to post.</p>
        </div>
      )}

      <div className={styles.requestList}>
        {itemRequests.map(req => {
          const isOwn = req.user_id === userId
          const totalGold = req.escrowed_gold ?? req.qty * req.price_each
          return (
            <div key={req.id} className={`${styles.requestCard} ${isOwn ? styles.ownRequest : ''}`}>
              <div className={styles.requestInfo}>
                <span className={styles.requestItem}>{getItemName(req.item_type, req.item_id)}</span>
                <span className={styles.requestQty}>×{req.qty}</span>
                <span className={styles.requestPrice}>{req.price_each}g each · {totalGold}g total</span>
                <span className={styles.requestPoster}>Posted by {req.username ?? 'Unknown'}</span>
              </div>
              <div className={styles.requestActions}>
                {isOwn ? (
                  <Button variant="ghost" size="sm" onClick={() => handleCancel(req)}>Cancel</Button>
                ) : (
                  <Button
                    variant="gold"
                    size="sm"
                    disabled={!userId}
                    onClick={() => handleFulfill(req)}
                  >
                    Fulfill +{totalGold}g
                  </Button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {showPostModal && <PostRequestModal onClose={() => setShowPostModal(false)} />}
    </div>
  )
}

function PostRequestModal({ onClose }) {
  const [type, setType] = useState('herb')
  const [itemId, setItemId] = useState('')
  const [qty, setQty] = useState(1)
  const [priceEach, setPriceEach] = useState(20)
  const { postRequest, gold } = useStore()

  const ITEM_OPTIONS = {
    herb:     Object.values(HERB_MAP),
    mushroom: Object.values(MUSHROOM_MAP),
    seed:     Object.values(SEED_MAP),
    potion:   Object.values(POTION_MAP),
    ore:      Object.values(ORE_MAP),
    ingot:    Object.values(INGOT_MAP),
  }

  const options = ITEM_OPTIONS[type] ?? []
  const totalGold = qty * priceEach
  const canAfford = gold >= totalGold

  const handlePost = async () => {
    if (!itemId || qty < 1 || priceEach < 1) return
    const result = await postRequest({ itemType: type, itemId, qty, priceEach })
    if (result.error) showToast(result.error, 'error')
    else { showToast('Request posted!', 'success'); onClose() }
  }

  return (
    <Modal title="Post a Request" onClose={onClose}>
      <div className={styles.postForm}>
        <p className={styles.postNote}>
          Set the gold you are willing to pay. It will be escrowed until someone fulfills your request or you cancel it.
        </p>
        <select className={styles.select} value={type} onChange={e => { setType(e.target.value); setItemId('') }}>
          {ITEM_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
        <select className={styles.select} value={itemId} onChange={e => setItemId(e.target.value)}>
          <option value="">Select item…</option>
          {options.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
        </select>
        <div className={styles.listRow}>
          <label>Qty:
            <input type="number" className={styles.numInput} value={qty} min={1}
              onChange={e => setQty(Math.max(1, Number(e.target.value)))} />
          </label>
          <label>Per item (g):
            <input type="number" className={styles.numInput} value={priceEach} min={1}
              onChange={e => setPriceEach(Math.max(1, Number(e.target.value)))} />
          </label>
        </div>
        <div className={styles.escrowNote}>
          Total escrowed: <span className={canAfford ? styles.rewardGold : styles.errorText}>{totalGold}g</span>
          {!canAfford && ' — not enough gold'}
        </div>
        <Button variant="gold" fullWidth onClick={handlePost} disabled={!itemId || !canAfford}>
          Post Request — {totalGold}g
        </Button>
      </div>
    </Modal>
  )
}

// ── Main tab ─────────────────────────────────────────────────────────────────

export default function CommunityTab() {
  const [sub, setSub] = useState('market')

  return (
    <div className={styles.community}>
      <div className={styles.subTabs}>
        {SUB_TABS.map(t => (
          <button
            key={t.id}
            className={`${styles.subTab} ${sub === t.id ? styles.subTabActive : ''}`}
            onClick={() => setSub(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {sub === 'market'   && <MarketTab />}
      {sub === 'requests' && <RequestsSection />}
      {sub === 'orders'   && <CommunityOrdersSection />}
    </div>
  )
}
