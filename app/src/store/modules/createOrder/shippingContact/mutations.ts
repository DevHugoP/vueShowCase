import { DataMutation } from '@/store/types'
import { SET_SHIPPING_CONTACT } from './mutations-types'
import { CreateOrderStateShippingContact } from './types'

const setShippingContact: DataMutation<
  CreateOrderStateShippingContact,
  CreateOrderStateShippingContact
> = (state, value) => {
  state.contact = value.contact
}

export default {
  [SET_SHIPPING_CONTACT]: setShippingContact,
}
