<template>
  <mp-date-hour
    class="date-hour"
    :date="getDate(statusDate, 'P')"
    :hour="getDate(statusDate, 'p')"
    :dataId="dataId"
  />
</template>

<script lang="ts">
import Vue from 'vue'

import { dateHelper, dateHelperGetTimezonedDate } from '@/helpers/dateHelper'

export default Vue.extend({
  name: 'mp-order-status-date-hour',
  props: {
    statusDate: {
      type: String,
      required: true,
    },
    dataId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      dateHelper,
    }
  },
  methods: {
    getDate(date: string, format: string): string {
      return dateHelper.formatToTimezone(dateHelperGetTimezonedDate(date), 'UTC', format)
    },
  },
})
</script>

<style lang="scss" scoped>
@media #{map-get($display-breakpoints, 'xs-only')} {
  .date-hour {
    margin-bottom: 1.1rem;
  }
}
</style>
