<template>
  <div id="carrier-detail-exceptions">
    <mp-block
      id="carrier-exceptions-block"
      :title="$vuetify.breakpoint.smAndUp ? $t('page.exchangePlace.exceptions.title') : ''"
      :hasBorder="$vuetify.breakpoint.smAndUp"
      :hasMarginBottom="$vuetify.breakpoint.smAndUp"
      :titleHasPaddingBottom="Boolean(exceptions) && Boolean(exceptions.length)"
    >
      <div v-if="scheduleConfigs && scheduleConfigs.id">
        <no-data
          v-if="!exceptions || !exceptions.length"
          :content="$t('page.exchangePlace.exceptions.empty')"
          dataId="carrier-exceptions-noData"
        />
        <div v-else>
          <router-link
            custom
            v-slot="{ navigate }"
            v-for="(exception, index) of exceptions"
            :key="`exception-${index}`"
            class="exception-wrapper"
            :to="getExceptionDetailRoute(index)"
          >
            <span>
              <div class="d-flex align-center justify-space-between exception" @click="navigate">
                <div class="d-block align-center">
                  <span class="regular16">
                    {{
                      exception.slotsFrequency === 'CLOSED'
                        ? $t('common.closed')
                        : $t('page.typicalWeek.frequency.eventChanged')
                    }}
                  </span>
                  <div class="d-flex align-center pt-2">
                    <v-icon size="1.8rem">mdi-calendar-month</v-icon>
                    <span class="regular16 main-lighten-52 ml-3"> {{ getDate(exception) }} </span>
                  </div>
                </div>
                <v-icon>mdi-chevron-right</v-icon>
              </div>
              <v-divider />
            </span>
          </router-link>
        </div>
        <div class="d-flex justify-center align-center mt-4" v-if="$vuetify.breakpoint.smAndUp">
          <mp-button
            :text="$t('action.add.base')"
            dataId="carrier-exceptions-create"
            :to="getExceptionsRoute"
            icon="plus"
            format="primary"
            v-if="isAuthorized('WRITE_CARRIER_SCHEDULE_EXCEPTIONS')"
          />
        </div>
      </div>
      <div v-else>
        <no-data
          :content="$t('page.exchangePlace.exceptions.noTypicalWeek')"
          dataId="carrier-exceptions-noData"
        />
      </div>
    </mp-block>
  </div>
</template>

<script lang="ts">
import mixins from 'vue-typed-mixins'

import mpBlock from '@/components/block/block.vue'
import { ROUTES } from '@/constants'
import { dateHelper } from '@/helpers/dateHelper'
import { authorizationMixin } from '@/mixins'
import { FrequencyAvailableNew, SchedulesConfigRecord } from '@/types'
import noData from '@/components/noData/noData.vue'

export interface Exception {
  date: { start: string; end: string }
  openingHours: Array<{ start: string; end: string }>
  slots: Array<{ start: string; end: string; capacity: number | null }>
  slotsFrequency: FrequencyAvailableNew
}

export default mixins(authorizationMixin).extend({
  name: 'mp-carrier-exception',
  components: {
    mpBlock,
    noData,
  },
  props: {
    exceptions: {
      required: false,
    },
    scheduleConfigs: {
      type: Object as () => SchedulesConfigRecord,
      required: false,
    },
  },
  data: () => ({
    FrequencyAvailableNew,
  }),
  computed: {
    getExceptionsRoute() {
      return {
        name: ROUTES.carrierCreateExceptions,
        params: { scheduleId: this.scheduleConfigs.id },
      }
    },
  },
  methods: {
    getExceptionDetailRoute(index: number) {
      return {
        name: ROUTES.carrierDetailExceptions,
        params: { exceptionId: index, scheduleId: this.scheduleConfigs.id },
      }
    },
    getDate(exception: Exception) {
      if (exception.date.start.substr(0, 10) === exception.date.end.substr(0, 10)) {
        return this.$t('common.dateAt', { date: dateHelper.format(exception.date.start, 'P') })
      } else {
        return this.$t('common.dateBetween', {
          begin: dateHelper.format(exception.date.start, 'P'),
          end: dateHelper.format(exception.date.end, 'P'),
        })
      }
    },
  },
})
</script>

<style lang="scss" scoped>
#carrier-detail-exceptions {
  .exception-wrapper {
    cursor: pointer;

    i {
      color: $main-lighten-52-color !important;
      &.mdi-calendar-month {
        color: $main-lighten-65-color !important;
      }
    }

    .exception {
      min-height: 8.1rem;
      max-height: 8.1rem;
      display: flex;
      align-items: center;
    }
  }
}
</style>
