<template>
  <v-container
    id="order-detail-carrier-sought"
    data-id="order-detail-carrierSought"
    :class="!hasData ? 'no-data' : null"
  >
    <mp-block
      id="order-detail-carrier-sought-block"
      :title="$vuetify.breakpoint.smAndUp ? $t('page.detailOrder.carrierSought.title') : ''"
      :hasBorder="$vuetify.breakpoint.smAndUp"
      :hasMarginBottom="$vuetify.breakpoint.smAndUp"
      titleHasPaddingBottom
    >
      <v-row no-gutters v-if="quotes && quotes.length > 0">
        <v-col cols="12" v-if="$vuetify.breakpoint.smAndUp" class="dsk">
          <div class="quotes-container" :style="{ transition: 'max-height 0.2s', maxHeight }">
            <v-expansion-panels accordion flat>
              <mp-collapse
                v-for="(quote, index) in quotes"
                :key="`quotes-${index}`"
                :ref="`quotes-${index}`"
                :color="isSelectedQuote(quote) ? 'white' : 'black'"
                :title="quote.Carrier.name"
                hasBorder
                :leftIcon="isSelectedQuote(quote) ? 'mdi-check-bold' : 'mdi-close-circle'"
                leftIconSize="1.8rem"
                :backgroundColor="isSelectedQuote(quote) ? 'green' : 'white'"
                :class="isSelectedQuote(quote) ? 'no-border' : ''"
                :dataId="`order-detail-carrierSought-collapses-${index}-infos`"
                @click="handleSelectQuote(quote)"
              >
                <mp-carrier-sought-infos :quote="quote" />
              </mp-collapse>
            </v-expansion-panels>
          </div>
        </v-col>

        <v-col cols="12" v-else class="phone">
          <v-row
            no-gutters
            v-for="(quote, index) in quotes.slice(0, mobileShowLess ? 3 : quotes.length)"
            :key="`quotes-${index}`"
            :class="`carrier-wrapper${isSelectedQuote(quote) ? ' success' : ''}`"
            @click="handleMobileClick(quote)"
            :data-id="`order-detail-carrierSought-${index}-goToModal`"
          >
            <v-col cols="2" class="icon-wrapper">
              <v-icon>{{ isSelectedQuote(quote) ? 'mdi-check' : 'mdi-close-circle' }}</v-icon>
            </v-col>
            <v-col cols="8" class="title-wrapper">
              <span class="medium14" :data-id="`order-detail-carrierSought-${index}-name`">{{
                quote.Carrier.name
              }}</span>
            </v-col>
            <v-col cols="2" class="icon-wrapper">
              <v-icon>mdi-chevron-right</v-icon>
            </v-col>
          </v-row>

          <v-row no-gutters class="action-outer-wrapper" v-if="quotes.length > 3">
            <v-col cols="6" class="action-wrapper">
              <mp-button
                :text="
                  mobileShowLess ? `${$t('action.show.base')} +` : `${$t('action.show.base')} -`
                "
                format="secondary"
                dataId="order-detail-carrierSought-showMoreAndShowLess"
                @click="mobileShowLess = !mobileShowLess"
                :small="$vuetify.breakpoint.xsOnly"
              />
            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <no-data dataId="order-detail-carrierSought-noData" v-else />
    </mp-block>

    <mp-carrier-sought-mobile-infos
      v-if="showDialog"
      :showDialog="showDialog"
      :quote="selectedQuote"
      @hide="handleCancelModal()"
    />
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'

import noData from '@/components/noData/noData.vue'
import mpBlock from '@/components/block/block.vue'

import mpCarrierSoughtInfos from '@/views/Order/Detail/carrierSought/components/infos.vue'
import mpCarrierSoughtMobileInfos from '@/views/Order/Detail/carrierSought/modals/mobileInfos.vue'

import QuoteService from '@/services/quote/QuoteService'
import { QuoteEntity } from '@/types'

export default Vue.extend({
  name: 'mp-carrier-sought',
  components: {
    mpCarrierSoughtInfos,
    mpCarrierSoughtMobileInfos,
    noData,
    mpBlock,
  },
  props: {
    orderId: {
      type: String,
      required: true,
    },
    quoteId: {
      type: Number,
      default: 0,
    },
  },
  data: () => ({
    quotes: null as QuoteEntity[] | null,
    maxHeight: '180px',
    mobileShowLess: true,
    showDialog: false,
    selectedQuote: null as QuoteEntity | null,
  }),
  computed: {
    hasData() {
      return this.quotes && this.quotes.length > 0
    },
  },
  async mounted() {
    this.quotes = await QuoteService.getAll({ orderId: this.orderId, isOutdated: false })
  },
  methods: {
    handleSelectQuote(quote: QuoteEntity) {
      // When click on selectedQuote = close it so reduce maxHeight quotes panel
      if (this.selectedQuote && quote.id === this.selectedQuote.id) {
        this.selectedQuote = null
        this.maxHeight = '180px'
        return
      }

      // Quote has 3 lines minimum (line height: 25px)
      let height = 3 * 25 + 25

      // When score: 4 new lines
      if (quote.score) {
        height += 4 * 25
      }

      // When reason: 1 new line
      if (quote.reasons) {
        height += 25
      }

      this.maxHeight = `${270 + height}px`

      this.selectedQuote = quote
    },
    handleMobileClick(quote: QuoteEntity) {
      this.selectedQuote = quote
      this.showDialog = true
    },
    handleCancelModal() {
      this.showDialog = false
      this.selectedQuote = null
    },
    isSelectedQuote(quote: QuoteEntity) {
      return this.$props.quoteId === quote.id
    },
  },
})
</script>

<style lang="scss">
@import '../../../../styles/mixins/macScrollbar';

#order-detail-carrier-sought {
  padding: 0;

  @media #{map-get($display-breakpoints, 'xs-only')} {
    border-top: solid 0.1rem $main-lighten-74-color;
  }

  .dsk {
    .quotes-container {
      overflow: auto;
      @include setMacScrollbar('&');

      .v-expansion-panels {
        .v-expansion-panel {
          margin-bottom: 0.5rem;
          border-color: $main-lighten-74-color;

          &:last-of-type { 
            margin-bottom: 0;
          }

          .v-expansion-panel-header {
            padding-top: 1.8rem;
            padding-bottom: 1.8rem;
            border-bottom-left-radius: inherit;
            border-bottom-right-radius: inherit;

            .header-wrapper {
              justify-content: flex-start;

              .mdi-close-circle {
                color: $main-color;
              }

              span {
                font-size: $regular-14-font-size !important;
                line-height: $regular-14-line-height !important;
                font-weight: $regular-14-font-weight !important;
                margin-top: 0;
              }
            }
          }
        }
      }
    }
  }

  .phone {
    .carrier-wrapper {
      min-height: 6rem;
      border: solid 0.1rem $main-lighten-74-color;
      border-radius: 0.4rem;
      margin-bottom: 0.5rem;

      &.success {
        background-color: $success-color !important;
        border-color: $success-color !important;
        color: $white;

        i {
          color: $white;
        }
      }

      .icon-wrapper {
        display: flex;
        justify-content: center;
        align-items: center;

        .mdi-close-circle {
          color: $main-color;
        }
      }

      .title-wrapper {
        display: flex;
        justify-content: flex-start;
        align-items: center;
      }
    }

    .action-outer-wrapper {
      display: flex;
      justify-content: center;

      .action-wrapper {
        display: flex;
        justify-content: center;
      }
    }
  }
}
</style>
