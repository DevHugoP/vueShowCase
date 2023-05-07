<template>
  <v-row
    no-gutters
    class="block"
    id="create-order-delivery-date"
    data-id="order-create-block-deliveryDate"
    v-if="hasLoaded"
  >
    <v-col cols="12" class="header">
      <h2>{{ $t('page.createOrder.titles.deliveryDate') }}</h2>
      <span class="block-info">{{ $t('page.createOrder.infos.deliveryDate') }}</span>
    </v-col>

    <v-col cols="12" class="content">
      <v-row no-gutters>
        <!-- Day -->
        <v-col cols="12" class="day-choice-wrapper mb-5">
          <div
            :class="
              `day-wrapper first${
                selectedDay === CreateOrderServicePickingDayType.TODAY ? ' selected' : ''
              }${isDayDisabled(CreateOrderServicePickingDayType.TODAY) ? ' disabled' : ''}`
            "
            @click="
              isDayDisabled(CreateOrderServicePickingDayType.TODAY)
                ? null
                : (selectedDay = CreateOrderServicePickingDayType.TODAY)
            "
          >
            <span class="regular16">
              {{ $t('common.today') }}
            </span>
          </div>
          <div
            :class="
              `day-wrapper${
                selectedDay === CreateOrderServicePickingDayType.TOMORROW ? ' selected' : ''
              }${isDayDisabled(CreateOrderServicePickingDayType.TOMORROW) ? ' disabled' : ''}`
            "
            @click="
              isDayDisabled(CreateOrderServicePickingDayType.TOMORROW)
                ? null
                : (selectedDay = CreateOrderServicePickingDayType.TOMORROW)
            "
          >
            <span class="regular16">
              {{ $t('common.tomorrow') }}
            </span>
          </div>
          <div
            :class="
              `day-wrapper${
                selectedDay === CreateOrderServicePickingDayType.OTHER ? ' selected' : ''
              }${isDayDisabled(CreateOrderServicePickingDayType.OTHER) ? ' disabled' : ''}`
            "
            @click="selectedDay = CreateOrderServicePickingDayType.OTHER"
          >
            <span class="regular16">
              {{ $t('common.otherDate') }}
            </span>
          </div>
        </v-col>

        <!-- Other date -->
        <v-col cols="12" class="mb-5" v-if="selectedDay === CreateOrderServicePickingDayType.OTHER">
          <mp-date-picker
            :refs="{ menu: 'datepickerMenuRef', textfield: 'pickupDate', picker: 'picker' }"
            dataId="order-create-deliveryDate-date"
            :label="`${$t('common.date')} *`"
            v-model="date"
            :errors="[]"
            :isDirty="false"
            :min="getMinDateForDatePicker"
            :dateHelper="dateHelper"
          />
        </v-col>

        <v-col cols="12" v-if="typeToDisplay === displayType.SLOT">
          <delivery-date-slots
            :slots="slots"
            :selectedDay="selectedDay"
            :isEditing="isEditing"
            :rangeSlots="rangeSlots"
            :hasTypeChanged="hasTypeChanged"
            @deleteBooking="deleteBooking()"
            @modify-range-slots="modifyRangeSlots($event)"
          />
        </v-col>
        <v-col cols="12" v-else-if="typeToDisplay === displayType.DEFAULT">
          <delivery-date-default :isEditing="isEditing" />
        </v-col>
        <v-col cols="12" v-else>
          <v-radio-group
            row
            data-id="order-create-block-deliveryDate"
            v-model="radioType"
            class="mb-5"
          >
            <v-radio
              color="success-color"
              v-for="(localRadioType, index) in radioTypes"
              :key="index"
              :label="localRadioType.label"
              :value="localRadioType.value"
            />
          </v-radio-group>
          <template v-if="radioType === displayRadioType.CUSTOM">
            <delivery-date-slots
              :slots="slots"
              :selectedDay="selectedDay"
              :isEditing="isEditing"
              :rangeSlots="rangeSlots"
              :hasTypeChanged="hasTypeChanged"
              @deleteBooking="deleteBooking()"
              @modify-range-slots="modifyRangeSlots($event)"
            />
          </template>
          <template v-else>
            <delivery-date-default :isEditing="isEditing" />
          </template>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'
import deliveryDateSlots from '@/views/Order/Create/deliveryDate/deliveryDateSlots.vue'
import deliveryDateDefault from '@/views/Order/Create/deliveryDate/deliveryDateDefault.vue'
import {
  CarrierEligibilityEntity,
  CHECKOUT_BLOCKS,
  CreateOrderServicePickingDayType,
  DeliverySlot,
  DeliverySlotsParams,
} from '@/types'
import {
  CreateOrderStateEligibility,
  CreateOrderStateMiscellaneous,
  displayRadioType,
  displayType,
} from '@/store/modules/createOrder/types'
import {
  dateHelper,
  dateHelperGetUtcDate,
  dateHelperSetUtcTime,
  formatTime,
} from '@/helpers/dateHelper'
import { CreateOrderStateDeliveryDate } from '@/store/modules/createOrder/deliveryDate/types'
import { OperationUnit, StartEndOf } from '@meltingpoint/lastmile-internationalization'
import DeliveryService from '@/services/delivery/DeliveryService'
import { mapActions } from 'vuex'
import { CreateOrderStateShippingDate } from '@/store/modules/createOrder/shippingDate/types'
import { CreateOrderStateDeparture } from '@/store/modules/createOrder/departure/types'
import { CreateOrderStateSenderIdentity } from '@/store/modules/createOrder/senderIdentity/types'

export default Vue.extend({
  name: 'order-create-deliveryDate',
  components: {
    deliveryDateSlots,
    deliveryDateDefault,
  },
  props: {
    isEditing: {
      type: Boolean,
      required: true,
    },
    stepNumber: {
      type: Number,
      required: true,
    },
  },
  data: () => ({
    selectedDay: '',
    CreateOrderServicePickingDayType,
    dateHelper,
    date: dateHelper.format(dateHelper.add(dateHelper.getDate(), { days: 2 }), 'yyyy-MM-dd'),
    typeToDisplay: '',
    displayType,
    slots: [] as DeliverySlot[],
    radioType: '',
    displayRadioType,
    hasLoaded: false,
    rangeSlots: [dateHelper.getUtcDate(new Date(), 'UTC').getUTCHours(), 24],
    initFromDate: dateHelper
      .getUtcDate(
        dateHelperSetUtcTime(new Date(), {
          hours: parseInt(formatTime(new Date().getUTCHours().toString()), 10),
          minutes: 0,
          seconds: 0,
          milliseconds: 0,
        }),
        'UTC',
      )
      .toISOString(),
    hasTypeChanged: false,
  }),
  computed: {
    shippingDate(): CreateOrderStateShippingDate {
      return this.$store.getters['createOrder/shippingDate/shippingDate']
    },
    departure(): CreateOrderStateDeparture {
      return this.$store.getters['createOrder/departure/departure']
    },
    senderIdentity(): CreateOrderStateSenderIdentity {
      return this.$store.getters['createOrder/senderIdentity/senderIdentity']
    },
    miscellaneous(): CreateOrderStateMiscellaneous {
      return this.$store.getters['createOrder/miscellaneous']
    },
    eligibility(): CreateOrderStateEligibility {
      return this.$store.getters['createOrder/eligibility']
    },
    deliveryDate(): CreateOrderStateDeliveryDate {
      return this.$store.getters['createOrder/deliveryDate/deliveryDate']
    },
    isDeliveryDateInvalid(): any {
      return this.$store.getters['createOrder/isDeliveryDateInvalid']
    },
    getMinDateForDatePicker(): string {
      return dateHelper.formatToTimezone(
        new Date(this.shippingDate.interval[0].end),
        'UTC',
        'yyyy-MM-dd',
      )
    },
    radioTypes(): Array<{ value: string; label: string }> {
      return Object.values(displayRadioType).map(value => ({
        value,
        label: this.$t(`page.order.delivery.types.${value}`),
      }))
    },
  },
  async mounted() {
    const blocks = Object.values(this.miscellaneous.checkout!.steps).reduce((acc, step, index) => {
      if (index === this.stepNumber - 1) {
        return [...acc, ...step]
      }

      return [...acc]
    }, [])

    setTimeout(
      () => {
        if (!this.isDayDisabled(CreateOrderServicePickingDayType.TODAY)) {
          this.selectedDay = CreateOrderServicePickingDayType.TODAY
        } else if (!this.isDayDisabled(CreateOrderServicePickingDayType.TOMORROW)) {
          this.selectedDay = CreateOrderServicePickingDayType.TOMORROW
        } else {
          this.selectedDay = CreateOrderServicePickingDayType.OTHER
          this.date = dateHelper.formatToTimezone(
            new Date(
              this.isEditing
                ? this.deliveryDate.interval[0].end
                : this.shippingDate.interval[0].end,
            ),
            'UTC',
            'yyyy-MM-dd',
          )
        }
        this.hasLoaded = true
      },
      blocks.includes(CHECKOUT_BLOCKS.SHIPPING_DATE) ? 1000 : 0,
    )
  },
  methods: {
    ...mapActions({
      filterEligibleCarriers: 'createOrder/filterEligibleCarriers',
    }),
    checkCutOff(day: string): CarrierEligibilityEntity[] {
      if (!this.eligibility.filteredCarriers.length) {
        return [{} as any]
      }
      return this.eligibility.filteredCarriers.filter(carrier => {
        if (carrier.deliveryCutOffs && carrier.deliveryCutOffs[`${day}`]) {
          let carrierDate = dateHelperSetUtcTime(new Date(), {
            hours: Number(carrier.deliveryCutOffs[`${day}`].hours),
            minutes: Number(carrier.deliveryCutOffs[`${day}`].minutes),
            seconds: 0,
            milliseconds: 0,
          })

          carrierDate = dateHelperGetUtcDate(
            carrierDate.toISOString(),
            carrier.deliveryCutOffs.timezone,
          )

          return dateHelper.isSameOrAfter(carrierDate, new Date(), OperationUnit.MINUTES)
        }
        return carrier
      })
    },
    getFilterredCarrierForSlots(): CarrierEligibilityEntity[] {
      const isToday = dateHelper.isSame(
        new Date(this.deliveryDate.interval[0].start),
        new Date(),
        OperationUnit.DAYS,
      )
      const isTomorrow = dateHelper.isSame(
        new Date(this.deliveryDate.interval[0].start),
        dateHelper.add(new Date(), { days: 1 }),
        OperationUnit.DAYS,
      )

      if (isToday) {
        return this.checkCutOff('sameDay')
      } else if (isTomorrow) {
        return this.checkCutOff('nextDay')
      }

      return this.eligibility.filteredCarriers
    },
    async getSlots(changeDisplay = true): Promise<void> {
      const totalCarrier = this.eligibility.filteredCarriers.length
      let totalError = 0
      const slots: DeliverySlot[] = []

      if (!totalCarrier) {
        this.typeToDisplay = displayType.DEFAULT
        return
      }

      const isToday = this.selectedDay === CreateOrderServicePickingDayType.TODAY

      const results = await Promise.all(
        this.getFilterredCarrierForSlots().map(async carrier => {
          try {
            let fromDate: string | Date = isToday
              ? this.initFromDate
              : dateHelper
                  .startOf(this.deliveryDate.interval[0].start, StartEndOf.DAY)!
                  .toISOString()

            let toDate: string | Date = dateHelper
              .endOf(
                dateHelper.format(
                 this.deliveryDate.interval[0].end,
                  'yyyy-MM-dd',
                ),
                StartEndOf.DAY,
              )!
              .toISOString()

            const { minDeliveryTime, deliveryNoticePeriod } = carrier
            let pickingStart = new Date(this.shippingDate.interval[0]?.start)
            const today = new Date()

            if (
              deliveryNoticePeriod &&
              deliveryNoticePeriod.value &&
              deliveryNoticePeriod.unit &&
              (!this.shippingDate.interval[0]?.start ||
                dateHelper.diff(pickingStart, today, deliveryNoticePeriod.unit as OperationUnit) <
                  deliveryNoticePeriod.value)
            ) {
              pickingStart = dateHelper.add(new Date(), {
                [deliveryNoticePeriod.unit]: deliveryNoticePeriod.value,
              })
            }

            if (
              dateHelper.isSameOrBefore(new Date(fromDate), pickingStart, OperationUnit.SECONDS) &&
              dateHelper.isSame(new Date(fromDate), pickingStart, OperationUnit.DAYS)
            ) {
              fromDate = pickingStart
            } else {
              fromDate = new Date(fromDate)
            }

            toDate = new Date(toDate)

            if (
              minDeliveryTime &&
              minDeliveryTime.value &&
              minDeliveryTime.unit &&
              dateHelper.diff(fromDate, pickingStart, minDeliveryTime.unit as OperationUnit) <
                minDeliveryTime.value
            ) {
              fromDate = dateHelper
                .add(pickingStart, { [minDeliveryTime.unit]: minDeliveryTime.value })
                .toISOString()
            }

            if (
              dateHelper.isAfter(pickingStart, fromDate) ||
              dateHelper.isAfter(pickingStart, toDate) ||
              dateHelper.isAfter(fromDate, toDate)
            ) {
              totalError++
              return { carrierId: 0, slots: [] }
            }

            const params: DeliverySlotsParams = {
              fromDate: typeof fromDate !== 'string' ? fromDate.toISOString() : fromDate,
              exchangePlaceId:
                typeof this.departure.exchangePlaceId === 'string'
                  ? parseInt(this.departure.exchangePlaceId, 10)
                  : this.departure.exchangePlaceId!,
              retailerId: this.senderIdentity.retailerId!,
              toDate: typeof toDate !== 'string' ? toDate.toISOString() : toDate,
              carrierId: carrier.Carrier.id,
              minRemainingCapacity: 1,
            }

            const deliverySlots = await DeliveryService.getSlots(params)

            return { carrierId: carrier.Carrier.id, slots: deliverySlots }
          } catch (e) {
            totalError++
            this.miscellaneous.carrierWithoutTypicalWeek.push(carrier.Carrier.id)
            return { carrierId: 0, slots: [] }
          }
        }),
      )

      for (const result of results) {
        for (const slot of result.slots) {
          const slotExist = slots.find(
            finalSlot => finalSlot.start === slot.start && finalSlot.end === slot.end,
          )

          if (!slotExist) {
            slots.push({ ...slot, carrierIds: [result.carrierId] })
          } else {
            slotExist.carrierIds!.push(result.carrierId)
          }
        }
      }

      slots.sort((a, b) => {
        if (new Date(a.start).getTime() === new Date(b.start).getTime()) {
          return new Date(a.end).getTime() - new Date(b.end).getTime()
        }

        return new Date(a.start).getTime() - new Date(b.start).getTime()
      })

      this.slots = slots

      if (changeDisplay) {
        if (!totalError) {
          this.typeToDisplay = displayType.SLOT
          // show Cas 1
        } else if (totalError < totalCarrier) {
          this.typeToDisplay = displayType.MIXED

          if (this.isEditing || (!this.isEditing && !this.isDeliveryDateInvalid)) {
            this.radioType = this.deliveryDate.interval[0].bookingId
              ? displayRadioType.CUSTOM
              : displayRadioType.DEFAULT
          } else {
            this.radioType = displayRadioType.CUSTOM
          }
          // show Cas 3 / affichagge 1
        } else {
          this.typeToDisplay = displayType.DEFAULT
          // show Cas 2
        }
      }
    },
    isDayDisabled(date: string): boolean {
      if (!this.shippingDate.interval?.length) {
        return false
      }

      if (date === CreateOrderServicePickingDayType.TODAY) {
        let isDisabled = dateHelper.isBefore(
          dateHelperSetUtcTime(new Date(), {
            hours: 23,
            minutes: 59,
            seconds: 59,
            milliseconds: 999,
          }),
          dateHelper.add(
            new Date(
              this.isEditing
                ? this.deliveryDate.interval[0].end
                : this.shippingDate.interval[0].end,
            ),
            {
              hours: 2,
            },
          ),
        )

        if (isDisabled && this.selectedDay !== CreateOrderServicePickingDayType.OTHER) {
          this.selectedDay = CreateOrderServicePickingDayType.TOMORROW
        }

        if (!isDisabled && !this.checkCutOff('sameDay').length) {
          isDisabled = true
        }

        return isDisabled
      } else if (date === CreateOrderServicePickingDayType.TOMORROW) {
        let isDisabled = dateHelper.isBefore(
          dateHelperSetUtcTime(dateHelper.add(new Date(), { days: 1 }), {
            hours: 23,
            minutes: 59,
            seconds: 59,
            milliseconds: 999,
          }),
          dateHelper.add(
            new Date(
              this.isEditing
                ? this.deliveryDate.interval[0].end
                : this.shippingDate.interval[0].end,
            ),
            {
              hours: 2,
            },
          ),
        )

        if (
          (isDisabled && this.selectedDay !== CreateOrderServicePickingDayType.OTHER) ||
          (this.shippingDate.interval[0] &&
            this.deliveryDate.interval[0] &&
            dateHelper.isAfter(
              this.shippingDate.interval[0].start,
              this.deliveryDate.interval[0].start,
            ))
        ) {
          this.selectedDay = CreateOrderServicePickingDayType.OTHER
          this.date = dateHelper.formatToTimezone(
            new Date(
              this.isEditing
                ? this.deliveryDate.interval[0].end
                : this.shippingDate.interval[0].end,
            ),
            'UTC',
            'yyyy-MM-dd',
          )
        }

        if (!isDisabled && !this.checkCutOff('nextDay').length) {
          isDisabled = true
        }

        return isDisabled
      }

      return false
    },
    async deleteBooking(): Promise<void> {
      try {
        if (this.deliveryDate.interval[0].bookingId) {
          await DeliveryService.deleteBooking(this.deliveryDate.interval[0].bookingId)
        }
      } catch (e) {
        // todo error message ? but cant do anything about it
      } finally {
        this.deliveryDate.interval[0].bookingId = ''
      }
    },
    modifyRangeSlots(event: number[]) {
      this.rangeSlots = event
    },
  },
  watch: {
    async selectedDay(next) {
      let start: Date | string = ''
      let end: Date | string = ''

      const pickingStart = new Date(this.shippingDate.interval[0]?.start)

      switch (next) {
        case CreateOrderServicePickingDayType.TODAY:
          if (
            dateHelper.isSameOrBefore(new Date(), pickingStart, OperationUnit.SECONDS) &&
            dateHelper.isSame(new Date(), pickingStart, OperationUnit.DAYS)
          ) {
            start = pickingStart
            end = new Date(this.shippingDate.interval[0]?.end)
          } else {
            start = new Date()
            end = new Date()
          }
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

      if (!this.deliveryDate.interval.length) {
        this.deliveryDate.interval.push({
          start:
            typeof this.date === 'string'
              ? new Date(start).toISOString()
              : (start as Date).toISOString(),
          end:
            typeof this.date === 'string'
              ? new Date(end).toISOString()
              : (end as Date).toISOString(),
          bookingId: '',
        })
      } else {
        const intervalStartDate = new Date(this.deliveryDate.interval[0].start)
        const intervalEndDate = new Date(this.deliveryDate.interval[0].end)

        this.deliveryDate.interval[0].start = dateHelperSetUtcTime(new Date(start), {
          hours: parseInt(formatTime(intervalStartDate.getUTCHours().toString()), 10),
          minutes: parseInt(formatTime(intervalStartDate.getUTCMinutes().toString()), 10),
          seconds: parseInt(formatTime(intervalStartDate.getUTCSeconds().toString()), 10),
          milliseconds: parseInt(formatTime(intervalStartDate.getUTCMilliseconds().toString()), 10),
        }).toISOString()

        this.deliveryDate.interval[0].end = dateHelperSetUtcTime(new Date(end), {
          hours: parseInt(formatTime(intervalEndDate.getUTCHours().toString()), 10),
          minutes: parseInt(formatTime(intervalEndDate.getUTCMinutes().toString()), 10),
          seconds: parseInt(formatTime(intervalEndDate.getUTCSeconds().toString()), 10),
          milliseconds: parseInt(formatTime(intervalEndDate.getUTCMilliseconds().toString()), 10),
        }).toISOString()
      }

      if (this.deliveryDate.interval[0].bookingId) {
        this.deleteBooking()
      }

      this.filterEligibleCarriers({
        stepNumber: parseInt(this.$route.query.stepNumber as string, 10),
      })
    },
    async date(next) {
      const nextDate = new Date(next)
      const intervalStartDate = new Date(this.deliveryDate.interval[0].start)
      const intervalEndDate = new Date(this.deliveryDate.interval[0].end)

      const date = {
        years: nextDate.getUTCFullYear(),
        months: nextDate.getUTCMonth(),
        days: nextDate.getUTCDate(),
      }

      this.deliveryDate.interval[0].start = dateHelperSetUtcTime(
        intervalStartDate,
        {
          hours: parseInt(formatTime(intervalStartDate.getUTCHours().toString()), 10),
          minutes: parseInt(formatTime(intervalStartDate.getUTCMinutes().toString()), 10),
          seconds: parseInt(formatTime(intervalStartDate.getUTCSeconds().toString()), 10),
          milliseconds: parseInt(formatTime(intervalStartDate.getMilliseconds().toString()), 10),
        },
        { ...date },
      ).toISOString()

      this.deliveryDate.interval[0].end = dateHelperSetUtcTime(
        intervalEndDate,
        {
          hours: parseInt(formatTime(intervalEndDate.getUTCHours().toString()), 10),
          minutes: parseInt(formatTime(intervalEndDate.getUTCMinutes().toString()), 10),
          seconds: parseInt(formatTime(intervalEndDate.getUTCSeconds().toString()), 10),
          milliseconds: parseInt(formatTime(intervalEndDate.getMilliseconds().toString()), 10),
        },
        { ...date },
      ).toISOString()

      if (this.deliveryDate.interval[0].bookingId) {
        this.deleteBooking()
      }

      this.filterEligibleCarriers({
        stepNumber: parseInt(this.$route.query.stepNumber as string, 10),
      })
    },
    'eligibility.filteredCarriers'() {
      this.getSlots()
    },
    typeToDisplay(next) {
      this.miscellaneous.deliveryDateTypeToDisplay = next
    },
    radioType(next) {
      if (next === 'default') {
        this.hasTypeChanged = true
        this.deleteBooking()
        this.hasTypeChanged = false
      }
      this.miscellaneous.deliveryTypeRadioType = next
      this.miscellaneous.selectedCarrierIds = []
      this.miscellaneous.carrierWithoutTypicalWeek = []
      this.getSlots(false)
    },
  },
})
</script>

<style lang="scss" scoped>
@import '../../../../styles/mixins/macScrollbar';

#create-order-delivery-date {
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
