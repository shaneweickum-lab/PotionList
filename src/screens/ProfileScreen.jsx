import { useState } from 'react'
import Tabs from '../components/ui/Tabs.jsx'
import StatsPanel from '../components/profile/StatsPanel.jsx'
import AuthPanel from '../components/profile/AuthPanel.jsx'
import DailyOrders from '../components/profile/DailyOrders.jsx'

const TABS = [
  { id: 'stats', label: 'Stats' },
  { id: 'orders', label: 'Orders' },
  { id: 'account', label: 'Account' },
]

export default function ProfileScreen() {
  const [tab, setTab] = useState('stats')
  return (
    <div>
      <Tabs tabs={TABS} active={tab} onChange={setTab} />
      {tab === 'stats' && <StatsPanel />}
      {tab === 'orders' && <DailyOrders />}
      {tab === 'account' && <AuthPanel />}
    </div>
  )
}
