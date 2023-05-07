<template>
  <mp-block
    id="retailer-client-page-carrier-infos-block"
    :title="$vuetify.breakpoint.smAndUp ? $t('page.clientPage.carrierInfos.title') : ''"
    :hasBorder="$vuetify.breakpoint.smAndUp"
    :hasMarginBottom="$vuetify.breakpoint.smAndUp"
    titleHasPaddingBottom
  >
    <v-row no-gutters class="client-page-detail-carrier-info-detail">
      <v-col cols="12">
        <v-icon size="1.8rem" v-if="carrierInfos.showCarrierLogo">
          mdi-check-bold
        </v-icon>
        <v-icon size="1.8rem" v-else> mdi-close-thick </v-icon>
        <span
          :class="$vuetify.breakpoint.smAndUp ? 'regular14' : 'regular16'"
          data-id="client-page-detail-carrier-info-logo"
        >
          {{ $t('page.clientPage.carrierInfos.showCarrierLogo') }}
        </span>
      </v-col>
    </v-row>

    <v-row no-gutters class="client-page-detail-carrier-info-detail">
      <v-col cols="12">
        <v-icon size="1.8rem" v-if="carrierInfos.followDelivery">
          mdi-check-bold
        </v-icon>
        <v-icon size="1.8rem" v-else> mdi-close-thick </v-icon>
        <span
          :class="$vuetify.breakpoint.smAndUp ? 'regular14' : 'regular16'"
          data-id="client-page-detail-carrier-info-delivery-follow"
        >
          {{ $t('page.clientPage.carrierInfos.followDelivery') }}
        </span>
      </v-col>
    </v-row>

    <v-row no-gutters class="client-page-detail-carrier-info-detail">
      <v-col cols="12">
        <v-icon size="1.8rem" v-if="carrierInfos.showClaimUrl">
          mdi-check-bold
        </v-icon>
        <v-icon size="1.8rem" v-else> mdi-close-thick </v-icon>
        <span
          :class="$vuetify.breakpoint.smAndUp ? 'regular14' : 'regular16'"
          data-id="client-page-detail-carrier-info-show-claim-url"
        >
          {{ $t('page.clientPage.carrierInfos.showClaimUrl') }}
        </span>
      </v-col>
    </v-row>

    <v-row no-gutters class="client-page-detail-carrier-info-detail">
      <v-col cols="12">
        <v-icon size="1.8rem" v-if="!phoneIsEmpty">
          mdi-check-bold
        </v-icon>
        <v-icon size="1.8rem" v-else> mdi-close-thick </v-icon>
        <span
          v-if="phoneIsEmpty"
          :class="$vuetify.breakpoint.smAndUp ? 'regular14' : 'regular16'"
          data-id="client-page-detail-carrier-info-phone-number"
        >
          {{ $t('page.clientPage.carrierInfos.showPhoneNumber') }}
        </span>
        <span
          v-if="!phoneIsEmpty"
          :class="$vuetify.breakpoint.smAndUp ? 'regular14' : 'regular16'"
          data-id="client-page-detail-carrier-info-phone-number"
        >
          {{
            phoneIsCustom
              ? $t('page.clientPage.carrierInfos.customPhone')
              : $t('page.clientPage.carrierInfos.showPhoneNumber')
          }}
        </span>
      </v-col>
    </v-row>

    <v-row no-gutters class="client-page-detail-carrier-info-detail">
      <v-col cols="12">
        <v-icon size="1.8rem" v-if="!emailIsEmpty">
          mdi-check-bold
        </v-icon>
        <v-icon size="1.8rem" v-else> mdi-close-thick </v-icon>
        <span
          v-if="emailIsEmpty"
          :class="$vuetify.breakpoint.smAndUp ? 'regular14' : 'regular16'"
          data-id="client-page-detail-carrier-info-email"
        >
          {{ $t('page.clientPage.carrierInfos.showEmail') }}
        </span>
        <span
          v-if="!emailIsEmpty"
          :class="$vuetify.breakpoint.smAndUp ? 'regular14' : 'regular16'"
          data-id="client-page-detail-carrier-info-email"
        >
          {{
            emailIsCustom
              ? $t('page.clientPage.carrierInfos.customEmail')
              : $t('page.clientPage.carrierInfos.showEmail')
          }}
        </span>
      </v-col>
    </v-row>
  </mp-block>
</template>

<script lang="ts">
import Vue from 'vue'

import mpBlock from '@/components/block/block.vue'
import { CarrierContactType } from '@/constants'
import { ClientPageConfigCarrierInfos } from '@/types'

export default Vue.extend({
  name: 'client-page-detail-carrier-infos',
  components: {
    mpBlock,
  },
  props: {
    carrierInfos: {
      type: Object as () => ClientPageConfigCarrierInfos,
      required: true,
    },
  },
  computed: {
    phoneIsEmpty(): boolean {
      return (
        this.carrierInfos.phone.type === '' ||
        this.carrierInfos.phone.type === CarrierContactType.EMPTY
      )
    },
    phoneIsCustom(): boolean {
      return this.carrierInfos.phone.type === CarrierContactType.CUSTOM
    },
    emailIsEmpty(): boolean {
      return (
        this.carrierInfos.email.type === '' ||
        this.carrierInfos.email.type === CarrierContactType.EMPTY
      )
    },
    emailIsCustom(): boolean {
      return this.carrierInfos.email.type === CarrierContactType.CUSTOM
    },
  },
})
</script>

<style lang="scss">
#retailer-client-page-carrier-infos-block {
  .client-page-detail-carrier-info-detail {
    display: flex !important;
    align-items: center;
    padding-bottom: 2rem !important;
  }
}
</style>
