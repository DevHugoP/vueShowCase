<template>
  <div id="typical-week-capacity" v-if="hasLoaded">
    <h2>{{ $t('page.typicalWeek.capacity.title') }}</h2>

    <div v-if="value[selectedDay]">
      <!-- Information message -->
      <div class="capacity-information-wrapper">
        <v-icon>mdi-information</v-icon>
        <ul class="capacity-information italic16">
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
              `capacity-selector${
                selectedSlot.find(
                  slot => slot.start === capacity.start && slot.end === capacity.end,
                )
                  ? ' selected'
                  : ''
              }`
            "
            v-for="(capacity, index) of value[selectedDay]"
            :key="
              `capacities-${index}-${frequency.type}-${selectedDay}-${value[selectedDay].length}`
            "
            @click="manageSlot(capacity)"
          >
            <div class="content-wrapper">
              <span class="regular14">{{ `${capacity.start} - ${capacity.end}` }}</span>

              <div :class="`capacity-number${capacity.capacity ? ' filled' : ''}`">
                <span class="medium12">{{ capacity.capacity }}</span>
              </div>
            </div>
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
              :disabled="$v.$invalid"
            />
          </div>
        </div>
      </div>
    </div>

    <div v-else class="mt-8 mr-4">
      <span class="italic16 main-lighten-52"> {{ $t('page.typicalWeek.capacity.info') }} </span>
    </div>
  </div>
</template>

<script lang="ts">
import { dateHelper, dateHelperMinutes, dateHelperHours } from '@/helpers/dateHelper'
import {
  DayCapacity,
  OpeningHours,
  FrequencyAvailableNew,
  Week,
  TypicalWeekFrequencyNew,
} from '@/types'
import mixins from 'vue-typed-mixins'

import { integer } from 'vuelidate/lib/validators'

import { validationMixin } from '@/mixins'

import mpDialogCapacityDuplicate from '@/views/TypicalWeek/dialog/duplicate/duplicate.vue'
import mpDialogSlotDuplicate from '@/views/TypicalWeek/dialog/slotDuplicate/duplicateSlot.vue'
import { ROUTES } from '@/constants'

export default mixins(validationMixin).extend({
  name: 'mp-exception-capacities',
  components: {
    mpDialogCapacityDuplicate,
    mpDialogSlotDuplicate,
  },
  props: {
    value: {
      type: Object as () => Record<string, DayCapacity[]>,
      required: true,
    },
    frequency: {
      type: Object as () => TypicalWeekFrequencyNew,
      required: true,
    },
    openingHours: {
      type: Object as () => OpeningHours,
      required: true,
    },
  },
  validations: {
    capacity: { integer },
  },
  data: () => ({
    hasLoaded: false,
    selectedDay: '',
    selectedSlot: [] as Array<Partial<DayCapacity>>,
    selectAll: false,
    capacity: '',
    showDialogDuplicate: false,
    showDialogDuplicateSlot: false,
    chipsDay: null as {
      value: Week
      text: string
      disabled: boolean
    } | null,
  }),

  computed: {
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
        case FrequencyAvailableNew.DEMI:
          return { minutes: 30 }
        case FrequencyAvailableNew.HOUR:
          return { hours: 1 }
        case FrequencyAvailableNew.TWO_HOURS:
          return { hours: 2 }
        case FrequencyAvailableNew.THREE_HOURS:
          return { hours: 3 }
        case FrequencyAvailableNew.FOUR_HOURS:
          return { hours: 4 }
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
    if (this.frequency.type && this.$route.name !== ROUTES.carrierEditExceptions) {
      this.generateCapacities()
    }

    if (this.$route.name === ROUTES.carrierEditExceptions && !this.value.monday.length) {
      this.generateCapacities()
    }

    this.selectedDay = Week.MONDAY

    this.hasLoaded = true
  },

  methods: {
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

          if (time.start && time.end) {
            // Create enough capacity slot inside a opening slot
            while (
              dateHelper.isSameOrBefore(dateHelper.add(start, this.getAddedTime as any), end)
            ) {
              const next = dateHelper.add(start, this.getAddedTime as any)

              localCapacities[key].push({
                start: `${dateHelperHours(start)}:${dateHelperMinutes(start)}`,
                end: `${dateHelperHours(next)}:${dateHelperMinutes(next)}`,
                capacity: null,
              })

              start = next
            }
          }
        }
      }
      this.$emit('input', localCapacities)
    },
    manageSlot(capacity: DayCapacity) {
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
    daySelected(day: string) {
      this.selectedSlot = []
      this.selectedDay = day
      this.selectAll = false
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
    'frequency.type'() {
      this.generateCapacities()
      this.selectedSlot = []
    },
    selectedSlot(next: Array<Partial<DayCapacity>>) {
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
    openingHours() {
      this.generateCapacities()
    },
  },
})
</script>

<style lang="scss">
@import '../../../../styles/mixins/macScrollbar';

#typical-week-capacity {
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
      border: 0.1rem dashed $main-lighten-65-color;
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
        border: 0.2rem solid $main-color;
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
</style>
