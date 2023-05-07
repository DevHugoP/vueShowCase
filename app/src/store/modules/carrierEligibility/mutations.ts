import { DataMutation } from '@/store/types'
import { CarrierEligibilityState } from './types'
import { CarrierEligibilityEntity } from '@/types'
import { SET_CARRIER_ELIGIBILITY_DATA } from './mutations-type'

const mutationSetCarrierEligibilityData: DataMutation<
  CarrierEligibilityState,
  CarrierEligibilityEntity
> = (state, carrierEligibilityData) => {
  state.carrierEligibility = carrierEligibilityData
}

export default {
  [SET_CARRIER_ELIGIBILITY_DATA]: mutationSetCarrierEligibilityData,
}
