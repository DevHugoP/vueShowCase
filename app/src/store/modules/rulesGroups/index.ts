import actions from './actions'
import getters from './getters'
import mutations from './mutations'

import { RulesGroupsState } from './types'

const state: RulesGroupsState = {
  allRules: {},
  rulesGroups: [],
  rulesGroup: {
    name: '',
    rules: {},
  },
}

export default {
  actions,
  state,
  getters,
  mutations,
}
