import { DataMutation } from '@/store/types'
import { SET_DELIVERY_CONTACT } from './mutations-types'
import { CreateOrderStateDeliveryContact } from './types'

const setDeliveryContact: DataMutation<
  CreateOrderStateDeliveryContact,
  CreateOrderStateDeliveryContact
> = (state, value) => {
  state.contact = value.contact
}

export default {
  [SET_DELIVERY_CONTACT]: setDeliveryContact,
}
