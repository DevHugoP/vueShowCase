import { getDefaultExchangePlace } from '@/types'
import { ExchangePlaceState } from './types'
import getters from './getters'
import mutations from './mutations'

const state: ExchangePlaceState = {
  exchangePlace: {
    ...getDefaultExchangePlace(),
  },
  updatedSlots: {},
}

export default {
  state,
  getters,
  mutations,
}
