import { DataMutation } from '@/store/types'
import { SET_CARRIERS } from './mutations-types'
import { CreateOrderStateCarriers } from './types'

const setCarriers: DataMutation<CreateOrderStateCarriers, CreateOrderStateCarriers> = (
  state,
  value,
) => {
  state.carrierSelection = value.carrierSelection
}

export default {
  [SET_CARRIERS]: setCarriers,
}
