import { DataMutation, Mutation } from '@/store/types'
import { RulesGroupsState, RulesGroupRulesForm } from './types'
import {
  SET_ALL_RULES,
  SET_ALL_RULES_GROUPS,
  RESET_RULES_GROUP,
  SET_RULES_GROUP,
  SET_RULES_GROUP_NAME,
  SET_RULES_GROUP_RULES,
  SET_RULES_GROUP_RULE,
} from './mutations-types'

import RulesGroupMapper from '@/services/rulesGroup/RulesGroupMapper'
import { RulesGroupEntity } from '@/types'

const setAllRules: DataMutation<RulesGroupsState, Record<string, string[]>> = (state, value) => {
  state.allRules = value
}

const setAllRulesGroups: DataMutation<RulesGroupsState, RulesGroupEntity[]> = (state, value) => {
  state.rulesGroups = value
}

const resetRulesGroup: Mutation<RulesGroupsState> = state => {
  const rules = RulesGroupMapper.allRulesToRulesForm(state.allRules)

  state.rulesGroup = {
    name: '',
    rules,
  }
}

const setRulesGroup: DataMutation<
  RulesGroupsState,
  { name: string; rules: RulesGroupRulesForm }
> = (state, data) => {
  state.rulesGroup = {
    ...data,
  }
}

const setRulesGroupName: DataMutation<RulesGroupsState, string> = (state, value) => {
  state.rulesGroup.name = value
}

const setRulesGroupRules: DataMutation<RulesGroupsState, RulesGroupRulesForm> = (state, value) => {
  state.rulesGroup.rules = value
}

const setRulesGroupRule: DataMutation<
  RulesGroupsState,
  { rulesCategory: string; rule: string; value: boolean }
> = (state, data) => {
  const { rulesCategory, rule, value } = data

  state.rulesGroup.rules[rulesCategory][rule] = value
}

export default {
  [SET_ALL_RULES]: setAllRules,
  [SET_ALL_RULES_GROUPS]: setAllRulesGroups,
  [RESET_RULES_GROUP]: resetRulesGroup,
  [SET_RULES_GROUP]: setRulesGroup,
  [SET_RULES_GROUP_RULES]: setRulesGroupRules,
  [SET_RULES_GROUP_RULE]: setRulesGroupRule,
  [SET_RULES_GROUP_NAME]: setRulesGroupName,
}
