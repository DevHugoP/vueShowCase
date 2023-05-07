<template>
  <mp-dialog-confirmation
    dataId="order-detail-packagesAndProducts-productModal"
    classWrapper="modal-detail-order-mobile-packages-and-products"
    @close="cancel()"
    color="primary"
    :header="{
      isColorBackground: true,
      text: product.label
        ? product.label.toUpperCase()
        : $t('page.detailOrder.detail.productNb', { number: product.indexProduct + 1 }),
      textPolice: 'h1-mobile',
      iconClose: 'mdi-arrow-left',
    }"
    fullscreen
  >
    <template #content>
      <div class="content-container">
        <h4 class="product-label" data-id="order-detail-packagesAndProducts-productModal-label">
          {{
            product.label ||
              $t('page.detailOrder.detail.productNb', { number: product.indexProduct + 1 })
          }}
        </h4>
        <mp-packages-and-products-product-info
          :product="product"
          dataId="order-detail-packagesAndProducts-productModal-infos"
        />
      </div>
    </template>
  </mp-dialog-confirmation>
</template>

<script lang="ts">
import Vue from 'vue'

import mpPackagesAndProductsProductInfo from '@/components/packagesAndProducts/components/productInfos.vue'

export default Vue.extend({
  name: 'mp-packages-and-products-mobile-product-infos',
  components: {
    mpPackagesAndProductsProductInfo,
  },
  props: {
    showDialog: {
      type: Boolean,
      required: true,
    },
    product: {
      type: Object,
      required: true,
    },
  },
  methods: {
    cancel() {
      this.$emit('hide')
    },
  },
})
</script>

<style lang="scss">
.modal-detail-order-mobile-packages-and-products {
  .content-container {
    padding-left: 2rem;

    .product-label {
      margin-top: 2.9rem;
      margin-bottom: 2rem;
      margin-right: 2.5rem;
      text-align: center;
      color: $main-color;
    }
  }
}
</style>
