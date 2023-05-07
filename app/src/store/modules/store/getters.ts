import { StoreState } from './types'
import { StoreEntity } from '@/types'

const stores = (state: StoreState): StoreEntity[] => {
  return state.stores
}

const storeData = (state: StoreState): StoreEntity => {
  return state.store
}

export default { stores, storeData }
