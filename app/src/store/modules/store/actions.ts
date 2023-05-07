import { Action } from '@/store/types'
import { StoreState } from './types'
import { SET_ALL_STORES } from './mutations-type'

import StoreService from '@/services/store/StoreService'

const fetchAllStores: Action<StoreState> = async ({ commit }) => {
  const stores = await StoreService.getAll()

  commit(SET_ALL_STORES, stores)
}

export default { fetchAllStores }
