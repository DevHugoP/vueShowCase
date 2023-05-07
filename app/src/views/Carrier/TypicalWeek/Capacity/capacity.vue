<template>
  <div id="typical-week-capacity" v-if="hasLoaded">
    <h2>{{ $t('page.typicalWeek.capacity.title') }}</h2>

    <div class="day-selector-wrapper mb-4 mt-5" v-if="showDays">
      <mp-chips-wrapper
        dataId="typicalWeek-capacity-chipsWrapper"
        :chips="dayOfTheWeek"
        :maxChips="dayOfTheWeek.length"
        v-model="chipsDay"
        @input="daySelected($event.value)"
      />
    </div>

    <v-row no-gutters class="my-5">
      <v-col cols="4">
        <timezone-autocomplete
          :timezone="timezone"
          dataId="typical-week-timezone"
          @updateTimezone="handleChangeTimezone($event)"
          :label="`${$t('common.timezone')} *`"
          @input="$v.timezone.$touch()"
          @blur="$v.timezone.$touch()"
          :errors="getModelErrors($v.timezone)"
          :isDirty="$v.timezone.$dirty"
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col v-if="selectedDay && frequency.type" cols="6" class="working-schedule-wrapper">
        <h4>{{ $t('page.activityTimeSlot.title') }}</h4>
        <div
          v-for="(range, index) in dayWorkingRange[selectedDay]"
          :key="`days-${selectedDay}-${range.fakeId}`"
        >
          <v-col v-if="!isDayClosed(selectedDay)" cols="10" class="working-schedule-time-wrapper">
            <mp-time-picker-new
              v-model="range.start"
              :label="`${$t('common.start')} *`"
              :data-id="`time-picker-start-${index}`"
              :errors="getModelErrors($v.dayWorkingRange[selectedDay].$each[index].start)"
              :isDirty="$v.dayWorkingRange[selectedDay].$each[index].start.$dirty"
              @input="showWarning()"
              @blur="$v.dayWorkingRange[selectedDay].$each[index].start.$touch()"
            />
            <mp-time-picker-new
              v-model="range.end"
              :data-id="`time-picker-end-${index}`"
              :label="`${$t('common.end')} *`"
              :errors="getModelErrors($v.dayWorkingRange[selectedDay].$each[index].end)"
              :isDirty="$v.dayWorkingRange[selectedDay].$each[index].end.$dirty"
              @input="showWarning()"
              @blur="$v.dayWorkingRange[selectedDay].$each[index].end.$touch()"
            />
            <div>
              <mp-button
                v-if="dayWorkingRange[selectedDay].length < 2"
                format="secondary"
                class="main-color add-time-btn"
                icon="plus-circle"
                @click="addWorkingRange(selectedDay)"
                :data-id="`add-btn-${index}`"
              />
              <mp-button
                v-else
                format="secondary"
                class="main-color add-time-btn"
                icon="trash-can-outline"
                @click="deleteWorkingRange(selectedDay, index)"
                :data-id="`delete-btn-${index}`"
              />
            </div>
          </v-col>
        </div>
        <v-col cols="3">
          <mp-checkbox-new
            :class="isDayClosed(selectedDay) ? 'mt-5' : ''"
            :input-value="isDayClosed(selectedDay)"
            @change="toggleDaySelected(selectedDay)"
            :label="`${$t('action.close.base')}`"
          />
        </v-col>
      </v-col>
    </v-row>

    <div v-if="typeof value[selectedDay] !== 'undefined' && value[selectedDay].length !== 0">
      <!-- Information message -->
      <div class="capacity-information-wrapper">
        <v-icon>mdi-information</v-icon>
        <ul class="capacity-information italic14">
          <li>
            {{ $t('page.typicalWeek.capacity.infoOne') }}
          </li>
          <li class="mt-1">
            {{ $t('page.typicalWeek.capacity.infoTwo') }}
          </li>
        </ul>
      </div>

      <div class="d-flex">
        <!-- Capacity slot -->
        <div class="capacity-selector-wrapper">
          <div
            :class="
              `${capacity.capacity ? '' : ' empty'} capacity-selector${
                selectedSlot.find(
                  slot => slot.start === capacity.start && slot.end === capacity.end,
                )
                  ? ' selected'
                  : ''
              }`
            "
            v-for="(capacity, index) of value[selectedDay]"
            :key="`capacities-${index}-${frequency.type}-${selectedDay}-${value[selectedDay]}`"
            @click="manageSlot(capacity)"
          >
            <div class="content-wrapper">
              <span class="regular14">{{ `${capacity.start} - ${capacity.end}` }}</span>

              <div :class="`capacity-number${capacity.capacity ? ' filled' : ''}`">
                <span class="medium12">{{ capacity.capacity }}</span>
              </div>
            </div>
          </div>

          <div class="btn-duplicate-wrapper mt-10">
            <mp-button
              class="mr-5"
              :text="$t('page.typicalWeek.capacity.duplicateParameter')"
              format="secondary"
              dataId="typicalWeek-capacity-btnDuplicate"
              @click="showDialogDuplicate = true"
            />
          </div>
        </div>

        <!-- Set capacity -->
        <div class="set-capacity-wrapper">
          <mp-checkbox
            :label="$t('page.typicalWeek.capacity.selectAll')"
            :input-value="selectAll"
            @change="manageSelectAll()"
            dataId="typicalWeek-capacity-selectAll"
          />

          <div class="d-flex">
            <mp-textfield
              type="number"
              ref="textfiledCapacity"
              :label="$t('page.typicalWeek.capacity.capacity')"
              v-model="capacity"
              dataId="typicalWeek-capacity-capacityInput"
              :disabled="selectedSlot.length === 0"
              class="input-capacity"
              @keydown.enter="$v.$invalid ? null : setCapacity(capacity)"
              @input="$v.capacity.$touch()"
              @blur="$v.capacity.$touch()"
              :errors="getModelErrors($v.capacity)"
              :isDirty="$v.capacity.$dirty"
            />

            <mp-button
              class="ml-4"
              :text="$t('common.ok')"
              format="secondary"
              dataId="typicalWeek-capacity-btnSet"
              @click="setCapacity(capacity)"
              :disabled="$v.capacity.$invalid"
            />
          </div>
        </div>
      </div>
    </div>

    <div v-if="!frequency.type" class="mt-8 mr-4">
      <span class="italic16 main-lighten-52"> {{ $t('page.typicalWeek.capacity.info') }} </span>
    </div>

    <mp-dialog-capacity-duplicate-all
      v-if="showDialogDuplicate"
      :showDialog="showDialogDuplicate"
      @hide="showDialogDuplicate = false"
      @save="duplicate($event)"
      :currentDay="selectedDay"
      :capacities="value"
      :dayOfTheWeek="dayOfTheWeek"
    />

    <mp-dialog-confirmation
      v-if="showWarningModal"
      classWrapper="typical-week-capacity-warning"
      dataId="typicalWeek-capacity-warningDialog"
      :textContent="$t('page.typicalWeek.capacity.warningTimeChange')"
      @close="showWarningModal = false"
      @submit="sendConfirmation()"
      color="error"
      :header="{
        icon: 'mdi-exclamation-thick',
        isColorBackground: false,
        iconClose: 'mdi-close',
      }"
      :btnCancel="{ text: $t('action.cancel.base'), format: 'link', linkColor: 'black' }"
      :btnValidation="{
        text: $t('action.apply'),
        format: 'error',
      }"
    />
  </div>
</template>

<script lang="ts">
import {
  dateHelper,
  dateHelperMinutes,
  dateHelperHours,
  dateHelperSetUtcTime,
} from '@/helpers/dateHelper'

import {
  FrequencyAvailableNew,
  Week,
  TypicalWeekFrequencyNew,
  WorkingSchedule,
  DayCapacityNew,
  DateInterval,
} from '@/types'
import mixins from 'vue-typed-mixins'
import { SnackBarType } from '@/store/types'

import { validationMixin } from '@/mixins'

import mpDialogCapacityDuplicateAll from '@/views/Carrier/TypicalWeek/Dialog/Duplicate/duplicate.vue'
import TimezoneAutocomplete from '@/components/form/timezoneAutocomplete/timezoneAutocomplete.vue'
import { ROUTES } from '@/constants'

import { integer, required, minValue } from 'vuelidate/lib/validators'
import { v4 } from 'uuid'

export default mixins(validationMixin).extend({
  name: 'mp-capacity-new',
  components: {
    mpDialogCapacityDuplicateAll,
    TimezoneAutocomplete,
  },
  props: {
    value: {
      type: Object as () => Record<string, DayCapacityNew[]>,
      required: true,
    },
    typicalTimezone: {
      type: String,
      required: false,
    },
    hasWarning: {
      type: Boolean,
      required: false,
    },
    frequency: {
      type: Object as () => TypicalWeekFrequencyNew,
      required: true,
    },
    editCapacities: {
      type: Object as any,
      required: false,
    },
    workingSchedule: {
      type: Object as () => WorkingSchedule,
      required: false,
    },
    showDays: {
      type: Boolean,
      default: true,
    },
    showDuplicate: {
      type: Boolean,
      default: true,
    },
  },
  data: () => ({
    timezone: '',
    warningConfirmed: false,
    showWarningModal: false,
    hasLoaded: false,
    triggerDuplication: true as boolean,
    localCapacities: {} as any,
    previousFrequency: '' as string,
    selectedDay: '' as string,
    selectedSlot: [] as Array<Partial<DayCapacityNew>>,
    selectAll: false,
    capacity: '',
    showDialogDuplicate: false,
    chipsDay: null as {
      value: Week
      text: string
      disabled: boolean
    } | null,
    dayWorkingRange: {} as any,
  }),
  validations() {
    const dayWorkingRange: Record<string, any> = Object.entries(this.dayWorkingRange).reduce(
      (acc, [key, range]) => {
        return {
          ...acc,
          [key]: {
            $each: {
              start: {
                required,
                clockRule(value: any) {
                  return (this as any).clockRule(value)
                },
                maxTimeSlot(value: any, day: DateInterval) {
                  return (this as any).maxTime(day.start, day.end)
                },
                noOverlapRule(value: any, day: DateInterval): boolean {
                  const index = (range as DateInterval[]).findIndex(
                    r => r.start === day.start && r.end === day.end,
                  )

                  if (index !== undefined && day.start.length === 5 && day.end.length === 5) {
                    return (this as any).noOverlapRules(day, range, index)
                  }

                  return false
                },
              },
              end: {
                required,
                clockRule(value: any) {
                  return (this as any).clockRule(value)
                },
                maxTimeSlot(value: any, day: DateInterval) {
                  return (this as any).maxTime(day.start, day.end)
                },
                noOverlapRule(value: any, day: DateInterval): boolean {
                  const index = (range as DateInterval[]).findIndex(
                    r => r.start === day.start && r.end === day.end,
                  )

                  if (index !== undefined && day.start.length === 5 && day.end.length === 5) {
                    return (this as any).noOverlapRules(day, range, index)
                  }

                  return false
                },
              },
            },
          },
        }
      },
      {},
    )

    return {
      capacity: { integer, minValue: minValue(1) },
      timezone: { required },
      dayWorkingRange,
    }
  },
  computed: {
    getAddedTime():
      | {
          minutes: number
          hours?: undefined
        }
      | {
          hours: number
          minutes?: undefined
        } {
      switch (this.frequency.type) {
        case FrequencyAvailableNew.DEMI:
        default:
          return { minutes: 30 }
        case FrequencyAvailableNew.HOUR:
          return { hours: 1 }
        case FrequencyAvailableNew.TWO_HOURS:
          return { hours: 2 }
        case FrequencyAvailableNew.FOUR_HOURS:
          return { hours: 4 }
      }
    },

    dayOfTheWeek(): Array<{
      value: Week
      text: string
      disabled: boolean
      closed: boolean
    }> {
      return Object.values(Week).map(day => {
        return {
          value: day,
          text: this.$t(`common.days.${day.slice(0, 3)}`),
          disabled: false,
          closed: false,
        }
      })
    },
  },
  mounted() {
    this.selectedDay = Week.MONDAY

    if (this.$route.name === ROUTES.editCarrierTypicalWeek) {
      this.localCapacities = this.editCapacities
      this.dayWorkingRange = this.workingSchedule
      this.timezone = this.typicalTimezone
    } else {
      this.dayWorkingRange = Object.values(Week).reduce((acc, current) => {
        return { ...acc, [current]: [{ start: '', end: '', fakeId: v4() }] }
      }, {})

      for (const [key] of Object.entries(this.dayWorkingRange)) {
        this.localCapacities[key] = []
      }
    }

    this.hasLoaded = true
  },
  methods: {
    handleChangeTimezone(newTimezone: string) {
      this.timezone = newTimezone
      this.$emit('getTimezone', this.timezone)
    },
    showWarning() {
      if (this.value[this.selectedDay]?.some(({ capacity }) => capacity)) {
        this.showWarningModal = true
      }
    },

    sendConfirmation() {
      this.showWarningModal = false
      this.generateCapacities('sendConfirmation')
    },

    isDayClosed(selectedDay: any): any {
      if (!this.dayWorkingRange[selectedDay].length) {
        return true
      }
      return false
    },

    toggleDaySelected(selectedDay: any) {
      if (this.isDayClosed(selectedDay)) {
        this.value[selectedDay] = []
        this.dayWorkingRange[selectedDay] = [{ start: '', end: '', fakeId: v4() }]
      } else {
        this.value[selectedDay] = []
        this.dayWorkingRange[selectedDay] = []
      }
    },

    addWorkingRange(selectedDay: any) {
      this.dayWorkingRange[selectedDay].push({ start: '', end: '', fakeId: v4() })
    },
    deleteWorkingRange(selectedDay: any, index: any) {
      this.dayWorkingRange[selectedDay].splice(index, 1)
    },

    formatHourMinute(time: string) {
      return `${time.length === 1 ? '0' : ''}${time}`
    },

    generateCapacities(event: any) {
      for (const [key, value] of Object.entries(this.dayWorkingRange)) {
        // Capacity for the day to []
        if (key === this.selectedDay) {
          this.localCapacities[key] = []
        }

        if (event === 'changeFrequency' && value) {
          this.localCapacities[key] = []
        }

        // Value is the slots defined for the day
        for (const time of value as any) {
          // Get start hour and end hour for the current slot
          const [beginHours, beginMinutes] = time.start.split(':')
          const [endHours, endMinutes] = time.end.split(':')

          let start = new Date()
          start.setHours(beginHours)
          start.setMinutes(beginMinutes)
          start.setSeconds(0)
          start.setMilliseconds(0)

          const end = new Date()
          end.setHours(endHours)
          end.setMinutes(endMinutes)
          end.setSeconds(0)
          end.setMilliseconds(0)

          // create the capacities slots and push them to localCapacities
          if (
            (time.start && time.end && key === this.selectedDay) ||
            (time.start && time.end && event === 'changeFrequency')
          ) {
            while (dateHelper.isSameOrBefore(dateHelper.add(start, this.getAddedTime), end)) {
              const next = dateHelper.add(start, this.getAddedTime)
              this.localCapacities[key].push({
                start: `${dateHelperHours(start)}:${dateHelperMinutes(start)}`,
                end: `${dateHelperHours(next)}:${dateHelperMinutes(next)}`,
                capacity: null,
              })
              start = next
            }
          }
        }
      }
      this.$emit('input', this.localCapacities)
    },

    clearData() {
      this.dayWorkingRange = Object.values(Week).reduce((acc, current) => {
        return { ...acc, [current]: [{ start: '', end: '', fakeId: v4() }] }
      }, {})
      for (const [key] of Object.entries(this.dayWorkingRange)) {
        this.localCapacities[key] = []
      }
      this.$emit('input', this.localCapacities)
    },
    manageSlot(capacity: DayCapacityNew) {
      const indexCapacity = this.selectedSlot.findIndex(
        slot => slot.start === capacity.start && slot.end === capacity.end,
      )
      if (indexCapacity === -1) {
        this.selectedSlot.push(capacity)
      } else {
        this.selectedSlot.splice(indexCapacity, 1)
      }

      if (this.selectedSlot.length) {
        this.$nextTick(() => {
          ;(this.$refs.textfiledCapacity as any).$children[0].focus()
        })
      }
    },
    manageSelectAll() {
      this.selectAll = !this.selectAll

      if (this.selectAll) {
        for (const capacity of this.value[this.selectedDay]) {
          if (
            !this.selectedSlot.find(
              selected => selected.start === capacity.start && selected.end === capacity.end,
            )
          ) {
            this.selectedSlot.push({
              ...capacity,
            })
          }
        }

        this.$nextTick(() => {
          ;(this.$refs.textfiledCapacity as any).$children[0].focus()
        })
      } else {
        this.selectedSlot = []
      }
    },
    setCapacity(capacity: string) {
      for (const selectedSlot of this.selectedSlot) {
        this.value[this.selectedDay].find(
          val => val.start === selectedSlot.start && val.end === selectedSlot.end,
        )!.capacity = capacity ? parseInt(capacity, 10) : null
      }
      this.capacity = ''
      this.selectedSlot = []
      this.selectAll = false
    },

    duplicate(days: Week[]) {
      this.showDialogDuplicate = false
      this.triggerDuplication = false
      for (const day of days) {
        this.value[day] = this.value[this.selectedDay].map(element => ({ ...element }))
        this.dayWorkingRange[day] = JSON.parse(
          JSON.stringify(this.dayWorkingRange[this.selectedDay]),
        )
      }
      try {
        this.$store.dispatch('setSnackbar', {
          message: this.$t('messages.duplicatedParams'),
          type: SnackBarType.SUCCESS,
        })
      } catch (e) {
        this.$store.dispatch('setSnackbar', {
          type: SnackBarType.ERROR,
          message: this.$t('messages.error'),
        })
      }
    },

    daySelected(day: string) {
      this.triggerDuplication = true
      this.selectedDay = day
      this.selectAll = false
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
    noOverlapRules(
      currentTimeSlot: DateInterval,
      timeSlots: DateInterval[],
      index: number,
    ): boolean {
      if (timeSlots.some(time => time.start.length !== 5 || time.end.length !== 5)) {
        return true
      }

      let returnValue = true

      const { start: currentStart, end: currentEnd } = currentTimeSlot
      if (!currentEnd || !currentStart) {
        return false
      }
      const [currentStartHours, currentStartMinutes] = currentStart
        .split(':')
        .map((time: string) => Number(time))
      const [currentEndHours, currentEndMinutes] = currentEnd
        .split(':')
        .map((time: string) => Number(time))

      if (
        currentStartHours > currentEndHours ||
        (currentStartHours === currentEndHours && currentStartMinutes > currentEndMinutes)
      ) {
        return false
      }

      if (currentStartHours === currentEndHours && currentStartMinutes === currentEndMinutes) {
        return false
      }

      timeSlots.forEach(({ start, end }, i) => {
        if (i === index) {
          return
        }

        const [timeslotStartHours, timeslotStartMinutes] = start
          .split(':')
          .map((time: string) => Number(time))
        const [timeslotEndHours, timeslotEndMinutes] = end
          .split(':')
          .map((time: string) => Number(time))

        const start1 = dateHelperSetUtcTime(dateHelper.getDate(), {
          hours: currentStartHours,
          minutes: currentStartMinutes,
          seconds: 0,
          milliseconds: 0,
        })

        const end1 = dateHelperSetUtcTime(dateHelper.getDate(), {
          hours: currentEndHours,
          minutes: currentEndMinutes,
          seconds: 0,
          milliseconds: 0,
        })

        const start2 = dateHelperSetUtcTime(dateHelper.getDate(), {
          hours: timeslotStartHours,
          minutes: timeslotStartMinutes,
          seconds: 0,
          milliseconds: 0,
        })

        const end2 = dateHelperSetUtcTime(dateHelper.getDate(), {
          hours: timeslotEndHours,
          minutes: timeslotEndMinutes,
          seconds: 0,
          milliseconds: 0,
        })

        try {
          if (
            dateHelper.areIntervalOverlapping(
              {
                start: start1,
                end: end1,
              },
              {
                start: start2,
                end: end2,
              },
              false,
            )
          ) {
            returnValue = false
            return
          }
        } catch (e) {
          returnValue = false
          return
        }
      })

      return returnValue
    },
  },
  watch: {
    'frequency.type'(next, previous) {
      this.previousFrequency = previous
      if (this.previousFrequency) {
        this.generateCapacities('changeFrequency')
      }
      this.selectedSlot = []
    },
    dayWorkingRange: {
      deep: true,
      immediate: false,
      handler(next, previous) {
        if (
          !this.hasLoaded ||
          (next === this.dayWorkingRange && !Object.keys(previous || {}).length)
        ) {
          return
        }

        this.$emit('customChange', this.dayWorkingRange)
        if (this.triggerDuplication && !this.showWarningModal) {
          this.generateCapacities('dayWorkingRange')
        }
        this.selectAll = false
      },
    },
    selectedSlot(next: Array<Partial<DayCapacityNew>>) {
      this.capacity = next.reduce((acc, current) => {
        if (acc && (current.capacity?.toString() || '') !== acc) {
          return '--'
        }
        return current.capacity?.toString() || ''
      }, '')

      if (this.capacity === '--') {
        this.$nextTick(() => {
          ;(this.$refs.textfiledCapacity as any).$children[0].$el.querySelector('input').select()
        })
      }
    },
  },
})
</script>

<style lang="scss">
@import '../../../../styles/mixins/macScrollbar';

#typical-week-capacity {
  .working-schedule-wrapper {
    background-color: $main-lighten-80-color;
    padding: 15px 25px;
  }
  .working-schedule-time-wrapper {
    display: flex;
    gap: 2rem;
    margin-top: 1rem;
  }
  .time-picker-wrapper {
    display: flex;
    gap: 1rem;
  }
  .add-time-btn {
    border: none;
  }
  .capacity-selector-wrapper {
    display: flex;
    flex-wrap: wrap;
    width: 65%;

    @media #{map-get($display-breakpoints, 'xs-only')} {
      width: 100%;
      justify-content: space-between;
      margin-bottom: 2rem;
    }

    .btn-duplicate-wrapper {
      width: 100%;

      @media #{map-get($display-breakpoints, 'xs-only')} {
        display: flex;
        justify-content: center;
      }
    }

    .capacity-selector {
      border: 0.1rem solid $main-lighten-65-color;
      margin-right: 2.1rem;
      margin-top: 1.6rem;
      border-radius: 0.4rem;
      min-height: 6rem;
      max-height: 6rem;
      min-width: 14rem;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;

      @media #{map-get($display-breakpoints, 'xs-only')} {
        margin-right: 1.6rem;

        &:nth-child(2) {
          margin-right: 0;
        }

        &:nth-child(even) {
          margin-right: 0;
        }
      }

      &.selected {
        border: 0.2rem solid $main-color !important;
      }

      &.empty {
        color: $main-lighten-65-color;
        border: 0.1rem dashed $main-lighten-65-color;
      }

      .content-wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;

        .capacity-number {
          background-color: $main-lighten-74-color;
          border-radius: 6rem;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 4rem;
          height: 2rem;
          margin-top: 0.3rem;

          &.filled {
            background-color: $success-color;
            color: $white;
          }
        }
      }
    }
  }

  .set-capacity-wrapper {
    border: 0.2rem solid $main-color;
    border-radius: 0.8rem;
    height: 14rem;
    margin-top: 1.6rem;
    width: 35rem;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    @media #{map-get($display-breakpoints, 'sm-and-up')} {
      position: -webkit-sticky;
      position: sticky;
      top: 5rem;
      align-self: flex-start;
      padding: 2rem;
    }

    @media #{map-get($display-breakpoints, 'xs-only')} {
      position: fixed;
      width: 84%;
      background-color: $white;
      padding: 0 1.5rem;
      bottom: 7rem;
    }

    .mdi-checkbox-blank-outline {
      color: $main-color !important;
    }

    .input-capacity {
      max-width: 20rem;
    }
  }

  .capacity-information-wrapper {
    display: flex;
    align-items: center;
    margin-top: 2.5rem;
    margin-bottom: 1.6rem;

    i {
      color: $main-color;
      margin-right: 2rem;
    }

    .capacity-information {
      list-style-type: inside;
      color: $main-lighten-52-color;
    }
  }
}

.typical-week-capacity-warning {
  .actions-wrapper {
    flex-direction: column !important;
    align-items: center;

    .mp-button--error {
      margin-bottom: 1rem;
      width: fit-content;
    }
  }
}
</style>
