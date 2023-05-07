import { ROUTES, EXCHANGE_PLACE_TYPE } from '@/constants'
import ExchangePlaceService from '@/services/exchangePlace/ExchangePlaceService'
import RetailerService from '@/services/retailer/RetailerService'
import StoreService from '@/services/store/StoreService'
import { CreateOrderStateSenderIdentity } from '@/store/modules/createOrder/senderIdentity/types'
import {
  CreateOrderStateEligibility,
  CreateOrderStateMiscellaneous,
} from '@/store/modules/createOrder/types'
import { SnackBarType } from '@/store/types'
import { debounce } from 'debounce'
import Vue from 'vue'

const DEBOUNCE_DELAY = 250

export default Vue.extend({
  data: () => ({
    senderIdentityInitialize: false,
  }),
  computed: {
    senderIdentity(): CreateOrderStateSenderIdentity {
      return this.$store.getters['createOrder/senderIdentity/senderIdentity']
    },
    miscellaneous(): CreateOrderStateMiscellaneous {
      return this.$store.getters['createOrder/miscellaneous']
    },
    validations(): any {
      return this.$store.getters['createOrder/senderIdentity/$v']
    },
    eligibility(): CreateOrderStateEligibility {
      return this.$store.getters['createOrder/eligibility']
    },
    isEditing(): boolean {
      return this.$route.name === ROUTES.editOrder
    },
    rule(): string {
      return this.isEditing ? 'EDIT_ORDERS' : 'CREATE_ORDERS'
    },
  },
  methods: {
    async senderIdentityGetRetailers() {
      try {
        // Get retailers
        if (!this.miscellaneous.retailers.length) {
          this.miscellaneous.retailers = await RetailerService.getFilters({
            forRule: this.rule,
          })
        }

        if (this.senderIdentity.retailerId && !this.senderIdentityInitialize) {
          this.miscellaneous.retailerName = this.miscellaneous.retailers.find(
            retailer => retailer.id === this.senderIdentity.retailerId,
          )!.name
        }

        if (this.miscellaneous.retailers.length === 1) {
          this.senderIdentity.retailerId = this.miscellaneous.retailers[0].id
          await this.senderIdentityGetStores(this.senderIdentity.retailerId)
        }

        if (
          this.senderIdentity.retailerId &&
          this.senderIdentity.storeId &&
          !this.senderIdentityInitialize
        ) {
          await this.senderIdentityGetStores(this.senderIdentity.retailerId)
        }
      } catch {
        this.$store.dispatch('setSnackbar', {
          type: SnackBarType.ERROR,
          message: this.$t('messages.error'),
        })
      }

      return Promise.resolve()
    },
    async senderIdentityGetStores(retailerId: number) {
      try {
        if (retailerId) {
          this.miscellaneous.stores = await StoreService.getFilters({
            forRule: this.rule,
            retailerId,
            active: true,
          })

          if (this.senderIdentity.storeId && !this.senderIdentityInitialize) {
            this.miscellaneous.storeName = this.miscellaneous.stores.find(
              store => store.id === this.senderIdentity.storeId,
            )!.name
          }

          if (this.miscellaneous.stores.length === 1) {
            this.senderIdentity.storeId = this.miscellaneous.stores[0].id
          }
        }
      } catch {
        this.$store.dispatch('setSnackbar', {
          type: SnackBarType.ERROR,
          message: this.$t('messages.error'),
        })
      } finally {
        if (!this.senderIdentityInitialize) {
          this.senderIdentityInitialize = true
          if (this.isEditing && this.senderIdentity.storeId) {
            await this.senderIdentityGetExchangePlaces(this.senderIdentity.storeId)
          }

          this.$nextTick(() => {
            if (this.validations.senderIdentity) {
              this.validations.senderIdentity.$touch()
            }
          })
        }
      }
    },
    senderIdentityGetDebounceStores: debounce(async function(this: any, retailerId: number) {
      await this.senderIdentityGetStores(retailerId)

      return Promise.resolve()
    }, DEBOUNCE_DELAY),
    async senderIdentityGetExchangePlaces(storeId: number) {
      try {
        if (storeId) {
          const localExchangePlaces = await ExchangePlaceService.getFilters({
            forRule: this.rule,
            storeId,
            active: true,
            type: [
              EXCHANGE_PLACE_TYPE.EXCHANGE_PLACE_PFU,
              EXCHANGE_PLACE_TYPE.EXCHANGE_PLACE_STORAGE,
              EXCHANGE_PLACE_TYPE.EXCHANGE_PLACE_STORE,
            ],
          })

          this.miscellaneous.exchangePlaces = localExchangePlaces.map(exchangePlace => {
            return {
              name: exchangePlace.externalId
                ? `${exchangePlace.externalId} - ${exchangePlace.name}`
                : exchangePlace.name,
              id: exchangePlace.id,
            }
          })
        } else {
          this.$nextTick(() => {
            this.eligibility.exchangePlace = null
            this.miscellaneous.exchangePlaces = []
          })
        }
      } catch {
        this.$store.dispatch('setSnackbar', {
          type: SnackBarType.ERROR,
          message: this.$t('messages.error'),
        })
      }
    },
    getDebounceExchangePlaces: debounce(async function(this: any, storeId: number) {
      await this.senderIdentityGetExchangePlaces(storeId)
      return Promise.resolve()
    }, DEBOUNCE_DELAY),
  },
  watch: {
    'senderIdentity.retailerId'(next) {
      this.senderIdentity.storeId = null
      this.senderIdentityGetDebounceStores(next)
      if (!next) {
        this.miscellaneous.retailerName = ''
        this.$nextTick(() => {
          if (this.validations.senderIdentity) {
            this.validations.senderIdentity.retailerId.$reset()
          }
        })

        return
      }

      const retailer = this.miscellaneous.retailers.find(localRetailer => localRetailer.id === next)

      if (retailer) {
        this.miscellaneous.retailerName = retailer.name
      }
    },
    'miscellaneous.retailers'(next: Array<{ id: number; name: string }>) {
      if (next?.length) {
        const retailer = next.find(
          localRetailer => localRetailer.id === this.senderIdentity.retailerId,
        )

        if (retailer) {
          this.miscellaneous.retailerName = retailer.name
        }
      }
    },
    'senderIdentity.storeId': {
      immediate: true,
      handler(next) {
        if (!next) {
          this.miscellaneous.storeName = ''
          this.miscellaneous.stores = []
          this.$nextTick(() => {
            if (this.validations.senderIdentity) {
              this.validations.senderIdentity.storeId.$reset()
            }
          })
        }

        this.getDebounceExchangePlaces(next)

        if (next && this.miscellaneous.stores?.length) {
          this.miscellaneous.storeName = this.miscellaneous.stores.find(
            store => store.id === next,
          )!.name
        }
      },
    },
  },
})
