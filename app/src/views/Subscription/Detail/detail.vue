<template>
  <v-row no-gutters id="subscription-detail" data-id="subscription-detail">
    <mp-block
      id="subscription-detail-block"
      :hasBorder="$vuetify.breakpoint.smAndUp"
      :hasMarginBottom="$vuetify.breakpoint.smAndUp"
      titleHasPaddingBottom
    >
      <template #title v-if="$vuetify.breakpoint.smAndUp">
        <v-row no-gutters>
          <v-col cols="12">
            <div class="d-flex align-center">
              <div class="d-flex align-center">
                <h2>{{ $t(title) }}</h2>
              </div>
              <div class="d-flex ml-auto">
                <span
                  :class="
                    `regular14 status-chip subscription-title-status subscription-title-status${
                      isInit ? '--success' : '--waiting'
                    }`
                  "
                >{{ isInit ? $t('page.subscriptions.init') : $t('page.subscriptions.waiting') }}</span>

                <v-icon
                  v-if="isInit && $route.name === ROUTES.detailCarrier && isAuthorized('EDIT_CARRIER_SUBSCRIPTIONS', { carrierId: Number($route.params.carrierId) })"
                  @click="showModal = true"
                  size="1.8rem"
                  class="block-icon ml-5"
                  dataId="carrier-subscription-block-edit"
                >
                  mdi-pencil
                </v-icon>
              </div>
            </div>
          </v-col>
        </v-row>
      </template>
      <template #default>
        <v-row no-gutters v-if="$vuetify.breakpoint.xsOnly">
          <v-col
            :class="
              `d-flex justify-space-between align-center subscription-title-wrapper subscription-title${
                !Object.entries(getCallbacks).length ? ' no-border-bottom' : ''
              }`
            "
            cols="12"
          >
            <span class="regular14" cols="8">{{ $t('page.subscriptions.status') }}</span>
            <span
              cols="2"
              :class="
                `subscription-title-status subscription-title-status${
                  isInit ? '--success' : '--waiting'
                }`
              "
            >
              {{ isInit ? $t('page.subscriptions.init') : $t('page.subscriptions.waiting') }}
            </span>
          </v-col>
        </v-row>

        <div v-if="isInit">
          <v-col
            cols="12"
            v-for="([key, value], index) in Object.entries(getCallbacks)"
            :key="`subscription-callbacks-${key}`"
            :class="
              `subscription-callbacks${
                index === Object.keys(getCallbacks).length - 1 ? ' no-border-bottom' : ''
              }`
            "
            :data-id="`subscription-callbacks-${key}`"
          >
            <v-row no-gutters>
              <v-col cols="7" sm="3" class="label-wrapper">
                <span class="regular14 main-color">{{ $t(`page.subscriptions.callbacks.${key}`) }}</span>
              </v-col>
              <v-col
                v-if="$vuetify.breakpoint.smAndUp"
                class="subscription-callbacks-url"
                cols="7"
                :data-id="`subscription-callbacks-${key}-url`"
              >
                <span class="regular14 main-lighten-52">{{ value.url }}</span>
              </v-col>
              <v-col
                class="d-flex justify-end"
                cols="5"
                sm="2"
                :data-id="`subscription-callbacks-${key}-version`"
              >
                <span class="label-version regular14 main-color">{{ value.version }}</span>
              </v-col>
              <v-col
                v-if="$vuetify.breakpoint.xsOnly"
                class="subscription-callbacks-url"
                cols="12"
                :data-id="`subscription-callbacks-${key}-url`"
              >
                <span class="regular14">{{ value.url }}</span>
              </v-col>
            </v-row>
          </v-col>
        </div>
        <div v-else>
          <v-col cols="12" class="no-data-wrapper">
            <no-data dataId="subscription-detail-noData" :content="$t('common.noData.noContent')" />

            <mp-button
              v-if="!isInit && $vuetify.breakpoint.smAndUp && $route.name === ROUTES.detailCarrier && isAuthorized('EDIT_CARRIER_SUBSCRIPTIONS', { carrierId: Number($route.params.carrierId) })"
              format="primary"
              :text="$t('action.add.base')"
              icon="plus"
              class="mp-button"
              @click="showModal = true"
              dataId="carrier-subscription-block-add"
            />
          </v-col>
        </div>
      </template>
    </mp-block>

    <mp-subscription-modal
      v-if="showModal"
      @close="showModal = false"
      @submit="subscription = $event"
    />
  </v-row>
</template>

<script lang="ts">
import { authorizationMixin } from '@/mixins'
import { ROUTES } from '@/constants'
import SubscriptionService from '@/services/subscription/SubscriptionService'

import mpBlock from '@/components/block/block.vue'
import noData from '@/components/noData/noData.vue'
import { SubscriptionEntity } from '@/types'
import mpSubscriptionModal from '@/views/Carrier/Detail/technical/subscriptionModal.vue'
import mixins from 'vue-typed-mixins'

export default mixins(authorizationMixin).extend({
  name: 'mp-subscription',
  components: {
    mpBlock,
    noData,
    mpSubscriptionModal,
  },
  props: {
    title: {
      type: String,
      default: 'page.subscriptions.title',
    },
  },
  data: () => ({
    ROUTES,
    subscription: null as SubscriptionEntity | null,
    showModal: false,
  }),
  async mounted() {
    let subscription
    try {
      if (this.$route.name === ROUTES.detailRetailer) {
        subscription = await SubscriptionService.getByRetailerId(this.$route.params.id)
      } else {
        subscription = await SubscriptionService.getByCarrierId(this.$route.params.carrierId)
      }
    } catch (error) {
      subscription = null
    }

    this.subscription = subscription as any
  },
  computed: {
    getCallbacks(): Record<string, any> {
      if (!this.subscription) {
        return {}
      }

      return this.subscription.callbacks
    },
    isInit(): boolean {
      return Boolean(this.subscription && Object.entries(this.subscription.callbacks).length)
    },
  },
})
</script>

<style lang="scss" scoped>
#subscription-detail {
  padding: 0;

  .no-data-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;

    .mp-button {
      margin-top: 2.5rem;
      margin-bottom: 0.1rem
    }
  }

  @media #{map-get($display-breakpoints, 'xs-only')} {
    border-top: solid 0.1rem $main-lighten-74-color;

    .subscription {
      &-title {
        border-bottom: solid 0.1rem $main-lighten-74-color;
        &.no-border-bottom {
          border-bottom: none;

          &.subscription-title-wrapper {
            padding-bottom: 0;
          }
        }

        &-wrapper {
          padding-bottom: 2.3rem;
        }
      }

      &-callbacks {
        &-url {
          margin: 2rem 0;
        }

        &-detail {
          margin-top: 2rem;
        }
      }
    }
  }

  .subscription {
    &-title {
      &-wrapper {
        @media #{map-get($display-breakpoints, 'sm-and-up')} {
          margin-bottom: 2.3rem;
        }
      }

      &-status-chip {
        display: flex;
        justify-content: flex-end;
      }

      &-status {
        border-radius: 50px;
        width: 75px;
        height: 25px;
        color: #ffffff;
        display: flex;
        justify-content: center;
        align-items: center;

        &--success {
          background: #2cd2ad;
        }

        &--waiting {
          background: $error-color;
          width: fit-content;
          padding-left: 1rem;
          padding-right: 1rem;
        }
      }
    }

    &:hover {
      .block-icon {
        color: $main-color;
      }
    }

    .block-icon {
      color: $main-lighten-52-color;
      cursor: pointer;
    }

    &-callbacks {
      border-bottom: solid 0.1rem $main-lighten-74-color;
      display: flex;
      align-items: center;
      padding: 1.6rem 0;

      &-row {
        width: 100%;
      }

      &-url {
        word-break: break-all;
      }

      &:first-of-type {
        padding-top: 0;
      }

      &.no-border-bottom {
        border-bottom: none;
        padding-bottom: 0;
      }

      .label-wrapper {
        display: flex;
        align-items: center;

        i {
          color: $main-color;
          margin-right: 1rem;
        }
      }

      .label-version {
        width: 75px;
        height: 25px;
        background: #e7e7ed;
        border-radius: 50px;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .value-wrapper {
        text-align: right;
      }
    }
  }
}
</style>
