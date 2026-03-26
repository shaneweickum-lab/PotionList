import { useState } from 'react'
import { useStore } from '../../store/index.js'
import { HERBS } from '../../constants/herbs.js'
import { MUSHROOMS } from '../../constants/mushrooms.js'
import { BUGS } from '../../constants/bugs.js'
import { LORE } from '../../constants/lore.js'
import { HIDDEN_LORE, ALL_HIDDEN_LORE_IDS } from '../../constants/hiddenLore.js'
import Badge from '../ui/Badge.jsx'
import styles from './Codex.module.css'


const CODEX_TABS = [
  { id: 'botany', label: 'Botany' },
  { id: 'mycology', label: 'Mycology' },
  { id: 'etymology', label: 'Etymology' },
  { id: 'lore', label: 'Lore' },
]

function ItemSection({ title, items, discList }) {
  return (
    <div className={styles.section}>
      <h4 className={styles.sectionTitle}>
        {title} <span className={styles.count}>{discList.length}/{items.length}</span>
      </h4>
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
}

function LoreSection({ discoveredLore }) {
  const discovered = discoveredLore ?? []
  const foundCount = discovered.length
  const total = ALL_HIDDEN_LORE_IDS.length

  return (
    <>
      <div className={styles.section}>
        <div className={styles.grid}>
          {LORE.map(entry => (
            <div key={entry.id} className={styles.loreEntry}>
              <div className={styles.loreEntryTitle}>{entry.title}</div>
              <p className={styles.lore}>{entry.text}</p>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>
          Field Studies <span className={styles.count}>{foundCount}/{total}</span>
        </h4>
        <p className={styles.fieldStudiesHint}>Found by chance when completing tasks, harvesting, or collecting from Brom.</p>
        <div className={styles.grid}>
          {ALL_HIDDEN_LORE_IDS.map(id => {
            const found = discovered.includes(id)
            const entry = HIDDEN_LORE[id]
            return (
              <div key={id} className={`${styles.loreEntry} ${found ? '' : styles.locked}`}>
                {found ? (
                  <>
                    <div className={styles.loreEntryTitleRow}>
                      <div className={styles.loreEntryTitle}>{entry.name}</div>
                      <Badge rarity="collectible" label="Collectible" />
                    </div>
                    <p className={styles.lore}>{entry.lore}</p>
                  </>
                ) : (
                  <div className={styles.loreEntryTitle}>???</div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}

export default function Codex() {
  const [tab, setTab] = useState('botany')
  const { discovered, discoveredLore } = useStore()
  const disc = discovered ?? { herbs: [], mushrooms: [], bugs: [] }

  return (
    <div className={styles.codex}>
      <div className={styles.innerTabs}>
        {CODEX_TABS.map(t => (
          <button
            key={t.id}
            className={`${styles.innerTab} ${tab === t.id ? styles.innerTabActive : ''}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'botany'    && <ItemSection title="Herbs"     items={HERBS}     discList={disc.herbs     ?? []} />}
      {tab === 'mycology'  && <ItemSection title="Mushrooms" items={MUSHROOMS} discList={disc.mushrooms ?? []} />}
      {tab === 'etymology' && <ItemSection title="Bugs"      items={BUGS}      discList={disc.bugs      ?? []} />}
      {tab === 'lore'      && <LoreSection discoveredLore={discoveredLore} />}
    </div>
  )
}
