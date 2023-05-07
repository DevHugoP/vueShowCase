import { DataMutation } from '@/store/types'
import { SET_ARRIVAL } from './mutations-types'
import { CreateOrderStateArrival } from './types'

const setArrival: DataMutation<CreateOrderStateArrival, CreateOrderStateArrival> = (
  state,
  value,
) => {
  state.addressLine1 = value.addressLine1
  state.addressLine2 = value.addressLine2
  state.arrivalType = value.arrivalType
  state.carrierCode = value.carrierCode
  state.city = value.city
  state.comment = value.comment
  state.country = value.country
  state.district = value.district
  state.doorCode = value.doorCode
  state.elevator = value.elevator
  state.exchangePlaceId = value.exchangePlaceId
  state.floor = value.floor
  state.formated = value.formated
  state.pickupPointId = value.pickupPointId
  state.postalCode = value.postalCode
  state.storeId = value.storeId
  state.type = value.type
  state.typeFront = value.typeFront
  state.scanVariant = value.scanVariant || false
}

export default {
  [SET_ARRIVAL]: setArrival,
}
