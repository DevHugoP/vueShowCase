<template>
  <mp-dialog-confirmation
    dataId="order-detail-carrierSought-modal"
    color="primary"
    :header="{
      isColorBackground: true,
      text: quote.Carrier.name,
      textPolice: 'regular14',
      iconClose: 'mdi-close',
    }"
    fullscreen
    classWrapper="modal-detail-order-mobile-carrier-sought"
    @close="$emit('hide')"
  >
    <template #content>
      <mp-carrier-sought-infos :quote="quote" />
    </template>
  </mp-dialog-confirmation>
</template>

<script lang="ts">
import Vue from 'vue'

import mpCarrierSoughtInfos from '@/views/Order/Detail/carrierSought/components/infos.vue'

export default Vue.extend({
  name: 'mp-carrier-sought-mobile-infos',
  components: {
    mpCarrierSoughtInfos,
  },
  props: {
    quote: {
      type: Object,
      required: true,
    },
    showDialog: {
      type: Boolean,
      required: true,
    },
  },
})
</script>

<style lang="scss">
.modal-detail-order-mobile-carrier-sought {
  .main-dialog-content {
    padding: 2rem !important;
  }
}
</style>
