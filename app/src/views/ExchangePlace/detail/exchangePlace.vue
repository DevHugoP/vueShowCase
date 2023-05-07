<template>
  <div
    id="exchangePlace-detail"
    data-id="exchangePlace-detail"
    v-if="exchangePlace && hasLoaded"
    :class="!isAuthorized('EDIT_EXCHANGE_PLACES', { storeId }) ? 'unchangeable' : ''"
  >
    <content-header v-if="$vuetify.breakpoint.smAndUp" dataId="exchangePlace-detail">
      <template #breadcrumb>
        <mp-breadcrumb />
      </template>
      <template #title>
        <h1 data-id="exchangePlace-detail-title">{{ exchangePlace.name }}</h1>
      </template>
      <template #actions-button v-if="isAuthorized('EDIT_EXCHANGE_PLACES', { storeId })">
        <div class="actions-wrapper">
          <mp-button
            :text="$t('action.modify.base')"
            format="primary"
            icon="pencil"
            dataId="exchangePlace-detail-modify"
            :to="getEditRoute()"
          />
        </div>
      </template>
    </content-header>

    <v-row no-gutters class="content-container">
      <v-col cols="12">
        <!-- header -->
        <v-row no-gutters class="information-wrapper">
          <v-col cols="10" offset="1">
            <v-row no-gutters>
              <v-col cols="5" v-if="$vuetify.breakpoint.mdAndUp">
                <v-img
                  :src="require(`@/assets/illustrations/${getLogo}`)"
                  contain
                  data-id="exchangePlace-detail-logo"
                />
              </v-col>
              <v-col
                cols="12"
                md="7"
                :class="`information${$vuetify.breakpoint.mdAndUp ? ' pl-9' : ''}`"
              >
                <!-- type && active -->
                <div class="d-flex justify-space-between">
                  <div class="d-flex align-center">
                    <v-icon size="1.8rem">{{ getIcon }}</v-icon>
                    <h3 class="pl-4">
                      {{ $t(`technical.exchangePlaceTypes.${exchangePlace.type}`) }}
                    </h3>
                  </div>
                  <div
                    :class="`d-flex align-center ${exchangePlace.active ? 'active' : 'inactive'}`"
                  >
                    <v-icon size="1.6rem">
                      {{ exchangePlace.active ? 'mdi-check-bold' : 'mdi-close' }}
                    </v-icon>
                    <span :class="`${$vuetify.breakpoint.xsOnly ? 'medium14' : 'regular14'} pl-2`">
                      {{ exchangePlace.active ? $t('common.active') : $t('common.inactive') }}
                    </span>
                  </div>
                </div>

                <v-divider class="mt-4" />

                <!-- Id -->
                <div class="d-flex justify-space-between mt-4">
                  <span
                    :class="
                      `main-lighten-52 ${$vuetify.breakpoint.smAndUp ? 'regular14' : 'regular16'}`
                    "
                  >
                    {{ $t('page.exchangePlace.externalPlaceId') }}
                  </span>
                  <span :class="`${$vuetify.breakpoint.xsOnly ? 'regular16' : 'regular14'}`">
                    {{ exchangePlace.externalPlaceId }}
                  </span>
                </div>

                <v-divider class="mt-4" />

                <!-- timezone -->
                <div class="d-flex justify-space-between mt-4">
                  <span
                    :class="
                      `main-lighten-52 ${$vuetify.breakpoint.smAndUp ? 'regular14' : 'regular16'}`
                    "
                  >
                    {{ $t('page.store.detail.timezone') }}
                  </span>
                  <span :class="`${$vuetify.breakpoint.xsOnly ? 'regular16' : 'regular14'}`">
                    {{ exchangePlace.timezone }}
                  </span>
                </div>

                <v-divider class="mt-4" />

                <!--  Minute before cutoff -->
                <div class="d-flex justify-space-between mt-4">
                  <span
                    :class="
                      `main-lighten-52 ${$vuetify.breakpoint.smAndUp ? 'regular14' : 'regular16'}`
                    "
                  >
                    {{ $t('page.exchangePlace.minuteBeforeCutOff') }}
                  </span>
                  <span :class="`${$vuetify.breakpoint.xsOnly ? 'regular16' : 'regular14'}`">
                    {{
                      $t('page.exchangePlace.minuteBeforeCutOffValue', {
                        value: exchangePlace.minuteBeforeCutoff,
                        count: exchangePlace.minuteBeforeCutoff,
                      })
                    }}
                  </span>
                </div>

                <!-- Mobile address -->
                <div class="d-block mt-4 mobile-address" v-if="$vuetify.breakpoint.xsOnly">
                  <mp-coordinates
                    v-if="exchangePlace.address.coordinates"
                    :coordinates="exchangePlace.address.coordinates"
                  />

                  <mp-address :address="exchangePlace.address" />
                </div>
              </v-col>
            </v-row>
          </v-col>
        </v-row>

        <!-- page dsk -->
        <v-row no-gutters class="mt-10" v-if="$vuetify.breakpoint.smAndUp">
          <v-col cols="10" offset="1">
            <v-row no-gutters>
              <!-- Left column -->
              <v-col cols="12" md="5" class="left-column">
                <v-row no-gutters>
                  <v-col cols="12">
                    <mp-address :address="exchangePlace.address" />
                  </v-col>
                </v-row>
                <v-row no-gutters v-if="exchangePlace.address.coordinates">
                  <v-col cols="12">
                    <mp-coordinates :coordinates="exchangePlace.address.coordinates" />
                  </v-col>
                </v-row>

                <v-row
                  no-gutters
                  v-if="isAuthorized('LIST_ORDER_ELIGIBILITIES', { storeId }) && !isDrive"
                >
                  <v-col cols="12">
                    <carrier-eligibilities
                      context="exchangePlace"
                      :retailerId="retailerId"
                      :storeId="exchangePlace.storeId"
                      :exchangePlaceId="exchangePlace.id"
                      dataId="store-detail-carrier"
                    />
                  </v-col>
                </v-row>

                <v-row no-gutters v-if="isAuthorized('READ_EXCHANGE_PLACE_SCHEDULE_EXCEPTIONS')">
                  <v-col cols="12">
                    <mp-exchange-place-exceptions
                      :exceptions="exchangePlace.exceptions"
                      v-if="isDrive"
                    />
                  </v-col>
                </v-row>

                <v-row no-gutters v-if="isAuthorized('READ_EXCHANGE_PLACE_VALIDITY_PERIOD')">
                  <v-col cols="12">
                    <mp-validity-slot-reservation
                      v-if="isDrive"
                      :slots-validity="exchangePlace.bookingValidityPeriod"
                    />
                  </v-col>

                  <v-row no-gutters v-if="!isDrive">
                    <v-col cols="12">
                      <mp-weighting :weightings="exchangePlace.weightingIndexes" />
                    </v-col>
                  </v-row>
                </v-row>
              </v-col>

              <!-- Right column -->
              <v-col cols="12" md="7" :class="$vuetify.breakpoint.mdAndUp ? 'pl-9' : ''">
                <v-row no-gutters>
                  <v-col cols="12">
                    <mp-contact
                      :contacts="sortedContacts"
                      :title="$t('page.exchangePlace.contact.title')"
                      :hasShowedInformation="true"
                      id="exchangePlace-detail-contacts"
                      :withLanguage="true"
                      :showMainContact="true"
                      :withTimezone="true"
                    />
                  </v-col>
                </v-row>

                <v-row no-gutters>
                  <v-col cols="12">
                    <mp-schedule
                      :schedule="exchangePlace.openingHours"
                      :timezone="exchangePlace.timezone"
                    />
                  </v-col>
                </v-row>

                <v-row no-gutters v-if="isAuthorized('READ_EXCHANGE_PLACE_SCHEDULES')">
                  <v-col cols="12">
                    <mp-exchange-place-typical-week
                      v-if="isDrive"
                      :schedule="exchangePlace.schedule ? exchangePlace.schedule.slots : {}"
                      :timezone="exchangePlace.timezone"
                    />
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-col>
        </v-row>

        <!-- page mobile -->
        <v-row no-gutters class="phone-content-detail" v-else>
          <v-col cols="10" offset="1">
            <v-expansion-panels flat>
              <mp-collapse
                ref="contact"
                @click="scrollTo('contact')"
                :title="$t('page.exchangePlace.contact.title')"
                noPadding
                typographyClass="medium16"
                dataId="exchangePlace-detail-collapse-contacts"
              >
                <mp-contact
                  :contacts="sortedContacts"
                  :title="$t('page.exchangePlace.contact.title')"
                  :hasShowedInformation="true"
                  :showMainContact="true"
                  id="exchangePlace-detail-contacts"
                  :withLanguage="true"
                  :withTimezone="true"
                />
              </mp-collapse>

              <mp-collapse
                ref="carrier"
                @click="scrollTo('carrier')"
                :title="$t('page.exchangePlace.carrier.title')"
                noPadding
                typographyClass="medium16"
                dataId="exchangePlace-detail-collapse-carrier"
                v-if="isAuthorized('LIST_ORDER_ELIGIBILITIES', { storeId }) && !isDrive"
              >
                <carrier-eligibilities
                  context="exchangePlace"
                  :retailerId="retailerId"
                  :storeId="exchangePlace.storeId"
                  :exchangePlaceId="exchangePlace.id"
                  dataId="store-detail-carrier"
                />
              </mp-collapse>

              <mp-collapse
                ref="schedule"
                @click="scrollTo('schedule')"
                :title="$t('page.exchangePlace.schedule.title')"
                noPadding
                typographyClass="medium16"
                dataId="exchangePlace-detail-collapse-schedule"
              >
                <mp-schedule
                  :schedule="exchangePlace.openingHours"
                  :timezone="exchangePlace.timezone"
                />
              </mp-collapse>

              <mp-collapse
                ref="exceptions"
                @click="scrollTo('exceptions')"
                :title="$t('page.exception.title')"
                noPadding
                typographyClass="medium16"
                dataId="exchangePlace-detail-collapse-exception"
                v-if="isDrive && isAuthorized('READ_EXCHANGE_PLACE_SCHEDULE_EXCEPTIONS')"
              >
                <mp-exchange-place-exceptions :exceptions="exchangePlace.exceptions" />
              </mp-collapse>

              <mp-collapse
                ref="weighting"
                @click="scrollTo('weighting')"
                :title="$t('common.weighting.title')"
                noPadding
                typographyClass="medium16"
                dataId="exchangePlace-detail-collapse-weighting"
                v-if="!isDrive"
              >
                <mp-weighting :weightings="exchangePlace.weightingIndexes" />
              </mp-collapse>

              <mp-collapse
                ref="validityPeriod"
                @click="scrollTo('validityPeriod')"
                :title="$t('page.exchangePlace.validitySlotReservation.title')"
                noPadding
                typographyClass="medium16"
                dataId="exchangePlace-detail-collapse-validity-period"
                v-if="isDrive && isAuthorized('READ_EXCHANGE_PLACE_VALIDITY_PERIOD')"
              >
                <mp-validity-slot-reservation
                  :slots-validity="exchangePlace.bookingValidityPeriod"
                />
              </mp-collapse>

              <mp-collapse
                ref="capacities"
                @click="scrollTo('capacities')"
                :title="$t('page.exchangePlace.typicalWeek.title')"
                noPadding
                typographyClass="medium16"
                dataId="exchangePlace-detail-collapse-capacities"
                v-if="isDrive && isAuthorized('READ_EXCHANGE_PLACE_SCHEDULES')"
              >
                <mp-exchange-place-typical-week
                  :schedule="exchangePlace.schedule ? exchangePlace.schedule.slots : {}"
                  :timezone="exchangePlace.timezone"
                />
              </mp-collapse>
            </v-expansion-panels>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <v-row
      no-gutters
      v-if="$vuetify.breakpoint.xsOnly && isAuthorized('EDIT_EXCHANGE_PLACES', { storeId })"
      class="mobile-action-modify-outer-wrapper"
    >
      <v-col cols="12">
        <mp-button
          dataId="exchangePlace-detail-update"
          :text="$t('action.modify.base')"
          format="sticky"
          stickyColor="yellow"
          :to="getEditRoute()"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import MpValiditySlotReservation from '@/views/ExchangePlace/detail/validitySlotReservation/validitySlotReservation.vue'
import mixins from 'vue-typed-mixins'

import contentHeader from '@/components/contentHeader/contentHeader.vue'
import mpBreadcrumb from '@/components/breadcrumb/breadcrumb.vue'
import mpAddress from '@/views/ExchangePlace/detail/address/address.vue'
import mpCoordinates from '@/views/ExchangePlace/detail/coordinates/coordinates.vue'
import mpContact from '@/components/contact/contact.vue'
import carrierEligibilities from '@/components/carrierEligibilities/carrierEligibilities.vue'
import mpSchedule from '@/views/ExchangePlace/detail/schedule/schedule.vue'
import mpExchangePlaceTypicalWeek from '@/views/ExchangePlace/detail/typicalWeek/typicalWeek.vue'
import mpExchangePlaceExceptions from '@/views/ExchangePlace/detail/exceptions/exceptions.vue'
import mpWeighting from '@/components/weighting/detail/detail.vue'

import ExchangePlaceService from '@/services/exchangePlace/ExchangePlaceService'
import StoreService from '@/services/store/StoreService'

import { SET_HEADER_TITLE, SET_BREADCRUMBS_LABEL } from '@/store/mutation-types'
import { SET_EXCHANGE_PLACE_DATA } from '@/store/modules/exchangePlace/mutations-type'

import { EXCHANGE_PLACE_TYPE, ROUTES } from '@/constants'

import RetailerService from '@/services/retailer/RetailerService'

import { authorizationMixin } from '@/mixins'
import { ExchangePlaceEntity, getDefaultExchangePlace } from '@/types'

export default mixins(authorizationMixin).extend({
  name: 'mp-exchange-place',
  components: {
    MpValiditySlotReservation,
    contentHeader,
    mpBreadcrumb,
    mpAddress,
    mpCoordinates,
    mpContact,
    carrierEligibilities,
    mpSchedule,
    mpExchangePlaceTypicalWeek,
    mpExchangePlaceExceptions,
    mpWeighting,
  },
  data: () => ({
    ROUTES,
    exchangePlace: null as ExchangePlaceEntity | null,
    retailerId: 0,
    storeId: 0,
    hasLoaded: false,
    logo: '',
  }),
  async mounted() {
    try {
      this.exchangePlace = await ExchangePlaceService.get(
        parseInt(this.$route.params.exchangePlaceId as string, 10),
      )

      if (!this.exchangePlace) {
        return
      }

      this.retailerId = parseInt(this.$route.params.id as string, 10)
      this.storeId = parseInt(this.$route.params.storeId as string, 10)

      if (this.$vuetify.breakpoint.xsOnly && this.exchangePlace) {
        this.$store.commit(SET_HEADER_TITLE, this.exchangePlace.name)
      }

      if (!this.exchangePlace.Store) {
        this.exchangePlace.Store = await StoreService.get(this.storeId, {
          retailerId: parseInt(this.$route.params.id, 10),
        })

        if (!this.exchangePlace.Store.Retailer) {
          this.exchangePlace.Store.Retailer = await RetailerService.get(
            parseInt(this.$route.params.id, 10),
          )
        }
      }

      this.$store.commit(SET_HEADER_TITLE, this.exchangePlace.name)

      // data for breadcrumb
      const breadcrumbsLabel = {
        retailers: this.exchangePlace.Store.Retailer!.name,
        stores: this.exchangePlace.Store.name,
        exchangePlaces: this.exchangePlace.name,
      }
      this.$store.commit(SET_BREADCRUMBS_LABEL, JSON.stringify(breadcrumbsLabel))
    } catch (e) {
      if (e.response?.status === 403) {
        return this.$router.push({ name: ROUTES.noAccess })
      }
      if (e.response?.status === 404) {
        return this.$router.push({ name: ROUTES.notFound })
      }
    } finally {
      this.hasLoaded = true
    }
  },
  computed: {
    sortedContacts() {
      if (!this.exchangePlace) {
        return []
      }
      return this.exchangePlace.contacts.sort(({ main }) => (main ? -1 : 1))
    },
    getLogo() {
      switch (this.exchangePlace?.type) {
        case EXCHANGE_PLACE_TYPE.EXCHANGE_PLACE_STORE:
          return 'default_img_store.svg'
        case EXCHANGE_PLACE_TYPE.EXCHANGE_PLACE_PFU:
          return 'default_img_store.svg'
        case EXCHANGE_PLACE_TYPE.EXCHANGE_PLACE_STORAGE:
          return 'default_img_store.svg'
        case EXCHANGE_PLACE_TYPE.EXCHANGE_PLACE_DRIVE:
          return 'default_img_drive.svg'
        default:
          return 'default_img_store.svg'
      }
    },
    getIcon() {
      switch (this.exchangePlace?.type) {
        case EXCHANGE_PLACE_TYPE.EXCHANGE_PLACE_STORE:
          return 'mdi-storefront-outline'
        case EXCHANGE_PLACE_TYPE.EXCHANGE_PLACE_PFU:
          return 'mdi-storefront-outline'
        case EXCHANGE_PLACE_TYPE.EXCHANGE_PLACE_STORAGE:
          return 'mdi-warehouse'
        case EXCHANGE_PLACE_TYPE.EXCHANGE_PLACE_DRIVE:
          return 'mdi-car'
        default:
          return 'mdi-storefront-outline'
      }
    },
    isDrive() {
      return this.exchangePlace?.type === EXCHANGE_PLACE_TYPE.EXCHANGE_PLACE_DRIVE
    },
  },
  methods: {
    getEditRoute() {
      return { name: ROUTES.updateExchangePlace }
    },
    scrollTo(refToScroll: string) {
      setTimeout(() => {
        ;(this.$refs[refToScroll] as any).$el.scrollIntoView(true, {
          behavior: 'smooth',
          block: 'end',
          inline: 'nearest',
        })
      }, 300)
    },
  },
  beforeDestroy() {
    this.$store.commit(`exchangePlace/${SET_EXCHANGE_PLACE_DATA}`, getDefaultExchangePlace())
  },
})
</script>

<style lang="scss">
#exchangePlace-detail {
  padding: 0;

  @media #{map-get($display-breakpoints, 'sm-and-up')} {
    padding-bottom: 4rem;
  }

  &.unchangeable {
    .content-container {
      @media #{map-get($display-breakpoints, 'xs-only')} {
        max-height: calc(100vh - 2.3rem - 3.1rem);
        min-height: calc(100vh - 2.3rem - 3.1rem);
      }
    }
  }

  .information-wrapper {
    padding-top: 4rem;
    padding-bottom: 3.2rem;
    background-color: $main-lighten-80-color;

    @media #{map-get($display-breakpoints, 'xs-only')} {
      background-color: $white;
    }

    .information {
      i {
        color: $main-color !important;
      }

      .active {
        span,
        i {
          color: $success-color !important;
        }
      }

      .inactive {
        span,
        i {
          color: $error-color !important;
        }
      }

      .mobile-address {
        .block-wrapper {
          padding: 2.4rem 0 2.4rem 0 !important;
        }
      }
    }
  }

  .content-container {
    @media #{map-get($display-breakpoints, 'xs-only')} {
      max-height: calc(100vh - 8.3rem - 3.1rem);
      min-height: calc(100vh - 8.3rem - 3.1rem);
      overflow-y: scroll;
    }
  }

  .phone-content-detail {
    padding-top: 2.5rem;
    padding-bottom: 6.4rem;
    background-color: $main-lighten-74-color;

    .v-expansion-panel {
      margin-bottom: 0.5rem;

      .v-expansion-panel--active {
        margin-top: 0;
      }
    }
  }

  .mobile-action-modify-outer-wrapper {
    a {
      min-height: 6rem;
      width: 100%;
    }
  }
}
</style>
