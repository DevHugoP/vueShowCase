<template>
  <div id="notifications-reporting-list">
    <mp-data-table
      id="notifications-list-data-table"
      :items="items"
      :headers="headers"
      :totalItems="count"
      @update:options="onOptionsUpdated"
      @changeCheckbox-selectNotifications="changeCheckbox($event)"
      :pageLabel="$t('common.page')"
      :footer-props="{ itemsPerPageOptions: [10, 25, 100], page: 4 }"
      :to="
        isAuthorized('READ_NOTIFICATION_STATE') && !notifMultiSelect
          ? {
            name: ROUTES.notificationDetail,
            paramKey: 'id',
            objectKey: 'id',
            toExclude: ['actions'],
          }
          : {
            toExclude: [],
          }
      "
    >
      <template v-slot:selectNotifications="{ item }" v-if="notifMultiSelect">
        <mp-checkbox-new
          class="regular16 checkbox-color included"
          :input-value="item.selected"
          v-model="item.selected"
          @change="storeValue"
          :disabled="
            (type === NotificationsActions.DEACTIVATE_NOTIFICATIONS && !item.isActive) ||
              (type === NotificationsActions.ACTIVATE_NOTIFICATIONS && item.isActive)
          "
        />
      </template>

      <template v-slot:channel="{ item }">
        <div :class="`table-channel-wrapper${!item.isActive ? ' disable' : ''}`">
          <v-icon
            v-if="item.channel === NotificationsChannel.SMS"
            size="1.8rem"
            :data-id="`notifications-list-${item.id}-channel-sms`"
          >
            mdi-message-reply-text
          </v-icon>
          <v-icon
            v-if="item.channel === NotificationsChannel.MAIL"
            size="1.8rem"
            :data-id="`notifications-list-${item.id}-channel-email`"
          >
            mdi-email
          </v-icon>
        </div>
      </template>

      <template v-slot:retailerId="{ item }">
        <span :class="`regular16${!item.isActive ? ' disable' : ''}`">{{
          item.retailerName ? item.retailerName : '--'
        }}</span>
      </template>

      <template v-slot:storeId="{ item }">
        <span :class="`regular16${!item.isActive ? ' disable' : ''}`">{{
          item.storeName ? item.storeName : '--'
        }}</span>
      </template>

      <template v-slot:exchangePlaceId="{ item }">
        <span :class="`regular16${!item.isActive ? ' disable' : ''}`">{{
          item.exchangePlaceName ? item.exchangePlaceName : '--'
        }}</span>
      </template>

      <template v-slot:carrierId="{ item }">
        <span :class="`regular16${!item.isActive ? ' disable' : ''}`">{{
          item.carrierName ? item.carrierName : '--'
        }}</span>
      </template>

      <template v-slot:setAsideCarrierIds="{ item }">
        <v-icon v-if="item.setAsideCarrierIds" class="success-color" size="1.8rem">
          mdi-check-bold
        </v-icon>
        <span
          v-if="!item.setAsideCarrierIds"
          :class="`regular16${!item.isActive ? ' disable' : ''}`"
        >{{ '--' }}</span>
      </template>

      <template v-slot:event="{ item }">
        <span :class="`regular14 main-lighten-28${!item.isActive ? ' disable' : ''}`">
          <mp-badge
            :leftIcon="`${eventIcon(item.event) ? 'truck' : 'cursor-default-click'}`"
            :data-id="`notification-list-${item.id}-status`"
            :content="
              $t([
                `technical.notifications.subject.${item.event}.${item.subEvent}`,
                `technical.notifications.subject.${item.event}.default`,
                `technical.notifications.subject.${item.event}`,
              ])
            "
          >
          </mp-badge>
        </span>
      </template>

      <template v-slot:language="{ item, language }">
        <span :class="`regular16 ${!item.isActive ? ' disable' : ''}`">{{
          language.toUpperCase()
        }}</span>
      </template>

      <template v-slot:actions="{ item }">
        <v-menu
          bottom
          left
          offset-y
          origin="center top"
          transition="scale-transition"
        >
          <template v-slot:activator="{ on }">
            <v-icon class="main-color" v-on="on">mdi-dots-vertical</v-icon>
          </template>
          <v-list>
            <v-list-item
              v-for="(action, index) in getActions(item)"
              :key="`notification-${item.id}-action-${index}`"
              @click="handleActionsClick(action.type, item)"
              :disabled="!canEdit"
            >
              <v-list-item-icon v-if="action.icon" class="action-wrapper">
                <v-icon v-text="action.icon" class="main-color" />
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title v-text="action.text" class="regular14" />
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
    </mp-data-table>

    <mp-dialog-confirmation
      v-if="showDeleteDialog"
      dataId="notification-dialog-delete"
      classWrapper="notifications-list-delete-dialog"
      color="error"
      :header="{
        iconClose: 'mdi-close',
        icon: 'mdi-trash-can-outline',
        isColorBackground: false,
      }"
      :textContent="$t('action.delete.notification')"
      :btnCancel="{ text: $t('action.cancel.base'), format: 'link', linkColor: 'red' }"
      :btnValidation="{
        text: $t('action.delete.base'),
        format: 'error',
      }"
      btnToColumn
      @close="showDeleteDialog = false"
      @submit="
        $emit('deleteNotification', selectedDeletedItem.id)
        showDeleteDialog = false
        selectedDeletedItem = null
      "
    />
  </div>
</template>

<script lang="ts">
import {
  DataTableHeader,
  NotificationStatesEntity,
  NotificationsActions,
  NotificationSingleActions,
  NotificationsChannel,
  DeliveryEvent,
} from '@/types'
import { ROUTES } from '@/constants'
import { authorizationMixin } from '@/mixins'
import mixins from 'vue-typed-mixins'

export default mixins(authorizationMixin).extend({
  name: 'notifications-list',
  props: {
    type: {
      type: String,
      default: '',
    },
    notifMultiSelect: {
      type: Boolean,
    },
    items: {
      type: Array as () => NotificationStatesEntity[],
      required: true,
    },
    count: {
      type: Number,
      default: 0,
    },
    pagination: {
      type: Object as () => {
        offset: number
        limit: number | null
      },
      required: true,
      default: null,
    },
    order: {
      type: Object as () => {
        sortBy: string
        sort: string
      },
      required: true,
      default: null,
    },
  },
  data: () => ({
    NotificationsChannel,
    NotificationsActions,
    NotificationSingleActions,
    event: false,
    filteredItems: [] as NotificationStatesEntity[],
    selectedItems: [] as NotificationStatesEntity[],
    updateSelectedCount: null as any,
    showDeleteDialog: false,
    selectedDeletedItem: null as NotificationStatesEntity | null,
    ROUTES,
    showEnableModal: false,
    deliveryValues: Object.values(DeliveryEvent as object),
  }),
  computed: {
    canEdit() {
      return this.isAuthorized('WRITE_NOTIFICATION_STATE')
    },
    headers(): DataTableHeader[] {
      return [
        {
          text: 'checkbox-notification-header',
          value: 'selectNotifications',
          sortable: false,
          hide: !this.notifMultiSelect,
        },
        {
          text: this.$t('technical.notifications.format'),
          sortable: false,
          value: 'channel',
        },
        {
          text: this.$t('common.retailer'),
          sortable: false,
          value: 'retailerId',
        },
        {
          text: this.$t('common.store'),
          sortable: false,
          value: 'storeId',
        },
        {
          text: this.$t('technical.notifications.exchangePlaceHeader'),
          sortable: false,
          value: 'exchangePlaceId',
        },
        {
          text: this.$t('common.carrier'),
          sortable: false,
          value: 'carrierId',
        },
        {
          text: this.$t('technical.notifications.setAsideCarrierHeader'),
          sortable: false,
          value: 'setAsideCarrierIds',
        },
        {
          text: this.$t('common.event'),
          value: 'event',
          sortable: false,
        },
        {
          text: this.$t('common.language'),
          value: 'language',
          sortable: false,
        },
        { text: '', value: 'actions', sortable: false },
      ]
    },
  },
  methods: {
    eventIcon(event: string): any {
      if (this.deliveryValues.includes(event)) {
        return true
      } else return false
    },
    changeCheckbox(event: boolean): void {
      this.event = !this.event
      switch (this.type) {
        case NotificationsActions.ACTIVATE_NOTIFICATIONS: {
          this.items
            .filter(item => item.isActive === false)
            .forEach(item => (item.selected = event))
          break
        }
        case NotificationsActions.DEACTIVATE_NOTIFICATIONS: {
          this.items.filter(item => item.isActive).forEach(item => (item.selected = event))
          break
        }
        case NotificationsActions.DELETE_NOTIFICATIONS: {
          this.items.forEach(item => (item.selected = event))
          break
        }
        default:
          break
      }
      this.$emit('selectedItems', {
        item: this.items.filter(item => item.selected),
        trigger: event,
      })
    },
    storeValue(): void {
      this.$emit('selectedItems', {
        item: this.items.filter(item => item.selected),
        trigger: this.event,
      })
    },
    handleActionsClick(type: string, item: NotificationStatesEntity): void {
      switch (type) {
        case NotificationSingleActions.EDIT_NOTIFICATION: {
          const id = item.id.toString()
          this.$router.push({
            name: ROUTES.editNotification,
            params: { id },
          })
          break
        }
        case NotificationSingleActions.SWITCH_NOTIFICATION: {
          this.$emit('switchNotification', item)
          break
        }
        case NotificationSingleActions.DELETE_NOTIFICATION: {
          this.selectedDeletedItem = item
          this.showDeleteDialog = true
          break
        }
      }
    },
    onOptionsUpdated(options: Record<string, any>): void {
      const {
        page,
        itemsPerPage,
        sortBy: [sortBy],
        sortDesc: [sortDesc],
      } = options

      this.pagination.limit = itemsPerPage ? itemsPerPage : null
      this.pagination.offset = itemsPerPage * (page - 1)

      this.order.sortBy = sortBy ?? 'name'
      this.order.sort = sortDesc ? 'DESC' : 'ASC'

      this.$emit('getNotificationsData')
    },

    getActions(item: NotificationStatesEntity): Record<string, any> {
      const actions = []

      actions.push(
        {
          text: this.$t('action.modify.base'),
          icon: 'mdi-pencil',
          type: NotificationSingleActions.EDIT_NOTIFICATION,
        },
        {
          text: this.$t('action.delete.base'),
          icon: 'mdi-trash-can-outline',
          type: NotificationSingleActions.DELETE_NOTIFICATION,
        },
      )
      if (!item.isActive) {
        actions.splice(1, 0, {
          text: this.$t('action.enable.base'),
          icon: 'mdi-toggle-switch',
          type: NotificationSingleActions.SWITCH_NOTIFICATION,
        })
      } else {
        actions.splice(1, 0, {
          text: this.$t('action.disable.base'),
          icon: 'mdi-toggle-switch-off-outline',
          type: NotificationSingleActions.SWITCH_NOTIFICATION,
        })
      }
      return actions
    },
  },
})
</script>

<style lang="scss">
.v-list-item__icon {
  margin-right: 1.4rem !important;
}
#notifications-list-data-table {
  .v-data-table__wrapper {
    .pointer {
      a {
        text-decoration: none;
      }
    }

    .contact-wrapper {
      display: flex;
      flex-direction: column;
    }

    .column-name {
      width: 17.6rem;
    }
  }

  .v-badge__badge {
    padding: 1.3rem !important;
    border-radius: 2rem !important;
    gap: 0.4rem !important;
  }

  .table-channel-wrapper {
    gap: 0.5rem;
    align-items: center;
  }

  .disable {
    opacity: 0.35;
  }

  .channel-text {
    white-space: nowrap;
  }
}

.notifications-list-delete-dialog {
  .actions-wrapper {
    display: flex;
    align-items: center;

    .mp-button--error {
      max-width: fit-content;
    }
  }
}
</style>
