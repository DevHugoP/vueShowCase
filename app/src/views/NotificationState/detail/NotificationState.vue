<template>
  <div
    v-if="hasLoad"
    dataId="notification-state"
    color="primary"
    class="notification-state"
    :header="{
      icon: 'mdi-message',
      iconClose: 'mdi-close',
      isColorBackground: true,
      text: $t(`technical.notifications.state.title`),
      textPolice: 'h4',
    }"
  >
    <content-header
      v-if="$vuetify.breakpoint.smAndUp"
      dataId="notification-state"
      class="notification-detail"
    >
      <template #breadcrumb>
        <mp-breadcrumb />
      </template>
      <template #title>
        <h1 data-id="notification-state-title">
          {{
            $t(`technical.notifications.state.detail`, {
              channel: notification.channel,
              type: notification.event,
            })
          }}
        </h1>
      </template>

      <template #actions-button>
        <div class="actions-wrapper">
          <mp-button
            :text="$t('action.modify.base')"
            :disabled="!canEdit"
            icon="pencil"
            depressed
            outlined
            iconSize="1.8rem"
            format="secondary"
            dataId="notification-state-edit"
            :to="editUrl"
          />
        </div>
      </template>
    </content-header>

    <v-row no-gutters v-if="$vuetify.breakpoint.smAndUp">
      <v-col cols="10" offset="1">
        <v-row no-gutters>
          <v-col cols="12" md="5">
            <mp-block
              id="notification-config-characteristics"
              :title="$t('common.characteristics')"
              hasBorder
              :hasMarginBottom="$vuetify.breakpoint.smAndUp"
              titleHasPaddingBottom
              class="mt-5"
            >
              <mp-notification-state-characteristic
                :eventType="eventType"
                :channel="notification.channel"
                :notificationType="notification.event"
                :notificationTarget="notification.config.target"
                :delay="notification.config.delay"
                :sendingDate="notification.config.sendingDate"
                :eventMaxAge="notification.config.eventMaxAge"
              />
            </mp-block>
          </v-col>

          <v-col cols="12" md="7" :class="$vuetify.breakpoint.mdAndUp ? 'pl-9' : ''">
            <mp-block
              :id="`notification-config-caracteristic`"
              :title="$t('page.carrier.notificationStates.language')"
              hasBorder
              :hasMarginBottom="$vuetify.breakpoint.smAndUp"
              titleHasPaddingBottom
              class="mt-5"
            >
              <mp-notification-state-message
                :notificationConfig="notification.config"
                :notificationType="notification.event"
              />
            </mp-block>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <v-row no-gutters v-else class="collapse-wrapper">
      <v-col cols="10" offset="1">
        <v-expansion-panels flat>
          <mp-collapse
            ref="notification-characteristics"
            @click="scrollTo('notification-characteristics')"
            :title="$t('common.characteristics')"
            typographyClass="medium16"
            dataId="notification-state-characteristics"
          >
            <mp-notification-state-characteristic
              :eventType="eventType"
              :channel="notification.channel"
              :notificationType="notification.event"
              :notificationTarget="notification.config.target"
              :delay="notification.config.delay"
              :sendingDate="notification.config.sendingDate"
              :eventMaxAge="notification.config.eventMaxAge"
            />
          </mp-collapse>

          <mp-collapse
            ref="notification-message"
            @click="scrollTo('notification-message')"
            :title="$t('page.carrier.notificationStates.language')"
            typographyClass="medium16"
            dataId="notification-state-message"
          >
            <mp-notification-state-message
              :notificationConfig="notification.config"
              :notificationType="notification.event"
            />
          </mp-collapse>
        </v-expansion-panels>
      </v-col>
    </v-row>

    <v-row no-gutters class="mobile-action-modify-outer-wrapper">
      <v-col cols="12">
        <mp-button
          :text="$t('action.close.base')"
          format="sticky"
          stickyColor="yellow"
          dataId="notification-state-detail-update"
          @click="closeUrl()"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { ALL_NOTIFICATIONS } from '@/constants/shared'
import mixins from 'vue-typed-mixins'

import NotificationStateService from '@/services/notificationStates/NotificationStatesService'
import mpBlock from '@/components/block/block.vue'
import mpBreadcrumb from '@/components/breadcrumb/breadcrumb.vue'
import contentHeader from '@/components/contentHeader/contentHeader.vue'
import noData from '@/components/noData/noData.vue'
import mpNotificationStateCharacteristic from './characteristics/characteristics.vue'
import mpNotificationStateMessage from './message/message.vue'

import { authorizationMixin } from '@/mixins'

import { ROUTES } from '@/constants'
import ExchangePlaceService from '@/services/exchangePlace/ExchangePlaceService'
import RetailerService from '@/services/retailer/RetailerService'
import StoreService from '@/services/store/StoreService'
import { SET_BREADCRUMBS_LABEL, SET_HEADER_TITLE } from '@/store/mutation-types'
import CarrierService from '@/services/carrier/CarrierService'
import { NotificationStatesEntity } from '@/types'

export default mixins(authorizationMixin).extend({
  name: 'notification-states-detail',
  components: {
    mpBreadcrumb,
    contentHeader,
    mpBlock,
    noData,
    mpNotificationStateCharacteristic,
    mpNotificationStateMessage,
  },
  data: () => {
    return {
      eventType: '',
      hasLoad: false,
      carrierId: null as number | null,
      retailerId: null as number | null,
      storeId: null as number | null,
      exchangePlaceId: null as number | null,
      notificationStateId: null as number | null,
      notification: null as NotificationStatesEntity | null,
    }
  },
  async mounted() {
    const {
      notificationStateId,
      carrierId = null,
      retailerId = null,
      storeId = null,
      exchangePlaceId = null,
    } = this.$route.params

    this.notification = await NotificationStateService.get(notificationStateId)

    for (const [type, notifications] of Object.entries(
      ALL_NOTIFICATIONS[this.notification.channel],
    )) {
      if (
        Object.values(notifications as Record<string, string>).includes(this.notification.event)
      ) {
        this.eventType = type
        break
      }
    }

    this.carrierId = carrierId !== null ? Number(carrierId) : null
    this.retailerId = retailerId !== null ? Number(retailerId) : null
    this.storeId = storeId !== null ? Number(storeId) : null
    this.exchangePlaceId = exchangePlaceId !== null ? Number(exchangePlaceId) : null
    this.notificationStateId = notificationStateId !== null ? Number(notificationStateId) : null
    this.hasLoad = true

    const breadcrumbsLabel = {
      retailers: '',
      stores: '',
      exchangePlaces: '',
      carriers: '',
    }

    if (carrierId) {
      const carrier = await CarrierService.get(Number(carrierId))
      breadcrumbsLabel.carriers = carrier.name
    }

    if (retailerId) {
      const retailer = await RetailerService.get(Number(retailerId))
      breadcrumbsLabel.retailers = retailer.name
    }

    if (storeId) {
      const store = await StoreService.get(Number(storeId))
      breadcrumbsLabel.stores = store.name
    }

    if (exchangePlaceId) {
      const exchangePlace = await ExchangePlaceService.get(Number(exchangePlaceId))
      breadcrumbsLabel.exchangePlaces = exchangePlace.name
    }

    this.$store.commit(SET_BREADCRUMBS_LABEL, JSON.stringify(breadcrumbsLabel))
    this.$store.commit(
      SET_HEADER_TITLE,
      this.$t(`technical.notifications.state.detail`, {
        channel: this.notification.channel,
        type: this.notification.event,
      }),
    )
  },
  computed: {
    editUrl() {
      const { carrierId, retailerId, storeId, exchangePlaceId, notificationStateId } = this
      let name = ROUTES.editCarrierNotificationState

      if (exchangePlaceId && !carrierId) {
        name = ROUTES.editExchangePlaceNotificationState
      } else if (exchangePlaceId) {
        name = ROUTES.editCarrierExchangePlaceNotificationState
      } else if (storeId && !carrierId) {
        name = ROUTES.editStoreNotificationState
      } else if (storeId) {
        name = ROUTES.editCarrierStoreNotificationState
      } else if (retailerId && !carrierId) {
        name = ROUTES.editRetailerNotificationState
      } else if (retailerId) {
        name = ROUTES.editCarrierRetailerNotificationState
      }

      return {
        name,
        params: {
          carrierId,
          retailerId,
          storeId,
          exchangePlaceId,
          notificationStateId,
        },
      }
    },
    canEdit() {
      const { carrierId, retailerId, storeId } = this
      return this.isAuthorized('EDIT_NOTIFICATION_STATE', { carrierId, retailerId, storeId })
    },
  },
  methods: {
    scrollTo(refToScroll: string) {
      setTimeout(() => {
        ;(this.$refs[refToScroll] as any).$el.scrollIntoView(true, {
          behavior: 'smooth',
          block: 'end',
          inline: 'nearest',
        })
      }, 300)
    },
    closeUrl() {
      this.$router.back()
    },
  },
})
</script>

<style lang="scss">
@import '../../../styles/mixins/macScrollbar';

.notification-state {
  .notification-detail {
    > div {
      padding: 0 !important;
    }
  }

  .select-language-wrapper {
    display: flex;
    overflow-x: auto;

    .select-language {
      border: 0.1rem solid $main-lighten-74-color;
      border-radius: 5rem;
      min-width: 5rem;
      max-width: 5rem;
      min-height: 3rem;
      max-height: 3rem;
      display: flex;
      align-items: center;
      justify-content: center;
      text-transform: uppercase;
      margin-left: 1rem;
      cursor: pointer;

      &.first {
        margin-left: 0;
      }

      &.selected {
        border: 0.2rem solid $main-color;
      }
    }
  }

  .collapse-wrapper {
    padding-top: 5rem;
    background-color: $main-lighten-74-color;
    min-height: calc(100vh - 5.4rem - 6rem);
    max-height: calc(100vh - 5.4rem - 6rem);

    .template-collapse-wrapper {
      margin-bottom: 0.7rem;
      margin-top: 0;

      .v-expansion-panel-header {
        border-bottom-left-radius: inherit;
        border-bottom-right-radius: inherit;
      }
    }
  }
}
</style>
