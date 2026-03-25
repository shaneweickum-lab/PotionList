import { SKILL_MAP } from '../../constants/skills.js'

export function createSkillSlice(set, get) {
  return {
    unlockedSkills: [],

    hasSkill: (skillId) => (get().unlockedSkills ?? []).includes(skillId),

    getSkillPointsEarned: () => Math.max(0, (get().level ?? 1) - 1),

    getSkillPointsSpent: () =>
      (get().unlockedSkills ?? []).reduce((sum, id) => sum + (SKILL_MAP[id]?.cost ?? 0), 0),

    getSkillPointsAvailable: () =>
      get().getSkillPointsEarned() - get().getSkillPointsSpent(),

    purchaseSkill: (skillId) => {
      const state = get()
      const skill = SKILL_MAP[skillId]
      if (!skill) return { error: 'Unknown skill' }
      if ((state.unlockedSkills ?? []).includes(skillId)) return { error: 'Already unlocked' }
      if (skill.requires && !(state.unlockedSkills ?? []).includes(skill.requires)) {
        return { error: 'Prerequisite not met' }
      }
      if (state.getSkillPointsAvailable() < skill.cost) return { error: 'Not enough skill points' }
      set(state => ({ unlockedSkills: [...(state.unlockedSkills ?? []), skillId] }))
      return { success: true }
    },
  }
}
