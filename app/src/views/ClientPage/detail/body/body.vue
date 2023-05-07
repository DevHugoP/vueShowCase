<template>
  <mp-block
    id="retailer-client-page-body-block"
    :title="$vuetify.breakpoint.smAndUp ? $t('page.clientPage.body.title') : ''"
    :hasBorder="$vuetify.breakpoint.smAndUp"
    :hasMarginBottom="$vuetify.breakpoint.smAndUp"
    titleHasPaddingBottom
  >
    <v-row no-gutters class="info-wrapper mt-3" v-if="body.title">
      <v-col cols="12" class="info-wrapper-title mb-2">
        <span class="regular14">{{ $t('page.retailerDetail.clientPage.body.title') }}</span>
      </v-col>
      <v-col cols="12" class="info-wrapper-detail">
        <span class="regular14">{{ body.title }}</span>
        <v-divider class="mt-2" />
      </v-col>
    </v-row>

    <v-row no-gutters class="info-wrapper mt-3" v-if="body.informations">
      <v-col cols="12" class="info-wrapper-title mb-2">
        <span class="regular14">{{ $t('page.retailerDetail.clientPage.body.informations') }}</span>
      </v-col>
      <v-col cols="12" class="info-wrapper-detail">
        <span class="regular14">{{ body.informations }}</span>
        <v-divider class="mt-2" />
      </v-col>
    </v-row>

    <v-row
      no-gutters
      class="info-wrapper mt-3"
      v-if="
        type === ClientPageType.DRIVE_SLOT_SUCCESS ||
          type === ClientPageType.REPORT_PRESENCE_AT_DRIVE_SUCCESS
      "
    >
      <v-col cols="12" class="info-wrapper-detail">
        <v-icon>{{ body.showInterval ? 'mdi-check-bold' : 'mdi-close-thick' }}</v-icon>
        <span class="regular14">{{ $t('page.retailerDetail.clientPage.body.showInterval') }}</span>
        <v-divider class="mt-2" />
      </v-col>
    </v-row>

    <v-row
      no-gutters
      class="info-wrapper mt-3"
      v-if="type === ClientPageType.REPORT_PRESENCE_AT_DRIVE_SUCCESS"
    >
      <v-col cols="12" class="info-wrapper-detail">
        <v-icon>{{ body.showDriveName ? 'mdi-check-bold' : 'mdi-close-thick' }}</v-icon>
        <span class="regular14">{{ $t('page.retailerDetail.clientPage.body.showDriveName') }}</span>
        <v-divider class="mt-2" />
      </v-col>
    </v-row>

    <v-row no-gutters class="info-wrapper mt-3">
      <v-col
        cols="12"
        class="info-wrapper-detail"
        v-for="(instruction, index) of body.instructions"
        :key="`instruction-${index}`"
      >
        <span class="regular14">{{
          $t('page.retailerDetail.clientPage.body.instruction.rank', { rank: instruction.rank })
        }}:
        </span>
        <span class="regular14">{{ instruction.title }}</span>
      </v-col>
    </v-row>
  </mp-block>
</template>

<script lang="ts">
import Vue from 'vue'

import mpBlock from '@/components/block/block.vue'
import { ClientPageType } from '@/constants'

export default Vue.extend({
  name: 'client-page-detail-body',
  components: {
    mpBlock,
  },
  props: {
    body: {
      type: Object as () => Record<string, any>,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    ClientPageType,
  }),
})
</script>

<style lang="scss">
#retailer-client-page-body-block {
  .info-wrapper {
    .info-wrapper-title {
      span {
        color: $main-lighten-52-color;
      }
    }

    .main-lighten-52 {
      color: $main-lighten-52-color;
    }

    .score-wrapper {
      display: flex;
      justify-content: space-between;
    }

    .score-value-wrapper {
      height: 2.6rem;
      width: 2.6rem;
      border-radius: 50%;
      margin-right: 0.5rem;
      background-color: $main-color;
      display: flex;
      justify-content: center;
      align-items: center;
      color: $white;
    }
  }
}
</style>
