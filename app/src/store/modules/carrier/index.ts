import { CarrierState } from './types'
import actions from './actions'
import getters from './getters'
import mutations from './mutations'
import { getDefaultCarrier } from '@/types'

const state: CarrierState = {
  carriers: [],
  carrier: {
    ...getDefaultCarrier(),
  },
  carriersLight: [],
}

export default {
  state,
  actions,
  getters,
  mutations,
}
