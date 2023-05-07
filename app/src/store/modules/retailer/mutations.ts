import { RetailerState } from './types'
import { DataMutation } from '@/store/types'
import { RetailerEntity } from '@/types'
import { SET_ALL_RETAILERS, SET_RETAILER_DATA } from './mutations-type'

const mutationSetRetailerData: DataMutation<RetailerState, RetailerEntity> = (
  state,
  retailerData,
) => {
  state.retailer = retailerData
}

const mutationSetAllRetailers: DataMutation<RetailerState, RetailerEntity[]> = (
  state,
  retailers,
) => {
  state.retailers = retailers
}

export default {
  [SET_RETAILER_DATA]: mutationSetRetailerData,
  [SET_ALL_RETAILERS]: mutationSetAllRetailers,
}
