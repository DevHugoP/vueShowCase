<template>
  <div id="exchange-place-detail-typical-week">
    <mp-block
      id="exchange-place-detail-typical-week-block"
      :title="$vuetify.breakpoint.smAndUp ? $t('page.exchangePlace.typicalWeek.title') : ''"
      :hasBorder="$vuetify.breakpoint.smAndUp"
      :hasMarginBottom="$vuetify.breakpoint.smAndUp"
      titleHasPaddingBottom
      :padding="$vuetify.breakpoint.smAndUp ? '2.6rem' : '1.7rem 1rem 1.2rem 1rem'"
    >
      <div
        class="d-flex justify-center align-center empty-text-wrapper"
        v-if="!Object.keys(schedule).length"
      >
        <span class="italic16 main-lighten-52 empty-text-wrapper">
          {{ $t('page.exchangePlace.typicalWeek.empty') }}
        </span>
      </div>

      <div v-else>
        <mp-chips-wrapper
          class="days-chips-wrapper"
          dataId="exchange-place-detail-typical-week-days"
          :chips="dayOfTheWeek"
          :maxChips="dayOfTheWeek.length"
          v-model="selectedChips"
          @input="selectedDay = $event.value"
        />

        <div class="capacity-wrapper">
          <div
            :class="`capacity${capacity.capacity ? '' : ' empty'}`"
            v-for="(capacity, index) in schedule[selectedDay]"
            :key="`schedule-${selectedDay}-${index}`"
          >
            <span class="regular16">
              {{ `${getTimezoneSlotDate(capacity.start)} - ${getTimezoneSlotDate(capacity.end)}` }}
            </span>
            <div class="capacity-value">
              <span class="medium12" v-if="capacity.capacity">
                {{ capacity.capacity }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="d-flex justify-center align-center btn-wrapper">
        <mp-button
          :text="
            !Object.keys(schedule).length ? $t('action.create.base') : $t('action.modify.base')
          "
          dataId="exchange-place-detail-typical-week-create"
          :to="getTypicalWeekRoute"
          icon="pencil"
          :format="$vuetify.breakpoint.xsOnly ? 'secondary' : 'primary'"
          v-if="isAuthorized('WRITE_EXCHANGE_PLACE_SCHEDULES')"
        />
      </div>
    </mp-block>
  </div>
</template>

<script lang="ts">
import mixins from 'vue-typed-mixins'

import mpBlock from '@/components/block/block.vue'

import { ROUTES } from '@/constants'
import { dateHelper, dateHelperGetTimezonedDate, dateHelperSetUtcTime } from '@/helpers/dateHelper'
import { authorizationMixin } from '@/mixins'
import { DayCapacity, FrequencyAvailable, Week } from '@/types'

export default mixins(authorizationMixin).extend({
  name: 'mp-exchange-place-typical-week',
  components: {
    mpBlock,
  },
  props: {
    schedule: {
      type: Object as () => {
        slots: Record<string, DayCapacity[]>
        slotsFrequency: FrequencyAvailable
      },
      required: true,
    },
    timezone: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    selectedDay: Week.MONDAY,
    selectedChips: null as { text: string; value: string } | null,
  }),
  computed: {
    getTypicalWeekRoute() {
      if (!Object.keys(this.schedule).length) {
        return { name: ROUTES.createTypicalWeek }
      } else {
        return { name: ROUTES.editTypicalWeek }
      }
    },
    dayOfTheWeek() {
      return Object.values(Week).map(day => {
        return {
          text: this.$t(`common.days.${day.slice(0, 3)}`),
          value: day,
          disabled:
            (this.schedule as any)[day] && (this.schedule as any)[day].length ? false : true,
        }
      })
    },
  },
  methods: {
    getTimezoneSlotDate(date: string) {
      return dateHelper.formatToTimezone(
        dateHelperGetTimezonedDate(
          dateHelperSetUtcTime(new Date(), {
            hours: parseInt(date.split(':')[0], 10),
            minutes: parseInt(date.split(':')[1], 10),
            seconds: 0,
            milliseconds: 0,
          }),
          this.timezone,
        ),
        'UTC',
        'p',
      )
    },
  },
})
</script>

<style lang="scss" scoped>
@import '../../../../styles/mixins/macScrollbar';

#exchange-place-detail-typical-week {
  @media #{map-get($display-breakpoints, 'xs-only')} {
    border-top: solid 0.1rem $main-lighten-74-color;
  }

  #exchange-place-detail-typical-week-block {
    .btn-wrapper {
    margin-top: 2.5rem;
    margin-bottom: 0.1rem;
  }

    .empty-text-wrapper {
      text-align: center;
      padding-bottom: 1rem;
      padding-top: 1rem;
    }

    .days-chips-wrapper {
      margin-bottom: 2rem;
      white-space: nowrap;
      overflow: auto;
    }

    .day-selector-wrapper {
      display: flex;
      overflow-x: auto;
      @include setMacScrollbar('&');
      flex-wrap: wrap;

      @media #{map-get($display-breakpoints, 'xs-only')} {
        margin-top: 0;
      }

      .day-selector {
        border: 0.1rem solid $main-lighten-74-color;
        padding: 0.6rem 1.6rem;
        border-radius: 5rem;
        margin-right: 1rem;
        cursor: pointer;
        display: flex;
        align-items: center;
        position: relative;
        min-width: fit-content;
        margin-top: 0.5rem;

        &.selected {
          border: 0.2rem solid $main-color;
        }

        &.last {
          margin-right: 0;
        }

        &.disabled {
          cursor: not-allowed;
          color: $main-lighten-74-color;

          &:before {
            position: absolute;
            content: '';
            background: $main-lighten-74-color;
            display: block;
            width: 96%;
            height: 0.1rem;
            -webkit-transform: rotate(-15deg);
            transform: rotate(-15deg);
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            margin: auto;
          }
        }
      }
    }

    .capacity-wrapper {
      display: grid;
      grid-template-columns: repeat(auto-fill, 14rem);
      justify-content: center;
      grid-gap: 1rem;

      @include setMacScrollbar('&');
      overflow-y: auto;
      max-height: 32rem;

      @media #{map-get($display-breakpoints, 'xs-only')} {
        row-gap: 1rem;
        grid-template-columns: repeat(auto-fill, 11rem);
      }

      .capacity {
        min-width: 14rem;
        min-height: 6rem;
        max-width: 14rem;
        max-height: 6rem;
        border: 0.1rem solid $main-lighten-65-color;
        border-radius: 0.4rem;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;

        margin-top: 1rem;

        @media #{map-get($display-breakpoints, 'xs-only')} {
          margin-top: 0.5rem;
          min-width: 11rem;
          max-width: 11rem;
        }

        &.empty {
          color: $main-lighten-65-color;
          border: 0.1rem dashed $main-lighten-65-color;

          .capacity-value {
            background-color: $main-lighten-74-color;
          }
        }

        .capacity-value {
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: $success-color;
          color: $white;
          width: 4rem;
          height: 2rem;
          border-radius: 6rem;
          margin-top: 0.3rem;
        }
      }
    }
  }
}
</style>
