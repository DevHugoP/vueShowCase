<template>
  <v-container id="detail-notification" data-id="detail-notifications">
    <mp-block
      id="detail-notification-block"
      :title="$vuetify.breakpoint.smAndUp ? $t('page.detailOrder.notification.title') : ''"
      :hasBorder="$vuetify.breakpoint.smAndUp"
      :hasMarginBottom="$vuetify.breakpoint.smAndUp"
      titleHasPaddingBottom
    >
      <div v-if="hasData">
        <div class="content-outer-wrapper" :style="{ maxHeight }">
          <v-row
            no-gutters
            v-for="(notification, index) in computedNotifications"
            :key="`${notification.type}-${index}`"
            :ref="`notification-${index}`"
            class="content-wrapper"
            :data-id="`detail-notifications-${index}`"
          >
            <v-col cols="12" class="content-wrapper-col">
              <v-row no-gutters class="text-wrapper">
                <v-col col="12" class="notification-header-wrapper">
                  <div :class="`icon-wrapper ${displayColor(notification)}`">
                    <v-icon v-if="isPlanned(notification)">mdi-clock</v-icon>
                    <v-icon v-if="notification.failReason">mdi-close</v-icon>
                    <v-icon v-else>mdi-check</v-icon>
                  </div>
                  <span
                    :class="`label ${`label-${displayColor(notification)}`} medium12`"
                    :data-id="`detail-notifications-${index}-type`"
                  >{{ $t(`technical.notifications.types.${notification.type}`) }}
                  </span>
                  <mp-date-hour
                    :date="dateHelper.format(notification.date, 'P')"
                    :hour="dateHelper.format(notification.date, 'p')"
                    :dataId="`detail-notifications-${index}-dateHour`"
                  />
                </v-col>
              </v-row>

              <div class="text-wrapper" v-if="notification.failReason">
                <span class="label regular14">
                  {{ $t('page.detailOrder.notification.failReason') }}
                </span>
                <span
                  class="value regular14"
                  :data-id="`detail-notifications-${index}-failReason`"
                >{{ $t(notification.failReason) }}</span>
              </div>

              <div class="text-wrapper" v-if="notification.target">
                <span class="label regular14">
                  {{ $t('page.detailOrder.notification.toCustomer') }}
                </span>
                <span class="value regular14">
                  {{ $t(`technical.notifications.targets.${notification.target}`) }}
                </span>
              </div>

              <div class="text-wrapper" v-if="notification.sender">
                <span class="label regular14">{{
                  $t('page.detailOrder.notification.sender')
                }}</span>
                <span class="value regular14" :data-id="`detail-notifications-${index}-sender`">
                  {{ notification.sender }}
                </span>
              </div>

              <div class="text-wrapper" v-if="notification.event">
                <span class="label regular14">
                  {{ $t('page.detailOrder.notification.event') }}
                </span>
                <span class="value regular14" :data-id="`detail-notifications-${index}-subject`">
                  {{
                    $t([
                      `technical.notifications.subject.${notification.event}.${notification.subEvent}`,
                      `technical.notifications.subject.${notification.event}.default`,
                      `technical.notifications.subject.${notification.event}`,
                    ])
                  }}
                </span>
              </div>

              <div
                class="collapse-wrapper notification-content"
                v-if="
                  notification.message &&
                    !(notification.type === 'MAIL' && $vuetify.breakpoint.xsOnly)
                "
              >
                <v-expansion-panels flat>
                  <mp-collapse
                    :title="$t('page.detailOrder.notification.message')"
                    noPadding
                    :dataId="`detail-notifications-${index}-collapseMessage`"
                  >
                    <mp-button
                      v-if="notification.type === 'MAIL' && $vuetify.breakpoint.xsOnly"
                      icon="eye"
                      :text="$t('action.preview')"
                      format="secondary"
                      dataId="carrier-create-perimeter-modal-country-submit"
                      @click="showPreview(index, notification.message)"
                    />
                    <span
                      v-else-if="notification.type === 'MAIL'"
                      class="italic14 html-notification"
                      v-html="notification.message"
                    />
                    <span v-else class="italic14">{{ notification.message }}</span>
                  </mp-collapse>
                </v-expansion-panels>
              </div>
            </v-col>
          </v-row>
        </div>

        <v-row no-gutters class="action-outer-wrapper" v-if="$vuetify.breakpoint.xsOnly">
          <v-col cols="6" class="action-wrapper" v-if="notifications && notifications.length > 3">
            <mp-button
              dataId="detail-notifications-showMoreAndShowLess"
              :text="mobileShowLess ? `${$t('action.show.base')} +` : `${$t('action.show.base')} -`"
              format="secondary"
              :small="$vuetify.breakpoint.xsOnly"
              @click="mobileShowLess = !mobileShowLess"
            />
          </v-col>
        </v-row>
      </div>
      <div v-else>
        <no-data dataId="detail-notifications-noData" />
      </div>
    </mp-block>
  </v-container>
</template>

<script lang="ts">
interface MpNotification {
  id: number
  date: string
  type: string
  subject: string
  message: string
  status: boolean
  failReason: string | null
  orderId: number
  createdAt: string
  updatedAt: string
  sender: string
  toCustomer: boolean
  planned: boolean
}

import Vue from 'vue'

import noData from '@/components/noData/noData.vue'
import mpBlock from '@/components/block/block.vue'

import { dateHelper } from '@/helpers/dateHelper'

import NotificationService from '@/services/notification/NotificationService'

export default Vue.extend({
  name: 'mp-notification',
  components: {
    noData,
    mpBlock,
  },
  props: {
    orderId: {
      type: Number,
      default: 0,
    },
    collectId: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      notifications: [] as MpNotification[],
      maxHeight: 'none',
      dateHelper,
      mobileShowLess: true,
      hasData: true,
      isPreviewOpen: false,
      notificationMessage: '',
    }
  },
  computed: {
    computedNotifications(): MpNotification[] {
      if (this.$vuetify.breakpoint.smAndUp) {
        return this.notifications
      } else {
        return this.mobileShowLess ? this.notifications.slice(0, 3) : this.notifications
      }
    },
  },
  methods: {
    showPreview(index: number, message: string): void {
      this.notificationMessage = message
      this.isPreviewOpen = true
    },
    isPlanned(notification: MpNotification): boolean {
      return (
        notification.planned &&
        dateHelper.isSameOrBefore(dateHelper.getDate(), dateHelper.getDate(notification.date))
      )
    },
    displayColor(notification: MpNotification): string {
      if (this.isPlanned(notification)) {
        return 'orange'
      }

      return notification.failReason ? 'red' : 'green'
    },
  },
  async mounted(this: any) {
    const { orderId, collectId } = this
    if (orderId || collectId) {
      this.notifications = await NotificationService.getAll({
        ...(orderId && { orderId }),
        ...(collectId && { collectId }),
      })
    }

    this.hasData = this.computedNotifications.length > 0

    if (this.$vuetify.breakpoint.smAndUp && this.hasData) {
      this.$nextTick(() => {
        if (this.notifications.length > 3) {
          this.maxHeight = `${(this.$refs['notification-0'][0].clientHeight +
            this.$refs['notification-1'][0].clientHeight +
            this.$refs['notification-2'][0].clientHeight) /
            10}rem`
        }
      })
    }
  },
})
</script>

<style lang="scss">
@import '../../styles/mixins/macScrollbar';

#detail-notification {
  padding: 0;

  @media #{map-get($display-breakpoints, 'xs-only')} {
    border-top: solid 0.1rem $main-lighten-74-color;
  }

  .title-outer-wrapper {
    margin-bottom: 2.3rem;
  }

  .content-outer-wrapper {
    overflow: auto;
    @include setMacScrollbar('&');

    .content-wrapper {
      .content-wrapper-col {
        margin-bottom: 3rem;

        .notification-header-wrapper {
          display: flex;
          align-items: center;

          .icon-wrapper {
            height: 2.4rem;
            width: 2.4rem;
            border-radius: 1.2rem;

            &.green {
              background-color: $success-color !important;
            }

            &.red {
              background-color: $error-color !important;
            }

            &.orange {
              background-color: $alert-color !important;
            }

            i {
              color: $white;
            }
          }

          .label {
            margin-left: 0.9rem;

            &.label-green {
              color: $success-color !important;
            }

            &.label-red {
              color: $error-color !important;
            }

            &.label-orange {
              color: $alert-color !important;
            }
          }

          .date-hour {
            margin-left: auto;
          }
        }

        .text-wrapper {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: solid 0.1rem $main-lighten-74-color;
          padding-bottom: 1.6rem;
          margin-bottom: 1.6rem;

          .label {
            color: $main-lighten-52-color;
            min-width: fit-content;
            align-self: flex-start;
          }

          .value {
            text-align: right;
            align-self: flex-start;
            color: $main-color;
          }
        }

        .text-wrapper:last-of-type {
          border-bottom: none;
        }

        .text-wrapper:first-of-type {
          padding-top: 0;
        }

        .collapse-wrapper {
          @media #{map-get($display-breakpoints, 'xs-only')} {
            padding: 0;
          }

          .v-expansion-panel {
            @media #{map-get($display-breakpoints, 'xs-only')} {
              margin-bottom: 0;
            }

            .v-expansion-panel-header {
              padding: 0;

              .header-wrapper {
                justify-content: left;

                .regular16 {
                  margin: 0;
                  font-size: $regular-12-font-size !important;
                  line-height: $regular-12-line-height !important;
                  font-weight: $regular-12-font-weight !important;
                  color: $main-lighten-52-color;
                }
              }
            }
          }

          .v-expansion-panel-content__wrap {
            margin-top: 1rem;
            word-break: break-word;
            .html-notification > * {
              transform-origin: 0 0;
              transform: scale(0.85);
            }
            @media #{map-get($display-breakpoints, 'xs-only')} {
              justify-content: center;
              display: flex;
            }
          }

          .collapse-title {
            margin-left: 0;
            color: $main-lighten-52-color;
          }
        }
      }
    }
  }

  .action-outer-wrapper {
    display: flex;
    justify-content: center;
    margin-left: -2.5rem;

    .action-wrapper {
      display: flex;
      justify-content: center;
    }
  }
}
</style>
