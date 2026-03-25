import { rollChestLoot } from '../../lib/chestLoot.js'

let nextQuestId = Date.now()

export function createQuestSlice(set, get) {
  return {
    quests: [],

    addQuest: ({ title, steps }) => {
      const id = String(nextQuestId++)
      set(state => ({
        quests: [...state.quests, {
          id,
          title: title.trim(),
          steps: steps.map((text, i) => ({ id: `${id}_s${i}`, text: text.trim(), done: false })),
          createdAt: Date.now(),
          completedAt: null,
          chestOpened: false,
          loot: null,
        }],
      }))
    },

    toggleQuestStep: (questId, stepId) => {
      set(state => ({
        quests: state.quests.map(q => {
          if (q.id !== questId) return q
          const steps = q.steps.map(s => s.id === stepId ? { ...s, done: !s.done } : s)
          const allDone = steps.every(s => s.done)
          // Set completedAt when all done; clear it if a step is un-checked
          const completedAt = allDone ? (q.completedAt ?? Date.now()) : null
          return { ...q, steps, completedAt }
        }),
      }))
    },

    openQuestChest: (questId) => {
      const quest = get().quests.find(q => q.id === questId)
      if (!quest?.completedAt || quest.chestOpened) return null
      const loot = rollChestLoot(get().level ?? 1)
      if (loot.gold) get().addGold(loot.gold)
      if (loot.seed) get().addSeed(loot.seed, 1)
      if (loot.ore) {
        set(state => ({
          oreInventory: { ...state.oreInventory, [loot.ore]: (state.oreInventory[loot.ore] ?? 0) + 1 },
          quests: state.quests.map(q => q.id === questId ? { ...q, chestOpened: true, loot } : q),
        }))
      } else {
        set(state => ({
          quests: state.quests.map(q => q.id === questId ? { ...q, chestOpened: true, loot } : q),
        }))
      }
      return loot
    },

    deleteQuest: (questId) => {
      set(state => ({ quests: state.quests.filter(q => q.id !== questId) }))
    },
  }
}
