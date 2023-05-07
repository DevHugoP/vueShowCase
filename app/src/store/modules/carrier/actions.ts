import { Action } from '@/store/types'
import { CarrierState } from './types'
import { SET_ALL_CARRIERS } from './mutations-type'

import CarrierService from '@/services/carrier/CarrierService'

const fetchAllCarriers: Action<CarrierState> = async ({ commit }) => {
  const { carriers } = await CarrierService.getAll()

  commit(SET_ALL_CARRIERS, carriers)
}

export default { fetchAllCarriers }
