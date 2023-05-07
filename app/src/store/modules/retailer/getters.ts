import { RetailerState } from './types'
import { RetailerEntity } from '@/types'

const retailers = (state: RetailerState): RetailerEntity[] => {
  return state.retailers
}

const retailerData = (state: RetailerState): RetailerEntity => {
  return state.retailer
}

export default { retailers, retailerData }
