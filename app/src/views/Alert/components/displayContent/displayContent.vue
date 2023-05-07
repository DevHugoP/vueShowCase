<template>
  <div class="ml-6">
    <span :class="`main-lighten-52 ${$vuetify.breakpoint.smAndUp ? 'regular12' : 'regular14'}`">
      {{ name }}
    </span>

    <div class="mt-1">
      <span :class="`main-color ${$vuetify.breakpoint.smAndUp ? 'medium14' : 'medium16'}`">
        {{ referenceNumber }}
      </span>
    </div>

    <div class="mt-1">
      <span :class="`main-color ${$vuetify.breakpoint.smAndUp ? 'regular14' : 'regular16'}`">
        {{ $t(`components.alertModal.typeAlertText.${type}`) }}
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'alert-modal-display-content',
  props: {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    referenceNumber: {
      required: true,
      type: String,
    },
  },
})
</script>
