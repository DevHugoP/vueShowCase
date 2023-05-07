<template>
  <div id="notification-event" dataId="notification-event">
    <v-row no-gutters class="notification-event-bloc" v-if="!isEditing">
      <v-col cols="10" offset="1">
        <v-row no-gutters class="d-flex align-center title-switch">
          <h2>{{ $t('technical.notifications.event') }}</h2>
          <v-col class="d-flex align-center">
            <mp-switch
              name="showCarrierSetAside"
              dataId="notifications-event-switch"
              v-model="eventSwitch"
            />
            <span :class="`regular16${eventSwitch ? '' : ' main-lighten-52'}`">{{
              $t('technical.notifications.statusFailed')
            }}</span>
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col class="mt-6">
            <div class="switch-container" dataId="notification-event-switchContainer">
              <button
                :class="`switch-box${switchStatus ? '' : ' switch-is-active'}`"
                @click="switchBtn(true)"
              >
                <v-icon class="mr-3">mdi-truck</v-icon>
                <p>{{ $t('common.delivery') }}</p>
              </button>
              <button
                :class="`switch-box${switchStatus ? ' switch-is-active' : ''}`"
                @click="carrierId || carrierSetAside ? null : switchBtn(false)"
              >
                <v-icon :class="`mr-3${carrierId || carrierSetAside ? ' main-lighten-52' : ''}`">
                  mdi-cursor-default-click
                </v-icon>
                <p :class="`${carrierId || carrierSetAside ? ' main-lighten-52' : ''} `">
                  {{ $t('technical.notifications.pickUpClick') }}
                </p>
              </button>
            </div>
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col cols="12">
            <timeline
              :selectedEvents="selectedEvents"
              @getSelectedEvent="getSelectedEvent($event)"
            />
          </v-col>
        </v-row>
        <v-row no-gutters v-if="displayReturn">
          <v-col cols="4">
            <mp-checkbox-new
              @change="$emit('getEventCheckboxData', $event)"
              dataId="notifications-event-checkbox-isReturn"
              v-model="eventReturnCheckbox"
              class="regular16 checkbox-color"
              :label="$t('technical.services.ORDER_SERVICE_RETURN')"
            />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row v-else no-gutters class="notification-event-bloc">
      <v-col cols="10" offset="1">
        <v-row no-gutters class="d-flex align-center title-switch">
          <h2>{{ $t('technical.notifications.event') }}</h2>
        </v-row>
        <v-row no-gutters class="my-5">
          <div class="edit-event-logo">
            <v-icon size="16" class="main-color">
              {{ eventIcon(eventDataEdit) ? 'mdi-truck' : 'mdi-cursor-default-click' }}
            </v-icon>
            <span class="regular14">{{
              eventIcon(eventDataEdit)
                ? $t('common.delivery')
                : $t('technical.notifications.pickUpClick')
            }}</span>
          </div>
        </v-row>
        <v-row no-gutters>
          <div class="event-text-wrapper">
            <span class="regular14 event-text-box">{{ $t([
              `technical.notifications.subject.${eventDataEdit}.${subEventDataEdit}`,
              `technical.notifications.subject.${eventDataEdit}.default`,
              `technical.notifications.subject.${eventDataEdit}`,
            ]), }}</span>
          </div>
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import timeline from './timeline.vue'
import Vue from 'vue'
import { ROUTES } from '@/constants'
import {
  DELIVERY_TIMELINE_EVENTS,
  COLLECT_TIMELINE_EVENTS,
  COLLECT_TIMELINE_FAILED_EVENTS,
  DELIVERY_TIMELINE_FAILED_EVENTS_CUSTOM,
  DELIVERY_TIMELINE_FAILED_EVENTS_FILTERED,
  MAIL_LABEL_EVENTS,
  MappedItem,
  EventType,
  DeliveryEvent,
} from '@/types'
export default Vue.extend({
  name: 'event',
  components: { timeline },

  props: {
    carrierId: {
      type: Array as () => number[] | null,
      required: false,
      default: null,
    },
    eventDataEdit: {
      type: String,
      required: false,
      default: null,
    },
    subEventDataEdit: {
      type: String,
      required: false,
      default: null,
    },
    carrierSetAside: {
      type: Array as () => number[] | null,
      required: false,
      default: null,
    },
  },
  data: () => ({
    deliveryValues: Object.values(DeliveryEvent as object),
    selectedEvent: null as MappedItem | null,
    switchStatus: false,
    eventSwitch: false,
    selectedEvents: null as MappedItem[] | null,
    deliveryEvents: null as MappedItem[] | null,
    deliveryEventsFailed: null as MappedItem[] | null,
    deliveryEventsWithCarrier: null as MappedItem[] | null,
    deliveryFailedEventsWithCarrier: null as MappedItem[] | null,
    pickupClickCollect: null as MappedItem[] | null,
    pickupClickCollectFailed: null as MappedItem[] | null,
    eventReturnCheckbox: false,
    subEvent: null as string | null,
    displayReturn: true as boolean,
    typeOfEvent: '',
  }),
  beforeMount() {
    const DeliveryFilterArr = Object.entries(DELIVERY_TIMELINE_EVENTS).filter(function([key]) {
      return key !== DELIVERY_TIMELINE_EVENTS.ORDER_CREATED
    })
    const filteredDeliveryTimelineEvents = Object.fromEntries(DeliveryFilterArr)
    this.deliveryEventsWithCarrier = Object.values(filteredDeliveryTimelineEvents as object).map(
      deliveryStatus => ({
        id: deliveryStatus,
        name: this.$t([
          `technical.notifications.subject.${deliveryStatus}.default`,
          `technical.notifications.subject.${deliveryStatus}`,
        ]),
      }),
    )
    this.deliveryEvents = Object.values(DELIVERY_TIMELINE_EVENTS as object).map(deliveryStatus => ({
      id: deliveryStatus,
      name: this.$t([
        `technical.notifications.subject.${deliveryStatus}.default`,
        `technical.notifications.subject.${deliveryStatus}`,
      ]),
    }))
    ;(this.deliveryEventsFailed = Object.values(
      DELIVERY_TIMELINE_FAILED_EVENTS_CUSTOM as object,
    ).map(deliveryStatus => ({
      id: deliveryStatus.status,
      name: this.$t([
        `technical.notifications.subject.${deliveryStatus.status}.${deliveryStatus.subStatus}`,
        `technical.notifications.subject.${deliveryStatus.status}.default`,
        `technical.notifications.subject.${deliveryStatus.status}`,
      ]),
      subEvent: deliveryStatus.subStatus ? deliveryStatus.subStatus : null,
    }))),
      (this.pickupClickCollect = Object.values(COLLECT_TIMELINE_EVENTS).map(item => ({
        id: item,
        name: this.$t([
          `technical.notifications.subject.${item}.default`,
          `technical.notifications.subject.${item}`,
        ]),
      })))
    this.pickupClickCollectFailed = Object.values(COLLECT_TIMELINE_FAILED_EVENTS).map(item => ({
      id: item,
      name: this.$t([
        `technical.notifications.subject.${item}.default`,
        `technical.notifications.subject.${item}`,
      ]),
    }))
    ;(this.deliveryFailedEventsWithCarrier = Object.values(
      DELIVERY_TIMELINE_FAILED_EVENTS_FILTERED as object,
    ).map(deliveryStatus => ({
      id: deliveryStatus.status,
      name: this.$t([
        `technical.notifications.subject.${deliveryStatus.status}.${deliveryStatus.subStatus}`,
        `technical.notifications.subject.${deliveryStatus.status}.default`,
        `technical.notifications.subject.${deliveryStatus.status}`,
      ]),
      subEvent: deliveryStatus.subStatus ? deliveryStatus.subStatus : null,
    }))),
      (this.selectedEvents = this.deliveryEvents)
    this.typeOfEvent = EventType.DELIVERY
    this.$emit('typeOfEvent', this.typeOfEvent)
  },
  computed: {
    isEditing(): boolean {
      return this.$route.name === ROUTES.editNotification
    },
  },
  methods: {
    eventIcon(event: string): any {
      if (this.deliveryValues.includes(event)) {
        return true
      } else return false
    },
    getSelectedEvent(event: MappedItem | any): void {
      this.selectedEvent = event
      this.$emit('getEventCheckboxData', this.eventReturnCheckbox)
      this.$emit('getEventData', this.selectedEvent)
    },
    switchPropsEvents(): void {
      this.selectedEvent = null
      if (this.switchStatus && this.eventSwitch && !this.carrierId && !this.carrierSetAside) {
        this.selectedEvents = this.pickupClickCollectFailed
        this.displayReturn = false
        this.typeOfEvent = EventType.COLLECT
        this.eventReturnCheckbox = false
      } else if (
        this.switchStatus &&
        !this.eventSwitch &&
        !this.carrierId &&
        !this.carrierSetAside
      ) {
        this.selectedEvents = this.pickupClickCollect
        this.displayReturn = false
        this.eventReturnCheckbox = false
        this.typeOfEvent = EventType.COLLECT
      } else if (
        !this.switchStatus &&
        !this.eventSwitch &&
        !this.carrierId &&
        !this.carrierSetAside
      ) {
        this.selectedEvents = this.deliveryEvents
        this.displayReturn = true
        this.typeOfEvent = EventType.DELIVERY
      } else if (
        !this.switchStatus &&
        this.eventSwitch &&
        !this.carrierId &&
        !this.carrierSetAside
      ) {
        this.selectedEvents = this.deliveryEventsFailed
        this.displayReturn = true
        this.typeOfEvent = EventType.DELIVERY
      } else if (
        !this.switchStatus &&
        this.eventSwitch &&
        (this.carrierId || this.carrierSetAside)
      ) {
        this.selectedEvents = this.deliveryFailedEventsWithCarrier
        this.displayReturn = true
        this.typeOfEvent = EventType.DELIVERY
      } else if (
        !this.switchStatus &&
        !this.eventSwitch &&
        (this.carrierId || this.carrierSetAside)
      ) {
        this.selectedEvents = this.deliveryEventsWithCarrier
        this.displayReturn = true
        this.typeOfEvent = EventType.DELIVERY
      }
      this.$emit('getEventData', this.selectedEvent)
    },
    switchBtn(e: boolean): void {
      this.switchStatus = !e
    },
  },
  watch: {
    carrierId() {
      if (this.carrierId) {
        this.switchBtn(true)
      }
      this.switchPropsEvents()
    },
    carrierSetAside() {
      if (this.carrierSetAside) {
        this.switchBtn(true)
      }
      this.switchPropsEvents()
    },
    selectedEvent() {
      if (this.selectedEvent) {
        this.$emit(
          'checkEventLabelReturn',
          MAIL_LABEL_EVENTS.some(e => e.status === this.selectedEvent?.id),
        )
      } else return
    },
    eventReturnCheckbox() {
      this.$emit('getEventCheckboxData', this.eventReturnCheckbox)
    },
    switchStatus() {
      this.switchPropsEvents()
      this.$emit('typeOfEvent', this.typeOfEvent)
    },
    eventSwitch() {
      this.switchPropsEvents()
      this.$emit('typeOfEvent', this.typeOfEvent)
    },
  },
})
</script>

<style lang="scss">
#notification-event {
  .notification-event-bloc {
    padding: 4.7rem 0;
    min-height: 25rem;
  }

  .title-switch {
    gap: 2rem;
  }

  .edit-event-logo {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
  }

  .event-text-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    align-items: center;
    border: 0.2rem $main-color solid;
    border-radius: 0.4rem;
    height: 6.8rem;
    width: 16.4rem;
    .event-text-box {
      display: flex;
      justify-content: center;
      padding: 1.5rem;
    }
  }

  .switch-container {
    width: 32rem;
    height: 5.5rem;
    border: 0.2rem $main-lighten-74-color solid;
    border-radius: 3rem;
    display: flex;
    align-items: center;
    justify-content: space-evenly;

    .switch-box {
      width: 16rem;
      height: 5.5rem;
      border: 0.2rem transparent;
      border-radius: 3rem;
      display: flex;
      align-items: center;
      justify-content: center;

      p {
        margin: 0;
      }
    }

    .switch-is-active {
      border: 0.2rem $main-color solid;
    }
  }
}
</style>
