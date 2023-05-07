<template>
  <v-container id="detail-order-status" data-id="order-detail-status">
    <mp-block
      id="detail-order-status-block"
      :title="$vuetify.breakpoint.smAndUp ? $t('page.detailOrder.orderStatus.title') : ''"
      :hasBorder="$vuetify.breakpoint.smAndUp"
      :hasMarginBottom="$vuetify.breakpoint.smAndUp"
      titleHasPaddingBottom
    >
      <div v-if="hasData">
        <v-row no-gutters class="dsk" v-if="$vuetify.breakpoint.smAndUp">
          <v-col cols="12" class="content-outer-wrapper" :style="{ maxHeight }">
            <v-row
              no-gutters
              v-for="(status, index) in orderStatus"
              :key="`status-${index}`"
              :ref="`status-${index}`"
              :data-id="`order-detail-status-${index}`"
            >
              <v-col cols="12">
                <div :class="`content-wrapper${index === orderStatus.length - 1 ? ' last' : ''}`">
                  <mp-order-status-date-hour
                    :statusDate="status.date"
                    :dataId="`order-detail-status-${index}-dateHour`"
                  />

                  <div class="regular14 main-color information">
                    <mp-order-status-status
                      :status="status.status"
                      :dataId="`order-detail-status-${index}-status`"
                    />

                    <mp-order-status-comment
                      v-if="status.comment"
                      :comment="status.comment"
                      :dataId="`order-detail-status-${index}-comment`"
                    />
                  </div>
                </div>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-row class="mobile" no-gutters v-else-if="$vuetify.breakpoint.xsOnly">
          <v-col cols="12">
            <v-row
              no-gutters
              v-for="(status, index) in computedOrderStatus"
              :key="`status-${index}`"
              :class="
                `content${
                  (mobileShowLess && index === 2) ||
                  (!mobileShowLess && index === orderStatus.length - 1)
                    ? ' last'
                    : ''
                }`
              "
              :data-id="`order-detail-status-${index}`"
            >
              <v-col cols="12">
                <mp-order-status-date-hour
                  :statusDate="status.date"
                  :dataId="`order-detail-status-${index}-dateHour`"
                />
              </v-col>

              <v-col cols="12" :class="`regular14 main-color ${!status.comment ? 'no-comment' : ''}`">
                <mp-order-status-status
                  :status="status.status"
                  :dataId="`order-detail-status-${index}-status`"
                />
              </v-col>

              <v-col cols="12" v-if="status.comment" class="comment">
                <mp-order-status-comment
                  :comment="status.comment"
                  :dataId="`order-detail-status-${index}-comment`"
                />
              </v-col>
            </v-row>
          </v-col>

          <v-col cols="6" class="action-wrapper" v-if="orderStatus && orderStatus.length > 3">
            <mp-button
              dataId="order-detail-status-showMoreAndShowLess"
              :text="mobileShowLess ? `${$t('action.show.base')} +` : `${$t('action.show.base')} -`"
              format="secondary"
              @click="mobileShowLess = !mobileShowLess"
            />
          </v-col>
        </v-row>
      </div>
      <div v-else>
        <no-data dataId="order-detail-status-noData" />
      </div>
    </mp-block>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'

import mpOrderStatusDateHour from '@/views/Order/Detail/orderStatus/components/dateHour.vue'
import mpOrderStatusStatus from '@/views/Order/Detail/orderStatus/components/status.vue'
import mpOrderStatusComment from '@/views/Order/Detail/orderStatus/components/comment.vue'
import mpBlock from '@/components/block/block.vue'

import noData from '@/components/noData/noData.vue'

import { OrderStatusEntity } from '@/types'
import { dateHelper } from '@/helpers/dateHelper'

export default Vue.extend({
  name: 'mp-order-status',
  components: {
    mpOrderStatusDateHour,
    mpOrderStatusStatus,
    mpOrderStatusComment,
    noData,
    mpBlock,
  },
  props: {
    orderStatus: {
      type: Array as () => OrderStatusEntity[],
      required: true,
    },
  },
  data: () => ({
    maxHeight: 'none',
    mobileShowLess: true,
    hasData: true,
  }),
  mounted() {
    this.hasData = this.computedOrderStatus.length > 0

    if (this.$vuetify.breakpoint.smAndUp && this.hasData) {
      this.$nextTick(() => {
        this.calculateMaxHeight()
      })
    }
  },
  computed: {
    computedOrderStatus(): OrderStatusEntity[] {
      if (!this.orderStatus) {
        return []
      }
      const sortedStatus = this.orderStatus
      sortedStatus.sort(
      (statusA: OrderStatusEntity, statusB: OrderStatusEntity) =>
        dateHelper.parseISO(statusB.date).getTime() - dateHelper.parseISO(statusA.date).getTime(),
      )
      return this.mobileShowLess ? sortedStatus.slice(0, 3) : sortedStatus
    },
  },
  methods: {
    calculateMaxHeight() {
      if (this.orderStatus.length > 3) {
        this.maxHeight = `${((this.$refs['status-0'] as any)[0].offsetHeight +
          (this.$refs['status-1'] as any)[0].offsetHeight +
          (this.$refs['status-2'] as any)[0].offsetHeight -
          1) /
          10}rem`
      }
    },
  },
})
</script>

<style lang="scss">
@import '../../../../styles/mixins/macScrollbar';

#detail-order-status {
  padding: 0;

  @media #{map-get($display-breakpoints, 'xs-only')} {
    border-top: solid 0.1rem $main-lighten-74-color;
  }

  .dsk {
    .overflow {
      overflow: auto;
    }

    .content-outer-wrapper {
      overflow: auto;
      @include setMacScrollbar('&');

      .content-wrapper {
        display: flex;
        padding-bottom: 1.6rem;
        margin-right: 2rem;
        margin-bottom: 1.6rem;
        border-bottom: solid 0.1rem $main-lighten-74-color;

        &.last {
          border-bottom: none;
          padding-bottom: 0;
          margin-bottom: 0;
        }

        .information {
          padding-left: 5rem;
        }
      }
    }
  }

  .mobile {
    .content {
      padding-left: 2.5rem;
      margin-top: 2rem;
      border-bottom: solid 0.1rem $main-lighten-65-color;

      &.last {
        border-bottom: none;
      }

      .no-comment {
        margin-bottom: 1rem;
      }

      .comment {
        margin-bottom: 2rem;
      }
    }

    .action-wrapper {
      margin: auto;
      display: flex;
      justify-content: center;

      i {
        margin-right: 1rem;
      }
    }
  }
}
</style>
