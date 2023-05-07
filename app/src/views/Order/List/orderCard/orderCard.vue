<template>
  <v-hover
    :disabled="$vuetify.breakpoint.xsOnly"
    v-model="isCardHovered"
    :data-id="`order-list-card-${order.orderId}`"
  >
    <template #default>
      <v-card :class="`cards cards--${color}`" outlined :ripple="false" :to="getRouterData()">
        <div
          v-if="
            panelType === ORDER_LIST_PANEL_TYPE.MERGE &&
              !shouldDisplayOverlay() &&
              $vuetify.breakpoint.xsOnly
          "
          class="d-flex justify-center align-center card-button__overlay__wrapper"
          :data-id="`order-list-card-${order.orderId}-overlay`"
        >
          <v-btn fab absolute class="card-button__overlay" @click="isOverlayButtonClicked = true">
            <v-icon>mdi-link-variant</v-icon>
          </v-btn>
        </div>
        <div
          v-else-if="
            panelType === ORDER_LIST_PANEL_TYPE.LABEL &&
              $vuetify.breakpoint.xsOnly &&
              !shouldDisplayOverlay()
          "
          class="d-flex justify-center align-center card-button__overlay__wrapper"
          :data-id="`order-list-card-${order.orderId}-overlay`"
        >
          <v-row no-gutters>
            <v-col cols="12" @click="manageLabels()" class="d-flex justify-center">
              <div :class="`label-add-btn${isOrderInLabel() ? ' selected' : ''}`">
                <v-icon>{{ isOrderInLabel() ? 'mdi-check-bold' : 'mdi-plus' }}</v-icon>
              </div>
            </v-col>
          </v-row>
        </div>
        <v-slide-y-reverse-transition>
          <v-overlay
            :class="$vuetify.breakpoint.smAndUp ? 'overlay__centered' : ''"
            absolute
            opacity="0.85"
            color="#fff"
            z-index="1"
            v-if="shouldDisplayOverlay()"
          >
            <v-row no-gutters class="overlay-close-btn">
              <v-col class="close-overlay__btn__wrapper d-flex justify-end" cols="12">
                <v-btn
                  v-if="
                    isMainOrderBeingMerged(order.externalOrderId, order.orderId) ||
                      isInOrdersBeingMerged(order.externalOrderId, order.orderId) ||
                      isOrderInLabel()
                  "
                  class="close-overlay__btn"
                  elevation="0"
                  x-small
                  fab
                  @click="handleCloseOverlay()"
                  :data-id="`order-list-card-${order.orderId}-overlay-close`"
                >
                  <v-icon size="16">mdi-close</v-icon>
                </v-btn>
              </v-col>
            </v-row>

            <div
              v-if="panelType === ORDER_LIST_PANEL_TYPE.MERGE"
              class="merge-actions-outer-wrapper"
            >
              <template v-if="canBeMerged(order)">
                <v-row no-gutters>
                  <v-col class="merge-actions__wrapper" cols="12">
                    <mp-button
                      format="secondary"
                      :text="$t('page.orders.merge.mainOrder')"
                      :disabled="isMainOrderBeingMerged(order.externalOrderId, order.orderId)"
                      :dataId="`order-list-card-${order.orderId}-mainOrder`"
                      @click.stop="setMainOrderToMerge()"
                    />
                    <mp-button
                      format="secondary"
                      :text="$t('page.orders.merge.orderToMerge')"
                      :disabled="isInOrdersBeingMerged(order.externalOrderId, order.orderId)"
                      :dataId="`order-list-card-${order.orderId}-pushToMerge`"
                      @click.stop="pushOrderToMerge()"
                    />
                  </v-col>
                </v-row>
              </template>
              <template v-else>
                <v-row
                  :class="`d-flex align-center pb-12${$vuetify.breakpoint.xsOnly ? ' mt-3' : ''}`"
                  no-gutters
                >
                  <v-col class="no-merge__wrapper d-flex flex-column" cols="12">
                    <v-icon>mdi-cancel</v-icon>
                    <span
                      class="medium14"
                      :data-id="`order-list-card-${order.orderId}-notMergable`"
                    >{{ $t('page.orders.merge.notMergable') }}</span>
                  </v-col>
                </v-row>
              </template>
            </div>
            <div
              v-else-if="panelType === ORDER_LIST_PANEL_TYPE.LABEL"
              class="merge-actions-outer-wrapper"
            >
              <v-row no-gutters>
                <v-col
                  class="merge-actions__wrapper"
                  cols="12"
                  @click="manageLabels()"
                  v-if="order.deliveryCurrentStatus"
                >
                  <div :class="`label-add-btn${isOrderInLabel() ? ' selected' : ''}`">
                    <v-icon>{{ isOrderInLabel() ? 'mdi-check-bold' : 'mdi-plus' }}</v-icon>
                  </div>
                </v-col>
                <v-col class="no-merge__wrapper merge-actions__wrapper" cols="12" v-else>
                  <v-icon>mdi-cancel</v-icon>
                  <span
                    class="medium14"
                    :data-id="`order-list-card-${order.orderId}-notMergable`"
                  >{{ $t('page.orders.label.impossible') }}</span>
                </v-col>
              </v-row>
            </div>
          </v-overlay>
        </v-slide-y-reverse-transition>

        <mp-card
          :id="order.orderId"
          :title="order.referenceNumber || $t('page.orders.uncompletedOrder') | truncate"
          :fromOrder="true"
          :contents="[
            {
              icon: 'mdi-calendar-month',
              text: getDate(order.deliveryStartDate, 'P - p'),
            },
            {
              icon: 'mdi-storefront-outline',
              text:
                order.retailerName && order.storeName
                  ? `${order.retailerName} ${order.storeName}`
                  : '--',
            },
            { icon: 'mdi-truck', text: order.carrierName || '--' },
          ]"
          :footer="
            $t([
              `technical.status.delivery.${order.deliveryCurrentStatus}.${order.deliverySubStatus}`,
              `technical.status.delivery.${order.deliveryCurrentStatus}.default`,
              `technical.status.order.${order.orderCurrentStatus}`,
              $t(`page.orders.noStatus`),
            ])
          "
          :badges="[
            isLate ? { icon: 'timer-outline' } : null,
            isMerged ? { icon: 'link-variant' } : null,
            isReturn ? { icon: 'replay' } : null,
          ]"
          :color="color"
        />
      </v-card>
    </template>
  </v-hover>
</template>

<script lang="ts">
import { AVAILABLE_LEVEL_SERVICES, ORDER_STATUS } from '@/constants/shared'
import mixins from 'vue-typed-mixins'
import { mapGetters } from 'vuex'

import { ROUTES, ORDER_LIST_PANEL_TYPE, DELIVERY_STATUS, SUB_STATUS } from '@/constants'
import { OrderLightEntity } from '@/types'

import { dateHelper, dateHelperGetTimezonedDate } from '@/helpers/dateHelper'

import AuthorizationService from '@/services/authorization/AuthorizationService'

import { authorizationMixin } from '@/mixins'

import mpCard from '@/components/card/card.vue'

export enum CardColor {
  MAIN = 'main',
  GREEN = 'green',
  RED = 'red',
  ORANGE = 'orange',
  GREY = 'grey',
}

export const ORDER_STATUSES_COLOR = {
  [CardColor.MAIN]: [ORDER_STATUS.TO_DELIVER, ORDER_STATUS.BEING_DELIVERED],
  [CardColor.GREEN]: [ORDER_STATUS.DELIVERED],
  [CardColor.RED]: [
    ORDER_STATUS.WITH_NO_CARRIER_AVAILABLE,
    ORDER_STATUS.WITH_NO_CARRIER_ELIGIBLE,
    ORDER_STATUS.WITH_NO_QUOTE,
    ORDER_STATUS.REFUSED_DELIVERY,
    ORDER_STATUS.TO_BE_COMPLETED,
  ],
  [CardColor.ORANGE]: [ORDER_STATUS.DELIVERY_UNCOMPLETED],
  [CardColor.GREY]: [ORDER_STATUS.CANCELLED],
}

export default mixins(authorizationMixin).extend({
  name: 'order-card',
  components: {
    mpCard,
  },
  props: {
    order: {
      type: Object as () => OrderLightEntity,
      required: true,
    },
    panelType: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    ROUTES,
    raised: false,
    color: '',
    isLate: false,
    isMerged: false,
    isCardHovered: false,
    isOverlayButtonClicked: false,
    isReturn: false,
    ORDER_LIST_PANEL_TYPE,
  }),
  computed: {
    ...mapGetters({
      currentUser: 'auth/currentUser',
      mainOrderToMerge: 'orders/mainOrderToMerge',
      ordersToMerge: 'orders/ordersToMerge',
      labels: 'orders/labels',
      isInOrdersBeingMerged: 'orders/isInOrdersBeingMerged',
      isMainOrderBeingMerged: 'orders/isMainOrderBeingMerged',
      canBeMerged: 'orders/canBeMerged',
    }),
  },
  mounted() {
    this.setCardColor()
    this.setBadges()
  },
  methods: {
    shouldDisplayOverlay() {
      if (
        !this.panelType ||
        (this.panelType === ORDER_LIST_PANEL_TYPE.LABEL && this.$vuetify.breakpoint.xsOnly)
      ) {
        return false
      }

      if (this.$vuetify.breakpoint.xsOnly) {
        return this.isOverlayButtonClicked || this.isUsedForPanel()
      } else {
        return this.isCardHovered || this.isUsedForPanel()
      }
    },
    isUsedForPanel() {
      switch (this.panelType) {
        case ORDER_LIST_PANEL_TYPE.MERGE:
          return (
            this.isMainOrderBeingMerged(this.order.externalOrderId, this.order.orderId) ||
            this.isInOrdersBeingMerged(this.order.externalOrderId, this.order.orderId)
          )
        case ORDER_LIST_PANEL_TYPE.LABEL:
          return this.labels.find((label: OrderLightEntity) => label.orderId === this.order.orderId)
        default:
          return false
      }
    },
    isOrderInLabel() {
      return this.labels.some((label: OrderLightEntity) => label.orderId === this.order.orderId)
    },
    getRouterData() {
      const { permissions } = this.currentUser
      const { orderId } = this.order

      if (permissions.length && !AuthorizationService.isAllowed('READ_ORDERS', permissions)) {
        return
      }

      if (this.panelType || !orderId) {
        return
      }

      return {
        name: ROUTES.detailOrder,
        params: { id: orderId.toString() },
      }
    },
    setCardColor() {
      const { orderCurrentStatus, deliveryCurrentStatus, deliverySubStatus } = this.order
      const matchingColor = Object.entries(ORDER_STATUSES_COLOR).find((value) => {
        return value[1].includes(orderCurrentStatus)
      })

      this.color = matchingColor ? matchingColor[0] : CardColor.MAIN

      // Set specific business rules
      if (
        orderCurrentStatus === ORDER_STATUS.DELIVERED &&
        deliveryCurrentStatus === DELIVERY_STATUS.KO &&
        deliverySubStatus === SUB_STATUS.WITH_CLAIM
      ) {
        this.color = CardColor.ORANGE
      }
      if (deliveryCurrentStatus === DELIVERY_STATUS.CLOSED) {
        this.color = CardColor.GREY
      }
    },
    setBadges() {
      const {
        order: { services, deliveryEndDate },
      } = this

      // Late
      const deliveryDate = dateHelperGetTimezonedDate(deliveryEndDate)
      this.isLate = dateHelper.isAfter(dateHelperGetTimezonedDate(), deliveryDate)

      // Merge
      this.isMerged = false
      this.isReturn = services && services.includes(AVAILABLE_LEVEL_SERVICES.RETURN)
    },
    setMainOrderToMerge() {
      const { externalOrderId, orderId, retailerId, storeId } = this.order

      const payload = {
        externalOrderId,
        orderId,
        retailerId,
        storeId,
        mainOrderToMerge: this.mainOrderToMerge,
        ordersToMerge: this.ordersToMerge,
      }

      this.$store.dispatch('orders/setMainOrderToMerge', payload)
    },
    pushOrderToMerge() {
      const { externalOrderId, orderId, retailerId, storeId } = this.order

      const payload = {
        externalOrderId,
        orderId,
        retailerId,
        storeId,
        mainOrderToMerge: this.mainOrderToMerge,
      }

      this.$store.dispatch('orders/pushOrderToMerge', payload)
    },
    manageLabels(): void {
      const payload = {
        order: this.order,
        labels: this.labels,
      }

      this.$store.dispatch('orders/manageLabels', payload)
    },
    handleCloseOverlay(): void {
      const { externalOrderId, orderId, retailerId, storeId } = this.order

      const payload = {
        externalOrderId,
        orderId,
        retailerId,
        storeId,
        order: this.order,
        panelType: this.panelType,
      }

      this.$store.dispatch('orders/handleCloseOverlay', payload)

      this.isOverlayButtonClicked = false
    },
    getDate(date: string, format: string): string {
      return dateHelper.formatToTimezone(dateHelperGetTimezonedDate(date), 'UTC', format)
    },
  },
  watch: {
    isOrderBeingMerged(next) {
      if (next === false && this.$vuetify.breakpoint.xsOnly) {
        this.isOverlayButtonClicked = false
      }
    },
  },
})
</script>

<style lang="scss">
.v-card.cards {
  &:hover {
    box-shadow: 0 0.4rem 1.6rem rgba(0, 0, 0, 0.18);
    cursor: pointer;
  }

  .card-button__overlay__wrapper {
    position: absolute;
    width: 100%;
    height: 100%;

    .card-button__overlay {
      z-index: auto;
      background-color: $primary-color !important;
      border: 0.2rem solid $main-color;
      width: 5rem;
      height: 5rem;
      box-shadow: $box-shadow-default;
    }

    .label-add-btn {
      width: 5rem;
      height: 5rem;
      border-radius: 50%;
      border: 0.2rem solid $main-color;
      display: flex;
      justify-content: center;
      background-color: $white;

      &.selected {
        background-color: $primary-color;
        color: $main-color !important;
      }

      i {
        color: $main-color !important;
      }
    }
  }

  .v-overlay {
    border: 0.2rem solid $main-color;

    &.overlay__centered {
      .v-overlay__content {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;

        @media #{map-get($display-breakpoints, 'sm-and-up')} {
          flex-direction: column;

          .overlay-close-btn {
            width: 100%;
            max-height: 5rem;
          }
        }
      }
    }

    .v-overlay__content {
      height: 100%;

      .close-overlay__btn__wrapper {
        margin-bottom: 2rem;

        @media #{map-get($display-breakpoints, 'xs-only')} {
          height: 1.6rem;
        }

        .close-overlay__btn {
          width: 1.6rem;
          height: 1.6rem;
          margin: 1rem 1.2rem 0 0;
        }
      }

      .no-merge__wrapper {
        padding: 0 2.2rem;

        i,
        span {
          color: $main-lighten-52-color;
          text-align: center;
        }

        i {
          margin-bottom: 1.5rem;
        }
      }

      .merge-actions-outer-wrapper {
        height: 80%;
        display: flex;

        .merge-actions__wrapper {
          padding: 0 2.2rem;

          display: flex;
          flex-direction: column;
          justify-content: center;
          margin-bottom: 5rem;

          .label-add-btn {
            width: 5rem;
            height: 5rem;
            border-radius: 50%;
            border: 0.2rem solid $main-color;
            display: flex;
            justify-content: center;

            &.selected {
              background-color: $primary-color;
              color: $main-color !important;
            }

            i {
              color: $main-color !important;
            }
          }

          .v-btn {
            border-radius: 0.4rem;
            height: 6rem !important;
            margin: 0.5rem 0;
            border: 0.1rem solid $main-color;

            @media #{map-get($display-breakpoints, 'xs-only')} {
              padding: 0 0.3rem !important;
            }

            .v-btn__content {
              width: 100%;

              span {
                font-size: $regular-14-font-size !important;
                letter-spacing: $regular-14-letter-spacing !important;
                line-height: $regular-14-line-height !important;
                font-weight: $regular-14-font-weight !important;
              }
            }

            &.v-btn--disabled {
              background-color: $primary-color;
              color: $main-color !important;
              border: none;
            }
          }
        }
      }
    }
  }
}
</style>
