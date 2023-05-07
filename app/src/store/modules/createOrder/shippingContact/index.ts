import { validationMixin } from '@/mixins'
import { Contact } from '@/types'
import Vue from 'vue'
import { CreateOrderStateShippingContact } from './types'

import { required, email } from 'vuelidate/lib/validators'
import phoneHelper from '@/helpers/phoneHelper'
import getters from './getters'
import mutations from './mutations'
import { SET_SHIPPING_CONTACT } from './mutations-types'

export const defaultContact = (): Contact => {
  return {
    email: '',
    phone: '',
    language: '',
    lastName: '',
    firstName: '',
    timezone: '',
    isProfessional: false,
  }
}

export const shippingContactInitialState: CreateOrderStateShippingContact = {
  contact: defaultContact(),
}

export default function(store: any): any {
  const validator: any = new Vue({
    mixins: [validationMixin],
    computed: {
      shippingContact() {
        return store.getters['createOrder/shippingContact/shippingContact']
      },
    },
    validations: {
      shippingContact: {
        contact: {
          firstName: { required },
          lastName: { required },
          email: { required, email },
          phone: {
            required,
            validPhoneNumber() {
              if (!validator.shippingContact.contact) {
                return false
              }
              const phone = validator.shippingContact.contact.phone

              if (!phone || phone.length < 2 || !phone.match(/^\+?\d+$/gm)) {
                return false
              }

              try {
                const country = phoneHelper.getCountryCode(phone)
                return phoneHelper.isValid(phone, country)
              } catch {
                return false
              }
            },
          },
          language: { required },
          timezone: { required },
        },
      },
    },
  })

  return {
    state: shippingContactInitialState,
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
      async setShippingContact(
        state: any,
        chippingContact: CreateOrderStateShippingContact,
      ): Promise<void> {
        await state.commit(SET_SHIPPING_CONTACT, chippingContact)
      },
      isContactEmpty(state: any): boolean {
        return !(
          Boolean(state.state.contact.firstName) &&
          Boolean(state.state.contact.lastName) &&
          Boolean(state.state.contact.email) &&
          Boolean(state.state.contact.phone)
        )
      },
    },
    mutations: {
      ...mutations,
    },
  }
}
