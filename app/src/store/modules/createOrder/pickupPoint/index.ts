import { validationMixin } from '@/mixins'
import Vue from 'vue'
import { CreateOrderStatePickupPoint } from './types'
import getters from './getters'
import mutations from './mutations'
import { SET_PICKUP_POINT } from './mutations-types'

export const defaultPickupPoint = (): CreateOrderStatePickupPoint => {
  return {
    pickupPoint: null,
  }
}

export const pickupPointInitialState: CreateOrderStatePickupPoint = {
  ...defaultPickupPoint(),
}

export default function(store: any): any {
  const validator: any = new Vue({
    mixins: [validationMixin],
    computed: {
      pickupPoint() {
        return store.getters['createOrder/pickupPoint/pickupPoint']
      },
    },
  })

  return {
    state: pickupPointInitialState,
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
        validator.$v.$reset()
      },
      async setPickupPoint(state: any, pickupPoint: CreateOrderStatePickupPoint): Promise<void> {
        await state.commit(SET_PICKUP_POINT, pickupPoint)
      },
    },
    mutations: {
      ...mutations,
    },
  }
}
