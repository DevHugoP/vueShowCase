import { CarrierEligibilityState } from './types'
import { CarrierEligibilityEntity } from '@/types'

const carrierEligibilityData = (state: CarrierEligibilityState): CarrierEligibilityEntity => {
  return state.carrierEligibility
}

export default { carrierEligibilityData }
