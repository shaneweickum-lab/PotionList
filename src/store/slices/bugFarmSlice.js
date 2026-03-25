import { BREED_DEFS, BREED_TASKS_REQUIRED, FARMABLE_BUG_IDS } from '../../constants/bugFarm.js'

export function createBugFarmSlice(set, get) {
  return {
    // bugId → { m: N, f: N }
    bugFarm: {},
    // { bugId, taskId, taskText, progress, status: 'in_progress' | 'ready' } | null
    activeBreed: null,

    /** Convert 1 bug from regular inventory into the farm with a random gender */
    addBugToFarm: (bugId) => {
      const inv = get().inventory ?? {}
      if ((inv[bugId] ?? 0) < 1) return null
      const gender = Math.random() < 0.5 ? 'm' : 'f'
      get().removeFromInventory(bugId, 1)
      set(state => ({
        bugFarm: {
          ...state.bugFarm,
          [bugId]: {
            m: (state.bugFarm[bugId]?.m ?? 0) + (gender === 'm' ? 1 : 0),
            f: (state.bugFarm[bugId]?.f ?? 0) + (gender === 'f' ? 1 : 0),
          },
        },
      }))
      return gender
    },

    /** Begin a breed: deducts resources, records the tracking task */
    startBreed: ({ bugId, taskId, taskText }) => {
      const def = BREED_DEFS[bugId]
      if (!def) return { error: 'Unknown bug' }
      const level = get().level ?? 1
      if (level < def.levelReq) return { error: `Requires level ${def.levelReq}` }
      if (get().activeBreed) return { error: 'A breed is already in progress' }

      const farm = get().bugFarm[bugId] ?? { m: 0, f: 0 }
      if (farm.m < 1 || farm.f < 1) return { error: 'Need at least one ♂ and one ♀' }

      const inv = get().inventory ?? {}
      if ((inv['bug_feed'] ?? 0) < def.feedQty) return { error: `Need ${def.feedQty}× Bug Feed` }
      if ((inv[def.ingredient] ?? 0) < 1) return { error: `Need 1× ${def.ingredient}` }

      get().removeFromInventory('bug_feed', def.feedQty)
      get().removeFromInventory(def.ingredient, 1)

      set({ activeBreed: { bugId, taskId, taskText, progress: 0, status: 'in_progress' } })
      return { success: true }
    },

    /** Called by completeTask — increments progress if the completed task matches */
    advanceBreedProgress: (completedTaskId) => {
      const breed = get().activeBreed
      if (!breed || breed.status !== 'in_progress') return
      if (breed.taskId !== completedTaskId) return
      const next = breed.progress + 1
      set({
        activeBreed: {
          ...breed,
          progress: next,
          status: next >= BREED_TASKS_REQUIRED ? 'ready' : 'in_progress',
        },
      })
    },

    /** Produce the new bug and clear the active breed */
    hatchBreed: () => {
      const breed = get().activeBreed
      if (!breed || breed.status !== 'ready') return null
      const def = BREED_DEFS[breed.bugId]
      const gender = Math.random() < 0.5 ? 'm' : 'f'
      set(state => ({
        activeBreed: null,
        bugFarm: {
          ...state.bugFarm,
          [breed.bugId]: {
            m: (state.bugFarm[breed.bugId]?.m ?? 0) + (gender === 'm' ? 1 : 0),
            f: (state.bugFarm[breed.bugId]?.f ?? 0) + (gender === 'f' ? 1 : 0),
          },
        },
      }))
      if (def) get().awardXP(def.hatchXP)
      return { bugId: breed.bugId, gender }
    },

    cancelBreed: () => set({ activeBreed: null }),
  }
}
