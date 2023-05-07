<template>
  <v-row no-gutters id="create-order-delivery-date-default">
    <v-col cols="12" class="select-times-wrapper mb-5">
      <mp-select
        dataId="create-order-delivery-date-default-times"
        :label="`${$t('page.createOrder.steps.step3.deliverySlot.choices.timeSlot.timeSlot')} *`"
        :items="timeSlots"
        v-model="times"
        @input="$v.times.$touch()"
        @blur="$v.times.$touch()"
        :errors="getModelErrors($v.times)"
        :isDirty="$v.times.$dirty"
        required
        :attach="`#create-order-time-selector-deliveryDate`"
        :dropdownId="`create-order-time-selector-deliveryDate`"
      />
    </v-col>

    <v-col cols="12" v-if="isOtherTimeSlot">
      <v-row no-gutters>
        <v-col cols="12" md="6" :class="`${$vuetify.breakpoint.mdAndUp ? 'pr-3' : ''}`">
          <mp-time-picker-new
            v-model="time.start"
            :label="`${$t('common.start')} *`"
            dataId="order-create-deliveryDate-time-start"
            @input="$v.time.start.$touch()"
            @blur="$v.time.start.$touch()"
            :errors="getModelErrors($v.time.start)"
            :isDirty="$v.time.start.$dirty"
          />
        </v-col>

        <v-col cols="12" md="6" :class="`${$vuetify.breakpoint.mdAndUp ? 'pl-3' : 'mt-3'}`">
          <mp-time-picker-new
            v-model="time.end"
            dataId="order-create-deliveryDate-time-end"
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
</template>

<script lang="ts">
import { DELIVERY_SLOT_TIME_SLOTS_FROM_API, OTHER_TIME_SLOT_VALUE, ROUTES } from '@/constants'
import { CreateOrderStateDeliveryDate } from '@/store/modules/createOrder/deliveryDate/types'
import {
  dateHelper,
  dateHelperGetTimezonedDate,
  dateHelperSetUtcTime,
  dateHelperGetUtcDate,
  OperationUnit,
  formatTime,
  dateHelperGetUTCHours,
  dateHelperGetUTCMinutes,
} from '@/helpers/dateHelper'
import { SelectItem } from '@/types'
import { required, requiredIf } from 'vuelidate/lib/validators'
import minDateHelper from '@/helpers/minDateHelper'
import { validationMixin } from '@/mixins'
import mixins from 'vue-typed-mixins'
import { CreateOrderStateShippingDate } from '@/store/modules/createOrder/shippingDate/types'

export default mixins(validationMixin).extend({
  name: 'order-create-deliveryDate-default',
  props: {
    isEditing: {
      type: Boolean,
      required: true,
    },
  },
  data: () => ({
    times: '',
    time: {
      start: '',
      end: '',
    },
  }),
  computed: {
    shippingDate(): CreateOrderStateShippingDate {
      return this.$store.getters['createOrder/shippingDate/shippingDate']
    },
    deliveryDate(): CreateOrderStateDeliveryDate {
      return this.$store.getters['createOrder/deliveryDate/deliveryDate']
    },
    isDeliveryDateInvalid(): any {
      return this.$store.getters['createOrder/isDeliveryDateInvalid']
    },
    getTimeSlotsHoursMinutes(): { nowHour: number; nowMinute: number } {
      let nowHour = 0
      let nowMinute = 0

      if (
        this.deliveryDate.interval?.length &&
        this.shippingDate.interval?.length &&
        dateHelperGetTimezonedDate(this.shippingDate.interval[0].start).getUTCDate() ===
          dateHelperGetTimezonedDate(this.deliveryDate.interval[0].start).getUTCDate()
      ) {
        nowHour = dateHelperGetTimezonedDate(this.shippingDate.interval[0].start).getUTCHours()
        nowMinute = dateHelperGetTimezonedDate(this.shippingDate.interval[0].start).getUTCMinutes()
      } else if (
        this.deliveryDate.interval?.length &&
        this.compareDate(this.deliveryDate.interval[0].start)
      ) {
        nowHour = dateHelperGetTimezonedDate().getUTCHours()
        nowMinute = dateHelperGetTimezonedDate().getUTCMinutes()
      }

      return { nowHour, nowMinute }
    },
    timeSlots(): SelectItem[] {
      let tmpSlot = []

      const { nowHour, nowMinute } = this.getTimeSlotsHoursMinutes

      for (const slot of DELIVERY_SLOT_TIME_SLOTS_FROM_API) {
        const slotHour = parseInt(slot.value.split(':')[0], 10)
        const slotMinute = parseInt(slot.value.split(':')[1].split('-')[0], 10)

        if (nowHour < slotHour || (nowHour === slotHour && nowMinute <= slotMinute)) {
          tmpSlot.push(slot)
        }
      }

      if (
        this.$route.name === ROUTES.editOrder &&
        DELIVERY_SLOT_TIME_SLOTS_FROM_API.filter(slot => slot.value === this.times).length &&
        !tmpSlot.filter(slot => slot.value === this.times).length
      ) {
        tmpSlot = [
          DELIVERY_SLOT_TIME_SLOTS_FROM_API.filter(slot => slot.value === this.times)[0],
          ...tmpSlot,
        ]
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
    isOtherTimeSlot(): boolean {
      return this.times === OTHER_TIME_SLOT_VALUE
    },
  },
  validations() {
    const { isOtherTimeSlot, time, deliveryDate } = this

    return {
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
            })(this.shippingDate.interval[0].start)

            if (!isBeforeNow) {
              return isBeforeNow
            }

            return minDateHelper({
              date: this.shippingDate.interval[0].start,
              timezoneMessage: true,
            })(deliveryDate.interval[0].start)
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
            })(this.shippingDate.interval[0].end)

            if (!isBeforeNow) {
              return isBeforeNow
            }

            return minDateHelper({
              date: this.shippingDate.interval[0].end,
              timezoneMessage: true,
            })(deliveryDate.interval[0].end)
          },
        },
      },
    }
  },
  mounted() {
    if (this.isEditing || (!this.isEditing && !this.isDeliveryDateInvalid)) {
      this.$nextTick(() => {
        const { start: startOld, end: endOld } = this.deliveryDate.interval[0]

        const startOldDate = dateHelperGetTimezonedDate(startOld)
        const endOldDate = dateHelperGetTimezonedDate(endOld)

        const start = `${dateHelperGetUTCHours(startOldDate)}:${dateHelperGetUTCMinutes(
          startOldDate,
        )}`
        const end = `${dateHelperGetUTCHours(endOldDate)}:${dateHelperGetUTCMinutes(endOldDate)}`

        const isSlotExisting = DELIVERY_SLOT_TIME_SLOTS_FROM_API.find(
          slot => slot.value === `${start}-${end}`,
        )

        if (isSlotExisting) {
          this.times = isSlotExisting.value
          this.time = {
            start: formatTime(isSlotExisting.value.split('-')[0]),
            end: formatTime(isSlotExisting.value.split('-')[1]),
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

      return
    }

    this.$nextTick(() => {
      this.times =
        this.timeSlots?.length > 2
          ? (this.timeSlots[1].value! as string)
          : (this.timeSlots[0].value! as string)
    })
  },
  methods: {
    compareDate(date1: string, date2?: string): boolean {
      return dateHelper.isSame(
        new Date(date1),
        date2 ? new Date(date2) : dateHelperGetTimezonedDate(),
        OperationUnit.DAYS,
      )
    },
  },
  watch: {
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
      this.deliveryDate.interval[0].start = dateHelperGetUtcDate(
        dateHelperSetUtcTime(new Date(this.deliveryDate.interval[0].start), {
          hours: parseInt(start.split(':')[0], 10),
          minutes: parseInt(start.split(':')[1], 10),
          seconds: 0,
          milliseconds: 0,
        }).toISOString(),
      ).toISOString()

      this.deliveryDate.interval[0].end = dateHelperGetUtcDate(
        dateHelperSetUtcTime(new Date(this.deliveryDate.interval[0].end), {
          hours: parseInt(end.split(':')[0], 10),
          minutes: parseInt(end.split(':')[1], 10),
          seconds: 0,
          milliseconds: 0,
        }).toISOString(),
      ).toISOString()
    },
    'time.start'(next) {
      if (!next || next.length !== 5) {
        return
      }

      this.deliveryDate.interval[0].start = dateHelperGetUtcDate(
        dateHelperSetUtcTime(new Date(this.deliveryDate.interval[0].start), {
          hours: parseInt(next.split(':')[0], 10),
          minutes: parseInt(next.split(':')[1], 10),
          seconds: 0,
          milliseconds: 0,
        }).toISOString(),
      ).toISOString()
    },
    'time.end'(next) {
      if (!next || next.length !== 5) {
        return
      }

      this.deliveryDate.interval[0].end = dateHelperGetUtcDate(
        dateHelperSetUtcTime(new Date(this.deliveryDate.interval[0].end), {
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
