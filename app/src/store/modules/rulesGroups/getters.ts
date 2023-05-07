import { RulesGroupEntity } from '@/types'
import { RulesGroupRulesForm, RulesGroupsState } from './types'

const allRules = (state: RulesGroupsState): Record<string, string[]> => {
  return state.allRules
}

const rulesGroups = (state: RulesGroupsState): RulesGroupEntity[] => {
  return state.rulesGroups
}

const rulesGroup = (
  state: RulesGroupsState,
): {
  name: string
  rules: RulesGroupRulesForm
} => {
  return state.rulesGroup
}

export default {
  allRules,
  rulesGroups,
  rulesGroup,
}
