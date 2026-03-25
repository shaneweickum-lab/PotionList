import { useState } from 'react'
import Tabs from '../components/ui/Tabs.jsx'
import ShopTab from '../components/village/ShopTab.jsx'
import MineTab from '../components/village/MineTab.jsx'
import SmithyTab from '../components/village/SmithyTab.jsx'
import CommunityTab from '../components/village/CommunityTab.jsx'

const TABS = [
  { id: 'shop',      label: 'Shop' },
  { id: 'mine',      label: 'Mine' },
  { id: 'smithy',    label: 'Smithy' },
  { id: 'community', label: 'Community' },
]

export default function VillageScreen() {
  const [tab, setTab] = useState('shop')
  return (
    <div>
      <Tabs tabs={TABS} active={tab} onChange={setTab} />
      {tab === 'shop'      && <ShopTab />}
      {tab === 'mine'      && <MineTab />}
      {tab === 'smithy'    && <SmithyTab />}
      {tab === 'community' && <CommunityTab />}
    </div>
  )
}
