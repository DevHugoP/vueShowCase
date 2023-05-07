import { DataMutation } from '@/store/types'
import { SET_STATE } from './mutations-types'
import { CreateOrderStateState } from './types'

const setState: DataMutation<CreateOrderStateState, CreateOrderStateState> = (state, value) => {
  state.state = value.state
}

export default {
  [SET_STATE]: setState,
}
