<template>
  <mp-time-picker-new
    :placeholder="label"
    :label="label"
    v-model="time"
    :dataId="dataId"
    :maxlength="5"
    :errors="errors"
    :isDirty="isDirty"
    @blur="$emit('blur', $event)"
  />
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'mp-slot-input',
  props: {
    value: {
      type: String,
      default: '',
    },
    dataId: {
      type: String,
      required: true,
    },
    errors: {
      type: Array,
      required: true,
    },
    isDirty: {
      type: Boolean,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      time: this.value,
    }
  },
  watch: {
    time(next, current) {
      if (next.length === 2 && next.length > current.length && !next.includes(':')) {
        this.time = `${next}:`
      } else if (next.length === 3 && next[2] !== ':' && !next.includes(':')) {
        this.time = `${next[0]}${next[1]}:${next[2]}`
      }
      this.$emit('input', this.time)
    },
  },
})
</script>
