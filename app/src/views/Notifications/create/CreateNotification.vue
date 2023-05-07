<template>
  <div id="add-notification" class="add-notification-wrapper">
    <content-header id="add-notification-header" dataId="add-notification-header-id">
      <template #breadcrumb>
        <mp-breadcrumb />
      </template>
      <template #title>
        <h1>{{ $t('technical.notifications.state.create') }}</h1>
      </template>
      <template #actions-button>
        <div class="add-notification-actions">
          <mp-button
            :text="$t('action.cancel.base')"
            format="link"
            linkColor="black"
            dataId="add-notification-cancel"
            @click="cancel()"
          />
          <mp-button
            :text="$t('action.save')"
            format="success"
            icon="content-save-outline"
            dataId="add-notification-save"
            @click="submit()"
            :disabled="!canSubmitForm"
          />
        </div>
      </template>
    </content-header>
    <context
      @selectedRetailerId="retailerId = $event"
      @selectedStores="$event.length ? (storeId = $event) : (storeId = null)"
      @selectedExchangePlaces="
        $event.length ? (exchangePlaceId = $event) : (exchangePlaceId = null)
      "
      @selectedCarriers="$event.length ? (carrierId = $event) : (carrierId = null)"
      @selectedSetAsideCarrier="$event ? (carrierSetAside = $event) : (carrierSetAside = null)"
      :typeOfEvent="typeOfEvent ? typeOfEvent : null"
    />
    <event
      :carrierId="carrierId"
      :carrierSetAside="carrierSetAside ? (carrierSetAside.length ? carrierSetAside : null) : null"
      @getEventCheckboxData="getEventCheckboxData($event)"
      @getEventData="
        ;(selectedEvent = $event ? $event.id : null),
          (subEvent = $event ? ($event.subEvent ? $event.subEvent : null) : null)
      "
      @typeOfEvent="typeOfEvent = $event ? $event : null"
      @checkEventLabelReturn="showLabelReturn = $event ? $event : null"
    />
    <notification-type
      @reasignSmsCheckbox="reasignSmsCheckbox($event)"
      @reasignMailCheckbox="reasignMailCheckbox($event)"
    />
    <notification-recipient
      :carrierId="carrierId"
      :carrierSetAside="carrierSetAside ? (carrierSetAside.length ? carrierSetAside : null) : null"
      @reasignContact="target = $event"
      :typeOfEvent="typeOfEvent"
      @getMappedContacts="mappedContacts = $event"
    />
    <notification-program
      :selectedEvent="selectedEvent"
      @emitTriggerStatus="programTriggerStatus = $event"
      @emitSendingDelay="programSendingDelay = $event"
      @emitClosingDelay="programClosingDelay = $event"
      :typeOfEvent="typeOfEvent"
    />
    <notification-messages
      @chipsLanguages="chipsLanguages = $event"
      :showLabelReturn="showLabelReturn"
      :closingDelay="programClosingDelay"
      :sendingDelay="programSendingDelay"
      :target="target"
      :event="typeOfEvent"
      :smsNotif="smsNotificationCheckbox"
      :mailNotif="mailNotificationCheckbox"
      :isReturnCheckbox="eventReturnCheckbox"
      @getConfig="getConfig($event)"
    />
    <v-row no-gutters class="mb-4">
      <v-col cols="10" offset="1" class="bottom-actions-wrapper">
        <mp-button
          :text="$t('action.cancel.base')"
          format="link"
          linkColor="black"
          dataId="add-notification-cancel"
          @click="cancel()"
        />
        <mp-button
          :text="$t('action.save')"
          format="success"
          icon="content-save-outline"
          dataId="add-notification-save"
          @click="submit()"
          :disabled="!canSubmitForm"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import mixins from 'vue-typed-mixins'
import { authorizationMixin } from '@/mixins'
import contentHeader from '@/components/contentHeader/contentHeader.vue'
import mpBreadcrumb from '@/components/breadcrumb/breadcrumb.vue'
import context from './components/context.vue'
import notificationProgram from './components/program.vue'
import notificationMessages from './components/messages.vue'
import notificationType from './components/type.vue'
import notificationRecipient from './components/recipient.vue'
import event from '@/views/Notifications/create/components/event.vue'
import { ConfigNew, Delay, MappedItem, EventType, Contact, NOTIFICATIONS_TARGET } from '@/types'
import { SnackBarType } from '@/store/types'
import { ROUTES } from '@/constants'
import NotificationStateService from '@/services/notificationStates/NotificationStatesService'

interface contextData {
  id: number | string
  name: string
}
export default mixins(authorizationMixin).extend({
  name: 'create-notification',
  components: {
    contentHeader,
    mpBreadcrumb,
    context,
    event,
    notificationType,
    notificationRecipient,
    notificationProgram,
    notificationMessages,
  },
  data: () => ({
    chipsLanguages: null as any,
    showLabelReturn: false,
    canCreate: false,
    config: null as ConfigNew | null | any,
    smsNotificationCheckbox: false,
    mailNotificationCheckbox: false,
    eventReturnCheckbox: false,
    selectedEvent: null as contextData | null,
    target: '' as NOTIFICATIONS_TARGET,
    carrierId: null as number[] | null,
    retailerId: null as number[] | null,
    storeId: null as number[] | null,
    exchangePlaceId: null as number[] | null,
    carrierSetAside: [] as number[] | null,
    programTriggerStatus: null as string | null,
    programSendingDelay: null as Delay | string | null | MappedItem,
    programClosingDelay: null as Delay | string | null | MappedItem,
    subEvent: null as string | null,
    typeOfEvent: '' as EventType,
    mappedContacts: [] as Contact[],
    filteredContacts: null as Contact[] | null,
  }),
  computed: {
    canSubmitForm() {
      if (this.target === NOTIFICATIONS_TARGET.CUSTOM && !this.filteredContacts) {
        return false
      } else {
        return Boolean(this.retailerId && this.target && this.selectedEvent && this.canCreate)
      }
    },
  },
  methods: {
    validationConfig() {
      if (this.config) {
        this.config = {
          MAIL: this.config.MAIL
            ? Object.entries(this.config.MAIL).reduce((acc, [key, value]: any) => {
                if (!value.content && !value.useDefault) {
                  return acc
                } else if (!value.subject) {
                  return acc
                } else {
                  return { ...acc, [key]: value }
                }
              }, {})
            : null,
          SMS: this.config.SMS
            ? Object.entries(this.config.SMS).reduce((acc, [key, value]: any) => {
                if (!value.content && !value.useDefault) {
                  return acc
                }
                return {
                  ...acc,
                  [key]: {
                    ...value,
                    content: (value.content || '').replace(/<p>(.*?)<\/p>/s, '$1'),
                  },
                }
              }, {})
            : null,
        }
        if (
          (!Object.keys(this.config.SMS || []).length &&
            !Object.keys(this.config.MAIL || []).length) ||
          (this.mailNotificationCheckbox && !Object.keys(this.config.MAIL || []).length) ||
          (this.mailNotificationCheckbox &&
            Object.keys(this.config.MAIL || []).length !== this.chipsLanguages?.length) ||
          0 ||
          (this.smsNotificationCheckbox && !Object.keys(this.config.SMS || []).length) ||
          (this.smsNotificationCheckbox &&
            Object.keys(this.config.SMS || []).length !== this.chipsLanguages?.length) ||
          0
        ) {
          this.canCreate = false
          return
        }
        let isValid = true
        for (const language in this.config.MAIL) {
          if (this.config.MAIL[language]) {
            if (!this.config.MAIL[language].subject || !this.config.MAIL[language].content) {
              isValid = false
              break
            }
          }
        }
        for (const language in this.config.SMS) {
          if (this.config.SMS[language]) {
            if (!this.config.SMS[language].useDefault && !this.config.SMS[language].content) {
              isValid = false
              break
            }
          }
        }
        this.canCreate = isValid
      } else {
        this.canCreate = false
      }
    },
    reasignSmsCheckbox(typeSmsCheckbox: boolean): void {
      this.smsNotificationCheckbox = typeSmsCheckbox
    },
    reasignMailCheckbox(typeMailCheckbox: boolean): void {
      this.mailNotificationCheckbox = typeMailCheckbox
    },
    getEventCheckboxData(isReturn: boolean): void {
      this.eventReturnCheckbox = isReturn
    },
    getConfig(config: ConfigNew) {
      this.config = config
      this.validationConfig()
    },
    cancel() {
      this.$router.push({ name: ROUTES.notificationsReporting })
    },
    async submit() {
      if (this.mappedContacts) {
        this.filteredContacts = this.mappedContacts.map(contact => ({
          email: contact.email,
          phone: contact.phone,
          language: contact.language,
          lastName: contact.lastName,
          firstName: contact.firstName,
          timezone: contact.timezone,
        }))
      }
      try {
        await NotificationStateService.create({
          retailerId: this.retailerId,
          subEvent: this.subEvent,
          carrierIds: this.carrierId?.length ? this.carrierId : null,
          storeIds: this.storeId,
          exchangePlaceIds: this.exchangePlaceId,
          event: this.selectedEvent,
          config: {
            MAIL: this.config!.MAIL
              ? Object.entries(this.config!.MAIL).reduce((acc, [key, value]: any) => {
                  if (!value.content && !value.useDefault) {
                    return acc
                  }
                  return { ...acc, [key]: value }
                }, {})
              : null,
            SMS: this.config!.SMS
              ? Object.entries(this.config!.SMS).reduce((acc, [key, value]: any) => {
                  if (!value.content && !value.useDefault) {
                    return acc
                  }
                  return {
                    ...acc,
                    [key]: {
                      ...value,
                      content: (value.content || '').replace(/<p>(.*?)<\/p>/s, '$1'),
                    },
                  }
                }, {})
              : null,
            target: this.target,
            sendingDate: this.programTriggerStatus ? this.programTriggerStatus : 'EVENT_RETRIEVED',
            delay: JSON.parse(this.programSendingDelay),
            eventMaxAge: JSON.parse(this.programClosingDelay),
            recipients: this.filteredContacts!.length ? this.filteredContacts : null,
          },
          isReturn: this.eventReturnCheckbox,
          setAsideCarrierIds: this.carrierSetAside?.length ? this.carrierSetAside : null,
        })
        this.$store.dispatch('setSnackbar', {
          type: SnackBarType.SUCCESS,
          message: this.$t('technical.notifications.bulkCreation'),
        })
        this.$router.push({ name: ROUTES.notificationsReporting })
      } catch (e) {
        this.$store.dispatch('setSnackbar', {
          type: SnackBarType.ERROR,
          message: this.$t('messages.error'),
        })
      }
    },
  },
  watch: {
    chipsLanguages() {
      this.validationConfig()
    },
    mappedContacts() {
      if (this.mappedContacts!.length) {
        this.filteredContacts = this.mappedContacts.map(contact => ({
          email: contact.email,
          phone: contact.phone,
          lastName: contact.lastName,
          firstName: contact.firstName,
          timezone: contact.timezone,
          language: contact.language,
        }))
      } else {
        this.filteredContacts = null
      }
    },
    retailerId() {
      if (!this.carrierSetAside?.length) {
        this.carrierSetAside = null
      }
    },
    carrierSetAside() {
      if (!this.carrierSetAside?.length) {
        this.carrierSetAside = null
      }
    },
  },
})
</script>
<style lang="scss">
#add-notification {
  height: calc(100vh - 11rem);
  overflow: auto;

  .bottom-actions-wrapper {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
