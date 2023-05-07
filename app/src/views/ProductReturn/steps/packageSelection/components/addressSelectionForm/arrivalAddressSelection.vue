<template>
  <div id="address-selection-form" class="pt-4">
    <v-row no-gutters class="mb-5 address-size-wrapper">
      <div
        :class="`address-wrapper${index === selectedAddress ? ' selected' : ''}`"
        v-for="(address, index) in addresses"
        :key="`address-selection-${index}`"
        @click="selectedAddress = index"
      >
        <div>
          <div class="address-header d-flex align-center justify-space-between">
            <p :class="`text-center${$vuetify.breakpoint.xsOnly ? ' mb-0' : ''}`">
              <span v-if="!deliveryAddress.exchangePlaceId" class="regular16">
                {{ address.label }}
              </span>
              <span v-if="deliveryAddress.exchangePlaceId" class="regular16">
                {{ store?.name }} - {{ exchangePlace?.name }}
              </span>
            </p>
            <mp-button
              :class="`address-btn-modify mt-0 pt-0${$vuetify.breakpoint.xsOnly ? ' pa-0' : ''}`"
              :dataId="`${index}-edit-return-place`"
              :text="address.buttonLabel"
              format="link"
              linkColor="black"
              :icon="address.buttonIcon"
              @click="address.clickEvent"
            />
          </div>

          <div v-if="address.details">
            <p class="regular14">
              {{ address.details.addressLine1 }}<br />
              {{
                $t(
                  address.details.elevator
                    ? 'page.detailOrder.itinerary.withElevator'
                    : 'page.detailOrder.itinerary.withoutElevator',
                )
              }}<br />
              {{ address.details.postalCode }}
              {{ address.details.city }}<br />
              <span v-if="address.details.floor">
                {{ $t('page.detailOrder.itinerary.floor') }}:
                {{ address.details.floor }}
              </span>
              <span v-if="address.details.doorCode">
                {{ $t('page.detailOrder.itinerary.doorCode') }}:
                {{ address.details.doorCode }}
              </span>
            </p>
          </div>
        </div>
      </div>
    </v-row>

    <edit-arrival-address-modal
      v-if="showEditAddressModal"
      :showDialog="showEditAddressModal"
      dataId="edit-return-arrival-address-modal"
      :retailer="retailer"
      :store="store"
      :exchangePlaces="exchangePlaces"
      :exchangePlaceId="deliveryAddress.exchangePlaceId"
      :address="deliveryAddress"
      @close="showEditAddressModal = false"
      @confirm="handleChangeAddress"
    />
  </div>
</template>

<script lang="ts">
import mixins from 'vue-typed-mixins'

import editArrivalAddressModal from './modal/editArrivalAddress.vue'
import { authorizationMixin } from '@/mixins'
import { validationMixin } from '@/mixins'
import { Address, Filters, RulesKey } from '@/types'
import { ROUTES } from '@/constants'
import ExchangePlaceService from '@/services/exchangePlace/ExchangePlaceService'
import RetailerService from '@/services/retailer/RetailerService'
import StoreService from '@/services/store/StoreService'
import { SnackBarType } from '@/store/types'
const forRule: RulesKey = 'READ_ORDER_DETAIL'
import { EXCHANGE_PLACE_TYPE } from '@/constants'

export default mixins(authorizationMixin, validationMixin).extend({
  name: 'arrival-address-selection',
  components: { editArrivalAddressModal },
  props: {
    retailerId: {
      type: Number,
      required: true,
    },
    storeId: {
      type: Number,
      required: true,
    },
    deliveryAddress: {
      type: Object as () => Address,
      required: true,
    },
  },
  data: () => ({
    addresses: [] as Array<Record<string, any>>,
    selectedAddress: 0,
    showEditAddressModal: false,
    ROUTES,
    retailer: null as Filters | null,
    store: null as Filters | null,
    exchangePlaces: [] as Filters[],
    exchangePlace: null as Filters | null,
  }),
  beforeMount() {
    const { deliveryAddress } = this

    this.addresses = [
      {
        label: this.$t('common.address.base'),
        type: 'address',
        details: deliveryAddress,
        value: 0,
        buttonLabel: this.$t('action.modify.base'),
        buttonIcon: 'pencil',
        clickEvent: this.handleEdit,
      },
    ]
  },
  async mounted() {
    try {
      const [inRetailer] = await RetailerService.getFilters({
        retailerId: this.retailerId,
        storeId: this.storeId,
        id: this.deliveryAddress.exchangePlaceId,
        forRule,
      })
      this.retailer = inRetailer

      const [inStore] = await StoreService.getFilters({
        retailerId: this.retailerId,
        storeId: this.storeId,
        id: this.deliveryAddress.exchangePlaceId,
        forRule,
      })
      this.store = inStore

      const exchangePlaces = await ExchangePlaceService.getFilters({
        retailerId: this.retailerId,
        storeId: this.storeId,
        forRule,
        active: true,
        type: [
          EXCHANGE_PLACE_TYPE.EXCHANGE_PLACE_PFU,
          EXCHANGE_PLACE_TYPE.EXCHANGE_PLACE_STORAGE,
          EXCHANGE_PLACE_TYPE.EXCHANGE_PLACE_STORE,
        ],
      })
      this.exchangePlaces = exchangePlaces

      if (this.deliveryAddress.exchangePlaceId) {
        this.exchangePlace =
          exchangePlaces.find(
            exchangePlace => exchangePlace.id === this.deliveryAddress.exchangePlaceId,
          ) || null
      }
    } catch {
      this.$store.dispatch('setSnackbar', {
        type: SnackBarType.ERROR,
        message: this.$t('messages.error'),
      })
    }
  },
  methods: {
    handleChangeAddress(returnAddress: Address) {
      this.addresses[0].details = returnAddress

      this.exchangePlace =
        this.exchangePlaces.find(
          exchangePlace => exchangePlace.id === returnAddress.exchangePlaceId,
        ) || null

      this.$emit('updateDeliveryAddress', returnAddress)
      this.showEditAddressModal = false
    },
    handleEdit() {
      this.showEditAddressModal = true
    },
  },
})
</script>

<style lang="scss">
#address-selection-form {
  .ship {
    background-color: $main-lighten-80-color !important;
  }

  .address-size-wrapper {
    width: 100%;

    .address-wrapper {
      width: 100%;
      padding: 2rem;
      border: $main-lighten-65-color 0.1rem solid;
      border-radius: 0.4rem;
      align-items: flex-start;

      &.selected {
        border: $main-color 0.2rem solid;
      }

      &:not(:first-child) {
        margin-top: 2rem;
      }

      @media #{map-get($display-breakpoints, 'xs-only') } {
        .address-header {
          margin-bottom: 2rem;

          .address-btn-modify {
            height: fit-content;
          }
        }
      }
    }
    .v-item--active {
      border: $main-color 0.1rem solid;
    }
  }
}
</style>
