<template>
  <mp-block
    id="retailer-client-page-footer-block"
    :title="$vuetify.breakpoint.smAndUp ? $t('page.clientPage.footer.title') : ''"
    :hasBorder="$vuetify.breakpoint.smAndUp"
    :hasMarginBottom="$vuetify.breakpoint.smAndUp"
    titleHasPaddingBottom
  >
    <v-row no-gutters class="info-wrapper">
      <v-col cols="12" class="title-wrapper">
        <span class="regular14 main-lighten-52 ">
          {{ $t('common.phoneNumber') }}
        </span>

        <div class="d-flex align-center">
          <span class="regular14 main-color value-wrapper">
            {{ footer.phone.number || $t(`technical.clientPage.footer.type.${footer.phone.type}`) }}
          </span>
        </div>
      </v-col>
    </v-row>
    <v-divider v-if="footer.customerServiceUrl" class="divider" />

    <v-row no-gutters class="info-wrapper" v-if="footer.customerServiceUrl">
      <v-col cols="12" class="title-wrapper">
        <span class="regular14 main-lighten-52 ">
          {{ $t('page.retailers.URLClientSpace') }}
        </span>

        <div class="d-flex align-center">
          <span class="regular14 main-color value-wrapper">{{ footer.customerServiceUrl }}</span>
        </div>
      </v-col>
    </v-row>
    <v-divider v-if="footer.legalNotice" class="divider" />

    <v-row no-gutters class="info-wrapper" v-if="footer.legalNotice">
      <v-col cols="12" class="title-wrapper flex-column">
        <span class="regular14 main-lighten-52 ">
          {{ $t('page.retailerDetail.clientPage.mention') }}
        </span>

        <div class="d-flex align-center">
          <span class="regular14 main-color value-wrapper">{{ footer.legalNotice }}</span>
        </div>
      </v-col>
    </v-row>
    <v-divider v-if="footer.criticalScore" class="divider" />

    <v-row no-gutters class="info-wrapper" v-if="footer.criticalScore">
      <v-col cols="12" class="title-wrapper">
        <span class="regular14 main-lighten-52 ">
          {{ $t('page.retailerDetail.clientPage.note') }}
        </span>

        <div class="d-flex align-center">
          <span class="regular14 main-color value-wrapper">
            {{ footer.criticalScore + ' / 10' }}
          </span>
        </div>
      </v-col>
    </v-row>
  </mp-block>
</template>

<script lang="ts">
import Vue from 'vue'

import mpBlock from '@/components/block/block.vue'

export default Vue.extend({
  name: 'client-page-detail-footer',
  components: {
    mpBlock,
  },
  props: {
    footer: {
      type: Object as () => Record<string, any>,
      required: true,
    },
  },
})
</script>

<style lang="scss">
#retailer-client-page-footer-block {
  .divider {
    border-color: $main-lighten-74-color
  }
  .info-wrapper {
    padding: 1.6rem 0;

    &:last-child {
        padding-bottom: 0;
      }

    &:first-child {
      padding-top: 0;
    }

    .info-wrapper-title {
      span {
        color: $main-lighten-52-color;
      }
    }

    .main-lighten-52 {
      color: $main-lighten-52-color;
    }

    .title-wrapper {
      display: flex;
      justify-content: space-between;
    }

    .value-wrapper {
      border-radius: 50%;
      margin-right: 0.5rem;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>
