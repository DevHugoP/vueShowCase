import { validationMixin } from '@/mixins'
import Vue from 'vue'
import { CreateOrderStateState } from './types'
import { maxLength } from 'vuelidate/lib/validators'
import getters from './getters'
import mutations from './mutations'
import { SET_STATE } from './mutations-types'

export const defaultState = (): CreateOrderStateState => {
  return {
    state: '',
  }
}

export const stateInitialState: CreateOrderStateState = {
  ...defaultState(),
}

export default function(store: any): any {
  const validator: any = new Vue({
    mixins: [validationMixin],
    computed: {
      state() {
        return store.getters['createOrder/state/stateValue']
      },
    },
    validations: {
      state: { maxLength: maxLength(36) },
    },
  })

  return {
    state: stateInitialState,
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
      async setState(state: any, stateValue: CreateOrderStateState): Promise<void> {
        await state.commit(SET_STATE, stateValue)
      },
    },
    mutations: {
      ...mutations,
    },
  }
}
