import { DataMutation } from '@/store/types'
import { CarrierState } from './types'
import { CarrierEntity } from '@/types'
import { SET_ALL_CARRIERS, SET_CARRIER_DATA, SET_CARRIERS_LIGHT } from './mutations-type'

const mutationSetCarrierData: DataMutation<CarrierState, CarrierEntity> = (state, carrierData) => {
  state.carrier = carrierData
}

const mutationSetAllCarriers: DataMutation<CarrierState, CarrierEntity[]> = (state, carriers) => {
  state.carriers = carriers
}

const mutationSetCarriersLight: DataMutation<CarrierState, Array<{ id: number; name: string }>> = (
  state,
  carriersLight,
) => {
  state.carriersLight = carriersLight
}

export default {
  [SET_CARRIER_DATA]: mutationSetCarrierData,
  [SET_ALL_CARRIERS]: mutationSetAllCarriers,
  [SET_CARRIERS_LIGHT]: mutationSetCarriersLight,
}
