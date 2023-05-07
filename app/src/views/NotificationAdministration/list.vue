<template>
  <div id="notification-administration">
    <div id="overlay" v-if="showOverlayActionsMobile" />

    <content-header
      id="notification-administration__header"
      className="d-flex flex-column"
      v-if="$vuetify.breakpoint.smAndUp"
      dataId="notification-administration-list"
    >
      <template #breadcrumb>
        <mp-breadcrumb />
      </template>
      <template #title>
        <h1>{{ $t('page.notificationAdministration.title') }}</h1>
      </template>

      <template #actions-button v-if="canEdit && retailers.length > 1 && globalActions.length">
        <v-menu bottom offset-y origin="center top" transition="scale-transition">
          <template v-slot:activator="{ on, attrs }">
            <mp-button
              v-bind="attrs"
              v-on="on"
              dataId="notificationAdministrations-actions"
              format="secondary"
              :text="$t('action.base')"
              icon="apps"
            />
          </template>
          <v-list>
            <v-list-item
              :data-id="`notification-activation-global-${action.type}`"
              v-for="(action, index) in globalActions"
              :key="index"
              @click="
                handleGlobalActionsClick(action.type, {
                  ...(action.active && { active: action.active }),
                })
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
        </v-menu>
      </template>
    </content-header>
    <notif-admin-filters
      v-if="canAccessFilters"
      @submit="initData($event)"
      @reset="initData(defaultFilters)"
    />

    <v-row no-gutters>
      <v-col cols="10" offset="1">
        <mp-data-table
          :class="$vuetify.breakpoint.xsOnly ? 'mb-15' : ''"
          id="administration-row-list-data-table"
          :items="administrationRows"
          :headers="headers"
          :isCustomMobile="$vuetify.breakpoint.xsOnly"
          pageLabel=""
          :itemsPerPage="-1"
        >
          <template v-slot:retailerName="{ item }">
            <div class="d-flex align-center logo-container">
              <v-img
                class="mb-2"
                contain
                max-width="17.6rem"
                max-height="6rem"
                :src="item.logo"
                :alt="item.name"
                :data-id="`administration-row-list-${item.id}-logo`"
              />
              <span class="regular12 retailer-name">{{ item.name }}</span>
            </div>
          </template>

          <template v-slot:smsRange="{ item }">
            <notification-range
              :channel="item.notificationActivations.SMS.channel"
              :range="item.notificationActivations.SMS.range"
            />
          </template>

          <template v-slot:emailRange="{ item }">
            <notification-range
              :channel="item.notificationActivations.MAIL.channel"
              :range="item.notificationActivations.MAIL.range"
            />
          </template>

          <template v-slot:smsStatus="{ item }">
            <div class="d-flex align-center state-chip">
              <v-chip
                small
                :class="`${item.notificationActivations.SMS.active ? 'success' : 'failure'}`"
              >
                {{
                  $t(`common.${item.notificationActivations.SMS.active ? 'active' : 'inactive'}`)
                }}
              </v-chip>
            </div>
          </template>

          <template v-slot:emailStatus="{ item }">
            <div class="d-flex align-center state-chip">
              <v-chip
                small
                :class="`${item.notificationActivations.MAIL.active ? 'success' : 'failure'}`"
              >
                {{
                  $t(`common.${item.notificationActivations.MAIL.active ? 'active' : 'inactive'}`)
                }}
              </v-chip>
            </div>
          </template>

          <template v-if="canEdit" v-slot:actions="{ item }">
            <notification-activation-menu
              :administrationConfig="item"
              @enablingDisabling="enablingDisabling($event)"
              @openRangeModification="openRangeModification($event)"
              @deleteRangeAction="openDeleteRangeDialog($event)"
            />
          </template>

          <template v-slot:mobile="{ item }">
            <v-row no-gutters class="mt-2 mb-2">
              <v-col cols="12" class="d-flex justify-space-between">
                <v-img
                  contain
                  max-width="8rem"
                  max-height="4rem"
                  :src="item.logo"
                  :alt="item.name"
                  :data-id="`administration-row-list-${item.id}-logo`"
                />

                <v-icon v-if="!item.showActionsMobile && canEdit" @click="showListActionMobile(item)">
                  mdi-dots-vertical
                </v-icon>
              </v-col>

              <v-col cols="12" class="d-flex justify-space-between align-center mb-3">
                <span class="regular14 retailer-name">
                  {{ item.name }}
                </span>
              </v-col>

              <v-col cols="12" class="d-flex justify-space-between align-center state-chip">
                <span class="regular14 bold">
                  {{ $t('page.notificationAdministration.SMS') }}
                </span>

                <v-chip
                  small
                  :class="`${item.notificationActivations.SMS.active ? 'success' : 'failure'}`"
                >
                  {{
                    $t(`common.${item.notificationActivations.SMS.active ? 'active' : 'inactive'}`)
                  }}
                </v-chip>
              </v-col>

              <v-col cols="12" class="mobile-range mt-3 mb-4">
                <notification-range
                  :channel="item.notificationActivations.SMS.channel"
                  :range="item.notificationActivations.SMS.range"
                  :mobile="true"
                />
              </v-col>

              <v-col cols="12" class="d-flex justify-space-between align-center state-chip">
                <span class="regular14 bold">{{ $t('page.notificationAdministration.MAIL') }}</span>

                <v-chip
                  small
                  :class="`${item.notificationActivations.MAIL.active ? 'success' : 'failure'}`"
                >
                  {{
                    $t(`common.${item.notificationActivations.MAIL.active ? 'active' : 'inactive'}`)
                  }}
                </v-chip>
              </v-col>

              <v-col cols="12" class="mobile-range mt-3 mb-4">
                <notification-range
                  :channel="item.notificationActivations.MAIL.channel"
                  :range="item.notificationActivations.MAIL.range"
                  :mobile="true"
                />
              </v-col>
            </v-row>
          </template>
        </mp-data-table>
      </v-col>
    </v-row>

    <div
      class="mobile-action-buttons-wrapper"
      v-if="$vuetify.breakpoint.xsOnly && canEdit && retailers.length > 1 && globalActions.length"
    >
      <v-btn fab class="fab-button" v-if="!showActionsMobile" @click="showActionsMobile = true">
        <v-icon>mdi-apps</v-icon>
      </v-btn>
      <v-row no-gutters v-else v-click-outside="onClickOutside">
        <v-col
          cols="12"
          v-for="(action, index) in globalActions"
          :key="`action-${action.text}-${index}`"
          :class="
            `fab-actions${index === 0 ? ' first' : ''}${
              index === globalActions.length - 1 ? ' last' : ''
            }`
          "
        >
          <v-row
            no-gutters
            class="fab-actions-content"
            @click="
              handleGlobalActionsClick(action.type, {
                ...(action.active && { active: action.active }),
              })
            "
          >
            <v-col cols="12" class="fab-actions-text">
              <v-icon>{{ action.icon }}</v-icon>
              <span class="regular16">{{ action.text }}</span>
            </v-col>
            <v-col cols="12" v-if="index !== globalActions.length - 1">
              <div class="divider" />
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </div>

    <v-row
      no-gutters
      v-if="saveItem"
      class="mobile-action-buttons-wrapper menu-list"
      v-click-outside="showListActionMobile"
    >
      <notification-activation-list
        :administrationConfig="saveItem"
        @enablingDisabling="enablingDisabling($event)"
        @openRangeModification="openRangeModification($event)"
        @deleteRangeAction="openDeleteRangeDialog($event)"
      />
    </v-row>

    <set-range-modal
      v-if="displayRangeModal && modalProps"
      @reloadData="initData"
      @close="closeModal()"
      :action="modalProps.action"
      :retailerIds="modalProps.retailerIds"
      :notificationActivation="modalProps.notificationActivation"
    />

    <mp-dialog-confirmation
      v-if="displayEnableDisableAll && modalProps"
      classWrapper="enable-disable-all-modal"
      dataId="enable-disable-all-modal"
      persistent
      color="primary"
      :header="{
        iconClose: 'mdi-close',
        icon: $vuetify.breakpoint.smAndUp ? 'mdi-exclamation-thick' : '',
        isColorBackground: true,
      }"
      :btnCancel="{ text: $t('action.cancel.base'), format: 'link', linkColor: 'black' }"
      :btnValidation="{
        text: $t(
          `page.notificationAdministration.enableDisableModal.buttons.${modalProps.action}_Validate`,
        ),
        format: 'success',
        icon: 'content-save',
      }"
      @close="closeModal"
      @submit="globalActionsValidation(modalProps.action)"
    >
      <template #content>
        <v-row no-gutters justify="center" class="pt-8 mb-8">
          <v-col cols="8" class="text-center">
            <span class="regular16">{{
              $t(`page.notificationAdministration.enableDisableModal.${modalProps.action}_Content`)
            }}</span>
          </v-col>
        </v-row>
      </template>
    </mp-dialog-confirmation>

    <mp-dialog-confirmation
      v-if="showDeleteRangeDialog && modalProps"
      classWrapper="enable-disable-all-modal"
      dataId="delete-range-dialog"
      persistent
      color="primary"
      :header="{
        icon: $vuetify.breakpoint.smAndUp ? 'mdi-exclamation-thick' : 'mdi-exclamation-thick',
        isColorBackground: true,
        iconClose: 'mdi-close',
      }"
      :btnCancel="{ text: $t('action.cancel.base'), format: 'link', linkColor: 'black' }"
      :btnValidation="{
        text: $t(`action.delete.base`),
        format: 'error',
      }"
      @close="closeModal"
      @submit="deleteRange(modalProps.notificationActivation)"
      :textContent="
        $t(
          `page.notificationAdministration.deleteRangeModal.${modalProps.action}_${
            modalProps.notificationActivation.active ? 'DISABLED' : 'ENABLED'
          }_Content`,
        )
      "
    />
  </div>
</template>

<script lang="ts">
import mixins from 'vue-typed-mixins'

import contentHeader from '@/components/contentHeader/contentHeader.vue'
import mpBreadcrumb from '@/components/breadcrumb/breadcrumb.vue'
import notificationActivationList from './notificationActivationMenu/notificationActivationList.vue'

import { dateHelper } from '@/helpers/dateHelper'

import { ROUTES } from '@/constants'

import { authorizationMixin } from '@/mixins'
import RetailerService from '@/services/retailer/RetailerService'
import NotificationActivationsService from '@/services/notificationActivations/NotificationActivationsService'
import {
  NotificationActivationEntity,
  NotificationActivationRange,
  NotificationAdministrationConfig,
} from '@/types/entities/notificationActivations'
import notificationRange from './notificationRange/notificationRange.vue'
import notificationActivationMenu from './notificationActivationMenu/notificationActivationMenu.vue'
import AuthorizationService from '@/services/authorization/AuthorizationService'
import setRangeModal from './setRangeModal/setRangeModal.vue'
import { DataTableHeader, RetailerEntity } from '@/types'
import notifAdminFilters, { NotificationAdminFilters } from './filters/filters.vue'

export default mixins(authorizationMixin).extend({
  name: 'notification-administration',
  components: {
    contentHeader,
    mpBreadcrumb,
    notificationRange,
    notificationActivationMenu,
    setRangeModal,
    notifAdminFilters,
    notificationActivationList,
  },
  data: () => ({
    ROUTES,
    notificationActivations: null as Array<Record<string, any>> | null,
    retailers: null as RetailerEntity[] | null,
    administrationRows: [] as NotificationAdministrationConfig[],
    headers: [] as DataTableHeader[],
    dateHelper,
    canEdit: false,
    displayRangeModal: false,
    canAccessFilters: false,
    modalProps: null as {
      notificationActivation: NotificationActivationEntity | null
      action: string | null
      retailerIds?: number[] | null
    } | null,
    globalActions: [] as Array<{
      icon: string
      text: string
      type: string
      active?: boolean
    }> | null,
    displayEnableDisableAll: false,
    showDeleteRangeDialog: false,
    defaultFilters: {} as NotificationAdminFilters,
    currentFilters: {} as NotificationAdminFilters,
    showActionsMobile: false,
    saveItem: null as NotificationAdministrationConfig | null,
  }),
  computed: {
    showMenuListMobile(): boolean {
      return Boolean(this.administrationRows.find(row => row.showActionsMobile))
    },
    showOverlayActionsMobile(): boolean {
      return this.showActionsMobile || this.showMenuListMobile
    },
  },
  async beforeMount() {
    await this.initData()
  },
  methods: {
    async initData(filters?: NotificationAdminFilters): Promise<void> {
      if (filters) {
        this.currentFilters = filters
      }

      const { permissions } = this.$store.getters['auth/currentUser']
      const canEdit =
        permissions.length &&
        AuthorizationService.isAllowed('EDIT_NOTIFICATION_ACTIVATION', permissions)
      const [{ retailers }, notificationActivations] = await Promise.all([
        RetailerService.getAll({ ...(this.currentFilters?.retailerName && { name: this.currentFilters.retailerName }) }),
        NotificationActivationsService.getAll({
          ...(this.currentFilters?.retailerName && { retailerName: this.currentFilters.retailerName }),
        }),
      ])

      const { retailerIds } = AuthorizationService.getContext(permissions)

      this.administrationRows  = retailers.map(retailer => {
        return {
          name: retailer.name,
          logo: retailer.logo,
          id: retailer.id,
          notificationActivations: notificationActivations
            .filter(({ retailerId }) => retailerId === retailer.id)
            .reduce((acc, notificationActivation: NotificationActivationEntity) => {
              return { ...acc, [notificationActivation.channel]: notificationActivation }
            }, {} as Record<string, any>),
          showActionsMobile: false,
        }
      }).filter(({ notificationActivations: retailerActivations }) => retailerActivations.SMS && retailerActivations.MAIL)

      const filteredRetailerIds = this.administrationRows.map(({ id }) => id)

      this.canEdit = canEdit
      this.canAccessFilters = !retailerIds.length || retailerIds.length > 1

      const filteredNotificationActivation = notificationActivations.filter(({ retailerId }) => filteredRetailerIds.includes(retailerId))

      this.retailers = retailers.filter(({ id }) => filteredRetailerIds.includes(id ))
      this.notificationActivations = filteredNotificationActivation


      const headers = [
        { text: this.$t('common.retailer'), value: 'retailerName', sortable: false },
        {
          text: this.$t('page.notificationAdministration.SMS_status'),
          value: 'smsStatus',
          sortable: false,
        },
        {
          text: this.$t('page.notificationAdministration.SMS_range'),
          value: 'smsRange',
          sortable: false,
        },
        {
          text: this.$t('page.notificationAdministration.MAIL_status'),
          value: 'emailStatus',
          sortable: false,
        },
        {
          text: this.$t('page.notificationAdministration.MAIL_range'),
          value: 'emailRange',
          sortable: false,
        },
      ]

      if (canEdit) {
        headers.push({
          text: this.$t('page.notificationAdministration.actions'),
          value: 'actions',
          sortable: false,
        })
      }

      this.headers = headers

      this.setGlobalActions(filteredNotificationActivation)

      this.closeModal()
    },
    async enablingDisabling($event: any): Promise<void> {
      const { type, notificationActivation } = $event
      switch (type) {
        case 'ENABLE_SMS':
        case 'ENABLE_MAIL':
          await this.saveNotificationActivation(notificationActivation.id, {
            range: null,
            active: true,
          })
          break
        case 'DISABLE_SMS':
        case 'DISABLE_MAIL':
          await this.saveNotificationActivation(notificationActivation.id, {
            range: null,
            active: false,
          })
          break
      }

      await this.initData(this.currentFilters)

      if (this.$vuetify.breakpoint.xsOnly) {
        this.showListActionMobile({} as any)
      }
    },
    openRangeModification($event: {
      type: string
      notificationActivation: NotificationActivationEntity
    }): void {
      const { type: action, notificationActivation } = $event
      this.displayRangeModal = true
      this.modalProps = {
        action,
        notificationActivation,
      }

      if (this.$vuetify.breakpoint.xsOnly) {
        this.showListActionMobile({} as any)
      }
    },
    openDeleteRangeDialog($event: {
      type: string
      notificationActivation: NotificationActivationEntity
    }): void {
      const { type: action, notificationActivation } = $event

      this.showDeleteRangeDialog = true
      this.modalProps = {
        action,
        notificationActivation,
      }

      if (this.$vuetify.breakpoint.xsOnly) {
        this.showListActionMobile({} as any)
      }
    },
    deleteRange(notificationActivation: NotificationActivationEntity): void {
      this.saveNotificationActivation(notificationActivation.id, {
        range: null,
        active: notificationActivation.active,
      })
    },
    closeModal(): void {
      this.displayRangeModal = false
      this.displayEnableDisableAll = false
      this.showDeleteRangeDialog = false
      this.modalProps = null
    },
    async saveNotificationActivation(
      id: string,
      payload: { range: NotificationActivationRange | null; active: boolean },
    ): Promise<void> {
      await NotificationActivationsService.update(id, payload)
      await this.initData(this.currentFilters)
    },
    handleGlobalActionsClick(type: string, options: Record<string, any>): void {
      switch (type) {
        case 'ENABLE_ALL_SMS':
        case 'DISABLE_ALL_SMS':
        case 'ENABLE_ALL_MAIL':
        case 'DISABLE_ALL_MAIL': {
          this.modalProps = { action: type, notificationActivation: null }
          this.displayEnableDisableAll = true
          break
        }
        case 'SET_RANGE_ALL_MAIL':
        case 'SET_RANGE_ALL_SMS': {
          this.modalProps = {
            action: type,
            notificationActivation: {
              id: type,
              range: null,
              active: options.active,
              retailerId: 0,
              channel: type.includes('_MAIL') ? 'MAIL' : 'SMS',
            },
            retailerIds: this.retailers?.map(({ id }) => id)
          }
          this.displayRangeModal = true
        }
      }
    },
    async globalActionsValidation(type: string): Promise<void> {
      switch (type) {
        case 'ENABLE_ALL_SMS':
        case 'ENABLE_ALL_MAIL':
        case 'DISABLE_ALL_SMS':
        case 'DISABLE_ALL_MAIL': {
          const payload = {
            range: null,
            active: type.includes('ENABLE_'),
          }
          await this.updateAllNotificationByChannel(type.split('_').reverse()[0], payload)
          break
        }
      }

      await this.initData(this.currentFilters)
    },
    async updateAllNotificationByChannel(
      channel: string,
      payload: { active: boolean; range: NotificationActivationRange | null },
    ): Promise<NotificationActivationEntity[]> {
      return Promise.all(
        this.notificationActivations!.filter(
          ({ channel: notificationChannel, active }) =>
            notificationChannel === channel && active === !payload.active,
        ).map(({ id }) => NotificationActivationsService.update(id, payload)),
      )
    },
    setGlobalActions(notificationActivations: Array<Record<string, any>>): void {
      this.globalActions = [
        notificationActivations
          .filter(({ channel }) => channel === 'SMS')
          .every(({ active }) => !active)
          ? {
              text: this.$t('page.notificationAdministration.menu.enableSMS'),
              type: 'ENABLE_ALL_SMS',
              icon: 'mdi-message-bulleted',
            }
          : null,
        notificationActivations
          .filter(({ channel }) => channel === 'SMS')
          .every(({ active }) => active)
          ? {
              text: this.$t('page.notificationAdministration.menu.disableSMS'),
              type: 'DISABLE_ALL_SMS',
              icon: 'mdi-message-bulleted-off',
            }
          : null,
        notificationActivations
          .filter(({ channel }) => channel === 'SMS')
          .every(({ active }) => active)
          ? {
              text: this.$t('page.notificationAdministration.menu.setRangeSMS'),
              type: 'SET_RANGE_ALL_SMS',
              icon: 'mdi-calendar-month-outline',
              active: true,
            }
          : null,
        notificationActivations
          .filter(({ channel }) => channel === 'SMS')
          .every(({ active }) => !active)
          ? {
              text: this.$t('page.notificationAdministration.menu.setRangeSMS'),
              type: 'SET_RANGE_ALL_SMS',
              icon: 'mdi-calendar-month-outline',
              active: false,
            }
          : null,
        notificationActivations
          .filter(({ channel }) => channel === 'MAIL')
          .every(({ active }) => !active)
          ? {
              text: this.$t('page.notificationAdministration.menu.enableEmail'),
              type: 'ENABLE_ALL_MAIL',
              icon: 'mdi-email',
            }
          : null,
        notificationActivations
          .filter(({ channel }) => channel === 'MAIL')
          .every(({ active }) => active)
          ? {
              text: this.$t('page.notificationAdministration.menu.disableEmail'),
              type: 'DISABLE_ALL_MAIL',
              icon: 'mdi-email-off',
            }
          : null,
        notificationActivations
          .filter(({ channel }) => channel === 'MAIL')
          .every(({ active }) => active)
          ? {
              text: this.$t('page.notificationAdministration.menu.setRangeEmail'),
              type: 'SET_RANGE_ALL_MAIL',
              icon: 'mdi-calendar-month-outline',
              active: true,
            }
          : null,
        notificationActivations
          .filter(({ channel }) => channel === 'MAIL')
          .every(({ active }) => !active)
          ? {
              text: this.$t('page.notificationAdministration.menu.setRangeEmail'),
              type: 'SET_RANGE_ALL_MAIL',
              icon: 'mdi-calendar-month-outline',
              active: false,
            }
          : null,
      ].filter(item => item !== null) as Array<{
        icon: string
        text: string
        type: string
        active?: boolean
      }>
    },
    onClickOutside(): void {
      this.showActionsMobile = false
    },
    showListActionMobile(item: NotificationAdministrationConfig): void {
      if (!item.id) {
        this.administrationRows.find(row => row.id === this.saveItem!.id)!.showActionsMobile = false
        this.saveItem = null
        return
      }

      this.administrationRows.find(row => row.id === item.id)!.showActionsMobile = true
      this.saveItem = item
    },
  },
})
</script>

<style lang="scss">
#notification-administration {
  .label, .retailer-name {
    color: $main-lighten-52-color;
  }

  .bold {
    font-weight: bold !important;
  }

  .logo-container {
    flex-direction: column;

    .administration-row-row__logo-name {
      min-width: 20rem;
      text-align: center;
      color: $main-lighten-52-color;
      word-break: break-word;
    }
  }

  .state-chip {
    .success {
      color: $white !important;
      background-color: $success-color !important;
      width: fit-content;
    }

    .failure {
      color: $white !important;
      background-color: $alert-color !important;
      width: fit-content;
    }
  }

  .mobile-wrapper {
    display: flex;
    min-width: 100%;
    justify-content: space-between;
    align-items: center;
    padding-left: 4%;
    padding-right: 4%;
    min-height: 6rem;
    max-width: 100vw;

    .content-wrapper {
      word-break: break-all;
      padding-bottom: 1rem;
      padding-top: 1rem;
      min-width: 100%;

      .logo-container {
        flex-direction: column;

        .administration-row-row__logo-name {
          min-width: 10rem;
          text-align: left;
          color: $main-lighten-52-color;
          word-break: break-word;
        }
      }

      .first-column {
        flex-direction: column;
      }

      .text-wrapper {
        max-width: calc(100vw - 35%);
        padding-left: 1rem;
      }

      .ellipsis {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      a {
        text-decoration: none;
      }

      .table-title {
        min-width: fit-content;
        margin-right: 1rem;
      }

      .flex-1 {
        flex: 1 1 auto;
        width: 40%;
      }

      .flex-2 {
        flex: 2 1 auto;
        width: 60%;
      }
    }

    .icon-wrapper {
      display: flex;
      justify-content: center;
      max-height: 2.4rem;
      margin-left: 1rem;

      .mdi-apps {
        &::after {
          display: none;
        }
      }
    }
  }

  #administration-row-list-data-table {
    .pointer {
      td {
        padding-top: 2rem;
        padding-bottom: 2rem;
      }
    }
  }

  .mobile-action-buttons {
    margin-bottom: 1rem;

    &-wrapper {
      position: fixed;
      bottom: 1rem;
      right: 2rem;

      &.menu-list {
        right: 3rem;
      }
    }
  }

  .mobile-action-buttons-wrapper {
    z-index: 3;

    .fab-button {
      background-color: $main-color;
      border: 0.2rem solid $white;

      i {
        color: $white;
      }
    }

    .fab-actions {
      min-height: 6rem;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      background-color: $white;
      margin-left: 1rem;
      color: $main-color;

      .fab-actions-content {
        align-self: flex-end;

        .fab-actions-text {
          padding-bottom: 1.5rem;
          padding-left: 1rem;
        }
      }

      &.first {
        border-top-left-radius: 0.4rem;
        border-top-right-radius: 0.4rem;
      }

      &.last {
        border-bottom-left-radius: 0.4rem;
        border-bottom-right-radius: 0.4rem;
      }

      .divider {
        height: 0.1rem;
        background-color: $main-lighten-65-color;
        width: 100%;
      }

      span {
        margin-left: 1rem;
      }

      i {
        color: $main-color !important;
      }
    }
  }

  .mobile-range {
    .range {
      text-align: right;
    }
  }
}
</style>
