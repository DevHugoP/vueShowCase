import { validationMixin } from '@/mixins'
import Vue from 'vue'
import { CreateOrderStateDeliveryDate } from './types'

import { minLength, required } from 'vuelidate/lib/validators'
import minDateHelper from '@/helpers/minDateHelper'
import getters from './getters'
import mutations from './mutations'
import { SET_DELIVERY_DATE } from './mutations-types'

export const defaultDeliveryDate = (): CreateOrderStateDeliveryDate => {
  return {
    interval: [],
  }
}

export const deliveryDateInitialState: CreateOrderStateDeliveryDate = {
  ...defaultDeliveryDate(),
}

export default function(store: any): any {
  const validator: any = new Vue({
    mixins: [validationMixin],
    computed: {
      deliveryDate() {
        return store.getters['createOrder/deliveryDate/deliveryDate']
      },
    },
    validations: {
      deliveryDate: {
        interval: {
          minLength: minLength(1),
          required,
          $each: {
            start: {
              required,
              dateIsSameOrBefore: () => {
                if (!validator.deliveryDate.interval.length) {
                  return false
                }

                return minDateHelper(validator.deliveryDate.interval[0].start)(
                  validator.deliveryDate.interval[0].end,
                )
              },
            },
            end: {
              required,
              dateIsSameOrBefore() {
                if (!validator.deliveryDate.interval.length) {
                  return false
                }

                return minDateHelper(validator.deliveryDate.interval[0].start)(
                  validator.deliveryDate.interval[0].end,
                )
              },
            },
          },
        },
      },
    },
  })

  return {
    state: deliveryDateInitialState,
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
      async setDeliveryDate(state: any, deliveryDate: CreateOrderStateDeliveryDate): Promise<void> {
        await state.commit(SET_DELIVERY_DATE, deliveryDate)
      },
    },
    mutations: {
      ...mutations,
    },
  }
}
