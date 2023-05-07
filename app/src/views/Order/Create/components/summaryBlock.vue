<template>
  <div class="summary-block">
    <h4>{{ $t(`page.createOrder.titles.${blockNameBackToblockNameFront[block]}`) }}</h4>

    <div v-if="block === CHECKOUT_BLOCKS.SENDER_IDENTITY" class="d-flex align-center mt-2">
      <v-icon size="1.8rem" class="main-color mr-2">mdi-storefront-outline</v-icon>
      <span class="regular14">{{ senderIdentityDisplay }}</span>
    </div>

    <div v-else-if="block === CHECKOUT_BLOCKS.DEPARTURE" class="d-flex align-center mt-2">
      <v-icon size="1.8rem" class="main-color mr-2">mdi-map-marker</v-icon>
      <span class="regular14">{{ departureDisplay }}</span>
    </div>

    <div v-else-if="block === CHECKOUT_BLOCKS.ARRIVAL" class="d-flex align-center mt-2">
      <v-icon size="1.8rem" class="main-color mr-2">mdi-map-marker</v-icon>
      <span class="regular14">{{ arrivalDisplay }}</span>
    </div>

    <div
      v-else-if="block === CHECKOUT_BLOCKS.ORDER_CONTENT"
      class="d-flex align-center justify-space-between mt-2"
    >
      <div class="pr-1">
        <span class="regular12 main-lighten-52">{{ $t('page.order.summary.nbProducts') }}</span>
        <div>
          <span class="regular14">{{ nbOfProducts }}</span>
        </div>
      </div>

      <div class="pl-1">
        <span class="regular12 main-lighten-52">{{ $t('page.order.summary.nbPackages') }}</span>
        <div>
          <span class="regular14">{{ nbOfPackages }}</span>
        </div>
      </div>
    </div>

    <div
      v-else-if="block === CHECKOUT_BLOCKS.SHIPPING_DATE"
      class="d-flex align-center justify-space-between mt-2"
    >
      <div class="pr-1">
        <span class="regular12 main-lighten-52">{{ $t('common.date') }}</span>
        <div>
          <span class="regular14">{{ getDate(shippingDate.interval[0]) }}</span>
        </div>
      </div>

      <div class="pl-1">
        <span class="regular12 main-lighten-52">{{ $t('common.schedule') }}</span>
        <div>
          <span class="regular14">{{ getSchedule(shippingDate.interval[0]) }}</span>
        </div>
      </div>
    </div>

    <div v-else-if="block === CHECKOUT_BLOCKS.SERVICES" class="mt-2">
      <carrier-service-detail
        :params="{}"
        :orderEligibility="{ services: service.services }"
        :hasEditIcon="false"
        lightMode
      />
    </div>

    <div
      v-else-if="block === CHECKOUT_BLOCKS.DELIVERY_DATE"
      class="d-flex align-center justify-space-between mt-2"
    >
      <div class="pr-1">
        <span class="regular12 main-lighten-52">{{ $t('common.date') }}</span>
        <div>
          <span class="regular14">{{ getDate(deliveryDate.interval[0]) }}</span>
        </div>
      </div>

      <div class="pl-1">
        <span class="regular12 main-lighten-52">{{ $t('common.schedule') }}</span>
        <div>
          <span class="regular14">{{ getSchedule(deliveryDate.interval[0]) }}</span>
        </div>
      </div>
    </div>

    <div v-else-if="block === CHECKOUT_BLOCKS.CARRIERS" class="d-flex align-center mt-2">
      <span class="medium14">
        {{
          carriers.carrierSelection
            ? selectedCarrierName
            : $t('common.unknown')
        }}
      </span>
    </div>

    <div v-else-if="block === CHECKOUT_BLOCKS.CUSTOMER_CODE" class="d-flex align-center mt-2">
      <span class="regular14"> {{ customerCode.externalOrderId }} </span>
    </div>

    <div v-else-if="block === CHECKOUT_BLOCKS.SHIPPING_CONTACT">
      <div class="mt-2">
        <span class="regular14">
          {{ `${shippingContact.contact.lastName} ${shippingContact.contact.firstName}` }}
        </span>
      </div>

      <div class="mt-2">
        <span class="regular14 main-lighten-52"> {{ shippingContact.contact.email }} </span>
      </div>
      <div class="mt-2">
        <span class="regular14 main-lighten-52"> {{ shippingContact.contact.phone }} </span>
      </div>
    </div>

    <div v-else-if="block === CHECKOUT_BLOCKS.PICKUP_POINT" class="mt-2">
      <div class="d-flex align-center mb-3" v-if="pickupPoint.pickupPoint">
        <v-icon size="1.8rem" class="main-color mr-2">mdi-storefront-outline</v-icon>
        <span class="regular14 main-color">
          {{ pickupPoint.pickupPoint.address.title }}
        </span>
      </div>

      <span class="regular14">
        {{ OrderMapper.getFormatedAddress(pickupPoint.pickupPoint.address) }}
      </span>
    </div>

    <div v-else-if="block === CHECKOUT_BLOCKS.SCAN" class="mt-2">
      <span class="regular14"> {{ scan.ticket }} </span>
    </div>

    <div v-else-if="block === CHECKOUT_BLOCKS.TICKET_CONTENT" class="mt-2 d-flex">
      <div class="pr-1">
        <span class="regular12 main-lighten-52">{{ $t('page.order.summary.nbProducts') }}</span>
        <div>
          <span class="regular14">{{ nbOfProducts }}</span>
        </div>
      </div>

      <div class="pl-1">
        <span class="regular12 main-lighten-52">{{ $t('page.order.summary.nbPackages') }}</span>
        <div>
          <span class="regular14">{{ nbOfPackages }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { AVAILABLE_LEVEL_SERVICES } from '@/constants/shared'
import {
  CreateOrderStateEligibility,
  CreateOrderStateMiscellaneous,
} from '@/store/modules/createOrder/types'
import { CHECKOUT_BLOCKS, DateInterval } from '@/types'
import Vue from 'vue'
import { blockNameBackToblockNameFront } from '../create.vue'

import carrierServiceDetail from '@/views/Carrier/Detail/general/service.vue'
import OrderMapper from '@/services/order/OrderMapper'
import { dateHelper, dateHelperGetTimezonedDate } from '@/helpers/dateHelper'
import { CreateOrderStateShippingDate } from '@/store/modules/createOrder/shippingDate/types'
import { CreateOrderStateService } from '@/store/modules/createOrder/service/types'
import { CreateOrderStateDeliveryDate } from '@/store/modules/createOrder/deliveryDate/types'
import { CreateOrderStateCarriers } from '@/store/modules/createOrder/carriers/types'
import { CreateOrderStateCustomerCode } from '@/store/modules/createOrder/customerCode/types'
import { CreateOrderStateShippingContact } from '@/store/modules/createOrder/shippingContact/types'
import { CreateOrderStatePickupPoint } from '@/store/modules/createOrder/pickupPoint/types'
import { CreateOrderStateScan } from '@/store/modules/createOrder/scan/types'
import { CreateOrderStateDeparture } from '@/store/modules/createOrder/departure/types'
import { CreateOrderStateArrival } from '@/store/modules/createOrder/arrival/types'
import { CreateOrderStateOrderContent } from '@/store/modules/createOrder/orderContent/types'

export default Vue.extend({
  name: 'order-create-summary-block',
  components: {
    carrierServiceDetail,
  },
  props: {
    block: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    blockNameBackToblockNameFront,
    CHECKOUT_BLOCKS,
    OrderMapper,
  }),
  computed: {
    shippingDate(): CreateOrderStateShippingDate {
      return this.$store.getters['createOrder/shippingDate/shippingDate']
    },
    service(): CreateOrderStateService {
      return this.$store.getters['createOrder/service/service']
    },
    deliveryDate(): CreateOrderStateDeliveryDate {
      return this.$store.getters['createOrder/deliveryDate/deliveryDate']
    },
    carriers(): CreateOrderStateCarriers {
      return this.$store.getters['createOrder/carriers/carriers']
    },
    customerCode(): CreateOrderStateCustomerCode {
      return this.$store.getters['createOrder/customerCode/customerCode']
    },
    shippingContact(): CreateOrderStateShippingContact {
      return this.$store.getters['createOrder/shippingContact/shippingContact']
    },
    pickupPoint(): CreateOrderStatePickupPoint {
      return this.$store.getters['createOrder/pickupPoint/pickupPoint']
    },
    scan(): CreateOrderStateScan {
      return this.$store.getters['createOrder/scan/scan']
    },
    departure(): CreateOrderStateDeparture {
      return this.$store.getters['createOrder/departure/departure']
    },
    arrival(): CreateOrderStateArrival {
      return this.$store.getters['createOrder/arrival/arrival']
    },
    orderContent(): CreateOrderStateOrderContent {
      return this.$store.getters['createOrder/orderContent/orderContent']
    },
    miscellaneous(): CreateOrderStateMiscellaneous {
      return this.$store.getters['createOrder/miscellaneous']
    },
    eligibility(): CreateOrderStateEligibility {
      return this.$store.getters['createOrder/eligibility']
    },
    selectedCarrierName(): string | undefined {
      return this.eligibility.filteredCarriers.find(
        (carrier) => carrier.Carrier.code === this.carriers.carrierSelection?.carrierCodes[0]
      )?.Carrier.name
    },
    senderIdentityDisplay(): string {
      return `${this.miscellaneous.retailerName} - ${this.miscellaneous.storeName}`
    },
    departureDisplay(): string {
      if (this.departure.type === 'exchangePlace') {
        return this.eligibility?.exchangePlace?.name || ''
      }
      return this.departure.formated || OrderMapper.getFormatedAddress(this.departure)
    },
    arrivalDisplay(): string {
      if (this.arrival.type === 'exchangePlace') {
        return this.miscellaneous?.deliveryExchangePlace?.name || ''
      } else if (this.service.services.includes(AVAILABLE_LEVEL_SERVICES.PICKUP_POINT)) {
        return this.$t('common.pickupPoint')
      }

      return this.arrival.formated || OrderMapper.getFormatedAddress(this.arrival)
    },
    nbOfPackages(): number {
      return this.orderContent.packages.reduce((acc, localPackage) => {
        acc += localPackage.quantity
        return acc
      }, 0)
    },
    nbOfProducts(): number {
      return this.orderContent.packages.reduce((acc, localPackage) => {
        const productsQuantity = localPackage.products!.reduce((accProducts, localProduct) => {
          accProducts += localProduct.quantity

          return accProducts
        }, 0)
        acc += localPackage.quantity * productsQuantity

        return acc
      }, 0)
    },
  },
  methods: {
    getDate(interval: DateInterval): string {
      return dateHelper.formatToTimezone(interval.start, 'UTC', 'P')
    },
    getSchedule(interval: DateInterval): string {
      return `${dateHelper.formatToTimezone(
        dateHelperGetTimezonedDate(interval.start),
        'UTC',
        'p',
      )} - ${dateHelper.formatToTimezone(dateHelperGetTimezonedDate(interval.end), 'UTC', 'p')}`
    },
  },
})
</script>

<style lang="scss">
.summary-block {
  .block-wrapper {
    margin-bottom: 0 !important;
    margin-top: 0 !important;
  }
}
</style>
