import { useState } from 'react'
import { useAuth } from './hooks/useAuth.js'
import { useTimers } from './hooks/useTimers.js'
import { useStreak } from './hooks/useStreak.js'
import { useDailyOrders } from './hooks/useDailyOrders.js'
import { usePush } from './hooks/usePush.js'
import { useStore } from './store/index.js'
import Header from './components/layout/Header.jsx'
import BottomNav from './components/layout/BottomNav.jsx'
import TasksScreen from './screens/TasksScreen.jsx'
import GardenScreen from './screens/GardenScreen.jsx'
import CauldronScreen from './screens/CauldronScreen.jsx'
import VillageScreen from './screens/VillageScreen.jsx'
import ProfileScreen from './screens/ProfileScreen.jsx'
import IAPModal from './components/modals/IAPModal.jsx'
import StreakModal from './components/modals/StreakModal.jsx'
import ToastContainer from './components/ui/ToastNotification.jsx'

export default function App() {
  const [screen, setScreen] = useState('tasks')
  const [showIAP, setShowIAP] = useState(false)

  // Global hooks
  useAuth()
  useTimers()
  useStreak()
  useDailyOrders()
  usePush()

  const { streakGiftToShow, streakMilestoneToShow } = useStore()

  const dismissStreak = () => {
    useStore.setState({ streakGiftToShow: null, streakMilestoneToShow: null })
  }

  return (
    <div className="app-shell">
      <Header onOpenIAP={() => setShowIAP(true)} />
      <div className="screen-area">
        {screen === 'tasks' && <TasksScreen />}
        {screen === 'garden' && <GardenScreen />}
        {screen === 'cauldron' && <CauldronScreen />}
        {screen === 'village' && <VillageScreen />}
        {screen === 'profile' && <ProfileScreen />}
      </div>
      <BottomNav active={screen} onChange={setScreen} />
      <ToastContainer />

      {showIAP && <IAPModal onClose={() => setShowIAP(false)} />}
      {(streakGiftToShow || streakMilestoneToShow) && (
        <StreakModal
          gift={streakGiftToShow}
          milestone={streakMilestoneToShow}
          onClose={dismissStreak}
        />
      )}
    </div>
  )
}
