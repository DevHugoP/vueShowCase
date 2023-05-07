<template>
  <v-container
    id="exchange-place-detail-schedule"
    data-id="exchangePlace-detail-schedule"
    v-if="schedule"
  >
    <mp-block
      id="exchange-place-detail-schedule-block"
      :title="$vuetify.breakpoint.smAndUp ? $t('page.exchangePlace.schedule.title') : ''"
      :hasBorder="$vuetify.breakpoint.smAndUp"
      :hasMarginBottom="$vuetify.breakpoint.smAndUp"
      titleHasPaddingBottom
    >
      <v-row
        no-gutters
        v-for="(day, index) in getLocalSchedule"
        :key="`exchange-place-schedule-${index}`"
        class="schedule"
      >
        <v-col cols="3">
          <span class="regular14 main-lighten-52" :data-id="`exchangePlace-detail-schedule-${days[index]}`">
            {{ $t(`common.days.${days[index]}`) }}
          </span>
        </v-col>
        <v-col cols="9" v-if="day.length > 0" class="slot-wrapper">
          <span
            v-for="(slot, slotIndex) in day"
            :key="`exchange-place-schedule-${index}-slot-${slotIndex}`"
            class="slot"
          >
            <span class="regular14 main-color" :data-id="`exchangePlace-detail-schedule-${days[index]}-slot`">
              {{ getTimezoneSlotDate(slot.start) }} - {{ getTimezoneSlotDate(slot.end)
              }}{{ day[slotIndex + 1] ? ' / ' : '' }}
            </span>
          </span>
        </v-col>
        <v-col cols="9" v-else class="slot-wrapper">
          <span
            class="slot regular14"
            :data-id="`exchangePlace-detail-schedule-${days[index]}-closed`"
          >
            {{ $t('common.closed') }}
          </span>
        </v-col>
      </v-row>
    </mp-block>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'

import { OpeningHours, DateInterval } from '@/types'
import { dateHelper, dateHelperGetTimezonedDate, dateHelperSetUtcTime } from '@/helpers/dateHelper'

import { SHORT_DAY } from '@/constants'

import mpBlock from '@/components/block/block.vue'

export default Vue.extend({
  name: 'exchange-place-detail-schedule',
  components: {
    mpBlock,
  },
  props: {
    schedule: {
      type: Object as () => OpeningHours,
      required: true,
    },
    timezone: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    localSchedule: [] as DateInterval[][],
    days: SHORT_DAY,
  }),
  computed: {
    getLocalSchedule() {
      const currentDate = dateHelper.getDate()
      return this.localSchedule.map(slot =>
        slot.sort(({ start }, { start: secondStart }) => {
          const [currentStartHours, currentStartMinutes] = start
            .split(':')
            .map((time: string) => Number(time))
          const [secondStartHours, secondStartMinutes] = secondStart
            .split(':')
            .map((time: string) => Number(time))

          if (
            dateHelper.isAfter(
              dateHelper.set(currentDate, {
                hours: currentStartHours,
                minutes: currentStartMinutes,
              }),
              dateHelper.set(currentDate, { hours: secondStartHours, minutes: secondStartMinutes }),
            )
          ) {
            return 1
          } else {
            return -1
          }
        }),
      )
    },
  },
  mounted() {
    this.localSchedule.push(
      this.schedule.monday || [],
      this.schedule.tuesday || [],
      this.schedule.wednesday || [],
      this.schedule.thursday || [],
      this.schedule.friday || [],
      this.schedule.saturday || [],
      this.schedule.sunday || [],
    )
  },
  methods: {
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
#exchange-place-detail-schedule {
  padding: 0;

  @media #{map-get($display-breakpoints, 'xs-only')} {
    border-top: solid 0.1rem $main-lighten-74-color;
  }

  .schedule {
    padding-bottom: 1.6rem;
    margin-bottom: 1.6rem;
    border-bottom: solid 0.1rem $main-lighten-74-color;
    display: flex;
    align-items: center;

    &:last-of-type {
      border-bottom: none;
      padding-bottom: 0;
      margin-bottom: 0;
    }

    .slot-wrapper {
      text-align: right;

      .slot {
        min-width: fit-content;

        span {
          min-width: fit-content;
        }
      }
    }
  }
}
</style>
