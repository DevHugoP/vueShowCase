import { validationMixin } from '@/mixins'
import Vue from 'vue'
import { CreateOrderStateCustomerCode } from './types'
import { required, maxLength } from 'vuelidate/lib/validators'
import getters from './getters'
import mutations from './mutations'
import { SET_CUSTOMER_CODE } from './mutations-types'

export const defaultCustomerCode = (): CreateOrderStateCustomerCode => {
  return {
    externalOrderId: '',
    referenceNumber: '',
  }
}

export const customerCodeInitialState: CreateOrderStateCustomerCode = {
  ...defaultCustomerCode(),
}

export default function(store: any): any {
  const validator: any = new Vue({
    mixins: [validationMixin],
    computed: {
      customerCode() {
        return store.getters['createOrder/customerCode/customerCode']
      },
    },
    validations: {
      customerCode: {
        externalOrderId: { required, maxLength: maxLength(36) },
        referenceNumber: {},
      },
    },
  })

  return {
    state: customerCodeInitialState,
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
      async setCustomerCode(state: any, customerCode: CreateOrderStateCustomerCode): Promise<void> {
        await state.commit(SET_CUSTOMER_CODE, customerCode)
      },
    },
    mutations: {
      ...mutations,
    },
  }
}
