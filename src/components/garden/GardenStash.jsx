import { useStore } from '../../store/index.js'
import { HERB_MAP } from '../../constants/herbs.js'
import { MUSHROOM_MAP } from '../../constants/mushrooms.js'
import { BUG_MAP } from '../../constants/bugs.js'
import { SEED_MAP } from '../../constants/seeds.js'
import Badge from '../ui/Badge.jsx'
import styles from './GardenStash.module.css'

export default function GardenStash() {
  const { inventory, seeds } = useStore()

  const herbs = Object.entries(inventory ?? {}).filter(([id, qty]) => qty > 0 && HERB_MAP[id])
  const mushrooms = Object.entries(inventory ?? {}).filter(([id, qty]) => qty > 0 && MUSHROOM_MAP[id])
  const bugs = Object.entries(inventory ?? {}).filter(([id, qty]) => qty > 0 && BUG_MAP[id])
  const ownedSeeds = Object.entries(seeds ?? {}).filter(([_, qty]) => qty > 0)

  const Section = ({ title, items, getItem }) => items.length === 0 ? null : (
    <div className={styles.section}>
      <h4 className={styles.sectionTitle}>{title}</h4>
      <div className={styles.itemGrid}>
        {items.map(([id, qty]) => {
          const item = getItem(id)
          return (
            <div key={id} className={styles.item}>
              <div className={styles.itemColor} style={{ background: item?.color ?? '#666' }} />
              <div className={styles.itemInfo}>
                <span className={styles.itemName}>{item?.name ?? id}</span>
                <Badge rarity={item?.rarity ?? 'common'} />
              </div>
              <span className={styles.qty}>×{qty}</span>
            </div>
          )
        })}
      </div>
    </div>
  )

  const hasAnything = herbs.length + mushrooms.length + bugs.length + ownedSeeds.length > 0

  return (
    <div className={styles.stash}>
      {!hasAnything && (
        <div className={styles.empty}>
          <p className="lore">The stash is empty. Harvest from the garden, or complete tasks to find seeds.</p>
        </div>
      )}
      <Section title="Seeds" items={ownedSeeds} getItem={(id) => SEED_MAP[id]} />
      <Section title="Herbs" items={herbs} getItem={(id) => HERB_MAP[id]} />
      <Section title="Mushrooms" items={mushrooms} getItem={(id) => MUSHROOM_MAP[id]} />
      <Section title="Bugs" items={bugs} getItem={(id) => BUG_MAP[id]} />
    </div>
  )
}
