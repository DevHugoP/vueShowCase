<template>
  <v-list>
    <v-list-item
      :data-id="`notification-activation-item-${administrationConfig.id}-${action.type}`"
      v-for="(action, index) in menuItem"
      :key="`notification-config-action-${index}`"
      @click="handleActionsClick(action.type)"
      :class="
        `fab-actions${index === 0 ? ' first' : ''}${index === menuItem.length - 1 ? ' last' : ''}`
      "
    >
      <v-list-item-icon>
        <v-icon v-text="action.icon"></v-icon>
      </v-list-item-icon>
      <v-list-item-content>
        <v-list-item-title v-text="action.text"></v-list-item-title>
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>

<script lang="ts">
import Vue from 'vue'
import {
  NotificationActivationEntity,
  NotificationAdministrationConfig,
} from '@/types/entities/notificationActivations'

export default Vue.extend({
  name: 'notification-activation-list',
  props: {
    administrationConfig: {
      type: Object as () => NotificationAdministrationConfig | null,
      default: null,
    },
  },
  data: () => ({
    menuItem: [] as Array<{ icon: string; text: string; type: string }>,
  }),
  async beforeMount() {
    await this.initData()
  },
  methods: {
    async initData() {
      const smsNotificationActivation: NotificationActivationEntity = this.administrationConfig!
        .notificationActivations.SMS
      const emailNotificationActivation: NotificationActivationEntity = this.administrationConfig!
        .notificationActivations.MAIL

      const actionsItems = []

      // SMS
      actionsItems.push({
        text: this.$t(
          `page.notificationAdministration.menu.${
            smsNotificationActivation.active ? 'disableSMS' : 'enableSMS'
          }`,
        ),
        type: smsNotificationActivation.active ? 'DISABLE_SMS' : 'ENABLE_SMS',
        icon: smsNotificationActivation.active
          ? 'mdi-message-bulleted-off'
          : 'mdi-message-bulleted',
      })

      actionsItems.push({
        text: this.$t(
          `page.notificationAdministration.menu.${
            smsNotificationActivation.range ? 'deleteRangeSMS' : 'setRangeSMS'
          }`,
        ),
        type: smsNotificationActivation.range ? 'DELETE_RANGE_SMS' : 'SET_RANGE_SMS',
        icon: smsNotificationActivation.range
          ? 'mdi-trash-can-outline'
          : 'mdi-calendar-month-outline',
      })

      if (smsNotificationActivation.range) {
        actionsItems.push({
          text: this.$t('page.notificationAdministration.menu.modifyRangeSMS'),
          type: 'MODIFY_RANGE_SMS',
          icon: 'mdi-pencil',
        })
      }

      // EMAIL
      actionsItems.push({
        text: this.$t(
          `page.notificationAdministration.menu.${
            emailNotificationActivation.active ? 'disableEmail' : 'enableEmail'
          }`,
        ),
        type: emailNotificationActivation.active ? 'DISABLE_MAIL' : 'ENABLE_MAIL',
        icon: emailNotificationActivation.active ? 'mdi-email-off' : 'mdi-email',
      })

      actionsItems.push({
        text: this.$t(
          `page.notificationAdministration.menu.${
            emailNotificationActivation.range ? 'deleteRangeEmail' : 'setRangeEmail'
          }`,
        ),
        type: emailNotificationActivation.range ? 'DELETE_RANGE_MAIL' : 'SET_RANGE_MAIL',
        icon: emailNotificationActivation.range
          ? 'mdi-trash-can-outline'
          : 'mdi-calendar-month-outline',
      })

      if (emailNotificationActivation.range) {
        actionsItems.push({
          text: this.$t('page.notificationAdministration.menu.modifyRangeEmail'),
          type: 'MODIFY_RANGE_MAIL',
          icon: 'mdi-pencil',
        })
      }

      this.menuItem = actionsItems
    },
    handleActionsClick(type: string) {
      switch (type) {
        case 'DISABLE_SMS':
        case 'ENABLE_SMS': {
          this.$emit('enablingDisabling', {
            type,
            notificationActivation: this.administrationConfig!.notificationActivations.SMS,
          })
          break
        }

        case 'DISABLE_MAIL':
        case 'ENABLE_MAIL': {
          this.$emit('enablingDisabling', {
            type,
            notificationActivation: this.administrationConfig!.notificationActivations.MAIL,
          })
          break
        }

        case 'SET_RANGE_SMS':
        case 'SET_RANGE_MAIL':
        case 'MODIFY_RANGE_SMS':
        case 'MODIFY_RANGE_MAIL': {
          this.$emit('openRangeModification', {
            type,
            notificationActivation: this.administrationConfig!.notificationActivations[
              ['MODIFY_RANGE_SMS', 'SET_RANGE_SMS'].includes(type) ? 'SMS' : 'MAIL'
            ],
          })
          break
        }

        case 'DELETE_RANGE_MAIL':
        case 'DELETE_RANGE_SMS': {
          this.$emit('deleteRangeAction', {
            type,
            notificationActivation: this.administrationConfig!.notificationActivations[
              ['DELETE_RANGE_MAIL'].includes(type) ? 'MAIL' : 'SMS'
            ],
          })
          break
        }
      }
    },
  },
  watch: {
    administrationConfig: {
      deep: true,
      handler() {
        this.initData()
      },
    },
    menuItem: {
      immediate: true,
      deep: true,
      handler(next) {
        this.$emit('menuItem', next)
      },
    },
  },
})
</script>
