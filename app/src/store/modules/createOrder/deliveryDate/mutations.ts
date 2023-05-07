import { DataMutation } from '@/store/types'
import { DateInterval } from '@/types'
import { SET_DELIVERY_DATE } from './mutations-types'
import { CreateOrderStateDeliveryDate } from './types'

const setDeliveryDate: DataMutation<CreateOrderStateDeliveryDate, CreateOrderStateDeliveryDate> = (
  state,
  value,
) => {
  state.interval = value.interval.map(inter => {
    return { ...inter, bookingId: inter.bookingId || '' } as DateInterval
  })
}

export default {
  [SET_DELIVERY_DATE]: setDeliveryDate,
}
