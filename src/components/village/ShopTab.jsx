import { useEffect, useState } from 'react'
import { useStore } from '../../store/index.js'
import { SHOP_ITEMS, CONSUMABLES } from '../../constants/shop.js'
import { HERB_MAP } from '../../constants/herbs.js'
import { MUSHROOM_MAP } from '../../constants/mushrooms.js'
import { SEED_MAP } from '../../constants/seeds.js'
import Button from '../ui/Button.jsx'
import { showToast } from '../ui/ToastNotification.jsx'
import SellTab from './SellTab.jsx'
import styles from './ShopTab.module.css'

const TABS = ['seeds', 'tools', 'garden', 'farm', 'sell']
const RARITY_LABEL = { common: 'Common', uncommon: 'Uncommon', rare: 'Rare', epic: 'Epic' }

function msUntilMidnight() {
  const now = new Date()
  const midnight = new Date(now)
  midnight.setHours(24, 0, 0, 0)
  return midnight - now
}

function useResetCountdown() {
  const [label, setLabel] = useState('')
  useEffect(() => {
    function update() {
      const ms = msUntilMidnight()
      const h = Math.floor(ms / 3600000)
      const m = Math.floor((ms % 3600000) / 60000)
      setLabel(h > 0 ? `${h}h ${m}m` : `${m}m`)
    }
    update()
    const id = setInterval(update, 60000)
    return () => clearInterval(id)
  }, [])
  return label
}

function SeedShop() {
  const { gold, shopStock, refreshShopStock, buyShopSeed } = useStore()
  const countdown = useResetCountdown()

  useEffect(() => { refreshShopStock() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleBuy = (seedId) => {
    const result = buyShopSeed(seedId)
    if (result.error) return showToast(result.error, 'error')
    showToast(`Purchased ${SEED_MAP[seedId]?.name}!`, 'success')
  }

  const renderSeedRow = (slot, featured = false) => {
    const info = SEED_MAP[slot.seedId]
    if (!info) return null
    const yieldItem = HERB_MAP[info.yields] ?? MUSHROOM_MAP[info.yields]
    const outOfStock = slot.stock <= 0

    return (
      <div key={slot.seedId} className={`${styles.item} ${outOfStock ? styles.outOfStock : ''}`}>
        <div className={styles.itemInfo}>
          <div className={styles.seedNameRow}>
            <span className={styles.itemName}>{info.name}</span>
            <span className={`${styles.rarityTag} ${styles['rarity_' + info.rarity]}`}>
              {RARITY_LABEL[info.rarity]}
            </span>
            {featured && <span className={styles.featuredBadge}>Featured</span>}
          </div>
          {yieldItem && (
            <div className={styles.itemDesc} style={{ color: yieldItem.color }}>
              Grows {yieldItem.name}
            </div>
          )}
          <div className={styles.stockRow}>
            {outOfStock
              ? <span className={styles.stockEmpty}>Out of stock</span>
              : <span className={styles.stockCount}>{slot.stock} / {slot.maxStock} in stock</span>
            }
          </div>
        </div>
        <div className={styles.itemAction}>
          <Button
            variant="gold"
            size="sm"
            disabled={outOfStock || gold < (info.goldCost ?? 0)}
            onClick={() => handleBuy(slot.seedId)}
          >
            {info.goldCost}g
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.seedShop}>
      <div className={styles.shopHeader}>
        <span className={styles.shopHeaderTitle}>Daily Stock</span>
        <span className={styles.shopHeaderReset}>Resets in {countdown}</span>
      </div>

      <div className={styles.seedSection}>
        <div className={styles.sectionLabel}>Seeds &amp; Spores</div>
        <div className={styles.items}>
          {shopStock.commonSlots.map(slot => renderSeedRow(slot))}
        </div>
      </div>

      {shopStock.featuredSlot && (
        <div className={styles.seedSection}>
          <div className={styles.sectionLabel}>Today&apos;s Featured</div>
          <div className={styles.items}>
            {renderSeedRow(shopStock.featuredSlot, true)}
          </div>
        </div>
      )}
    </div>
  )
}

export default function ShopTab() {
  const [category, setCategory] = useState('seeds')
  const { gold, spendGold, addToInventory, inventory, purchaseShopItem, isOwned,
          expandGarden, gardenSlotCount, incrementPlotsBought, getNextPlotCost } = useStore()
  const MAX_PLOTS = 20

  const purchaseTool = (item) => {
    if (isOwned(item.id)) return showToast('Already owned', 'error')
    if (gold < item.goldCost) return showToast('Not enough gold', 'error')
    spendGold(item.goldCost)
    purchaseShopItem(item.id)
    if (item.id === 'iron_hoe') expandGarden(1)
    showToast(`${item.name} acquired!`, 'success')
  }

  const purchasePlot = () => {
    if (gardenSlotCount >= MAX_PLOTS) return showToast('Garden is at maximum size', 'error')
    const cost = getNextPlotCost()
    if (gold < cost) return showToast('Not enough gold', 'error')
    spendGold(cost)
    expandGarden(1)
    incrementPlotsBought()
    showToast('Garden slot unlocked!', 'success')
  }

  const purchaseGarden = (item) => {
    if (item.id === 'garden_plot') return purchasePlot()
    if (isOwned(item.id)) return showToast('Already owned', 'error')
    if (gold < item.goldCost) return showToast('Not enough gold', 'error')
    spendGold(item.goldCost)
    purchaseShopItem(item.id)
    showToast(`${item.name} acquired!`, 'success')
  }

  const purchaseConsumable = (item) => {
    if (gold < item.goldCost) return showToast('Not enough gold', 'error')
    spendGold(item.goldCost)
    addToInventory(item.id, 1)
    showToast(`Purchased ${item.name}!`, 'success')
  }

  const items = category === 'tools' ? SHOP_ITEMS.tools : SHOP_ITEMS.garden

  return (
    <div className={styles.shop}>
      <div className={styles.categories}>
        {TABS.map(c => (
          <button
            key={c}
            className={`${styles.catBtn} ${category === c ? styles.catActive : ''}`}
            onClick={() => setCategory(c)}
          >
            {c.charAt(0).toUpperCase() + c.slice(1)}
          </button>
        ))}
      </div>

      {category === 'sell'  && <SellTab />}
      {category === 'seeds' && <SeedShop />}

      {category === 'farm' && (
        <div className={styles.items}>
          {CONSUMABLES.map(item => (
            <div key={item.id} className={styles.item}>
              <div className={styles.itemInfo}>
                <div className={styles.itemName}>{item.name}</div>
                <div className={styles.itemDesc}>
                  {item.description}
                  {(inventory[item.id] ?? 0) > 0 && (
                    <span className={styles.inStock}> · {inventory[item.id]} in stock</span>
                  )}
                </div>
              </div>
              <div className={styles.itemAction}>
                <Button variant="gold" size="sm" disabled={gold < item.goldCost} onClick={() => purchaseConsumable(item)}>
                  {item.goldCost}g
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {category !== 'sell' && category !== 'seeds' && category !== 'farm' && (
        <div className={styles.items}>
          {items.map(item => {
            const alreadyOwned = item.oneTime && isOwned(item.id)
            const atMaxPlots = item.id === 'garden_plot' && gardenSlotCount >= MAX_PLOTS
            const cost = item.id === 'garden_plot' ? getNextPlotCost() : item.goldCost
            return (
              <div key={item.id} className={`${styles.item} ${alreadyOwned ? styles.owned : ''}`}>
                <div className={styles.itemInfo}>
                  <div className={styles.itemName}>{item.name}</div>
                  <div className={styles.itemDesc}>{item.description}</div>
                </div>
                <div className={styles.itemAction}>
                  {atMaxPlots ? (
                    <span className={styles.ownedLabel}>Max</span>
                  ) : alreadyOwned ? (
                    <span className={styles.ownedLabel}>Owned</span>
                  ) : (
                    <Button
                      variant="gold"
                      size="sm"
                      disabled={gold < cost}
                      onClick={() => category === 'tools' ? purchaseTool(item) : purchaseGarden(item)}
                    >
                      {cost}g
                    </Button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
