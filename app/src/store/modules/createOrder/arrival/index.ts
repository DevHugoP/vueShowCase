import postalCodeHelper from '@/helpers/postalCodeHelper'
import { validationMixin } from '@/mixins'
import Vue from 'vue'
import { requiredIf } from 'vuelidate/lib/validators'
import getters from './getters'
import mutations from './mutations'
import { SET_ARRIVAL } from './mutations-types'
import { CreateOrderArrivalType, CreateOrderStateArrival } from './types'

export const defaultAddress = (): CreateOrderStateArrival => {
  return {
    addressLine1: '',
    addressLine2: undefined,
    arrivalType: null,
    carrierCode: undefined,
    city: '',
    comment: '',
    country: '',
    district: undefined,
    doorCode: '',
    elevator: false,
    exchangePlaceId: null,
    floor: 0,
    formated: undefined,
    pickupPointId: undefined,
    postalCode: '',
    storeId: undefined,
    type: 'address',
    typeFront: null,
    scanVariant: false,
  }
}

export const arrivalInitialState: CreateOrderStateArrival = {
  ...defaultAddress(),
}

export default function(store: any): any {
  const validator: any = new Vue({
    mixins: [validationMixin],
    computed: {
      arrival() {
        return store.getters['createOrder/arrival/arrival']
      },
    },
    validations: {
      arrival: {
        addressLine1: {
          required: requiredIf(() => {
            const { arrivalType, exchangePlaceId, typeFront } = validator.arrival

            return (
              (!exchangePlaceId || typeFront === -1) &&
              (arrivalType === CreateOrderArrivalType.HOME || !arrivalType)
            )
          }),
        },
        addressLine2: {},
        city: {
          required: requiredIf(() => {
            const { arrivalType, exchangePlaceId, typeFront } = validator.arrival

            return (
              (!exchangePlaceId || typeFront === -1) && arrivalType === CreateOrderArrivalType.HOME
            )
          }),
        },
        country: {
          required: requiredIf(() => {
            const { arrivalType, exchangePlaceId, typeFront } = validator.arrival

            return (
              (!exchangePlaceId || typeFront === -1) && arrivalType === CreateOrderArrivalType.HOME
            )
          }),
        },
        doorCode: {},
        elevator: {},
        exchangePlaceId: {
          required: requiredIf(() => {
            const { arrivalType, typeFront } = validator.arrival

            return arrivalType === CreateOrderArrivalType.HOME && typeFront === -2
          }),
        },
        floor: {},
        postalCode: {
          required: requiredIf(() => {
            const { arrivalType, exchangePlaceId, typeFront } = validator.arrival

            return (
              (!exchangePlaceId || typeFront === -1) && arrivalType === CreateOrderArrivalType.HOME
            )
          }),
          postalCode(value: string) {
            const { arrivalType, exchangePlaceId, country } = validator.arrival

            if (
              exchangePlaceId &&
              exchangePlaceId !== -1 &&
              arrivalType === CreateOrderArrivalType.HOME
            ) {
              return true
            }
            const regex = postalCodeHelper.isValid(country)

            if (value && regex) {
              return regex.test(value)
            }
            return true
          },
        },
        type: {},
        comment: {
          comment(value: string) {
            return !value || value.length <= 1500
          },
        },
        typeFront: {
          required: requiredIf(() => {
            return validator.arrival.arrivalType === CreateOrderArrivalType.HOME
          }),
        },
        storeId: {
          required: requiredIf(() => {
            return validator.arrival.typeFront === -2
          }),
        },
      },
    },
  })

  return {
    state: arrivalInitialState,
    getters: {
      ...getters,
      $v() {
        return Object.assign({}, validator.$v)
      },
    },
    actions: {
      $touch() {
        validator.$v.$touch()
      },
      $reset() {
        // magic fix for TdC
        JSON.parse(JSON.stringify(validator.$v))
        validator.$v.$reset()
      },
      async setArrival(state: any, arrival: CreateOrderStateArrival): Promise<void> {
        await state.commit(SET_ARRIVAL, arrival)
      },
    },
    mutations: {
      ...mutations,
    },
  }
}
