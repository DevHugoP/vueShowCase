<template>
  <div id="edit-notification" class="edit-notification-wrapper">
    <content-header id="edit-notification-header" dataId="edit-notification-header-id">
      <template #breadcrumb>
        <mp-breadcrumb />
      </template>
      <template #title>
        <h1>{{ $t('breadcrumbs.editNotification') }}</h1>
      </template>
      <template #actions-button>
        <div class="add-notification-actions">
          <mp-button
            :text="$t('action.cancel.base')"
            format="link"
            linkColor="black"
            dataId="edit-notification-cancel"
            @click="cancel()"
          />
          <mp-button
            :text="$t('action.save')"
            format="success"
            icon="content-save-outline"
            dataId="edit-notification-save"
            @click="submit()"
            :disabled="!canSubmitForm"
          />
        </div>
      </template>
    </content-header>
    <context
      v-if="notificationData"
      :editRetailerId="notificationData?.retailerId"
      :editStoreIds="notificationData?.storeId"
      :editCarriersIds="notificationData?.carrierId"
      :editExchangePlaceIds="notificationData?.exchangePlaceId"
      :editSetAsideCarrierIds="notificationData?.setAsideCarrierIds"
      @selectedSetAsideCarrier="
        $event.length ? (carrierSetAside = $event) : (carrierSetAside = null)
      "
      :typeOfEvent="typeOfEvent ? typeOfEvent : null"
    />

    <event
      :eventDataEdit="notificationData?.event"
      :subEventDataEdit="notificationData?.subEvent"
    />

    <notification-type
      :editSmsNotificationCheckbox="editSmsNotificationCheckbox"
      :editMailNotificationCheckbox="editMailNotificationCheckbox"
    ></notification-type>

    <notification-recipient
      v-if="notificationData"
      @reasignContact="target = $event"
      :editTarget="notificationData?.config.target"
      :event="notificationData?.event"
      :editRecipients="notificationData?.config.recipients"
      @getMappedContacts="mappedContacts = $event"
      :carrierId="notificationData?.carrierId"
      :carrierSetAside="carrierSetAside"
      :typeOfEvent="typeOfEvent ? typeOfEvent : null"
    />

    <notification-program
      v-if="notificationData"
      :typeOfEvent="typeOfEvent"
      :selectedEvent="selectedEvent"
      :editTriggerStatus="notificationData?.config.sendingDate"
      :editSendingDelay="notificationData?.config.delay"
      :editClosingDelay="notificationData?.config.eventMaxAge"
      @emitTriggerStatus="programTriggerStatus = $event"
      @emitSendingDelay="programSendingDelay = $event"
      @emitClosingDelay="programClosingDelay = $event"
    />

    <notification-messages
      v-if="notificationData"
      :showLabelReturn="showLabelReturn"
      :isActiveReturn="notificationData?.isActive"
      :isReturnEdit="notificationData?.isReturn"
      :closingDelay="programClosingDelay"
      :sendingDelay="programSendingDelay"
      :target="target"
      :event="typeOfEvent"
      :smsNotif="smsNotificationCheckbox"
      :mailNotif="mailNotificationCheckbox"
      :editConfig="notificationData?.config"
      :editLanguage="notificationData?.language"
      @getConfig="getConfig($event)"
    />
    <v-row no-gutters class="mb-4">
      <v-col cols="10" offset="1" class="bottom-actions-wrapper">
        <mp-button
          :text="$t('action.cancel.base')"
          format="link"
          linkColor="black"
          dataId="edit-notification-cancel-bottom"
          @click="cancel()"
        />
        <mp-button
          :text="$t('action.save')"
          format="success"
          icon="content-save-outline"
          dataId="edit-notification-save-bottom"
          @click="submit()"
          :disabled="!canSubmitForm"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import contentHeader from '@/components/contentHeader/contentHeader.vue'
import mpBreadcrumb from '@/components/breadcrumb/breadcrumb.vue'
import notificationProgram from '@/views/Notifications/create/components/program.vue'
import context from '@/views/Notifications/create/components/context.vue'
import notificationMessages from '@/views/Notifications/create/components/messages.vue'
import notificationRecipient from '@/views/Notifications/create/components/recipient.vue'
import event from '@/views/Notifications/create/components/event.vue'
import NotificationStateService from '@/services/notificationStates/NotificationStatesService'
import NotificationType from '@/views/Notifications/create/components/type.vue'

import {
  ConfigNew,
  Delay,
  MappedItem,
  MAIL_LABEL_EVENTS,
  Contact,
  NOTIFICATIONS_TARGET,
  DeliveryEvent,
  CollectEvent,
  NotificationItem,
  EventType,
  NotificationsChannel,
} from '@/types'
import Vue from 'vue'

import { SnackBarType } from '@/store/types'

import { ROUTES } from '@/constants'

export default Vue.extend({
  name: 'edit-notification',
  components: {
    contentHeader,
    mpBreadcrumb,
    context,
    notificationRecipient,
    notificationProgram,
    notificationMessages,
    NotificationType,
    event,
  },
  data: () => ({
    editSmsNotificationCheckbox: false,
    editMailNotificationCheckbox: false,
    showLabelReturn: false,
    canCreate: false,
    smsNotificationCheckbox: false,
    mailNotificationCheckbox: false,
    notificationData: null as NotificationItem | null,
    config: null as ConfigNew | any,
    eventReturnCheckbox: false,
    target: '' as NOTIFICATIONS_TARGET,
    carrierSetAside: [] as number[] | null,
    programTriggerStatus: null as string | null,
    programSendingDelay: null as Delay | string | null | MappedItem,
    programClosingDelay: null as Delay | string | null | MappedItem,
    channel: '' as NotificationsChannel.SMS | NotificationsChannel.MAIL,
    language: '' as Contact['language'],
    mappedContacts: [] as Contact[] | null,
    filteredContacts: null as Contact[] | null,
    typeOfEvent: '' as EventType.DELIVERY | EventType.COLLECT,
    selectedEvent: '' as DeliveryEvent | CollectEvent,
  }),
  computed: {
    canSubmitForm(): boolean {
      if (this.target === NOTIFICATIONS_TARGET.CUSTOM && !this.filteredContacts) {
        return false
      } else {
        return Boolean(this.target && this.canCreate)
      }
    },
  },
  async beforeMount() {
    await this.getNotificationById()
    this.getChannel()
  },
  methods: {
    validationConfig(): void {
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
          (this.config.MAIL ? !!Object.keys(this.config.MAIL).length : false) ||
          (this.config.SMS ? !!Object.keys(this.config.SMS).length : false)
        ) {
          this.canCreate = true
        } else this.canCreate = false
      } else {
        this.canCreate = false
      }
    },
    async getNotificationById(): Promise<void> {
      const notificationData = await NotificationStateService.get(this.$route.params.id)
      this.notificationData = notificationData.notificationState
      this.showLabelReturn = MAIL_LABEL_EVENTS.some(e => e.status === this.notificationData?.event)
      if (Object.values(DeliveryEvent).includes(this.notificationData!.event)) {
        this.typeOfEvent = EventType.DELIVERY
      } else {
        this.typeOfEvent = EventType.COLLECT
      }
      this.selectedEvent = this.notificationData?.event
      if (this.notificationData?.setAsideCarrierIds) {
        this.carrierSetAside = this.notificationData?.setAsideCarrierIds
      }
      if (this.notificationData!.channel === NotificationsChannel.SMS) {
        this.editSmsNotificationCheckbox = true
      } else if (this.notificationData!.channel === NotificationsChannel.MAIL) {
        this.editMailNotificationCheckbox = true
      }
    },
    async submit(): Promise<void> {
      try {
        await NotificationStateService.update(this.notificationData!.id, {
          config: {
            attachment: this.config![this.channel][this.language].attachment,
            content: this.config![this.channel][this.language].content,
            target: this.target,
            sendingDate: this.programTriggerStatus ? this.programTriggerStatus : 'EVENT_RETRIEVED',
            delay: JSON.parse(this.programSendingDelay),
            eventMaxAge: JSON.parse(this.programClosingDelay),
            senderName: this.config![this.channel][this.language].senderName
              ? this.config![this.channel][this.language].senderName
              : null,
            subject: this.config![this.channel][this.language].subject
              ? this.config![this.channel][this.language].subject
              : null,
            useDefault: this.config![this.channel][this.language].useDefault,
            recipients: this.mappedContacts.length ? this.filteredContacts : null,
          },
          isActive: this.config![this.channel][this.language].isActive,
          setAsideCarrierIds: this.carrierSetAside?.length ? this.carrierSetAside : null,
        })
        this.$store.dispatch('setSnackbar', {
          type: SnackBarType.SUCCESS,
          message: this.$t('technical.notifications.notificationUpdate'),
        })
      } catch (e) {
        this.$store.dispatch('setSnackbar', {
          type: SnackBarType.ERROR,
          message: this.$t('messages.error'),
        })
      } finally {
        this.$router.push({ name: ROUTES.notificationDetail, params: this.notificationData?.id })
      }
    },
    getChannel(): void {
      if (this.notificationData!.channel === NotificationsChannel.SMS) {
        this.smsNotificationCheckbox = true
      } else {
        this.mailNotificationCheckbox = true
      }
    },
    getConfig(config: ConfigNew): void {
      this.config = config
      this.channel = Object.keys(config)[0]
      this.language = Object.keys(config[this.notificationData!.channel])[0]
      this.validationConfig()
    },
    cancel() {
      this.$router.push({ name: ROUTES.notificationsReporting })
    },
  },
  watch: {
    mappedContacts() {
      if (this.mappedContacts!.length) {
        this.filteredContacts = this.mappedContacts!.map(contact => ({
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
  },
})
</script>
<style lang="scss">
#edit-notification {
  height: calc(100vh - 11rem);
  overflow: auto;

  .bottom-actions-wrapper {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
