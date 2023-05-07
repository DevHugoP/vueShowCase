<template>
  <span class="regular14 comment" :data-id="dataId">{{ $t(comment) }}</span>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'mp-order-status-comment',
  props: {
    comment: {
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
.comment {
  color: $main-lighten-28-color;
}
</style>
