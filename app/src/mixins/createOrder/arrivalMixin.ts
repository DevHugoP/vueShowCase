import { ROUTES, EXCHANGE_PLACE_TYPE } from '@/constants'
import { AVAILABLE_LEVEL_SERVICES } from '@/constants/shared'
import ExchangePlaceService from '@/services/exchangePlace/ExchangePlaceService'
import {
  CreateOrderArrivalType,
  CreateOrderStateArrival,
} from '@/store/modules/createOrder/arrival/types'
import {
  CreateOrderStateEligibility,
  CreateOrderStateMiscellaneous,
} from '@/store/modules/createOrder/types'
import { SnackBarType } from '@/store/types'
import { Address, Contact, CreateOrderApiAddress, ExchangePlaceEntity, Filters } from '@/types'
import Vue from 'vue'
import { defaultAddress } from '@/store/modules/createOrder/arrival'
import { v4 } from 'uuid'
import AddressService from '@/services/address/AddressService'
import { debounce } from 'debounce'
import { wait } from '@/helpers/helper'
import { defaultContact } from '@/store/modules/createOrder/deliveryContact'
import { CreateOrderStateDeparture } from '@/store/modules/createOrder/departure/types'
import { CreateOrderStateService } from '@/store/modules/createOrder/service/types'
import { CreateOrderStateDeliveryContact } from '@/store/modules/createOrder/deliveryContact/types'
import { CreateOrderStateSenderIdentity } from '@/store/modules/createOrder/senderIdentity/types'
import { CreateOrderStateScan } from '@/store/modules/createOrder/scan/types'

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
    arrivalExchangePlaces: [] as Filters[],
    arrivalApiAddress: defaultApiAddress(),
    arrivalSessionToken: null as string | null,
    arrivalIsLoadingDetails: false,
    arrivalInitialize: false,
    arrivalShowArrivalType: true,
    CreateOrderArrivalType,
    arrivalSelectedStoreExchangePlaces: [] as Filters[],
    arrivalFirstCheck: true,
    selectedAvailableAddress: null as Address | null,
  }),
  computed: {
    departure(): CreateOrderStateDeparture {
      return this.$store.getters['createOrder/departure/departure']
    },
    service(): CreateOrderStateService {
      return this.$store.getters['createOrder/service/service']
    },
    deliveryContact(): CreateOrderStateDeliveryContact {
      return this.$store.getters['createOrder/deliveryContact/deliveryContact']
    },
    senderIdentity(): CreateOrderStateSenderIdentity {
      return this.$store.getters['createOrder/senderIdentity/senderIdentity']
    },
    miscellaneous(): CreateOrderStateMiscellaneous {
      return this.$store.getters['createOrder/miscellaneous']
    },
    arrival(): CreateOrderStateArrival {
      return this.$store.getters['createOrder/arrival/arrival']
    },
    scan(): CreateOrderStateScan {
      return this.$store.getters['createOrder/scan/scan']
    },
    validations(): any {
      return this.$store.getters['createOrder/arrival/$v']
    },
    isEditing(): boolean {
      return this.$route.name === ROUTES.editOrder
    },
    rule(): string {
      return this.isEditing ? 'EDIT_ORDERS' : 'CREATE_ORDERS'
    },
    eligibility(): CreateOrderStateEligibility {
      return this.$store.getters['createOrder/eligibility']
    },
    getExchangePlacesItems(): Filters[] {
      if (this.departure.exchangePlaceId) {
        const filter = this.arrivalExchangePlaces.filter(
          exchangePlace =>
            exchangePlace.id === -1 ||
            exchangePlace.id === -2 ||
            (exchangePlace.id && exchangePlace.id !== this.departure.exchangePlaceId),
        )
        return filter?.length
          ? filter
          : [
              {
                id: -1,
                name: this.$t('page.createOrder.steps.step1.labels.personalAddress'),
              },
            ]
      }

      return this.arrivalExchangePlaces?.length
        ? this.arrivalExchangePlaces
        : [
            {
              id: -1,
              name: this.$t('page.createOrder.steps.step1.labels.personalAddress'),
            },
          ]
    },
  },
  methods: {
    arrivalGetExchangePlaces(exchangePlaces: Array<{ name: string; id: number }>) {
      try {
        if (exchangePlaces?.length) {
          const localExchangePlaces = exchangePlaces

          const hasManyStore = this.miscellaneous.stores.length > 1

          localExchangePlaces.unshift({
            id: -1,
            name: this.$t('page.createOrder.steps.step1.labels.personalAddress'),
          })

          if (hasManyStore) {
            localExchangePlaces.unshift({
              id: -2,
              name: this.$t('page.createOrder.steps.step1.labels.store'),
            })
          }

          this.arrivalExchangePlaces = localExchangePlaces

          if (this.isEditing && !this.validations.$invalid && !this.arrivalInitialize) {
            this.arrivalHandleChangeExchangePlaces(this.arrival.exchangePlaceId as number, false)
          }

          if (!this.arrivalInitialize && !this.arrival.exchangePlaceId) {
            this.arrival.typeFront = -1
            this.miscellaneous.deliveryExchangePlace = null
          }

          if (
            this.arrivalExchangePlaces.length === (hasManyStore ? 3 : 2) &&
            !this.isEditing &&
            this.validations.$invalid
          ) {
            this.$nextTick(() => {
              this.arrival.arrivalType = CreateOrderArrivalType.HOME

              if (this.arrivalShowArrivalType) {
                this.arrivalShowArrivalType = false
                this.$nextTick(() => {
                  this.arrivalShowArrivalType = true
                })
              }
            })
          }
        }
      } catch {
        this.$store.dispatch('setSnackbar', {
          type: SnackBarType.ERROR,
          message: this.$t('messages.error'),
        })
      }
    },
    async arrivalHandleChangeExchangePlaces(
      exchangePlaceId: number,
      removeSelectedStoreEp: boolean,
    ) {
      if (exchangePlaceId === null) {
        this.miscellaneous.deliveryExchangePlace = null
        if (removeSelectedStoreEp) {
          this.arrivalSelectedStoreExchangePlaces = []
        }
        return
      }

      if (exchangePlaceId > 0) {
        const exchangePlace: ExchangePlaceEntity = await ExchangePlaceService.get(exchangePlaceId)

        const {
          address: { addressLine1, addressLine2 = '', city, country, floor, postalCode },
        } = exchangePlace

        await this.$store.dispatch('createOrder/arrival/setArrival', {
          ...this.arrival,
          addressLine1,
          addressLine2,
          city,
          country,
          floor: floor ? floor : 0,
          postalCode,
          arrivalType: this.arrival.arrivalType,
        })

        this.arrivalCheckContact(exchangePlace.contacts)

        this.miscellaneous.deliveryExchangePlace = exchangePlace
      } else {
        if (this.arrivalInitialize) {
          this.miscellaneous.deliveryExchangePlace = null

          if (!this.service.services.includes(AVAILABLE_LEVEL_SERVICES.PICKUP_POINT)) {
            await this.$store.dispatch('createOrder/arrival/setArrival', {
              ...defaultAddress(),
              arrivalType: this.arrival.arrivalType,
            })
          }
        }
      }

      if (!this.arrival.arrivalType) {
        this.arrival.arrivalType = CreateOrderArrivalType.HOME
        if (this.arrivalShowArrivalType) {
          this.arrivalShowArrivalType = false
          this.$nextTick(() => {
            this.arrivalShowArrivalType = true
          })
        }
      }
    },
    async arrivalHandleChangeStore(storeId: number, isInit = false) {
      if (storeId === null) {
        this.arrival.exchangePlaceId = null
        this.arrivalSelectedStoreExchangePlaces = []
        // this.resetFields(CreateOrderItineraryClearFieldsType.STORE_DELIVERY)
        return
      }

      const localExchangePlaces = await ExchangePlaceService.getFilters({
        forRule: this.rule,
        storeId,
        active: true,
        type: [
          EXCHANGE_PLACE_TYPE.EXCHANGE_PLACE_PFU,
          EXCHANGE_PLACE_TYPE.EXCHANGE_PLACE_STORAGE,
          EXCHANGE_PLACE_TYPE.EXCHANGE_PLACE_STORE,
        ]
      })

      this.arrivalSelectedStoreExchangePlaces = localExchangePlaces
        .filter(({ id }) => id !== this.departure.exchangePlaceId)
        .map(exchangePlace => {
          return {
            name: `${exchangePlace.externalId} - ${exchangePlace.name}`,
            id: exchangePlace.id,
          }
        })

      if (!isInit) {
        this.arrival.exchangePlaceId = null
        // this.resetFields(CreateOrderItineraryClearFieldsType.STORE_DELIVERY)
      }
    },
    async arrivalOnInputChange(text: string) {
      // Currently getting detail of an address OR edit with a custom address (so no seach on `other address`)
      if (
        this.arrivalIsLoadingDetails ||
        (!this.arrivalInitialize && !this.arrival.formated) ||
        (this.arrivalApiAddress.apiAddress?.placeId === '' && this.arrivalFirstCheck)
      ) {
        this.arrivalFirstCheck = false
        return
      }

      // Display style on input when loading address
      this.arrivalApiAddress.loading = true

      try {
        if (!this.arrivalSessionToken) {
          this.arrivalSessionToken = v4()
        }

        // Get addresses
        this.arrivalApiAddress.suggestions = await AddressService.autoComplete({
          input: text,
          sessionToken: this.arrivalSessionToken,
        })

        // Set the local google autocomplete with data from Store
        if (!this.arrivalInitialize) {
          const exactMatchSuggestion: any = this.arrivalApiAddress.suggestions.find(suggestion => {
            return (
              suggestion.address.toString().replace(/,/g, '') === text.toString().replace(/,/g, '')
            )
          })

          this.arrivalApiAddress.apiAddress =
            exactMatchSuggestion || this.arrivalApiAddress.suggestions[1]
          this.arrivalInitialize = true
        }
      } catch {
        this.$store.dispatch('setSnackbar', {
          type: SnackBarType.ERROR,
          message: this.$t('messages.error'),
        })
      } finally {
        // Stop loading style
        this.arrivalApiAddress.loading = false
      }
    },
    arrivalOnDebounceInputChange: debounce(async function(this: any, text: string) {
      this.arrivalOnInputChange(text)
    }, 250),
    async arrivalHandleChangeApiAddress() {
      this.arrivalIsLoadingDetails = true

      // If address change reset moreDetail component
      this.arrivalApiAddress.showMore = false

      try {
        // get detail of address
        if (this.arrivalApiAddress.apiAddress?.placeId) {
          const detail = await AddressService.getDetail({
            placeId: this.arrivalApiAddress.apiAddress.placeId,
            sessionToken: this.arrivalSessionToken || v4(),
          })

          await this.$store.dispatch('createOrder/arrival/setArrival', {
            ...detail,
            exchangePlaceId: this.arrival.exchangePlaceId,
            floor: 0,
            typeFront: this.arrival.typeFront,
            type: this.arrival.type,
            arrivalType: this.arrival.arrivalType,
          })

          this.arrivalSessionToken = null
        } else {
          await this.$store.dispatch('createOrder/arrival/setArrival', {
            ...defaultAddress(),
            exchangePlaceId: this.arrival.exchangePlaceId,
            typeFront: this.arrival.typeFront,
            type: this.arrival.type,
            arrivalType: this.arrival.arrivalType,
          })
          if (this.validations.arrival) {
            this.validations.arrival.addressLine1.$reset()
            this.validations.arrival.country.$reset()
            this.validations.arrival.postalCode.$reset()
            this.validations.arrival.city.$reset()
          }
        }
      } catch {
        this.$store.dispatch('setSnackbar', {
          type: SnackBarType.ERROR,
          message: this.$t('messages.error'),
        })
      } finally {
        if (!this.arrival.arrivalType) {
          this.arrival.arrivalType = CreateOrderArrivalType.HOME
          if (this.arrivalShowArrivalType) {
            this.arrivalShowArrivalType = false
            this.$nextTick(() => {
              this.arrivalShowArrivalType = true
            })
          }
        }

        await wait(150)
        this.arrivalIsLoadingDetails = false
      }
    },

    async arrivalCheckContact(contacts: Contact[]): Promise<void> {
      // Set contact
      const mainContact = contacts.find(c => c.main)

      if (
        (await this.$store.dispatch('createOrder/isContactEmpty', this.deliveryContact.contact)) ||
        !this.miscellaneous.hasDeliveryContactAlreadyBeenSet
      ) {
        this.deliveryContact.contact = JSON.parse(
          JSON.stringify(mainContact ? mainContact : contacts[0]),
        )
      }
    },
  },
  watch: {
    'senderIdentity.storeId': {
      immediate: true,
      async handler(next) {
        if (!next) {
          return
        }

        if (this.arrivalInitialize) {
          await this.$store.dispatch('createOrder/arrival/setArrival', {
            ...defaultAddress(),
            arrivalType: this.arrival.arrivalType
              ? this.arrival.arrivalType
              : CreateOrderArrivalType.HOME,
          })

          this.arrival.scanVariant = false
          this.selectedAvailableAddress = null

          if (this.validations.arrival) {
            this.validations.arrival.$reset()
          }
        }
      },
    },
    'miscellaneous.exchangePlaces': {
      immediate: true,
      handler(next) {
        this.arrivalGetExchangePlaces(JSON.parse(JSON.stringify(next)))
      },
    },
    'senderIdentity.retailerId': {
      immediate: true,
      async handler() {
        if (this.arrivalInitialize) {
          await this.$store.dispatch('createOrder/arrival/setArrival', {
            ...defaultAddress(),
            arrivalType: this.arrival.arrivalType
              ? this.arrival.arrivalType
              : CreateOrderArrivalType.HOME,
          })

          this.arrival.scanVariant = false
          this.selectedAvailableAddress = null

          if (this.validations.arrival) {
            this.validations.arrival.$reset()
          }
        }
      },
    },
    'arrival.exchangePlaceId'(next) {
      if (next > 0) {
        this.arrival.type = 'exchangePlace'
      } else {
        this.arrival.type = 'address'
      }
    },
    async 'arrival.arrivalType'(next) {
      this.arrivalApiAddress = defaultApiAddress()
      if (this.arrivalInitialize) {
        await this.$store.dispatch('createOrder/arrival/setArrival', {
          ...defaultAddress(),
          arrivalType: next,
          typeFront: this.arrival.typeFront,
        })
        this.selectedAvailableAddress = null

        if (!this.miscellaneous.hasDeliveryContactAlreadyBeenSet) {
          this.deliveryContact.contact = defaultContact()
        }

        if (this.validations.arrival) {
          this.validations.arrival.$reset()
        }

        if (
          next === CreateOrderArrivalType.HOME &&
          this.service.services.includes(AVAILABLE_LEVEL_SERVICES.PICKUP_POINT)
        ) {
          this.service.services = []
          this.arrival.typeFront = -1

          if (this.miscellaneous.availableAddresses?.length) {
            this.arrival.scanVariant = true
          }
        } else if (next === CreateOrderArrivalType.PICKUP_POINT) {
          this.service.services = [AVAILABLE_LEVEL_SERVICES.PICKUP_POINT]
        }
      }
    },
    async 'arrival.typeFront'(next) {
      this.arrivalApiAddress = defaultApiAddress()

      if (next > 0) {
        this.arrival.exchangePlaceId = next
      } else if (next < 0 && !this.arrival.storeId) {
        this.arrival.exchangePlaceId = undefined
      }
    },
    'departure.exchangePlaceId'() {
      if (this.getExchangePlacesItems.length === 1) {
        this.arrival.typeFront = -1
      }
    },
    async selectedAvailableAddress(next) {
      if (!next) {
        return
      }

      if (next.value === -1) {
        await this.$store.dispatch('createOrder/arrival/setArrival', {
          ...defaultAddress(),
          exchangePlaceId: this.arrival.exchangePlaceId,
          typeFront: this.arrival.typeFront,
          type: this.arrival.type,
          arrivalType: this.arrival.arrivalType,
          scanVariant: this.arrival.scanVariant,
        })
        if (this.validations.arrival) {
          this.validations.arrival.addressLine1.$reset()
          this.validations.arrival.country.$reset()
          this.validations.arrival.postalCode.$reset()
          this.validations.arrival.city.$reset()
        }

        return
      }

      await this.$store.dispatch('createOrder/arrival/setArrival', {
        ...next,
        exchangePlaceId: this.arrival.typeFront,
        floor: 0,
        typeFront: this.arrival.typeFront,
        type: this.arrival.type,
        arrivalType: this.arrival.arrivalType,
        scanVariant: this.arrival.scanVariant,
      })
    },
  },
})
