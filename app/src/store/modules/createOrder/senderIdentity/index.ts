import { CreateOrderStateSenderIdentity } from './types'
import { required } from 'vuelidate/lib/validators'
import { validationMixin } from '@/mixins'

import getters from './getters'
import Vue from 'vue'
import { SET_SENDER_IDENTITY } from './mutations-type'
import mutations from './mutations'

export const defaultSenderIdentity = (): CreateOrderStateSenderIdentity => {
  return {
    retailerId: null,
    storeId: null,
  }
}

export const senderIdentityInitialState: CreateOrderStateSenderIdentity = {
  ...defaultSenderIdentity(),
}

export default function(store: any): any {
  const validator: any = new Vue({
    mixins: [validationMixin],
    computed: {
      senderIdentity() {
        return store.getters['createOrder/senderIdentity/senderIdentity']
      },
    },
    validations: {
      senderIdentity: {
        retailerId: { required },
        storeId: { required },
      },
    },
  })

  return {
    state: senderIdentityInitialState,
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
      async setSenderIdentity(
        state: any,
        senderIdentity: CreateOrderStateSenderIdentity,
      ): Promise<void> {
        await state.commit(SET_SENDER_IDENTITY, senderIdentity)
      },
    },
    mutations: {
      ...mutations,
    },
  }
}
