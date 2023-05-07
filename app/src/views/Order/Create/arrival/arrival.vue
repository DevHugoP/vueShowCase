<template>
  <v-row no-gutters class="block" id="arrival" data-id="order-create-block-arrival">
    <v-col cols="12" class="header">
      <h2>{{ $t('page.createOrder.titles.arrival') }}</h2>
      <span class="block-info">{{ $t('page.createOrder.infos.arrival') }}</span>
    </v-col>

    <v-col cols="12" class="content">
      <mp-radio-group
        v-if="arrivalShowArrivalType"
        :class="`delivery-type ${arrival.arrivalType ? 'big-margin' : 'small-margin'}`"
        class="radio-group-custom"
        row
        dataId="order-create-arrival-arrivalType"
        v-model="arrival.arrivalType"
        :errors="[]"
        :radioValues="arrivalTypes"
      />

      <div v-if="arrival.arrivalType === CreateOrderArrivalType.HOME">
        <mp-select
          v-show="getExchangePlacesItems.length > 1"
          :class="arrival.typeFront === -1 || arrival.typeFront === -2 ? 'mb-5' : ''"
          :label="`${$t('page.createOrder.steps.step1.labels.endingPoint')} *`"
          v-model="arrival.typeFront"
          @input="validations.arrival.typeFront.$touch()"
          @blur="validations.arrival.typeFront.$touch()"
          :errors="getModelErrors(validations.arrival.typeFront)"
          :isDirty="validations.arrival.typeFront.$dirty"
          :items="getExchangePlacesItems"
          itemText="name"
          itemValue="id"
          :disabled="!senderIdentity.storeId"
          clearable
          dataId="order-create-arrival-typeFront"
          @change="arrivalHandleChangeExchangePlaces($event, true)"
          :attach="`#order-create-arrival-type-front`"
          :dropdownId="`order-create-arrival-type-front`"
        />

        <!-- Other store -->
        <div v-if="arrival.typeFront === -2">
          <mp-select
            class="mb-5"
            :label="`${$t('page.createOrder.steps.step1.labels.store')} *`"
            v-model="arrival.storeId"
            :items="miscellaneous.stores.filter(({ id }) => senderIdentity.storeId !== id)"
            itemText="name"
            itemValue="id"
            :disabled="!senderIdentity.retailerId"
            @input="validations.arrival.storeId.$touch()"
            @blur="validations.arrival.storeId.$touch()"
            :errors="getModelErrors(validations.arrival.storeId)"
            :isDirty="validations.arrival.storeId.$dirty"
            clearable
            @change="arrivalHandleChangeStore($event, false)"
            dataId="order-create-arrival-storeId"
            :attach="`#order-create-arrival-storeId`"
            :dropdownId="`order-create-arrival-storeId`"
          />

          <mp-select
            :label="`${$t('page.createOrder.steps.step1.labels.endingPointPickupPoint')} *`"
            v-model="arrival.exchangePlaceId"
            @input="validations.arrival.exchangePlaceId.$touch()"
            @blur="validations.arrival.exchangePlaceId.$touch()"
            :errors="getModelErrors(validations.arrival.exchangePlaceId)"
            :isDirty="validations.arrival.exchangePlaceId.$dirty"
            :items="arrivalSelectedStoreExchangePlaces"
            itemText="name"
            itemValue="id"
            :disabled="!senderIdentity.storeId && !arrival.storeId"
            clearable
            @change="arrivalHandleChangeExchangePlaces($event, false)"
            dataId="order-create-arrival-exchangePlaceId"
            :attach="`#order-create-arrival-exchangePlace`"
            :dropdownId="`order-create-arrival-exchangePlace`"
          />
        </div>

        <!-- Api address -->
        <div class="mb-5" v-if="arrival.typeFront === -1 && !arrival.scanVariant">
          <mp-autocomplete
            :label="`${$t('action.search.arrival')}`"
            v-model="arrivalApiAddress.apiAddress"
            :errors="[$t('validation.address')]"
            searchingMode
            :loading="arrivalApiAddress.loading"
            :items="arrivalApiAddress.suggestions"
            @loadItems="arrivalOnDebounceInputChange($event)"
            @change="arrivalHandleChangeApiAddress()"
            displayName="address"
            mandatory
            dataId="order-create-arrival-apiAddress"
            id="order-create-arrival-api-address"
            attach="#arrivalApiAddressDropdown"
            dropdownId="arrivalApiAddressDropdown"
            :appendIcon="null"
          />
        </div>

        <!-- Addresses from API client -->
        <div class="mb-5" v-if="arrival.typeFront === -1 && arrival.scanVariant">
          <mp-select
            :label="`${$t('page.createOrder.steps.step1.labels.personalAddress')} *`"
            v-model="selectedAvailableAddress"
            :items="miscellaneous.availableAddresses"
            dataId="order-create-arrival-selectedAvailableAddress"
            attach="#arrivalApiAddressDropdown"
            dropdownId="arrivalApiAddressDropdown"
            :errors="[]"
            returnObject
            :isDirty="false"
          />
        </div>

        <!-- Custom address -->
        <create-order-custom-address
          v-if="arrival.typeFront === -1"
          :address="arrival"
          :validations="validations.arrival"
          @resetFormated="resetFormated()"
          dataId="create-order-arrival"
          :searchLabel="`${$t('common.address.arrival')}`"
        />

        <!-- Address complement -->
        <create-order-itinerary-more-detail
          v-if="arrival.typeFront === -1"
          :address="arrival"
          :validations="validations.arrival"
          dataId="create-order-arrival"
          :showMore.sync="arrivalApiAddress.showMore"
        />
      </div>

      <div
        v-if="arrival.arrivalType === CreateOrderArrivalType.PICKUP_POINT"
        :class="`pickup-point-info${$vuetify.breakpoint.xsOnly ? ' mb-4' : ''}`"
      >
        <v-icon class="main-lighten-52 pr-3" size="1.9rem">mdi-information-outline</v-icon>
        <span class="regular14 main-lighten-52">
          {{ $t('page.order.itinerary.pickupPointInfo') }}
        </span>
      </div>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { ROUTES } from '@/constants'
import { AVAILABLE_LEVEL_SERVICES } from '@/constants/shared'
import { arrivalMixin, validationMixin } from '@/mixins'
import ExchangePlaceService from '@/services/exchangePlace/ExchangePlaceService'
import {
  CreateOrderArrivalType,
  CreateOrderStateArrival,
} from '@/store/modules/createOrder/arrival/types'
import mixins from 'vue-typed-mixins'
import createOrderCustomAddress from '@/views/Order/Create/components/customAddress.vue'
import createOrderItineraryMoreDetail from '@/views/Order/Create/components/moreDetailAddress.vue'
import { Address, CHECKOUT_BLOCKS } from '@/types'
import OrderMapper from '@/services/order/OrderMapper'
import receiptsService from '@/services/receipts/receiptsService'
import { SnackBarType } from '@/store/types'
import { defaultAddress } from '@/store/modules/createOrder/arrival'

export default mixins(validationMixin, arrivalMixin).extend({
  name: 'order-create-arrival',
  components: {
    createOrderCustomAddress,
    createOrderItineraryMoreDetail,
  },
  data: () => ({
    OrderMapper
  }),
  computed: {
    isMoreDetailFilled(): boolean {
      const { addressLine2, doorCode, floor, elevator, comment } = this.arrival

      return (
        Boolean(addressLine2) ||
        Boolean(doorCode) ||
        Boolean(floor) ||
        Boolean(elevator) ||
        Boolean(comment)
      )
    },
    arrivalTypes(): Array<{ label: string; value: string }> {
      return [
        {
          label: this.$t('common.home'),
          value: CreateOrderArrivalType.HOME,
        },
        {
          label: this.$t('common.pickupPoint'),
          value: CreateOrderArrivalType.PICKUP_POINT,
        },
      ]
    },
    checkoutHasScan(): boolean {
      if (!this.miscellaneous.checkout) {
        return false
      }

      const blocks = Object.values(this.miscellaneous.checkout.steps).reduce((acc, step) => {
        return [...acc, ...step]
      }, [])

      return blocks.includes(CHECKOUT_BLOCKS.SCAN)
    },
  },
  methods: {
    resetFormated() {
      delete this.arrival.formated
      this.arrival.formated = OrderMapper.getFormatedAddress(this.arrival)
    },
  },
  async beforeMount() {
    if (
      !this.checkoutHasScan &&
      this.$route.name !== ROUTES.editOrder &&
      this.validations.$invalid
    ) {
      this.arrivalInitialize = true
      if (!this.arrival.arrivalType) {
        this.arrival.arrivalType = CreateOrderArrivalType.HOME
        this.arrival.typeFront = -1
      }
      return
    }

    if (!this.arrival.arrivalType) {
      this.arrival.arrivalType = this.service.services.includes(
        AVAILABLE_LEVEL_SERVICES.PICKUP_POINT,
      )
        ? CreateOrderArrivalType.PICKUP_POINT
        : CreateOrderArrivalType.HOME
    }

    if (this.checkoutHasScan) {
      let localAddress: Address | undefined

      localAddress = this.miscellaneous.availableAddresses.find(
        address => (address as any).value === OrderMapper.getFormatedAddress(this.arrival),
      )

      if (!localAddress && this.miscellaneous.availableAddresses.length > 1) {
        localAddress = this.miscellaneous.availableAddresses[0]
      }

      if (localAddress) {
        this.selectedAvailableAddress = localAddress
        return
      }
    }

    // if formated need to fill google autocomplete else juste set to personalAddress
    if (this.arrival.formated && this.arrival.type !== 'exchangePlace') {
      this.arrival.typeFront = -1
      await this.arrivalOnInputChange(this.arrival.formated)
    } else if (!this.arrival.formated && this.arrival.type !== 'exchangePlace') {
      if (this.arrival.arrivalType === CreateOrderArrivalType.HOME) {
        this.$nextTick(() => {
          this.arrival.typeFront = -1
          this.$nextTick(() => {
            this.arrivalApiAddress.suggestions = [
              {
                placeId: '',
                address: this.$t('page.createOrder.steps.step1.labels.personalAddress'),
              },
            ]
            this.arrivalApiAddress.apiAddress = this.arrivalApiAddress.suggestions[0]
          })
        })
      }
    }

    const saveExchangePlaceId = this.arrival.exchangePlaceId

    if (saveExchangePlaceId && saveExchangePlaceId > 0) {
      const exchangePlace = await ExchangePlaceService.get(saveExchangePlaceId as number)
      this.arrival.storeId = exchangePlace.storeId as number

      if (this.senderIdentity.storeId !== exchangePlace.storeId) {
        this.arrival.typeFront = -2
        await this.arrivalHandleChangeStore(this.arrival.storeId, true)
        this.$nextTick(() => {
          this.validations.arrival.$touch()
        })
      } else {
        this.arrival.exchangePlaceId = saveExchangePlaceId
        this.arrival.typeFront = saveExchangePlaceId as number
      }
    }

    setTimeout(() => {
      if (this.arrival.typeFront === -1) {
        this.arrivalApiAddress.showMore = this.isMoreDetailFilled
      }

      if (!this.arrivalInitialize) {
        this.arrivalInitialize = true
        this.validations.arrival.$touch()
      }
    }, 500)
  },
  watch: {
    'miscellaneous.checkout': {
      immediate: true,
      async handler() {
        if (
          this.checkoutHasScan &&
          this.scan.ticket &&
          !this.miscellaneous.availableAddresses?.length
        ) {
          try {
            const response = await receiptsService.get(this.scan.ticket, {
              retailerId: this.senderIdentity.retailerId!,
            })
            if (!response.delivery?.addresses?.length) {
              this.miscellaneous.availableAddresses = []
            } else {
              const localAvailableAddresses = []
              response.delivery.addresses.map((address: Address) => {
                if (address.addressLine1 && address.postalCode && address.country && address.city) {
                  localAvailableAddresses.push({
                    ...address,
                    text: OrderMapper.getFormatedAddress(address),
                    value: OrderMapper.getFormatedAddress(address),
                  })
                }
              })
              if (localAvailableAddresses?.length) {
                localAvailableAddresses.push({
                  ...defaultAddress(),
                  text: this.$t('common.otherAddress'),
                  value: -1,
                })
                this.miscellaneous.availableAddresses = localAvailableAddresses
                this.arrival.scanVariant = true
              }
            }

            const localAddress = this.miscellaneous.availableAddresses.find(
              address => (address as any).value === OrderMapper.getFormatedAddress(this.arrival),
            )

            if (localAddress) {
              this.selectedAvailableAddress = localAddress
              this.arrivalApiAddress.apiAddress = null
            }

            this.arrival.typeFront = -1
          } catch (e) {
            this.$store.dispatch('setSnackbar', {
              type: SnackBarType.ERROR,
              message: this.$t('messages.error'),
            })
          }
        }
      },
    },
    'miscellaneous.availableAddresses'(next) {
      if (!this.selectedAvailableAddress && next?.length === 2) {
        this.selectedAvailableAddress = next[0]
      }
    },
  },
  destroyed() {
    if (this.checkoutHasScan) {
      let currentAddressIndex = this.miscellaneous.availableAddresses.findIndex(
        address => (address as any).value === OrderMapper.getFormatedAddress(this.arrival),
      )
      let newAddress: CreateOrderStateArrival = { ...this.arrival }
      if (
        newAddress.addressLine1 &&
        newAddress.postalCode &&
        newAddress.country &&
        newAddress.city
      ) {
        let listedNewAddress = {
          ...newAddress,
          text: OrderMapper.getFormatedAddress(newAddress),
          value: OrderMapper.getFormatedAddress(newAddress),
        }
        this.miscellaneous.availableAddresses[currentAddressIndex] = listedNewAddress
        this.arrival = listedNewAddress
      }
    }

    this.miscellaneous.saveAddress.arrival = JSON.parse(
      JSON.stringify({
        address: this.arrival,
        contact: this.deliveryContact.contact,
      }),
    )

    this.miscellaneous.hasDeliveryContactAlreadyBeenSet = true

    this.$emit('destroyed')
  },
})
</script>

<style lang="scss" scoped>
#arrival {
  .pickup-point-info {
    background-color: $main-lighten-80-color;
    padding: 1.5rem 1.9rem 1.5rem 1.9rem;
    display: flex;
    align-items: flex-start;
  }
}
</style>
