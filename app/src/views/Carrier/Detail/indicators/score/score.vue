<template>
  <mp-block
    id="carrier-detail-score"
    :hasBorder="$vuetify.breakpoint.smAndUp"
    :hasMarginBottom="$vuetify.breakpoint.smAndUp"
    :title="$vuetify.breakpoint.smAndUp ? $t('common.quality') : ''"
    titleHasPaddingBottom
    v-if="carrierScore"
  >
    <v-row class="score-container pt-0" no-gutters>
      <v-col class="d-flex flex-column" cols="8">
        <span class="regular14 main-color">
          {{ $t('common.weighting.quality.satisfaction') }}
        </span>
        <span class="regular14 main-lighten-52 mt-1" data-id="carrier-detail-indicators-satisfaction-indicator">
          {{ `${$t('common.indicator')}: ${carrierScore.satisfaction}/10` }}
        </span>
      </v-col>
      <v-col cols="4" class="value-wrapper">
        <span class="regular14 main-color" data-id="carrier-detail-indicators-satisfaction-score"> {{ carrierScore.satisfaction }}/10 </span>
      </v-col>
    </v-row>

    <v-row :class="`score-container${isCarrierAndNotLocal ? ' no-border-bottom pb-0' : ''}`" no-gutters>
      <v-col class="d-flex flex-column" cols="8">
        <span class="regular14 main-color">
          {{ $t('common.weighting.quality.nps') }}
        </span>
        <span class="regular14 main-lighten-52 mt-1" data-id="carrier-detail-indicators-nps-indicator">
          {{ `${$t('common.indicator')}: ${getNpsIndicator}` }}
        </span>
      </v-col>
      <v-col cols="4" class="value-wrapper">
        <span class="regular14 main-color" data-id="carrier-detail-indicators-nps-score"> {{ carrierScore.nps }}/10 </span>
      </v-col>
    </v-row>

    <v-row class="score-container no-border-bottom pb-0" no-gutters v-if="!isCarrierAndNotLocal">
      <v-col class="d-flex flex-column" cols="8">
        <span class="regular14 main-color">
          {{ $t('common.weighting.quality.onTimeDeliveryScore') }}
        </span>
        <span class="regular14 main-lighten-52 mt-1" data-id="carrier-detail-indicators-onTimedelivery-indicator">
          {{ `${$t('common.indicator')}: ${getOnTimeDeliveryScoreIndicator}` }}
        </span>
      </v-col>
      <v-col cols="4" class="value-wrapper">
        <span class="regular14 main-color" data-id="carrier-detail-indicators-onTimeDelivery-score"> {{ carrierScore.onTimeDeliveryScore }}/10 </span>
      </v-col>
    </v-row>
  </mp-block>
</template>

<script lang="ts">

import mpBlock from '@/components/block/block.vue'
import Vue from 'vue'
import CarrierScoreService from '@/services/carrier-score/CarrierScoreService'
import { CarrierScore, MODELS } from '@/types'

const DEFAULT_SCORE = {
  nps: 8,
  satisfaction: 8,
  onTimeDeliveryScore: 8,
}

export default Vue.extend({
  name: 'carrier-detail-score',
  components: {
    mpBlock,
  },
  data: () => ({
    carrierScore: null as CarrierScore | null,
  }),
  props: {
    models: {
      type: Array as () => MODELS[] | undefined,
      default: undefined,
    },
  },
  async mounted() {
    const { carrierId, retailerId, storeId, exchangePlaceId } = this.$route.params

    const [carrierScore] = await CarrierScoreService.getAll({
      carrierId,
      retailerId,
      storeId,
      exchangePlaceId,
    })

    this.carrierScore = carrierScore || DEFAULT_SCORE
  },
  computed: {
    getNpsIndicator(): string {
      return ((this.carrierScore?.nps || 0) * 20 - 100).toFixed(2)
    },
    getOnTimeDeliveryScoreIndicator(): string {
      return `${((this.carrierScore?.onTimeDeliveryScore || 0) * 10).toFixed(2)} %`
    },
    isCarrierAndNotLocal(): boolean {
      const { retailerId } = this.$route.params

      return !retailerId && (!this.models || !this.models.includes(MODELS.LOCAL))
    }
  },
})
</script>

<style lang="scss" scoped>
@import '../../../../../styles/mixins/macScrollbar';

#carrier-detail-score {
  padding: 0;

  .score-container {
    border-bottom: solid 0.1rem $main-lighten-74-color;
    display: flex;
    align-items: center;
    padding: 1.6rem 0;

    &.no-border-bottom {
      border-bottom: none;
    }

    .value-wrapper {
      text-align: right;
      margin-bottom: 1rem;
    }
  }
}
</style>
