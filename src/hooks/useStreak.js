import { useEffect, useRef } from 'react'
import { useStore } from '../store/index.js'
import { DAILY_GIFTS, MILESTONES } from '../constants/streaks.js'

export function useStreak() {
  const { streak, pendingStreakDay, milestonesClaimed } = useStore()
  const processed = useRef(null)

  useEffect(() => {
    if (!pendingStreakDay || processed.current === pendingStreakDay) return
    processed.current = pendingStreakDay

    const state = useStore.getState()

    // Daily gift (days 1-14)
    const gift = DAILY_GIFTS.find(g => g.day === pendingStreakDay)
    if (gift) {
      applyGift(gift, state)
      useStore.setState({ streakGiftToShow: gift, pendingStreakDay: null })
      return
    }

    // Milestone check
    const milestone = MILESTONES.find(m =>
      m.day === pendingStreakDay && !state.milestonesClaimed.includes(m.day)
    )
    if (milestone) {
      applyMilestone(milestone, state)
      useStore.setState({ streakMilestoneToShow: milestone, pendingStreakDay: null })
      return
    }

    // No gift, no milestone — show plain streak congratulations
    useStore.setState({ streakContinuedToShow: pendingStreakDay, pendingStreakDay: null })
  }, [pendingStreakDay])
}

function applyGift(gift, state) {
  if (gift.gold) state.addGold(gift.gold)
  if (gift.amount) state.addGold(gift.amount)
  if (gift.type === 'gold') state.addGold(gift.amount)
  if (gift.ids) {
    gift.ids.forEach(id => {
      if (id.includes('_seed') || id.includes('_spore') || id.includes('_cutting')) {
        state.addSeed(id, 1)
      } else {
        // ore
        useStore.setState(s => ({
          oreInventory: { ...s.oreInventory, [id]: (s.oreInventory[id] ?? 0) + 1 },
        }))
      }
    })
  }
}

function applyMilestone(milestone, state) {
  const r = milestone.reward
  if (r.gold) state.addGold(r.gold)
  if (r.seeds) r.seeds.forEach(id => state.addSeed(id, 1))
  if (r.ores) {
    r.ores.forEach(id => {
      useStore.setState(s => ({
        oreInventory: { ...s.oreInventory, [id]: (s.oreInventory[id] ?? 0) + 1 },
      }))
    })
  }
  state.claimMilestone(milestone.day)
  state.addTitle(milestone.title)
}
