<template>
  <mp-block
    id="order-detail-alerts-block"
    :title="$vuetify.breakpoint.smAndUp ? $t('page.detailOrder.alerts.title') : ''"
    :hasBorder="$vuetify.breakpoint.smAndUp"
    :hasMarginBottom="$vuetify.breakpoint.smAndUp"
    titleHasPaddingBottom
  >
    <div v-if="alerts && alerts.length" :style="{ maxHeight }" :class="`${alerts.length > 3 ? `alerts-container` : ''}`">
      <v-row
        no-gutters
        v-for="(alert, index) of computedAlerts"
        :key="`alerts-${index}`"
        :ref="`alerts-${index}`"
        :class="`alerts-outer-wrapper${alerts[index + 1] ? ' border' : ''}`"
      >
        <v-col cols="12" class="d-flex alerts-wrapper">
          <mp-date-hour
            :date="getDate(alert.createdAt, 'P')"
            :hour="getDate(alert.createdAt, 'p')"
            :dataId="`alerts-${index}`"
          />

          <div class="information">
            <h3>
              {{
                $t(`components.alertModal.typeAlertText.${alert.type}`, {
                  carrierName: alert.carrierName,
                })
              }}
            </h3>
            <div class="pt-2" v-if="alert.comment">
              <ul v-html="comment(alert.comment)" />
            </div>
          </div>
        </v-col>
      </v-row>

      <div v-if="$vuetify.breakpoint.xsOnly" class="d-flex justify-center mt-10">
        <mp-button
          dataId="order-detail-alerts-showMoreAndShowLess"
          :text="!showMoreAlerts ? `${$t('action.show.base')} +` : `${$t('action.show.base')} -`"
          format="secondary"
          @click="showMoreAlerts = !showMoreAlerts"
        />
      </div>
    </div>
    <div v-else>
      <no-data dataId="alerts-noData" />
    </div>
  </mp-block>
</template>

<script lang="ts">
import Vue from 'vue'

import mpBlock from '@/components/block/block.vue'
import noData from '@/components/noData/noData.vue'

import AlertsService from '@/services/alerts/AlertsService'
import { dateHelper } from '@/helpers/dateHelper'
import { SnackBarType } from '@/store/types'
import { UserAlert } from '../../../../types'

export default Vue.extend({
  name: 'mp-order-alerts',
  components: {
    mpBlock,
    noData,
  },
  props: {
    orderId: {
      type: Number,
      required: true,
    },
  },
  data: () => ({
    alerts: [] as UserAlert[],
    maxHeight: 'none',
    showMoreAlerts: false,
  }),
  computed: {
    computedAlerts() {
      const alerts = [...this.alerts]
      if (this.$vuetify.breakpoint.smAndUp) {
        return alerts
      }

      return this.showMoreAlerts ? alerts : alerts.slice(0, 3)
    },
  },
  async mounted() {
    try {
      this.alerts = await AlertsService.getWithFilter({ orderId: this.orderId })

      if (this.alerts?.length && this.$vuetify.breakpoint.smAndUp) {
        this.$nextTick(() => {
          this.calculateMaxHeight()
        })
      }
    } catch (e) {
      this.$store.dispatch('setSnackbar', {
        type: SnackBarType.ERROR,
        message: this.$t('messages.error'),
      })
    }
  },
  methods: {
    comment(comments: string): string {
      return comments
        .split(' --- ')
        .map((comment: string) => {
          return `<li class="regular14"> ${this.$t(comment.replace(/:/gi, ''))} </li>`
        })
        .join('')
    },
    getDate(date: string, format: string): string {
      return dateHelper.format(date, format)
    },
    calculateMaxHeight() {
      if (this.alerts.length > 3) {
        this.maxHeight = `${((this.$refs['alerts-0'] as any)[0].offsetHeight +
          (this.$refs['alerts-1'] as any)[0].offsetHeight +
          (this.$refs['alerts-2'] as any)[0].offsetHeight -
          1) /
          10}rem`
      }
    },
  },
})
</script>

<style lang="scss">
@import '../../../../styles/mixins/macScrollbar';

#order-detail-alerts-block {
  .alerts-container {
    @media #{map-get($display-breakpoints, 'sm-and-up')} {
      overflow: auto;
      @include setMacScrollbar('&');
    }
  }

  .alerts-outer-wrapper {
    padding-top: 1.6rem;
    padding-bottom: 1.6rem;

    &:last-of-type {
      padding-bottom: 0;
    }
    &:first-of-type {
      padding-top: 0;
    }
    > :hover {
      background-color: $main-lighten-80-color;
    }

    &.border {
      border-bottom: solid 0.1rem $main-lighten-65-color;
    }

    .alerts-wrapper {
      align-items: center;

      @media #{map-get($display-breakpoints, 'xs-only')} {
        flex-direction: column;
        align-items: initial;

        .information {
          padding-left: 0 !important;
          margin-top: 2rem;
          margin-bottom: 2rem;
        }
      }

      display: flex;

      .information {
        padding-left: 4.6rem;
      }

      .btn-treated {
        margin-left: auto;
      }
    }
  }
}
</style>
