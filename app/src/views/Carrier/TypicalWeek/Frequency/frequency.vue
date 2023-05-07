<template>
  <div>
    <h2 :class="$vuetify.breakpoint.xsOnly ? 'mt-8' : 'mt-6'">
      {{ $t('page.typicalWeek.frequency.slotDuration') }}
    </h2>

    <div class="frequency-selector-wrapper align-center mt-5">
      <div
        v-for="(frequency, index) in frequencyAvailable"
        :key="`frequency-${index}`"
        :class="
          `frequency-selector${index === frequencyAvailable.length - 1 ? ' last' : ''}${
            frequency === value.type ? ' selected' : ''
          }`
        "
        @click="frequency !== value.type && changeFrequency(frequency)"
      >
        <span class="regular16">{{ $t(`page.typicalWeek.frequency.${frequency}`) }}</span>
      </div>
    </div>
    <mp-dialog-confirmation
      v-if="showWarningModal"
      classWrapper="typical-week-frequency-warning"
      dataId="typicalWeek-frequency-warningDialog"
      :textContent="$t('page.typicalWeek.frequency.warning')"
      @close="showWarningModal = false"
      @submit="sendFrequency()"
      color="error"
      :header="{
        icon: 'mdi-exclamation-thick',
        isColorBackground: false,
        iconClose: 'mdi-close',
      }"
      :btnCancel="{ text: $t('action.cancel.base'), format: 'link', linkColor: 'black' }"
      :btnValidation="{
        text: $t('page.typicalWeek.frequency.changeSlot'),
        format: 'error',
      }"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import { FrequencyAvailableNew, TypicalWeekFrequencyNew } from '@/types'

export default Vue.extend({
  name: 'mp-frequency-new',
  props: {
    value: {
      type: Object as () => TypicalWeekFrequencyNew,
      required: true,
    },
    hasWarning: {
      type: Boolean,
      required: true,
    },
    frequencyAvailable: {
      type: Array as () => string[],
      default: () => {
        return Object.values(FrequencyAvailableNew)
      },
    },
    showDays: {
      type: Boolean,
      default: true,
    },
  },
  data: () => ({
    showWarningModal: false,
    saveFrequency: '',
  }),
  computed: {
    planning() {
      return JSON.parse(JSON.stringify(this.value.planning))
    },
  },
  methods: {
    changeFrequency(frequency: string) {
      if (this.hasWarning) {
        this.showWarningModal = true
        this.saveFrequency = frequency
      } else {
        this.sendFrequency(frequency)
      }
    },
    sendFrequency(frequency: string) {
      if (!frequency) {
        this.$emit('input', { type: this.saveFrequency, planning: {} })
        this.saveFrequency = ''
        this.showWarningModal = false
      } else {
        this.$emit('input', { type: frequency, planning: {} })
      }
    },
  },
})
</script>

<style lang="scss">
.frequency-selector-wrapper {
  display: flex;
  margin-top: 1.6rem;
  flex-wrap: wrap;
  margin-bottom: 2rem;

  .frequency-selector {
    text-align: center;
    min-width: 14.8rem;
    max-width: 14.8rem;
    min-height: 7rem;
    max-height: 7rem;
    border: 0.1rem solid $main-lighten-65-color;
    border-radius: 0.4rem;
    cursor: pointer;
    margin-top: 1rem;
    margin-right: 2.1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 0.5rem;

    @media #{map-get($display-breakpoints, 'xs-only')} {
      margin-right: 0;

      &:nth-child(odd) {
        margin-left: 0;
      }
    }

    &.selected {
      border: 0.2rem solid $main-color;
    }

    &.last {
      margin-right: 0;
    }
  }

  @media #{map-get($display-breakpoints, 'xs-only')} {
    justify-content: space-around;

    .btn-custom {
      margin-top: 1rem;
      padding: 0 !important;
      min-width: 14.8rem !important;
    }
  }
}

.typical-week-frequency-warning {
  .actions-wrapper {
    flex-direction: column !important;
    align-items: center;

    .mp-button--error {
      margin-bottom: 1rem;
      width: fit-content;
    }
  }
}
</style>
