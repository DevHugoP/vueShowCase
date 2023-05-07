import { DataMutation } from '@/store/types'
import { SET_DEPARTURE } from './mutations-types'
import { CreateOrderStateDeparture } from './types'

const setDeparture: DataMutation<CreateOrderStateDeparture, CreateOrderStateDeparture> = (
  state,
  value,
) => {
  state.addressLine1 = value.addressLine1
  state.addressLine2 = value.addressLine2
  state.city = value.city
  state.comment = value.comment
  state.country = value.country
  state.district = value.district
  state.doorCode = value.doorCode
  state.elevator = value.elevator
  state.exchangePlaceId = value.exchangePlaceId
  state.floor = value.floor
  state.formated = value.formated
  state.postalCode = value.postalCode
  state.type = value.type
  state.typeFront = value.typeFront
}

export default {
  [SET_DEPARTURE]: setDeparture,
}
