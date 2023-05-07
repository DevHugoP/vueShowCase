<template>
  <div id="exchange-place-detail-exceptions">
    <mp-block
      id="exchange-place-detail-exceptions-block"
      :title="$vuetify.breakpoint.smAndUp ? $t('page.exchangePlace.exceptions.title') : ''"
      :hasBorder="$vuetify.breakpoint.smAndUp"
      :hasMarginBottom="$vuetify.breakpoint.smAndUp"
      titleHasPaddingBottom
    >
      <no-data
        v-if="!exceptions || !exceptions.length"
        dataId="subscription-detail-noData"
        :content="$t('page.exchangePlace.exceptions.empty')"
      />
      <div v-else>
        <div
          v-for="(exception, index) of exceptions"
          :key="`exception-${index}`"
          class="exception-wrapper"
        >
          <router-link custom v-slot="{ navigate }" :to="getExceptionDetailRoute(index)">
            <div class="d-flex align-center justify-space-between exception" @click="navigate">
              <div class="d-block align-center">
                <span class="regular14 main-color">
                  {{
                    exception.slotsFrequency === 'CLOSED'
                      ? $t('common.closed')
                      : $t('page.typicalWeek.frequency.eventChanged')
                  }}
                </span>

                <div class="d-flex align-center pt-2">
                  <v-icon size="1.8rem">mdi-calendar-month</v-icon>

                  <span class="regular14 main-lighten-52 ml-3"> {{ getDate(exception) }} </span>
                </div>
              </div>
              <v-icon class="main-color regular14">mdi-chevron-right</v-icon>
            </div>
          </router-link>
          <v-divider class="divider" />
        </div>
      </div>

      <div class="d-flex justify-center align-center btn-wrapper">
        <mp-button
          :text="$t('action.add.base')"
          dataId="exchange-place-detail-typical-week-create"
          :to="getExceptionsRoute"
          icon="plus"
          :format="$vuetify.breakpoint.xsOnly ? 'secondary' : 'primary'"
          v-if="isAuthorized('WRITE_EXCHANGE_PLACE_SCHEDULE_EXCEPTIONS')"
        />
      </div>
    </mp-block>
  </div>
</template>

<script lang="ts">
import mixins from 'vue-typed-mixins'

import noData from '@/components/noData/noData.vue'
import mpBlock from '@/components/block/block.vue'
import { ROUTES } from '@/constants'
import { dateHelper } from '@/helpers/dateHelper'
import { authorizationMixin } from '@/mixins'
import { FrequencyAvailable } from '@/types'

export interface Exception {
  date: { start: string; end: string }
  openingHours: Array<{ start: string; end: string }>
  slots: Array<{ start: string; end: string; capacity: number | null }>
  slotsFrequency: FrequencyAvailable
}

export default mixins(authorizationMixin).extend({
  name: 'exchange-place-exception',
  components: {
    mpBlock,
    noData,
  },
  props: {
    exceptions: {
      required: true,
    },
  },
  computed: {
    getExceptionsRoute() {
      return { name: ROUTES.createExceptions }
    },
  },
  methods: {
    getExceptionDetailRoute(index: number) {
      return { name: ROUTES.detailExceptions, params: { exceptionId: index } }
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
#exchange-place-detail-exceptions {
  .btn-wrapper {
    margin-top: 2.5rem;
    margin-bottom: 0.1rem;
  }
  .exception-wrapper {
    border-bottom: solid 0.1rem $main-lighten-74-color;
    padding: 1.6rem 0;

    &:last-of-type {
      border-bottom: none;
      padding-bottom: 0;
    }

    &:first-of-type {
      padding-top: 0;
    }

    cursor: pointer;

    i {
      &.mdi-calendar-month {
        color: $main-lighten-65-color !important;
      }
    }

    .exception {
      display: flex;
      align-items: center;
    }
  }
}
</style>
