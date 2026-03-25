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
import SplashScreen from './screens/SplashScreen.jsx'
import LandingScreen from './screens/LandingScreen.jsx'
import ProfileSetupScreen from './screens/ProfileSetupScreen.jsx'
import IAPModal from './components/modals/IAPModal.jsx'
import StreakModal from './components/modals/StreakModal.jsx'
import ToastContainer from './components/ui/ToastNotification.jsx'

// Full game shell — state persisted to localStorage via Zustand persist
function AuthenticatedApp() {
  const [screen, setScreen] = useState('tasks')
  const [showIAP, setShowIAP] = useState(false)

  useTimers()
  useStreak()
  useDailyOrders()
  usePush()

  const { streakGiftToShow, streakMilestoneToShow, streakContinuedToShow } = useStore()

  const dismissStreak = () => {
    useStore.setState({ streakGiftToShow: null, streakMilestoneToShow: null, streakContinuedToShow: null })
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
      {(streakGiftToShow || streakMilestoneToShow || streakContinuedToShow) && (
        <StreakModal
          gift={streakGiftToShow}
          milestone={streakMilestoneToShow}
          continued={streakContinuedToShow}
          onClose={dismissStreak}
        />
      )}
    </div>
  )
}

export default function App() {
  useAuth()

  const [splashDone, setSplashDone] = useState(false)
  const { authReady, username, userId } = useStore()

  if (!splashDone) {
    return <SplashScreen onEnter={() => setSplashDone(true)} />
  }

  if (!authReady) {
    return (
      <div className="app-shell" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: 32 }}>⚗️</span>
      </div>
    )
  }

  // Logged in but profile setup not yet complete
  if (userId && !username) {
    return (
      <div className="app-shell">
        <div className="screen-area" style={{ paddingBottom: 0 }}>
          <ProfileSetupScreen />
        </div>
      </div>
    )
  }

  if (!userId) {
    return (
      <div className="app-shell">
        <div className="screen-area" style={{ paddingBottom: 0 }}>
          <LandingScreen />
        </div>
      </div>
    )
  }

  return <AuthenticatedApp />
}
