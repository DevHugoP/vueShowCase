<template>
  <div id="notification-program">
    <v-row class="program-bloc" no-gutters>
      <v-col cols="10" offset="1">
        <h2>{{ $t('technical.notifications.program') }}</h2>
        <v-col cols="4" class="mt-8 align-box">
          <mp-select
            :label="$t('technical.notifications.trigger')"
            v-model="selectedTriggerStatus"
            :items="getTrigger"
            clearable
            attach="#notifications-program-trigger-select"
            dropdownId="notifications-program-trigger-select"
            dataId="notifications-program-trigger"
          />
        </v-col>
        <div class="select-container">
          <v-col cols="4" class="align-box">
            <mp-select
              :label="$t('technical.notifications.sendingDelay')"
              v-model="selectedSendingDelay"
              :items="getDelay"
              clearable
              attach="#notifications-program-sendingDelay-select"
              dropdownId="notifications-program-sendingDelay-select"
              dataId="notifications-program-sendingDelay"
            />
          </v-col>
          <v-col cols="4">
            <mp-select
              :label="$t('technical.notifications.closingDelay')"
              v-model="selectedClosingDelay"
              :items="getEventMaxAge"
              clearable
              attach="#notifications-program-closingDelay-select"
              dropdownId="notifications-program-closingDelay-select"
              dataId="notifications-program-closingDelay"
            />
          </v-col>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { SendingDate, NotificationsProgram, Delay } from '@/types'
import { ROUTES } from '@/constants'
import Vue from 'vue'

export default Vue.extend({
  name: 'notification-program',
  data: () => ({
    NotificationsProgram,
    selectedTriggerStatus: 'EVENT_RETRIEVED' as Delay | string | null,
    triggerStatus: [] as Array<{ value: any; text: string }>,
    selectedSendingDelay: null as Delay | string | null,
    selectedClosingDelay: null as Delay | string | null,
    delayHours: [] as number[],
    closingDelay: [] as number[],
  }),
  props: {
    selectedEvent: {
      type: String,
      default: null,
      required: false,
    },
    typeOfEvent: {
      type: String,
      default: null,
      required: false,
    },
    editTriggerStatus: {
      type: String,
      default: null,
      required: false,
    },
    editSendingDelay: {
      type: Object as () => Delay | null,
      default: null,
      required: false,
    },
    editClosingDelay: {
      type: Object as () => Delay | null,
      default: null,
      required: false,
    },
  },
  mounted() {
    this.editValues()
    this.delayHours = [1, 2, 3, 4, 5, 6, 12, 24, 48]
    this.closingDelay = [1, 2, 3, 4, 5, 6, 12, 24, 48]
  },

  computed: {
    isEditing(): boolean {
      return this.$route.name === ROUTES.editNotification
    },
    getEventMaxAge(): Array<{ value: any; text: string }> {
      const unit = 'hours'
      const eventMaxAge = this.closingDelay.map(delay => {
        return {
          value: JSON.stringify({ unit, value: delay }),
          text: `${this.$t(`technical.notifications.delay.detail`, {
            value: delay,
            unit: 'hour',
          })}`,
        }
      })
      return [
        {
          value: null,
          text: this.$t(`technical.notifications.eventMaxAge.noDelay`),
        },
        ...eventMaxAge,
      ]
    },
    getDelay(): Array<{ value: any; text: string }> {
      const unit = 'hours'
      const delays = this.delayHours.map(delay => {
        return {
          value: JSON.stringify({ unit, value: delay }),
          text: `${this.$t(`technical.notifications.delay.detail`, {
            value: delay,
            unit: 'hour',
          })}`,
        }
      })
      return [
        {
          value: null,
          text: this.$t(`technical.notifications.delay.noDelay`),
        },
        ...delays,
      ]
    },
    getTrigger(): Array<{ value: any; text: string }> {
      let triggerStatus
      if (this.typeOfEvent === 'DELIVERY') {
        triggerStatus = Object.values(SendingDate).map(item => {
          return {
            value: item,
            text: this.$t([`technical.notifications.triggerStatus.${item}`]),
          }
        })
      } else if (
        this.selectedEvent === 'COLLECT_INIT' ||
        this.selectedEvent === 'COLLECT_STOCK_OK'
      ) {
        triggerStatus = [
          {
            value: null,
            text: this.$t(`technical.notifications.triggerStatus.EVENT_RETRIEVED`),
          },
        ]
      } else {
        triggerStatus = [
          {
            value: 'PICKING_DATE',
            text: this.$t('technical.notifications.triggerStatus.PICKING_DATE'),
          },
        ]
      }
      return [
        {
          value: null,
          text: this.$t(`technical.notifications.triggerStatus.EVENT_RETRIEVED`),
        },
        ...triggerStatus,
      ]
    },
  },
  methods: {
    editValues(): void {
      if (this.isEditing) {
        if (!this.editTriggerStatus) {
          this.selectedTriggerStatus = null
        } else if (this.editTriggerStatus === 'EVENT_RETRIEVED') {
          this.selectedTriggerStatus = null
        } else {
          this.selectedTriggerStatus = this.editTriggerStatus
        }
        if (!this.editSendingDelay) {
          this.selectedSendingDelay = null
        } else {
          this.selectedSendingDelay = JSON.stringify(this.editSendingDelay)
        }
        if (!this.editClosingDelay) {
          this.selectedClosingDelay = null
        } else {
          this.selectedClosingDelay = JSON.stringify(this.editClosingDelay)
        }
      } else {
        this.selectedTriggerStatus = null
      }
    },
  },
  watch: {
    typeOfEvent(): void {
      if (!this.isEditing) {
        this.selectedTriggerStatus = null
      }
    },
    selectedTriggerStatus(next, previous): void {
      if ((previous === 'PICKING_DATE' || previous === 'DELIVERY_DATE') && next === null) {
        if (this.selectedSendingDelay) {
          this.selectedSendingDelay.includes('-')
            ? (this.selectedSendingDelay = null)
            : this.selectedSendingDelay
        }
      }
      if (this.selectedTriggerStatus !== null) {
        this.delayHours = [1, 2, 3, 4, 5, 6, 12, 24, 48, -1, -2, -3, -4, -5, -6, -12, -24, -48]
      } else {
        this.delayHours = [1, 2, 3, 4, 5, 6, 12, 24, 48]
      }
      this.$emit('emitTriggerStatus', this.selectedTriggerStatus)
    },
    selectedEvent(): void {
      if (this.selectedEvent === 'COLLECT_INIT' || this.selectedEvent === 'COLLECT_STOCK_OK') {
        this.selectedTriggerStatus = null
      } else {
        return
      }
    },
    selectedSendingDelay(): void {
      this.$emit('emitSendingDelay', this.selectedSendingDelay)
    },
    selectedClosingDelay(): void {
      this.$emit('emitClosingDelay', this.selectedClosingDelay)
    },
  },
})
</script>

<style lang="scss">
#notification-program {
  .program-bloc {
    display: flex;
    flex-direction: column;
    min-height: 25rem;
  }

  .select-container {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .align-box {
    padding: 1.2rem 1.2rem 1.2rem 0;
  }
}
</style>
