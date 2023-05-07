<template>
  <div id="activate-carrier">
    <mp-dialog-confirmation
      dataId="activate-carrier-modal"
      color="error"
      :header="{
        iconClose: 'mdi-close',
        icon: 'mdi-exclamation-thick',
        isColorBackground: false,
      }"
      :textContent="orderEligibility.isActive ? $t('action.carrier.disable') : $t('action.carrier.enable')"
      :btnCancel="{ text: $t('action.cancel.base'), format: 'link', linkColor: 'black' }"
      :btnValidation="{
        text: orderEligibility.isActive ? $t('action.disable.base') : $t('action.enable.base'),
        format: 'error',
      }"
      :btnToColumn="$vuetify.breakpoint.xsOnly"
      @close="$emit('close')"
      @submit="$emit('submit')"
    />
  </div>
</template>

<script lang="ts">
import { CarrierEligibilityEntity } from '@/types'
import Vue from 'vue'

export default Vue.extend({
  name: 'activate-carrier-btn',
  props: {
    orderEligibility: {
      type: Object as () => CarrierEligibilityEntity,
      required: true,
    },
  },
})
</script>
