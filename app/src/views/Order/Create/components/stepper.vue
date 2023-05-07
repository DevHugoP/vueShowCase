<template>
  <div no-gutters class="stepper-wrapper">
    <div
      v-for="(step, index) in numberOfStep"
      :key="`steps-${index + 1}`"
      :class="`step-wrapper${index === numberOfStep - 1 ? ' last-step-wrapper' : ''}`"
    >
      <span
        v-if="index + 1 >= stepNumber && isCurrentStepInvalid(index + 1)"
        :class="`medium14 step${index + 1 === stepNumber ? ' current-step' : ''}`"
      >
        {{ index + 1 }}
      </span>
      <div v-else @click="$emit('goToStep', index + 1)" class="valid-step-wrapper">
        <span :class="`step${stepNumber > index + 1 ? ' previous-step' : ''} `">
          <v-icon v-if="stepNumber > index + 1" size="1.6rem">mdi-check-bold</v-icon>
          <span
            v-else
            :class="`medium14 step${index + 1 === stepNumber ? ' current-step' : ' next-step'}`"
          >
            {{ index + 1 }}
          </span>
        </span>
      </div>
      <div class="separator" v-if="index + 1 < numberOfStep" />
    </div>
  </div>
</template>

<script lang="ts">
import { CHECKOUT_BLOCKS, Checkout } from '@/types'
import { Steps } from '@/views/customCheckout/customCheckout.vue'
import Vue from 'vue'
import { blockNameBackToblockNameFront } from '../create.vue'

export default Vue.extend({
  name: 'create-order-stepper',
  props: {
    stepNumber: {
      type: Number,
      required: true,
    },
    isEditing: {
      type: Boolean,
      required: true,
    },
    checkout: {
      type: Object as () => Checkout,
      default: () => {
        return {} as Checkout
      },
    },
  },
  data: () => ({
    numberOfStep: 5,
  }),
  methods: {
    isCurrentStepInvalid(stepNumber: number) {
      if (!this.checkout) {
        return true
      }

      let invalidStep = false

      for (const block of this.checkout.steps[`step${stepNumber}` as keyof Steps]) {
        let invalidBlock = false
        switch (block) {
          case CHECKOUT_BLOCKS.ORDER_CONTENT:
            invalidBlock =
              this.$store.getters[
                `createOrder/${
                  (blockNameBackToblockNameFront as any)[CHECKOUT_BLOCKS.ORDER_CONTENT]
                }/$v`
              ].$invalid ||
              this.$store.getters[
                `createOrder/${
                  (blockNameBackToblockNameFront as any)[CHECKOUT_BLOCKS.ORDER_CONTENT]
                }/isPackagesInvalid`
              ]
            break
          case CHECKOUT_BLOCKS.SERVICES:
            invalidBlock = this.$store.getters[`createOrder/isServiceInvalid`]
            break
          case CHECKOUT_BLOCKS.DELIVERY_DATE:
            invalidBlock = this.$store.getters[`createOrder/isDeliveryDateInvalid`]
            break
          case CHECKOUT_BLOCKS.PICKUP_POINT:
            invalidBlock = this.$store.getters[`createOrder/isPickupPointInvalid`]
            break
          case CHECKOUT_BLOCKS.TICKET_CONTENT:
            invalidBlock = this.$store.getters[`createOrder/isTicketContentInvalid`]
            break
          default:
            invalidBlock = this.$store.getters[
              `createOrder/${(blockNameBackToblockNameFront as any)[block]}/$v`
            ].$invalid
        }

        if (invalidBlock) {
          invalidStep = true
        }
      }

      if (stepNumber > 1) {
        for (let localStepNumber = stepNumber; localStepNumber > 1; localStepNumber--) {
          if (this.isCurrentStepInvalid(localStepNumber - 1)) {
            return true
          }
        }
      }

      return invalidStep
    },
  },
  watch: {
    checkout: {
      deep: true,
      immediate: true,
      handler(next) {
        if (next) {
          this.numberOfStep = Object.keys(next.steps).length
        }
      },
    },
  },
})
</script>

<style lang="scss" scoped>
.stepper-wrapper {
  display: flex;

  .valid-step-wrapper {
    cursor: pointer;
  }

  .step-wrapper {
    display: flex;
    align-items: center;
    width: 100%;
    justify-content: space-between;

    &.last-step-wrapper {
      max-width: fit-content;
    }

    .step {
      min-height: 2.6rem;
      max-height: 2.6rem;
      min-width: 2.6rem;
      max-width: 2.6rem;
      border: 0.1rem solid $main-lighten-52-color;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: $main-lighten-52-color;

      &.current-step {
        background-color: $success-color;
        color: $white;
        border: none;
      }

      &.previous-step {
        background-color: $success-color;
        border: none;

        i {
          color: $white !important;
        }
      }

      &.next-step {
        border-color: $success-color;
        color: $success-color;
      }
    }

    .separator {
      border-bottom: 0.1rem solid $main-lighten-52-color;
      width: 100%;
      margin: 0 0.3rem 0 0.3rem;
    }
  }
}
</style>
