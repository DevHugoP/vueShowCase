import { validationMixin } from '@/mixins'
import Vue from 'vue'
import getters from './getters'
import mutations from './mutations'
import { SET_CARRIERS } from './mutations-types'
import { CreateOrderStateCarriers } from './types'

export const defaultCarriers = (): CreateOrderStateCarriers => {
  return {
    carrierSelection: null,
  }
}

export const carriersInitialState: CreateOrderStateCarriers = {
  ...defaultCarriers(),
}

export default function(store: any): any {
  const validator: any = new Vue({
    mixins: [validationMixin],
    computed: {
      carriers() {
        return store.getters['createOrder/carriers/carriers']
      },
    },
  })

  return {
    state: carriersInitialState,
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
      async setCarriers(state: any, customerCode: CreateOrderStateCarriers): Promise<void> {
        await state.commit(SET_CARRIERS, customerCode)
      },
    },
    mutations: {
      ...mutations,
    },
  }
}
