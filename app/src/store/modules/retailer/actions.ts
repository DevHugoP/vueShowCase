import { Action } from '@/store/types'
import { RetailerState } from './types'
import { SET_ALL_RETAILERS } from './mutations-type'

import RetailerService from '@/services/retailer/RetailerService'

const fetchAllRetailers: Action<RetailerState> = async ({ commit }) => {
  const { retailers } = await RetailerService.getAll()

  commit(SET_ALL_RETAILERS, retailers)
}

export default { fetchAllRetailers }
