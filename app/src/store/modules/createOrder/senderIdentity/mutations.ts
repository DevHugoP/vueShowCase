import { DataMutation } from '@/store/types'
import { SET_SENDER_IDENTITY } from './mutations-type'
import { CreateOrderStateSenderIdentity } from './types'

const setSenderIdentity: DataMutation<
  CreateOrderStateSenderIdentity,
  CreateOrderStateSenderIdentity
> = (state, value) => {
  state.retailerId = value.retailerId
  state.storeId = value.storeId
}

export default {
  [SET_SENDER_IDENTITY]: setSenderIdentity,
}
