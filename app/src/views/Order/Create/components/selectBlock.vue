<template>
  <sender-identity v-if="block === CHECKOUT_BLOCKS.SENDER_IDENTITY" :isEditing="isEditing" />
  <state v-else-if="block === CHECKOUT_BLOCKS.STATE" :isEditing="isEditing" />
  <departure
    v-else-if="block === CHECKOUT_BLOCKS.DEPARTURE"
    :isEditing="isEditing"
    @destroyed="$emit('playEligibility')"
  />
  <arrival
    v-else-if="block === CHECKOUT_BLOCKS.ARRIVAL"
    :isEditing="isEditing"
    @destroyed="$emit('playEligibility')"
  />
  <order-content v-else-if="block === CHECKOUT_BLOCKS.ORDER_CONTENT" :isEditing="isEditing" />
  <shipping-date v-else-if="block === CHECKOUT_BLOCKS.SHIPPING_DATE" :isEditing="isEditing" />
  <delivery-date
    v-else-if="block === CHECKOUT_BLOCKS.DELIVERY_DATE"
    :isEditing="isEditing"
    :stepNumber="stepNumber"
  />
  <service
    v-else-if="
      block === CHECKOUT_BLOCKS.SERVICES &&
        !service.services.includes(AVAILABLE_LEVEL_SERVICES.PICKUP_POINT)
    "
    :isEditing="isEditing"
  />
  <pickup-point
    v-else-if="
      block === CHECKOUT_BLOCKS.PICKUP_POINT &&
        service.services.includes(AVAILABLE_LEVEL_SERVICES.PICKUP_POINT)
    "
    :isEditing="isEditing"
  />
  <carriers
    v-else-if="
      block === CHECKOUT_BLOCKS.CARRIERS &&
        !service.services.includes(AVAILABLE_LEVEL_SERVICES.PICKUP_POINT)
    "
  />
  <customer-code v-else-if="block === CHECKOUT_BLOCKS.CUSTOMER_CODE" :isEditing="isEditing" />
  <shipping-contact v-else-if="block === CHECKOUT_BLOCKS.SHIPPING_CONTACT" />
  <delivery-contact v-else-if="block === CHECKOUT_BLOCKS.DELIVERY_CONTACT" />
  <scan v-else-if="block === CHECKOUT_BLOCKS.SCAN" :isEditing="isEditing" />
  <ticket-content v-else-if="block === CHECKOUT_BLOCKS.TICKET_CONTENT" />
</template>

<script lang="ts">
import { AVAILABLE_LEVEL_SERVICES } from '@/constants/shared'
import { CHECKOUT_BLOCKS } from '@/types'

import arrival from '@/views/Order/Create/arrival/arrival.vue'
import carriers from '@/views/Order/Create/carriers/carriers.vue'
import customerCode from '@/views/Order/Create/customerCode/customerCode.vue'
import deliveryContact from '@/views/Order/Create/deliveryContact/deliveryContact.vue'
import deliveryDate from '@/views/Order/Create/deliveryDate/deliveryDate.vue'
import departure from '@/views/Order/Create/departure/departure.vue'
import orderContent from '@/views/Order/Create/orderContent/orderContent.vue'
import pickupPoint from '@/views/Order/Create/pickupPoint/pickupPoint.vue'
import scan from '@/views/Order/Create/scan/scan.vue'
import senderIdentity from '@/views/Order/Create/senderIdentity/senderIdentity.vue'
import service from '@/views/Order/Create/service/services.vue'
import shippingContact from '@/views/Order/Create/shippingContact/shippingContact.vue'
import shippingDate from '@/views/Order/Create/shippingDate/shippingDate.vue'
import ticketContent from '@/views/Order/Create/ticketContent/ticketContent.vue'
import state from '@/views/Order/Create/state/state.vue'

import Vue from 'vue'
import { CreateOrderStateService } from '@/store/modules/createOrder/service/types'
export default Vue.extend({
  name: 'create-order-select-block',
  components: {
    arrival,
    carriers,
    customerCode,
    deliveryContact,
    deliveryDate,
    departure,
    orderContent,
    pickupPoint,
    senderIdentity,
    service,
    shippingContact,
    shippingDate,
    scan,
    ticketContent,
    state,
  },
  props: {
    block: {
      type: String,
      required: true,
    },
    isEditing: {
      type: Boolean,
      required: true,
    },
    stepNumber: {
      type: Number,
      required: true,
    },
  },
  data: () => ({
    CHECKOUT_BLOCKS,
    AVAILABLE_LEVEL_SERVICES,
  }),
  computed: {
    service(): CreateOrderStateService {
      return this.$store.getters['createOrder/service/service']
    },
  },
})
</script>
