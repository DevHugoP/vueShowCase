<template>
  <div id="packages-and-products-product-infos-container">
    <div class="text-wrapper" v-if="product.quantity">
      <span class="label regular14">{{ translator('quantity') }}</span>
      <span class="value regular14" :data-id="`${dataId}-quantity`">{{ product.quantity }}</span>
    </div>
    <div class="text-wrapper" v-if="product.ean">
      <span class="label regular14">{{ translator('ean') }}</span>
      <span class="value regular14" :data-id="`${dataId}-ean`">{{ product.ean }}</span>
    </div>
    <div class="text-wrapper" v-if="product.cug">
      <span class="label regular14">{{ translator('cug') }}</span>
      <span class="value regular14" :data-id="`${dataId}-cug`">{{ product.cug }}</span>
    </div>
    <div class="text-wrapper" v-if="product.length">
      <span class="label regular14">{{ translator('length') }}</span>
      <span
        class="value regular14"
        :data-id="`${dataId}-length`"
      >{{ product.length.value }}{{ product.length.unit }}</span>
    </div>
    <div class="text-wrapper" v-if="product.width">
      <span class="label regular14">{{ translator('width') }}</span>
      <span
        class="value regular14"
        :data-id="`${dataId}-width`"
      >{{ product.width.value }}{{ product.width.unit }}</span>
    </div>
    <div class="text-wrapper" v-if="product.height">
      <span class="label regular14">{{ translator('height') }}</span>
      <span
        class="value regular14"
        :data-id="`${dataId}-height`"
      >{{ product.height.value }}{{ product.height.unit }}</span>
    </div>
    <div class="text-wrapper" v-if="product.weight">
      <span class="label regular14">{{ translator('weight') }}</span>
      <span
        class="value regular14"
        :data-id="`${dataId}-weight`"
      >{{ product.weight.value }}{{ product.weight.unit }}</span>
    </div>
    <div class="text-wrapper" v-if="product.type">
      <span class="label regular12">{{ translator('typology') }}</span>
      <span
        class="value regular14"
        :data-id="`${dataId}-type`"
      >
        {{ $t(`technical.typologies.${product.type}`) }}
      </span>
    </div>
    <div class="text-wrapper" v-if="product.followingLink">
      <span class="label regular14">{{ translator('followingPackage') }}</span>
      <span
        class="value regular14"
        :data-id="`${dataId}-followingLink`"
      >
        {{ product.followingLink }}
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ProductEntity } from '@/types'

export default Vue.extend({
  name: 'mp-packages-and-products-product-info',
  props: {
    product: {
      type: Object as () => ProductEntity,
      required: true,
    },
    dataId: {
      type: String,
      required: true,
    },
  },
  methods: {
    translator(value: string) {
      return this.$t(`page.detailOrder.packagesAndProducts.${value}`)
    },
  },
})
</script>

<style lang="scss" scoped>
#packages-and-products-product-infos-container {
  .text-wrapper {
    display: flex;
    justify-content: space-between;
    border-bottom: solid 0.1rem $main-lighten-74-color;
    padding: 1.6rem 0;
    margin-right: 2.5rem;

    .label {
      color: $main-lighten-52-color;
      display: flex;
      align-items: center;
    }

    .value {
      color: $main-color;
      word-break: break-word;
    }
  }

  .text-wrapper:last-of-type {
    border-bottom: none;
  }

  .text-wrapper:first-of-type {
    padding-top: 0;
  }
}
</style>
