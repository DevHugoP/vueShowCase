import { validationMixin } from '@/mixins'
import Vue from 'vue'
import { CreateOrderStateShippingDate } from './types'

import { required } from 'vuelidate/lib/validators'
import minDateHelper from '@/helpers/minDateHelper'
import getters from './getters'
import mutations from './mutations'
import { SET_SHIPPING_DATE } from './mutations-types'

export const defaultShippingDate = (): CreateOrderStateShippingDate => {
  return {
    interval: [],
  }
}

export const shippingDateInitialState: CreateOrderStateShippingDate = {
  ...defaultShippingDate(),
}

export default function(store: any): any {
  const validator: any = new Vue({
    mixins: [validationMixin],
    computed: {
      shippingDate() {
        return store.getters['createOrder/shippingDate/shippingDate']
      },
      miscellaneous() {
        return store.getters['createOrder/miscellaneous']
      },
    },
    validations: {
      shippingDate: {
        interval: {
          required,
          $each: {
            start: {
              required,
              dateIsSameOrBefore() {
                if (!validator.shippingDate.interval.length) {
                  return false
                }

                if (validator.miscellaneous.checkShippingDateToNow) {
                  const isBeforeNow = minDateHelper({
                    date: new Date().toISOString(),
                    timezoneMessage: true,
                  })(validator.shippingDate.interval[0].start)

                  return (
                    isBeforeNow &&
                    minDateHelper(validator.shippingDate.interval[0].start)(
                      validator.shippingDate.interval[0].end,
                    )
                  )
                }

                return minDateHelper(validator.shippingDate.interval[0].start)(
                  validator.shippingDate.interval[0].end,
                )
              },
            },
            end: {
              required,
              dateIsSameOrBefore() {
                if (!validator.shippingDate.interval.length) {
                  return false
                }

                return minDateHelper(validator.shippingDate.interval[0].start)(
                  validator.shippingDate.interval[0].end,
                )
              },
            },
          },
        },
      },
    },
  })

  return {
    state: shippingDateInitialState,
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
      async resetValue(state: any) {
        await state.commit(
          SET_SHIPPING_DATE,
          JSON.parse(JSON.stringify(validator.$v.shippingDate.$model)),
        )
      },
      async setShippingDate(state: any, shippingDate: CreateOrderStateShippingDate): Promise<void> {
        await state.commit(SET_SHIPPING_DATE, shippingDate)
      },
    },
    mutations: {
      ...mutations,
    },
  }
}
