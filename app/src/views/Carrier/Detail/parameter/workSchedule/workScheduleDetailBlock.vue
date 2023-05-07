<template>
  <v-container id="work-schedule-detail" data-id="work-schedule-detail">
    <mp-block
      id="work-schedule-detail-block"
      :title="$vuetify.breakpoint.smAndUp ? $t('page.schedule.title') : ''"
      :hasBorder="$vuetify.breakpoint.smAndUp"
      :hasMarginBottom="$vuetify.breakpoint.smAndUp"
      titleHasPaddingBottom
      :hasEditIcon="$vuetify.breakpoint.smAndUp && hasEditIcon && schedule"
      @clickOnIcon="showModal = true"
    >
      <div v-if="schedule">
        <v-row
          no-gutters
          v-for="(day, index) in getLocalSchedule"
          :key="`work-schedule-detail-${index}`"
          class="schedule"
        >
          <v-col cols="3">
            <span
              class="regular14 main-lighten-52"
              :data-id="`work-schedule-detail-${days[index]}`"
            >
              {{ $t(`common.days.${days[index]}`) }}
            </span>
          </v-col>
          <v-col cols="9" v-if="day.length > 0" class="slot-wrapper">
            <span
              v-for="(slot, slotIndex) in day"
              :key="`work-schedule-detail-${index}-slot-${slotIndex}`"
              class="slot"
            >
              <span
                class="regular14 main-color"
                :data-id="`work-schedule-detail-${days[index]}-slot`"
              >
                {{ slot.start }} - {{ slot.end }}{{ day[slotIndex + 1] ? ' / ' : '' }}
              </span>
            </span>
          </v-col>
          <v-col cols="9" v-else class="slot-wrapper">
            <span class="slot regular14" :data-id="`work-schedule-detail-${days[index]}-closed`">
              {{ $t('common.closed') }}
            </span>
          </v-col>
        </v-row>
      </div>

      {{ schedule }}

      <div>
        <no-data :content="$t('page.schedule.noData')" dataId="work-schedule-detail-noData" />

        <v-row
          no-gutters
          class="action-outer-wrapper mt-5"
          v-if="$vuetify.breakpoint.smAndUp && isAuthorized('WRITE_CARRIER_SCHEDULES')"
        >
          <v-col cols="12" class="d-flex justify-center">
            <mp-button
              icon="pencil"
              iconSize="1.8rem"
              :text="$t('action.add.base')"
              dataId="work-schedule-detail-no-data-add-btn"
              @click="showModal = true"
            />
          </v-col>
        </v-row>
      </div>

      <mp-dialog-confirmation
        v-if="showModal"
        dataId="work-schedule-detail-modal"
        classWrapper="work-schedule-detail-modal"
        color="primary"
        :header="{
          iconClose: 'mdi-close',
          icon: $vuetify.breakpoint.smAndUp ? 'mdi-pencil' : '',
          isColorBackground: true,
          text: $t('action.modify.promise'),
          textPolice: 'medium16',
        }"
        :btnValidation="{
          text: $t('action.save'),
          format: 'success',
          icon: 'content-save-outline',
          disabled: invalid.openingHours,
        }"
        :btnCancel="{ text: $t('action.cancel.base'), format: 'link', linkColor: 'black' }"
        @close="showModal = !showModal"
        @submit="handleSubmit()"
      >
        <template #content>
          <v-row no-gutters>
            <v-col cols="10" offset="1" class="row-wrapper">
              <workSchedule
                :modalContent="true"
                showTitle
                :workSchedule.sync="editWorkSchedule"
                @invalid="invalid.editWorkSchedule = $event"
              />
            </v-col>
          </v-row>
        </template>
      </mp-dialog-confirmation>
    </mp-block>
  </v-container>
</template>

<script lang="ts">
import { OpeningHours, DateInterval, getDefaultOpenningHour } from '@/types'
import { SnackBarType } from '@/store/types'
import ExchangePlaceService from '@/services/exchangePlace/ExchangePlaceService'
import workSchedule from '@/views/Carrier/Detail/parameter/workSchedule/workSchedule.vue'
import noData from '@/components/noData/noData.vue'
import { dateHelper } from '@/helpers/dateHelper'
import { v4 } from 'uuid'
import { SHORT_DAY } from '@/constants'

import mixins from 'vue-typed-mixins'
import { authorizationMixin } from '@/mixins'

import mpBlock from '@/components/block/block.vue'

export default mixins(authorizationMixin).extend({
  name: 'mp-work-schedule-detail-block',
  components: {
    mpBlock,
    workSchedule,
    noData,
  },
  props: {
    schedule: {
      type: Object as () => OpeningHours,
      default: null,
    },
    timezone: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    invalid: {
      editWorkSchedule: false,
    },
    localSchedule: [] as DateInterval[][],
    editWorkSchedule: getDefaultOpenningHour(),
    days: SHORT_DAY,
    hasEditIcon: true,
    showModal: false,
  }),
  beforeMount() {
    if (this.schedule) {
      this.editWorkSchedule = JSON.parse(JSON.stringify(this.schedule))

      this.convertArrayToOpeningHours(this.schedule)
    }
  },
  computed: {
    getLocalSchedule() {
      const currentDate = dateHelper.getDate()
      return this.localSchedule.map(slot =>
        slot.sort(({ start }, { start: secondStart }) => {
          const [currentStartHours, currentStartMinutes] = start
            .split(':')
            .map((time: string) => Number(time))
          const [secondStartHours, secondStartMinutes] = secondStart
            .split(':')
            .map((time: string) => Number(time))

          if (
            dateHelper.isAfter(
              dateHelper.set(currentDate, {
                hours: currentStartHours,
                minutes: currentStartMinutes,
              }),
              dateHelper.set(currentDate, {
                hours: secondStartHours,
                minutes: secondStartMinutes,
              }),
            )
          ) {
            return 1
          } else {
            return -1
          }
        }),
      )
    },
  },
  mounted() {
    if (this.schedule) {
      this.createLocalSchedule()
      this.convertArrayToOpeningHours(this.schedule)
    }
  },
  methods: {
    createLocalSchedule() {
      this.localSchedule = []
      this.localSchedule.push(
        this.schedule.monday || [],
        this.schedule.tuesday || [],
        this.schedule.wednesday || [],
        this.schedule.thursday || [],
        this.schedule.friday || [],
        this.schedule.saturday || [],
        this.schedule.sunday || [],
      )
    },
    async handleSubmit() {
      try {
        await ExchangePlaceService.update(this.$route.params.exchangePlaceId, {
          openingHours: this.editOpeningHours,
        }),
          this.$emit('updateModalData')
        this.$store.dispatch('setSnackbar', {
          message: this.$t('messages.openingHoursUpdated'),
          type: SnackBarType.SUCCESS,
        })
      } catch (err) {
        this.$store.dispatch('setSnackbar', {
          type: SnackBarType.ERROR,
          message: this.$t('messages.error'),
        })
      } finally {
        this.showModal = false
      }
    },

    convertArrayToOpeningHours(schedule: Record<string, { start: string; end: string }[]>): any {
      for (const dayOfWeek of Object.keys(schedule)) {
        const timeSlotsForDay = schedule[dayOfWeek]
        if (timeSlotsForDay) {
          const formattedTimeSlots = timeSlotsForDay.map(timeSlot => ({
            ...timeSlot,
            fakeId: v4(),
            start: timeSlot.start,
            end: timeSlot.end,
          }))
          this.editWorkSchedule[dayOfWeek] = formattedTimeSlots
        }
      }

      return this.editWorkSchedule
    },
  },
  watch: {
    schedule(next) {
      console.log('schedule watcher')
      this.createLocalSchedule()
      this.convertArrayToOpeningHours(next)
    },
  },
})
</script>

<style lang="scss">
#work-schedule-detail {
  padding: 0;

  @media #{map-get($display-breakpoints, 'xs-only')} {
    border-top: solid 0.1rem $main-lighten-74-color;
  }

  .schedule {
    padding-bottom: 1.6rem;
    margin-bottom: 1.6rem;
    border-bottom: solid 0.1rem $main-lighten-74-color;
    display: flex;
    align-items: center;

    &:last-of-type {
      border-bottom: none;
      padding-bottom: 0;
      margin-bottom: 0;
    }

    .slot-wrapper {
      text-align: right;

      .slot {
        min-width: fit-content;

        span {
          min-width: fit-content;
        }
      }
    }
  }
}
</style>
