<template>
  <v-container id="order-detail-product-returns" data-id="order-detail-product-returns">
    <mp-block
      id="order-detail-product-returns-block"
      :title="
        $vuetify.breakpoint.smAndUp
          ? $t('page.detailOrder.productReturns.title', { count: returns.length })
          : ''
      "
      :hasBorder="$vuetify.breakpoint.smAndUp"
      :hasMarginBottom="$vuetify.breakpoint.smAndUp"
      titleHasPaddingBottom
    >
      <div class="content-outer-wrapper" :style="{ maxHeight }">
        <v-row
          no-gutters
          v-for="(productReturn, index) in returns"
          :key="`${productReturn.externalOrderId}-${index}`"
          :ref="`productReturn-${index}`"
          class="content-wrapper"
          :data-id="`order-detail-product-returns-${index}`"
        >
          <v-col cols="12" class="content-wrapper-col">
            <v-row no-gutters class="text-wrapper">
              <v-col col="6" class="product-returns-header-wrapper">
                <span
                  :class="`label medium12`"
                  :data-id="`order-detail-product-returns-${index}-order-id`"
                >{{
                  $t('page.detailOrder.productReturns.orderDetails.orderId', {
                    orderId: productReturn.externalOrderId,
                  })
                }}
                </span>
              </v-col>
              <v-col col="6" class="wrapper-value-right">
                <mp-date-hour
                  :date="getDate(productReturn.createdAt, 'P')"
                  :hour="getDate(productReturn.createdAt, 'p')"
                  :dataId="`order-detail-product-returns-${index}-dateHour`"
                />
              </v-col>
            </v-row>

            <div class="text-wrapper">
              <span class="label regular12">
                {{ $t('page.detailOrder.productReturns.orderDetails.referenceNumber') }}
              </span>
              <span
                class="value regular14"
                :data-id="`order-detail-product-returns-${index}-reference-number`"
              >{{ productReturn.referenceNumber }}</span>
            </div>

            <div class="text-wrapper">
              <span class="label regular12">
                {{ $t('page.detailOrder.productReturns.orderDetails.deliveryId') }}
              </span>
              <span
                class="value regular14"
                :data-id="`order-detail-product-returns-${index}-delivery-id`"
              >{{
                (productReturn.Delivery && productReturn.Delivery.externalDeliveryId) || '/'
              }}</span>
            </div>

            <div class="text-wrapper">
              <span class="label regular12">
                {{ $t('page.detailOrder.productReturns.orderDetails.deliveryStatus') }}
              </span>
              <span
                class="value regular14"
                :data-id="`order-detail-product-returns-${index}-delivery-status`"
              >{{
                (productReturn.Delivery &&
                  $t([
                    `technical.status.delivery.${productReturn.Delivery.status}.${productReturn.Delivery.subStatus}`,
                    `technical.status.delivery.${productReturn.Delivery.status}.default`,
                  ])) ||
                  '/'
              }}</span>
            </div>

            <div class="text-wrapper">
              <span class="label regular12">
                {{ $t('page.detailOrder.productReturns.orderDetails.carrier') }}
              </span>
              <span
                class="value regular14"
                :data-id="`order-detail-product-returns-${index}-carrier`"
              >{{ (productReturn.Carrier && productReturn.Carrier.name) || '/' }}</span>
            </div>

            <div class="centered">
              <mp-button
                :text="$t('page.detailOrder.productReturns.orderDetails.orderLink')"
                format="secondary"
                linkColor="white"
                :dataId="`routes-${productReturn.id}`"
                :to="getRouterData(productReturn.id)"
              />
            </div>
          </v-col>
        </v-row>
      </div>
    </mp-block>
  </v-container>
</template>

<script lang="ts">
import { OrderEntity } from '@/types'
import Vue from 'vue'

import { dateHelper, dateHelperGetTimezonedDate } from '@/helpers/dateHelper'
import { RawLocation } from 'vue-router'
import { mapGetters } from 'vuex'
import AuthorizationService from '@/services/authorization/AuthorizationService'
import { ROUTES } from '@/constants'

import mpBlock from '@/components/block/block.vue'

export default Vue.extend({
  name: 'mp-product-returns',
  components: {
    mpBlock,
  },
  props: {
    returns: {
      type: Array as () => OrderEntity[],
      required: true,
    },
  },
  data: () => ({
    maxHeight: 'none',
  }),
  computed: {
    ...mapGetters({
      currentUser: 'auth/currentUser',
    }),
  },
  methods: {
    getRouterData(orderId: number): RawLocation | void {
      const { permissions } = this.currentUser

      if (permissions.length && !AuthorizationService.isAllowed('READ_ORDERS', permissions)) {
        return
      }

      if (!orderId) {
        return
      }

      return {
        name: ROUTES.detailOrder,
        params: { id: orderId.toString() },
      }
    },
    getDate(date: string, format: string): string {
      return dateHelper.formatToTimezone(dateHelperGetTimezonedDate(date), 'UTC', format)
    },
  },
})
</script>

<style lang="scss">
@import '../../../../styles/mixins/macScrollbar';

#order-detail-product-returns {
  padding: 0;

  @media #{map-get($display-breakpoints, 'xs-only')} {
    border-top: solid 0.1rem $main-lighten-74-color;
  }

  .title-outer-wrapper {
    margin-bottom: 2.3rem;
  }

  .centered {
    display: flex;
    justify-content: center;
    margin-top: 1rem;
  }

  .regular12 {
    display: flex;

    .label {
      color: $main-lighten-52-color;
      width: 52%;
    }

    .data {
      margin-left: auto;
      text-align: right;
    }
  }

  .content-outer-wrapper {
    overflow: auto;
    @include setMacScrollbar('&');

    .content-wrapper {
      margin-right: 2.5rem;

      .content-wrapper-col {
        margin-bottom: 3rem;

        .product-returns-header-wrapper {
          display: flex;
          align-items: center;

          .icon-wrapper {
            height: 2.4rem;
            width: 2.4rem;
            border-radius: 1.2rem;

            &.green {
              background-color: $success-color !important;
            }

            &.red {
              background-color: $error-color !important;
            }

            i {
              color: $white;
            }
          }

          .label {
            &.label-green {
              color: $success-color !important;
            }

            &.label-red {
              color: $error-color !important;
            }
          }

          .date-hour {
            margin-left: auto;
          }
        }

        .text-wrapper {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: solid 0.1rem $main-lighten-74-color;
          padding-bottom: 1rem;
          padding-top: 1.3rem;

          .wrapper-value-right {
            display: flex;
            justify-content: flex-end;
          }

          .label {
            color: $main-lighten-52-color;
            min-width: fit-content;
            align-self: flex-start;
            padding-top: 0.4rem;
          }

          .value {
            text-align: right;
            align-self: flex-start;
          }
        }

        .text-wrapper:last-of-type {
          border-bottom: none;
        }

        .text-wrapper:first-of-type {
          padding-top: 0;
        }

        .collapse-wrapper {
          @media #{map-get($display-breakpoints, 'xs-only')} {
            padding: 0;
          }

          .v-expansion-panel {
            @media #{map-get($display-breakpoints, 'xs-only')} {
              margin-bottom: 0;
            }

            .v-expansion-panel-header {
              padding: 0;

              .header-wrapper {
                justify-content: left;

                .regular16 {
                  margin: 0;
                  font-size: $regular-12-font-size !important;
                  line-height: $regular-12-line-height !important;
                  font-weight: $regular-12-font-weight !important;
                  color: $main-lighten-52-color;
                }
              }
            }
          }

          .v-expansion-panel-content__wrap {
            word-break: break-word;
          }

          .collapse-title {
            margin-left: 0;
            color: $main-lighten-52-color;
          }
        }
      }
    }
  }

  .action-outer-wrapper {
    display: flex;
    justify-content: center;
    margin-left: -2.5rem;

    .action-wrapper {
      display: flex;
      justify-content: center;
    }
  }
}
</style>
