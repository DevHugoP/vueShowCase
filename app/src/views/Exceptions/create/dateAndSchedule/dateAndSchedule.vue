<template>
  <div class="date-schedule-wrapper">
    <h2 :class="$vuetify.breakpoint.xsOnly ? 'mt-8' : ''">
      {{ $t('page.exception.dateAndSchedule.title') }}
    </h2>

    <v-row no-gutters class="mt-8">
      <v-col cols="12" md="8" lg="4">
        <mp-date-range
          clearable
          dataId="exception-dateRange"
          :label="`${$t('common.date')} *`"
          v-model="value.dateRange"
          :dateHelper="dateHelper"
          :formatEdit="isEdit"
        />
      </v-col>
    </v-row>

    <v-row no-gutters class="slots-wrapper">
      <v-col cols="12" md="8" lg="4">
        <mp-slot
          id="exception-slots"
          :days.sync="value.slots"
          @invalid="setInvalids($event)"
          cols="12"
          sm="12"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import { dateHelper } from '@/helpers/dateHelper'
import mpSlot from '@/components/form/slot/slot.vue'
import { ExceptionDateAndSlots } from '../exceptionCreate.vue'
import { ROUTES } from '@/constants'

export default Vue.extend({
  name: 'mp-exception-date-schedule',
  components: {
    mpSlot,
  },
  props: {
    value: {
      type: Object as () => ExceptionDateAndSlots,
      required: true,
    },
  },
  data: () => ({
    dateHelper,
  }),
  computed: {
    isEdit() {
      return this.$route.name === ROUTES.editExceptions
    }
  },
  methods: {
    setInvalids(invalid: boolean) {
      this.$emit('invalid', invalid)
    },
  },
})
</script>

<style scoped lang="scss">
.date-schedule-wrapper {
  .slots-wrapper {
    margin-top: 2.7rem;

    .date-picker-end,
    .date-picker-start {
      > div {
        min-width: 100%;
      }
    }

    .slot-component {
      padding: 0 !important;

      .date-picker-end {
        padding-right: 2rem !important;
      }
    }
  }
}

.mp-daterange {
  min-width: fit-content !important;
}
</style>
