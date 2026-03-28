import { useState } from 'react'
import Tabs from '../components/ui/Tabs.jsx'
import StatsPanel from '../components/profile/StatsPanel.jsx'
import SettingsPanel from '../components/profile/SettingsPanel.jsx'
import SkillTree from '../components/profile/SkillTree.jsx'

const TABS = [
  { id: 'stats',    label: 'Stats'    },
  { id: 'skills',   label: 'Skills'   },
  { id: 'settings', label: 'Settings' },
]

export default function ProfileScreen() {
  const [tab, setTab] = useState('stats')
  return (
    <div>
      <Tabs tabs={TABS} active={tab} onChange={setTab} />
      {tab === 'stats'    && <StatsPanel />}
      {tab === 'skills'   && <SkillTree />}
      {tab === 'settings' && <SettingsPanel />}
    </div>
  )
}
