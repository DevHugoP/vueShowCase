<template>
  <div :data-id="dataId">{{ $t(`technical.status.order.${status}`) }}</div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'mp-order-status-status',
  props: {
    status: {
      type: String,
      required: true,
    },
    dataId: {
      type: String,
      required: true,
    },
  },
})
</script>

<style lang="scss" scoped>
</style>
