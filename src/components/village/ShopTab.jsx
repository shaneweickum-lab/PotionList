import { useState } from 'react'
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

export default function ShopTab() {
  const [category, setCategory] = useState('seeds')
  const { gold, spendGold, addSeed, addToInventory, inventory, purchaseShopItem, isOwned,
          expandGarden, gardenSlotCount, incrementPlotsBought, getNextPlotCost } = useStore()
  const MAX_PLOTS = 20

  const purchaseSeed = (item) => {
    if (gold < item.goldCost) return showToast('Not enough gold', 'error')
    spendGold(item.goldCost)
    addSeed(item.id, 1)
    showToast(`Purchased ${item.name}!`, 'success')
  }

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

  const items = category === 'seeds' ? SHOP_ITEMS.seeds
    : category === 'tools'  ? SHOP_ITEMS.tools
    : SHOP_ITEMS.garden

  return (
    <div className={styles.shop}>
      <div className={styles.categories}>
        {TABS.map(c => (
          <button key={c} className={`${styles.catBtn} ${category === c ? styles.catActive : ''}`} onClick={() => setCategory(c)}>
            {c.charAt(0).toUpperCase() + c.slice(1)}
          </button>
        ))}
      </div>

      {category === 'sell' && <SellTab />}

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

      {category !== 'sell' && category !== 'farm' && (
        <div className={styles.items}>
          {items.map(item => {
            const alreadyOwned = item.oneTime && isOwned(item.id)
            const atMaxPlots = item.id === 'garden_plot' && gardenSlotCount >= MAX_PLOTS
            let cost = item.goldCost
            if (item.id === 'garden_plot') cost = getNextPlotCost()
            const seedDef = SEED_MAP[item.id]
            const yieldItem = seedDef ? (HERB_MAP[seedDef.yields] ?? MUSHROOM_MAP[seedDef.yields]) : null

            return (
              <div key={item.id} className={`${styles.item} ${alreadyOwned ? styles.owned : ''}`}>
                <div className={styles.itemInfo}>
                  <div className={styles.itemName}>{item.name}</div>
                  {yieldItem && <div className={styles.itemDesc} style={{ color: yieldItem.color }}>Grows {yieldItem.name}</div>}
                  {!yieldItem && <div className={styles.itemDesc}>{item.description}</div>}
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
                      onClick={() => {
                        if (category === 'seeds') purchaseSeed(item)
                        else if (category === 'tools') purchaseTool(item)
                        else purchaseGarden(item)
                      }}
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
