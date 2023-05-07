<template>
  <v-row no-gutters data-id="exchangePlace-form-openingHours" id="exchangePlace-form-openingHours">
    <!-- TITLE -->
    <v-col cols="12" v-if="showTitle" class="mb-8" data-id="exchangePlace-form-openingHours-title">
      <h3>{{ $t('page.schedule.editModalTitle') }}</h3>
    </v-col>

    <!-- FORM CREATE-->

    <v-row>
      <mp-chips-wrapper
        class="mb-4"
        :chips="weekDays"
        v-model="selectedDayChips"
        :dataId="`chips-wrapper-openingHours`"
        valueProps="value"
        :maxChips="5"
      />
    </v-row>

    <v-row no-gutter class="openingHours-wrapper-modal">
      <div
        v-for="(day, dayIndex) of openingHours"
        :key="`days-${dayIndex}-${openingHours[dayIndex].length}`"
      >
        <v-col cols="12">
          <v-row no-gutters>
            <v-col class="day-wrapper">
              <span class="regular14 day-text" :data-id="`${dayIndex}-label`">{{
                $t(`common.days.${dayIndex.slice(0, 3)}`)
              }}</span>
              <div class="right-wrapper-content">
                <div
                  no-gutters
                  class="loop-content"
                  div
                  v-for="(range, rangeIndex) in day"
                  :key="`days-${rangeIndex}-${range.fakeId}`"
                >
                  <div class="time-picker-wrapper">
                    <div class="range-time-picker start">
                      <mp-time-picker-new
                        v-model="range.start"
                        :label="`${$t('common.start')} *`"
                        :data-id="`time-picker-start-${rangeIndex}-${range.fakeId}`"
                        :errors="getModelErrors($v.openingHours[dayIndex].$each[rangeIndex].start)"
                        :isDirty="$v.openingHours[dayIndex].$each[rangeIndex].start.$dirty"
                        @input="$v.openingHours[dayIndex].$each[rangeIndex].start.$touch()"
                        @blur="$v.openingHours[dayIndex].$each[rangeIndex].start.$touch()"
                      />
                    </div>
                    <div class="range-time-picker end">
                      <mp-time-picker-new
                        v-model="range.end"
                        :data-id="`time-picker-end-${rangeIndex}-${range.fakeId}`"
                        :label="`${$t('common.end')} *`"
                        :errors="getModelErrors($v.openingHours[dayIndex].$each[rangeIndex].end)"
                        :isDirty="$v.openingHours[dayIndex].$each[rangeIndex].end.$dirty"
                        @input="$v.openingHours[dayIndex].$each[rangeIndex].end.$touch()"
                        @blur="$v.openingHours[dayIndex].$each[rangeIndex].end.$touch()"
                      />
                    </div>
                  </div>

                  <v-icon
                    v-if="day.length > 1"
                    class="main-color ml-4 mb-3"
                    @click="deleteWorkingRange(dayIndex, rangeIndex)"
                    :data-id="`delete-btn-${rangeIndex}-${range.fakeId}`"
                    size="1.8rem"
                  >
                    mdi-trash-can-outline
                  </v-icon>

                  <v-icon
                    v-if="day.length < 4 && day.slice(-1).pop() === range"
                    class="main-color ml-4 mb-3"
                    @click="addWorkingRange(dayIndex)"
                    :data-id="`add-range-btn-${rangeIndex}-${range.fakeId}`"
                    size="1.8rem"
                  >
                    mdi-plus-circle
                  </v-icon>
                </div>
                <mp-checkbox-new
                  :class="`close-checkbox${isDayClosed(dayIndex) ? ' pt-4' : ''}`"
                  @change="toggleDaySelected(dayIndex)"
                  :label="`${$t('common.closed')}`"
                  :input-value="isDayClosed(dayIndex)"
                />
              </div>
            </v-col>
          </v-row>
        </v-col>
      </div>
    </v-row>
  </v-row>
</template>

<script lang="ts">
import { authorizationMixin, validationMixin } from '@/mixins'
import { DateInterval, Week, getDefaultOpenningHour, OpeningHours } from '@/types'
import { ROUTES } from '@/constants'
import TimezoneAutocomplete from '@/components/form/timezoneAutocomplete/timezoneAutocomplete.vue'
import { v4 } from 'uuid'
import { required } from 'vuelidate/lib/validators'
import { dateHelper, dateHelperSetUtcTime } from '@/helpers/dateHelper'

import mixins from 'vue-typed-mixins'

export default mixins(validationMixin, authorizationMixin).extend({
  name: 'work-schedule',
  components: { TimezoneAutocomplete },
  props: {
    showTitle: {
      type: Boolean,
      default: false,
    },
    editWorkSchedule: {
      type: Object as () => OpeningHours,
      default: () => getDefaultOpenningHour(),
    },
  },
  data: () => ({
    isEditing: false,
    selectedDayChips: '' as string,
    weekDays: [] as Array<{ text: string; value: string }>,
  }),
  beforeMount() {
    this.weekDays = Object.values(Week).map(day => {
      return {
        text: this.$t(`common.days.${day.slice(0, 3)}`),
        value: day,
      }
    })
    this.isEditing = this.$route.name === ROUTES.updateExchangePlace

    if (this.isEditing) {
      const localOpeningHours = getDefaultOpenningHour()
      for (const day in this.openingHours) {
        localOpeningHours[day] = this.openingHours[day].map((range: any) => {
          return { ...range, fakeId: v4() }
        })
        console.log('test', localOpeningHours)
      }
      this.$emit('update:openingHours', localOpeningHours)
    }
  },
  validations(): any {
    const validation: Record<string, any> = Object.entries(this.editWorkSchedule).reduce(
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
      openingHours: {
        ...validation,
      },
    }
  },

  methods: {
    addWorkingRange(selectedDay: any) {
      this.openingHours[selectedDay].push({ start: '', end: '', fakeId: v4() })
    },
    deleteWorkingRange(selectedDay: any, index: any) {
      this.openingHours[selectedDay].splice(index, 1)
    },
    isDayClosed(selectedDay: any): any {
      return !this.openingHours[selectedDay].length
    },
    toggleDaySelected(selectedDay: any) {
      if (this.isDayClosed(selectedDay)) {
        this.openingHours![selectedDay] = [{ start: '', end: '', fakeId: v4() }]
      } else {
        this.openingHours![selectedDay] = []
      }
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
    '$v.$invalid': {
      immediate: true,
      deep: true,
      handler(next) {
        this.$emit('invalid', next)
      },
    },
  },
})
</script>

<style lang="scss">
#exchangePlace-form-openingHours {
  .openingHours-wrapper {
    display: flex;
    gap: 2rem 3.5rem;
  }

  .openingHours-wrapper-modal {
    display: flex;
    flex-direction: column;
  }

  .loop-day-wrapper {
    background-color: $main-lighten-80-color;
  }

  .day-wrapper {
    padding: 1.6rem;
    padding-top: 3.5rem;
    display: flex;
    background-color: $main-lighten-80-color;
    gap: 5rem;
  }

  .day-text {
    padding-top: 2rem;
  }

  .loop-content {
    display: flex;
    margin-bottom: 1.5rem;
  }

  .time-picker-wrapper {
    display: flex;
  }

  .right-wrapper-content {
    width: 60%;
  }

  .start {
    margin-right: 2rem;
  }
  .close-checkbox {
    max-width: fit-content;
  }
}
</style>
