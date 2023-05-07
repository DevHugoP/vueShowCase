<template>
  <mp-dialog-confirmation
    dataId="custom-checkout-infos-dialog-detail"
    classWrapper="custom-checkout-dialog-detail"
    color="primary"
    :header="{
      iconClose: 'mdi-close',
      icon: $vuetify.breakpoint.smAndUp ? 'mdi-information-variant' : '',
      isColorBackground: true,
      text: $t('page.customCheckout.infos.dialogBtn'),
      textPolice: 'regular14',
    }"
    :btnValidation="{ text: $t('page.customCheckout.dialogDetail.submit'), format: 'success' }"
    @close="$emit('close')"
    @submit="$emit('submit')"
  >
    <template #content>
      <div class="custom-checkout-dialog-detail-content">
        <div class="custom-checkout-dialog-detail-block-container">
          <v-row no-gutters>
            <v-col cols="10" offset="1" class="custom-checkout-dialog-detail-block-wrapper">
              <div
                :class="
                  `custom-checkout-dialog-detail-block${
                    block.name === selectedBlock.name ? ' selected' : ''
                  }`
                "
                v-for="block in blocks"
                :key="`custom-checkout-dialog-detail-block-${block.name}`"
                @click="selectedBlock = block"
              >
                <span class="regular14">
                  {{ $t(`page.customCheckout.blocks.${block.name.toLowerCase()}`) }}
                </span>
              </div>
            </v-col>
          </v-row>
        </div>

        <v-row no-gutters class="custom-checkout-dialog-detail-infos-wrapper">
          <v-col cols="10" offset="1">
            <h2 class="mb-2 main-color">
              {{ $t('common.description') }}
            </h2>

            <span class="regular14 main-lighten-28">
              {{
                $t(
                  `page.customCheckout.dialogDetail.${
                    blockNameBackToblockNameFront[selectedBlock.name]
                  }.description`,
                )
              }}
            </span>

            <h2 class="mt-6 mb-2 main-color">
              {{
                $t(
                  `page.customCheckout.dialogDetail.${
                    blockNameBackToblockNameFront[selectedBlock.name]
                  }.title`,
                )
              }}
            </h2>

            <div class="mt-3">
              <div class="mb-3">
                <span class="medium14 main-color is-mandatory" v-if="!selectedBlock.isOptional">
                  {{ $t('page.customCheckout.dialogDetail.mandatory') }}
                </span>
              </div>

              <div
                v-for="(text, index) in $t(
                  `page.customCheckout.dialogDetail.${
                    blockNameBackToblockNameFront[selectedBlock.name]
                  }.rules`,
                  { returnObjects: true },
                )"
                :key="`translation-${index}`"
              >
                <span class="regular14 main-lighten-28">
                  {{ text }}
                </span>
              </div>
            </div>
          </v-col>
        </v-row>
      </div>
    </template>
  </mp-dialog-confirmation>
</template>

<script lang="ts">
import { CHECKOUT_BLOCKS, CustomCheckoutBlock } from '@/types'
import { blockNameBackToblockNameFront } from '@/views/Order/Create/create.vue'
import Vue from 'vue'

export default Vue.extend({
  name: 'customCheckout-dialog-detail',
  props: {
    blocks: {
      type: Array as () => CustomCheckoutBlock[],
      required: true,
    },
  },
  data: () => ({
    selectedBlock: null as CustomCheckoutBlock | null,
    CHECKOUT_BLOCKS,
    blockNameBackToblockNameFront,
  }),
  beforeMount() {
    this.selectedBlock = this.blocks[0]
  },
})
</script>

<style lang="scss">
@import '../../../styles/mixins/macScrollbar';
.custom-checkout-dialog-detail {
  .custom-checkout-dialog-detail-content {
    .custom-checkout-dialog-detail-block-container {
      padding: 3.4rem 1rem 3.4rem 0;
      background-color: $main-lighten-80-color;

      .custom-checkout-dialog-detail-block-wrapper {
        display: flex;
        align-items: center;
        overflow-x: auto;
        @include setMacScrollbar('&');

        .custom-checkout-dialog-detail-block {
          height: 3rem;
          border: 0.1rem solid $main-lighten-74-color;
          padding: 0.6rem 1.6rem;
          background-color: $white;
          border-radius: 5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-left: 1rem;
          cursor: pointer;

          &.selected {
            border: 0.2rem solid $main-color;
          }

          &:first-of-type {
            margin-left: 0;
          }

          span {
            width: max-content;
          }
        }
      }
    }

    .custom-checkout-dialog-detail-infos-wrapper {
      margin-top: 2.5rem;

      max-height: calc(80vh - 12.5rem - 11.3rem - 8.8rem);
      height: 30vh;
      overflow-y: scroll;
      overflow-x: hidden;
      @include setMacScrollbar('&');
      border-bottom: 0.1rem solid $main-lighten-65-color;
      padding-bottom: 1rem;

      .is-mandatory {
        text-decoration: underline;
      }
    }
  }
}
</style>
