<template>
  <mp-dialog-confirmation
    dataId="typicalWeek-dialog-duplicate"
    @close="cancel()"
    @submit="save()"
    color="primary"
    classWrapper="typicalWeek-dialog-duplicate"
    :header="{
      icon: $vuetify.breakpoint.xsOnly ? '' : 'mdi-content-duplicate',
      isColorBackground: true,
      text: $t('page.typicalWeek.capacity.duplicateVariant'),
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

          <div class="warning-message" v-if="isWarningMessageDisplayed">
            <span
              class="regular16"
              v-for="day in displayedDays.filter(
                displayedDay =>
                  displayedDay.numberOfIncompleteSlot &&
                  selectedDays.find(selectedDay => selectedDay === displayedDay.name),
              )"
              :key="`warnign-${day.name}`"
            >
              <v-icon class="duplicate-icon">mdi-alert-box-outline</v-icon>
              <div>

                {{
                  $t('page.typicalWeek.capacity.duplicateWarning', {
                    day: $t(`common.days.${day.name.slice(0, 3)}`),
                    number: day.numberOfIncompleteSlot,
                    count: day.numberOfIncompleteSlot,
                  })
                }}
              </div>
              <br />
              <br />
            </span>
          </div>
        </v-col>
      </v-row>
    </template>
  </mp-dialog-confirmation>
</template>

<script lang="ts">
import Vue from 'vue'
import { DayCapacity, Week } from '@/types'

export default Vue.extend({
  name: 'mp-capacity-duplicate',
  props: {
    currentDay: {
      type: String,
      required: true,
    },
    capacities: {
      type: Object as () => Record<string, DayCapacity[]>,
      required: true,
    },
  },
  data() {
    return {
      selectedDays: [] as Week[],
      displayedDays: [] as Array<{
        disabled: boolean
        numberOfIncompleteSlot: number
        name: string
      }>,
    }
  },
  computed: {
    isWarningMessageDisplayed() {
      for (const displayedDay of this.displayedDays) {
        if (displayedDay.numberOfIncompleteSlot) {
          return true
        }
      }
      return false
    },
  },
  mounted() {
    for (const displayedDay of Object.values(Week).filter(day => day !== this.currentDay)) {
      const dayToDisplay: { disabled: boolean; numberOfIncompleteSlot: number; name: string } = {
        disabled: this.capacities[displayedDay].length ? false : true,
        numberOfIncompleteSlot: 0,
        name: displayedDay,
      }

      for (const capacity of this.capacities[displayedDay]) {
        if (
          !this.capacities[this.currentDay].find(
            currentDayCapacity =>
              currentDayCapacity.start === capacity.start &&
              currentDayCapacity.end === capacity.end,
          )
        ) {
          dayToDisplay.numberOfIncompleteSlot += 1
        }
      }

      this.displayedDays.push(dayToDisplay)
    }
  },
  methods: {
    cancel() {
      this.$emit('hide')
    },
    save() {
      this.$emit('save', this.selectedDays)
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

.typicalWeek-dialog-duplicate {
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

    span{
      display: flex;
      align-items: flex-start;
      padding-bottom: 2rem;
    }
    .duplicate-icon{
      color: $alert-color;
      padding-right: 1rem;
    }
    
  }
}
</style>
