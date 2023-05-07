<template>
  <v-row no-gutters id="typical-week-capacity-day">
    <v-col cols="12">
      <!-- Information message -->
      <div v-if="showInfos" class="capacity-information-wrapper">
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
            v-for="(capacity, index) of value"
            :key="`capacities-${index}-${frequency.type}-${value.length}`"
            @click="manageSlot(capacity)"
          >
            <div class="content-wrapper">
              <span class="regular14">{{
                `${getTimezoneSlotDate(capacity.start)} - ${getTimezoneSlotDate(capacity.end)}`
              }}</span>

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
              :disabled="$v.$invalid || capacity === '--'"
            />
          </div>
        </div>
      </div>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import mixins from 'vue-typed-mixins'

import { validationMixin } from '@/mixins'
import { DayCapacity, TypicalWeekFrequency, Week } from '@/types'
import { dateHelper, dateHelperGetTimezonedDate, dateHelperSetUtcTime } from '@/helpers/dateHelper'

export default mixins(validationMixin).extend({
  name: 'capacity-day',
  props: {
    value: {
      type: Array as () => DayCapacity[],
      required: true,
    },
    frequency: {
      type: Object as () => TypicalWeekFrequency,
      required: true,
    },
    timezone: {
      type: String,
      required: false,
    },
    showTimezonedDate: {
      type: Boolean,
      default: true,
    },
    dayOfTheWeek: {
      type: Array as () => Array<{
        value: Week
        text: string
        disabled: boolean
      }>,
      required: true,
    },
    showDuplicate: {
      type: Boolean,
      default: true,
    },
    showInfos: {
      type: Boolean,
      default: true,
    },
  },
  validations: {
    capacity: {
      customCapacity(value) {
        if (value === '--') {
          return true
        }

        return Number.isInteger(Number(value))
      },
    },
  },
  data: () => ({
    selectedSlot: [] as Array<Partial<DayCapacity>>,
    selectAll: false,
    capacity: '',
  }),
  computed: {},
  methods: {
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
        for (const capacity of this.value) {
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
        this.value.find(
          val => val.start === selectedSlot.start && val.end === selectedSlot.end,
        )!.capacity = capacity ? parseInt(capacity, 10) : null
      }

      this.capacity = ''
      this.selectedSlot = []
      this.selectAll = false
    },
    getTimezoneSlotDate(date: string) {
      return !this.showTimezonedDate
        ? date
        : dateHelper.formatToTimezone(
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
  watch: {
    'frequency.type'() {
      this.$emit('generateCapacities')
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

      if (next.length === this.value.length) {
        this.selectAll = true
      } else {
        this.selectAll = false
      }
    },
  },
})
</script>

<style lang="scss">
@import '../../../styles/mixins/macScrollbar';

#typical-week-capacity-day {
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
      background-color: $white;

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
    background-color: $white;

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
}
</style>
