import { Action } from '@/store/types'
import { RulesGroupsState } from './types'
import { SET_ALL_RULES, RESET_RULES_GROUP, SET_ALL_RULES_GROUPS } from './mutations-types'

import RulesGroupService from '@/services/rulesGroup/RulesGroupService'

const fetchAllRules: Action<RulesGroupsState> = async ({ commit }) => {
  const allRules = await RulesGroupService.getAllRules()

  commit(SET_ALL_RULES, allRules)
  commit(RESET_RULES_GROUP)
}

const fetchAllRulesGroups: Action<RulesGroupsState> = async ({ commit }) => {
  const rulesGroups = await RulesGroupService.getAll()

  commit(SET_ALL_RULES_GROUPS, rulesGroups)
}

export default { fetchAllRules, fetchAllRulesGroups }
