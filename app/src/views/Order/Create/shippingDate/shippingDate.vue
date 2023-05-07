<template>
  <v-row
    no-gutters
    class="block"
    id="create-order-shipping-date"
    data-id="order-create-block-shippingDate"
  >
    <v-col cols="12" class="header d-flex justify-space-between align-center">
      <div>
        <h2>{{ $t('page.createOrder.titles.shippingDate') }}</h2>
        <span class="block-info">{{ $t('page.createOrder.infos.shippingDate') }}</span>
      </div>
      <div>
        <span class="regular14 show-more" @click="seeMore = !seeMore">
          {{ `${$t('action.show.base')} ${seeMore ? '-' : '+'}` }}
        </span>
      </div>
    </v-col>

    <v-col cols="12" class="content" v-show="seeMore">
      <v-row no-gutters>
        <v-col cols="12" class="day-choice-wrapper mb-5">
          <div
            :class="
              `day-wrapper first${
                selectedDay === CreateOrderServicePickingDayType.TODAY ? ' selected' : ''
              }`
            "
            @click="selectedDay = CreateOrderServicePickingDayType.TODAY"
          >
            <span class="regular16">
              {{ $t('common.today') }}
            </span>
          </div>
          <div
            :class="
              `day-wrapper${
                selectedDay === CreateOrderServicePickingDayType.TOMORROW ? ' selected' : ''
              }`
            "
            @click="selectedDay = CreateOrderServicePickingDayType.TOMORROW"
          >
            <span class="regular16">
              {{ $t('common.tomorrow') }}
            </span>
          </div>
          <div
            :class="
              `day-wrapper${
                selectedDay === CreateOrderServicePickingDayType.OTHER ? ' selected' : ''
              }`
            "
            @click="selectedDay = CreateOrderServicePickingDayType.OTHER"
          >
            <span class="regular16">
              {{ $t('common.other') }}
            </span>
          </div>
        </v-col>

        <v-col
          cols="12"
          class="date-wrapper mt-5 mb-5"
          v-if="selectedDay === CreateOrderServicePickingDayType.OTHER"
        >
          <mp-date-picker
            :refs="{ menu: 'datepickerMenuRef', textfield: 'pickupDate', picker: 'picker' }"
            dataId="order-create-shippingDate-date"
            :label="`${$t('common.date')} *`"
            v-model="date"
            @input="$v.date.$touch()"
            @blur="$v.date.$touch()"
            :errors="getModelErrors($v.date)"
            :isDirty="$v.date.$dirty"
            :min="getMinDateForDatePicker"
            :dateHelper="dateHelper"
          />
        </v-col>
      </v-row>

      <v-row no-gutters>
        <v-col cols="12" class="select-times-wrapper mb-5">
          <mp-select
            dataId="order-create-shippingDate-times"
            :label="
              `${$t('page.createOrder.steps.step3.deliverySlot.choices.timeSlot.timeSlot')} *`
            "
            :items="timeSlots"
            v-model="times"
            @input="$v.times.$touch()"
            @blur="$v.times.$touch()"
            :errors="getModelErrors($v.times)"
            :isDirty="$v.times.$dirty"
            required
            :attach="`#create-order-time-selector-shippingDate`"
            :dropdownId="`create-order-time-selector-shippingDate`"
          />
        </v-col>

        <v-col cols="12" v-if="isOtherTimeSlot">
          <v-row no-gutters>
            <v-col cols="12" md="6" :class="`${$vuetify.breakpoint.mdAndUp ? 'pr-3' : ''}`">
              <mp-time-picker-new
                v-model="time.start"
                :label="`${$t('common.start')} *`"
                dataId="order-create-shippingDate-time-start"
                @input="$v.time.start.$touch()"
                @blur="$v.time.start.$touch()"
                :errors="getModelErrors($v.time.start)"
                :isDirty="$v.time.start.$dirty"
              />
            </v-col>

            <v-col cols="12" md="6" :class="`${$vuetify.breakpoint.mdAndUp ? 'pl-3' : 'mt-3'}`">
              <mp-time-picker-new
                v-model="time.end"
                dataId="order-create-shippingDate-time-end"
                :label="`${$t('common.end')} *`"
                @input="$v.time.end.$touch()"
                @blur="$v.time.end.$touch()"
                :errors="getModelErrors($v.time.end)"
                :isDirty="$v.time.end.$dirty"
              />
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { DELIVERY_SLOT_TIME_SLOTS_FROM_API, OTHER_TIME_SLOT_VALUE } from '@/constants'
import {
  dateHelper,
  dateHelperGetTimezonedDate,
  dateHelperGetUtcDate,
  dateHelperGetUTCHours,
  dateHelperGetUTCMinutes,
  dateHelperSetUtcTime,
  OperationUnit,
} from '@/helpers/dateHelper'
import minDateHelper from '@/helpers/minDateHelper'
import { validationMixin } from '@/mixins'
import { CreateOrderStateShippingDate } from '@/store/modules/createOrder/shippingDate/types'
import { CreateOrderServicePickingDayType, SelectItem } from '@/types'
import mixins from 'vue-typed-mixins'
import { required, requiredIf } from 'vuelidate/lib/validators'

export default mixins(validationMixin).extend({
  name: 'order-create-shippingDate',
  props: {
    isEditing: {
      type: Boolean,
      required: true,
    },
  },
  data: () => ({
    selectedDay: '',
    times: '',
    time: {
      start: '',
      end: '',
    },
    CreateOrderServicePickingDayType,
    date: dateHelper.format(dateHelper.add(dateHelper.getDate(), { days: 2 }), 'yyyy-MM-dd'),
    dateHelper,
    seeMore: true,
  }),
  computed: {
    shippingDate(): CreateOrderStateShippingDate {
      return this.$store.getters['createOrder/shippingDate/shippingDate']
    },
    validations(): any {
      return this.$store.getters['createOrder/shippingDate/$v']
    },
    timeSlots(): SelectItem[] {
      let tmpSlot = []
      const { nowHour, nowMinute } = this.getTimeSlotsHoursMinutes

      for (const slot of DELIVERY_SLOT_TIME_SLOTS_FROM_API) {
        const slotHour = parseInt(slot.value.split(':')[0], 10)
        const slotMinute = parseInt(slot.value.split(':')[1].split('-')[0], 10)

        if (
            (nowHour < slotHour || (nowHour === slotHour && nowMinute <= slotMinute)) ||
            this.selectedDay !== CreateOrderServicePickingDayType.TODAY
          ) {
            tmpSlot.push(slot)
        }
      }
      return [
        {
          text: this.$t(
            `page.createOrder.steps.step3.deliverySlot.choices.timeSlot.${OTHER_TIME_SLOT_VALUE}`,
          ),
          value: OTHER_TIME_SLOT_VALUE,
        },
        ...tmpSlot,
      ]
    },
    getTimeSlotsHoursMinutes(): { nowHour: number; nowMinute: number } {
      let nowHour = 0
      let nowMinute = 0

      if (
        this.shippingDate.interval?.length &&
        this.compareDate(this.shippingDate.interval[0].start)
      ) {
        nowHour = dateHelperGetTimezonedDate().getUTCHours()
        nowMinute = dateHelperGetTimezonedDate().getUTCMinutes()
      }

      return { nowHour, nowMinute }
    },
    getMinDateForDatePicker(): string {
      return dateHelper.formatToTimezone(dateHelperGetTimezonedDate(), 'UTC', 'yyyy-MM-dd')
    },
    isOtherTimeSlot(): boolean {
      return this.times === OTHER_TIME_SLOT_VALUE
    },
  },
  mounted() {
    if (
      (this.isEditing || (!this.isEditing && !this.validations.$invalid)) &&
      this.shippingDate.interval?.length
    ) {
      const today = dateHelper.isSame(
        new Date(this.shippingDate.interval[0].start),
        dateHelperGetTimezonedDate(),
        OperationUnit.DAYS,
      )

      const tomorrow = dateHelper.isSame(
        new Date(this.shippingDate.interval[0].start),
        dateHelper.add(dateHelperGetTimezonedDate(), { days: 1 }),
        OperationUnit.DAYS,
      )

      if (today) {
        this.selectedDay = CreateOrderServicePickingDayType.TODAY
      } else if (tomorrow) {
        this.selectedDay = CreateOrderServicePickingDayType.TOMORROW
      } else {
        this.selectedDay = CreateOrderServicePickingDayType.OTHER
        this.date = dateHelper.formatToTimezone(
          new Date(this.shippingDate.interval[0].start),
          'UTC',
          'yyyy-MM-dd',
        )
      }
      this.$nextTick(() => {
        const { start: startOld, end: endOld } = this.shippingDate.interval[0]
        const startOldDate = dateHelperGetTimezonedDate(startOld)
        const endOldDate = dateHelperGetTimezonedDate(endOld)

        const start = `${dateHelperGetUTCHours(startOldDate)}:${dateHelperGetUTCMinutes(startOldDate)}`
        const end = `${dateHelperGetUTCHours(endOldDate)}:${dateHelperGetUTCMinutes(endOldDate)}`

        const isSlotExisting = DELIVERY_SLOT_TIME_SLOTS_FROM_API.find(
          slot => slot.value === `${start}-${end}`,
        )

        if (isSlotExisting) {
          this.times = isSlotExisting.value
          this.time = {
            start: isSlotExisting.value.split('-')[0],
            end: isSlotExisting.value.split('-')[1],
          }
        } else {
          this.times = OTHER_TIME_SLOT_VALUE
          this.time = {
            start,
            end,
          }
        }

        this.$nextTick(() => {
          this.$v.$touch()
        })
      })
    } else {
      this.selectedDay = this.selectFirstDayWithSlotAvailable()
      this.$nextTick(() => {
        this.times =
          this.timeSlots?.length > 1
            ? (this.timeSlots[1].value! as string)
            : (this.timeSlots[0].value! as string)
      })
    }

    this.seeMore = false
  },
  validations() {
    const { isOtherTimeSlot, time, shippingDate } = this

    return {
      date: { required },
      times: { required },
      time: {
        start: {
          required: requiredIf((): boolean => isOtherTimeSlot),
          clockRule(value): boolean {
            return isOtherTimeSlot ? (this as any).clockRule(value) : true
          },
          maxTimeSlot(): boolean {
            return isOtherTimeSlot ? (this as any).maxTime(time.start, time.end) : true
          },
          dateIsSameOrBefore: (): boolean => {
            const isBeforeNow = minDateHelper({
              date: new Date().toISOString(),
              timezoneMessage: true,
            })(shippingDate.interval[0].start)

            return isBeforeNow
          },
        },
        end: {
          required: requiredIf((): boolean => isOtherTimeSlot),
          clockRule(value): boolean {
            return isOtherTimeSlot ? (this as any).clockRule(value) : true
          },
          maxTimeSlot(): boolean {
            return isOtherTimeSlot ? (this as any).maxTime(time.start, time.end) : true
          },
          dateIsSameOrBefore: (): boolean => {
            const isBeforeNow = minDateHelper({
              date: new Date().toISOString(),
              timezoneMessage: true,
            })(shippingDate.interval[0].end)

            return isBeforeNow
          },
        },
      },
    }
  },
  methods: {
    compareDate(date1: string, date2?: string): boolean {
      return dateHelper.isSame(
        new Date(date1),
        date2 ? new Date(date2) : dateHelperGetTimezonedDate(),
        OperationUnit.DAYS,
      )
    },
    selectFirstDayWithSlotAvailable(): CreateOrderServicePickingDayType {
      const { nowHour, nowMinute } = this.getTimeSlotsHoursMinutes

      const lastPickupSlot = DELIVERY_SLOT_TIME_SLOTS_FROM_API.slice(-1)[0]
      const lastPickupSlotHour = parseInt(lastPickupSlot.value.split(':')[0], 10)
      const lastPickupSlotMinute = parseInt(lastPickupSlot.value.split(':')[1].split('-')[0], 10)

      if (nowHour > lastPickupSlotHour || (nowHour === lastPickupSlotHour && nowMinute > lastPickupSlotMinute)) {
        return CreateOrderServicePickingDayType.TOMORROW
      }
      return CreateOrderServicePickingDayType.TODAY
    }
  },
  watch: {
    selectedDay(next) {
      let start: Date | string = ''
      let end: Date | string = ''
      switch (next) {
        case CreateOrderServicePickingDayType.TODAY:
          start = new Date()
          end = new Date()
          break
        case CreateOrderServicePickingDayType.TOMORROW:
          start = dateHelper.add(new Date(), { days: 1 })
          end = dateHelper.add(new Date(), { days: 1 })
          break
        case CreateOrderServicePickingDayType.OTHER:
          start = this.date
          end = this.date
          break
      }
      //  this.$emit('selectedDay', next)
      if (!this.shippingDate.interval.length) {
        this.shippingDate.interval.push({
          start:
            typeof this.date === 'string'
              ? new Date(start).toISOString()
              : (start as Date).toISOString(),
          end:
            typeof this.date === 'string'
              ? new Date(end).toISOString()
              : (end as Date).toISOString(),
        })
      } else {
        const intervalStartDate = new Date(this.shippingDate.interval[0].start)
        const intervalEndDate = new Date(this.shippingDate.interval[0].end)

        this.shippingDate.interval[0].start = dateHelperSetUtcTime(new Date(start), {
          hours: intervalStartDate.getUTCHours(),
          minutes: intervalStartDate.getUTCMinutes(),
          seconds: intervalStartDate.getUTCSeconds(),
          milliseconds: intervalStartDate.getUTCMilliseconds(),
        }).toISOString()

        this.shippingDate.interval[0].end = dateHelperSetUtcTime(new Date(end), {
          hours: intervalEndDate.getUTCHours(),
          minutes: intervalEndDate.getUTCMinutes(),
          seconds: intervalEndDate.getUTCSeconds(),
          milliseconds: intervalEndDate.getUTCMilliseconds(),
        }).toISOString()
      }
    },
    date(next) {
      const nextDate = new Date(next)
      const intervalStartDate = new Date(this.shippingDate.interval[0].start)
      const intervalEndDate = new Date(this.shippingDate.interval[0].end)

      const date = {
        years: nextDate.getUTCFullYear(),
        months: nextDate.getUTCMonth(),
        days: nextDate.getUTCDate(),
      }

      this.shippingDate.interval[0].start = dateHelperSetUtcTime(
        intervalStartDate,
        {
          hours: intervalStartDate.getUTCHours(),
          minutes: intervalStartDate.getUTCMinutes(),
          seconds: intervalStartDate.getUTCSeconds(),
          milliseconds: intervalStartDate.getMilliseconds(),
        },
        { ...date },
      ).toISOString()

      this.shippingDate.interval[0].end = dateHelperSetUtcTime(
        intervalEndDate,
        {
          hours: intervalEndDate.getUTCHours(),
          minutes: intervalEndDate.getUTCMinutes(),
          seconds: intervalEndDate.getUTCSeconds(),
          milliseconds: intervalEndDate.getMilliseconds(),
        },
        { ...date },
      ).toISOString()
    },
    times(next) {
      if (next === OTHER_TIME_SLOT_VALUE) {
        // Force the launch of watchers and validations
        if (this.time.start === '08:00' && this.time.end === '10:00') {
          this.time = {
            start: '08:01',
            end: '10:00',
          }

          this.$nextTick(() => {
            this.time = {
              start: '08:00',
              end: '10:00',
            }
          })
        }

        return
      }

      const [start, end] = next.split('-')
      this.shippingDate.interval[0].start = dateHelperGetUtcDate(
        dateHelperSetUtcTime(new Date(this.shippingDate.interval[0].start), {
          hours: parseInt(start.split(':')[0], 10),
          minutes: parseInt(start.split(':')[1], 10),
          seconds: 0,
          milliseconds: 0,
        }).toISOString(),
      ).toISOString()

      this.shippingDate.interval[0].end = dateHelperGetUtcDate(
        dateHelperSetUtcTime(new Date(this.shippingDate.interval[0].end), {
          hours: parseInt(end.split(':')[0], 10),
          minutes: parseInt(end.split(':')[1], 10),
          seconds: 0,
          milliseconds: 0,
        }).toISOString(),
      ).toISOString()
    },
    'time.start'(next) {
      if (!next || next.length !== 5 || next.includes('HH') || next.includes('mm')) {
        return
      }

      this.shippingDate.interval[0].start = dateHelperGetUtcDate(
        dateHelperSetUtcTime(new Date(this.shippingDate.interval[0].start), {
          hours: parseInt(next.split(':')[0], 10),
          minutes: parseInt(next.split(':')[1], 10),
          seconds: 0,
          milliseconds: 0,
        }).toISOString(),
      ).toISOString()
    },
    'time.end'(next) {
      if (!next || next.length !== 5 || next.includes('HH') || next.includes('mm')) {
        return
      }

      this.shippingDate.interval[0].end = dateHelperGetUtcDate(
        dateHelperSetUtcTime(new Date(this.shippingDate.interval[0].end), {
          hours: parseInt(next.split(':')[0], 10),
          minutes: parseInt(next.split(':')[1], 10),
          seconds: 0,
          milliseconds: 0,
        }).toISOString(),
      ).toISOString()
    },
  },
})
</script>

<style lang="scss" scoped>
@import '../../../../styles/mixins/macScrollbar';

#create-order-shipping-date {
  .header {
    .show-more {
      text-decoration: underline;
      cursor: pointer;
    }
  }
  .day-choice-wrapper {
    display: flex;
    margin-top: 3.2rem;

    overflow: auto;
    padding-bottom: 1rem !important;
    @include setMacScrollbar('&');

    .day-wrapper {
      min-height: 7rem;
      max-height: 7rem;
      min-width: 14.8rem;
      max-width: 14.8rem;
      display: flex;
      justify-content: center;
      align-items: center;
      border: 0.1rem solid $main-lighten-65-color;
      border-radius: 0.4rem;
      margin-left: 2rem;
      cursor: pointer;

      &.disabled {
        cursor: not-allowed;
        color: $main-lighten-65-color;

        background: linear-gradient(
          to bottom right,
          $white 0%,
          $white calc(50% - 0.1rem),
          $main-lighten-52-color 50%,
          $white calc(50% + 0.1rem),
          $white 100%
        );

        &:hover {
          box-shadow: none;
        }
      }

      &:hover {
        box-shadow: $box-shadow-hover;
      }

      &.first {
        margin-left: 0;
      }

      &.selected {
        border: 0.2rem solid $main-color;
      }
    }
  }
}
</style>
