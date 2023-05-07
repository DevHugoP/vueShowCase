<template>
  <v-container class="updated-slots-content" :data-id="`${dataId}`">
    <div class="mb-4" v-if="Object.keys(updatedSlots).length > 0">
      <v-row no-gutters justify="center" class="mb-4">
        <v-col cols="12" class="text-center">
          <span class="regular16">{{ `${infoOne}` }}</span>
        </v-col>
      </v-row>

      <v-row
        no-gutters
        justify="center"
        v-if="infoTwo"
      >
        <v-col cols="12" class="text-center">
          <span class="regular16">{{ `${infoTwo}` }}</span>
        </v-col>
      </v-row>

      <v-row no-gutters justify="center">
        <v-col cols="10" class="text-center">
          <div class="day-selector-wrapper mb-2">
            <div
              :class="
                `day-selector${index === Object.keys(updatedSlots).length - 1 ? ' last' : ''}${
                  day === selectedDay ? ' selected' : ''
                }${
                  (updatedSlots[day] && updatedSlots[day].length) || frequency.type === ''
                    ? ''
                    : ' disabled'
                }`
              "
              v-for="(day, index) of Object.keys(updatedSlots)"
              :key="`day-${day}`"
              @click="updatedSlots[day] && updatedSlots[day].length ? daySelected(day) : null"
            >
              <span class="regular14">{{ $t(`common.days.${day.slice(0, 3)}`) }}</span>
            </div>
          </div>
        </v-col>
      </v-row>

      <v-row no-gutters justify="center">
        <v-col cols="10" class="text-center">
          <div class="slot-wrapper">
            <div
              :class="`slot`"
              v-for="(capacity, index) of updatedSlots[selectedDay]"
              :key="`slots-${index}-${selectedDay}-${updatedSlots[selectedDay].length}`"
            >
              <div class="content-wrapper">
                <span class="regular14">
                  {{
                    `${getTimezoneSlotDate(capacity.start)} - ${getTimezoneSlotDate(capacity.end)}`
                  }}
                </span>
              </div>
            </div>
          </div>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'

import { dateHelper, dateHelperGetTimezonedDate, dateHelperSetUtcTime } from '@/helpers/dateHelper'
import { DayCapacity } from '@/types'

export default Vue.extend({
  name: 'mp-updated-slots',
  props: {
    dataId: {
      type: String,
      required: true,
    },
    updatedSlots: {
      type: Object as () => Record<string, DayCapacity[]>,
      required: true,
    },
    infoOne: {
      type: String,
      required: true,
    },
    infoTwo: {
      type: String,
      default: '',
    },
    timezone: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      hasLoaded: false,
      selectedDay: '',
    }
  },
  mounted() {
    this.selectedDay = Object.keys(this.updatedSlots)[0]
    this.hasLoaded = true
  },
  methods: {
    daySelected(day: string) {
      this.selectedDay = day
    },
    getTimezoneSlotDate(date: string) {
      return dateHelper.formatToTimezone(
        dateHelperGetTimezonedDate(
          dateHelperSetUtcTime(new Date(), {
            hours: parseInt(date.split(':')[0], 10),
            minutes: parseInt(date.split(':')[1], 10),
            seconds: 0,
            milliseconds: 0,
          }),
          this.timezone,
        ),
        'UTC',
        'p',
      )
    },
  },
})
</script>

<style lang="scss">
@import '../../../../styles/mixins/macScrollbar';

.updated-slots-content {
  color: $main-color;
  .day-selector-wrapper {
    display: flex;
    margin-top: 2rem;
    overflow-x: auto;
    @include setMacScrollbar('&');

    .day-selector {
      border: 0.1rem solid $main-lighten-74-color;
      padding: 0.6rem 1.6rem;
      border-radius: 5rem;
      margin-right: 1rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      position: relative;

      &.selected {
        border: 0.2rem solid $main-color;
      }

      &.last {
        margin-right: 0;
      }

      &.disabled {
        cursor: not-allowed;
        color: $main-lighten-74-color;

        &:before {
          position: absolute;
          content: '';
          background: $main-lighten-74-color;
          display: block;
          width: 96%;
          height: 0.1rem;
          -webkit-transform: rotate(-15deg);
          transform: rotate(-15deg);
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
          margin: auto;
        }
      }
    }
  }

  .slot-wrapper {
    display: flex;
    flex-wrap: wrap;
    width: 100%;

    @media #{map-get($display-breakpoints, 'xs-only')} {
      width: 100%;
      justify-content: space-between;
      margin-bottom: 2rem;
    }

    .slot {
      border: 0.1rem solid $main-lighten-65-color;
      margin-right: 1rem;
      margin-top: 1rem;
      border-radius: 0.4rem;
      min-height: 3rem;
      max-height: 6rem;
      min-width: 14rem;
      display: flex;
      align-items: center;
      justify-content: center;

      .content-wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
      }
    }
  }
}
</style>
