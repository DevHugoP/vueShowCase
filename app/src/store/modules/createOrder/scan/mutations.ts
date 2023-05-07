import { DataMutation } from '@/store/types'
import { SET_SCAN } from './mutations-type'
import { CreateOrderStateScan } from './types'

const setScan: DataMutation<CreateOrderStateScan, CreateOrderStateScan> = (state, value) => {
  state.ticket = value.ticket
}

export default {
  [SET_SCAN]: setScan,
}
