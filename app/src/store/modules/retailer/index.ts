import actions from './actions'
import getters from './getters'
import mutations from './mutations'
import { RetailerState } from './types'
import { getDefaultRetailer } from '@/types'

const state: RetailerState = {
  retailers: [],
  retailer: {
    ...getDefaultRetailer(),
  },
}

export default {
  state,
  actions,
  getters,
  mutations,
}
