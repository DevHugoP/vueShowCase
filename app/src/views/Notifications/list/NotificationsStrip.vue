<template>
  <div id="control-panel" data-id="order-list-controlPanel" class="d-flex">
    <div class="d-flex align-center">
      <div
        v-if="
          !notificationsSelected.length &&
            !shownSelectAllBtn &&
            (selectedAction === NotificationsActions.ACTIVATE_NOTIFICATIONS ||
              selectedAction === NotificationsActions.DEACTIVATE_NOTIFICATIONS)
        "
      >
        <span
          v-if="selectedAction === NotificationsActions.ACTIVATE_NOTIFICATIONS"
          class="regular16 main-lighten-28"
        >{{ $t(`technical.notifications.noNotificationsToActivate`) }}</span>
        <span v-else class="regular16 main-lighten-28">{{
          $t(`technical.notifications.noNotificationsToDeactivate`)
        }}</span>
      </div>
      <div v-else>
        <span class="regular16 main-lighten-28"> {{ notificationsSelected.length }}</span>
        <span class="regular16 main-lighten-28">
          {{ $t(`technical.notifications.controlStripNotification`) }}</span>
      </div>
      <div @click="selectAll()" class="ml-4">
        <span v-if="shownSelectAllBtn" class="regular16 link-text ">{{
          $t(`technical.notifications.selectAllResults`)
        }}</span>
      </div>
    </div>
    <div align-center d-flex>
      <mp-button
        format="link"
        linkColor="black"
        :text="$t('action.cancel.base')"
        @click="cancelPanel()"
        dataId="order-list-controlPanel-cancel"
      />
      <mp-button
        format="black"
        :text="btnMessage"
        :disabled="!notificationsSelected.length"
        @click="submitPanel()"
        dataId="order-list-controlPanel-submit"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { NotificationStatesEntity, NotificationsActions } from '@/types'

export default Vue.extend({
  name: 'control-strip',
  props: {
    type: {
      type: String,
      required: true,
    },
    selectedAction: {
      type: String,
      required: false,
      default: '',
    },
    notificationsSelected: {
      type: Array as () => NotificationStatesEntity[],
      required: false,
      default: null,
    },
    controlStripSelectAllBtnStatus: {
      type: Boolean,
      required: false,
    },
  },
  data: () => ({
    allNotificationsCount: null as number | null,
    NotificationsActions,
    submitPanelOnGoing: false,
    btnMessage: '',
    counter: null as number | null,
    shownSelectAllBtn: true,
  }),
  mounted() {
    switch (this.type) {
      case NotificationsActions.ACTIVATE_NOTIFICATIONS: {
        this.btnMessage = this.$t('action.enable.base')
        break
      }
      case NotificationsActions.DEACTIVATE_NOTIFICATIONS: {
        this.btnMessage = this.$t(`action.disable.base`)
        break
      }
      case NotificationsActions.DELETE_NOTIFICATIONS: {
        this.btnMessage = this.$t(`action.delete.base`)
        break
      }
    }
  },
  methods: {
    selectAll(): void {
      this.shownSelectAllBtn = false
      this.$emit('selectAllNotifications')
    },
    cancelPanel(): void {
      this.$emit('cancelPanel')
    },
    submitPanel(): void {
      this.submitPanelOnGoing = true

      switch (this.type) {
        case NotificationsActions.DELETE_NOTIFICATIONS: {
          this.$emit('submitDelete')
          break
        }
        case NotificationsActions.ACTIVATE_NOTIFICATIONS: {
          this.$emit('submitSwitch', this.type)
          break
        }
        case NotificationsActions.DEACTIVATE_NOTIFICATIONS: {
          this.$emit('submitSwitch', this.type)
          break
        }
      }
      this.submitPanelOnGoing = false
    },
  },

  watch: {
    notificationsSelected(next, previous) {
      if (previous.length > next.length) {
        this.shownSelectAllBtn = true
      }
    },
  },
})
</script>

<style lang="scss">
#control-panel {
  justify-content: space-between;
  z-index: 10;
  background-color: $white;
  position: sticky;
  min-height: 5rem;
  margin: 0 3.4rem 0;
  padding: 2rem 4rem;
  border: 0.2rem solid $main-color;
  border-radius: 1rem;

  .font-resize {
    font-size: 1.6rem;
  }

  .link-text {
    text-decoration: underline;
    &.linkText:hover {
      cursor: pointer;
    }
  }

  .btn-wrapper {
    flex-wrap: wrap;
    justify-content: center;
  }

  .panel-title {
    @include h4-16-medium();
  }

  .main-panel__wrapper {
    max-width: fit-content;
  }

  .merge-icon__wrapper {
    text-align: center;

    .v-icon {
      color: $main-color;
    }
  }

  .orders-merge__wrapper {
    .v-chip {
      margin-right: 0.5rem;
    }
  }

  .empty-chip {
    width: 10rem;
    background-color: $white;
    border: 0.1rem dashed $main-color;
  }

  .max-width-chips {
    width: 85%;
  }

  .v-chip {
    height: 2rem;
    margin: 0;
    margin-bottom: 0.5rem;
    @include regular-12();

    &:not(.empty-chip) {
      background-color: $primary-color;
    }

    .v-chip__close {
      color: $main-color;
    }
  }
}
</style>
