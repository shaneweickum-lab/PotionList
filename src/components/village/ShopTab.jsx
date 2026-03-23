import { useState } from 'react'
import { useStore } from '../../store/index.js'
import { SHOP_ITEMS } from '../../constants/shop.js'
import { HERB_MAP } from '../../constants/herbs.js'
import { MUSHROOM_MAP } from '../../constants/mushrooms.js'
import { SEED_MAP } from '../../constants/seeds.js'
import { plotCost } from '../../lib/xpCalc.js'
import Button from '../ui/Button.jsx'
import { showToast } from '../ui/ToastNotification.jsx'
import styles from './ShopTab.module.css'

export default function ShopTab() {
  const [category, setCategory] = useState('seeds')
  const { gold, spendGold, addSeed, purchaseShopItem, isOwned, level, expandGarden, owned } = useStore()
  const hasHoe = isOwned('iron_hoe')

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
    const cost = hasHoe ? plotCost(level) : 200
    if (gold < cost) return showToast('Not enough gold', 'error')
    spendGold(cost)
    expandGarden(2)
    showToast('2 garden slots unlocked!', 'success')
  }

  const purchaseGarden = (item) => {
    if (item.id === 'garden_plot') return purchasePlot()
    if (isOwned(item.id)) return showToast('Already owned', 'error')
    if (gold < item.goldCost) return showToast('Not enough gold', 'error')
    spendGold(item.goldCost)
    purchaseShopItem(item.id)
    showToast(`${item.name} acquired!`, 'success')
  }

  const items = category === 'seeds' ? SHOP_ITEMS.seeds : category === 'tools' ? SHOP_ITEMS.tools : SHOP_ITEMS.garden

  return (
    <div className={styles.shop}>
      <div className={styles.categories}>
        {['seeds', 'tools', 'garden'].map(c => (
          <button key={c} className={`${styles.catBtn} ${category === c ? styles.catActive : ''}`} onClick={() => setCategory(c)}>
            {c.charAt(0).toUpperCase() + c.slice(1)}
          </button>
        ))}
      </div>

      <div className={styles.items}>
        {items.map(item => {
          const alreadyOwned = item.oneTime && isOwned(item.id)
          let cost = item.goldCost
          if (item.id === 'garden_plot') cost = hasHoe ? plotCost(level) : 200
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
                {alreadyOwned ? (
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
    </div>
  )
}
