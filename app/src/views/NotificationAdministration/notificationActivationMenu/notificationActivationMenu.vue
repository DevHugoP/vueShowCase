<template>
  <v-menu
    bottom
    left
    offset-y
    origin="center top"
    transition="scale-transition"
    v-if="menuItem"
  >
    <template v-slot:activator="{ on }">
      <v-icon
        v-on="on"
        :data-id="`notification-activation-menu-${administrationConfig.id}`"
      >
        mdi-dots-vertical
      </v-icon>
    </template>

    <notification-activation-list
      :administrationConfig="administrationConfig"
      @menuItem="menuItem"
      @enablingDisabling="$emit('enablingDisabling', $event)"
      @openRangeModification="$emit('openRangeModification', $event)"
      @deleteRangeAction="$emit('deleteRangeAction', $event)"
    />
  </v-menu>
</template>

<script lang="ts">
import Vue from 'vue'

import { NotificationAdministrationConfig } from '@/types/entities/notificationActivations'
import notificationActivationList from './notificationActivationList.vue'

export default Vue.extend({
  name: 'notification-activation-menu',
  components: {
    notificationActivationList,
  },
  props: {
    administrationConfig: {
      type: Object as () => NotificationAdministrationConfig | null,
      default: null,
    },
  },
  data: () => ({
    menuItem: [] as Array<{ icon: string; text: string; type: string }>,
  }),
})
</script>

<style lang="scss"></style>
