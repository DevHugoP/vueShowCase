import { DataMutation } from '@/store/types'
import { SET_PICKUP_POINT } from './mutations-types'
import { CreateOrderStatePickupPoint } from './types'

const setPickupPoint: DataMutation<CreateOrderStatePickupPoint, CreateOrderStatePickupPoint> = (
  state,
  value,
) => {
  state.pickupPoint = value.pickupPoint
}

export default {
  [SET_PICKUP_POINT]: setPickupPoint,
}
