<template>
  <v-row no-gutters id="create-order-delivery-date-slots" v-if="slots.length">
    <!-- Slider range-->
    <v-col cols="12" v-if="range && range.length">
      <mp-slider-range
        :min="getSliderMinRange"
        :max="getSliderMaxRange"
        v-model="range"
        @change="$emit('modify-range-slots', $event)"
        isHours
      />
    </v-col>

    <!-- Frequency -->
    <v-col cols="12" v-if="getFrequencyAvailableNew.length > 1" class="my-7">
      <span class="italic12 main-lighten-52">{{ $t('page.order.delivery.filter') }}</span>
      <div class="filter-wrapper">
        <div
          v-for="(frequency, index) in getFrequencyAvailableNew"
          :key="`filters-${index}`"
          :class="`filter-block${selectedFilter === frequency ? ' selected' : ''}`"
          @click="selectFilter(frequency)"
        >
          <span class="regular16 main-lighten-28">
            {{ $t(`page.order.delivery.frequency.${frequency}`) }}
          </span>
        </div>
      </div>
    </v-col>

    <!-- Slots -->
    <v-col cols="12" class="mt-5 slots-wrapper">
      <div
        v-for="(slot, index) in filteredSlots"
        :key="`slots-${index}`"
        :class="
          `slot${
            selectedSlot &&
            slot &&
            selectedSlot.start === slot.start &&
            selectedSlot.end === slot.end
              ? ' selected'
              : ''
          }`
        "
        @click="selectSlot(slot)"
      >
        <span class="regular16">{{ getSlotDisplay(slot) }}</span>
      </div>
    </v-col>
  </v-row>
  <v-row v-else>
    <no-data dataId="create-order-delivery-date-no-slots" :content="$t('common.noData.slots')" />
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'
import { CreateOrderStateDeliveryDate } from '@/store/modules/createOrder/deliveryDate/types'
import {
  DeliverySlot,
  FrequencyAvailableNew,
  DeliverySlotsCreateBooking,
} from '@/types'
import { Duration } from 'date-fns'
import {
  dateHelper,
  dateHelperHours,
  dateHelperFormatToTimezone,
  dateHelperSetUtcTime,
  formatTime,
  dateHelperGetUtcDate,
} from '@/helpers/dateHelper'
import DeliveryService from '@/services/delivery/DeliveryService'
import { CreateOrderStateMiscellaneous } from '@/store/modules/createOrder/types'
import noData from '@/components/noData/noData.vue'
import { SnackBarType } from '@/store/types'
import { CreateOrderStateDeparture } from '@/store/modules/createOrder/departure/types'
import { CreateOrderStateSenderIdentity } from '@/store/modules/createOrder/senderIdentity/types'

export default Vue.extend({
  name: 'order-create-deliveryDate-slots',
  components: {
    noData,
  },
  props: {
    slots: {
      type: Array as () => DeliverySlot[],
      required: true,
    },
    selectedDay: {
      type: String,
      required: true,
    },
    isEditing: {
      type: Boolean,
      required: true,
    },
    rangeSlots: {
      type: Array as () => number[],
      default: () => [],
    },
    hasTypeChanged: {
      type: Boolean,
      required: true,
    }
  },
  data: () => ({
    range: [] as number[],
    selectedFilter: '',
    selectedSlot: null as DeliverySlot | null,
    doSelectedSlotWatcher: true,
  }),
  computed: {
    departure(): CreateOrderStateDeparture {
      return this.$store.getters['createOrder/departure/departure']
    },
    senderIdentity(): CreateOrderStateSenderIdentity {
      return this.$store.getters['createOrder/senderIdentity/senderIdentity']
    },
    miscellaneous(): CreateOrderStateMiscellaneous {
      return this.$store.getters['createOrder/miscellaneous']
    },
    deliveryDate(): CreateOrderStateDeliveryDate {
      return this.$store.getters['createOrder/deliveryDate/deliveryDate']
    },
    isDeliveryDateInvalid(): any {
      return this.$store.getters['createOrder/isDeliveryDateInvalid']
    },
    getSliderMinRange(): number {
      if (!this.slots?.length) {
        return 0
      }

      return new Date(this.slots[0].start).getHours()
    },
    getSliderMaxRange(): number {
      if (!this.slots?.length) {
        return 24
      }

      let maxHour = 0

      for (const slot of this.slots) {
        const localMaxHour = new Date(slot.end).getHours()

        if (localMaxHour > maxHour) {
          maxHour = localMaxHour
        }
      }

      if (!maxHour) {
        maxHour = 24
      }

      return maxHour
    },
    getFrequencyAvailableNew(): string[] {
      const frequencyAvailable = []

      const hasOneHour = this.slots.some(slot =>
        dateHelper.isSame(dateHelper.add(new Date(slot.start), { hours: 1 }), new Date(slot.end)),
      )

      if (hasOneHour) {
        frequencyAvailable.push(FrequencyAvailableNew.HOUR)
      }

      const hasTwoHour = this.slots.some(slot =>
        dateHelper.isSame(dateHelper.add(new Date(slot.start), { hours: 2 }), new Date(slot.end)),
      )

      if (hasTwoHour) {
        frequencyAvailable.push(FrequencyAvailableNew.TWO_HOURS)
      }

      const hasThreeHour = this.slots.some(slot =>
        dateHelper.isSame(dateHelper.add(new Date(slot.start), { hours: 3 }), new Date(slot.end)),
      )

      if (hasThreeHour) {
        frequencyAvailable.push(FrequencyAvailableNew.THREE_HOURS)
      }

      const hasFourHour = this.slots.some(slot =>
        dateHelper.isSame(dateHelper.add(new Date(slot.start), { hours: 4 }), new Date(slot.end)),
      )

      if (hasFourHour) {
        frequencyAvailable.push(FrequencyAvailableNew.FOUR_HOURS)
      }

      return frequencyAvailable
    },
    filteredSlots(): DeliverySlot[] {
      if (!this.slots?.length) {
        return []
      }
      const tmpSlots = this.slots.filter(
        slot =>
          parseInt(dateHelperHours(new Date(slot.start)), 10) >= this.range[0] &&
          parseInt(dateHelperHours(new Date(slot.end)), 10) <= this.range[1],
      )

      if (this.selectedFilter) {
        let duration: Duration | null = null
        switch (this.selectedFilter) {
          case FrequencyAvailableNew.DEMI:
            duration = { minutes: 30 }
            break
          case FrequencyAvailableNew.HOUR:
            duration = { hours: 1 }
            break
          case FrequencyAvailableNew.TWO_HOURS:
            duration = { hours: 2 }
            break
          case FrequencyAvailableNew.THREE_HOURS:
            duration = { hours: 3 }
            break
          case FrequencyAvailableNew.FOUR_HOURS:
            duration = { hours: 4 }
            break
        }

        return tmpSlots.filter(slot =>
          dateHelper.isSame(dateHelper.add(new Date(slot.start), duration!), new Date(slot.end)),
        )
      }

      return tmpSlots
    },
  },
  mounted() {
    this.range = [this.getSliderMinRange, this.getSliderMaxRange]

    if (this.isEditing || (!this.isEditing && !this.isDeliveryDateInvalid)) {
      const beginHour = dateHelperGetUtcDate(this.deliveryDate.interval[0].start).getHours()
      const beginMinute = dateHelperGetUtcDate(this.deliveryDate.interval[0].start).getMinutes()
      const endHour = dateHelperGetUtcDate(this.deliveryDate.interval[0].end).getHours()
      const EndMinute = dateHelperGetUtcDate(this.deliveryDate.interval[0].end).getMinutes()

      for (const slot of this.slots) {
        const slotBeginHour = dateHelperGetUtcDate(slot.start).getHours()
        const slotBeginMinute = dateHelperGetUtcDate(slot.start).getMinutes()
        const slotEndHour = dateHelperGetUtcDate(slot.end).getHours()
        const slotEndMinute = dateHelperGetUtcDate(slot.end).getMinutes()

        if (
          beginHour === slotBeginHour &&
          beginMinute === slotBeginMinute &&
          endHour === slotEndHour &&
          EndMinute === slotEndMinute
        ) {
          this.doSelectedSlotWatcher = false
          this.selectSlot(slot)
          this.$nextTick(() => {
            this.doSelectedSlotWatcher = true
          })
          break
        }
      }
      return
    }
  },
  methods: {
    selectFilter(frequency: string): void {
      if (this.selectedFilter && this.selectedFilter === frequency) {
        this.selectedFilter = ''
        return
      }

      this.selectedFilter = frequency
    },
    selectSlot(slot: DeliverySlot): void {
      if (
        this.selectedSlot &&
        this.selectedSlot.start === slot.start &&
        this.selectedSlot.end === slot.end
      ) {
        this.selectedSlot = null
        return
      }

      this.selectedSlot = slot
    },
    getSlotDisplay(slot: DeliverySlot): string {
      return `${dateHelperFormatToTimezone(slot.start, 'p')} - ${dateHelperFormatToTimezone(
        slot.end,
        'p',
      )}`
    },
  },
  watch: {
    async selectedSlot(next: DeliverySlot, previous: DeliverySlot) {
      if (!this.doSelectedSlotWatcher) {
        return
      }

      let selectedCarrierIds: number[] = []

      // Delete previous booking
      if (!next || previous?.carrierIds?.length) {
        this.$emit('deleteBooking')
      }

      // create new booking
      if (next?.carrierIds?.length) {
        try {
          const payload: DeliverySlotsCreateBooking = {
            slot: { start: next.start, end: next.end },
            exchangePlaceId:
              typeof this.departure.exchangePlaceId === 'string'
                ? parseInt(this.departure.exchangePlaceId, 10)
                : this.departure.exchangePlaceId!,
            retailerId: this.senderIdentity.retailerId!,
            carrierIds: next.carrierIds.filter(carrierId => carrierId),
          }

          if (payload.carrierIds?.length) {
            const { bookingId } = await DeliveryService.createBooking(payload)

            this.deliveryDate.interval[0].bookingId = bookingId

            selectedCarrierIds = next.carrierIds
          }
        } catch (e) {
          if (e.response?.status === 409) {
            this.$store.dispatch('setSnackbar', {
              type: SnackBarType.ERROR,
              message: this.$t('page.order.delivery.noAvailableSlot'),
            })
          }
        }
      }

      this.miscellaneous.selectedCarrierIds = selectedCarrierIds

      if (next) {
        this.deliveryDate.interval[0].start = dateHelperSetUtcTime(
          new Date(this.deliveryDate.interval[0].start),
          {
            hours: parseInt(formatTime(new Date(next.start).getUTCHours().toString()), 10),
            minutes: parseInt(formatTime(new Date(next.start).getUTCMinutes().toString()), 10),
            seconds: 0,
            milliseconds: 0,
          },
        ).toISOString()

        this.deliveryDate.interval[0].end = dateHelperSetUtcTime(
          new Date(this.deliveryDate.interval[0].end),
          {
            hours: parseInt(formatTime(new Date(next.end).getUTCHours().toString()), 10),
            minutes: parseInt(formatTime(new Date(next.end).getUTCMinutes().toString()), 10),
            seconds: 0,
            milliseconds: 0,
          },
        ).toISOString()
      }
    },
    slots(next) {
      this.selectedFilter = ''
      if (!next?.length) {
        this.range = [0, 24]
        return
      }

      this.range = [this.getSliderMinRange, this.getSliderMaxRange]
    },
    hasTypeChanged(next) {
      if (next) {
        this.selectedSlot = null
      }
    }
  },
})
</script>

<style lang="scss" scoped>
#create-order-delivery-date-slots {
  @import '../../../../styles/mixins/macScrollbar';

  .filter-wrapper {
    display: flex;
    flex-wrap: wrap;
    column-gap: 1rem;
    row-gap: 1rem;

    .filter-block {
      border: 0.1rem solid $main-lighten-65-color;

      cursor: pointer;
      padding: 1rem 2rem 1rem 2rem;
      margin: 0.1rem;
      margin-top: 1.1rem;
      border-radius: 0.4rem;

      &.selected {
        border: 0.2rem solid $main-color;
        margin: 0;
        margin-top: 1rem;
      }
    }
  }

  .slots-wrapper {
    display: flex;
    flex-wrap: wrap;
    column-gap: 1rem;
    row-gap: 1rem;

    overflow-y: auto;
    max-height: calc(6rem * 5 + 1rem * 5);
    @include setMacScrollbar('&');

    .slot {
      display: flex;
      justify-content: center;
      align-items: center;

      min-width: 14rem;
      max-width: 14rem;
      min-height: 6rem;
      max-height: 6rem;
      border: 0.1rem solid $main-lighten-65-color;
      border-radius: 0.4rem;

      cursor: pointer;

      &.selected {
        border: 0.2rem solid $main-color;
      }
    }
  }
}
</style>
