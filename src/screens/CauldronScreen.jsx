import { useState } from 'react'
import Tabs from '../components/ui/Tabs.jsx'
import BrewQueue from '../components/cauldron/BrewQueue.jsx'
import RecipeBook from '../components/cauldron/RecipeBook.jsx'
import CauldronUpgrade from '../components/cauldron/CauldronUpgrade.jsx'
import { useStore } from '../store/index.js'
import styles from './CauldronScreen.module.css'

const TABS = [
  { id: 'queue', label: 'Active' },
  { id: 'recipes', label: 'Recipes' },
  { id: 'upgrade', label: 'Cauldron' },
]

export default function CauldronScreen() {
  const [tab, setTab] = useState('recipes')
  const { brewing, potionInventory } = useStore()
  const activeBrewing = brewing?.filter(b => b.finishAt > Date.now()).length ?? 0
  const totalPotions = Object.values(potionInventory ?? {}).reduce((s, v) => s + v, 0)

  return (
    <div className={styles.screen}>
      <div className={styles.bar}>
        <span className={styles.stat}>
          <span className={styles.statNum}>{activeBrewing}</span> brewing
        </span>
        <span className={styles.stat}>
          <span className={styles.statNum}>{totalPotions}</span> potions
        </span>
      </div>
      <Tabs tabs={TABS} active={tab} onChange={setTab} />
      {tab === 'queue' && <BrewQueue />}
      {tab === 'recipes' && <RecipeBook />}
      {tab === 'upgrade' && <CauldronUpgrade />}
    </div>
  )
}
