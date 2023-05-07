import { validationMixin } from '@/mixins'
import { Contact } from '@/types'
import Vue from 'vue'
import { CreateOrderStateDeliveryContact } from './types'
import { required, email } from 'vuelidate/lib/validators'
import phoneHelper from '@/helpers/phoneHelper'
import getters from './getters'
import mutations from './mutations'
import { SET_DELIVERY_CONTACT } from './mutations-types'

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

export const deliveryContactInitialState: CreateOrderStateDeliveryContact = {
  contact: defaultContact(),
}

export default function(store: any): any {
  const validator: any = new Vue({
    mixins: [validationMixin],
    computed: {
      deliveryContact() {
        return store.getters['createOrder/deliveryContact/deliveryContact']
      },
    },
    validations: {
      deliveryContact: {
        contact: {
          firstName: { required },
          lastName: { required },
          email: { required, email },
          phone: {
            required,
            validPhoneNumber() {
              const phone = validator.deliveryContact.contact.phone

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
    state: deliveryContactInitialState,
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
      async setDeliveryContact(
        state: any,
        deliveryContact: CreateOrderStateDeliveryContact,
      ): Promise<void> {
        await state.commit(SET_DELIVERY_CONTACT, deliveryContact)
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
