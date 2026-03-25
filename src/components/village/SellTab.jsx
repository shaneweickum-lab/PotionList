import { useState, useMemo } from 'react'
import { useStore } from '../../store/index.js'
import { showToast } from '../ui/ToastNotification.jsx'
import { HERB_MAP } from '../../constants/herbs.js'
import { MUSHROOM_MAP } from '../../constants/mushrooms.js'
import { SEED_MAP } from '../../constants/seeds.js'
import { POTION_MAP } from '../../constants/potions.js'
import { BUG_MAP } from '../../constants/bugs.js'
import { ORE_MAP, INGOT_MAP } from '../../constants/ores.js'
import {
  HERB_SELL, MUSHROOM_SELL, SEED_SELL, BUG_SELL, POTION_SELL,
  ORE_SELL, INGOT_SELL, USABLE_BUG_IDS,
} from '../../constants/sellPrices.js'
import styles from './SellTab.module.css'

const FILTERS = [
  { id: 'all',       label: 'All' },
  { id: 'seeds',     label: 'Seeds' },
  { id: 'herbs',     label: 'Herbs' },
  { id: 'mushrooms', label: 'Mushrooms' },
  { id: 'bugs',      label: 'Bugs' },
  { id: 'potions',   label: 'Potions' },
  { id: 'ores',      label: 'Ores' },
]

const RARITY_ORDER = { common: 0, uncommon: 1, rare: 2, epic: 3 }

function buildItemList(seeds, inventory, potionInventory, oreInventory, ingotInventory) {
  const items = []

  // Seeds
  for (const [id, qty] of Object.entries(seeds ?? {})) {
    if (!qty) continue
    const def = SEED_MAP[id]
    if (!def) continue
    items.push({
      key: id, type: 'seed', id, qty,
      name: def.name,
      color: '#a8c880',
      rarity: 'common',
      price: SEED_SELL[id] ?? 8,
      sortOrder: 0,
      rarityRank: RARITY_ORDER['common'],
    })
  }

  // Herbs
  for (const [id, qty] of Object.entries(inventory ?? {})) {
    if (!qty) continue
    const def = HERB_MAP[id]
    if (!def) continue
    items.push({
      key: id, type: 'herb', id, qty,
      name: def.name, color: def.color, rarity: def.rarity,
      price: HERB_SELL[id] ?? 5,
      sortOrder: 1,
      rarityRank: RARITY_ORDER[def.rarity] ?? 0,
    })
  }

  // Mushrooms
  for (const [id, qty] of Object.entries(inventory ?? {})) {
    if (!qty) continue
    const def = MUSHROOM_MAP[id]
    if (!def) continue
    items.push({
      key: `m_${id}`, type: 'mushroom', id, qty,
      name: def.name, color: def.color, rarity: def.rarity,
      price: MUSHROOM_SELL[id] ?? 6,
      sortOrder: 2,
      rarityRank: RARITY_ORDER[def.rarity] ?? 0,
    })
  }

  // Usable bugs
  for (const [id, qty] of Object.entries(inventory ?? {})) {
    if (!qty || !USABLE_BUG_IDS.has(id)) continue
    const def = BUG_MAP[id]
    if (!def) continue
    items.push({
      key: `b_${id}`, type: 'bug', id, qty,
      name: def.name, color: def.color, rarity: def.rarity,
      price: BUG_SELL[id] ?? 12,
      sortOrder: 3,
      rarityRank: RARITY_ORDER[def.rarity] ?? 0,
    })
  }

  // Potions
  for (const [id, qty] of Object.entries(potionInventory ?? {})) {
    if (!qty) continue
    const def = POTION_MAP[id]
    if (!def) continue
    items.push({
      key: `p_${id}`, type: 'potion', id, qty,
      name: def.name, color: def.color, rarity: 'common',
      price: POTION_SELL[id] ?? 10,
      sortOrder: 4,
      rarityRank: 0,
    })
  }

  // Ores
  for (const [id, qty] of Object.entries(oreInventory ?? {})) {
    if (!qty) continue
    const def = ORE_MAP[id]
    if (!def) continue
    items.push({
      key: `o_${id}`, type: 'ore', id, qty,
      name: def.name, color: def.color, rarity: 'common',
      price: ORE_SELL[id] ?? 8,
      sortOrder: 5,
      rarityRank: def.tier ?? 0,
    })
  }

  // Ingots
  for (const [id, qty] of Object.entries(ingotInventory ?? {})) {
    if (!qty) continue
    const def = INGOT_MAP[id]
    if (!def) continue
    items.push({
      key: `i_${id}`, type: 'ore', id, qty,
      name: def.name, color: def.color, rarity: 'common',
      price: INGOT_SELL[id] ?? 20,
      sortOrder: 5,
      rarityRank: 10,  // ingots sort after ores
    })
  }

  return items.sort((a, b) => a.sortOrder - b.sortOrder || b.rarityRank - a.rarityRank)
}

function sellAction(type, id, qty, store) {
  const { addGold, removeSeed, removeFromInventory, removePotion, removeOre, removeIngot } = store
  addGold(qty)
  switch (type) {
    case 'seed':     removeSeed(id, qty); break
    case 'herb':
    case 'mushroom':
    case 'bug':      removeFromInventory(id, qty); break
    case 'potion':   removePotion(id, qty); break
    case 'ore':      {
      const isIngot = id.endsWith('_ingot')
      if (isIngot) removeIngot(id, qty)
      else removeOre(id, qty)
      break
    }
  }
}

export default function SellTab() {
  const [filter, setFilter] = useState('all')
  const store = useStore()
  const { inventory, seeds, potionInventory, oreInventory, ingotInventory } = store

  const all = useMemo(
    () => buildItemList(seeds, inventory, potionInventory, oreInventory, ingotInventory),
    [seeds, inventory, potionInventory, oreInventory, ingotInventory]
  )

  const TYPE_MAP = {
    seeds: 'seed', herbs: 'herb', mushrooms: 'mushroom',
    bugs: 'bug', potions: 'potion', ores: 'ore',
  }

  const visible = filter === 'all' ? all : all.filter(i => i.type === TYPE_MAP[filter])

  const handleSell = (item, qty) => {
    const gold = item.price * qty
    sellAction(item.type, item.id, qty, store)
    showToast(`Sold ${qty}× ${item.name} · +${gold}g`, 'gold')
  }

  return (
    <div className={styles.sell}>
      {/* Filter strip */}
      <div className={styles.filters}>
        {FILTERS.map(f => (
          <button
            key={f.id}
            className={`${styles.filterBtn} ${filter === f.id ? styles.filterActive : ''}`}
            onClick={() => setFilter(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Item list */}
      <div className={styles.list}>
        {visible.length === 0 && (
          <div className={styles.empty}>
            <p className={styles.emptyTitle}>Nothing to sell.</p>
            <p className="lore">Gather herbs, brew potions, or mine ore first.</p>
          </div>
        )}

        {visible.map(item => (
          <div key={item.key} className={styles.row}>
            {/* Color swatch + name */}
            <div className={styles.swatch} style={{ background: item.color }} />
            <div className={styles.info}>
              <span className={styles.name}>{item.name}</span>
              <div className={styles.meta}>
                {item.rarity !== 'common' && (
                  <span className={`${styles.rarityBadge} ${styles[`rarity_${item.rarity}`]}`}>
                    {item.rarity}
                  </span>
                )}
                <span className={styles.price}>{item.price}g each</span>
              </div>
            </div>
            <span className={styles.qty}>×{item.qty}</span>
            <div className={styles.actions}>
              <button
                className={styles.sellBtn}
                onClick={() => handleSell(item, 1)}
                disabled={item.qty < 1}
              >
                Sell 1
              </button>
              {item.qty > 1 && (
                <button
                  className={`${styles.sellBtn} ${styles.sellAll}`}
                  onClick={() => handleSell(item, item.qty)}
                >
                  All ({item.price * item.qty}g)
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
