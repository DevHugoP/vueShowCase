import { validationMixin } from '@/mixins'
import Vue from 'vue'
import { CreateOrderStateService } from './types'

import { required, minLength } from 'vuelidate/lib/validators'
import getters from './getters'
import mutations from './mutations'
import { SET_SERVICE } from './mutations-types'

export const defaultService = (): CreateOrderStateService => {
  return {
    services: [],
  }
}

export const serviceInitialState: CreateOrderStateService = {
  ...defaultService(),
}

export default function(store: any): any {
  const validator: any = new Vue({
    mixins: [validationMixin],
    computed: {
      service() {
        return store.getters['createOrder/service/service']
      },
    },
    validations: {
      service: {
        services: {
          required,
          minLength: minLength(1),
        },
      },
    },
  })

  return {
    state: serviceInitialState,
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
      async setService(state: any, service: CreateOrderStateService): Promise<void> {
        await state.commit(SET_SERVICE, service)
      },
    },
    mutations: {
      ...mutations,
    },
  }
}
