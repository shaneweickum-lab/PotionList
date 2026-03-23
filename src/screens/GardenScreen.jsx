import { useState } from 'react'
import Tabs from '../components/ui/Tabs.jsx'
import GardenScene from '../components/garden/GardenScene.jsx'
import GardenStash from '../components/garden/GardenStash.jsx'
import Codex from '../components/garden/Codex.jsx'
import { useStore } from '../store/index.js'
import styles from './GardenScreen.module.css'

const TABS = [
  { id: 'plots', label: 'Plots' },
  { id: 'stash', label: 'Stash' },
  { id: 'codex', label: 'Codex' },
]

export default function GardenScreen() {
  const [tab, setTab] = useState('plots')
  const { growthXP } = useStore()

  return (
    <div className={styles.screen}>
      <div className={styles.growthBar}>
        <span className={styles.growthLabel}>Growth XP:</span>
        <span className={styles.growthValue}>{growthXP}</span>
      </div>
      <Tabs tabs={TABS} active={tab} onChange={setTab} />
      {tab === 'plots' && <GardenScene />}
      {tab === 'stash' && <GardenStash />}
      {tab === 'codex' && <Codex />}
    </div>
  )
}
