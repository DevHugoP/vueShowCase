<template>
  <mp-data-table
    id="list-data-table"
    :items="ordersList"
    :headers="headers"
    :hasCustomHover="hasCustomCover"
    :itemsPerPage="-1"
    :pageLabel="$t('common.page')"
    @update:options="onOptionsUpdated"
    :to="
      !panelType
        ? { name: ROUTES.detailOrder, paramKey: 'id', objectKey: 'orderId', toExclude: ['label'] }
        : null
    "
  >
    <template v-slot:label="{ label, item }">
      <v-checkbox
        v-if="item.deliveryCurrentStatus"
        label=""
        class="label-checkbox"
        @change="handleCheckboxChange(item, $event)"
        :data-id="`order-list-list-${item.orderId}-downloadLabel`"
        :false-value="false"
        :true-value="true"
        :input-value="label"
      />
      <v-icon v-else>mdi-cancel</v-icon>
    </template>

    <template v-slot:orderCurrentStatus="{ item }">
      <div v-if="getBadges(item).length">
        <mp-badge
          v-for="badge in getBadges(item)"
          :key="`badges-${badge}`"
          :color="getColor(item)"
          :icon="badge"
          :dataId="`order-list-list-${item.orderId}-badge-${badge}`"
        />
      </div>
      <div v-else></div>
    </template>

    <template v-slot:referenceNumber="{ referenceNumber }">
      <span class="regular14 main-color reference-number">
        {{ referenceNumber }}
      </span>
    </template>

    <template v-slot:date="{ date }">
      <span class="regular14 main-color">
        {{ getDate(date) }}
      </span>
    </template>

    <template v-slot:deliveryStartDate="{ deliveryStartDate }">
      <span class="regular14 main-color">
        {{ getDate(deliveryStartDate) }}
      </span>
    </template>

    <template v-slot:retailerName="{ item }">
      <span class="regular14 main-color">
        {{ item.retailerName }}
      </span>
      <span class="regular14 main-color">
        {{ item.storeName }}
      </span>
    </template>

    <template v-slot:carrierName="{ carrierName }">
      <span class="regular14 main-color">
        {{ carrierName || '-' }}
      </span>
    </template>

    <template v-slot:service="{ item }">
      <div v-for="service in item.services" :key="service" class="summary-list__item pb-2">
        <span class="regular14 main-color">
          {{ $t(`technical.services.${service}`) }}
        </span>
      </div>
    </template>

    <template v-slot:deliveryCurrentStatus="{ item, deliveryCurrentStatus }">
      <span class="regular14 main-color">
        <mp-badge
          :color="getColor(item)"
          :dataId="`order-list-list-${item.orderId}-status`"
          :content="
            $t([
              `technical.status.delivery.${deliveryCurrentStatus}.${item.deliverySubStatus}`,
              `technical.status.delivery.${deliveryCurrentStatus}.default`,
              `technical.status.order.${item.orderCurrentStatus}`,
              $t(`page.orders.noStatus`),
            ])
          "
        >
        </mp-badge>
      </span>
    </template>

    <template v-slot:customHover="{ item, change }">
      <v-row no-gutters class="d-flex justify-space-between align-center hover">
        <div v-if="canBeMerged(item)" class="d-flex">
          <div class="hover-btn-close-wrapper">
            <v-icon @click="handleCloseOverlay(item)">mdi-close-circle</v-icon>
          </div>

          <div class="hover-btn-wrapper">
            <mp-button
              format="secondary"
              :class="
                `ml-5${
                  isMainOrderBeingMerged(item.externalOrderId, item.orderId) ? ' selected' : ''
                }`
              "
              :text="$t('page.orders.merge.mainOrder')"
              :disabled="isMainOrderBeingMerged(item.externalOrderId, item.orderId)"
              :dataId="`order-list-list-${item.orderId}-mainOrder`"
              @click.stop="
                change(item, true, 'orderId')
                handleChangeMerge('main', item)
              "
            />
            <mp-button
              format="secondary"
              :class="
                `ml-5${
                  isInOrdersBeingMerged(item.externalOrderId, item.orderId) ? ' selected' : ''
                }`
              "
              :text="$t('page.orders.merge.orderToMerge')"
              :disabled="isInOrdersBeingMerged(item.externalOrderId, item.orderId)"
              :dataId="`order-list-list-${item.orderId}-pushToMerge`"
              @click.stop="
                change(item, true, 'orderId')
                handleChangeMerge('secondary', item)
              "
            />
          </div>
        </div>
        <div v-else>
          <div class="d-flex justify-center align-center hover-btn-empty-wrapper">
            <v-icon>mdi-cancel</v-icon>
            <span class="medium14" :data-id="`order-list-list-${item.orderId}-notMergable`">
              {{ $t('page.orders.merge.notMergable') }}
            </span>
          </div>
        </div>
      </v-row>
    </template>
  </mp-data-table>
</template>

<script lang="ts">
import { AVAILABLE_LEVEL_SERVICES, ORDER_STATUS } from '@/constants/shared'
import Vue from 'vue'

import { DataTableHeader, OrderLightEntity } from '@/types'

import { dateHelper, dateHelperGetTimezonedDate } from '@/helpers/dateHelper'
import { ORDER_LIST_ACTIONS_TYPE, ROUTES, SUB_STATUS, DELIVERY_STATUS } from '@/constants'
import { mapGetters } from 'vuex'

import { REMOVE_LABELS } from '@/store/modules/orders/mutations-types'
import { CardColor, ORDER_STATUSES_COLOR } from '../orderCard/orderCard.vue'

export interface OrderLightEntityList extends OrderLightEntity {
  label: boolean
  merge: string
}

export default Vue.extend({
  name: 'order-list-list',
  props: {
    orders: {
      type: Array as () => OrderLightEntityList[],
      required: true,
    },
    panelType: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    ordersList: [] as OrderLightEntityList[],
    headers: [] as DataTableHeader[],
    ROUTES,
  }),
  computed: {
    ...mapGetters({
      labels: 'orders/labels',
      mainOrderToMerge: 'orders/mainOrderToMerge',
      ordersToMerge: 'orders/ordersToMerge',
      isInOrdersBeingMerged: 'orders/isInOrdersBeingMerged',
      isMainOrderBeingMerged: 'orders/isMainOrderBeingMerged',
      canBeMerged: 'orders/canBeMerged',
    }),
    hasCustomCover(): boolean {
      return this.panelType === ORDER_LIST_ACTIONS_TYPE.MERGE
    },
  },
  beforeMount() {
    this.ordersList = this.orders
    this.headers = [
      {
        text: this.$t('page.orders.table.reference'),
        value: 'referenceNumber',
        sortable: true,
        width: '20%',
      },
      { text: this.$t('page.orders.table.created'), value: 'date', sortable: true, width: '10%' },
      {
        text: this.$t('page.orders.table.delivery'),
        tooltip: this.$t('page.orders.table.labels.delivery'),
        icon: 'mdi-information',
        value: 'deliveryStartDate',
        sortable: true,
        width: '10%',
      },
      { text: this.$t('common.retailer'), value: 'retailerName', sortable: false },
      { text: this.$t('common.carrier'), value: 'carrierName', sortable: false, width: '12%' },
      {
        text: this.$t('page.orders.table.service'),
        value: 'service',
        sortable: false,
        width: '15%',
      },
      {
        text: this.$t('page.orders.table.status'),
        value: 'deliveryCurrentStatus',
        sortable: true,
        width: '10%',
      },
    ]

    for (const [index, order] of this.ordersList.entries()) {
      this.ordersList.splice(index, 1, { ...order, label: false, merge: '' })
    }
  },
  mounted() {
    if (!this.panelType || this.$vuetify.breakpoint.xsOnly) {
      return
    }

    if (this.panelType === ORDER_LIST_ACTIONS_TYPE.LABEL) {
      this.headers = [
        { text: '', align: 'center', sortable: false, value: 'label' },
        ...this.headers,
      ]
    }
  },
  methods: {
    getBadges(item: OrderLightEntity) {
      const { services, deliveryEndDate } = item
      const current: string[] = []

      const deliveryDate = dateHelperGetTimezonedDate(deliveryEndDate)
      if (dateHelper.isAfter(dateHelperGetTimezonedDate(), deliveryDate)) {
        current.push('timer-outline')
      }

      if (services && services.includes(AVAILABLE_LEVEL_SERVICES.RETURN)) {
        current.push('replay')
      }

      return current
    },
    getColor(item: OrderLightEntity) {
      const { orderCurrentStatus, deliveryCurrentStatus, deliverySubStatus } = item
      const matchingColor = Object.entries(ORDER_STATUSES_COLOR).find((value) => {
        return value[1].includes(orderCurrentStatus)
      })

      let color = ''

      color = matchingColor ? matchingColor[0] : CardColor.MAIN

      // Set specific business rules
      if (
        orderCurrentStatus === ORDER_STATUS.DELIVERED &&
        deliveryCurrentStatus === DELIVERY_STATUS.KO &&
        deliverySubStatus === SUB_STATUS.WITH_CLAIM
      ) {
        color = CardColor.ORANGE
      }

      return color
    },
    getDate(date: string) {
      return dateHelper.formatToTimezone(dateHelperGetTimezonedDate(date), 'UTC', 'P p')
    },
    handleCheckboxChange(order: OrderLightEntity, event: boolean, toVuex = true) {
      const itemIndex = this.ordersList.findIndex(localOrder => localOrder.orderId === order.orderId)
      const editedItem = { ...this.ordersList[itemIndex], label: event }
      this.ordersList.splice(itemIndex, 1, editedItem)

      if (toVuex) {
        const payload = {
          order,
          labels: this.labels,
        }

        this.$store.dispatch('orders/manageLabels', payload)
      }
    },
    handleChangeMerge(mergeType: string, item: OrderLightEntityList) {
      const { externalOrderId, orderId, retailerId, storeId } = item

      if (mergeType === 'main') {
        const payload = {
          externalOrderId,
          orderId,
          retailerId,
          storeId,
          mainOrderToMerge: this.mainOrderToMerge,
          ordersToMerge: this.ordersToMerge,
        }

        this.$store.dispatch('orders/setMainOrderToMerge', payload)
      } else if (mergeType === 'secondary') {
        const payload = {
          externalOrderId,
          orderId,
          retailerId,
          storeId,
          mainOrderToMerge: this.mainOrderToMerge,
        }

        this.$store.dispatch('orders/pushOrderToMerge', payload)
      }
    },
    handleCloseOverlay(order: OrderLightEntity): void {
      const { externalOrderId, orderId, retailerId, storeId } = order

      const payload = {
        externalOrderId,
        orderId,
        retailerId,
        storeId,
        order,
        panelType: this.panelType,
      }

      this.$store.dispatch('orders/handleCloseOverlay', payload)

      const itemIndex = this.ordersList.findIndex(localOrder => localOrder.orderId === order.orderId)
      const editedItem = { ...this.ordersList[itemIndex], ...{ merge: '', keepHovered: false } }
      this.ordersList.splice(itemIndex, 1, editedItem)
    },
    onOptionsUpdated(options: Record<string, any>) {
      let {
        sortBy: [sortBy],
      } = options
      const {
        sortDesc: [sortDesc],
      } = options
      switch (sortBy) {
        default:
        case 'date':
          sortBy = 'createdAt'
          break
        case 'referenceNumber':
          sortBy = 'referenceNumber'
          break
        case 'deliveryStartDate':
          sortBy = 'date'
          break
        case 'retailerName':
          sortBy = 'retailer'
          break
        case 'carrierName':
          sortBy = 'carrier'
          break
        case 'service':
          sortBy = 'service'
          break
        case 'deliveryCurrentStatus':
          sortBy = 'deliveryStatus'
          break
      }
      const sort = `${!sortDesc || sortDesc ? '-' : ''}${sortBy ?? 'createdAt'}`
      this.$emit('update:sort', sort)
    },
  },
  watch: {
    panelType(next: string, current: string) {
      if (this.$vuetify.breakpoint.xsOnly) {
        return
      } else if (!next) {
        if (current === ORDER_LIST_ACTIONS_TYPE.LABEL) {
          this.headers.splice(0, 1)
          for (const [index, order] of this.ordersList.entries()) {
            if (order.label) {
              this.$store.commit(`orders/${REMOVE_LABELS}`, this.ordersList[index])
              const editedItem = { ...this.ordersList[index], label: false }
              this.ordersList.splice(index, 1, editedItem)
            }
          }
        } else if (current === ORDER_LIST_ACTIONS_TYPE.MERGE) {
          for (const [index, order] of this.ordersList.entries()) {
            if ((order as any).keepHovered) {
              const editedItem = { ...this.ordersList[index], merge: '', keepHovered: false }
              this.ordersList.splice(index, 1, editedItem)
            }
          }
        }
      } else {
        if (next === ORDER_LIST_ACTIONS_TYPE.LABEL) {
          this.headers = [
            { text: '', align: 'center', sortable: false, value: 'label' },
            ...this.headers,
          ]
        }
      }
    },
    labels(next: OrderLightEntity[], current: OrderLightEntity[]) {
      const nextLenght = next.length
      const localCurrent = [...current]
      while (nextLenght < localCurrent.length) {
        let orderLight: OrderLightEntity | null = null

        for (const label of localCurrent) {
          if (!next.some(nextLabel => nextLabel.orderId === label.orderId)) {
            orderLight = label
          }
        }

        if (orderLight) {
          this.handleCheckboxChange(orderLight, false, false)
          localCurrent.splice(
            localCurrent.findIndex(localCur => localCur.orderId === orderLight!.orderId),
            1,
          )
        }
      }
    },
    orders(next: OrderLightEntityList[], current: OrderLightEntityList[]) {
      if (next && next.length) {
        if (next[0].label === undefined) {
          next = next.map((order, index) => {
            const cur = current.find(currentOrder => currentOrder.orderId === order.orderId)
            if (cur && order && cur.label !== order.label) {
              return { ...next[index], label: cur!.label }
            }

            if (
              cur &&
              order &&
              (cur!.merge !== order.merge ||
                (cur! as any).keepHovered !== (order as any).keepHovered)
            ) {
              return {
                ...next[index],
                ...{ merge: cur!.merge, keepHovered: (cur! as any).keepHovered },
              }
            }
            return order
          }) as any
        }

        this.ordersList = next
      }
    },
  },
})
</script>

<style lang="scss">
#list-data-table {
  .label-checkbox {
    .v-input__slot {
      margin-bottom: 0 !important;
    }
    .v-messages {
      display: none !important;
    }

    i {
      &.mdi-checkbox-marked {
        color: $success-color !important;
      }
    }
  }

  .reference-number {
    word-break: break-all;
  }

  .custom-row {
    background-color: $white;
    border: 0.1rem solid $main-lighten-52-color;

    .hover-btn-empty-wrapper {
      width: 100%;

      i,
      span {
        color: $main-lighten-52-color;
      }

      i {
        margin-right: 1.5rem;
      }
    }

    .hover {
      .hover-btn-wrapper {
        width: 90%;
        display: flex;
        justify-content: center;
        align-items: center;

        .mp-button.mp-button--secondary.theme--light.v-btn.v-btn--disabled {
          &.selected {
            background-color: $primary-color;
            color: $main-color !important;
            border-color: $primary-color !important;
          }
        }
      }

      .hover-btn-close-wrapper {
        width: 10%;
        display: flex;
        justify-content: flex-end;
        align-items: center;

        .v-icon {
          color: $main-color;
        }
      }

      .radio-group {
        .v-input__slot {
          margin-bottom: 0;
        }

        .v-messages {
          display: none;
        }
      }
    }
  }

  .v-data-table__wrapper {
    .pointer {
      a {
        text-decoration: none;
      }
    }
  }
}
</style>
