<template>
  <mp-dialog-confirmation
    dataId="typicalWeek-dialog-duplicate-slot"
    @close="cancel()"
    @submit="save()"
    color="primary"
    classWrapper="typicalWeek-dialog-duplicate-slot"
    :header="{
      icon: $vuetify.breakpoint.xsOnly ? '' : 'mdi-content-duplicate',
      isColorBackground: true,
      text: $t('page.typicalWeek.slots.duplicateVariant'),
      textPolice: 'h4',
      iconClose: 'mdi-close',
    }"
    :btnCancel="{ text: $t('action.cancel.base'), format: 'link', linkColor: 'black' }"
    :btnValidation="{ text: $t('action.save'), format: 'success', disabled: !selectedDays.length }"
    :btnToColumn="$vuetify.breakpoint.xsOnly"
    maxWidth="50rem"
    :fullscreen="$vuetify.breakpoint.xsOnly"
  >
    <template #content>
      <v-row no-gutters>
        <v-col cols="10" offset="1">
          <div class="day-selector-wrapper">
            <div
              v-for="day of displayedDays"
              :key="`duplicate-${day.name}`"
              :class="
                `day-selector${
                  selectedDays.find(selectedDay => selectedDay === day.name) ? ' selected' : ''
                }${day.disabled ? ' disabled' : ''}`
              "
              @click="day.disabled ? null : manageSelectedDay(day.name)"
            >
              <span class="regular16"> {{ $t(`common.days.${day.name.slice(0, 3)}`) }} </span>
            </div>
          </div>
        </v-col>
      </v-row>
    </template>
  </mp-dialog-confirmation>
</template>

<script lang="ts">
import Vue from 'vue'
import { OpeningHours, Week, OpeningDay } from '@/types'

export default Vue.extend({
  name: 'mp-capacity-duplicate-slot',
  props: {
    currentDay: {
      type: String,
      required: true,
    },
    openingHours: {
      type: Object as () => OpeningHours,
      required: true,
    },
    openingDays: {
      type: Array as () => OpeningDay[],
      required: true,
    }
  },
  data: () => ({
    selectedDays: [] as Week[],
    displayedDays: [] as Array<{
      disabled: boolean
      numberOfIncompleteSlot: number
      name: string
    }>,
    planning: {
      [Week.MONDAY]: [],
      [Week.TUESDAY]: [],
      [Week.WEDNESDAY]: [],
      [Week.THURSDAY]: [],
      [Week.FRIDAY]: [],
      [Week.SATURDAY]: [],
      [Week.SUNDAY]: [],
    } as OpeningHours,
  }),
  mounted() {
    this.planning = this.openingHours
    this.displayedDays = this.openingDays.filter(day => day.value !== this.currentDay).map(displayedDay => {
      return {
        disabled: displayedDay.disabled,
        numberOfIncompleteSlot: 0,
        name: displayedDay.value,
      }
    })
  },
  methods: {
    cancel() {
      this.$emit('hide')
    },
    save() {
      for (const selectedDay of this.selectedDays) {
        this.planning[selectedDay] = this.planning[this.currentDay]
      }
      this.$emit('save', this.planning)
    },
    manageSelectedDay(selectedDay: Week) {
      const selectedDayIndex = this.selectedDays.findIndex(day => day === selectedDay)

      if (selectedDayIndex === -1) {
        this.selectedDays.push(selectedDay)
      } else {
        this.selectedDays.splice(selectedDayIndex, 1)
      }
    },
  },
})
</script>

<style lang="scss">
@import '../../../../styles/mixins/macScrollbar';

.typicalWeek-dialog-duplicate-slot {
  .main-dialog-content {
    @media #{map-get($display-breakpoints, 'sm-and-up')} {
      max-height: calc(80vh - 11.6rem - 8.8rem);
      overflow-y: auto;
      @include setMacScrollbar('&');
    }
  }

  .day-selector-wrapper {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    margin-top: 5rem;
    margin-bottom: 5rem;

    .day-selector {
      width: 18rem;
      height: 6rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 0.1rem solid $main-lighten-65-color;
      border-radius: 0.4rem;
      margin: 0.8rem;
      color: $main-color;
      cursor: pointer;
      overflow: hidden;

      @media #{map-get($display-breakpoints, 'xs-only')} {
        width: 12.8rem;
      }

      &.disabled {
        cursor: not-allowed;
        position: relative;
        color: $main-lighten-74-color;

        &:before {
          position: absolute;
          content: '';
          background: $main-lighten-74-color;
          display: block;
          width: 18.9rem;
          height: 0.1rem;
          -webkit-transform: rotate(-18deg);
          transform: rotate(-18deg);
          margin: auto;
        }
      }

      &.selected {
        border: 0.2rem solid $main-color;
      }
    }
  }

  .warning-message {
    margin-left: 1.6rem;
    color: $alert-color;
  }
}
</style>
