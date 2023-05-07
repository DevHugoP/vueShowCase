<template>
  <v-row no-gutters id="carrier-create-typical-week-frequency">
    <v-col cols="12">
      <h2 class="mb-10">{{ $t('common.slots') }}</h2>

      <h4>{{ $t('page.typicalWeek.frequency.slotDuration') }}</h4>

      <div class="frequency-wrapper">
        <div
          v-for="localFrequency in frequencyAvailable"
          :key="localFrequency"
          :class="`frequency${localFrequency === frequency ? ' selected' : ''}`"
          @click="$emit('update:frequency', localFrequency)"
        >
          <span class="regular16">{{ $t(`page.typicalWeek.frequency.${localFrequency}`) }}</span>
        </div>
      </div>

      <div class="sub-frequency-wrapper" v-if="frequency !== CarrierFrequencyAvailable.CUSTOM">
        <h4>{{ $t('page.typicalWeek.frequency.title') }}</h4>

        <mp-radio-group
          class="sub-frequency-radio-group"
          row
          dataId="carrier-create-typical-week-frequency-subFrequency"
          :value="subFrequency"
          @input="$emit('update:subFrequency', $event)"
          :errors="[]"
          :radioValues="subFrequencyAvailable"
        />
      </div>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'

import { CarrierFrequencyAvailable, SubFrequencyAvailable } from '@/types'

export default Vue.extend({
  name: 'carrier-typical-week-create-frequency',
  props: {
    frequency: {
      type: String,
      required: true,
    },
    subFrequency: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    CarrierFrequencyAvailable,
    firstTimeWatcher: true,
  }),
  computed: {
    frequencyAvailable(): CarrierFrequencyAvailable[] {
      return Object.values(CarrierFrequencyAvailable)
    },
    subFrequencyAvailable(): Array<{ label: string; value: string }> {
      const subFrequency = [
        {
          label: this.$t(`page.typicalWeek.frequency.${SubFrequencyAvailable.ONE_HOUR}`),
          value: SubFrequencyAvailable.ONE_HOUR,
        },
        {
          label: this.$t(`page.typicalWeek.frequency.${SubFrequencyAvailable.HALF_HOUR}`),
          value: SubFrequencyAvailable.HALF_HOUR,
        },
        {
          label: this.$t(`page.typicalWeek.frequency.${SubFrequencyAvailable.QUARTER_HOUR}`),
          value: SubFrequencyAvailable.QUARTER_HOUR,
        },
      ]

      if (this.frequency === CarrierFrequencyAvailable.FOUR_HOUR) {
        subFrequency.unshift({
          label: this.$t(`page.typicalWeek.frequency.${SubFrequencyAvailable.TWO_HOUR}`),
          value: SubFrequencyAvailable.TWO_HOUR,
        })
        subFrequency.unshift({
          label: this.$t(`page.typicalWeek.frequency.${SubFrequencyAvailable.THREE_HOUR}`),
          value: SubFrequencyAvailable.THREE_HOUR,
        })
        subFrequency.unshift({
          label: this.$t(`page.typicalWeek.frequency.${SubFrequencyAvailable.FOUR_HOUR}`),
          value: SubFrequencyAvailable.FOUR_HOUR,
        })
      } else if (this.frequency === CarrierFrequencyAvailable.THREE_HOUR) {
        subFrequency.unshift({
          label: this.$t(`page.typicalWeek.frequency.${SubFrequencyAvailable.TWO_HOUR}`),
          value: SubFrequencyAvailable.TWO_HOUR,
        })
        subFrequency.unshift({
          label: this.$t(`page.typicalWeek.frequency.${SubFrequencyAvailable.THREE_HOUR}`),
          value: SubFrequencyAvailable.THREE_HOUR,
        })
      } else if (this.frequency === CarrierFrequencyAvailable.TWO_HOUR) {
        subFrequency.unshift({
          label: this.$t(`page.typicalWeek.frequency.${SubFrequencyAvailable.TWO_HOUR}`),
          value: SubFrequencyAvailable.TWO_HOUR,
        })
      }

      return subFrequency
    },
  },
  watch: {
    frequency(next) {
      if (next !== CarrierFrequencyAvailable.CUSTOM) {
        this.$emit('update:subFrequency', next)
        return
      }

      this.$emit('update:subFrequency', '')
    },
  },
})
</script>

<style lang="scss">
#carrier-create-typical-week-frequency {
  .frequency-wrapper {
    display: flex;
    gap: 2rem;
    margin-top: 1.4rem;

    .frequency {
      border: 0.1rem solid $main-lighten-65-color;
      border-radius: 0.4rem;
      cursor: pointer;
      min-height: 7.2rem;
      max-height: 7.2rem;
      min-width: 14.7rem;
      max-width: 14.7rem;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;

      &.selected {
        border: 0.2rem solid $main-color;
      }
    }
  }

  .sub-frequency-wrapper {
    margin-top: 1.4rem;

    .sub-frequency-radio-group {
      margin-top: 1.7rem !important;

      label {
        color: $main-color;
      }

      .v-icon {
        color: $main-lighten-52-color;
      }
    }
  }
}
</style>
