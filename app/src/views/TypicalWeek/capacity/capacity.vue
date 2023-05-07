<template>
  <div id="typical-week-capacity" v-if="hasLoaded">
    <h2 v-if="showTitle">{{ $t('page.typicalWeek.capacity.title') }}</h2>

    <div class="day-selector-wrapper mb-4 mt-8" v-if="showDays">
      <mp-chips-wrapper
        dataId="typicalWeek-capacity-chipsWrapper"
        :chips="dayOfTheWeek"
        :maxChips="dayOfTheWeek.length"
        v-model="chipsDay"
        @input="
          value[$event.value] && value[$event.value].length ? daySelected($event.value) : null
        "
      />
    </div>

    <div v-if="value[selectedDay]">
      <capacity-day
        v-model="value[selectedDay]"
        :frequency="frequency"
        @generateCapacities="generateCapacities()"
        :timezone="timezone"
        :showTimezonedDate="showTimezonedDate"
        :dayOfTheWeek="dayOfTheWeek"
        :showDuplicate="showDuplicate"
        :showInfos="showInfos"
      />

      <div
        class="btn-duplicate-wrapper mt-10"
        v-if="showDuplicateComputed || showDuplicateSlotsBtn"
      >
        <mp-button
          class="mr-5"
          v-if="showDuplicateComputed"
          :text="$t('page.typicalWeek.capacity.duplicate')"
          format="secondary"
          dataId="typicalWeek-capacity-btnDuplicate"
          @click="showDialogDuplicate = true"
        />
        <mp-button
          v-if="showDuplicateSlotsBtn"
          :text="$t('page.typicalWeek.slots.duplicate')"
          format="secondary"
          dataId="typicalWeek-slot-btnDuplicate"
          @click="showDialogDuplicateSlot = true"
        />
      </div>
    </div>

    <div v-else class="mt-8 mr-4">
      <span class="italic16 main-lighten-52 my-4">
        {{ $t('page.typicalWeek.capacity.info') }}
      </span>
    </div>

    <mp-dialog-capacity-duplicate
      v-if="showDialogDuplicate"
      :showDialog="showDialogDuplicate"
      @hide="showDialogDuplicate = false"
      @save="duplicate($event)"
      :currentDay="selectedDay"
      :capacities="value"
    />

    <mp-dialog-slot-duplicate
      v-if="showDialogDuplicateSlot"
      :showDialog="showDialogDuplicateSlot"
      @hide="showDialogDuplicateSlot = false"
      @save="duplicateSlot($event)"
      :currentDay="selectedDay"
      :openingHours="frequency.planning"
      :openingDays="dayOfTheWeek"
    />
  </div>
</template>

<script lang="ts">
import {
  dateHelper,
  dateHelperGetTimezonedDate,
  dateHelperGetUTCHours,
  dateHelperGetUTCMinutes,
  dateHelperSetUtcTime,
} from '@/helpers/dateHelper'
import { DayCapacity, OpeningHours, TypicalWeekFrequency, FrequencyAvailable, Week } from '@/types'
import mixins from 'vue-typed-mixins'

import { validationMixin } from '@/mixins'

import mpDialogCapacityDuplicate from '@/views/TypicalWeek/dialog/duplicate/duplicate.vue'
import mpDialogSlotDuplicate from '@/views/TypicalWeek/dialog/slotDuplicate/duplicateSlot.vue'
import { ROUTES } from '@/constants'

import capacityDay from '@/views/TypicalWeek/capacity/capacityDay.vue'

export default mixins(validationMixin).extend({
  name: 'mp-capacity',
  components: {
    mpDialogCapacityDuplicate,
    mpDialogSlotDuplicate,
    capacityDay,
  },
  props: {
    value: {
      type: Object as () => Record<string, DayCapacity[]>,
      required: true,
    },
    frequency: {
      type: Object as () => TypicalWeekFrequency,
      required: true,
    },
    openingHours: {
      type: Object as () => OpeningHours,
      required: true,
    },
    showDays: {
      type: Boolean,
      default: true,
    },
    showDuplicate: {
      type: Boolean,
      default: true,
    },
    timezone: {
      type: String,
      required: false,
    },
    showTimezonedDate: {
      type: Boolean,
      default: true,
    },
    showTitle: {
      type: Boolean,
      default: true,
    },
    showInfos: {
      type: Boolean,
      default: true,
    },
  },
  data: () => ({
    hasLoaded: false,
    selectedDay: '',
    showDialogDuplicate: false,
    showDialogDuplicateSlot: false,
    chipsDay: null as {
      value: Week
      text: string
      disabled: boolean
    } | null,
  }),
  computed: {
    showDuplicateComputed(): boolean {
      const numberOfDisabled = this.numberOfDisabled()

      return this.showDuplicate && Object.keys(this.value).length > numberOfDisabled + 1
    },
    showDuplicateSlotsBtn(): boolean {
      const numberOfDisabled = this.numberOfDisabled()

      return this.showDuplicate && Object.keys(this.value).length > numberOfDisabled && this.frequency.type === 'CUSTOM'
    },
    getAddedTime():
      | {
          minutes: number
          hours?: undefined
        }
      | {
          hours: number
          minutes?: undefined
        }
      | undefined {
      switch (this.frequency.type) {
        case FrequencyAvailable.QUARTER:
          return { minutes: 15 }
        case FrequencyAvailable.DEMI:
          return { minutes: 30 }
        case FrequencyAvailable.HOUR:
          return { hours: 1 }
      }
    },
    dayOfTheWeek(): Array<{
      value: Week
      text: string
      disabled: boolean
    }> {
      return Object.values(Week).map(day => {
        return {
          value: day,
          text: this.$t(`common.days.${day.slice(0, 3)}`),
          disabled:
            (this.value[day] && this.value[day].length) || this.frequency.type === ''
              ? false
              : true,
        }
      })
    },
  },

  mounted() {
    if (this.$route.name === ROUTES.editExceptions && !this.value.monday.length) {
      this.generateCapacities()
    }

    this.selectedDay = Week.MONDAY

    this.hasLoaded = true
  },

  methods: {
    daySelected(day: string) {
      this.selectedDay = day
    },
    formatHourMinute(time: string) {
      return `${time.length === 1 ? '0' : ''}${time}`
    },
    generateCapacities() {
      const localCapacities: Record<string, DayCapacity[]> = {}

      // Go through opening hour define in the exchangePlace
      for (const [key, value] of Object.entries(this.openingHours)) {
        // Capacity for the day to []
        localCapacities[key] = []

        // Value is the slots define for the day
        for (const time of value) {
          // Get start hour and end hour for the current slot
          const [beginHours, beginMinutes] = time.start.split(':')
          const [endHours, endMinutes] = time.end.split(':')

          let start = dateHelperSetUtcTime(dateHelperGetTimezonedDate(), {
            hours: beginHours,
            minutes: beginMinutes,
            seconds: 0,
            milliseconds: 0,
          })

          const end = dateHelperSetUtcTime(dateHelperGetTimezonedDate(), {
            hours: endHours,
            minutes: endMinutes,
            seconds: 0,
            milliseconds: 0,
          })

          // if frequency is custom
          if (this.getAddedTime === undefined) {
            localCapacities[key].push({
              start: `${dateHelperGetUTCHours(start)}:${dateHelperGetUTCMinutes(start)}`,
              end: `${dateHelperGetUTCHours(end)}:${dateHelperGetUTCMinutes(end)}`,
              capacity: time.capacity ?? null,
            })
          } else if (time.start && time.end) {
            // Create enough capacity slot inside a opening slot
            while (dateHelper.isSameOrBefore(dateHelper.add(start, this.getAddedTime), end)) {
              const next = dateHelper.add(start, this.getAddedTime)

              localCapacities[key].push({
                start: `${dateHelperGetUTCHours(start)}:${dateHelperGetUTCMinutes(start)}`,
                end: `${dateHelperGetUTCHours(next)}:${dateHelperGetUTCMinutes(next)}`,
                capacity: null,
              })

              start = next
            }
          }
        }
      }
      this.$emit('input', localCapacities)
    },

    duplicate(days: Week[]) {
      this.showDialogDuplicate = false

      for (const capacity of this.value[this.selectedDay]) {
        for (const day of days) {
          const index = this.value[day].findIndex(
            localCapacity =>
              localCapacity.start === capacity.start && localCapacity.end === capacity.end,
          )
          if (index !== -1) {
            this.value[day][index].capacity = capacity.capacity
          }
        }
      }
    },

    duplicateSlot(planning: OpeningHours) {
      this.showDialogDuplicateSlot = false
      this.frequency.planning = planning
      const slotsDuplicated: Record<string, DayCapacity[]> = {}

      for (const [key, value] of Object.entries(planning)) {
        slotsDuplicated[key] = []

        for (const time of value) {
          slotsDuplicated[key].push({
            start: time.start,
            end: time.end,
            capacity: null,
          })
        }
      }
      this.$emit('input', slotsDuplicated)
    },
    numberOfDisabled() {
      let numberOfDisabled = 0

      for (const day of this.dayOfTheWeek) {
        if (this.value[day.value] && !this.value[day.value].length) {
          numberOfDisabled += 1
        }
      }
      return numberOfDisabled
    },
  },

  watch: {
    'frequency.type': {
      immediate: true,
      handler(next) {
        if (
          next &&
          this.$route.name !== ROUTES.editTypicalWeek &&
          this.$route.name !== ROUTES.editExceptions
        ) {
          this.generateCapacities()
        }
      }
    },
    openingHours() {
      this.generateCapacities()
    },
  },
})
</script>
