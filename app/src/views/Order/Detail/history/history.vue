<template>
  <v-container id="order-detail-history" data-id="order-detail-history">
    <mp-block
      id="order-detail-history-block"
      :title="$vuetify.breakpoint.smAndUp ? $t('page.detailOrder.history.title') : ''"
      :hasBorder="$vuetify.breakpoint.smAndUp"
      :hasMarginBottom="$vuetify.breakpoint.smAndUp"
      titleHasPaddingBottom
    >
      <div :class="`${displayedHistories.length > 5 ? `content-outer-wrapper` : ''}`" v-if="displayedHistories.length > 0">
        <v-row
          no-gutters
          :class="
            `content-wrapper${index === displayedHistories.length - 1 ? ' last' : ''}${
              canDisplayDetail(history) ? '' : ' not-allowed'
            }`
          "
          v-for="(history, index) in displayedHistories"
          :key="`history-${history.id}`"
        >
          <v-col cols="12" sm="4" @click="openHistoryDetail(history)">
            <mp-date-hour
              :class="$vuetify.breakpoint.xsOnly ? 'mb-2' : null"
              :date="getDate(history.updatedAt, 'P')"
              :hour="getDate(history.updatedAt, 'p')"
              dataId="order-detail-history-date"
            />
          </v-col>

          <v-col
            cols="12"
            sm="3"
            :class="$vuetify.breakpoint.xsOnly ? 'mb-3' : null"
            @click="openHistoryDetail(history)"
          >
            <div class="regular14 main-color">{{ $t(`technical.history.${history.type}`) }}</div>
          </v-col>

          <v-spacer v-if="$vuetify.breakpoint.smAndUp" />

          <v-col
            cols="12"
            sm="2"
            :class="$vuetify.breakpoint.smAndUp ? 'd-flex justify-end' : null"
            @click="openHistoryDetail(history)"
          >
            <mp-badge
              color="black"
              :content="history.author.name"
              dataId="order-detail-history-author"
            />
          </v-col>
          <v-col
            cols="12"
            sm="2"
            :class="$vuetify.breakpoint.smAndUp ? 'd-flex justify-end' : null"
            v-if="getStackDriverUrl(history)"
          >
            <a :href="getStackDriverUrl(history)" target="_blank">
              <v-icon>mdi-view-list</v-icon>
            </a>
          </v-col>
        </v-row>

        <v-row
          no-gutters
          justify="center"
          class="actions-outer-wrapper"
          v-if="$vuetify.breakpoint.xsOnly && histories && histories.length > 3"
        >
          <mp-button
            dataId="order-detail-history-showMoreButton"
            :text="!showMore ? $t('action.show.more') : $t('action.show.less')"
            :icon="!showMore ? 'plus' : 'minus'"
            iconSize="1.8rem"
            format="secondary"
            @click="showMore = !showMore"
          />
        </v-row>
      </div>

      <v-row no-gutters v-else>
        <v-col cols="12">
          <no-data dataId="order-detail-history-noData" />
        </v-col>
      </v-row>
    </mp-block>

    <history-detail
      v-if="historyDetail && showHistoryDetail"
      :showDialog="showHistoryDetail"
      :historyDetail="historyDetail"
      @hide="showHistoryDetail = false"
      dataId="order-detail-history-detail"
    />
  </v-container>
</template>

<script lang="ts">
import { HISTORY_TYPE } from '@/constants/shared'
import mixins from 'vue-typed-mixins'

import { dateHelper, dateHelperGetTimezonedDate } from '@/helpers/dateHelper'

import noData from '@/components/noData/noData.vue'
import historyDetail from './modals/historyDetail.vue'
import mpBlock from '@/components/block/block.vue'

import OrderService from '@/services/order/OrderService'

import AuthorizationService from '@/services/authorization/AuthorizationService'

const TYPE_WITH_DETAIL = [
  HISTORY_TYPE.UPDATE,
  HISTORY_TYPE.CREATE,
  HISTORY_TYPE.FORCED_STATUS,
  HISTORY_TYPE.REPLANNED,
]

import { OrderHistory, OrderHistoryLight } from '@/types'

import { authorizationMixin } from '@/mixins'

export default mixins(authorizationMixin).extend({
  name: 'mp-history',
  components: {
    noData,
    historyDetail,
    mpBlock,
  },
  props: {
    orderId: {
      type: [String, Number],
      required: true,
    },
  },
  data: () => ({
    histories: null as OrderHistoryLight[] | null,
    historyDetail: null as OrderHistory | null,
    showHistoryDetail: false,
    showMore: false,
  }),
  computed: {
    displayedHistories(): OrderHistoryLight[] {
      if (!this.histories) {
        return []
      }

      if (this.$vuetify.breakpoint.smAndUp) {
        return this.histories
      }

      return this.showMore ? this.histories : this.histories.slice(0, 3)
    },
  },
  mounted() {
    this.fetchOrderHistory()
  },
  methods: {
    getStackDriverUrl(history: OrderHistory) {
      if (!history?.requestId) {
        return null
      }

      if (!this.isAuthorized('READ_TECHNICAL_LOG')) {
        return null
      }

      return OrderService.getStackDriverUrl(history)
    },
    async fetchOrderHistory() {
      this.histories = await OrderService.getHistory(this.orderId)
    },
    async openHistoryDetail(history: OrderHistoryLight) {
      const { id, type } = history

      const { permissions } = this.$store.getters['auth/currentUser']
      if (
        !TYPE_WITH_DETAIL.includes(type) ||
        !AuthorizationService.isAllowed('READ_ORDER_PERSONAL_DATA', permissions)
      ) {
        return
      }

      this.historyDetail = await OrderService.getHistoryDetail(this.orderId, id)
      this.showHistoryDetail = true
    },
    canDisplayDetail(history: OrderHistoryLight) {
      const { permissions } = this.$store.getters['auth/currentUser']
      return (
        TYPE_WITH_DETAIL.includes(history.type) &&
        AuthorizationService.isAllowed('READ_ORDER_PERSONAL_DATA', permissions)
      )
    },
    getDate(date: string, format: string) {
      return dateHelper.formatToTimezone(dateHelperGetTimezonedDate(date), 'UTC', format)
    },
  },
})
</script>

<style lang="scss">
@import '../../../../styles/mixins/macScrollbar';

#order-detail-history {
  padding: 0;

  @media #{map-get($display-breakpoints, 'xs-only')} {
    border-top: solid 0.1rem $main-lighten-74-color;
  }

  .content-outer-wrapper {
    overflow-y: scroll;
    overflow-x: hidden;
    @include setMacScrollbar('&');

    @media #{map-get($display-breakpoints, 'sm-and-up')} {
      max-height: 30rem;
    }
  }
  .content-wrapper {
    padding-bottom: 1.6rem;
    margin-bottom: 1.6rem;
    border-bottom: solid 0.1rem $main-lighten-74-color;
    cursor: pointer;

    @media #{map-get($display-breakpoints, 'sm-and-up')} {
      &:hover {
        background-color: $main-lighten-80-color;
      }
    }

    &.last {
      border-bottom: none;
      padding-bottom: 0;
      margin-bottom: 0;
    }

    &.not-allowed {
      cursor: not-allowed;
    }

    .mp-badge {
      margin-left: 0;

      .v-badge__wrapper {
        margin: 0;

        .v-badge__badge {
          width: fit-content;
        }
      }
    }
  }

  .actions-outer-wrapper {
    padding: 2.8rem 0;
  }
}
</style>
