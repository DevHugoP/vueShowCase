import { CreateOrderStateDeparture } from './types'
import { requiredUnless, requiredIf } from 'vuelidate/lib/validators'
import { SET_DEPARTURE } from './mutations-types'
import { validationMixin } from 'vuelidate'

import getters from './getters'
import mutations from './mutations'
import postalCodeHelper from '@/helpers/postalCodeHelper'
import Vue from 'vue'

export const defaultAddress = (): CreateOrderStateDeparture => {
  return {
    addressLine1: '',
    city: '',
    country: '',
    postalCode: '',
    elevator: false,
    floor: 0,
    exchangePlaceId: null,
    typeFront: null,
    comment: '',
    doorCode: '',
  }
}

export const departureInitialState: CreateOrderStateDeparture = {
  ...defaultAddress(),
}

export default function(store: any): any {
  const validator: any = new Vue({
    mixins: [validationMixin],
    computed: {
      departure() {
        return store.getters['createOrder/departure/departure']
      },
    },
    validations: {
      departure: {
        addressLine1: {
          required: requiredIf(() => {
            return (
              !validator.departure.exchangePlaceId || validator.departure.exchangePlaceId === -1
            )
          }),
        },
        addressLine2: {},
        city: {
          required: requiredIf(() => {
            return (
              !validator.departure.exchangePlaceId || validator.departure.exchangePlaceId === -1
            )
          }),
        },
        country: {
          required: requiredIf(() => {
            return (
              !validator.departure.exchangePlaceId || validator.departure.exchangePlaceId === -1
            )
          }),
        },
        doorCode: {},
        elevator: {},
        exchangePlaceId: {
          required: requiredUnless(() => {
            return (
              !validator.departure.exchangePlaceId || validator.departure.exchangePlaceId === -1
            )
          }),
        },
        floor: {},
        postalCode: {
          required: requiredIf(() => {
            return (
              !validator.departure.exchangePlaceId || validator.departure.exchangePlaceId === -1
            )
          }),
          postalCode(value: string) {
            if (validator.departure.exchangePlaceId && validator.departure.exchangePlaceId !== -1) {
              return true
            }

            const regex = postalCodeHelper.isValid(validator.departure.country)

            if (value && regex) {
              return regex.test(value)
            }
            return true
          },
        },
        type: {},
        comment: {},
      },
    },
  })

  return {
    state: departureInitialState,
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
        JSON.parse(JSON.stringify(validator.$v))
        validator.$v.$reset()
      },
      async setDeparture(state: any, departure: CreateOrderStateDeparture): Promise<void> {
        await state.commit(SET_DEPARTURE, departure)
      },
    },
    mutations: {
      ...mutations,
    },
  }
}
