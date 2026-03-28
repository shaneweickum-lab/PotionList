import { useState, useEffect } from 'react'
import { useStore } from '../../store/index.js'
import { POTION_MAP } from '../../constants/potions.js'
import { HERB_MAP } from '../../constants/herbs.js'
import { MUSHROOM_MAP } from '../../constants/mushrooms.js'
import { ORE_MAP, INGOT_MAP } from '../../constants/ores.js'
import { SEED_MAP } from '../../constants/seeds.js'
import Button from '../ui/Button.jsx'
import Modal from '../ui/Modal.jsx'
import { showToast } from '../ui/ToastNotification.jsx'
import { isSupabaseConfigured } from '../../lib/supabase.js'
import styles from './MarketTab.module.css'

function getItemName(type, id) {
  if (type === 'potion')   return POTION_MAP[id]?.name   ?? id
  if (type === 'herb')     return HERB_MAP[id]?.name     ?? id
  if (type === 'mushroom') return MUSHROOM_MAP[id]?.name ?? id
  if (type === 'ore')      return ORE_MAP[id]?.name      ?? id
  if (type === 'ingot')    return INGOT_MAP[id]?.name    ?? id
  if (type === 'seed')     return SEED_MAP[id]?.name     ?? id
  return id
}

function timeLeft(expiresAt) {
  const ms = new Date(expiresAt).getTime() - Date.now()
  if (ms <= 0) return 'Expired'
  const h = Math.floor(ms / 3600000)
  return `${h}h left`
}

export default function MarketTab() {
  const [showListModal, setShowListModal] = useState(false)
  const { marketListings, fetchMarketListings, buyListing, listItem, userId, gold } = useStore()

  useEffect(() => {
    if (isSupabaseConfigured) fetchMarketListings()
  }, [])

  const handleBuy = async (listing) => {
    if (!userId) return showToast('Sign in to use the market', 'error')
    const result = await buyListing(listing.id)
    if (result.error) showToast(result.error, 'error')
    else showToast(`Purchased ${getItemName(listing.item_type, listing.item_id)}!`, 'success')
  }

  return (
    <div className={styles.market}>
      <div className={styles.toolbar}>
        <Button variant="gold" size="sm" onClick={() => setShowListModal(true)} disabled={!userId}>
          List Item
        </Button>
        {!isSupabaseConfigured && (
          <span className={styles.notice}>Market requires Supabase configuration</span>
        )}
      </div>

      {marketListings.length === 0 ? (
        <div className={styles.empty}>
          <p className="lore">The market board is quiet. No listings yet.</p>
        </div>
      ) : (
        <div className={styles.listings}>
          {marketListings.map(listing => (
            <div key={listing.id} className={styles.listing}>
              <div className={styles.listingInfo}>
                <span className={styles.listingName}>{getItemName(listing.item_type, listing.item_id)}</span>
                <span className={styles.listingSeller}>by {listing.username ?? 'Unknown'}</span>
                <span className={styles.listingExpiry}>{timeLeft(listing.expires_at)}</span>
              </div>
              <div className={styles.listingAction}>
                <span className={styles.listingQty}>×{listing.qty}</span>
                <Button
                  variant="gold"
                  size="sm"
                  disabled={!userId || gold < listing.price || listing.user_id === userId}
                  onClick={() => handleBuy(listing)}
                >
                  {listing.price}g
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showListModal && <ListItemModal onClose={() => setShowListModal(false)} listItem={listItem} />}
    </div>
  )
}

function ListItemModal({ onClose, listItem }) {
  const [type, setType] = useState('potion')
  const [itemId, setItemId] = useState('')
  const [qty, setQty] = useState(1)
  const [price, setPrice] = useState(50)
  const { potionInventory, inventory, oreInventory, ingotInventory, seeds } = useStore()

  const getOptions = () => {
    if (type === 'potion')   return Object.entries(potionInventory ?? {}).filter(([_, q]) => q > 0)
    if (type === 'herb')     return Object.entries(inventory ?? {}).filter(([id, q]) => q > 0 && HERB_MAP[id])
    if (type === 'mushroom') return Object.entries(inventory ?? {}).filter(([id, q]) => q > 0 && MUSHROOM_MAP[id])
    if (type === 'ore')      return Object.entries(oreInventory ?? {}).filter(([_, q]) => q > 0)
    if (type === 'ingot')    return Object.entries(ingotInventory ?? {}).filter(([_, q]) => q > 0)
    if (type === 'seed')     return Object.entries(seeds ?? {}).filter(([_, q]) => q > 0)
    return []
  }

  const handleList = async () => {
    if (!itemId || qty < 1 || price < 1) return
    const result = await listItem({ itemType: type, itemId, qty, price })
    if (result.error) showToast(result.error, 'error')
    else { showToast('Listed!', 'success'); onClose() }
  }

  const options = getOptions()

  return (
    <Modal title="List Item" onClose={onClose}>
      <div className={styles.listForm}>
        <select className={styles.select} value={type} onChange={e => { setType(e.target.value); setItemId('') }}>
          <option value="potion">Potion</option>
          <option value="herb">Herb</option>
          <option value="mushroom">Mushroom</option>
          <option value="seed">Seed</option>
          <option value="ore">Ore</option>
          <option value="ingot">Ingot</option>
        </select>
        <select className={styles.select} value={itemId} onChange={e => setItemId(e.target.value)}>
          <option value="">Select item...</option>
          {options.map(([id, qty]) => (
            <option key={id} value={id}>{getItemName(type, id)} (×{qty})</option>
          ))}
        </select>
        <div className={styles.listRow}>
          <label>Qty: <input type="number" className={styles.numInput} value={qty} min={1} onChange={e => setQty(Number(e.target.value))} /></label>
          <label>Price (g): <input type="number" className={styles.numInput} value={price} min={1} onChange={e => setPrice(Number(e.target.value))} /></label>
        </div>
        <Button variant="gold" fullWidth onClick={handleList} disabled={!itemId}>List for {price}g</Button>
      </div>
    </Modal>
  )
}
