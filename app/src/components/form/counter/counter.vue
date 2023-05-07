<template>
  <div class="counter-outer-wrapper">
    <div class="mb-2" v-if="title">
      <span class="regular12 main-lighten-52">
        {{ title }}
      </span>
    </div>
    <div class="counter-wrapper">
      <div class="counter-button" @click="handleMinus()">
        <v-icon size="1.6rem">mdi-minus</v-icon>
      </div>
      <div class="mx-3 d-flex">
        <v-text-field
          :data-id="dataId"
          hide-details
          class="input-counter"
          :style="{
            'max-width': `${typeof value !== 'string' ? value.toString().length : value.length}rem`,
          }"
          :value="value"
          type="number"
          @input="$emit('input', $event ? parseInt($event, 10) : minValue ? minValue : 0)"
        />
      </div>
      <div class="counter-button" @click="handlePlus()">
        <v-icon size="1.6rem">mdi-plus</v-icon>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
/* eslint vue/require-default-prop: off */
import { SnackBarType } from '@/store/types'
import Vue from 'vue'

export default Vue.extend({
  name: 'mp-counter',
  props: {
    value: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    dataId: {
      type: String,
      required: true,
    },
    minValue: {
      type: Number,
    },
    maxValue: {
      type: Number,
    },
    minMessage: {
      type: String,
      default: 'common.minValue',
    },
    maxMessage: {
      type: String,
      default: 'common.maxValue',
    },
  },
  methods: {
    handleMinus(): void {
      if ((!this.minValue && this.minValue !== 0) || this.value > this.minValue) {
        this.$emit('input', this.value - 1)
        return
      }

      this.$store.dispatch('setSnackbar', {
        type: SnackBarType.ERROR,
        message: this.$t(this.minMessage, { minValue: this.minValue }),
      })
    },
    handlePlus(): void {
      if ((!this.maxValue && this.maxValue !== 0) || this.value < this.maxValue) {
        this.$emit('input', this.value + 1)
        return
      }

      this.$store.dispatch('setSnackbar', {
        type: SnackBarType.ERROR,
        message: this.$t(this.maxMessage, { minValue: this.maxValue }),
      })
    },
  },
})
</script>

<style lang="scss">
.counter-outer-wrapper {
  .counter-wrapper {
    border: 0.1rem solid $main-lighten-65-color;
    border-radius: 5rem;
    width: max-content;
    display: flex;
    align-items: center;
    min-height: 4rem;
    max-height: 4rem;

    .counter-button {
      border-radius: 50%;
      background-color: $main-color;
      min-height: 2.8rem;
      max-height: 2.8rem;
      min-width: 2.8rem;
      max-width: 2.8rem;
      margin-left: 0.6rem;
      margin-right: 0.6rem;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;

      i {
        color: $white;
      }
    }

    .input-counter {
      caret-color: $main-color !important;

      .v-input__slot {
        margin-bottom: 0 !important;

        &::after {
          border: none !important;
        }

        &::before {
          border: none !important;
        }

        .v-text-field__slot {
          input {
            padding: 0 !important;
          }

          input::-webkit-outer-spin-button,
          input::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
          }

          input[type='number'] {
            -moz-appearance: textfield;
          }
        }
      }
    }
  }
}
</style>
