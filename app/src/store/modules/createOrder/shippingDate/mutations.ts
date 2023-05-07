import { DataMutation } from '@/store/types'
import { DateInterval } from '@/types'
import { SET_SHIPPING_DATE } from './mutations-types'
import { CreateOrderStateShippingDate } from './types'

const setShippingDate: DataMutation<CreateOrderStateShippingDate, CreateOrderStateShippingDate> = (
  state,
  value,
) => {
  state.interval = value.interval.map(inter => {
    return { ...inter } as DateInterval
  })
}

export default {
  [SET_SHIPPING_DATE]: setShippingDate,
}
