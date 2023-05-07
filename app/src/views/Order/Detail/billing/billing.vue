<template>
  <v-container
    id="order-detail-billing"
    data-id="order-detail-billing"
    :class="!hasData ? 'no-data' : null"
  >
    <mp-block
      id="order-detail-billings-block"
      :title="$vuetify.breakpoint.smAndUp ? $t('page.detailOrder.billing.title') : ''"
      :hasBorder="$vuetify.breakpoint.smAndUp"
      :hasMarginBottom="$vuetify.breakpoint.smAndUp"
      titleHasPaddingBottom
    >
      <div v-if="hasData">
        <v-row
          no-gutters
          v-if="delivery && billings && $vuetify.breakpoint.xsOnly && isDownloadBillingAuthorize"
        >
          <v-col cols="12" class="action-wrapper">
          </v-col>
        </v-row>

        <div v-if="delivery && billings && billings.length >= 1">
          <div class="text-wrapper">
            <span class="label regular14">{{ $t('page.detailOrder.billing.price') }}</span>
            <div class="vat-wrapper">
              <span class="main-color regular14" data-id="order-detail-billing-priceVatExcluded">
                {{
                  `${billings[0].taxExcludedAmount.toFixed(3)} ${$t(
                    `common.currency.${billings[0].currency}`,
                  )} ${$t('page.detailOrder.billing.vat.excluded')}`
                }}
              </span>

              <span class="regular14" data-id="order-detail-billing-priceVatIncluded">
                {{
                  `(${getTaxIncluded(billings[0])} ${$t(
                    `common.currency.${billings[0].currency}`,
                  )} ${$t('page.detailOrder.billing.vat.included')})`
                }}
              </span>
            </div>
          </div>

          <div class="text-wrapper">
            <span class="label regular14">{{ $t('page.detailOrder.billing.vehicle') }}</span>
            <span class="main-color regular14" data-id="order-detail-billing-vehicleType">
              {{
                delivery.vehicleType ? $t(`technical.vehicleType.${delivery.vehicleType}`) : 'NC'
              }}
            </span>
          </div>

          <div class="text-wrapper">
            <span class="label regular14">{{ $t('page.detailOrder.billing.km') }}</span>
            <span class="main-color regular14" data-id="order-detail-billing-billedDistanceKilometer">
              {{ delivery.billedDistanceKilometer || 'NC' }}
            </span>
          </div>

          <div class="text-wrapper pb-0">
            <span class="label regular14">{{ $t('page.detailOrder.billing.carbon') }}</span>
            <span class="main-color regular14" data-id="order-detail-billing-emmitedCarbonDioxideGram">
              {{ delivery.emittedCarbonDioxideGram || 'NC' }}
            </span>
          </div>
        </div>

        <v-row
          class="delta-cost-wrapper"
          v-if="delivery && billings && billings.length > 1"
          no-gutters
        >
          <v-col cols="12">
            <span class="medium14">{{ $t('page.detailOrder.billing.deltaCostLabel') }}</span>

            <v-row no-gutters class="selector-wrapper">
              <v-col
                v-for="(billing, index) in billings.filter((elem, index) => index > 0)"
                :key="`billings-${index}`"
                class="icon-outer-wrapper"
                cols="2"
              >
                <div
                  :class="`icon-wrapper${index === selectedDeltaCost ? ' selected' : ''}`"
                  @click="selectedDeltaCost = index"
                  :data-id="`order-detail-billing-${index}-select`"
                >
                  <span>{{ index + 1 }}</span>
                </div>
              </v-col>
            </v-row>

            <div class="text-wrapper">
              <span class="label regular14">{{ $t('page.detailOrder.billing.reason') }}</span>
              <span class="main-color regular14" data-id="order-detail-billing-reason">
                {{
                  billings[selectedDeltaCost + 1].reason
                    ? $t(`technical.deltacost.${billings[selectedDeltaCost + 1].reason}`)
                    : '?'
                }}
              </span>
            </div>

            <div class="text-wrapper">
              <span class="label regular14">{{ $t('page.detailOrder.billing.value') }}</span>
              <div class="vat-wrapper">
                <span class="main-color regular14" data-id="order-detail-billing-priceVatExcluded">
                  {{
                    billings[selectedDeltaCost + 1].taxExcludedAmount
                      ? `${billings[selectedDeltaCost + 1].taxExcludedAmount.toFixed(3)} ${$t(
                        `common.currency.${billings[selectedDeltaCost + 1].currency}`,
                      )} ${$t('page.detailOrder.billing.vat.excluded')}`
                      : '?'
                  }}
                </span>
                <span
                  class="regular14"
                  v-if="billings[selectedDeltaCost + 1].taxExcludedAmount"
                  data-id="order-detail-billing-priceVatIncluded"
                >
                  {{
                    `(${getTaxIncluded(billings[selectedDeltaCost + 1])} ${$t(
                      `common.currency.${billings[selectedDeltaCost + 1].currency}`,
                    )} ${$t('page.detailOrder.billing.vat.included')})`
                  }}
                </span>
              </div>
            </div>

            <div class="text-wrapper">
              <span class="label regular14">{{
                $t('page.detailOrder.carrierSought.taxAmount')
              }}</span>
              <div class="vat-wrapper">
                <span class="main-color regular14" data-id="order-detail-billing-priceTaxAmount">
                  {{
                    billings[selectedDeltaCost + 1].taxAmount
                      ? billings[selectedDeltaCost + 1].taxAmount.toFixed(3)
                      : '--'
                  }}
                </span>
              </div>
            </div>

            <div class="text-wrapper">
              <span class="label regular14">{{ $t('page.detailOrder.billing.timestamp') }}</span>
              <span class="main-color regular14" data-id="order-detail-billing-createdAt">
                {{ getBillingCreatedAt(billings[selectedDeltaCost + 1].createdAt) }}
              </span>
            </div>

            <div class="text-wrapper">
              <span class="label regular14">{{ $t('page.detailOrder.billing.comment') }}</span>
              <span class="main-color regular14" data-id="order-detail-billing-comment">
                {{
                  billings[selectedDeltaCost + 1].comment
                    ? billings[selectedDeltaCost + 1].comment
                    : '?'
                }}
              </span>
            </div>
          </v-col>
        </v-row>
      </div>
      <div v-else>
        <no-data dataId="order-detail-billing-noData" />
      </div>
    </mp-block>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'

import { dateHelper, dateHelperGetTimezonedDate } from '@/helpers/dateHelper'

import noData from '@/components/noData/noData.vue'
import mpBlock from '@/components/block/block.vue'

import BillingService from '@/services/billing/BillingService'
import { BillingEntity, DeliveryEntity } from '@/types'

const VAT_RATE = 0.2

export default Vue.extend({
  name: 'mp-billing',
  components: {
    noData,
    mpBlock,
  },
  props: {
    delivery: {
      type: Object as () => DeliveryEntity || null,
      default: null,
    },
    isDownloadBillingAuthorize: {
      type: Boolean,
      required: true,
    },
  },
  data: () => ({
    billings: null as BillingEntity[] | null,
    VAT_RATE,
    selectedDeltaCost: 0,
    hasData: true,
  }),
  async mounted() {
    if (this.delivery) {
      this.billings = await BillingService.getAll({ deliveryId: this.delivery.id })
    }
    this.hasData = this.billings !== null && this.billings.length > 0
  },
  methods: {
    getTaxIncluded(billing: BillingEntity) {
      return (billing.taxIncludedAmount || billing.taxExcludedAmount * (1 + VAT_RATE)).toFixed(3)
    },
    getBillingCreatedAt(date: string) {
      return date
        ? dateHelper.formatToTimezone(dateHelperGetTimezonedDate(date), 'UTC', 'P p')
        : '?'
    },
  },
})
</script>

<style lang="scss">
#order-detail-billing {
  padding: 0;

  @media #{map-get($display-breakpoints, 'xs-only')} {
    border-top: solid 0.1rem $main-lighten-74-color;
  }

  .text-wrapper {
    border-bottom: solid 0.1rem $main-lighten-74-color;
    padding: 1.6rem 0;

    display: flex;
    justify-content: space-between;

    .label {
      color: $main-lighten-52-color;
      margin-right: 1rem;
    }

    .regular14 {
      word-break: break-word;
      text-align: right;
    }

    .vat-wrapper {
      display: flex;
      flex-direction: column;
      text-align: right;
    }
  }

  .text-wrapper:last-of-type {
    border-bottom: none;
  }

  .text-wrapper:first-of-type {
    padding-top: 0;
  }

  .delta-cost-wrapper {
    .selector-wrapper {
      display: flex;
      margin-right: 2.5rem;
      margin-top: 1.4rem;
      margin-bottom: 1.3rem;

      .icon-outer-wrapper {
        margin-bottom: 0.5rem;
        .icon-wrapper {
          width: 4rem;
          height: 3rem;
          border-radius: 5rem;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-right: 1.5rem;
          background-color: $white;
          color: $primary-color;
          border: solid 0.1rem $primary-color;
          cursor: pointer;

          &.selected {
            background-color: $primary-color;
            color: $white;
          }
        }
      }
    }
  }

  .action-wrapper {
    display: flex;
    justify-content: center;

    i {
      margin-right: 1.2rem;
    }

    @media #{map-get($display-breakpoints, 'sm-and-up')} {
      margin-top: 2.9rem;
    }

    @media #{map-get($display-breakpoints, 'xs-only')} {
      margin-bottom: 3rem;
    }
  }
}
</style>
