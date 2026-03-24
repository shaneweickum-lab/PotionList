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
  const { garden, isSlotReady } = useStore()

  const growing = garden.filter(s => s.seedId && !isSlotReady(s.slotId)).length
  const ready   = garden.filter(s => s.seedId && isSlotReady(s.slotId)).length

  return (
    <div className={styles.screen}>
      <div className={styles.growthBar}>
        {ready > 0
          ? <><span className={styles.growthLabel}>Ready to harvest</span><span className={styles.growthReady}>{ready} plot{ready !== 1 ? 's' : ''}</span></>
          : growing > 0
            ? <><span className={styles.growthLabel}>Growing</span><span className={styles.growthValue}>{growing} plot{growing !== 1 ? 's' : ''} · complete tasks to speed up</span></>
            : <span className={styles.growthLabel}>No plants growing — visit the Plots tab</span>
        }
      </div>
      <Tabs tabs={TABS} active={tab} onChange={setTab} />
      {tab === 'plots' && <GardenScene />}
      {tab === 'stash' && <GardenStash />}
      {tab === 'codex' && <Codex />}
    </div>
  )
}
