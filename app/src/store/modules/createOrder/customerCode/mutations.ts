import { DataMutation } from '@/store/types'
import { SET_CUSTOMER_CODE } from './mutations-types'
import { CreateOrderStateCustomerCode } from './types'

const setCustomerCode: DataMutation<CreateOrderStateCustomerCode, CreateOrderStateCustomerCode> = (
  state,
  value,
) => {
  state.externalOrderId = value.externalOrderId
  state.referenceNumber = value.referenceNumber
}

export default {
  [SET_CUSTOMER_CODE]: setCustomerCode,
}
