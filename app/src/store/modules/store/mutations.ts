import { DataMutation } from '@/store/types'
import { StoreState } from './types'
import { StoreEntity } from '@/types'
import { SET_ALL_STORES, SET_STORE_DATA } from './mutations-type'

const mutationSetAllStores: DataMutation<StoreState, StoreEntity[]> = (state, stores) => {
  state.stores = stores
}

const mutationSetStoreData: DataMutation<StoreState, StoreEntity> = (state, storeData) => {
  state.store = storeData
}

export default {
  [SET_ALL_STORES]: mutationSetAllStores,
  [SET_STORE_DATA]: mutationSetStoreData,
}
