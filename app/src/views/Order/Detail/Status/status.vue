<template>
  <v-container id="status-container" data-id="order-detail-status">
    <div v-if="$vuetify.breakpoint.smAndUp" class="dsk">
      <v-row no-gutters v-for="(status, index) in deliveryStatus" :key="`status-${index}`">
        <v-col
          cols="12"
          :class="
            `stepper status-${status.color}${
              hasDataToDisplayInDialogDeliveryStatus(status) ? ' pointer' : ''
            }`
          "
          @click="handleDeliveryStatusClick(status)"
        >
          <!-- icon -->
          <div class="icon-wrapper" :data-id="`order-detail-status-${status.status}-icon`">
            <div :class="`border${index === 0 ? ' border-none' : ''}`" />
            <div class="icon">
              <v-icon v-if="status.color !== 'error'">mdi-check-bold</v-icon>
              <v-icon v-else-if="status.color === 'error'">mdi-close-circle</v-icon>
            </div>
            <v-icon
              v-if="hasDataToDisplayInDialogDeliveryStatus(status)"
              class="icon-info"
              size="1.3rem"
            >
              mdi-exclamation
            </v-icon>
            <div :class="`border${index === deliveryStatus.length - 1 ? ' border-none' : ''}`" />
          </div>

          <!-- time -->
          <div class="date" v-if="getDate(status.date, 'P - p')">
            <span class="regular12 time" :data-id="`order-detail-status-${status.status}-date`">
              {{ getDate(status.date, 'P - p') }}
            </span>
          </div>

          <span
            class="regular14 status-text"
            :data-id="`order-detail-status-${status.status}-text`"
          >
            {{
              $t([
                `technical.status.delivery.${status.status}.${isReturn ? 'return' : status.subStatus}`,
                `technical.status.delivery.${status.status}.default`,
              ])
            }}
          </span>
        </v-col>
      </v-row>
    </div>

    <div v-else class="phone-new">
      <!-- status -->
      <div class="double-background" v-if="selectedStatus" v-show="showTimeline">
        <div v-for="(status, index) in deliveryStatus" :key="`status-${index}`" class="d-flex">
          <div
            :class="
              `bubble status-${status.color}${
                selectedStatus.status === status.status ? ' status-current' : ''
              }`
            "
          >
            <v-icon :size="selectedStatus.status === status.status ? '2.7rem' : '1.2rem'">
              {{ status.color === 'error' ? 'mdi-close' : 'mdi-check-bold' }}
            </v-icon>
          </div>
          <div
            :class="
              `border border-${status.color}${
                isCurrentStatus(status.status) ? ' border-current' : ''
              }${index === deliveryStatus.length - 1 ? ' border-none' : ''}`
            "
          />
        </div>
      </div>

      <!-- status detail -->
      <v-row
        no-gutters
        v-touch="{
          left: () => swipe('Left'),
          right: () => swipe('Right'),
        }"
      >
        <v-col cols="10" v-if="selectedStatus" offset="1" v-show="showTimeline">
          <div class="status-detail-wrapper">
            <div class="status-detail-header" @click="handleDeliveryStatusClick(selectedStatus)">
              <mp-date-hour
                :date="getDate(selectedStatus.date, 'P')"
                :hour="getDate(selectedStatus.date, 'p')"
                dataId="order-detail-status-selected-status-date"
              />
              <v-icon v-if="hasDataToDisplayInDialogDeliveryStatus(selectedStatus)">
                mdi-information-outline
              </v-icon>
            </div>
            <div class="status-detail-content-wrapper">
              <v-icon @click="goToStatus(false)" :class="`${hasStatus(false) ? 'black' : 'white'}`">
                mdi-chevron-left
              </v-icon>
              <div class="status-detail-content">
                <h3>
                  {{
                    $t([
                      `technical.status.delivery.${selectedStatus.status}.${selectedStatus.subStatus}`,
                      `technical.status.delivery.${selectedStatus.status}.default`,
                    ])
                  }}
                </h3>
                <mp-button
                  v-if="isAuthorized('CALL_CLIENT')"
                  class="mt-6"
                  :text="$t('action.call.client')"
                  dataId="order-detail-status-selected-status-call"
                  format="primary"
                  icon="phone"
                  @click="callClient()"
                />
              </div>

              <v-icon @click="goToStatus(true)" :class="`${hasStatus(true) ? 'black' : 'white'}`">
                mdi-chevron-right
              </v-icon>
            </div>
          </div>
        </v-col>

        <v-col cols="12" class="refresh-wrapper" v-if="showRetry">
          <mp-button
            dataId="order-detail-status-retry"
            format="secondary"
            icon="refresh"
            iconSize="1.8rem"
            :text="$t('page.detailOrder.status.retry')"
            :small="$vuetify.breakpoint.xsOnly"
            @click="$emit('retry')"
          />
        </v-col>

        <v-col cols="12" class="refresh-wrapper mt-3" v-if="showManualQuote">
          <mp-button
            :text="$t('page.detailOrder.manualQuote.title')"
            dataId="order-detail-manualQuote"
            format="alert"
            @click="$emit('open-manual-quote')"
            icon="file-edit-outline"
            small
          />
        </v-col>

        <v-col cols="12" class="refresh-wrapper" v-if="showValidDelievry">
          <mp-button
            :text="$t('action.valid.delivery')"
            dataId="order-detail-validDelivery"
            format="secondary"
            @click="$emit('valid-delivery')"
            class="mt-2"
            small
          />
        </v-col>

        <v-col cols="12" class="refresh-wrapper" v-if="isAuthorized('SHOW_ITINERARY')">
          <mp-button
            class="refresh-wraper"
            :text="$t('common.itinerary')"
            dataId="order-detail-status-map"
            format="secondary"
            icon="google-maps"
            @click="goToMaps()"
            small
          />
        </v-col>

        <v-col cols="12" class="refresh-wrapper" v-if="showReplanningButton">
          <mp-button
            class="refresh-wraper"
            :text="$t('page.detailOrder.appointment.title')"
            dataId="order-detail-create-appointment"
            format="secondary"
            icon="calendar"
            @click="$emit('showDialogAppointmentCreation')"
            small
          />
        </v-col>
      </v-row>
    </div>

    <orderDetailDeliveryStatusDialogDetail
      v-if="openDialogDeliveryStatus"
      @close="openDialogDeliveryStatus = false"
      :status="selectedStatus"
      @submit="openDialogDeliveryStatus = false"
    />
  </v-container>
</template>

<script lang="ts">
import { DELIVERY_STATUS } from '@/constants/shared'

import { dateHelper, dateHelperGetTimezonedDate } from '@/helpers/dateHelper'

import { DELIVERY_STATUS_ERR } from '@/constants'
import { authorizationMixin } from '@/mixins'
import orderDetailDeliveryStatusDialogDetail from '@/views/Order/Detail/Status/modals/detail/detail.vue'
import OrderService from '@/services/order/OrderService'
import { DeliveryStatusEntity } from '@/types'
import mixins from 'vue-typed-mixins'

export interface OStatus extends DeliveryStatusEntity {
  color: string
}

export default mixins(authorizationMixin).extend({
  name: 'mp-status',
  components: {
    orderDetailDeliveryStatusDialogDetail,
  },
  props: {
    baseDeliveryStatus: {
      type: Array as () => DeliveryStatusEntity[],
      required: true,
    },
    showValidDelievry: {
      type: Boolean,
      required: true,
    },
    showRetry: {
      type: Boolean,
      required: false,
    },
    showTimeline: {
      type: Boolean,
      default: true,
    },
    storeId: {
      type: Number,
      required: true,
    },
    deliveryId: {
      type: String,
      required: true,
    },
    showManualQuote: {
      type: Boolean,
      default: true,
    },
    isReturn: {
      type: Boolean,
      default: false,
    },
    showReplanningButton: {
      type: Boolean,
      required: true,
    },
  },
  data: () => ({
    DELIVERY_STATUS,
    openDialogDeliveryStatus: false,
    selectedStatus: null as OStatus | null,
  }),
  computed: {
    deliveryStatusWithoutNotDoneStatus(): OStatus[] {
      return ((this.deliveryStatus as unknown) as OStatus[]).filter(ds => ds.color !== 'not-done')
    },
    deliveryStatus(): OStatus[] {
      const deliveryStatus: OStatus[] = []
      const { baseDeliveryStatus = [] } = this

      // order delivery status by creationOrder
      baseDeliveryStatus.sort(
        (statusA: DeliveryStatusEntity, statusB: DeliveryStatusEntity) =>
          dateHelper.parseISO(statusA.date).getTime() - dateHelper.parseISO(statusB.date).getTime(),
      )

      // add state of status valid or error
      for (const baseStatus of baseDeliveryStatus) {
        deliveryStatus.push({
          ...baseStatus,
          color: DELIVERY_STATUS_ERR.includes(baseStatus.status) ? 'error' : 'valid',
        } as OStatus)
      }

      return deliveryStatus
    },
  },
  mounted() {
    const { baseDeliveryStatus } = this

    if (!baseDeliveryStatus) {
      return
    }

    for (const status of (this.deliveryStatus as unknown) as OStatus[]) {
      if (status.status === baseDeliveryStatus[baseDeliveryStatus.length - 1].status) {
        this.selectedStatus = status
      }
    }
  },
  methods: {
    getDate(date: string, format: string) {
      if (!date) {
        return ''
      }
      return dateHelper.formatToTimezone(dateHelperGetTimezonedDate(date), 'UTC', format)
    },
    hasDataToDisplayInDialogDeliveryStatus(status: OStatus) {
      return !(!status.comment && !status.team && !status.appointment && !status.additionalData)
    },
    handleDeliveryStatusClick(status: OStatus) {
      if (this.hasDataToDisplayInDialogDeliveryStatus(status)) {
        this.selectedStatus = status
        this.openDialogDeliveryStatus = true
      }
    },
    isCurrentStatus(status: string) {
      return status === this.baseDeliveryStatus[this.baseDeliveryStatus.length - 1].status
    },
    goToStatus(next: boolean) {
      let indexOfStatus = this.deliveryStatus.findIndex(
        status => status.status === this.selectedStatus?.status,
      )

      if (next) {
        indexOfStatus += 1

        if (
          indexOfStatus < this.deliveryStatus.length &&
          (this.deliveryStatus.findIndex(status => status.color === 'not-done') === -1 ||
            indexOfStatus < this.deliveryStatus.findIndex(status => status.color === 'not-done'))
        ) {
          this.selectedStatus = this.deliveryStatus[indexOfStatus]
        }
      } else {
        indexOfStatus -= 1

        if (indexOfStatus > -1) {
          this.selectedStatus = this.deliveryStatus[indexOfStatus]
        }
      }
    },
    hasStatus(next: boolean) {
      let indexOfStatus = this.deliveryStatus.findIndex(
        status => status.status === this.selectedStatus?.status,
      )

      if (next) {
        indexOfStatus += 1
      } else {
        indexOfStatus -= 1
      }

      return !(indexOfStatus === -1 ||
        !this.deliveryStatus[indexOfStatus] ||
        this.deliveryStatus[indexOfStatus].color === 'not-done')
    },
    async callClient() {
      OrderService.callClient(parseInt(this.$route.params.id, 10), this.isReturn)
    },
    async goToMaps() {
      OrderService.goToMaps(parseInt(this.$route.params.id, 10), this.isReturn)
    },
    swipe(type: string) {
      this.goToStatus(type === 'Left')
    },
  },
})
</script>

<style lang="scss" scoped>
#status-container {
  display: flex;
  padding: 0;

  @media #{map-get($display-breakpoints, 'xs-only')} {
    margin-bottom: 1rem;
  }

  .dsk {
    display: flex;
    flex-wrap: wrap;

    @media #{map-get($display-breakpoints, 'sm-and-up')} {
      width: 100%;
    }

    .stepper {
      height: fit-content;
      width: 13.3rem;
      display: flex;
      align-items: center;
      flex-direction: column;
      padding-top: 1.089rem;

      &.pointer {
        cursor: pointer;
      }

      &.status-valid {
        color: $white;

        .date {
          background-color: $white;
          border: solid 0.1rem $main-lighten-52-color !important;
          color: $main-lighten-52-color;
        }

        .icon {
          background-color: $success-color;

          i {
            color: $white !important;
          }
        }

        .status-text {
          color: $main-color;
        }
      }

      &.status-error {
        color: $white;

        .date {
          background-color: $alert-color;
        }

        .icon {
          background-color: $alert-color;

          i {
            color: $white !important;
          }
        }

        .status-text {
          color: $alert-color;
        }
      }

      &.status-not-done {
        color: $main-lighten-65-color;

        .date {
          border: solid 0.1rem $main-lighten-65-color;
        }

        .icon {
          border: solid 0.1rem $main-lighten-65-color;
        }

        i {
          color: $main-lighten-65-color !important;
        }
      }

      i {
        &.status-valid {
          color: $success-color !important;
        }

        &.status-current {
          color: $white !important;
        }
      }

      .icon-wrapper {
        width: 100%;
        display: flex;
        justify-content: center;
        position: relative;

        .icon-info {
          position: absolute;
          z-index: 2;
          background-color: $primary-color;
          border-radius: 50%;
          color: $main-color;
          top: -0.7rem;
          left: 53%;
          width: 1.6rem;
          height: 1.6rem;
          box-shadow: 0 -0.3rem 0.5rem $main-color;
          transform: rotate(180deg);
          border: solid 0.1rem $main-color;

          &::before {
            padding-top: 0.2rem;
          }
        }

        .icon {
          height: 4rem;
          width: 4rem;
          min-height: 4rem;
          min-width: 4rem;
          border-radius: 2rem;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .border {
          width: 100%;
          height: 0.1rem;
          border-bottom: solid 0.1rem $main-lighten-74-color;
          align-self: center;

          &.border-none {
            border-bottom: none;
          }
        }
      }

      .date {
        width: 13.3rem;
        height: fit-content;
        min-width: 13.3rem;
        min-height: 2rem;
        border-radius: 5rem;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 1rem;
        text-align: center;
      }

      .status-text {
        padding: 1rem 1.35rem 0.3rem 1.35rem;
        text-align: center;
      }
    }
  }

  .phone-new {
    width: 100%;

    .double-background {
      display: flex;
      align-items: center;
      width: 100%;
      height: 10rem;
      overflow-x: auto;
      padding-left: 8.3333%;

      background: $primary-color;
      background: -moz-linear-gradient(
        top,
        $primary-color 0%,
        $primary-color 50%,
        $white 50%,
        $white 100%
      );
      background: -webkit-gradient(
        left top,
        left bottom,
        color-stop(0%, $primary-color),
        color-stop(50%, $primary-color),
        color-stop(50%, $white),
        color-stop(100%, $white)
      );
      background: -webkit-linear-gradient(
        top,
        $primary-color 0%,
        $primary-color 50%,
        $white 50%,
        $white 100%
      );
      background: -o-linear-gradient(
        top,
        $primary-color 0%,
        $primary-color 50%,
        $white 50%,
        $white 100%
      );
      background: -ms-linear-gradient(
        top,
        $primary-color 0%,
        $primary-color 50%,
        $white 50%,
        $white 100%
      );
      background: linear-gradient(
        to bottom,
        $primary-color 0%,
        $primary-color 50%,
        $white 50%,
        $white 100%
      );

      .bubble {
        min-width: 2.4rem;
        min-height: 2.4rem;
        border-radius: 50%;
        background-color: $white;
        box-shadow: 0 0.2rem 0.4rem $main-lighten-65-color;

        display: flex;
        justify-content: center;
        align-items: center;

        &.status-valid {
          i {
            color: $success-color !important;
          }
        }

        &.status-current {
          min-height: 6rem;
          min-width: 6rem;
          border: solid 0.3rem $success-color;

          &.status-error {
            border: solid 0.3rem $alert-color !important;
          }

          i {
            color: $success-color;
          }
        }

        &.status-error {
          i {
            color: $alert-color !important;
          }
        }

        &.status-not-done {
          i {
            color: $main-lighten-65-color !important;
          }
        }
      }

      .border {
        width: 2rem;
        height: 0.1rem;
        border-bottom: solid 0.2rem $main-lighten-52-color;
        align-self: center;

        &.border-current,
        &.border-not-done {
          border-bottom: dotted 0.2rem $main-lighten-52-color;
        }

        &.border-none {
          border-bottom: none;
        }
      }
    }

    .status-detail-wrapper {
      width: 100%;
      height: fit-content;
      border: solid 0.1rem $main-lighten-74-color;
      border-radius: 0.4rem;
      box-shadow: 0 0.4rem 0.6rem $main-lighten-74-color;

      .status-detail-header {
        min-height: 4.2rem;
        border-bottom: solid 0.1rem $main-lighten-74-color;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-left: 2rem;
        padding-right: 2rem;
      }

      .status-detail-content-wrapper {
        padding-top: 1.5rem;
        padding-bottom: 1.5rem;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .v-icon {
          &.black {
            color: $main-color !important;
            background-color: $white !important;
          }

          &.white {
            color: $white !important;
            background-color: $white !important;
          }
        }

        .status-detail-content {
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          text-align: center;
        }
      }
    }

    .refresh-wrapper {
      display: flex;
      justify-content: center;
      margin-top: 2rem;
    }
  }
}
</style>
