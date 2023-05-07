<template>
  <v-row no-gutters class="notification-type-bloc" id="notification-type">
    <v-col cols="10" offset="1">
      <h2>{{ $t('common.type') }}</h2>
      <v-row no-gutters class="mt-8">
        <v-col cols="12" class="d-flex">
          <mp-checkbox-new
            v-if="(isEditing && editSmsNotificationCheckbox) || !isEditing"
            :disabled="isEditing"
            v-model="smsNotificationCheckbox"
            class="regular16 checkbox-color"
            :label="$t('page.notificationAdministration.SMS')"
            dataId="notifications-type-checkbox-SMS"
          />
          <mp-checkbox-new
            v-if="(isEditing && editMailNotificationCheckbox) || !isEditing"
            :disabled="isEditing"
            v-model="mailNotificationCheckbox"
            :class="`${'regular16'} ${'checkbox-color'} ${isEditing ? '' : 'ml-4'}`"
            :label="$t('page.notificationAdministration.MAIL')"
            dataId="notifications-type-checkbox-MAIL"
          />
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'
import { ROUTES } from '@/constants'

export default Vue.extend({
  name: 'notification-type',
  data: () => ({
    smsNotificationCheckbox: false,
    mailNotificationCheckbox: false,
  }),
  props: {
    editSmsNotificationCheckbox: {
      type: Boolean,
      required: false,
    },
    editMailNotificationCheckbox: {
      type: Boolean,
      required: false,
    },
  },
  computed: {
    isEditing(): boolean {
      return this.$route.name === ROUTES.editNotification
    },
  },
  watch: {
    smsNotificationCheckbox() {
      this.$emit('reasignSmsCheckbox', this.smsNotificationCheckbox)
    },
    mailNotificationCheckbox() {
      this.$emit('reasignMailCheckbox', this.mailNotificationCheckbox)
    },
    editSmsNotificationCheckbox(next) {
      if (this.isEditing) {
        this.smsNotificationCheckbox = next
      }
    },
    editMailNotificationCheckbox(next) {
      if (this.isEditing) {
        this.mailNotificationCheckbox = next
      }
    },
  },
})
</script>

<style lang="scss" scoped>
.checkbox-color {
}
</style>
