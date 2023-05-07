<template>
  <v-row no-gutters class="block" data-id="order-create-block-senderIdentity">
    <v-col cols="12" class="header">
      <h2>{{ $t('page.createOrder.titles.senderIdentity') }}</h2>
      <span class="block-info">{{ $t('page.createOrder.infos.senderIdentity') }}</span>
    </v-col>

    <v-col cols="12" class="content">
      <!-- retailer  -->
      <mp-select
        class="mb-5"
        :label="`${$t('page.orders.filters.retailer')} *`"
        v-model="senderIdentity.retailerId"
        @input="validations.senderIdentity.retailerId.$touch()"
        @blur="validations.senderIdentity.retailerId.$touch()"
        :errors="getModelErrors(validations.senderIdentity.retailerId)"
        :isDirty="validations.senderIdentity.retailerId.$dirty"
        :items="miscellaneous.retailers"
        itemText="name"
        itemValue="id"
        dataId="order-create-senderIdentity-retailerId"
        :attach="`#order-create-itinary-retailer`"
        :dropdownId="`order-create-itinary-retailer`"
        :disabled="isEditing || (miscellaneous.retailers && miscellaneous.retailers.length === 1)"
        :search="{ model: '', label: $t('action.search.base') }"
      />

      <!-- store  -->
      <mp-select
        :class="`${showCheckoutSelect ? 'mb-5' : ''}`"
        :label="`${$t('page.orders.filters.store')} *`"
        v-model="senderIdentity.storeId"
        @input="validations.senderIdentity.storeId.$touch()"
        @blur="validations.senderIdentity.storeId.$touch()"
        :errors="getModelErrors(validations.senderIdentity.storeId)"
        :isDirty="validations.senderIdentity.storeId.$dirty"
        :items="miscellaneous.stores"
        itemText="name"
        itemValue="id"
        :disabled="!miscellaneous.stores.length > 0 || isEditing || miscellaneous.stores === 1"
        dataId="order-create-senderIdentity-storeId"
        :attach="`#order-create-itinary-store`"
        :dropdownId="`order-create-itinary-store`"
        :search="{ model: '', label: $t('action.search.base') }"
      />

      <!-- checkout -->
      <mp-select
        v-if="showCheckoutSelect"
        :label="`${$t('page.order.common.checkout')} *`"
        v-model="selectedCheckout"
        :errors="[]"
        :isDirty="false"
        :items="availableCheckouts"
        :disabled="!senderIdentity.retailerId || !senderIdentity.storeId"
        itemText="name"
        itemValue="id"
        dataId="order-create-senderIdentity-checkout"
        :attach="`#order-create-itinary-checkout`"
        :dropdownId="`order-create-itinary-checkout`"
        returnObject
      />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { senderIdentityMixin, validationMixin } from '@/mixins'

import mixins from 'vue-typed-mixins'
import { ROUTES } from '@/constants'
import { Checkout } from '@/types'

export default mixins(validationMixin, senderIdentityMixin).extend({
  name: 'order-create-senderIdentity',
  props: {
    availableCheckouts: {
      type: Array as () => Checkout[],
      required: true,
    },
    showCheckoutSelect: {
      type: Boolean,
      required: true,
    },
  },
  data: () => ({
    selectedCheckout: null as Checkout | null,
  }),
  async mounted() {
      await this.senderIdentityGetRetailers()
  },
  async beforeMount() {
    if (this.$route.name !== ROUTES.editOrder) {
      this.senderIdentityInitialize = true
    }

    if (this.miscellaneous.checkout) {
      this.selectedCheckout = this.miscellaneous.checkout
    }
  },
  watch: {
    selectedCheckout(next) {
      this.$emit('checkout', next)
    },
    'miscellaneous.checkout'(next) {
      this.selectedCheckout = next
    },
  },
})
</script>
