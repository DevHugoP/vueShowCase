<template>
  <v-container id="order-detail-detail" v-if="order" data-id="order-detail-detail">
    <mp-block
      id="order-detail-detail-block"
      :title="$vuetify.breakpoint.smAndUp ? $t('page.detailOrder.detail.title') : ''"
      :hasBorder="$vuetify.breakpoint.smAndUp"
      :hasMarginBottom="$vuetify.breakpoint.smAndUp"
      titleHasPaddingBottom
    >
      <div v-if="hasData">
        <div class="text-wrapper" v-if="retailer && retailer.name">
          <span class="label regular14">{{ $t('common.retailer') }}</span>
          <router-link
            :to="
              isAuthorized('READ_RETAILERS')
                ? { name: ROUTES.detailRetailer, params: { id: retailer.id } }
                : ''
            "
            class="retailer-row__link-wrapper d-flex justify-space-between align-center"
          >
            <span class="value regular14" data-id="order-detail-detail-retailerName">
              {{ retailer.name }}
            </span>
          </router-link>
        </div>

        <div
          class="text-wrapper"
          v-if="
            order &&
              isAuthorized('READ_PRODUCT_RETURNS', {
                storeId: order.storeId,
                retailerId: order.retailerId,
              }) &&
              initialOrder
          "
        >
          <span class="label regular14">
            {{ $t('page.detailOrder.productReturns.orderDetails.initialOrderLink') }}
          </span>
          <a target="_blank" :href="initialOrder.orderId" class="value regular14">
            {{ initialOrder.externalOrderId }}
          </a>
        </div>

        <div class="text-wrapper" v-if="store && store.name">
          <span class="label regular14">{{ $t('common.store') }}</span>
          <router-link
            :to="
              isAuthorized('READ_STORES')
                ? { name: ROUTES.detailStore, params: { storeId: store.id, id: retailer.id } }
                : ''
            "
            class="retailer-row__link-wrapper d-flex justify-space-between align-center"
          >
            <span class="value regular14" data-id="order-detail-detail-storeName">
              {{ store.name }}
            </span>
          </router-link>
        </div>

        <div class="text-wrapper" v-if="exchangePlace && exchangePlace.name">
          <span class="label regular14">{{ $t('common.exchangePlace') }}</span>
          <router-link
            :to="
              isAuthorized('READ_EXCHANGE_PLACES')
                ? {
                  name: ROUTES.exchangePlace,
                  params: {
                    exchangePlaceId: exchangePlace.id,
                    storeId: store.id,
                    id: retailer.id,
                  },
                }
                : ''
            "
            class="retailer-row__link-wrapper d-flex justify-space-between align-center"
          >
            <span class="value regular14" data-id="order-detail-detail-storeName">
              {{ exchangePlace.name }}
            </span>
          </router-link>
        </div>

        <div class="text-wrapper" v-if="order.createdAt">
          <span class="label regular14">{{ $t('page.detailOrder.detail.createdAt') }}</span>
          <span class="value regular14" data-id="order-detail-detail-createdAt">
            {{ getCreatedAt }}
          </span>
        </div>

        <div class="text-wrapper" v-if="order.referenceNumber">
          <span class="label regular14">{{ $t('page.detailOrder.detail.referenceNumber') }}</span>
          <span class="value regular14" data-id="order-detail-detail-referenceNumber">
            {{ order.referenceNumber }}
          </span>
        </div>

        <div class="text-wrapper" v-if="order.externalOrderId">
          <span class="label regular14">{{ $t('page.detailOrder.detail.externalOrderId') }}</span>
          <span class="value regular14" data-id="order-detail-detail-externalOrderId">
            {{ order.externalOrderId }}
          </span>
        </div>

        <div class="text-wrapper" v-if="order.services">
          <span class="label regular14">{{ $t('page.detailOrder.detail.services') }}</span>
          <div class="array">
            <span
              class="value regular14"
              v-for="service in order.services"
              :key="service"
              data-id="order-detail-detail-services"
            >
              {{ $t(`technical.services.${service}`) }}
            </span>
          </div>
        </div>

        <div class="text-wrapper" v-if="order.tags && order.tags.length">
          <span class="label regular14">{{ $t('page.detailOrder.detail.tags') }}</span>
          <div class="value regular14 d-flex flex-column">
            <span
              data-id="order-detail-detail-tags"
              v-for="(tag, index) in order.tags"
              :key="`order-detail-detail-tags-${index}`"
            >
              {{ tag.key }}
              {{ $t([`technical.tags.${tag.value}`, tag.value]) }}
            </span>
          </div>
        </div>

        <div class="text-wrapper" v-if="order.packages && order.packages.length">
          <span class="label regular14">{{ $t('page.detailOrder.detail.packagesQuantity') }}</span>
          <span class="value regular14" data-id="order-detail-detail-packagesQuantity">
            {{ getPackagesQuantity() }}
          </span>
        </div>

        <div class="text-wrapper" v-if="order.packages && order.packages.length">
          <span class="label regular14">{{ $t('page.detailOrder.detail.packagesWeight') }}</span>
          <span
            class="value regular14"
            data-id="order-detail-detail-packagesWeight"
          >{{ getPackagesWeight() }} kg</span>
        </div>

        <div class="text-wrapper" v-if="order.picking.address && order.delivery.address">
          <span class="label regular14">{{ $t('page.detailOrder.detail.coordinatesDistance') }}</span>
          <span
            class="value regular14"
            data-id="order-detail-detail-coordinatesDistance"
          >{{ order.distance?.toFixed(3) }}</span>
        </div>

        <v-row
          no-gutters
          class="action-show-outter-wrapper download-label-container"
          v-if="hasDelivery"
        >
          <v-col cols="12" class="action-show-wrapper">
            <mp-button
              v-if="displayLabelDownload"
              :text="$t('page.detailOrder.label.download')"
              depressed
              dataId="order-detail-label-download"
              @click="downloadLabel()"
            />
          </v-col>

          <v-col cols="12" class="action-show-wrapper mt-4">
            <mp-button
              v-if="displayLabelDownload"
              :text="$t('action.preview')"
              depressed
              dataId="order-detail-label-preview"
              @click="downloadLabel(true)"
            />
          </v-col>
        </v-row>
      </div>

      <div v-else>
        <no-data dataId="order-detail-detail-noData" />
      </div>
    </mp-block>
  </v-container>
</template>

<script lang="ts">
import mpBlock from '@/components/block/block.vue'

import noData from '@/components/noData/noData.vue'

import { ROUTES } from '@/constants'

import { dateHelper, dateHelperGetTimezonedDate } from '@/helpers/dateHelper'

import objectHelper from '@/helpers/objectHelper'

import { authorizationMixin } from '@/mixins'
import ExchangePlaceService from '@/services/exchangePlace/ExchangePlaceService'
import OrderService from '@/services/order/OrderService'
import { SnackBarType } from '@/store/types'
import { Filters, OrderEntity, RulesKey } from '@/types'
import convert from 'convert-units'
import FileDownload from 'js-file-download'
import { RawLocation } from 'vue-router'
import mixins from 'vue-typed-mixins'
import { mapGetters } from 'vuex'
import { Buffer } from 'buffer'

const forRuleExchangePlaces: RulesKey = 'READ_EXCHANGE_PLACES'

export default mixins(authorizationMixin).extend({
  name: 'mp-detail',
  components: {
    noData,
    mpBlock,
  },
  props: {
    order: {
      type: Object as () => OrderEntity,
      required: true,
    },
    retailer: {
      type: Object as () => Filters,
      required: true,
    },
    store: {
      type: Object as () => Filters,
      required: true,
    },
    initialOrder: {
      type: Object as () => OrderEntity,
      required: false,
      default: null,
    },
  },
  data: () => ({
    hasData: true,
    hasDelivery: false,
    exchangePlace: null as Filters | null,
    ROUTES,
  }),
  async mounted() {
    this.hasData = objectHelper.hasOneOfDeepProperty(this.order, [
      'Retailer.name',
      'Store.name',
      'createdAt',
      'referenceNumber',
      'externalOrderId',
      'services',
      'packages',
    ])

    if (this.order) {
      const {
        retailerId,
        storeId,
        picking: {
          address: { exchangePlaceId },
        },
      } = this.order
      //set picking exchangePlace or delivery exchangePlace if return
      const orderExchangePlaceId = exchangePlaceId || this.order.delivery.address.exchangePlaceId
      if (orderExchangePlaceId) {    
        const [exchangePlace] = await ExchangePlaceService.getFilters({
          retailerId,
          storeId,
          id: orderExchangePlaceId,
          forRule: forRuleExchangePlaces,
        })
        if (exchangePlace) {
          this.exchangePlace = exchangePlace
        }
      }
      this.hasDelivery = Boolean(this.order.Delivery && this.order.Delivery.id)
    }
  },
  computed: {
    ...mapGetters({
      currentUser: 'auth/currentUser',
    }),
    displayLabelDownload() {
      return (
        this.isAuthorized('READ_ORDER_PERSONAL_DATA') &&
        this.isAuthorized('DOWNLOAD_LABEL_ORDER_DETAIL') &&
        (!this.order?.Quote?.eligibilitySpecifications || this.order.Quote.eligibilitySpecifications.label)
      )
    },
    getCreatedAt() {
      return dateHelper.formatToTimezone(
        dateHelperGetTimezonedDate(this.order.createdAt),
        'UTC',
        'P p',
      )
    },
  },
  methods: {
    getRouterData(orderId: number): RawLocation | void {
      return {
        name: ROUTES.detailOrder,
        params: { id: orderId.toString() },
      }
    },
    getPackagesQuantity() {
      let returnValue = 0
      if (this.order) {
        this.order.packages.map((elem: any) => {
          returnValue += elem.quantity
        })
      }

      return returnValue
    },
    getPackagesWeight() {
      let totalWeight = 0

      if (this.order) {
        for (const pack of this.order.packages) {
          const quantity = pack.quantity || 1
          totalWeight +=
            convert(pack.weight.value || undefined)
              .from(pack.weight.unit as any)
              .to('kg') * quantity
        }
      }

      return Number(totalWeight).toFixed(3)
    },
    async downloadLabel(preview = false) {
      try {
        const label = await OrderService.getLabel(this.order.id)
        if (preview) {
          const pdfWindow = window.open('')
          pdfWindow!.document.write(
            `<iframe width='100%' height='100%' src='data:application/pdf;base64, ${encodeURI(
              Buffer.from(label).toString('base64'),
            )}'></iframe>`,
          )
        } else {
          FileDownload(label, `${this.$t('common.labelName', { timestamp: Date.now() })}.pdf`)
        }
      } catch (err) {
        this.$store.dispatch('setSnackbar', {
          type: SnackBarType.ERROR,
          message: this.$t('messages.impossibleDownloadLabel'),
        })
      }
    },
  },
})
</script>

<style lang="scss" scoped>
#order-detail-detail {
  padding: 0;

  @media #{map-get($display-breakpoints, 'xs-only')} {
    border-top: solid 0.1rem $main-lighten-74-color;
  }

  .text-wrapper {
    display: flex;
    justify-content: space-between;
    border-top: solid 0.1rem $main-lighten-74-color;
    margin-top: 1.6rem;
    padding-top: 1.6rem;

    .label {
      color: $main-lighten-52-color;
      min-width: 30%;
    }

    .array {
      display: flex;
      flex-direction: column;
      text-align: right;
    }

    .value {
      color: $main-color;
      padding-left: 5px;
      text-align: right;
      word-break: break-word;
    }
  }

  .download-label-container {
    & > div {
      display: flex;
      justify-content: center;
    }
    margin-top: 2.5rem;
    margin-bottom: 0.1rem;
  }

  .text-wrapper:first-of-type {
    border-top: none;
    margin-top: 0;
    padding-top: 0;
  }
}
</style>
