<template>
  <v-container id="exchange-place-detail-address" data-id="exchangePlace-detail-address">
    <mp-block
      id="exchange-place-detail-address-block"
      :title="$vuetify.breakpoint.smAndUp ? $t('page.exchangePlace.address.title') : ''"
      :hasBorder="$vuetify.breakpoint.smAndUp"
      :hasMarginBottom="$vuetify.breakpoint.smAndUp"
      titleHasPaddingBottom
    >
      <v-row no-gutters>
        <v-col cols="12">
          <span
            :class="$vuetify.breakpoint.smAndUp ? 'regular14' : 'medium16'"
            data-id="exchangePlace-detail-address-addressLine1"
          >
            {{ address.addressLine1 }}
          </span>
        </v-col>
      </v-row>

      <v-row no-gutters v-if="address.addressLine2">
        <v-col cols="12">
          <span
            :class="$vuetify.breakpoint.smAndUp ? 'regular14' : 'medium16'"
            data-id="exchangePlace-detail-address-addressLine2"
          >
            {{ address.addressLine2 }}
          </span>
        </v-col>
      </v-row>

      <v-row no-gutters>
        <v-col cols="12">
          <span
            :class="$vuetify.breakpoint.smAndUp ? 'regular14' : 'medium16'"
            data-id="exchangePlace-detail-address-postalCodeAndCity"
          >
            {{ address.postalCode }} {{ address.city }}
          </span>
        </v-col>
      </v-row>

      <v-row no-gutters>
        <v-col cols="12">
          <span
            :class="$vuetify.breakpoint.smAndUp ? 'regular14' : 'medium16'"
            data-id="exchangePlace-detail-address-country"
          >
            {{ $t(`common.country.${address.country}`) }}
          </span>
        </v-col>
      </v-row>

      <v-row no-gutters v-if="address.comment">
        <v-col cols="12">
          <span
            :class="$vuetify.breakpoint.smAndUp ? 'regular14' : 'medium16'"
            data-id="exchangePlace-detail-address-comment"
          >
            {{ address.comment }}
          </span>
        </v-col>
      </v-row>
    </mp-block>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'

import { Address } from '@/types'

import mpBlock from '@/components/block/block.vue'

export default Vue.extend({
  name: 'exchange-place-detail-address',
  components: {
    mpBlock,
  },
  props: {
    address: {
      type: Object as () => Address,
      required: true,
    },
  },
})
</script>

<style lang="scss" scoped>
#exchange-place-detail-address {
  padding: 0;

  @media #{map-get($display-breakpoints, 'xs-only')} {
    border-top: solid 0.1rem $main-lighten-74-color;
  }
}
</style>
