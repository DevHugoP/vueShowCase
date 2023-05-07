<template>
  <v-container v-if="hasLoaded" id="detail-notification-state" data-id="detail-notification-state">
    <mp-block
      id="detail-notification-state-block"
      :title="$vuetify.breakpoint.smAndUp ? $t(`${title}`) : ''"
      :hasBorder="$vuetify.breakpoint.smAndUp"
      :hasMarginBottom="$vuetify.breakpoint.smAndUp"
      titleHasPaddingBottom
    >
      <v-row no-gutters class="chip-outer-wrapper">
        <v-col cols="12">
          <mp-chips-wrapper
            dataId="notificationState-chipsWrapper"
            :chips="availabledNotificationsChannel"
            textProps="label"
            @input="changeChannel($event.value)"
            v-model="currentChips"
          />
        </v-col>
      </v-row>

      <div
        class="flex-direction-column content-outer-wrapper"
        v-if="hasNotifications(currentNotifications)"
      >
        <v-row
          v-for="(notification, index) in currentNotifications"
          :key="`create-notification-states-${index}`"
          no-gutters
        >
          <v-col cols="12" v-if="notification.config.length">
            <h4 class="notificationLabel">
              {{ $t(`technical.notifications.eventTypes.${notification.label}`) }}
            </h4>
            <v-row
              v-for="(config, configIndex) in notification.config"
              class="notification-types"
              :key="`${currentChannel}-${config.event}-${configIndex}`"
              no-gutters
            >
              <v-col cols="12" class="d-flex justify-space-between">
                <router-link
                  :to="
                    (isAuthorized('READ_NOTIFICATION_STATE') && {
                      name: detailRoute,
                      params: {
                        carrierId,
                        retailerId,
                        storeId,
                        exchangePlaceId,
                        notificationStateId: config.id,
                      },
                    }) ||
                      ''
                  "
                  class="d-flex link-wrapper align-center"
                >
                  <div :class="`notification-state ${getIconColor(config)}`">
                    <v-icon v-if="isNotificationPlanned(config)">mdi-clock</v-icon>
                    <v-icon v-else-if="isNotificationActive(config)">mdi-check-circle</v-icon>
                    <v-icon color="red" v-else>mdi-close-circle</v-icon>
                  </div>
                  <div class="create-notification-states notification-state label ml-2 d-flex">
                    <div class="wrapper-value">
                      <span class="regular16 pr-2 mt-1">
                        {{ $t(`technical.notifications.${currentChannel}.${config.event}`) }}
                      </span>
                      <span class="regular16 mt-1">
                        {{
                          (isNotificationActive(config) && activeNotificationLanguages(config)) ||
                            ''
                        }}
                      </span>
                      <v-icon>mdi-chevron-right</v-icon>
                    </div>
                  </div>
                </router-link>
                <div
                  class="trash-button align-center"
                  v-if="isAuthorized('DELETE_NOTIFICATION_STATE', { retailerId, storeId }) && $vuetify.breakpoint.smAndUp"
                >
                  <mp-button
                    class="pa-0"
                    icon="trash-can-outline"
                    @click="openDeleteModal(currentChannel, config.id)"
                    format="link"
                    linkColor="black"
                    :dataId="`${currentChannel}-${configIndex}-deleteNotificationState`"
                  />
                </div>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </div>
      <v-row no-gutters v-else>
        <v-col cols="12">
          <no-data dataId="detail-notification-state-noData" />
        </v-col>
      </v-row>

      <v-row
        no-gutters
        v-if="isAuthorized('CREATE_NOTIFICATION_STATE', { retailerId, storeId })"
      >
        <v-col class="add-notification-button">
          <mp-button
            v-if="$vuetify.breakpoint.smAndUp"
            :text="`${$t('action.add.base')}`"
            icon="plus"
            iconSize="1.8rem"
            @click="$router.push(getCreationRoute())"
            dataId="add-notifications"
          />
        </v-col>
      </v-row>

      <mp-dialog-confirmation
        v-if="showDeleteModal"
        :dataId="`${notificationDeletionType}-modal-delete`"
        :textContent="$t('validation.confirmation.deleteNotificationState')"
        @close="showDeleteModal = false"
        @submit="deleteNotificationStates(notificationIdToDelete)"
        color="error"
        :header="{
          icon: 'mdi-trash-can-outline',
          isColorBackground: false,
          iconClose: 'mdi-close',
        }"
        :btnCancel="{ text: $t('action.cancel.base'), format: 'link', linkColor: 'black' }"
        :btnValidation="{ text: $t('action.delete.base'), format: 'error' }"
        :btnToColumn="$vuetify.breakpoint.xsOnly"
      />
    </mp-block>
  </v-container>
</template>

<script lang="ts">
import { ALL_NOTIFICATIONS } from '@/constants/shared'
import { NotificationStatesEntity, NotificationsConfigPerLanguage } from '@/types'

import NotificationStateService from '@/services/notificationStates/NotificationStatesService'

import noData from '@/components/noData/noData.vue'
import mpBlock from '@/components/block/block.vue'

import { authorizationMixin } from '@/mixins'
import mixins from 'vue-typed-mixins'

import { ROUTES } from '@/constants'
import { AVAILABLE_LANGUAGES } from '@/plugins/i18n'

export default mixins(authorizationMixin).extend({
  name: 'notification-states',
  components: {
    mpBlock,
    noData,
  },
  props: {
    creationRoute: {
      type: String,
      required: true,
    },
    detailRoute: {
      type: String,
      required: true,
    },
    carrierId: {
      type: Number,
      default: null,
    },
    retailerId: {
      type: Number,
      default: null,
    },
    storeId: {
      type: Number,
      default: null,
    },
    exchangePlaceId: {
      type: Number,
      default: null,
    },
    title: {
      type: String,
      default: 'page.carrier.notificationStates.title',
    },
  },
  data() {
    return {
      showDeleteModal: false,
      currentChannel: 'SMS',
      notificationIdToDelete: null as string | null,
      selectedNotificationState: null as NotificationStatesEntity | null,
      notificationStates: [] as NotificationStatesEntity[],
      hasLoaded: false,
      ROUTES,
      currentChips: null as Array<{ label: string; value: string; icon: string }> | null,
    }
  },
  async mounted() {
    try {
      await this.retrieveData()
      this.hasLoaded = true
    } catch (e) {
      this.hasLoaded = false
    }
  },
  computed: {
    availabledNotificationsChannel() {
      const parsedNotifications = Object.entries(ALL_NOTIFICATIONS).reduce(
        (acc, [channel, notifications]) =>
          Object.keys(notifications as Record<string, string>).length ? [...acc, channel] : acc,
        [] as string[],
      )
      return parsedNotifications.map(channel => ({
        label: this.$t(`technical.notifications.types.${channel}`),
        value: channel,
      }))
    },
    currentNotifications(): Array<{ label: string; config: NotificationStatesEntity[] }> {
      if (!this.notificationStates) {
        return []
      }

      const { currentChannel } = this

      const currentConfig =
        this.notificationStates.filter(({ channel }) => currentChannel === channel) || []
      return Object.entries(ALL_NOTIFICATIONS[currentChannel]).map(
        ([groupName, notificationsTypes]) => {
          const convertedNotificationsTypes = Object.values(
            notificationsTypes as Record<string, string>,
          )
          return {
            label: groupName,
            config: currentConfig.reduce((acc, config) => {
              if (!convertedNotificationsTypes.includes(config.event)) {
                return acc
              }
              return [...acc, config]
            }, [] as NotificationStatesEntity[]),
          }
        },
      )
    },
  },
  methods: {
    hasNotifications(
      notifications: Array<{ label: string; config: NotificationStatesEntity[] }>,
    ): boolean {
      return (notifications || []).some(({ config }) => config.length)
    },
    activeNotificationLanguages(notification: NotificationStatesEntity): string {
      const availableLanguages = Object.entries(notification.config)
        .filter(([language]) => AVAILABLE_LANGUAGES.includes(language))
        .reduce((acc, [language, configValue]) => {
          if ((configValue as NotificationsConfigPerLanguage).active) {
            acc.push(language.toUpperCase())
          }
          return acc
        }, [] as string[])
      return `(${availableLanguages.join(', ')})`
    },
    changeChannel(currentChannel: string): void {
      this.currentChannel = currentChannel
    },
    isNotificationActive(notification: NotificationStatesEntity): boolean {
      return Object.values(notification.config).some(
        (notificationConfig: NotificationsConfigPerLanguage) => notificationConfig?.active,
      )
    },
    isNotificationPlanned(notification: NotificationStatesEntity): boolean {
      return notification.config.delay
    },
    getIconColor(notification: NotificationStatesEntity): string {
      if (this.isNotificationPlanned(notification)) {
        return 'icon-alert'
      }

      return this.isNotificationActive(notification) ? 'icon-success' : 'icon-error'
    },
    getCreationRoute(): Record<string, any> {
      const {
        creationRoute,
        carrierId,
        retailerId,
        storeId,
        exchangePlaceId,
        currentChannel,
      } = this

      return {
        name: creationRoute,
        params: {
          carrierId,
          retailerId,
          storeId,
          exchangePlaceId,
          channel: currentChannel,
        },
      }
    },
    async retrieveData(): Promise<void> {
      const { carrierId = null, retailerId = null, storeId = null, exchangePlaceId = null } = this

      this.notificationStates = await NotificationStateService.getAll({
        carrierId,
        retailerId,
        storeId,
        exchangePlaceId,
      })
    },
    async deleteNotificationStates(id: string): Promise<void> {
      await NotificationStateService.deleteById(id)

      this.retrieveData()
      this.showDeleteModal = false
      this.notificationIdToDelete = null
    },
    openDeleteModal(channel: string, id: string): void {
      this.showDeleteModal = true
      this.currentChannel = channel
      this.notificationIdToDelete = id
    },
  },
})
</script>

<style lang="scss">
#detail-notification-state {
  padding: 0;
  @media #{map-get($display-breakpoints, 'xs-only')} {
    border-top: solid 0.1rem $main-lighten-74-color;
  }

  & h4 {
    color: $main-lighten-52-color;
  }

  .notifications-states {
    .label {
      align-self: center;
    }
  }

  .label {
    justify-content: flex-start !important;
  }

  .link-wrapper {
    text-decoration: none;
  }

  .wrapper-value {
    display: flex;
    flex-wrap: wrap;
  }

  .chip-outer-wrapper {
    width: fit-content;
    padding-right: 2.3rem;

    .chip-wrapper {
      max-width: fit-content;
      margin: 0 1.2rem 0.5rem 0;

      &:last-child {
        margin-right: 0;
      }

      .chip {
        cursor: pointer;

        &.chip-dsk {
          .v-chip__content {
            @include regular-14;
          }
        }

        &.chip-mobile {
          .v-chip__content {
            @include regular-16;
          }
        }

        &.chip-selected {
          background-color: $white;
          border: solid 0.2rem $main-color;
          border-radius: 5rem;
          cursor: default;
        }

        &.chip-no-selected {
          background-color: $white;
          border: solid 0.1rem $main-lighten-74-color;
        }
      }
    }
  }

  .content-outer-wrapper {
    .notificationLabel {
      margin-top: 3rem;
      margin-bottom: 1.4rem;
    }
  }

  .configs {
    display: flex;
    justify-content: flex-start;
    margin-bottom: 2rem;

    .trash-button,
    .notification-state {
      display: flex;
      justify-content: center;
    }

    .trash-button {
      i {
        color: $main-lighten-52-color !important;
      }
    }
  }

  .notification-state {
    cursor: pointer;
    align-items: center;

    &.icon-success {
      i {
        color: $success-color !important;
      }
    }

    &.icon-error {
      i {
        color: $error-color !important;
      }
    }

    &.icon-alert {
      i {
        color: $alert-color !important;
      }
    }
  }

  @media #{map-get($display-breakpoints, 'xs-only')} {
    .configs {
      & > .row:not(:first-child) {
        margin-top: 2rem;
        max-width: unset;
      }

      flex-wrap: wrap;
    }
  }

  .add-notification-button {
    display: flex;
    justify-content: center;
    margin-top: 2.5rem;
    margin-bottom: 0.1rem;

    .mobile-add-notification {
      padding: 1rem !important;
      height: fit-content;
    }
  }

  .title-outer-wrapper {
    margin-bottom: 2.6rem;
  }

  .notification-types {
    align-items: center;
    margin-bottom: 0;

    &:not(:last-child) {
      margin-bottom: 0;
    }

    display: flex;

    @media #{map-get($display-breakpoints, 'xs-only')} {
      flex-flow: row;
    }
  }

  .switch-wrapper {
    justify-content: space-between;
  }

  .create-notification-states {
    min-height: 5rem;
    display: flex;
  }

  .notification-type-selector {
    border: 0.1rem solid $main-lighten-65-color;
    box-sizing: border-box;
    border-radius: 0.4rem;
    color: $main-color;
    text-align: center;

    label {
      justify-content: center;
    }
    width: 15rem;
    height: 7.5rem;

    .v-input--selection-controls__input {
      display: none;
    }
  }

  .mdi-trash-can-outline {
    color: $main-lighten-52-color !important;
  }
}
</style>
