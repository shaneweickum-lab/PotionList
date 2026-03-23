import { useStore } from '../../store/index.js'
import { HERBS } from '../../constants/herbs.js'
import { MUSHROOMS } from '../../constants/mushrooms.js'
import { BUGS } from '../../constants/bugs.js'
import Badge from '../ui/Badge.jsx'
import styles from './Codex.module.css'

export default function Codex() {
  const { discovered } = useStore()
  const disc = discovered ?? { herbs: [], mushrooms: [], bugs: [] }

  const Section = ({ title, items, discList }) => (
    <div className={styles.section}>
      <h4 className={styles.sectionTitle}>{title} <span className={styles.count}>{discList.length}/{items.length}</span></h4>
      <div className={styles.grid}>
        {items.map(item => {
          const found = discList.includes(item.id)
          return (
            <div key={item.id} className={`${styles.entry} ${found ? '' : styles.locked}`}>
              <div className={styles.dot} style={{ background: found ? item.color : '#3a3530' }} />
              <div className={styles.entryInfo}>
                <div className={styles.entryName}>
                  {found ? item.name : '???'}
                </div>
                {found && <Badge rarity={item.rarity} />}
                {found && <p className={styles.lore}>{item.lore}</p>}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )

  return (
    <div className={styles.codex}>
      <Section title="Herbs" items={HERBS} discList={disc.herbs ?? []} />
      <Section title="Mushrooms" items={MUSHROOMS} discList={disc.mushrooms ?? []} />
      <Section title="Bugs" items={BUGS} discList={disc.bugs ?? []} />
    </div>
  )
}
