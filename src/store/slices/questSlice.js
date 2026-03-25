import { rollChestLoot } from '../../lib/chestLoot.js'

const SHOPPING_ITEM_XP = 3
const HEALTHY_ITEM_XP  = 8

let nextQuestId = Date.now()

function nextMidnight() {
  const d = new Date()
  d.setHours(24, 0, 0, 0)
  return d.getTime()
}

export function createQuestSlice(set, get) {
  return {
    quests: [],

    addQuest: ({ title, category, recurrence, steps, shoppingItems }) => {
      const id = String(nextQuestId++)
      set(state => ({
        quests: [...state.quests, {
          id,
          title: title.trim(),
          category: category ?? null,
          recurrence: recurrence ?? 'none',
          steps: steps.map((text, i) => ({ id: `${id}_s${i}`, text: text.trim(), done: false })),
          shoppingItems: shoppingItems?.length
            ? shoppingItems.map((item, i) => ({ id: `${id}_g${i}`, name: item.name, done: false, healthy: item.healthy }))
            : [],
          createdAt: Date.now(),
          completedAt: null,
          chestOpened: false,
          loot: null,
          nextDueAt: null,
        }],
      }))
    },

    toggleQuestStep: (questId, stepId) => {
      set(state => ({
        quests: state.quests.map(q => {
          if (q.id !== questId) return q
          const steps = q.steps.map(s => s.id === stepId ? { ...s, done: !s.done } : s)
          const allDone = steps.every(s => s.done)
          const completedAt = allDone ? (q.completedAt ?? Date.now()) : null
          return { ...q, steps, completedAt }
        }),
      }))
    },

    toggleShoppingItem: (questId, itemId) => {
      const quest = get().quests.find(q => q.id === questId)
      const item = quest?.shoppingItems?.find(s => s.id === itemId)
      if (!item) return null
      const willDone = !item.done
      set(state => ({
        quests: state.quests.map(q =>
          q.id !== questId ? q : {
            ...q,
            shoppingItems: q.shoppingItems.map(s =>
              s.id === itemId ? { ...s, done: !s.done } : s
            ),
          }
        ),
      }))
      if (willDone) {
        const xp = item.healthy ? HEALTHY_ITEM_XP : SHOPPING_ITEM_XP
        get().awardXP(xp)
        return { xp, healthy: item.healthy }
      }
      return null
    },

    openQuestChest: (questId) => {
      const quest = get().quests.find(q => q.id === questId)
      if (!quest?.completedAt || quest.chestOpened) return null
      const loot = rollChestLoot(get().level ?? 1)
      if (loot.gold) get().addGold(loot.gold)
      if (loot.seed) get().addSeed(loot.seed, 1)

      const isDaily = quest.recurrence === 'daily'

      const resetQuest = (q) => isDaily
        ? {
            ...q,
            steps: q.steps.map(s => ({ ...s, done: false })),
            shoppingItems: (q.shoppingItems ?? []).map(s => ({ ...s, done: false })),
            completedAt: null,
            chestOpened: false,
            loot: null,
            nextDueAt: nextMidnight(),
          }
        : { ...q, chestOpened: true, loot }

      if (loot.ore) {
        set(state => ({
          oreInventory: { ...state.oreInventory, [loot.ore]: (state.oreInventory[loot.ore] ?? 0) + 1 },
          quests: state.quests.map(q => q.id === questId ? resetQuest(q) : q),
        }))
      } else {
        set(state => ({
          quests: state.quests.map(q => q.id === questId ? resetQuest(q) : q),
        }))
      }
      return loot
    },

    deleteQuest: (questId) => {
      set(state => ({ quests: state.quests.filter(q => q.id !== questId) }))
    },
  }
}
