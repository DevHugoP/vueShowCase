import { DataMutation } from '@/store/types'
import { SET_SERVICE } from './mutations-types'
import { CreateOrderStateService } from './types'

const setService: DataMutation<CreateOrderStateService, CreateOrderStateService> = (
  state,
  value,
) => {
  state.services = value.services
}

export default {
  [SET_SERVICE]: setService,
}
