<template>
  <div class="custom-checkout-steps-dnd-block-wrapper">
    <div class="custom-checkout-steps-dnd-block-header" v-if="block.name">
      <v-icon
        size="1.6rem"
        :class="block.name === CHECKOUT_BLOCKS.SENDER_IDENTITY ? 'main-color' : ''"
        @click="block.name === CHECKOUT_BLOCKS.SENDER_IDENTITY ? null : $emit('removeBlock')"
      >
        {{ block.name === CHECKOUT_BLOCKS.SENDER_IDENTITY ? 'mdi-lock' : 'mdi-close-circle' }}
      </v-icon>
    </div>

    <div class="custom-checkout-steps-dnd-block-content">
      <span class="regular14 main-lighten-28">
        {{
          block.name
            ? $t(`page.customCheckout.blocks.${block.name.toLowerCase()}`)
            : $t('page.customCheckout.steps.slide')
        }}
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { CHECKOUT_BLOCKS, CustomCheckoutBlock } from '@/types'
import Vue from 'vue'

export default Vue.extend({
  name: 'customCheckout-blockContect',
  props: {
    block: {
      type: Object as () => CustomCheckoutBlock,
      required: true,
    },
  },
  data: () => ({
    CHECKOUT_BLOCKS,
  }),
})
</script>
