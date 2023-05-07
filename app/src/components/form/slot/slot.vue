<template>
  <v-container :id="id" :data-id="id" class="slot-component">
    <v-row no-gutters>
      <v-col cols="12">
        <v-row no-gutters>
          <v-col
            cols="3"
            offset="1"
            sm="2"
            offset-sm="0"
            class="label-wrapper pr-1"
            v-if="label"
          >
            <span class="regular14" :data-id="`${id}-label`">{{ $t(`common.days.${label}`) }}</span>
          </v-col>

          <v-col :cols="cols" :sm="sm">
            <v-row no-gutters v-for="(day, index) in localDays" :key="`${day.uniqueId}-${index}`">
              <v-col cols="12" class="date-picker-start d-flex align-center">
                <v-row no-gutters>
                  <v-col cols="6" class="pr-6">
                    <mp-slot-input
                      :label="$t('common.start')"
                      :dataId="`${id}-start`"
                      v-model="day.start"
                      :errors="getModelErrors($v.localDays.$each[index].start)"
                      :isDirty="$v.localDays.$each[index].start.$dirty"
                      @input="$v.localDays.$each[index].start.$touch()"
                      @blur="$v.localDays.$each[index].start.$touch()"
                    />
                  </v-col>

                  <v-col cols="6" class="pr-2">
                    <mp-slot-input
                      :label="$t('common.end')"
                      :dataId="`${id}-end`"
                      v-model="day.end"
                      :errors="getModelErrors($v.localDays.$each[index].end)"
                      :isDirty="$v.localDays.$each[index].end.$dirty"
                      @input="$v.localDays.$each[index].end.$touch()"
                      @blur="$v.localDays.$each[index].end.$touch()"
                    />
                  </v-col>
                </v-row>   
                <div class="top_align_trash">
                  <v-icon
                    :data-id="`${id}-delete`"
                    @click="deleteSlot(index)"
                  >
                    mdi-trash-can-outline
                  </v-icon>
                </div>
              </v-col>
            </v-row>

            <v-row no-gutters>
              <v-col cols="12" class="action-wrapper">
                <mp-button
                  :dataId="`${id}-addNewSlot`"
                  :text="$t('page.exchangePlace.creation.slot.add')"
                  format="link"
                  icon="plus"
                  linkColor="black"
                  @click="addNewSlot()"
                />
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { getDefaultOpenningHourInterval } from '@/types'
import mixins from 'vue-typed-mixins'

import { pickerFormatMixin, validationMixin } from '@/mixins'

import { SnackBarType } from '@/store/types'

import { required } from 'vuelidate/lib/validators'

import { dateHelper, dateHelperSetUtcTime } from '@/helpers/dateHelper'

import MpSlotInput from '@/components/form/slot/slotInput/slotInput.vue'

export interface SlotComputedLocalDays {
  end: string
  start: string
  uniqueId?: string
}

import { DateInterval } from '@/types'

export default mixins(pickerFormatMixin, validationMixin).extend({
  name: 'mp-slot',
  components: {
    MpSlotInput,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
    days: {
      type: Array as () => SlotComputedLocalDays[],
      required: true,
    },
    label: {
      type: String,
      required: false,
    },
    limit: {
      type: Number,
      default: -1,
    },
    cols: {
      type: String,
      default: '8',
    },
    sm: {
      type: String,
      default: '10',
    },
  },
  computed: {
    localDays(): SlotComputedLocalDays[] {
      const localDays = this.days
      localDays.forEach(element => {
        element.uniqueId = (Math.random() * 10).toString()
      })
      return localDays
    },
  },
  validations() {
    const { localDays, days } = this

    return {
      localDays: {
        $each: {
          start: {
            required,
            clockRule(value) {
              return (this as any).clockRule(value)
            },
            maxTimeSlot(value, day) {
              return (this as any).maxTime(day.start, day.end)
            },
            noOverlapRule(value, day): boolean {
              const index = localDays.findIndex(d => d.uniqueId === day.uniqueId)

              if (index !== undefined && day.start.length === 5 && day.end.length === 5) {
                return (this as any).noOverlapRules(day, days, index)
              }

              return false
            },
          },
          end: {
            required,
            clockRule(value) {
              return (this as any).clockRule(value)
            },
            maxTimeSlot(value, day) {
              return (this as any).maxTime(day.start, day.end)
            },
            noOverlapRule(value, day): boolean {
              const index = localDays.findIndex(d => d.uniqueId === day.uniqueId)

              if (index !== undefined && day.start.length === 5 && day.end.length === 5) {
                return (this as any).noOverlapRules(day, days, index)
              }

              return false
            },
          },
        },
      },
    }
  },
  mounted() {
    this.$emit('invalid', this.$v.localDays.$invalid)
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
    addNewSlot() {
      const { limit } = this
      if (limit === -1 || this.days.length < limit) {
        this.days.push(getDefaultOpenningHourInterval())
      } else {
        this.$store.dispatch('setSnackbar', {
          type: SnackBarType.ERROR,
          message: this.$t('messages.addSlotError.max', { limit }),
        })
      }
    },
    deleteSlot(index: number) {
      this.$v.localDays.$each![index]!.end.$reset()
      this.$v.localDays.$each![index]!.start.$reset()
      this.days.splice(index, 1)
    },
  },
  watch: {
    '$v.localDays.$invalid'(next) {
      this.$emit('invalid', next)
    },
  },
})
</script>

<style lang="scss">
.slot-component {
  padding: 2.7rem 0 1.7rem 1.2rem !important;
  min-height: 10rem !important;

  .label-wrapper {
    padding-top: 0.6rem !important;
    word-break: break-word;
  }

  .date-picker-start,
  .date-picker-end {
    @media #{map-get($display-breakpoints, 'lg-and-up')} {
      padding-right: 3rem !important;
    }

    @media #{map-get($display-breakpoints, 'md-and-down')} {
      padding-right: 1.5rem !important;
    }
  }

  .slot-action {
    padding-top: 0.6rem !important;
  }

  .action-wrapper {
    button {
      padding-left: 0 !important;
    }
  }
  .top_align_trash {
    display: block;
    height: 100%;
    padding: 0.4rem;
  }
}
</style>
