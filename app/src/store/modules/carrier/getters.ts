import { CarrierEntity } from '@/types'
import { CarrierState } from './types'

const carriers = (state: CarrierState): CarrierEntity[] => {
  return state.carriers
}

const carrierData = (state: CarrierState): CarrierEntity => {
  return state.carrier
}

const carriersLight = (state: CarrierState): Array<{ id: number; name: string }> => {
  return state.carriersLight
}

export default { carriers, carrierData, carriersLight }
