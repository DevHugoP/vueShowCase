<template>
  <div id="orders" data-id="order-list">
    <div id="overlay" v-if="showActionsMobile" />
    <content-header
      id="orders__header"
      className="d-flex flex-column mb-1"
      dataId="order-list"
      v-if="$vuetify.breakpoint.smAndUp"
    >
      <template #breadcrumb>
        <mp-breadcrumb />
      </template>

      <template #title>
        <h1 data-id="order-list-title">{{ $t('page.orders.title') }}</h1>
      </template>
    </content-header>

    <orders-filters
      v-if="!isMergeMode"
      :retailers="retailers"
      :carriers="carriers"
      :filterResultLength="orders.length"
      @submit="getOrderList()"
      @reset="getOrderList()"
      class="mb-10"
    >
      <template #actions>
        <div class="order-tabs-icon-wrapper" v-if="!$vuetify.breakpoint.xsOnly">
          <v-menu
            v-if="
              isAuthorized(
                ['DOWNLOAD_DELIVERY_NOTE', 'DOWNLOAD_ORDERS_LABELS', 'MERGE_ORDERS'],
                'OR',
              ) && !isMergeMode
            "
            bottom
            offset-y
            origin="center top"
            transition="scale-transition"
          >
            <template v-slot:activator="{ on, attrs }">
              <mp-button
                v-bind="attrs"
                v-on="on"
                dataId="orderList-actions"
                format="link"
                linkColor="black"
                :text="$t('action.base')"
                icon="apps"
                class="actionButton"
              />
            </template>
            <v-list>
              <v-list-item
                v-for="(action, index) in actions"
                :key="index"
                @click="handleActionsClick(action.type)"
              >
                <v-list-item-icon>
                  <v-icon v-text="action.icon"></v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title v-text="action.text"></v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-menu>

          <v-icon
            v-if="!isMergeMode && $vuetify.breakpoint.mdAndUp"
            :class="`${displayType === DisplayTypeEnum.LIST ? 'selected' : ''} pa-2`"
            @click="displayType = DisplayTypeEnum.LIST"
          >
            mdi-format-list-bulleted
          </v-icon>
          <v-icon
            v-if="!isMergeMode && $vuetify.breakpoint.mdAndUp"
            :class="`ml-5${displayType === DisplayTypeEnum.CARD ? ' selected' : ''} pa-2`"
            @click="displayType = DisplayTypeEnum.CARD"
          >
            mdi-view-grid
          </v-icon>
        </div>
      </template>
    </orders-filters>
    <template v-if="$vuetify.breakpoint.xsOnly">
      <div
        id="mobile-orders-content"
        :class="
          `orders-content__wrapper${isMergeMode ? ' orders-content__wrapper__merge-mode' : ''}`
        "
      >
        <v-row justify="center" class="phone-cards-wrapper" no-gutters v-if="orders.length">
          <order-card
            v-for="(order, index) in orders"
            :key="`order_${order.orderId}_${index}`"
            :order="order"
            :panelType="panelType"
          />
        </v-row>
        <v-row id="no-data" class="no-data-container" no-gutters v-else-if="!loading">
          <no-data dataId="order-list-noData" :blocMode="false" />
        </v-row>
      </div>

      <template v-if="panelType">
        <control-panel
          @submittedMerge="setMergeConfirmed()"
          @submittedLabel="setLabelConfirmed()"
          @noLabels="noLabelsFound()"
          @cancelPanel="panelType = ''"
          v-if="panelType"
          :type="panelType"
        />
      </template>
    </template>

    <template v-else>
      <v-row no-gutters class="orders-wrapper">
        <v-col cols="10" offset="1" ref="ordersWrapper">
          <div v-if="displayType === DisplayTypeEnum.CARD">
            <v-row no-gutters class="dsk-cards-wrapper">
              <order-card
                v-for="(order, index) in orders"
                :key="`order_${order.orderId}_${index}`"
                :order="order"
                :panelType="panelType"
              />
            </v-row>
          </div>
          <div v-else-if="orders.length">
            <order-table :orders="orders" :panelType="panelType" />
          </div>

          <div class="d-flex align-center justify-center mt-5" v-if="showMoreButton">
            <mp-button
              dataId="order-list-see-more"
              class="see-more-btn"
              :text="$t('action.show.more')"
              @click="loadMore()"
              format="primary"
            />
          </div>

          <v-overlay v-if="loading" absolute>
            <v-progress-circular indeterminate size="64" />
          </v-overlay>
        </v-col>
      </v-row>

      <control-panel
        @submittedMerge="setMergeConfirmed()"
        @submittedLabel="setLabelConfirmed()"
        @noLabels="noLabelsFound()"
        @cancelPanel="panelType = ''"
        v-if="panelType"
        :type="panelType"
      />

      <v-row id="no-data" no-gutters v-if="!orders.length && !loading">
        <no-data dataId="order-list-noData" :blocMode="false" />
      </v-row>
    </template>

    <order-slip-modal v-if="displayOrderSlipModal" @hide="displayOrderSlipModal = false" />

    <div
      class="mobile-action-buttons-wrapper"
      v-if="
        $vuetify.breakpoint.xsOnly &&
          isAuthorized(
            ['DOWNLOAD_DELIVERY_NOTE', 'DOWNLOAD_ORDERS_LABELS', 'MERGE_ORDERS'],
            'OR',
          ) &&
          !panelType
      "
    >
      <v-btn fab class="fab-button" v-if="!showActionsMobile" @click="showActionsMobile = true">
        <v-icon>mdi-apps</v-icon>
      </v-btn>
      <v-row no-gutters v-else v-click-outside="onClickOutside">
        <v-col
          cols="12"
          v-for="(action, index) in actions"
          :key="`action-${action.text}-${index}`"
          :class="
            `fab-actions${index === 0 ? ' first' : ''}${
              index === actions.length - 1 ? ' last' : ''
            }`
          "
        >
          <v-row no-gutters class="fab-actions-content" @click="handleActionsClick(action.type)">
            <v-col cols="12" class="fab-actions-text">
              <v-icon>{{ action.icon }}</v-icon>
              <span class="regular16">{{ action.text }}</span>
            </v-col>
            <v-col cols="12" v-if="index !== actions.length - 1">
              <div class="divider" />
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import { PAGINATION_LIMIT, ORDER_LIST_ACTIONS_TYPE, ORDER_LIST_PANEL_TYPE } from '@/constants'

import contentHeader from '@/components/contentHeader/contentHeader.vue'
import mpBreadcrumb from '@/components/breadcrumb/breadcrumb.vue'
import noData from '@/components/noData/noData.vue'
import orderCard from './orderCard/orderCard.vue'
import ordersFilters from './ordersFilters/ordersFilters.vue'
import controlPanel from './mergeControlPanel/mergeControlPanel.vue'
import orderSlipModal from './orderSlipModal/orderSlipModal.vue'
import orderTable from './orderTable/orderTable.vue'

import OrderService from '@/services/order/OrderService'
import AuthorizationService from '@/services/authorization/AuthorizationService'
import CarrierService from '@/services/carrier/CarrierService'
import RetailerService from '@/services/retailer/RetailerService'

export enum DisplayTypeEnum {
  LIST = 'list',
  CARD = 'card',
}

import {
  SET_IS_MERGE_MODE,
  SET_IS_LABEL_MODE,
} from '@/store/modules/orders/mutations-types'
import { SnackBarType } from '@/store/types'
import { OrderEntity, RulesKey, Filters } from '@/types'

const forRule: RulesKey = 'LIST_ORDERS'

export default Vue.extend({
  name: 'orders',
  components: {
    contentHeader,
    mpBreadcrumb,
    noData,
    orderCard,
    ordersFilters,
    controlPanel,
    orderSlipModal,
    orderTable,
  },
  data: () => ({
    PAGINATION_LIMIT,
    orderListInterval: 0,
    filtersPanel: undefined as number | undefined,
    orders: [] as OrderEntity[],
    pagination: {
      offset: 0,
      limit: PAGINATION_LIMIT as number,
    },
    lastLoadedItems: 0,
    displayOrderSlipModal: false,
    actions: [] as Array<{ text: string; icon: string; type: string }>,
    panelType: '',
    showActionsMobile: false,
    displayType: DisplayTypeEnum.CARD as DisplayTypeEnum,
    DisplayTypeEnum,
    loading: true,
    sort: '-createdAt',
    retailers: [] as Filters[],
    carriers: [] as Filters[],
    defaultMobileOrderHeight: 0,
  }),
  async mounted() {
    await Promise.all([this.getRetailers(), this.getCarriers()])
    await this.getOrderList()
    this.setInitialTab()

    this.loading = true

    if (this.isAuthorized(['MERGE_ORDERS'], 'OR')) {
      this.actions.push({
        text: this.$t('action.merge.orders'),
        icon: 'mdi-merge',
        type: ORDER_LIST_ACTIONS_TYPE.MERGE,
      })
    }
    if (this.isAuthorized(['DOWNLOAD_ORDERS_LABELS', 'READ_ORDER_PERSONAL_DATA'], 'AND')) {
      this.actions.push({
        text: this.$t('action.downloadLabels'),
        icon: 'mdi-tag',
        type: ORDER_LIST_ACTIONS_TYPE.LABEL,
      })
    }

    if (this.isAuthorized(['DOWNLOAD_DELIVERY_NOTE'], 'OR')) {
      this.actions.push({
        text: this.$vuetify.breakpoint.smAndUp
          ? this.$t('action.orderSlip')
          : this.$t('action.orderSlipMobile'),
        icon: 'mdi-file-download',
        type: ORDER_LIST_ACTIONS_TYPE.SLIP,
      })
    }

    this.loading = false
  },
  updated() {
    if (this.$vuetify.breakpoint.xsOnly) {
      if (!this.defaultMobileOrderHeight) {
        this.defaultMobileOrderHeight = document.getElementById(
          'mobile-orders-content',
        )!.clientHeight
      }
      this.resizeOrderContent()
    }
  },
  computed: {
    currentUser() {
      return this.$store.getters['auth/currentUser']
    },
    filters() {
      return this.$store.getters['filters/filters']
    },
    isFilterPanelDisplayed() {
      return this.$store.getters['filters/isPanelDisplayed']
    },
    isMergeMode() {
      return this.$store.getters['orders/isMergeMode']
    },
    mainOrderToMerge() {
      return this.$store.getters['orders/mainOrderToMerge']
    },
    ordersToMerge() {
      return this.$store.getters['orders/ordersToMerge']
    },
    isLabelMode() {
      return this.$store.getters['orders/isLabelMode']
    },
    labels() {
      return this.$store.getters['orders/labels']
    },
    showMoreButton() {
      const { limit } = this.pagination
      return this.lastLoadedItems === limit
    },
  },
  methods: {
    isValidMerge() {
      return this.mainOrderToMerge && this.ordersToMerge.length > 0
    },
    async getOrderList() {
      this.loading = true
      const params = {
        ...this.filters,
        ...this.pagination,
        light: true,
        sort: this.sort,
      }

      const orders = await OrderService.getOrderList(params, this.retailers, this.carriers)
      this.orders = orders
      this.lastLoadedItems = orders.length

      this.loading = false
    },
    async loadMore() {
      const { offset, limit } = this.pagination

      if (this.lastLoadedItems < PAGINATION_LIMIT) {
        return
      }

      this.loading = true
      this.pagination.offset = offset + limit

      const params = {
        ...this.filters,
        ...this.pagination,
        light: true,
        sort: this.sort,
      }

      const orders = await OrderService.getOrderList(params, this.retailers, this.carriers)

      this.orders = [...this.orders, ...orders]
      this.lastLoadedItems = orders.length
      this.loading = false
    },

    enableMergeMode() {
      this.$store.commit(`orders/${SET_IS_MERGE_MODE}`, true)
    },
    setMergeConfirmed() {
      this.panelType = ''
      this.$store.dispatch('setSnackbar', {
        type: SnackBarType.SUCCESS,
        message: this.$t('messages.orderMerged'),
      })
    },
    setLabelConfirmed() {
      this.panelType = ''
      this.$store.dispatch('setSnackbar', {
        type: SnackBarType.SUCCESS,
        message: this.$t('messages.successDownloadLabels'),
      })
    },
    noLabelsFound() {
      this.panelType = ''
      this.$store.dispatch('setSnackbar', {
        type: SnackBarType.ERROR,
        timeout: 4000,
        message: this.$t('messages.noLabelToDownload'),
      })
    },
    isAuthorized(rule: RulesKey | RulesKey[], operator: string) {
      const { permissions } = this.$store.getters['auth/currentUser']

      return AuthorizationService.isAllowed(rule, permissions, {}, operator)
    },
    setInitialTab() {
      const { hash } = location

      if (hash) {
        const tab = hash.substring(1)

        if (this.$vuetify.breakpoint.mdAndDown) {
          this.displayType = DisplayTypeEnum.CARD
        } else {
          this.displayType = tab as DisplayTypeEnum
        }
      }

      window.location.hash = `${this.displayType}`
    },
    handleActionsClick(type: string) {
      switch (type) {
        case ORDER_LIST_ACTIONS_TYPE.MERGE:
          this.panelType = ORDER_LIST_PANEL_TYPE.MERGE
          this.enableMergeMode()
          break
        case ORDER_LIST_ACTIONS_TYPE.LABEL:
          this.panelType = ORDER_LIST_PANEL_TYPE.LABEL
          this.$store.commit(`orders/${SET_IS_LABEL_MODE}`, true)
          this.enableMergeMode()
          break
        case ORDER_LIST_ACTIONS_TYPE.SLIP:
          this.displayOrderSlipModal = true
          break
      }
      this.showActionsMobile = false
    },
    onClickOutside() {
      this.showActionsMobile = false
    },
    resizeOrderContent() {
      const header = document.getElementsByTagName('header')
      const orderFilter = document.getElementById('order-list-filter')
      const contentCards = document.getElementById('mobile-orders-content')

      if (contentCards) {
        contentCards.style.height = `${this.defaultMobileOrderHeight}px`
        if (header && orderFilter) {
          const newHeight =
            contentCards.offsetHeight - orderFilter.clientHeight + header[0].clientHeight
          contentCards.style.height = `${newHeight}px`
        }
      }
    },
    async getRetailers() {
      this.retailers = await RetailerService.getFilters({ forRule })
    },
    async getCarriers() {
      this.carriers = await CarrierService.getFilters({ forRule })
    },
  },
  watch: {
    displayType(next) {
      window.location.hash = `${next}`
    },
  },
})
</script>

<style lang="scss">
#orders {
  height: 100%;

  #orders__header {
    box-shadow: none;
    background-color: $white;
    margin-bottom: 0;

    .action-download-delivery-slip,
    .action-merge__btn {
      height: 7rem !important;
      max-width: 20.8rem;
      border-radius: 6rem;

      .v-btn__content {
        width: 100%;
        white-space: initial;

        span {
          margin-left: 1.2rem;
          text-align: left;
        }
      }
    }
  }

  .order-tabs-icon-wrapper {
    display: flex;

    .selected {
      border: 0.1rem $main-color solid;
      border-radius: 0.4rem;
    }

    button {
      cursor: pointer;
      color: $main-color;

      border: 0.1rem transparent solid;
      border-radius: 0.4rem;

      &:hover:not(:focus, .selected, .actionButton) {
        border: 0.1rem $main-lighten-65-color solid;
      }

      &:focus {
        &::after {
          opacity: 0 !important;
        }
      }
    }
  }

  .mobile-action-buttons {
    margin-bottom: 1rem;

    &-wrapper {
      position: fixed;
      bottom: 1rem;
      right: 2rem;
    }
  }

  .mobile-action-buttons-wrapper {
    z-index: 3;

    .fab-button {
      background-color: $main-color;
      border: 0.2rem solid $white;

      i {
        color: $white;
      }
    }

    .fab-actions {
      min-height: 6rem;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      background-color: $white;
      margin-left: 1rem;
      color: $main-color;

      .fab-actions-content {
        align-self: flex-end;

        .fab-actions-text {
          padding-bottom: 1.5rem;
          padding-left: 1rem;
        }
      }

      &.first {
        border-top-left-radius: 0.4rem;
        border-top-right-radius: 0.4rem;
      }

      &.last {
        border-bottom-left-radius: 0.4rem;
        border-bottom-right-radius: 0.4rem;
      }

      .divider {
        height: 0.1rem;
        background-color: $main-lighten-65-color;
        width: 100%;
      }

      span {
        margin-left: 1rem;
      }

      i {
        color: $main-color !important;
      }
    }
  }

  .phone-cards-wrapper {
    display: grid;
    grid-template-columns: repeat(auto-fill, 14rem);
    justify-content: center;
    grid-gap: 1rem;
    grid-row-gap: 2rem;
    margin-bottom: 2rem;
    @media #{map-get($display-breakpoints, 'xs-only')} {
      margin-top: 1rem;
    }
  }

  .orders-wrapper {
    margin-bottom: 5rem;
    @media #{map-get($display-breakpoints, 'sm-and-up')} {
      .dsk-cards-wrapper {
        display: grid;
        grid-template-columns: repeat(auto-fill, 17rem);
        justify-content: flex-start;
        grid-gap: 3rem;
        grid-row-gap: 4rem;
        margin-top: 1rem;
      }
    }
  }

  .order-card {
    a {
      text-decoration: none;
    }

    @media #{map-get($display-breakpoints, 'xs-only')} {
      &:nth-last-child(1):nth-child(odd) {
        margin-right: 17.4rem;
      }
    }

    @media #{map-get($display-breakpoints, 'sm-and-up')} {
      max-width: 17rem;

      &.first-of-line {
        margin-left: 0;
      }
    }
  }

  .orders-content__wrapper {
    height: calc(100vh - 15.8rem);
    padding-top: 1rem;
    overflow: scroll;

    &__merge-mode {
      max-height: calc(100vh - 16.4rem);
    }
  }
}

.no-data-container {
  height: 100%;
}

#overlay {
  position: fixed; /* Sit on top of the page content */
  width: 100%; /* Full width (cover the whole page) */
  height: 100%; /* Full height (cover the whole page) */
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5); /* Black background with opacity */
  z-index: 2; /* Specify a stack order in case you're using a different order for other elements */
  cursor: pointer; /* Add a pointer on hover */
}
</style>
