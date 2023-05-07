import Vue from 'vue'
import { validationMixin } from 'vuelidate'
import { CreateOrderStateScan } from './types'
import { maxLength } from 'vuelidate/lib/validators'
import getters from './getters'
import mutations from './mutations'
import { SET_SCAN } from './mutations-type'

export const defaultScan = (): CreateOrderStateScan => {
  return {
    ticket: null,
  }
}

export const scanInitialState: CreateOrderStateScan = {
  ...defaultScan(),
}

export default function(store: any): any {
  const validator: any = new Vue({
    mixins: [validationMixin],
    computed: {
      scan() {
        return store.getters['createOrder/scan/scan']
      },
    },
    validations: {
      scan: {
        ticket: { maxLength: maxLength(50) },
      },
    },
  })

  return {
    state: scanInitialState,
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
      async setScan(state: any, scan: CreateOrderStateScan): Promise<void> {
        await state.commit(SET_SCAN, scan)
      },
    },
    mutations: {
      ...mutations,
    },
  }
}
