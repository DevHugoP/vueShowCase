<template>
  <v-container id="status-container" data-id="collect-detail-status">
    <div v-if="$vuetify.breakpoint.smAndUp" class="dsk">
      <v-row no-gutters v-for="(status, index) in getStatusList" :key="`status-${index}`">
        <v-col cols="12" :class="`stepper status-${getColor(status)}`">
          <!-- icon -->
          <div class="icon-wrapper" :data-id="`collect-detail-status-${status.status}-icon`">
            <div :class="`border${index === 0 ? ' border-none' : ''}`" />
            <div class="icon">
              <v-icon v-if="getColor(status) !== 'error'">mdi-check-bold</v-icon>
              <v-icon v-else-if="getColor(status) === 'error'">mdi-close-circle</v-icon>
            </div>
            <div :class="`border${index === getStatusList.length - 1 ? ' border-none' : ''}`" />
          </div>

          <!-- time -->
          <div class="date" v-if="getDate(status.date)">
            <span class="regular12 time" :data-id="`collect-detail-status-${status.status}-date`">
              {{ getDate(status.date) }}
            </span>
          </div>

          <span
            class="regular14 status-text"
            :data-id="`collect-detail-status-${status.status}-text`"
          >
            {{ $t(`technical.status.collect.${status.status}`) }}
          </span>
        </v-col>
      </v-row>
    </div>

    <div v-else class="phone-new">
      <!-- status -->
      <div class="double-background" v-if="selectedStatus">
        <div v-for="(status, index) in getStatusList" :key="`status-${index}`" class="d-flex">
          <div
            :class="
              `bubble status-${getColor(status)}${
                selectedStatus.index === index ? ' status-current' : ''
              }`
            "
          >
            <v-icon :size="selectedStatus.index === index ? '2.7rem' : '1.2rem'">
              {{ status.color === 'error' ? 'mdi-close' : 'mdi-check-bold' }}
            </v-icon>
          </div>
          <div
            :class="
              `border border-${status.color}${
                index === selectedStatus.index ? ' border-current' : ''
              }${index === getStatusList.length - 1 ? ' border-none' : ''}`
            "
          />
        </div>
      </div>

      <!-- status detail -->
      <v-row
        no-gutters
        v-if="selectedStatus"
        v-touch="{
          left: () => swipe('Left', selectedStatus.index),
          right: () => swipe('Right', selectedStatus.index),
        }"
      >
        <v-col cols="10" offset="1">
          <div class="status-detail-wrapper">
            <div class="status-detail-header">
              <mp-date-hour
                :date="getDate(selectedStatus.date, 'P')"
                :hour="getDate(selectedStatus.date, 'p')"
                dataId="order-detail-status-selected-status-date"
              />
            </div>
            <div class="status-detail-content-wrapper">
              <v-icon
                @click="goToStatus(false, selectedStatus.index)"
                :class="`${hasStatus(false, selectedStatus.index) ? 'black' : 'white'}`"
              >
                mdi-chevron-left
              </v-icon>
              <div class="status-detail-content">
                <h3>{{ $t(`technical.status.collect.${selectedStatus.status}`) }}</h3>
              </div>

              <v-icon
                @click="goToStatus(true, selectedStatus.index)"
                :class="`${hasStatus(true, selectedStatus.index) ? 'black' : 'white'}`"
              >
                mdi-chevron-right
              </v-icon>
            </div>
          </div>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { dateHelper, dateHelperGetTimezonedDate } from '@/helpers/dateHelper'

import { COLLECT_ERROR_STATUS, COLLECT_STATUS } from '@/types'
import CollectService from '@/services/collect/CollectService'

export default Vue.extend({
  name: 'stepper',
  props: {
    collectStatus: {
      type: Array as () => Array<Record<string, any>>,
      required: true,
    },
    currentStatus: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    collectStatusList: [] as Array<Record<string, any>>,
    selectedStatus: null as Record<string, any> | null,
  }),
  computed: {
    getStatusList(): Array<Record<string, any>> {
      return CollectService.getAvailableStatus(
        this.collectStatusList,
        this.collectStatusList[this.collectStatusList.length - 1].status,
      )
    },
  },
  beforeMount() {
    this.collectStatusList = this.collectStatus
  },
  mounted() {
    this.collectStatusList.sort(
      (statusA, statusB) =>
        new Date(statusA.createdAt).getTime() - new Date(statusB.createdAt).getTime(),
    )

    this.selectedStatus = {
      ...this.collectStatusList[this.collectStatusList.length - 1],
      index: this.collectStatusList.length - 1,
    }
  },
  methods: {
    getDate(date: string, format: string) {
      if (!date) {
        return ''
      }

      return dateHelper.formatToTimezone(dateHelperGetTimezonedDate(date), 'UTC', format || 'P - p')
    },
    getColor(status: Record<string, any>) {
      if (
        !this.collectStatusList.find(({ status: currentStatus }) => currentStatus === status.status) ||
        !status.date
      ) {
        return 'not-done'
      }

      if (COLLECT_ERROR_STATUS.includes(status.status as COLLECT_STATUS)) {
        return 'error'
      }

      return 'valid'
    },
    goToStatus(next: boolean, index: number) {
      const nextIndex = next ? index++ : index--

      this.selectedStatus = {
        ...this.collectStatusList[nextIndex >= 0 ? nextIndex : index],
        index: nextIndex >= 0 ? nextIndex : index,
      }
    },
    hasStatus(next: boolean, index: number) {
      const nextIndex = next ? index++ : index--

      return (
        nextIndex === -1 || !this.collectStatusList[nextIndex] || !this.collectStatusList[nextIndex].date
      )
    },
    swipe(type: string, index: number) {
      this.goToStatus(type === 'Left', index)
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
      max-width: 100vw;
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
  }
}
</style>
