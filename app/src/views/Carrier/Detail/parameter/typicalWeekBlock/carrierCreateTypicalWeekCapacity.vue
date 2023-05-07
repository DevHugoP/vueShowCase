<template>
  <v-row no-gutters id="carrier-create-typical-week-capacity">
    <v-col cols="12">
      <h2 class="mb-10">{{ $t('common.capacities') }}</h2>

      <h4>{{ $t('common.capacityUnit') }}</h4>

      <v-row no-gutters class="mb-13">
        <v-col cols="12">
          <div class="d-flex align-center">
            <v-radio-group
              row
              data-id="carrier-create-typical-week-radio"
              v-model="localCapacityType"
              hide-details
              class="mt-4 carrier-create-typical-week-radio"
            >
              <v-radio
                color="success-color"
                v-for="(localRadioType, index) in radioTypes"
                :key="index"
                :label="localRadioType.label"
                :value="localRadioType.value"
              />
            </v-radio-group>
          </div>
        </v-col>

        <v-col
          cols="12"
          sm="8"
          md="6"
          lg="4"
          v-if="form.capacityType === SchedulesConfigType.OTHER"
          class="mt-10"
        >
          <mp-select
            :label="`${$t('page.typicalWeek.type.packageType')} *`"
            dataId="carrier-create-typical-week-type-select"
            v-model="localSelectType"
            :items="selectTypes"
            @input="$v.localSelectType.$touch()"
            @blur="$v.localSelectType.$touch()"
            :errors="getModelErrors($v.localSelectType)"
            :isDirty="$v.localSelectType.$dirty"
          />
        </v-col>
      </v-row>

      <v-row no-gutters>
        <v-col cols="12">
          <mp-chips-wrapper
            class="mt-5"
            dataId="carrier-typical-week-capacity-chipsWrapper"
            :chips="dayOfTheWeek"
            :maxChips="dayOfTheWeek.length"
            v-model="chipsDay"
          />

          <div class="schedule-wrapper" v-if="chipsDay && chipsDay.value && frequency">
            <h3>
              {{
                isCustom ? $t('page.typicalWeek.frequency.CUSTOM') : $t('page.typicalWeek.schedule')
              }}
            </h3>

            <div
              v-for="(range, index) in form.dayWorkingRange[chipsDay.value]"
              :key="`days-${chipsDay.value}-${range.fakeId}`"
            >
              <v-row no-gutters class="d-flex mt-8 align-center">
                <v-col cols="10" class="d-flex">
                  <mp-time-picker-new
                    class="mr-5"
                    v-model="range.start"
                    :label="`${$t('common.start')} *`"
                    :data-id="`time-picker-start-${index}`"
                    :errors="
                      getModelErrors($v.form.dayWorkingRange[chipsDay.value].$each[index].start)
                    "
                    :isDirty="$v.form.dayWorkingRange[chipsDay.value].$each[index].start.$dirty"
                    @input="$v.form.dayWorkingRange[chipsDay.value].$each[index].start.$touch()"
                    @blur="$v.form.dayWorkingRange[chipsDay.value].$each[index].start.$touch()"
                  />
                  <mp-time-picker-new
                    v-model="range.end"
                    :data-id="`time-picker-end-${index}`"
                    :label="`${$t('common.end')} *`"
                    :errors="
                      getModelErrors($v.form.dayWorkingRange[chipsDay.value].$each[index].end)
                    "
                    :isDirty="$v.form.dayWorkingRange[chipsDay.value].$each[index].end.$dirty"
                    @input="$v.form.dayWorkingRange[chipsDay.value].$each[index].end.$touch()"
                    @blur="$v.form.dayWorkingRange[chipsDay.value].$each[index].end.$touch()"
                  />

                  <v-icon
                    v-if="
                      (isCustom || form.dayWorkingRange[chipsDay.value].length < 2) &&
                        index === form.dayWorkingRange[chipsDay.value].length - 1
                    "
                    class="main-color ml-5 mb-3"
                    @click="addWorkingRange(chipsDay.value)"
                    :data-id="`add-btn-${index}`"
                    size="1.8rem"
                  >
                    mdi-plus-circle
                  </v-icon>

                  <v-icon
                    v-if="isCustom || form.dayWorkingRange[chipsDay.value].length === 2"
                    class="main-color ml-5 mb-3"
                    @click="deleteWorkingRange(chipsDay.value, index)"
                    :data-id="`delete-btn-${index}`"
                    size="1.8rem"
                  >
                    mdi-trash-can-outline
                  </v-icon>
                </v-col>
              </v-row>
            </div>

            <mp-checkbox-new
              :class="`close-checkbox${isDayClosed(chipsDay.value) ? ' mt-5' : ''}`"
              :input-value="isDayClosed(chipsDay.value)"
              @change="toggleDaySelected(chipsDay.value)"
              :label="`${$t('action.close.base')}`"
            />

            <div
              v-if="
                form.capacities &&
                  form.capacities[chipsDay.value] &&
                  form.capacities[chipsDay.value].length
              "
              :key="capacityKey"
            >
              <h3 class="mt-4 mb-5">
                {{ $t('page.typicalWeek.capacity.title') }}
              </h3>

              <mp-capacity-day
                v-model="form.capacities[chipsDay.value]"
                :frequency="{ type: frequency }"
                :dayOfTheWeek="dayOfTheWeek"
                :showTimezonedDate="false"
                :showDuplicate="false"
                :showInfos="false"
              />
            </div>
          </div>
        </v-col>
      </v-row>

      <mp-button
        v-if="chipsDay && form.capacities && form.capacities[chipsDay.value]"
        class="mr-5 mt-6"
        :text="$t('page.typicalWeek.capacity.duplicateParameter')"
        format="secondary"
        dataId="typicalWeek-capacity-btnDuplicate"
        @click="showDialogDuplicate = true"
      />
    </v-col>

    <mp-capacity-duplicate
      v-if="showDialogDuplicate"
      @hide="showDialogDuplicate = false"
      @save="duplicate($event)"
      :currentDay="chipsDay.value"
      :capacities="form.capacities"
      :dayOfTheWeek="dayOfTheWeek"
    />
  </v-row>
</template>

<script lang="ts">
import {
  CarrierFrequencyAvailable,
  DateInterval,
  SchedulesConfigType,
  SelectItem,
  SubFrequencyAvailable,
  Week,
} from '@/types'

import { required, requiredIf } from 'vuelidate/lib/validators'

import mixins from 'vue-typed-mixins'
import { validationMixin } from '@/mixins'
import { v4 } from 'uuid'
import {
  dateHelper,
  dateHelperHours,
  dateHelperMinutes,
  dateHelperSetUtcTime,
} from '@/helpers/dateHelper'

import mpCapacityDay from '@/views/TypicalWeek/capacity/capacityDay.vue'
import mpCapacityDuplicate from '@/views/Carrier/TypicalWeek/Dialog/Duplicate/duplicate.vue'
import { SnackBarType } from '@/store/types'

export default mixins(validationMixin).extend({
  name: 'carrier-typical-week-create-capcity',
  components: {
    mpCapacityDay,
    mpCapacityDuplicate,
  },
  props: {
    frequency: {
      type: String,
      required: true,
    },
    subFrequency: {
      type: String,
      required: true,
    },
    form: {
      type: Object as () => any,
      required: true,
    },
  },
  data: () => ({
    SchedulesConfigType,
    chipsDay: null as {
      value: Week
      text: string
      disabled: boolean
    } | null,
    capacityKey: v4(),
    showDialogDuplicate: false,
    isDuplicating: false,
    firstTimeWatcher: true,
    localCapacityType: '',
    localSelectType: '',
    hasLoaded: false,
  }),
  computed: {
    radioTypes(): Array<{ value: string; label: string }> {
      return [
        {
          label: this.$t(`page.typicalWeek.type.${SchedulesConfigType.ORDERS_QUANTITY}`),
          value: SchedulesConfigType.ORDERS_QUANTITY,
        },
        {
          label: this.$t(`page.typicalWeek.type.${SchedulesConfigType.OTHER}`),
          value: SchedulesConfigType.OTHER,
        },
      ]
    },
    selectTypes(): SelectItem[] {
      return Object.values(SchedulesConfigType)
        .filter(
          configType =>
            configType !== SchedulesConfigType.ORDERS_QUANTITY &&
            configType !== SchedulesConfigType.OTHER,
        )
        .map(value => ({
          text: this.$t(`page.typicalWeek.type.${value}`),
          value,
        }))
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
    getAddedTime(): { hours: number } {
      switch (this.frequency) {
        case CarrierFrequencyAvailable.ONE_HOUR:
        default:
          return { hours: 1 }
        case CarrierFrequencyAvailable.TWO_HOUR:
          return { hours: 2 }
        case CarrierFrequencyAvailable.THREE_HOUR:
          return { hours: 3 }
        case CarrierFrequencyAvailable.FOUR_HOUR:
          return { hours: 4 }
      }
    },
    isCustom(): boolean {
      return this.frequency === CarrierFrequencyAvailable.CUSTOM
    },
  },
  beforeMount() {
    this.localCapacityType = this.form.capacityType
    this.localSelectType = this.form.selectType

    this.$nextTick(() => {
      this.hasLoaded = true
    })
  },
  validations() {
    const { isCustom } = this

    const dayWorkingRange: Record<string, any> = Object.entries(this.form.dayWorkingRange).reduce(
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
                  if (isCustom) {
                    return true
                  }
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
                  if (isCustom) {
                    return true
                  }
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
      form: {
        dayWorkingRange,
      },
      localSelectType: {
        required: requiredIf(value => value.capacityType === SchedulesConfigType.OTHER),
      },
    }
  },
  methods: {
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
    addWorkingRange(selectedDay: any) {
      this.form.dayWorkingRange[selectedDay].push({ start: '', end: '', fakeId: v4() })
    },
    deleteWorkingRange(selectedDay: any, index: any) {
      this.form.dayWorkingRange[selectedDay].splice(index, 1)
    },
    isDayClosed(selectedDay: any): any {
      return !this.form.dayWorkingRange[selectedDay].length
    },
    toggleDaySelected(selectedDay: any) {
      if (this.isDayClosed(selectedDay)) {
        this.form.capacities![selectedDay] = []
        this.form.dayWorkingRange[selectedDay] = [{ start: '', end: '', fakeId: v4() }]
      } else {
        this.form.capacities![selectedDay] = []
        this.form.dayWorkingRange[selectedDay] = []
      }
    },
    generateCapacities(event: any) {
      if (this.isDuplicating) {
        return
      }

      if (this.isCustom) {
        for (const [key, value] of Object.entries(this.form.dayWorkingRange)) {
          if (key === this.chipsDay?.value || event === 'changeFrequency') {
            this.form.capacities![key] = []

            for (const slot of value as any) {
              const [beginHours, beginMinutes] = slot.start.split(':')
              const [endHours, endMinutes] = slot.end.split(':')

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

              if (slot.start && slot.end) {
                this.form.capacities![key].push({
                  start: `${dateHelperHours(start)}:${dateHelperMinutes(start)}`,
                  end: `${dateHelperHours(end)}:${dateHelperMinutes(end)}`,
                  capacity: null,
                })
              }
            }
          }
        }
        return
      }

      for (const [key, value] of Object.entries(this.form.dayWorkingRange)) {
        // Capacity for the day to []
        if (key === this.chipsDay?.value) {
          this.form.capacities![key] = []
        }

        let resetCapacity = true

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
            (time.start && time.end && key === this.chipsDay?.value) ||
            (time.start && time.end && event === 'changeFrequency')
          ) {
            if (event === 'changeFrequency' && resetCapacity) {
              this.form.capacities![key] = []
              resetCapacity = false
            }
            while (dateHelper.isSameOrBefore(dateHelper.add(start, this.getAddedTime), end)) {
              let next = dateHelper.add(start, this.getAddedTime)
              if (!this.form.capacities![key]) {
                this.form.capacities![key] = []
              }
              this.form.capacities![key].push({
                start: `${dateHelperHours(start)}:${dateHelperMinutes(start)}`,
                end: `${dateHelperHours(next)}:${dateHelperMinutes(next)}`,
                capacity: null,
              })

              if (this.subFrequency) {
                let hours = 0
                let minutes = 0

                switch (this.subFrequency) {
                  case SubFrequencyAvailable.QUARTER_HOUR:
                    minutes = 15
                    break
                  case SubFrequencyAvailable.HALF_HOUR:
                    minutes = 30
                    break
                  case SubFrequencyAvailable.ONE_HOUR:
                    hours = 1
                    break
                  case SubFrequencyAvailable.TWO_HOUR:
                    hours = 2
                    break
                  case SubFrequencyAvailable.THREE_HOUR:
                    hours = 3
                    break
                  case SubFrequencyAvailable.FOUR_HOUR:
                    hours = 4
                    break
                }

                next = dateHelper.add(start, { hours, minutes })
              }
              start = next
            }
            this.capacityKey = v4()
          }
        }
      }
    },
    duplicate(days: Week[]): void {
      this.isDuplicating = true
      try {
        for (const day of days) {
          this.form.dayWorkingRange[day] = JSON.parse(
            JSON.stringify(this.form.dayWorkingRange[this.chipsDay!.value]),
          )

          this.form.capacities![day] = JSON.parse(
            JSON.stringify(this.form.capacities![this.chipsDay!.value]),
          )
        }

        this.$store.dispatch('setSnackbar', {
          message: this.$t('messages.duplicatedParams'),
          type: SnackBarType.SUCCESS,
        })
      } catch (e) {
        this.$store.dispatch('setSnackbar', {
          type: SnackBarType.ERROR,
          message: this.$t('messages.error'),
        })
      } finally {
        this.showDialogDuplicate = false
        this.$nextTick(() => {
          this.isDuplicating = false
        })
      }
    },
  },
  watch: {
    frequency(next, previous) {
      if (
        next === CarrierFrequencyAvailable.CUSTOM ||
        previous === CarrierFrequencyAvailable.CUSTOM
      ) {
        this.$emit(
          'updateDayWorkingRange',
          Object.values(Week).reduce((acc, current) => {
            return { ...acc, [current]: [{ start: '', end: '', fakeId: v4() }] }
          }, {}),
        )

        this.form.capacities = this.$emit(
          'updateCapacities',
          Object.values(Week).reduce((acc, current) => {
            return { ...acc, [current]: [] }
          }, {}),
        )

        return
      }

      if (previous) {
        this.generateCapacities('changeFrequency')
      }
    },
    subFrequency(next) {
      if (next) {
        this.generateCapacities('changeFrequency')
      }
    },
    'form.dayWorkingRange': {
      deep: true,
      immediate: false,
      handler(next, previous) {
        if (next === this.form.dayWorkingRange && !Object.keys(previous || {}).length) {
          return
        }

        if (this.chipsDay && !this.$v.form.dayWorkingRange![this.chipsDay.value]?.$invalid) {
          this.generateCapacities('dayWorkingRange')
        }
      },
    },
    localCapacityType(next) {
      if (!this.hasLoaded) {
        return
      }
      this.$emit('updateCapacityType', next)

      this.generateCapacities('changeFrequency')
    },
    localSelectType(next) {
      if (!this.hasLoaded) {
        return
      }
      this.$emit('updateSelectType', next)

      this.generateCapacities('changeFrequency')
    },
  },
})
</script>

<style lang="scss">
#carrier-create-typical-week-capacity {
  .carrier-create-typical-week-radio {
    label {
      color: $main-color;
    }

    .v-icon {
      color: $main-lighten-52-color;
    }
  }

  .schedule-wrapper {
    background-color: $main-lighten-80-color;
    padding: 2.5rem;
    margin-top: 3rem;
  }

  .close-checkbox {
    max-width: fit-content;
  }
}
</style>
