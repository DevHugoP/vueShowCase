<template>
  <v-row no-gutters id="product-return-date-hour">
    <v-col cols="12" sm="6" class="date-wrapper">
      <mp-date-picker
        :refs="{ menu: 'datepickerMenuRef', textfield: 'pickupDate', picker: 'picker' }"
        :dataId="`${dataId}-date`"
        :label="`${$t('common.date')} *`"
        v-model="date"
        :dateHelper="dateHelper"
        @input="validations.start.$touch()"
        @blur="validations.start.$touch()"
        :errors="getModelErrors(validations.start)"
        :isDirty="validations.start.$dirty"
        :min="min"
      />
    </v-col>
    <v-col cols="12" sm="6">
      <mp-vue-time-picker
        v-model="time"
        :placeholder="`${$t('common.scheduleVariant')} *`"
        :dataId="`${dataId}-time`"
        :min="min"
      />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import mixins from 'vue-typed-mixins'

import { dateHelper, dateHelperSetUtcTime } from '@/helpers/dateHelper'
import { DateInterval } from '@/types'
import { validationMixin } from '@/mixins'

export default mixins(validationMixin).extend({
  name: 'product-return-date-hour',
  props: {
    dataId: {
      type: String,
      required: true,
    },
    interval: {
      type: Array as () => DateInterval[],
      required: true,
    },
    validations: {
      type: Object as () => Record<string, any>,
      required: true,
    },
    min: {
      type: String,
      default: new Date().toISOString(),
    },
  },
  beforeMount() {
    if (!this.interval?.length) {
      this.interval.push({ start: '', end: '' })
    }
  },
  data: () => ({
    dateHelper,
    date: '',
    time: '',
  }),
  watch: {
    date(next) {
      const nextDate = new Date(next)
      const intervalStartDate = new Date(this.interval[0].start)

      this.interval[0].start = dateHelperSetUtcTime(
        intervalStartDate,
        {
          hours: intervalStartDate.getUTCHours(),
          minutes: intervalStartDate.getUTCMinutes(),
          seconds: intervalStartDate.getUTCSeconds(),
          milliseconds: intervalStartDate.getMilliseconds(),
        },
        {
          years: nextDate.getUTCFullYear(),
          months: nextDate.getUTCMonth(),
          days: nextDate.getUTCDate(),
        },
      ).toISOString()
      this.time = `${intervalStartDate
        .getUTCHours()
        .toString()
        .padStart(2, '0')}:${intervalStartDate
        .getUTCMinutes()
        .toString()
        .padStart(2, '0')}`
      this.$emit('updateInterval', this.interval[0].start)
    },
    time(next) {
      if (!next || next.length !== 5 || next.includes('HH') || next.includes('mm')) {
        this.$emit('invalid', true)
        return
      }

      const [hours, minutes] = next.split(':')

      const nextDate = dateHelperSetUtcTime(new Date(), {
        hours,
        minutes,
        seconds: 0,
        milliseconds: 0,
      })

      this.interval[0].start = dateHelperSetUtcTime(new Date(this.interval[0].start), {
        hours: nextDate.getUTCHours(),
        minutes: nextDate.getUTCMinutes(),
        seconds: 0,
        milliseconds: 0,
      }).toISOString()

      this.$emit('updateInterval', this.interval[0].start)
      this.$emit('invalid', false)
    },
  },
})
</script>

<style lang="scss">
#product-return-date-hour {
  display: flex;

  @media #{map-get($display-breakpoints, 'sm-and-up')} {
    .date-wrapper {
      padding-right: 1rem;
    }
  }

  .time-picker-wrapper {
    .placeholder {
      display: none;
    }

    @media #{map-get($display-breakpoints, 'sm-and-up')} {
      .mp-time-picker {
        margin-top: -0.2rem;
        padding-left: 1rem;
      }
    }
  }
}
</style>
