import actions from './actions'
import getters from './getters'
import mutations from './mutations'
import { OrdersState } from './types'

const state: OrdersState = {
  isMergeMode: false,
  merge: {
    main: null,
    toMerge: [],
  },
  isLabelMode: false,
  labels: [],
}

export default {
  state,
  actions,
  getters,
  mutations,
}
