<template>
  <div id="notifications-reporting">
    <content-header id="notification-administration-header" dataId="notifications-reporting-header">
      <template #breadcrumb>
        <mp-breadcrumb />
      </template>
      <template #title>
        <h1>{{ $t('page.detailOrder.notification.title') }}</h1>
      </template>
    </content-header>
    <notifications-list-filters
      @submit="resetList(), getNotificationsData()"
      @reset="resetList(), getNotificationsData()"
      :isStripActive="notifMultiSelect"
    >
      <template #actions v-if="$vuetify.breakpoint.smAndUp">
        <div class="carrier-list-actions-wrapper">
          <v-menu
            bottom
            offset-y
            origin="center top"
            transition="scale-transition"
            v-if="actions.length"
          >
            <template v-slot:activator="{ on, attrs }">
              <mp-button
                v-bind="attrs"
                v-on="on"
                dataId="notifications-actions"
                format="link"
                linkColor="black"
                :text="$t('action.base')"
                icon="apps"
                :disabled="!canEdit"
              />
            </template>
            <v-list class="reporting-action-list">
              <v-list-item
                v-for="(action, index) in actions"
                :key="`notifications-list-actions-${index}`"
                @click="handleActionsClick(action.type)"
                :data-id="`notifications-list-actions-${index}`"
              >
                <v-list-item-icon>
                  <v-icon class="actions-icons" v-text="action.icon" />
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title class="regular14" v-text="action.text" />
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
      </template>
    </notifications-list-filters>
    <v-row no-gutters>
      <v-col cols="10" offset="1" class="notifications-list-content">
        <div class="tabs-counter-wrapper">
          <v-tabs ref="tabs" :show-arrows="false" v-model="selectedRange">
            <v-tab
              v-for="(range, index) in tabs"
              class="tabs-range"
              :ref="`tabs-${range.type}`"
              :key="index"
              v-ripple="false"
              :data-id="`notifications-list-slider-${index}`"
            >
              <h2
                :class="
                  tabs[selectedRange] && tabs[selectedRange].type === range.type
                    ? 'main-color'
                    : 'main-lighten-52'
                "
              >
                {{ range.title }}
              </h2>
            </v-tab>
          </v-tabs>
          <div class="counter-wrapper">
            <span class="regular14 count-wrapper">{{ count }} {{ $t('technical.notifications.results') }}</span>
          </div>
        </div>
        <notifications-list
          :key="resetPage"
          :type="selectedAction"
          :notifMultiSelect="notifMultiSelect"
          class="table-margin"
          :items="notificationStates"
          :count="count"
          :pagination="pagination"
          :order="order"
          @getNotificationsData="getNotificationsData()"
          @getUpdatedPagination="getUpdatedPagination($event)"
          @deleteNotification="deleteNotificationById($event)"
          @switchNotification="switchActivationStatus($event)"
          @selectedItems="selectedItems($event)"
        />
      </v-col>
    </v-row>
    <v-col
      cols="12"
      class="controlStrip"
      v-click-outside="{
        handler: onClickOutsideStandard,
        include: include,
      }"
      v-if="notifMultiSelect"
    >
      <control-strip
        id="control-panel"
        @cancelPanel="cancelPanel()"
        @submitDelete="submitDelete($event)"
        @submitSwitch="submitSwitch($event)"
        @selectAllNotifications="selectAllNotifications()"
        :selectedAction="selectedAction"
        :type="selectedAction"
        :notificationsSelected="selectedItem || []"
        :controlStripSelectAllBtnStatus="controlStripSelectAllBtnStatus"
      />
    </v-col>
    <span> </span>
  </div>
</template>

<script lang="ts">
import mixins from 'vue-typed-mixins'
import AuthorizationService from '@/services/authorization/AuthorizationService'

import contentHeader from '@/components/contentHeader/contentHeader.vue'
import mpBreadcrumb from '@/components/breadcrumb/breadcrumb.vue'
import notificationsListFilters from './NotificationsListFilters.vue'
import NotificationsList from '@/views/Notifications/list/NotificationsList.vue'
import NotificationStatesService from '@/services/notificationStates/NotificationStatesService'
import {
  NotificationStatesEntity,
  NOTIFICATION_AFFILIATION_TYPES,
  NotificationsActions,
  NotificationsChannel,
  NotificationFilter,
} from '@/types'
import controlStrip from './NotificationsStrip.vue'
import { SnackBarType } from '@/store/types'
import { ROUTES } from '@/constants'
import { authorizationMixin } from '@/mixins'
import { filterFormMixin } from '@/mixins'

const defaultFilters = (): NotificationFilter => ({
  carrierId: null,
  retailerId: null,
  storeId: null,
  exchangePlaceId: null,
  sort: '',
  offset: null,
  limit: null,
  ids: null,
  event: null,
  channel: '',
  isActive: null,
  language: '',
  isReturn: undefined,
  isCarrierSetAside: undefined,
  filterBy: undefined,
  target: '',
})

export default mixins(authorizationMixin, filterFormMixin).extend({
  name: 'notifications-reporting',
  components: {
    contentHeader,
    mpBreadcrumb,
    notificationsListFilters,
    NotificationsList,
    controlStrip,
  },
  data: () => ({
    resetPage: false,
    NotificationsChannel,
    NotificationsActions,
    getAllNotificationsByAction: null as NotificationStatesEntity[] | null,
    controlStripSelectAllBtnStatus: false,
    filteredNotifications: null as NotificationStatesEntity[] | null,
    selectAll: false,
    selectedAction: '',
    selectedItem: null as NotificationStatesEntity[] | null,
    showSelectionPanel: false,
    selectedDeletedItems: null as NotificationStatesEntity[] | null,
    notifMultiSelect: false,
    actions: [] as Array<{ text: string; icon: string; type: string }>,
    notificationStates: [] as NotificationStatesEntity[],
    notificationsSelected: null as NotificationStatesEntity[] | null,
    selectedCount: null as number | null,
    contextFlatten: null as any,
    count: null as number | null,
    pagination: {
      offset: 0,
      limit: 10 as number | null,
    },
    order: {
      sortBy: 'name',
      sort: 'ASC',
    },
    defaultFilters: {
      offset: 0,
    },

    selectedRange: 0,
  }),
  async beforeMount() {
    this.setFilters({})
    const { permissions } = this.$store.getters['auth/currentUser']

    this.contextFlatten = AuthorizationService.getContext(permissions)

    await this.getNotificationsData()

    this.actions.push({
      text: this.$t('action.add.notificationState'),
      icon: 'mdi-plus',
      type: NotificationsActions.CREATE_NOTIFICATION,
    })

    this.actions.push({
      text: this.$t('page.notificationAdministration.deleteNotifications'),
      icon: 'mdi-trash-can-outline',
      type: NotificationsActions.DELETE_NOTIFICATIONS,
    })

    this.actions.push({
      text: this.$t('page.notificationAdministration.activateNotifications'),
      icon: 'mdi-toggle-switch',
      type: NotificationsActions.ACTIVATE_NOTIFICATIONS,
    })

    this.actions.push({
      text: this.$t('page.notificationAdministration.deactivateNotifications'),
      icon: 'mdi-toggle-switch-off-outline',
      type: NotificationsActions.DEACTIVATE_NOTIFICATIONS,
    })
  },
  async mounted() {
    const { hash } = location

    if (hash) {
      const tab = hash.substring(1)

      const range = tab.split('-')[1]

      this.selectedRange = this.tabs.findIndex(localTab => localTab.type === range)
    }

    window.location.hash = `-${this.tabs[this.selectedRange || 0].type}`

    if (this.$refs[`tabs-${NOTIFICATION_AFFILIATION_TYPES.ALL}`] || this.$refs.tab) {
      this.$nextTick(() => {
        const tab =
          (this.$refs[`tabs-${NOTIFICATION_AFFILIATION_TYPES.ALL}`] as any)[0] ||
          (this.$refs.tab as any)[0]
        const initial = tab.$el.offsetWidth
        const interval = setInterval(() => {
          if (tab) {
            if (tab.$el.offsetWidth !== initial) {
              clearInterval(interval)
              ;(this.$refs.tabs as any).callSlider()
            }
          }
        }, 500)
      })
    }
  },
  computed: {
    canEdit() {
      return this.isAuthorized('WRITE_NOTIFICATION_STATE')
    },
    tabs(): Array<{ title: string; type: string }> {
      if (
        this.contextFlatten.retailerIds.length === 1 &&
        this.contextFlatten.storeIds.length &&
        !this.contextFlatten.exchangePlaceIds.length
      ) {
        return [
          { title: this.$t('common.carrierRange.all'), type: NOTIFICATION_AFFILIATION_TYPES.ALL },
          {
            title: this.$t('common.store'),
            type: NOTIFICATION_AFFILIATION_TYPES.STORE,
          },
          {
            title: this.$t('page.store.detail.exchangePlace.title'),
            type: NOTIFICATION_AFFILIATION_TYPES.EXCHANGE_PLACE,
          },
        ]
      } else if (
        this.contextFlatten.retailerIds.length === 1 &&
        this.contextFlatten.exchangePlaceIds.length
      ) {
        return [
          {
            title: this.$t('page.store.detail.exchangePlace.title'),
            type: NOTIFICATION_AFFILIATION_TYPES.EXCHANGE_PLACE,
          },
        ]
      } else {
        return [
          { title: this.$t('common.carrierRange.all'), type: NOTIFICATION_AFFILIATION_TYPES.ALL },
          {
            title: this.$t('breadcrumbs.retailers'),
            type: NOTIFICATION_AFFILIATION_TYPES.RETAILER,
          },
          {
            title: this.$t('technical.notifications.storeId'),
            type: NOTIFICATION_AFFILIATION_TYPES.STORE,
          },
          {
            title: this.$t('page.store.detail.exchangePlace.title'),
            type: NOTIFICATION_AFFILIATION_TYPES.EXCHANGE_PLACE,
          },
        ]
      }
    },
  },
  methods: {
    resetList() {
      this.pagination = {
        offset: 0,
        limit: 10 as number | null,
      }
      this.resetPage = !this.resetPage
    },
    handleReset(): void {
      this.reset({ ...defaultFilters })
    },
    cancelPanel(): void {
      if (this.selectAll) {
        this.getNotificationsData()
        this.selectAll = !this.selectAll
        this.notifMultiSelect = !this.notifMultiSelect
        return
      }
      this.notifMultiSelect = !this.notifMultiSelect
    },
    selectAllNotifications(): void {
      this.selectAll = true
      this.getNotificationsData({}, (this.selectAll = true))
    },
    async submitDelete(): Promise<void> {
      let filters
      if (this.selectAll) {
        filters = this.$store.getters['filters/filters']
      } else {
        filters = { ids: this.selectedItem?.map(item => item.id) }
      }
      try {
        await NotificationStatesService.bulkDelete(filters as any)
        this.getNotificationsData()
        this.notifMultiSelect = false

        this.$store.dispatch('setSnackbar', {
          type: SnackBarType.SUCCESS,
          message: this.$t('technical.notifications.bulkDelete'),
        })
      } catch (e) {
        this.$store.dispatch('setSnackbar', {
          type: SnackBarType.ERROR,
          message: this.$t('messages.error'),
        })
      }
    },
    async submitSwitch(type: any): Promise<void> {
      let filters
      if (this.selectAll) {
        filters = this.$store.getters['filters/filters']
      } else {
        filters = { ids: this.selectedItem?.map(item => item.id) }
      }
      try {
        await NotificationStatesService.bulkUpdate(filters as any, {
          isActive: !this.selectedItem![0].isActive,
        })
        this.getNotificationsData()
        this.notifMultiSelect = false

        this.$store.dispatch('setSnackbar', {
          type: SnackBarType.SUCCESS,
          message:
            type === 'DEACTIVATE_NOTIFICATIONS'
              ? this.$t('technical.notifications.bulkUpdateDeactivation')
              : this.$t('technical.notifications.bulkUpdateActivation'),
        })
      } catch (e) {
        this.$store.dispatch('setSnackbar', {
          type: SnackBarType.ERROR,
          message: this.$t('messages.error'),
        })
      }
    },
    selectedItems(event: any): void {
      this.selectAll = false
      this.selectedItem = event.item
      this.controlStripSelectAllBtnStatus = event.trigger
    },
    onClickOutsideStandard(): void {
      this.notifMultiSelect = false
    },
    include(): any[] | void {
      if (!this.notifMultiSelect) {
        return
      }
      const nodeList = document.querySelectorAll('.column-selectNotifications')
      const result = []
      for (const elem of nodeList) {
        result.push(elem)
      }
      result.push(document.querySelector('.data-table-header-checkbox'))
      return result
    },
    handleActionsClick(type: string): void {
      switch (type) {
        case NotificationsActions.CREATE_NOTIFICATION: {
          this.$router.push({ name: ROUTES.createNotification })
          this.selectedAction = type
          break
        }
        case NotificationsActions.ACTIVATE_NOTIFICATIONS: {
          ;(this.showSelectionPanel = true), (this.notifMultiSelect = !this.notifMultiSelect)
          this.selectedAction = type
          break
        }
        case NotificationsActions.DEACTIVATE_NOTIFICATIONS: {
          ;(this.showSelectionPanel = true), (this.notifMultiSelect = !this.notifMultiSelect)
          this.selectedAction = type
          break
        }
        case NotificationsActions.DELETE_NOTIFICATIONS: {
          ;(this.showSelectionPanel = true), (this.notifMultiSelect = !this.notifMultiSelect)
          this.selectedAction = type
          break
        }
      }
    },
    async getNotificationsData(params: Record<string, any> = {}, getAll = false): Promise<void> {
      let filters = this.$store.getters['filters/filters']
      const defaultParams = { count: true }

      const { hash } = location
      const range = hash.substring(1).split('-')[1]

      if (range && range !== 'all') {
        params = { ...params, filterBy: range }
      }

      if (getAll && this.selectedAction === NotificationsActions.ACTIVATE_NOTIFICATIONS) {
        filters = { ...filters, isActive: false }
      } else if (getAll && this.selectedAction === NotificationsActions.DEACTIVATE_NOTIFICATIONS) {
        filters = { ...filters, isActive: true }
      }

      const { count, notificationStates } = getAll
        ? await NotificationStatesService.getAll({
            ...defaultParams,
            ...filters,
            ...this.order,
            ...params,
          })
        : await NotificationStatesService.getAll({
            ...defaultParams,
            ...filters,
            ...this.pagination,
            ...this.order,
            ...params,
          })
      if (getAll) {
        this.getAllNotificationsByAction = notificationStates
        this.selectedCount = notificationStates.length
        this.selectedItem = notificationStates
      } else {
        this.notificationStates = notificationStates
        this.count = count
      }
    },
    async deleteNotificationById(id: string): Promise<void> {
      try {
        await NotificationStatesService.deleteById(id)
        this.getNotificationsData()

        this.$store.dispatch('setSnackbar', {
          type: SnackBarType.SUCCESS,
          message: this.$t('technical.notifications.deletedById'),
        })
      } catch (e) {
        this.$store.dispatch('setSnackbar', {
          type: SnackBarType.ERROR,
          message: this.$t('messages.error'),
        })
      }
    },
    async switchActivationStatus(item: NotificationStatesEntity): Promise<void> {
      try {
        await NotificationStatesService.update(item.id, { ...item, isActive: !item.isActive })
        this.getNotificationsData()
        this.$store.dispatch('setSnackbar', {
          type: SnackBarType.SUCCESS,
          message: item.isActive
            ? this.$t('technical.notifications.notificationDeactivated')
            : this.$t('technical.notifications.notificationActivated'),
        })
      } catch (e) {
        this.$store.dispatch('setSnackbar', {
          type: SnackBarType.ERROR,
          message: this.$t('messages.error'),
        })
      }
    },
  },
  watch: {
    selectedRange(next) {
      const { hash } = location
      window.location.hash = `${hash.substring(1).split('-')[0]}-${this.tabs[next].type}`

      this.getNotificationsData()
    },
    notifMultiSelect() {
      if (!this.notifMultiSelect) {
        this.selectedItem = null
        this.filteredNotifications = null
        this.selectAll = false
      }
      this.notificationStates = this.notificationStates.map(notif => {
        return { ...notif, selected: false }
      })
    },
  },
})
</script>

<style lang="scss">
.reporting-action-list {
  .v-list-item {
    padding: 0 2rem !important;
  }
  .actions-icons {
    color: $main-color !important ;
  }
  .v-list-item__icon {
    margin-right: 1.4rem !important;
  }
}

#notifications-reporting {
  .controlStrip {
    position: sticky;
    bottom: 2rem;
  }

  .tabs-counter-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .counter-wrapper {
    display: flex;
    justify-content: flex-end;
    & span {
      color: $main-lighten-52-color !important;
    }
  }

  .notifications-list-content {
    margin-top: 4.4rem;
    margin-bottom: 2rem;

    .v-tabs-slider-wrapper {
      height: 0.5rem !important;

      .v-tabs-slider {
        width: 4rem;
      }
    }

    .tabs-range {
      min-width: fit-content;
      margin-right: 3.8rem;
      padding: 0;
    }

    .notifications-list-cards-wrapper {
      margin-top: 5rem;
      display: grid;
      grid-template-columns: repeat(auto-fill, 17rem);
      justify-content: space-between;
      grid-gap: 3.8rem;
      grid-row-gap: 2.4rem;
    }

    .notifications-list-cards-wrapper-mobile {
      margin-top: 5rem;
      display: grid;
      grid-template-columns: repeat(auto-fill, 14rem);
      justify-content: space-between;
      grid-gap: 3.8rem;
      grid-row-gap: 2.4rem;
    }

    .count-wrapper {
      white-space: nowrap;
    }
  }
  .table-margin {
    margin-top: 4.9rem;
  }
}
</style>
