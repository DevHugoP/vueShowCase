import { DataMutation } from '@/store/types'
import { CarrierEligibilityEntity, Checkout } from '@/types'
import {
  ELIGIBILITY_ERROR_MESSAGE,
  ELIGILIBILITY_FILTERED,
  ELIGILIBILITY_UNFILTERED,
  SET_IS_ERROR_MODE,
  SET_MISCELLANEOUS_CHECKOUT,
  SET_MISCELLANEOUS_ERROR_MESSAGES,
  SET_MISCELLANEOUS_TOTAL_ERRORS,
  SET_MISCELLANEOUS_TOTAL_ERRORS_LEFT,
} from './mutations-types'
import { CreateOrderState } from './types'

const eligibilityFiltered: DataMutation<CreateOrderState, CarrierEligibilityEntity[]> = (
  state,
  value,
) => {
  state.eligibility.filteredCarriers = value
}

const eligibilityErrorMessage: DataMutation<CreateOrderState, string> = (state, value) => {
  state.eligibility.errorMessage = value
}

const eligibilityUnfilteredCarriers: DataMutation<CreateOrderState, CarrierEligibilityEntity[]> = (
  state,
  value,
) => {
  state.eligibility.unfilteredCarriers = value
}

const setIsErrorMode: DataMutation<CreateOrderState, boolean> = (state, value) => {
  state.miscellaneous.isErrorMode = value
}

const setMiscellaneousCheckout: DataMutation<CreateOrderState, Checkout> = (state, value) => {
  state.miscellaneous.checkout = value
}

const setMiscellaneousErrorMessages: DataMutation<CreateOrderState, string[]> = (state, value) => {
  state.miscellaneous.errorMessages = value
}

const setMiscellaneousTotalError: DataMutation<CreateOrderState, number> = (state, value) => {
  state.miscellaneous.totalErrors = value
}

const setMiscellaneousTotalErrorLeft: DataMutation<CreateOrderState, number> = (state, value) => {
  state.miscellaneous.totalErrorsLeft = value
}

export default {
  [ELIGILIBILITY_FILTERED]: eligibilityFiltered,
  [ELIGIBILITY_ERROR_MESSAGE]: eligibilityErrorMessage,
  [ELIGILIBILITY_UNFILTERED]: eligibilityUnfilteredCarriers,
  [SET_IS_ERROR_MODE]: setIsErrorMode,
  [SET_MISCELLANEOUS_CHECKOUT]: setMiscellaneousCheckout,
  [SET_MISCELLANEOUS_ERROR_MESSAGES]: setMiscellaneousErrorMessages,
  [SET_MISCELLANEOUS_TOTAL_ERRORS]: setMiscellaneousTotalError,
  [SET_MISCELLANEOUS_TOTAL_ERRORS_LEFT]: setMiscellaneousTotalErrorLeft,
}
