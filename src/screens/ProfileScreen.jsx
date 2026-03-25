import { useState } from 'react'
import Tabs from '../components/ui/Tabs.jsx'
import StatsPanel from '../components/profile/StatsPanel.jsx'
import DailyOrders from '../components/profile/DailyOrders.jsx'
import SettingsPanel from '../components/profile/SettingsPanel.jsx'

const TABS = [
  { id: 'stats',    label: 'Stats'    },
  { id: 'orders',   label: 'Orders'   },
  { id: 'settings', label: 'Settings' },
]

export default function ProfileScreen() {
  const [tab, setTab] = useState('stats')
  return (
    <div>
      <Tabs tabs={TABS} active={tab} onChange={setTab} />
      {tab === 'stats'    && <StatsPanel />}
      {tab === 'orders'   && <DailyOrders />}
      {tab === 'settings' && <SettingsPanel />}
    </div>
  )
}
