<template>
  <div>
    <h2 :class="$vuetify.breakpoint.xsOnly ? 'mt-8' : 'mt-6'">
      {{ $t(title) }}
    </h2>

    <div class="frequency-selector-wrapper align-center mt-5">
      <div
        v-for="(frequency, index) in filteredFrequencyAvailable"
        :key="`frequency-${index}`"
        :class="
          `frequency-selector${index === filteredFrequencyAvailable.length - 1 ? ' last' : ''}${
            frequency === value.type ? ' selected' : ''
          }`
        "
        @click="frequency !== value.type && changeFrequency(frequency)"
      >
        <span class="regular16">{{ $t(`page.typicalWeek.frequency.${frequency}`) }}</span>
      </div>

      <mp-button
        format="link"
        linkColor="black"
        :text="
          isModify
            ? $t('page.typicalWeek.frequency.modifyPersonalize')
            : $t('page.typicalWeek.frequency.personalize')
        "
        icon="pencil"
        dataId="typicalWeek-frequency-custom"
        @click="changeFrequency(value, true)"
        class="btn-custom"
        v-if="hasCustom"
      />
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

    <mp-dialog-frequency-custom
      v-if="showCustomModal"
      :showDialog="showCustomModal"
      :openingHours="planning"
      :isModify="isModify"
      :showDays="showDays"
      :timezone="timezone"
      :showTimezonedDate="true"
      @hide="showCustomModal = false"
      @save="customPlanning($event)"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import mpDialogFrequencyCustom from '@/views/TypicalWeek/dialog/custom/custom.vue'
import ExchangePlaceMapper from '@/services/exchangePlace/ExchangePlaceMapper'
import { FrequencyAvailable, OpeningHours, TypicalWeekFrequency } from '@/types'

export default Vue.extend({
  name: 'mp-frequency',
  components: {
    mpDialogFrequencyCustom,
  },
  props: {
    value: {
      type: Object as () => TypicalWeekFrequency,
      required: true,
    },
    hasWarning: {
      type: Boolean,
      required: true,
    },
    frequencyAvailable: {
      type: Array as () => string[],
      default: () => {
        return Object.values(FrequencyAvailable)
      },
    },
    showDays: {
      type: Boolean,
      default: true,
    },
    timezone: {
      type: String,
      required: true,
    },
    showTimezonedDate: {
      type: Boolean,
      default: true,
    },
    hasCustom: {
      type: Boolean,
      default: true,
    },
    title: {
      type: String,
      default: 'page.typicalWeek.frequency.title',
    },
  },
  data: () => ({
    showWarningModal: false,
    saveFrequency: '',
    showCustomModal: false,
    saveIsCustom: false,
  }),
  computed: {
    filteredFrequencyAvailable() {
      return this.value.type === FrequencyAvailable.CUSTOM
        ? this.frequencyAvailable
        : this.frequencyAvailable.filter(frequency => frequency !== FrequencyAvailable.CUSTOM)
    },
    isModify() {
      const isModify = JSON.parse(
        JSON.stringify(
          Boolean(
            this.filteredFrequencyAvailable.find(
              filteredFrequency => filteredFrequency === FrequencyAvailable.CUSTOM,
            ),
          ),
        ),
      )

      return isModify
    },
    planning() {
      return JSON.parse(JSON.stringify(this.value.planning))
    },
  },
  methods: {
    changeFrequency(frequency: string, isCustom = false) {
      if (this.hasWarning) {
        this.showWarningModal = true
        this.saveFrequency = frequency
        this.saveIsCustom = isCustom
      } else {
        if (isCustom) {
          this.showCustomModal = true
        } else if (frequency !== FrequencyAvailable.CUSTOM) {
          this.sendFrequency(frequency)
        }
      }
    },
    sendFrequency(frequency: string) {
      if (!frequency) {
        if (this.saveIsCustom) {
          this.saveIsCustom = false
          this.showCustomModal = true
        } else {
          this.$emit('input', { type: this.saveFrequency, planning: {} })
        }
        this.saveFrequency = ''
        this.showWarningModal = false
      } else {
        this.$emit('input', { type: frequency, planning: {} })
      }
    },
    customPlanning(planning: OpeningHours) {
      this.showCustomModal = false

      // Save Hour as UTC
      this.$emit('input', {
        type: FrequencyAvailable.CUSTOM,
        planning: this.showTimezonedDate
          ? ExchangePlaceMapper.hourToUtc(planning, this.timezone)
          : planning,
      })
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
