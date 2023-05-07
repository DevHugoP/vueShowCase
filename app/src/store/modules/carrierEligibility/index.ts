import { CarrierEligibilityState } from './types'
import { getDefaultCarrierEligibility } from '@/types'
import getters from './getters'
import mutations from './mutations'

const state: CarrierEligibilityState = {
  carrierEligibility: {
    ...getDefaultCarrierEligibility(),
  },
}

export default {
  state,
  getters,
  mutations,
}
