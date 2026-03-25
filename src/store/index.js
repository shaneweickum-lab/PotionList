import { create } from 'zustand'
import { persist, createJSONStorage, subscribeWithSelector } from 'zustand/middleware'
import { createPlayerSlice } from './slices/playerSlice.js'
import { createTodoSlice } from './slices/todoSlice.js'
import { createGardenSlice } from './slices/gardenSlice.js'
import { createBrewSlice } from './slices/brewSlice.js'
import { createMineSlice } from './slices/mineSlice.js'
import { createSmithySlice } from './slices/smithySlice.js'
import { createMarketSlice } from './slices/marketSlice.js'
import { createOrdersSlice } from './slices/ordersSlice.js'
import { createCommunitySlice } from './slices/communitySlice.js'
import { createInventorySlice } from './slices/inventorySlice.js'
import { createIAPSlice } from './slices/iapSlice.js'
import { createQuestSlice } from './slices/questSlice.js'
import { createBugFarmSlice } from './slices/bugFarmSlice.js'
import { createSkillSlice } from './slices/skillSlice.js'

export const useStore = create(
  subscribeWithSelector(
    persist(
      (set, get) => ({
        ...createPlayerSlice(set, get),
        ...createTodoSlice(set, get),
        ...createGardenSlice(set, get),
        ...createBrewSlice(set, get),
        ...createMineSlice(set, get),
        ...createSmithySlice(set, get),
        ...createMarketSlice(set, get),
        ...createOrdersSlice(set, get),
        ...createCommunitySlice(set, get),
        ...createInventorySlice(set, get),
        ...createIAPSlice(set, get),
        ...createQuestSlice(set, get),
        ...createBugFarmSlice(set, get),
        ...createSkillSlice(set, get),

        // Pending UI state (not persisted)
        streakGiftToShow: null,
        streakMilestoneToShow: null,
        streakContinuedToShow: null,
        pendingStreakDay: null,

        // Cross-slice: apply time reduction to all timed systems
        applyTimeReduction: (reductionMs) => {
          set(state => ({
            brewing: state.brewing.map(b => ({
              ...b,
              finishAt: Math.max(Date.now(), b.finishAt - reductionMs),
            })),
            mineTrips: state.mineTrips.map(t => t.completed ? t : ({
              ...t,
              finishAt: Math.max(Date.now(), t.finishAt - reductionMs),
            })),
            smithing: state.smithing.map(s => ({
              ...s,
              finishAt: Math.max(Date.now(), s.finishAt - reductionMs),
            })),
          }))
        },

        // Cross-slice: streak check called from completeTask
        checkStreak: () => {
          const state = get()
          const today = new Date().toISOString().slice(0, 10)
          if (state.lastTaskDay === today) return

          const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)
          const wasYesterday = state.lastTaskDay === yesterday
          const newStreak = wasYesterday ? state.streak + 1 : 1
          state.setStreak(newStreak)
          state.setLastTaskDay(today)
          set({ pendingStreakDay: newStreak })
        },
      }),
      {
        name: 'potionlist-v1',
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => {
          const {
            marketListings, marketLoading, marketError,
            iapLoading, iapError, lastCompletionReward,
            streakGiftToShow, streakMilestoneToShow, pendingStreakDay,
          } = state
          // Return everything except transient state
          return Object.fromEntries(
            Object.entries(state).filter(([key]) => ![
              'marketListings', 'marketLoading', 'marketError',
              'iapLoading', 'iapError', 'lastCompletionReward',
              'streakGiftToShow', 'streakMilestoneToShow', 'streakContinuedToShow', 'pendingStreakDay',
              'itemRequests', 'requestsLoading',
              'communityOrderProgress', 'communityLoading',
            ].includes(key))
          )
        },
      }
    )
  )
)
