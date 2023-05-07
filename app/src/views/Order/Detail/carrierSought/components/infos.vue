<template>
  <div id="infos-container" data-id="order-detail-carrierSought-infos">
    <div class="info-text-wrapper regular14">
      <span class="label">
        {{ $t('page.detailOrder.carrierSought.taxExcludedAmount') }}
      </span>
      <span class="data" data-id="order-detail-carrierSought-infos-taxExcludedAmount">
        {{
          quote.taxExcludedAmount
            ? `${quote.taxExcludedAmount.toFixed(3)} ${$t(`common.currency.${quote.currency}`)}`
            : '--'
        }}
      </span>
    </div>

    <div class="info-text-wrapper regular14">
      <span class="label">
        {{ $t('page.detailOrder.carrierSought.taxAmount') }}
      </span>
      <span class="data" data-id="order-detail-carrierSought-infos-taxAmount">
        {{ quote.taxAmount ? quote.taxAmount.toFixed(3) : '--' }}
      </span>
    </div>

    <div class="info-text-wrapper regular14">
      <span class="label">
        {{ $t('page.detailOrder.carrierSought.taxIncludedAmount') }}
      </span>
      <span class="data" data-id="order-detail-carrierSought-infos-taxIncludedAmount">
        {{
          quote.taxIncludedAmount
            ? `${quote.taxIncludedAmount.toFixed(3)} ${$t(`common.currency.${quote.currency}`)}`
            : '--'
        }}
      </span>
    </div>

    <div class="info-text-wrapper regular14">
      <span class="label">
        {{ $t('page.detailOrder.carrierSought.quoteReference') }}
      </span>
      <span class="data" data-id="order-detail-carrierSought-infos-reference">
        {{ quote.externalQuoteId === '-1' ? '--' : quote.externalQuoteId }}
      </span>
    </div>

    <div class="info-text-wrapper regular14">
      <span class="label">
        {{ $t('page.detailOrder.carrierSought.usedVehicle') }}
      </span>
      <span class="data" data-id="order-detail-carrierSought-infos-vehicleType">
        {{ quote.vehicleType ? $t(`technical.vehicleType.${quote.vehicleType}`) : '--' }}
      </span>
    </div>

    <div v-if="quote.score">
      <div class="info-text-wrapper regular14">
        <span class="label">
          {{ $t('page.detailOrder.carrierSought.environmentMark') }}
        </span>
        <span class="data" data-id="order-detail-carrierSought-infos-environmentMark">
          {{ quote.score.environment[0].toFixed(2) }} / 10
        </span>
      </div>

      <div class="info-text-wrapper regular14">
        <span class="label">
          {{ $t('page.detailOrder.carrierSought.satisfactionMark') }}
        </span>
        <span
          class="data"
          data-id="order-detail-carrierSought-infos-satisfactionMark"
        >{{ quote.score.satisfaction[0].toFixed(2) }} / 10
        </span>
      </div>

      <div class="info-text-wrapper regular14">
        <span class="label">
          {{ $t('page.detailOrder.carrierSought.priceMark') }}
        </span>
        <span
          class="data"
          data-id="order-detail-carrierSought-infos-priceMark"
        >{{ quote.score.price[0].toFixed(2) }} / 10
        </span>
      </div>

      <div class="info-text-wrapper regular14">
        <span class="label">
          {{ $t('page.detailOrder.carrierSought.average') }}
        </span>
        <span
          class="data"
          data-id="order-detail-carrierSought-infos-average"
        >{{
          (quote.score.total - (quote.score.addedScore ? quote.score.addedScore : 0)).toFixed(2)
        }}
          / 10
        </span>
      </div>

      <div v-if="quote.score.addedScore" class="info-text-wrapper regular14">
        <span class="label">
          {{ $t('page.detailOrder.carrierSought.addedScore') }}
        </span>
        <span
          class="data"
          data-id="order-detail-carrierSought-infos-addedScore"
        >+ {{ quote.score.addedScore.toFixed(2) }}
        </span>
      </div>

      <div v-if="quote.score.addedScore" class="info-text-wrapper regular14">
        <span class="label">
          {{ $t('page.detailOrder.carrierSought.finalNote') }}
        </span>
        <span
          class="data"
          data-id="order-detail-carrierSought-infos-addedScore"
        >{{ quote.score.total.toFixed(2) }}
        </span>
      </div>
    </div>

    <div class="info-text-wrapper regular14" v-if="quote.reasons">
      <span class="label">
        {{ $t('page.detailOrder.carrierSought.reasons') }}
      </span>
      <span class="data" data-id="order-detail-carrierSought-infos-reason">
        {{ getReasons }}
      </span>
    </div>

    <div class="text-wrapper regular14" v-if="quote.comment">
      <span class="label">
        {{ $t('common.comment') }}
      </span>
      <span class="data" data-id="order-detail-carrierSought-infos-comment">
        {{ quote.comment }}
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { QuoteEntity } from '@/types'
import Vue from 'vue'

export default Vue.extend({
  name: 'mp-carrier-sought-infos',
  props: {
    quote: {
      type: Object as () => QuoteEntity,
      required: true,
    },
  },
  computed: {
    getReasons(): string[] | string {
      return this.quote.reasons
        ? this.quote.reasons.map((reason: string) => this.$t(`technical.refusedReason.${reason}`))
        : '--'
    },
  },
})
</script>

<style lang="scss">
#infos-container {
  .info-text-wrapper {
    display: flex;
    justify-content: space-between;
    border-bottom: solid 0.1rem $main-lighten-74-color;
    padding: 1.6rem 0;

    .label {
      color: $main-lighten-52-color;
    }

    .data {
      color: $main-color;
      word-break: break-word;
      text-align: right;
      max-width: 65%;
    }
  }

  .info-text-wrapper:last-of-type {
    border-bottom: none;
  }

  .info-text-wrapper:first-of-type {
    padding-top: 0;
    margin-top: 2.3rem;
  }
}
</style>
