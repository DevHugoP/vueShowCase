<template>
  <div id="notification-detail">
    <content-header id="detail-notification-header" dataId="detail-notification-header-id">
      <template #breadcrumb>
        <mp-breadcrumb :key="resetBreadcrumb" />
      </template>
      <template #title>
        <h1>
          {{ $t('technical.notifications.notification') }}
          {{
            notificationData?.channel === 'SMS'
              ? $t('page.notificationAdministration.SMS')
              : $t('page.notificationAdministration.MAIL')
          }}
        </h1>
      </template>
      <template #actions-button>
        <div class="notification-detail-edit-btn">
          <mp-button
            :text="$t('action.modify.base')"
            format="primary"
            icon="pencil"
            dataId="notification-detail-edit-btn"
            @click="goToEdit()"
            :disabled="!canEdit"
          />
        </div>
      </template>
    </content-header>
    <v-row no-gutters>
      <v-col cols="12">
        <v-row no-gutters class="notification-data">
          <v-col cols="10" offset="1">
            <v-row no-gutters justify="space-between">
              <v-col cols="5" class="img-container">
                <v-img
                  data-id="notification-detail-illustration"
                  class="logo"
                  src="@/assets/illustrations/notification.svg"
                  contain
                />
              </v-col>
              <v-col cols="7" class="technical-container">
                <v-divider class="divider" />
                <div no-gutters class="data-container">
                  <v-col cols="12" class="data-line">
                    <div class="d-flex align-center">
                      <span class="regular14 main-lighten-52">{{ $t('common.retailer') }}</span>
                      <span class="regular14 ml-auto ">{{ notificationData?.retailerName }}</span>
                    </div>
                  </v-col>
                </div>
                <v-divider class="divider" />
                <div no-gutters class="data-container">
                  <v-col cols="12" class="data-line">
                    <div class="d-flex align-center">
                      <span class="regular14 main-lighten-52">{{ $t('common.store') }}</span>
                      <span class="regular14 ml-auto ">{{
                        notificationData?.storeName ? notificationData?.storeName : '--'
                      }}</span>
                    </div>
                  </v-col>
                </div>
                <v-divider class="divider" />
                <div no-gutters class="data-container">
                  <v-col cols="12" class="data-line">
                    <div class="d-flex align-center">
                      <span class="regular14 main-lighten-52">{{
                        $t('common.exchangePlace')
                      }}</span>
                      <span class="regular14 ml-auto ">{{
                        notificationData?.exchangePlaceName
                          ? notificationData?.exchangePlaceName
                          : '--'
                      }}</span>
                    </div>
                  </v-col>
                </div>
                <v-divider class="divider" />
                <div no-gutters class="data-container">
                  <v-col cols="12" class="data-line">
                    <div class="d-flex align-center">
                      <span class="regular14 main-lighten-52">{{ $t('common.carrier') }}</span>
                      <span class="regular14 ml-auto ">{{
                        notificationData?.carrierName ? notificationData?.carrierName : '--'
                      }}</span>
                    </div>
                  </v-col>
                </div>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col cols="10" offset="1">
            <v-row no-gutters>
              <v-col cols="5" class="left-column">
                <mp-block
                  id="notifications-detail-languages"
                  :title="$t('technical.notifications.languageMessageDetail')"
                  :hasBorder="$vuetify.breakpoint.smAndUp"
                  :hasMarginBottom="$vuetify.breakpoint.smAndUp"
                  titleHasPaddingBottom
                >
                  <v-row no-gutters>
                    <v-col cols="12" class="d-flex">
                      <span class="medium16 main-color">{{
                        $t(`common.languages.${notificationData?.language}`)
                      }}</span>
                      <div class="ml-auto">
                        <div class="tag-icon-container">
                          <span
                            :class="
                              `regular14 status-chip${
                                notificationData?.isActive ? ' active' : ' inactive'
                              }`
                            "
                          >{{
                            notificationData?.isActive
                              ? $t('common.active')
                              : $t('technical.notifications.noActive')
                          }}</span>
                          <div v-if="notificationData?.config.content">
                            <v-icon @click="showDialog = true">mdi-eye</v-icon>
                            <notification-previsualisation
                              :type="notificationData?.channel"
                              :showDialog="showDialog"
                              :content="notificationData?.config.content"
                              @dialogStatus="showDialog = $event"
                            ></notification-previsualisation>
                          </div>
                        </div>
                      </div>
                    </v-col>
                  </v-row>
                  <v-row
                    no-gutters
                    v-if="
                      notificationData?.channel === 'SMS' && notificationData?.config?.useDefault
                    "
                  >
                    <v-col cols="12" class="d-flex default-wrapper mt-2">
                      <v-img
                        src="@/assets/logos/logo_eyes_rect.svg"
                        contain
                        max-width="2rem"
                        max-height="2rem"
                      />
                      <span class="regular14 main-lighten-52 ml-3">{{
                        $t('technical.notifications.defaultWoopMessage')
                      }}</span>
                    </v-col>
                  </v-row>
                  <v-row no-gutters v-else>
                    <v-col cols="12" class="d-flex default-wrapper mt-2">
                      <span class="regular14 main-lighten-52">{{
                        $t('technical.notifications.notDefault')
                      }}</span>
                    </v-col>
                  </v-row>
                </mp-block>
                <mp-block
                  id="notification-detail-setAsideCarrier-bloc"
                  :title="$t('technical.notifications.isCarrierSetAside')"
                  :hasBorder="$vuetify.breakpoint.smAndUp"
                  :hasMarginBottom="$vuetify.breakpoint.smAndUp"
                  titleHasPaddingBottom
                >
                  <v-row no-gutters v-if="carriers && carriers.length" class="setAside-wrapper">
                    <v-col cols="12" v-for="carrier in carriers" :key="`${carrier.id}-carrier`">
                      <div class="d-flex align-center py-4">
                        <v-img :src="carrier.logo" contain max-width="9rem" max-height="6rem" />
                        <span class="regular14 pl-5">{{ carrier.name }} </span>
                      </div>
                      <v-divider
                        v-if="carrier.id !== carriers[carriers.length - 1].id"
                        class="divider"
                      />
                    </v-col>
                  </v-row>
                  <v-row v-else no-gutters>
                    <v-col cols="12" class="no-data-wrapper">
                      <no-data
                        dataId="notification-detail-setAsideCarrier-bloc-noData"
                        :content="$t('technical.notifications.noSetAsideCarrier')"
                      />
                    </v-col>
                  </v-row>
                </mp-block>
              </v-col>
              <v-col cols="7" class="right-column">
                <mp-block
                  id="notifications-detail-feature"
                  :title="$t('common.characteristics')"
                  :hasBorder="$vuetify.breakpoint.smAndUp"
                  :hasMarginBottom="$vuetify.breakpoint.smAndUp"
                  titleHasPaddingBottom
                >
                  <div no-gutters class="data-container">
                    <v-col cols="12" class="data-line">
                      <div class="d-flex align-center">
                        <span class="regular14 main-lighten-52">{{
                          $t('technical.services.SERVICE_RETURN')
                        }}</span>
                        <span class="regular14 ml-auto ">{{
                          notificationData?.isReturn ? $t('common.yes') : $t('common.no')
                        }}</span>
                      </div>
                    </v-col>
                  </div>
                  <v-divider class="divider" />
                  <div no-gutters class="data-container">
                    <v-col cols="12" class="data-line">
                      <div class="d-flex align-center">
                        <span class="regular14 main-lighten-52">{{
                          $t('technical.notifications.event')
                        }}</span>
                        <span class="regular14 ml-auto ">{{
                          notificationData?.event
                            ? $t([
                              `technical.notifications.subject.${notificationData?.event}.${notificationData?.subEvent}`,
                              `technical.notifications.subject.${notificationData?.event}.default`,
                              `technical.notifications.subject.${notificationData?.event}`,
                            ])
                            : '--'
                        }}</span>
                      </div>
                    </v-col>
                  </div>
                  <v-divider class="divider" />
                  <div no-gutters class="data-container">
                    <v-col cols="12" class="data-line">
                      <div class="d-flex align-center">
                        <span class="regular14 main-lighten-52">{{
                          $t('technical.notifications.channel')
                        }}</span>
                        <div class="regular14 ml-auto ">
                          <v-icon
                            class="main-color"
                            v-if="notificationData?.channel === NotificationsChannel.SMS"
                            size="1.6rem"
                            :data-id="`notifications-detail-channel-sms`"
                          >
                            mdi-message-reply-text
                          </v-icon>
                          <v-icon
                            class="main-color"
                            v-else-if="notificationData?.channel === NotificationsChannel.MAIL"
                            size="1.6rem"
                            :data-id="`notifications-detail-channel-email`"
                          >
                            mdi-email
                          </v-icon>
                          <span> {{ notificationData?.channel }}</span>
                        </div>
                      </div>
                    </v-col>
                  </div>
                  <v-divider class="divider" />
                  <div no-gutters class="data-container">
                    <v-col cols="12" class="data-line">
                      <div class="d-flex align-center">
                        <span class="regular14 main-lighten-52">{{
                          $t('technical.notifications.target')
                        }}</span>
                        <span class="regular14 ml-auto ">{{
                          notificationData?.config.target
                            ? $t(
                              `technical.notifications.targets.${notificationData?.config.target}`,
                            )
                            : '--'
                        }}</span>
                      </div>
                    </v-col>
                  </div>
                  <v-divider class="divider" />
                  <div no-gutters class="data-container">
                    <v-col cols="12" class="data-line">
                      <div class="d-flex align-center">
                        <span class="regular14 main-lighten-52">{{
                          $t('technical.notifications.sendingDelay')
                        }}</span>
                        <span class="regular14 ml-auto ">{{
                          notificationData?.config.sendingDate
                            ? $t(
                              `technical.notifications.triggerStatus.${notificationData?.config.sendingDate}`,
                            )
                            : $t('technical.notifications.triggerStatus.EVENT_RETRIEVED')
                        }}</span>
                      </div>
                    </v-col>
                  </div>
                  <v-divider class="divider" />
                  <div no-gutters class="data-container">
                    <v-col cols="12" class="data-line">
                      <div class="d-flex align-center">
                        <span class="regular14 main-lighten-52">{{
                          $t('technical.notifications.delayInDetail')
                        }}</span>
                        <span class="regular14 ml-auto ">{{
                          notificationData?.config.delay
                            ? `${$t(`technical.notifications.delay.detail`, {
                              value: notificationData?.config.delay.value,
                              unit: 'hour',
                            })}`
                            : $t('technical.notifications.NO_SENDING_DELAY')
                        }}</span>
                      </div>
                    </v-col>
                  </div>
                  <v-divider class="divider" />
                  <div no-gutters class="data-container">
                    <v-col cols="12" class="data-line">
                      <div class="d-flex align-center">
                        <span class="regular14 main-lighten-52">{{
                          $t('technical.notifications.closingDelay')
                        }}</span>
                        <span class="regular14 ml-auto ">{{
                          notificationData?.config.eventMaxAge
                            ? `${$t(`technical.notifications.delay.detail`, {
                              value: notificationData?.config.eventMaxAge.value,
                              unit: 'hour',
                            })}`
                            : $t('technical.notifications.NO_MAX_DELAY')
                        }}</span>
                      </div>
                    </v-col>
                  </div>
                </mp-block>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import NotificationStateService from '@/services/notificationStates/NotificationStatesService'
import { CarrierEntity, NotificationItem, NotificationsChannel } from '@/types'
import contentHeader from '@/components/contentHeader/contentHeader.vue'
import mpBreadcrumb from '@/components/breadcrumb/breadcrumb.vue'
import { ROUTES } from '@/constants'
import mpBlock from '@/components/block/block.vue'
import noData from '@/components/noData/noData.vue'
import CarrierService from '@/services/carrier/CarrierService'
import { authorizationMixin } from '@/mixins'
import mixins from 'vue-typed-mixins'
import notificationPrevisualisation from '@/views/Notifications/previsualisation/previsualisation.vue'

export default mixins(authorizationMixin).extend({
  name: 'notification-detail',
  components: {
    contentHeader,
    mpBreadcrumb,
    mpBlock,
    noData,
    notificationPrevisualisation,
  },
  data: () => ({
    showDialog: false,
    NotificationsChannel,
    notificationData: null as NotificationItem | null,
    carriers: null as CarrierEntity[] | null,
    resetBreadcrumb: false,
  }),
  async beforeMount() {
    await this.getNotificationById()
    await this.getCarriers()
  },
  computed: {
    canEdit() {
      return this.isAuthorized('WRITE_NOTIFICATION_STATE')
    },
  },
  methods: {
    async getNotificationById(): Promise<void> {
      const notificationData = await NotificationStateService.get(this.$route.params.id)
      this.notificationData = notificationData.notificationState
    },
    goToEdit(): void {
      this.$router.push({
        name: ROUTES.editNotification,
        params: { id: this.$route.params.id },
      })
    },
    async getCarriers(): Promise<void> {
      if (!this.notificationData?.setAsideCarrierIds) {
        return
      }
      const { carriers } = await CarrierService.getAll({
        ids: this.notificationData?.setAsideCarrierIds,
      })
      this.carriers = carriers
    },
  },
  watch: {
    notificationData() {
      this.$route.meta!.breadcrumbs[2] = {
        name: `${this.$t('technical.notifications.notification')} ${
          this.notificationData!.channel
        } -
         ${this.$t([
           `technical.notifications.subject.${this.notificationData!.event}.${
             this.notificationData!.subEvent
           }`,
           `technical.notifications.subject.${this.notificationData!.event}.default`,
           `technical.notifications.subject.${this.notificationData!.event}`,
         ])}`,
        link: '/notifications/detail/:id',
      }
      this.resetBreadcrumb = !this.resetBreadcrumb
    },
  },
})
</script>

<style lang="scss" scoped>
@import '../../../styles/mixins/macScrollbar';
#notification-detail {
  .notification-data {
    min-height: 25rem;
    padding-top: 4.7rem;
    background-color: $main-lighten-80-color;
    padding-bottom: 4.2rem;
    margin-bottom: 3.8rem;
  }

  .technical-container {
    display: flex;
    flex-direction: column;
  }
  .default-wrapper {
    display: flex;
    align-items: center;
  }

  .divider {
    background-color: $main-lighten-74-color;
  }
  .data-container {
    display: flex;
    align-items: center;
  }

  .left-column {
    padding-right: 3.6rem;

    .no-data-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  }

  .setAside-wrapper {
    max-height: 20rem;
    overflow-y: auto;
    overflow-x: hidden;
    @include setMacScrollbar('&');
  }

  .img-container {
    padding-right: 3.6rem;
  }

  .tag-icon-container {
    display: flex;
    gap: 1.3rem;
  }

  .status-chip {
    padding: 0.2rem 1rem;
    border-radius: 4rem;
    color: $white;
    align-items: center;

    &.active {
      background: $success-color;
    }
    &.inactive {
      background: $alert-color;
    }
  }
  .data-line {
    padding: 1.5rem 0;
  }
}
</style>
