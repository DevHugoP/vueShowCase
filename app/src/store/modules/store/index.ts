import { StoreState } from './types'
import { getDefaultStore } from '@/types'

import actions from './actions'
import getters from './getters'
import mutations from './mutations'

const state: StoreState = {
  stores: [],
  store: {
    ...getDefaultStore(),
  },
}

export default {
  state,
  actions,
  getters,
  mutations,
}
