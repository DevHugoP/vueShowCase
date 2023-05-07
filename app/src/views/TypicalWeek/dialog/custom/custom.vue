<template>
  <mp-dialog-confirmation
    dataId="frequency-custom"
    @close="cancel()"
    @submit="save()"
    color="primary"
    classWrapper="frequency-custom"
    :header="{
      icon: $vuetify.breakpoint.xsOnly ? '' : 'mdi-plus',
      isColorBackground: true,
      text: $t('page.typicalWeek.frequency.CUSTOM').toUpperCase(),
      textPolice: $vuetify.breakpoint.xsOnly ? 'regular14' : 'h4',
      iconClose: 'mdi-close',
    }"
    :btnCancel="{ text: $t('action.cancel.base'), format: 'link', linkColor: 'black' }"
    :btnValidation="{
      text: $t('action.save'),
      format: 'success',
      disabled: Boolean(Object.values(invalids).filter(invalid => invalid).length),
    }"
    :btnToColumn="$vuetify.breakpoint.xsOnly"
    maxWidth="50rem"
    :fullscreen="$vuetify.breakpoint.xsOnly"
  >
    <template #content>
      <div>
        <div class="day-selector-wrapper" v-if="showDays">
          <div
            :class="
              `day-selector${index === 0 ? ' first' : ''}${
                index === week.length - 1 ? ' last' : ''
              }${day === selectedDay ? ' selected' : ''}`
            "
            v-for="(day, index) in week"
            :key="`custom-${day}`"
            @click="selectedDay = day"
          >
            <v-icon v-if="invalids[day]" size="1.6rem">mdi-close-thick</v-icon>
            <span class="regular14">{{ $t(`common.days.${day.slice(0, 3)}`) }}</span>
          </div>
        </div>

        <div class="slot-wrapper">
          <mp-slot
            id="frequency-custom-monday"
            :days.sync="planning[selectedDay]"
            @invalid="setInvalids($event)"
            cols="12"
            sm="12"
          />
        </div>
      </div>
    </template>
  </mp-dialog-confirmation>
</template>

<script lang="ts">
import Vue from 'vue'

import mpSlot from '@/components/form/slot/slot.vue'
import { OpeningHours, Week } from '@/types'
import { dateHelper, dateHelperGetTimezonedDate, dateHelperSetUtcTime } from '@/helpers/dateHelper'

export default Vue.extend({
  name: 'mp-frequency-custom',
  components: {
    mpSlot,
  },
  props: {
    openingHours: {
      type: Object as () => OpeningHours,
      required: true,
    },
    isModify: {
      type: Boolean,
      required: true,
    },
    showDays: {
      type: Boolean,
      required: true,
    },
    timezone: {
      type: String,
      required: true,
    },
    showTimezonedDate: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      planning: {
        [Week.MONDAY]: [],
        [Week.TUESDAY]: [],
        [Week.WEDNESDAY]: [],
        [Week.THURSDAY]: [],
        [Week.FRIDAY]: [],
        [Week.SATURDAY]: [],
        [Week.SUNDAY]: [],
      } as OpeningHours,
      selectedDay: Week.MONDAY,
      invalids: {
        [Week.MONDAY]: false,
        [Week.TUESDAY]: false,
        [Week.WEDNESDAY]: false,
        [Week.THURSDAY]: false,
        [Week.FRIDAY]: false,
        [Week.SATURDAY]: false,
        [Week.SUNDAY]: false,
      },
    }
  },
  computed: {
    week() {
      return Object.values(Week)
    },
  },
  mounted() {
    if (this.isModify) {
      const localPlanning = JSON.parse(JSON.stringify(this.openingHours))
      if (this.showTimezonedDate) {
        for (const day in localPlanning) {
          if (localPlanning[day]) {
            for (const slot of localPlanning[day]) {
              slot.start = dateHelper.formatToTimezone(
                dateHelperGetTimezonedDate(
                  dateHelperSetUtcTime(new Date(), {
                    hours: parseInt(slot.start.split(':')[0], 10),
                    minutes: parseInt(slot.start.split(':')[1], 10),
                    seconds: 0,
                    milliseconds: 0,
                  }),
                  this.timezone,
                ),
                'UTC',
                'p',
              )
              slot.end = dateHelper.formatToTimezone(
                dateHelperGetTimezonedDate(
                  dateHelperSetUtcTime(new Date(), {
                    hours: parseInt(slot.end.split(':')[0], 10),
                    minutes: parseInt(slot.end.split(':')[1], 10),
                    seconds: 0,
                    milliseconds: 0,
                  }),
                  this.timezone,
                ),
                'UTC',
                'p',
              )
            }
          }
        }
      }
      this.planning = localPlanning
    }
  },
  methods: {
    cancel() {
      this.$emit('hide')
    },
    save() {
      this.$emit('save', this.planning)
    },
    setInvalids(invalid: boolean) {
      this.invalids[this.selectedDay] = invalid
    },
  },
})
</script>

<style lang="scss">
@import '../../../../styles/mixins/macScrollbar';

.frequency-custom {
  .day-selector-wrapper {
    display: flex;
    overflow-x: auto;
    background-color: $main-lighten-80-color;
    height: 7.5rem;
    align-items: center;
    @include setMacScrollbar('&');

    .day-selector {
      display: flex;
      align-items: center;
      width: fit-content;
      border: 0.1rem solid $main-lighten-74-color;
      margin-right: 1rem;
      background-color: $white;
      color: $main-color;
      height: fit-content;
      padding: 0.6rem 1.6rem;
      border-radius: 5rem;
      cursor: pointer;

      &.last {
        margin-right: 0;
      }

      &.first {
        margin-left: 3.2rem;
      }

      &.selected {
        border: 0.2rem solid $main-color;
      }

      .mdi-close-thick {
        color: $error-color !important;
      }
    }
  }

  .slot-wrapper {
    margin-left: 2.6rem;
    min-height: 10rem;
    overflow: auto;
    max-height: calc(100vh - 12.6rem - 7.5rem - 8.8rem - 2.7rem - 1.7rem - 4rem);
    @include setMacScrollbar('&');

    @media #{map-get($display-breakpoints, 'xs-only')} {
      max-height: calc(100vh - 5.2rem - 7.5rem - 14.8rem);
    }

    .mdi-trash-can-outline {
      display: flex;
      align-items: flex-start;
      padding-bottom: 1rem;

      color: $main-lighten-52-color !important;
    }

    .date-picker-start {
      margin-bottom: 2rem;
    }
  }
}
</style>
