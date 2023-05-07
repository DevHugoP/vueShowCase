import { Contact, CreateOrderApiAddress, ExchangePlaceEntity } from '@/types'
import Vue from 'vue'
import { ROUTES } from '@/constants'
import { CreateOrderStateDeparture } from '@/store/modules/createOrder/departure/types'
import {
  CreateOrderStateEligibility,
  CreateOrderStateMiscellaneous,
} from '@/store/modules/createOrder/types'
import { SnackBarType } from '@/store/types'
import ExchangePlaceService from '@/services/exchangePlace/ExchangePlaceService'
import { defaultAddress } from '@/store/modules/createOrder/departure'
import { v4 } from 'uuid'
import AddressService from '@/services/address/AddressService'
import { debounce } from 'debounce'
import { wait } from '@/helpers/helper'
import StoreService from '@/services/store/StoreService'
import OrderMapper from '@/services/order/OrderMapper'
import { CreateOrderStateSenderIdentity } from '@/store/modules/createOrder/senderIdentity/types'
import { CreateOrderStateShippingContact } from '@/store/modules/createOrder/shippingContact/types'
import { CreateOrderStateArrival } from '@/store/modules/createOrder/arrival/types'

const defaultApiAddress = (): CreateOrderApiAddress => {
  return {
    apiAddress: null,
    loading: false,
    suggestions: [],
    showMore: false,
  }
}

export default Vue.extend({
  data: () => ({
    departureExchangePlaces: [] as Array<{ id: number; name: string }>,
    departureApiAddress: defaultApiAddress(),
    departureSessionToken: null as string | null,
    departureIsLoadingDetails: false,
    departureInitialize: false,
    departureFirstCheck: true,
    OrderMapper,
  }),
  computed: {
    senderIdentity(): CreateOrderStateSenderIdentity {
      return this.$store.getters['createOrder/senderIdentity/senderIdentity']
    },
    shippingContact(): CreateOrderStateShippingContact {
      return this.$store.getters['createOrder/shippingContact/shippingContact']
    },
    arrival(): CreateOrderStateArrival {
      return this.$store.getters['createOrder/arrival/arrival']
    },
    eligibility(): CreateOrderStateEligibility {
      return this.$store.getters['createOrder/eligibility']
    },
    miscellaneous(): CreateOrderStateMiscellaneous {
      return this.$store.getters['createOrder/miscellaneous']
    },
    departure(): CreateOrderStateDeparture {
      return this.$store.getters['createOrder/departure/departure']
    },
    validations(): any {
      return this.$store.getters['createOrder/departure/$v']
    },
    isEditing(): boolean {
      return this.$route.name === ROUTES.editOrder
    },
  },
  methods: {
    async departureGetExchangePlaces(departureExchangePlaces: Array<{ name: string; id: number }>) {
      try {
        if (departureExchangePlaces?.length) {
          const localExchangePlaces = departureExchangePlaces

          localExchangePlaces.unshift({
            id: -1,
            name: this.$t('page.createOrder.steps.step1.labels.personalAddress'),
          })

          this.departureExchangePlaces = localExchangePlaces

          if (this.isEditing && !this.validations.$invalid && !this.departureInitialize) {
            await this.departureHandleChangeExchangePlaces(this.departure.exchangePlaceId as number)
          }

          if (!this.departureInitialize && !this.departure.exchangePlaceId) {
            this.departure.exchangePlaceId = -1
            this.eligibility.exchangePlace = null
          }

          if (
            this.departureExchangePlaces.length === 2 &&
            !this.isEditing &&
            this.validations.$invalid
          ) {
            this.$nextTick(() => {
              this.departure.exchangePlaceId = this.departureExchangePlaces[1].id
              this.departureHandleChangeExchangePlaces(this.departure.exchangePlaceId)
            })
          }
        } else {
          this.$nextTick(() => {
            this.eligibility.exchangePlace = null
          })
        }
      } catch {
        this.$store.dispatch('setSnackbar', {
          type: SnackBarType.ERROR,
          message: this.$t('messages.error'),
        })
      } finally {
        if (this.departure.exchangePlaceId === -1 && !this.departureInitialize) {
          if (this.departure.formated) {
            this.departureOnInputChange(this.departure.formated)
          } else {
            if (this.isEditing) {
              this.departureApiAddress.suggestions = [
                {
                  placeId: '',
                  address: this.$t('page.createOrder.steps.step1.labels.personalAddress'),
                },
              ]

              this.departureApiAddress.apiAddress = this.departureApiAddress.suggestions[0]
              this.departureInitialize = true

              this.$nextTick(() => {
                if (this.validations.departure && !this.validations.departure.$invalid) {
                  this.validations.departure.$touch()
                }
              })
            }
          }
        } else {
          this.departureInitialize = true
        }
      }
    },
    async departureHandleChangeExchangePlaces(exchangePlaceId: number) {
      if (exchangePlaceId === null) {
        this.eligibility.exchangePlace = null
        this.departureApiAddress = defaultApiAddress()
        return
      }

      if (exchangePlaceId > 0) {
        const exchangePlace: ExchangePlaceEntity = await ExchangePlaceService.get(exchangePlaceId)

        const {
          address: { addressLine1, addressLine2 = '', city, country, floor, postalCode },
        } = exchangePlace

        await this.$store.dispatch('createOrder/departure/setDeparture', {
          ...this.departure,
          addressLine1,
          addressLine2,
          city,
          country,
          floor: floor ? floor : 0,
          postalCode,
        })

        this.departureCheckContact(exchangePlace.contacts)

        this.eligibility.exchangePlace = exchangePlace
      } else if (exchangePlaceId < 0 && this.departureInitialize) {
        this.eligibility.exchangePlace = null
        await this.$store.dispatch('createOrder/departure/setDeparture', defaultAddress())
        this.departureCheckContact()
      }
      this.departureApiAddress = defaultApiAddress()
    },
    async departureOnInputChange(text: string) {
      // Currently getting detail of an address OR edit with a custom address (so no seach on `other address`)
      if (
        this.departureIsLoadingDetails ||
        (!this.departureInitialize && !this.departure.formated) ||
        (this.departureApiAddress.apiAddress?.placeId === '' && this.departureFirstCheck)
      ) {
        this.departureFirstCheck = false
        return
      }

      // Display style on input when loading address
      this.departureApiAddress.loading = true

      try {
        if (!this.departureSessionToken) {
          this.departureSessionToken = v4()
        }

        // Get addresses

        this.departureApiAddress.suggestions = await AddressService.autoComplete({
          input: text,
          sessionToken: this.departureSessionToken,
        })

        // Set the local google autocomplete with data from Store
        if (!this.departureInitialize) {
          this.departureApiAddress.apiAddress = this.departureApiAddress.suggestions[1]
          this.departureInitialize = true

          this.$nextTick(() => {
            if (this.validations.departure) {
              this.validations.departure.$touch()
            }
          })
        }
      } catch {
        this.$store.dispatch('setSnackbar', {
          type: SnackBarType.ERROR,
          message: this.$t('messages.error'),
        })
      } finally {
        // Stop loading style
        this.departureApiAddress.loading = false
      }
    },
    departureOnDebounceInputChange: debounce(async function(this: any, text: string) {
      await this.departureOnInputChange(text)
    }, 250),
    async departureHandleChangeApiAddress() {
      this.departureIsLoadingDetails = true

      // If address change reset moreDetail component
      this.departureApiAddress.showMore = false

      try {
        // get detail of address
        if (this.departureApiAddress.apiAddress?.placeId) {
          const detail = await AddressService.getDetail({
            placeId: this.departureApiAddress.apiAddress.placeId,
            sessionToken: this.departureSessionToken || v4(),
          })

          await this.$store.dispatch('createOrder/departure/setDeparture', {
            ...detail,
            exchangePlaceId: this.departure.exchangePlaceId,
            floor: 0,
            typeFront: this.departure.typeFront,
            type: this.departure.type,
          })

          this.departureSessionToken = null
        } else {
          await this.$store.dispatch('createOrder/departure/setDeparture', {
            ...defaultAddress(),
            exchangePlaceId: this.departure.exchangePlaceId,
            typeFront: this.departure.typeFront,
            type: this.departure.type,
          })
          if (this.validations.departure) {
            this.validations.departure.addressLine1.$reset()
            this.validations.departure.country.$reset()
            this.validations.departure.postalCode.$reset()
            this.validations.departure.city.$reset()
          }
        }
      } catch {
        this.$store.dispatch('setSnackbar', {
          type: SnackBarType.ERROR,
          message: this.$t('messages.error'),
        })
      } finally {
        await wait(150)
        this.departureIsLoadingDetails = false
      }
    },

    async departureCheckContact(contacts?: Contact[]): Promise<void> {
      let localContacts: Contact[] = []

      if (!contacts?.length && this.senderIdentity?.storeId) {
        try {
          const store = await StoreService.get(this.senderIdentity.storeId)
          localContacts = store.contacts
        } catch (e) {
          this.$store.dispatch('setSnackbar', {
            type: SnackBarType.ERROR,
            message: this.$t('messages.error'),
          })
        }
      } else if (contacts) {
        localContacts = contacts
      }

      // Set contact
      const mainContact = localContacts?.find(c => c.main) || null

      if (
        (await this.$store.dispatch('createOrder/isContactEmpty', this.shippingContact.contact)) ||
        !this.miscellaneous.hasDepartureContactAlreadyBeenSet
      ) {
        this.shippingContact.contact = JSON.parse(
          JSON.stringify(mainContact ? mainContact : localContacts?.[0] || null),
        )
      }
    },
    resetFormated() {
      delete this.departure.formated
      this.departure.formated = OrderMapper.getFormatedAddress(this.departure)
    },
  },
  watch: {
    'senderIdentity.storeId': {
      immediate: true,
      async handler(next) {
        if (!next) {
          return
        }

        if (this.departureInitialize) {
          await this.$store.dispatch('createOrder/departure/setDeparture', defaultAddress())
          if (this.validations.departure) {
            this.validations.departure.$reset()
          }
        }
      },
    },
    'senderIdentity.retailerId': {
      immediate: true,
      async handler() {
        if (this.departureInitialize) {
          await this.$store.dispatch('createOrder/departure/setDeparture', defaultAddress())
          if (this.validations.departure) {
            this.validations.departure.$reset()
          }
        }
      },
    },
    'departure.exchangePlaceId'(next) {
      if (next > 0) {
        this.departure.type = 'exchangePlace'
      } else {
        this.departure.type = 'address'
        this.departureCheckContact()
      }
    },
    'miscellaneous.exchangePlaces': {
      immediate: true,
      handler(next) {
        if (next?.length) {
          this.departureGetExchangePlaces(JSON.parse(JSON.stringify(next)))
          return
        }
        this.eligibility.exchangePlace = null
      },
    },
  },
})
