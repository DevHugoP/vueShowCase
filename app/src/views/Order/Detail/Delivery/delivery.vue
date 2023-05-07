<template>
  <v-container id="order-detail-delivery" data-id="order-detail-delivery" v-if="delivery">
    <mp-block
      id="delivery-block"
      :title="$vuetify.breakpoint.smAndUp ? $t('page.detailOrder.delivery.title') : ''"
      :hasBorder="$vuetify.breakpoint.smAndUp"
      :hasMarginBottom="$vuetify.breakpoint.smAndUp"
      titleHasPaddingBottom
    >
      <div v-if="hasData">
        <v-row
          no-gutters
          class="action-outer-wrapper"
          v-if="$vuetify.breakpoint.xsOnly && isDownloadAuthorize"
        >
          <v-col cols="12">
            <mp-button
              :text="$t('page.detailOrder.delivery.download')"
              shape="rounded"
              depressed
              dataId="order-detail-delivery-download"
              @click="downloadSlip()"
            />
          </v-col>

          <v-col cols="12" class="mt-4">
            <mp-button
              :text="$t('action.preview')"
              shape="rounded"
              depressed
              dataId="order-detail-delivery-preview"
              @click="downloadSlip(true)"
            />
          </v-col>
        </v-row>

        <v-row no-gutters class="delivery-id-outer-wrapper">
          <v-col cols="12" class="regular12" data-id="order-detail-delivery-externalDeliveryId">
            <div class="label regular14">{{ $t('page.detailOrder.delivery.deliveryId') }}</div>
            <div class="data regular14">{{ delivery.externalDeliveryId }}</div>
          </v-col>
        </v-row>

        <v-divider class="divider" />

        <v-row no-gutters class="carrier-outer-wrapper">
          <v-col cols="12" class="regular12" data-id="order-detail-delivery-carrierName">
            <div class="label regular14">{{ $t('page.detailOrder.delivery.carrier') }}</div>
            <div class="data regular14">{{ order.Carrier.name }}</div>
          </v-col>
        </v-row>

        <v-divider class="divider" />

        <v-row no-gutters class="vehicle-outer-wrapper">
          <v-col cols="12" class="regular12" data-id="order-detail-quote-vehicleType">
            <div class="label regular14">{{ $t('page.detailOrder.delivery.vehicle') }}</div>
            <div class="data regular14">
              {{
                quote && quote.vehicleType ? $t(`technical.vehicleType.${quote.vehicleType}`) : '--'
              }}
            </div>
          </v-col>
        </v-row>

        <v-row
          no-gutters
          class="action-outer-wrapper"
          v-if="$vuetify.breakpoint.smAndUp && isDownloadAuthorize"
        >
          <v-col cols="12">
            <mp-button
              :text="$t('page.detailOrder.delivery.download')"
              depressed
              dataId="order-detail-delivery-download"
              @click="downloadSlip()"
            />
          </v-col>
          <v-col cols="12" class="mt-4">
            <mp-button
              :text="$t('action.preview')"
              depressed
              dataId="order-detail-delivery-preview"
              @click="downloadSlip(true)"
            />
          </v-col>
        </v-row>
      </div>
      <div v-else>
        <no-data dataId="order-detail-delivery-noData" />
      </div>
    </mp-block>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'

import noData from '@/components/noData/noData.vue'

import objectHelper from '@/helpers/objectHelper'
import OrderService from '@/services/order/OrderService'
import mpBlock from '@/components/block/block.vue'
import { DeliveryEntity, OrderEntity, QuoteEntity } from '@/types'

export default Vue.extend({
  name: 'mp-delivery',
  components: {
    noData,
    mpBlock,
  },
  props: {
    order: {
      type: Object as () => OrderEntity,
      required: true,
    },
    isDownloadAuthorize: {
      type: Boolean,
      required: true,
    },
  },
  data: () => ({
    delivery: null as DeliveryEntity | null | undefined,
    quote: null as QuoteEntity | null | undefined,
    hasData: false,
  }),
  mounted() {
    if (this.order && Object.entries(this.order).length) {
      this.quote = this.order.Quote
      this.delivery = this.order.Delivery

      this.hasData =
        objectHelper.hasOneOfDeepProperty(this.order, ['Carrier.name']) ||
        objectHelper.hasOneOfDeepProperty(this.delivery, ['externalDeliveryId'])
    }
  },
  methods: {
    async downloadSlip(preview = false) {
      const slip = await OrderService.getSlip(this.order!.id!)
      if (preview) {
        const pdfWindow = window.open('')
        pdfWindow!.document.write(
          `<iframe width='100%' height='100%' src='data:application/pdf;base64, ${encodeURI(
            slip,
          )}'></iframe>`,
        )
      } else {
        const fileLink = document.createElement('a')
        fileLink.href = `data:application/octet-stream;base64,${slip}`
        fileLink.setAttribute(
          'download',
          `${this.$t('common.slipName', { timestamp: Date.now() })}.pdf`,
        )

        fileLink.click()
      }
    },
  },
})
</script>

<style lang="scss">
#order-detail-delivery {
  padding: 0;

  @media #{map-get($display-breakpoints, 'xs-only')} {
    border-top: solid 0.1rem $main-lighten-74-color;
  }

  .delivery-id-outer-wrapper {
    margin-top: 2rem;
    margin-bottom: 1.6rem;
  }

  .carrier-outer-wrapper {
    margin-top: 1rem;
    margin-bottom: 0.9rem;
  }

  .vehicle-outer-wrapper {
    margin-top: 1.6rem;
    margin-bottom: 2.5rem;
  }

  .action-outer-wrapper {
    text-align: center;
    margin-bottom: 0.1rem;

    i {
      margin-right: 1.2rem;
    }
  }

  .regular12 {
    display: flex;

    .label {
      color: $main-lighten-52-color;
      width: 52%;
    }

    .data {
      color: $main-color;
      margin-left: auto;
      text-align: right;
    }
  }
}
</style>
