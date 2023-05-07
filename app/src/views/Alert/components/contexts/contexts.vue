<template>
  <v-row no-gutters class="contexts">
    <v-col
      :cols="
        subscription.storeIds && subscription.storeIds.length && $vuetify.breakpoint.smAndUp
          ? 6
          : 12
      "
      class="d-flex align-center"
    >
      <v-icon class="main-color" size="1.8rem">mdi-home-variant</v-icon>
      <span class="regular16 ml-2">{{ getRetailerName(subscription.retailerId) }}</span>
    </v-col>
    <v-col
      :cols="$vuetify.breakpoint.smAndUp ? 6 : 12"
      v-if="subscription.storeIds && subscription.storeIds.length"
      :class="`d-flex ${$vuetify.breakpoint.xsOnly ? 'mt-4 align-start' : 'align-start'}`"
    >
      <v-icon class="pr-2 main-color" size="1.8rem">mdi-storefront-outline</v-icon>
      <div v-if="$vuetify.breakpoint.smAndUp">
        <div
          v-for="(storeId, index) in subscription.storeIds"
          :key="`stores-${index}`"
          :class="`store${index === 0 ? ' first' : ''}`"
        >
          <span class="regular16">
            {{ getStoreName(subscription.retailerId, storeId) }}
          </span>
        </div>
      </div>
      <div v-else @click="collapseShowStore = !collapseShowStore" class="mobile">
        <div class="header-wrapper">
          <span class="regular16"> {{ `${subscription.storeIds.length} magasins` }} </span>
          <v-icon class="chevron">{{ `mdi-chevron-${collapseShowStore ? 'up' : 'down'}` }}</v-icon>
        </div>
        <div class="stores" v-if="collapseShowStore">
          <div
            v-for="(storeId, index) in subscription.storeIds"
            :key="`stores-${index}`"
            :class="`store${index === 0 ? ' first' : ''}`"
          >
            <span class="regular14">
              {{ getStoreName(subscription.retailerId, storeId) }}
            </span>
          </div>
        </div>
      </div>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'

import { AlertSubscriptionFront, DetailAlertRetailer } from '@/types'

export default Vue.extend({
  name: 'alert-detail-context',
  props: {
    subscription: {
      type: Object as () => AlertSubscriptionFront,
      required: true,
    },
    retailers: {
      type: Array as () => DetailAlertRetailer[],
      required: true,
    },
  },
  data: () => ({
    collapseShowStore: false,
  }),
  methods: {
    getRetailerName(retailerId: number) {
      const name = this.retailers.find(retailer => retailer.id === retailerId)?.name
      return name || this.$t('page.alert.config.allRetailer')
    },
    getStoreName(retailerId: number, storeId: number) {
      return this.retailers
        .find(retailer => retailer.id === retailerId)
        ?.stores?.find(store => store.id === storeId)?.name
    },
  },
})
</script>

<style lang="scss" scoped>
.contexts {
  .mobile {
    width: 100%;

    .header-wrapper {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }

    .stores {
      border-left: 0.1rem solid $main-lighten-52-color;
      padding: 1rem;
    }
  }
}
</style>
