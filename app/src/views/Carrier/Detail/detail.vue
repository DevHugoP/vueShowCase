<template>
  <div id="carrier-detail" v-if="carrier" data-id="carrier-detail">
    <v-row no-gutters class="content-header-outer-wrapper">
      <v-col cols="12">
        <content-header v-if="$vuetify.breakpoint.smAndUp" dataId="carrier-detail">
          <template #breadcrumb>
            <mp-breadcrumb />
          </template>
          <template #title>
            <h1>{{ carrier.name }}</h1>
          </template>
          <template #actions-button>
            <div
              class="actions-wrapper d-flex"
              v-if="
                isAuthorized('DOWNLOAD_CARRIER_CONNECTION_ARCHIVE') ||
                  (canEditCarrier && showEligibilitiesDetails)
              "
            >
              <v-menu bottom offset-y origin="center top" transition="scale-transition">
                <template v-slot:activator="{ on, attrs }">
                  <mp-button
                    v-bind="attrs"
                    v-on="on"
                    dataId="carrier-detail-actions"
                    format="link"
                    linkColor="black"
                    :text="$t('action.base')"
                    icon="apps"
                  />
                </template>
                <v-list>
                  <v-list-item
                    v-if="isAuthorized('DOWNLOAD_CARRIER_CONNECTION_ARCHIVE')"
                    @click="showArchiveModel = true"
                    data-id="download-connection-btn"
                  >
                    <v-list-item-icon>
                      <v-icon v-text="'mdi-file-download-outline'" />
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title v-text="$t('action.downloadConnectionArchive')" />
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item
                    data-id="carrier-detail-update"
                    :to="getEditRoute()"
                    v-if="canEditCarrier && isRootCarrier"
                  >
                    <v-list-item-icon>
                      <v-icon v-text="'mdi-pencil'" />
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title v-text="$t('action.modify.base')" />
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item
                    data-id="activate-carrier-btn"
                    @click="showActivationModal = true"
                    v-if="
                      canToggleCarrier &&
                        isAuthorized(
                          ['EDIT_CARRIER_ELIGIBILITIES', 'TOGGLE_CARRIERS'],
                          { carrierId: carrier.id },
                          'AND',
                        )
                    "
                  >
                    <v-list-item-icon>
                      <v-icon
                        v-text="
                          orderEligibility.isActive
                            ? 'mdi-close-circle-outline'
                            : 'mdi-check-circle-outline'
                        "
                      />
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title
                        v-text="
                          orderEligibility.isActive
                            ? $t('action.disable.base')
                            : $t('action.enable.base')
                        "
                      />
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-menu>
            </div>
          </template>
        </content-header>
      </v-col>

      <download-archive-btn
        v-if="showArchiveModel"
        type="carrier"
        :id="$route.params.carrierId.toString()"
        @close="showArchiveModel = false"
        @submit="showArchiveModel = false"
        :variant="true"
      />

      <activate-carrier-btn
        v-if="
          carrier &&
            showActivationModal &&
            isAuthorized(
              ['EDIT_CARRIER_ELIGIBILITIES', 'TOGGLE_CARRIERS'],
              { carrierId: carrier.id },
              'AND',
            )
        "
        :orderEligibility="orderEligibility"
        @close="showActivationModal = false"
        @submit="toggleCarrier()"
      />
    </v-row>

    <v-row
      no-gutters
      :class="
        `content-container${
          !isAuthorized('EDIT_CARRIERS', {
            retailerId: (orderEligibility && orderEligibility.retailerId) || null,
            storeId: (orderEligibility && orderEligibility.storeId) || null,
          })
            ? ' no-sticky-button'
            : ''
        }`
      "
    >
      <v-col cols="12" v-if="hasLoaded">
        <v-row no-gutters class="technical-data">
          <v-col cols="12" sm="10" offset-sm="1">
            <v-row no-gutters justify="space-between">
              <v-col
                cols="12"
                class="navigation-button-wrapper"
                v-if="!parent && (navigationCarrier() || navigationCarrier(true))"
              >
                <div
                  class="navigation-button left"
                  v-if="navigationCarrier()"
                  data-id="carrier-detail-navigation-previous"
                  @click="goToNavigation()"
                >
                  <v-icon class="mr-4" v-if="$vuetify.breakpoint.smAndUp">mdi-arrow-left</v-icon>
                  <v-icon class="mr-1" v-else>mdi-chevron-left</v-icon>
                  <span class="regular14">{{ navigationCarrier().name }}</span>
                </div>

                <div
                  class="navigation-button right"
                  data-id="carrier-detail-navigation-next"
                  v-if="navigationCarrier(true)"
                  @click="goToNavigation(true)"
                >
                  <span class="regular14">{{ navigationCarrier(true).name }}</span>
                  <v-icon class="ml-4" v-if="$vuetify.breakpoint.smAndUp">mdi-arrow-right</v-icon>
                  <v-icon class="ml-1" v-else>mdi-chevron-right</v-icon>
                </div>
              </v-col>

              <v-col cols="12" sm="5" class="logo-container">
                <v-row no-gutters class="logo-outer-wrapper">
                  <v-col cols="12" class="logo-wrapper">
                    <div
                      class="carrier-new-wrapper"
                      v-if="carrier.isNew && $vuetify.breakpoint.smAndUp"
                    >
                      <div class="carrier-new green">
                        <span class="medium12">NEW</span>
                      </div>
                    </div>
                    <v-img
                      data-id="carrier-detail-logo"
                      class="logo"
                      :src="carrier.logo"
                      v-if="carrier.logo"
                      contain
                    />
                  </v-col>
                  <v-row no-gutters class="width-max">
                    <v-col cols="12" class="description">
                      <span class="italic16 main-lighten-28">
                        {{
                          carrier.description && carrier.description[currentUser.language]
                            ? carrier.description[currentUser.language]
                            : ''
                        }}
                      </span>
                    </v-col>
                  </v-row>
                  <v-row no-gutters class="width-max">
                    <v-col cols="12" class="logo-picto">
                      <img v-if="carrier && carrier.isLabeled" src="@/assets/logos/label.svg" />
                      <img
                        v-if="
                          carrier &&
                            carrier.ecologyType &&
                            carrier.ecologyType === ECOLOGY_TYPE.FULL
                        "
                        src="@/assets/logos/green100.svg"
                      />
                      <img
                        v-else-if="
                          carrier &&
                            carrier.ecologyType &&
                            carrier.ecologyType === ECOLOGY_TYPE.PARTIAL
                        "
                        src="@/assets/logos/green.svg"
                      />
                    </v-col>
                  </v-row>
                  <v-row no-gutters v-if="$vuetify.breakpoint.smAndUp" class="width-max">
                    <h4
                      :class="`medium16 integration-status integration-status--${getStatusColor}`"
                    >
                      {{ getIntegrationStatus(carrier.status).name }}
                    </h4>
                  </v-row>
                </v-row>
              </v-col>

              <v-col cols="12" sm="7" class="technical-container" v-if="canReadDetails">
                <v-row v-if="$vuetify.breakpoint.smAndUp" no-gutters>
                  <v-col cols="12">
                    <div class="d-flex align-center">
                      <div class="d-flex align-center state">
                        <span
                          data-id="carrier-detail-private"
                          class="private"
                          v-if="carrier.isPrivate"
                        >
                          <v-icon size="1.8rem">mdi-lock</v-icon>
                          <span :class="$vuetify.breakpoint.smAndUp ? 'medium14' : 'medium16'">{{
                            $t('common.private')
                          }}</span>
                        </span>
                        <span data-id="carrier-detail-private" class="private" v-else>
                          <v-icon size="1.8rem">mdi-account-multiple</v-icon>
                          <span :class="$vuetify.breakpoint.smAndUp ? 'medium14' : 'medium16'">{{
                            $t('common.public')
                          }}</span>
                        </span>
                      </div>
                      <div class="d-flex ml-auto state">
                        <span
                          v-if="orderEligibility && orderEligibility.isActive"
                          class="valid"
                          data-id="carrier-detail-active"
                        >
                          <v-icon size="1.8rem">mdi-check-bold</v-icon>
                          <span :class="$vuetify.breakpoint.smAndUp ? 'medium14' : 'medium16'">
                            {{ $t('common.active') }}
                          </span>
                        </span>
                        <span v-else class="valid" data-id="carrier-detail-inactive">
                          <v-icon size="1.8rem" class="error-color">
                            mdi-cancel
                          </v-icon>
                          <span :class="$vuetify.breakpoint.smAndUp ? 'medium14' : 'medium16'">
                            {{ $t('action.disable.variant') }}
                          </span>
                        </span>
                      </div>
                    </div>
                  </v-col>
                </v-row>

                <v-row
                  no-gutters
                  v-if="$vuetify.breakpoint.xsOnly"
                  class="data-container"
                  data-id="carrier-detail-isActive"
                >
                  <v-col cols="6" class="label">
                    <span v-if="carrier.isNew" class="medium16 carrier-new-mobile-green">NEW</span>
                  </v-col>
                  <v-col cols="6" class="value">
                    <span
                      data-id="carrier-detail-active"
                      class="valid"
                      v-if="orderEligibility && orderEligibility.isActive"
                    >
                      <v-icon size="1.8rem">mdi-check-bold</v-icon>
                      <span class="regular16">{{ $t('common.active') }}</span>
                    </span>
                    <span data-id="carrier-detail-inactive" class="valid" v-else>
                      <v-icon size="1.8rem" class="error-color">
                        mdi-cancel
                      </v-icon>
                      <span class="regular16">{{ $t('action.disable.variant') }}</span>
                    </span>
                  </v-col>
                </v-row>

                <v-divider class="divider" v-if="$vuetify.breakpoint.xsOnly" />

                <v-row
                  no-gutters
                  v-if="$vuetify.breakpoint.xsOnly"
                  class="data-container"
                  data-id="carrier-detail-isPrivate"
                >
                  <v-col cols="6" class="label">
                    <span class="regular16">
                      {{ $t('page.carriers.filters.isPrivate') }}
                    </span>
                  </v-col>
                  <v-col cols="6" class="value">
                    <span data-id="carrier-detail-private" class="private" v-if="carrier.isPrivate">
                      <span class="regular16">{{ $t('common.private') }}</span>
                    </span>
                    <span data-id="carrier-detail-private" class="private" v-else>
                      <span class="regular16">{{ $t('common.public') }}</span>
                    </span>
                  </v-col>
                </v-row>

                <v-divider class="divider" v-if="$vuetify.breakpoint.xsOnly" />

                <v-row
                  v-if="$vuetify.breakpoint.xsOnly && getIntegrationStatus(carrier.status)"
                  no-gutters
                  class="data-container"
                  data-id="carrier-detail-status"
                >
                  <v-col cols="6" class="label">
                    <span class="regular16">
                      {{ $t('common.integrated.level') }}
                    </span>
                  </v-col>
                  <v-col cols="6" class="value">
                    <span
                      :class="`regular14 integration-status integration-status--${getStatusColor}`"
                    />
                    <span class="regular16">{{ getIntegrationStatus(carrier.status).name }} </span>
                  </v-col>
                </v-row>

                <v-divider class="divider" />

                <v-row no-gutters class="data-container" data-id="carrier-detail-code">
                  <v-col cols="6" class="label">
                    <span :class="$vuetify.breakpoint.smAndUp ? 'regular14' : 'regular16'">
                      {{ $t('page.carrier.code') }}
                    </span>
                  </v-col>
                  <v-col cols="6" class="value">
                    <span :class="$vuetify.breakpoint.smAndUp ? 'regular14' : 'regular16'">
                      {{ carrier.code }}
                    </span>
                  </v-col>
                </v-row>

                <v-divider class="divider" />

                <v-row no-gutters class="data-container" data-id="carrier-detail-siret">
                  <v-col cols="6" class="label">
                    <span :class="$vuetify.breakpoint.smAndUp ? 'regular14' : 'regular16'">
                      {{ $t('page.carrier.siret') }}
                    </span>
                  </v-col>
                  <v-col cols="6" class="value">
                    <span :class="$vuetify.breakpoint.smAndUp ? 'regular14' : 'regular16'">
                      {{ carrier.siret || '-' }}
                    </span>
                  </v-col>
                </v-row>

                <v-divider class="divider" />

                <v-row no-gutters class="data-container" data-id="carrier-detail-apiClientId">
                  <v-col cols="6" class="label">
                    <span :class="$vuetify.breakpoint.smAndUp ? 'regular14' : 'regular16'">
                      {{ $t('page.carrier.apiClientId') }}
                    </span>
                  </v-col>
                  <v-col cols="6" class="value">
                    <span :class="$vuetify.breakpoint.smAndUp ? 'regular14' : 'regular16'">
                      {{ carrier.apiClientId }}
                    </span>
                  </v-col>
                </v-row>

                <v-divider class="divider" />

                <v-row no-gutters class="data-container" data-id="carrier-detail-passwordless">
                  <v-col cols="6" class="label">
                    <span :class="$vuetify.breakpoint.smAndUp ? 'regular14' : 'regular16'">
                      {{ $t('page.carrier.passwordLess') }}
                    </span>
                  </v-col>
                  <v-col cols="6" class="value">
                    <span :class="$vuetify.breakpoint.smAndUp ? 'regular14' : 'regular16'">
                      {{ carrier.passwordLess ? $t('common.yes') : $t('common.no') }}
                    </span>
                  </v-col>
                </v-row>

                <v-divider class="divider" />

                <v-row no-gutters class="data-container" data-id="carrier-detail-authProviderId">
                  <v-col cols="6" class="label">
                    <span :class="$vuetify.breakpoint.smAndUp ? 'regular14' : 'regular16'">
                      {{ $t('page.carrier.authProviderId') }}
                    </span>
                  </v-col>
                  <v-col cols="6" class="value">
                    <span :class="$vuetify.breakpoint.smAndUp ? 'regular14' : 'regular16'">
                      {{ carrier.authProviderId || '-' }}
                    </span>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-col>

          <v-col
            cols="10"
            offset="1"
            class="carrier-details-menu"
            v-if="$vuetify.breakpoint.smAndUp"
          >
            <v-tabs ref="tabs" :show-arrows="false" v-model="selectedRange">
              <v-tab
                v-for="(range, index) in tabs"
                class="tabs-range"
                :ref="`tabs-${range.type}`"
                :key="index"
                v-ripple="false"
                :data-id="`carrier-detail-slider-${range.type}`"
              >
                <h3
                  :class="
                    `${
                      tabs[selectedRange] && tabs[selectedRange].type === range.type
                        ? ' main-color'
                        : 'main-lighten-52'
                    }`
                  "
                >
                  {{ range.title }}
                </h3>
              </v-tab>
            </v-tabs>
          </v-col>
        </v-row>

        <v-row no-gutters class="content-dsk" v-if="$vuetify.breakpoint.smAndUp">
          <v-col cols="10" offset="1">
            <carrier-detail-general
              v-if="tabs[selectedRange] && tabs[selectedRange].type === detailsTab.GENERAL"
              :retailers="retailers"
              :orderEligibility="orderEligibility"
              :carrier="carrier"
              :parent="parent"
              :params="getCarrierParams"
              :canEditEligibilities="canEditEligibilities"
            />

            <carrier-detail-parameter
              v-if="tabs[selectedRange] && tabs[selectedRange].type === detailsTab.PARAMS"
              :orderEligibility="orderEligibility"
              :parent="parent"
              :params="getCarrierParams"
              :pickupPointConfig="pickupPointConfig"
              :canEditEligibilities="canEditEligibilities"
              @needEligibilityReload="loadData"
            />

            <carrier-detail-technical
              v-if="tabs[selectedRange] && tabs[selectedRange].type === detailsTab.TECH"
              :orderEligibility="orderEligibility"
              :carrier="carrier"
              :parent="parent"
              :params="getCarrierParams"
              :canEditEligibilities="canEditEligibilities"
            />

            <carrier-detail-administrative
              v-if="tabs[selectedRange] && tabs[selectedRange].type === detailsTab.ADMIN"
              :orderEligibility="orderEligibility"
              :params="getCarrierParams"
              :canEditEligibilities="canEditEligibilities"
            />

            <carrier-detail-indicators
              v-if="tabs[selectedRange] && tabs[selectedRange].type === detailsTab.INDICATORS"
              :params="getCarrierParams"
              :carrier="carrier"
            />
          </v-col>
        </v-row>

        <v-row no-gutters class="content-mobile" v-else>
          <v-col cols="12">
            <mp-chips-wrapper
              v-if="tabs"
              class="mt-3 mb-6"
              :chips="chipsTabs"
              :maxChips="5"
              v-model="selectedChips"
              data-id="carrier-details-menu-mobile"
            />

            <carrier-detail-general
              v-if="selectedChips && selectedChips.type === detailsTab.GENERAL"
              :retailers="retailers"
              :carrier="carrier"
              :orderEligibility="orderEligibility"
              :parent="parent"
              :params="getCarrierParams"
              :canEditEligibilities="canEditEligibilities"
            />

            <carrier-detail-parameter
              v-if="selectedChips && selectedChips.type === detailsTab.PARAMS"
              :orderEligibility="orderEligibility"
              :parent="parent"
              :params="getCarrierParams"
              :pickupPointConfig="pickupPointConfig"
              :canEditEligibilities="canEditEligibilities"
              @needEligibilityReload="loadData"
            />

            <carrier-detail-technical
              v-if="selectedChips && selectedChips.type === detailsTab.TECH"
              :parent="parent"
              :carrier="carrier"
              :orderEligibility="orderEligibility"
              :params="getCarrierParams"
              :canEditEligibilities="canEditEligibilities"
            />

            <carrier-detail-administrative
              v-if="selectedChips && selectedChips.type === detailsTab.ADMIN"
              :orderEligibility="orderEligibility"
              :params="getCarrierParams"
              :canEditEligibilities="canEditEligibilities"
            />

            <carrier-detail-indicators
              v-if="selectedChips && selectedChips.type === detailsTab.INDICATORS"
              :params="getCarrierParams"
              :carrier="carrier"
            />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import activateCarrierBtn from '@/components/activateCarrierBtn/activateCarrierBtn.vue'
import mpBreadcrumb from '@/components/breadcrumb/breadcrumb.vue'
import mpContact from '@/components/contact/contact.vue'
import contentHeader from '@/components/contentHeader/contentHeader.vue'
import downloadArchiveBtn from '@/components/downloadArchiveBtn/downloadArchiveBtn.vue'

import { AVAILABLE_LEVEL_SERVICES, PICKUP_POINTS_CONFIG } from '@/constants/shared'
import { ROUTES, EXCHANGE_PLACE_TYPE } from '@/constants'
import { authorizationMixin } from '@/mixins'
import AuthorizationService from '@/services/authorization/AuthorizationService'

import { GetCarrierParams, GetParamsKeys } from '@/services/carrier/CarrierRepository'

import CarrierService from '@/services/carrier/CarrierService'
import ExchangePlaceService from '@/services/exchangePlace/ExchangePlaceService'
import OrderEligibilityService from '@/services/orderEligibility/OrderEligibilityService'
import StoreService from '@/services/store/StoreService'
import { SET_CARRIER_DATA } from '@/store/modules/carrier/mutations-type'
import { SET_CARRIER_ELIGIBILITY_DATA } from '@/store/modules/carrierEligibility/mutations-type'

import { SET_BREADCRUMBS_LABEL, SET_HEADER_TITLE } from '@/store/mutation-types'
import { SnackBarType } from '@/store/types'
import {
  BadgeColor,
  CarrierEligibilityEntity,
  CarrierEntity,
  CurrentContext,
  ECOLOGY_TYPE,
  EligibilityContext,
  INTEGRATION_STATUS,
  RulesKey,
} from '@/types'
import carrierDetailAdministrative from '@/views/Carrier/Detail/administrative/administrative.vue'
import carrierDetailGeneral from '@/views/Carrier/Detail/general/general.vue'
import carrierDetailIndicators from '@/views/Carrier/Detail/indicators/indicators.vue'
import carrierDetailParameter from '@/views/Carrier/Detail/parameter/parameter.vue'
import carrierDetailTechnical from '@/views/Carrier/Detail/technical/technical.vue'
import mixins from 'vue-typed-mixins'
import { mapGetters } from 'vuex'

enum detailsTab {
  GENERAL = 'GENERAL',
  PARAMS = 'PARAMS',
  TECH = 'TECH',
  ADMIN = 'ADMIN',
  INDICATORS = 'INDICATORS',
}

export default mixins(authorizationMixin).extend({
  name: 'mp-carrier-detail',
  components: {
    mpBreadcrumb,
    contentHeader,
    mpContact,
    downloadArchiveBtn,
    activateCarrierBtn,
    carrierDetailGeneral,
    carrierDetailAdministrative,
    carrierDetailParameter,
    carrierDetailTechnical,
    carrierDetailIndicators,
  },
  data: () => ({
    hasLoaded: false,
    carrier: null as CarrierEntity | null,
    orderEligibility: null as CarrierEligibilityEntity | null,
    parent: null as CarrierEligibilityEntity | null,
    ROUTES,
    pickupPointConfig: null as Record<string, any> | null,
    retailers: [] as Array<Record<string, any>>,
    AVAILABLE_LEVEL_SERVICES,
    selectedRange: null as number | null,
    detailsTab,
    selectedChips: null,
    showArchiveModel: false,
    showActivationModal: false,
    getCarrierParams: {} as GetCarrierParams,
    ECOLOGY_TYPE,
    lightCarriers: [] as Array<{ id: number; name: string }>,
    context: null as string | null,
  }),
  beforeMount() {
    this.$store.dispatch('carrier/fetchAllCarriers')
    this.setInitialTab()
  },
  async mounted() {
    await this.loadData()
    this.getCurrentContext()

    if (this.context === EligibilityContext.EXCHANGE_PLACE) {
      const exchangePlace = await ExchangePlaceService.get(this.getCarrierParams.exchangePlaceId)

      if (exchangePlace.type === EXCHANGE_PLACE_TYPE.EXCHANGE_PLACE_DRIVE) {
        return this.$router.push({ name: ROUTES.noAccess })
      }
    }

    this.pickupPointConfig = this.carrier?.code ? PICKUP_POINTS_CONFIG[this.carrier.code] : null

    if (this.carrier) {
      const stores = this.getCarrierParams.storeId
        ? await StoreService.getFilters({
            forRule: 'READ_CARRIERS',
            retailerId: this.getCarrierParams.retailerId,
          })
        : []

      const exchangePlaces = this.getCarrierParams.exchangePlaceId
        ? await ExchangePlaceService.getFilters({
            forRule: 'READ_CARRIERS',
            storeId: this.getCarrierParams.storeId,
          })
        : []

      const breadcrumbsLabel = {
        carriers: this.carrier ? this.carrier.name : '',
        retailers: this.orderEligibility?.Retailer ? this.orderEligibility.Retailer.name : '',
        stores: stores.length
          ? stores.find(({ id }) => this.getCarrierParams.storeId === id)?.name
          : '',
        exchangePlaces: exchangePlaces.length
          ? exchangePlaces.find(({ id }) => this.getCarrierParams.exchangePlaceId === id)?.name
          : '',
      }

      this.$store.commit(SET_BREADCRUMBS_LABEL, JSON.stringify(breadcrumbsLabel))
      this.$store.commit(SET_HEADER_TITLE, this.carrier.name)

      if (this.parent && !this.parent.isActive) {
        return this.$router.push({ name: ROUTES.notFound })
      }

      this.lightCarriers = this.carriers.map((carrier: CarrierEntity) => {
        return { id: carrier.id, name: carrier.name }
      })
    } else {
      return this.$router.push({ name: ROUTES.notFound })
    }
  },
  computed: {
    ...mapGetters({
      carriersLight: 'carrier/carriersLight',
      carriers: 'carrier/carriers',
      currentUser: 'auth/currentUser',
    }),
    integrationStatuses(): Array<{ name: string; id: INTEGRATION_STATUS }> {
      return [
        { name: this.$t('common.integrated.study'), id: INTEGRATION_STATUS.STUDY },
        { name: this.$t('common.integrated.onGoing'), id: INTEGRATION_STATUS.IN_PROGRESS },
        { name: this.$t('common.integrated.base'), id: INTEGRATION_STATUS.INTEGRATED },
      ]
    },
    canReadDetails(): boolean {
      const { retailerId } = this.getCarrierParams
      const rule = retailerId ? 'READ_CARRIERS_DETAILED_CHILD' : 'READ_CARRIERS_DETAILED'

      return this.isAuthorized(rule, this.getCarrierParams)
    },
    tabs(): Array<{ title: string; type: string }> {
      const { retailerId } = this.getCarrierParams

      if (!retailerId) {
        return [
          ...(this.isAuthorized('READ_CARRIERS_GENERAL')
            ? [{ title: this.$t('common.general'), type: detailsTab.GENERAL }]
            : []),
          ...(this.isAuthorized(
            ['READ_CARRIERS_PARAMETERS', 'LIST_ORDER_ELIGIBILITIES'],
            this.getCarrierParams,
            'AND',
          )
            ? [{ title: this.$t('common.params'), type: detailsTab.PARAMS }]
            : []),
          ...(this.isAuthorized('READ_CARRIERS_TECHNICAL', this.getCarrierParams)
            ? [{ title: this.$t('common.tech'), type: detailsTab.TECH }]
            : []),
          ...(this.isAuthorized(
            ['READ_CARRIERS_ADMIN', 'LIST_ORDER_ELIGIBILITIES'],
            this.getCarrierParams,
            'AND',
          )
            ? [{ title: this.$t('common.admin'), type: detailsTab.ADMIN }]
            : []),
          ...(this.isAuthorized('READ_CARRIERS_INDICATORS', this.getCarrierParams)
            ? [{ title: this.$t('common.indicators'), type: detailsTab.INDICATORS }]
            : []),
        ]
      }

      return [
        ...(this.isAuthorized('READ_CARRIERS_GENERAL')
          ? [{ title: this.$t('common.general'), type: detailsTab.GENERAL }]
          : []),
        ...(this.isAuthorized(
          ['READ_CARRIERS_PARAMETERS_CHILD', 'LIST_ORDER_ELIGIBILITIES'],
          {},
          'AND',
        )
          ? [{ title: this.$t('common.params'), type: detailsTab.PARAMS }]
          : []),
        ...(this.isAuthorized('READ_CARRIERS_TECHNICAL_CHILD')
          ? [{ title: this.$t('common.tech'), type: detailsTab.TECH }]
          : []),
        ...(this.isAuthorized(['READ_CARRIERS_ADMIN_CHILD', 'LIST_ORDER_ELIGIBILITIES'], {}, 'AND')
          ? [{ title: this.$t('common.admin'), type: detailsTab.ADMIN }]
          : []),
        ...(this.isAuthorized('READ_CARRIERS_INDICATORS_CHILD')
          ? [{ title: this.$t('common.indicators'), type: detailsTab.INDICATORS }]
          : []),
      ]
    },
    getCreateRoute(): string {
      const { exchangePlaceId, storeId, retailerId } = this.orderEligibility || {}

      if (exchangePlaceId) {
        return ROUTES.createCarrierExchangePlaceNotificationState
      }

      if (storeId) {
        return ROUTES.createCarrierStoreNotificationState
      }

      if (retailerId) {
        return ROUTES.createCarrierRetailerNotificationState
      }

      return ROUTES.createCarrierNotificationState
    },
    getDetailRoute(): string {
      const { exchangePlaceId, storeId, retailerId } = this.orderEligibility || {}

      if (exchangePlaceId) {
        return ROUTES.detailCarrierExchangePlaceNotificationState
      }

      if (storeId) {
        return ROUTES.detailCarrierStoreNotificationState
      }

      if (retailerId) {
        return ROUTES.detailCarrierRetailerNotificationState
      }

      return ROUTES.detailCarrierNotificationState
    },
    canEditCarrier(): boolean {
      const { permissions } = this.currentUser
      const { exchangePlaceId, storeId, retailerId } = this.orderEligibility || {}

      if (exchangePlaceId) {
        return AuthorizationService.isAllowed('EDIT_EXCHANGE_PLACE_ELIGIBILITIES', permissions, {
          retailerId,
          storeId,
        })
      } else if (storeId) {
        return AuthorizationService.isAllowed('EDIT_STORE_ELIGIBILITIES', permissions, {
          retailerId,
          storeId,
        })
      } else if (retailerId) {
        return AuthorizationService.isAllowed('EDIT_RETAILER_ELIGIBILITIES', permissions, {
          retailerId,
        })
      }

      return AuthorizationService.isAllowed('EDIT_CARRIERS', permissions)
    },
    canToggleCarrier(): boolean {
      return (
        !(
          !this.orderEligibility ||
          !this.orderEligibility?.services?.length ||
          !this.orderEligibility?.typologies?.length ||
          !Object.keys(this.orderEligibility?.departments || {}).length ||
          !this.orderEligibility?.contact ||
          this.orderEligibility.Carrier.status === INTEGRATION_STATUS.STUDY ||
          !this.orderEligibility?.address
        ) || this.orderEligibility?.isActive === true
      )
    },
    isRootCarrier() {
      const { retailerId } = this.orderEligibility || {}
      return !retailerId
    },
    showEligibilitiesDetails() {
      return this.isAuthorized('LIST_ORDER_ELIGIBILITIES')
    },
    canEditEligibilities(): boolean {
      const { retailerId, storeId, exchangePlaceId, carrierId } = this.getCarrierParams
      const { permissions } = this.currentUser
      let eligibilitiesRule: RulesKey
      const eligibilitiesContext: CurrentContext = {
        carrierId,
        retailerId: null,
        storeId: null,
        exchangePlaceId: null,
      }
      switch (this.context) {
        case EligibilityContext.CARRIER: {
          eligibilitiesRule = 'EDIT_CARRIER_ELIGIBILITIES'
          break
        }

        case EligibilityContext.RETAILER: {
          eligibilitiesRule = 'EDIT_RETAILER_ELIGIBILITIES'
          eligibilitiesContext.retailerId = retailerId
          break
        }

        case EligibilityContext.STORE: {
          eligibilitiesRule = 'EDIT_STORE_ELIGIBILITIES'
          eligibilitiesContext.storeId = storeId
          eligibilitiesContext.retailerId = retailerId
          break
        }

        case EligibilityContext.EXCHANGE_PLACE: {
          eligibilitiesRule = 'EDIT_EXCHANGE_PLACE_ELIGIBILITIES'
          eligibilitiesContext.exchangePlaceId = exchangePlaceId
          eligibilitiesContext.storeId = storeId
          eligibilitiesContext.retailerId = retailerId
          break
        }

        default:
          return false
      }

      return AuthorizationService.isAllowed(eligibilitiesRule, permissions, eligibilitiesContext)
    },
    chipsTabs(): Array<{
      title: string
      type: string
      text: string
      value: string
      index: number
    }> {
      return this.tabs.map((tab: { title: string; type: string }, index: number) => {
        return {
          text: tab.title,
          value: tab.type,
          ...tab,
          index,
        }
      })
    },
    getStatusColor(): string {
      switch (this.carrier?.status) {
        case INTEGRATION_STATUS.INTEGRATED:
          return BadgeColor.GREEN
        case INTEGRATION_STATUS.STUDY:
        default:
          return BadgeColor.RED
        case INTEGRATION_STATUS.IN_PROGRESS:
          return BadgeColor.ORANGE
      }
    },
  },
  methods: {
    async loadData() {
      this.getCarrierParams = {
        carrierId: undefined,
        retailerId: undefined,
        storeId: undefined,
        exchangePlaceId: undefined,
      } as GetCarrierParams

      for (const [key, value] of Object.entries(this.$route.params)) {
        if (['carrierId', 'retailerId', 'storeId', 'exchangePlaceId'].includes(key)) {
          this.getCarrierParams[key as GetParamsKeys] = parseInt(value, 10)
        }
      }

      if (this.isAuthorized('READ_CARRIERS')) {
        this.carrier = await CarrierService.get(this.getCarrierParams.carrierId!)
      }

      if (this.isAuthorized('LIST_ORDER_ELIGIBILITIES')) {
        const {
          orderEligibilities: [orderEligibility],
          parents: [parent],
        } = await OrderEligibilityService.getAll(this.getCarrierParams)

        this.orderEligibility = {
          ...orderEligibility,
          tags: orderEligibility.tags || [],
        }
        this.parent = this.$route.params.retailerId ? parent : null

        if (!parent && this.isAuthorized('READ_CARRIERS_RETAILERS_LIST')) {
          this.retailers = await CarrierService.getActiveRetailer(this.getCarrierParams.carrierId)
        }

        this.$store.commit(
          `carrierEligibility/${SET_CARRIER_ELIGIBILITY_DATA}`,
          this.orderEligibility,
        )
      }

      this.hasLoaded = true
    },
    setInitialTab() {
      const { hash } = location
      const tab = hash.substring(1)

      if (tab) {
        this.selectedRange = Object.values(detailsTab).findIndex(tabName => tabName === tab)
        this.selectedChips = this.chipsTabs.find(({ type }) => type === tab)
      } else {
        this.selectedRange = 0
        this.selectedChips = this.chipsTabs.find(({ type }) => type === detailsTab.GENERAL)
      }

      if (this.$vuetify.breakpoint.smAndUp) {
        window.location.hash = `${this.tabs[this.selectedRange].type}`
      } else {
        window.location.hash = `${this.selectedChips.type}`
      }
    },
    getEditRoute() {
      this.$store.commit(`carrier/${SET_CARRIER_DATA}`, this.carrier)

      return { name: ROUTES.editCarrier }
    },
    getCurrentContext() {
      const { retailerId, storeId, exchangePlaceId } = this.getCarrierParams

      if (exchangePlaceId) {
        this.context = EligibilityContext.EXCHANGE_PLACE
      } else if (storeId) {
        this.context = EligibilityContext.STORE
      } else if (retailerId) {
        this.context = EligibilityContext.RETAILER
      } else {
        this.context = EligibilityContext.CARRIER
      }
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
    navigationCarrier(isNext = false): { id: number; name: string } | undefined {
      const allCarriers = this.carriers.map(({ id, name }: CarrierEntity) => ({
        id,
        name,
      }))
      const carriersLight = this.carriersLight.length ? this.carriersLight : allCarriers
      const index = carriersLight.findIndex(
        (carrier: Partial<CarrierEntity>) => carrier.id === this.carrier!.id,
      )

      return isNext ? carriersLight[index + 1] : carriersLight[index - 1]
    },
    goToNavigation(isNext = false) {
      const allCarriers = this.carriers.map(({ id, name }: CarrierEntity) => ({
        id,
        name,
      }))
      const carriersLight = this.carriersLight.length ? this.carriersLight : allCarriers
      const index = carriersLight.findIndex(
        (carrier: Partial<CarrierEntity>) => carrier.id === this.carrier!.id,
      )

      this.$router.replace({
        name: ROUTES.detailCarrier,
        params: {
          carrierId: isNext
            ? carriersLight[index + 1].id.toString()
            : carriersLight[index - 1].id.toString(),
        },
      })
    },
    async toggleCarrier() {
      if (!this.orderEligibility) {
        return
      }
      const { isActive } = this.orderEligibility
      try {
        await OrderEligibilityService.update(this.getCarrierParams, { isActive: !isActive })
        this.$store.dispatch('setSnackbar', {
          type: SnackBarType.SUCCESS,
          message: this.$t('messages.carrierUpdated'),
        })
        this.orderEligibility.isActive = !isActive
      } catch (err) {
        this.$store.dispatch('setSnackbar', {
          type: SnackBarType.ERROR,
          message: this.$t('messages.error'),
        })
      } finally {
        this.showActivationModal = false
      }
    },
    getIntegrationStatus(
      status: INTEGRATION_STATUS,
    ): { name: string; id: INTEGRATION_STATUS } | undefined {
      return this.integrationStatuses.find(({ id }) => status === id)
    },
  },
  watch: {
    selectedRange(next) {
      window.location.hash = `${this.tabs[next].type}`
    },
    selectedChips(next) {
      window.location.hash = `${next.type}`
    },
  },
})
</script>

<style lang="scss">
#carrier-detail {
  .width-max {
    width: 100%;
  }

  .integration-status {
    justify-content: center;
    display: flex;

    @media #{map-get($display-breakpoints, 'xs-only')} {
      border-radius: 5rem;
      width: 1.8rem;
      height: 1.8rem;
      align-items: center;
      margin-right: 1rem;
    }

    @media #{map-get($display-breakpoints, 'sm-and-up')} {
      width: 100%;
      color: $white;
      padding: 0.3rem 0;
      border-bottom-right-radius: 0.3rem;
      border-bottom-left-radius: 0.3rem;
    }

    &--red {
      background: $error-color;
    }
    &--orange {
      background: $alert-color;
    }
    &--green {
      background: $success-color;
    }
  }

  .carrier-new-mobile-green {
    background-color: $success-color;
    color: $white;
    padding: 0.7rem;
    border-radius: 0.6rem;
  }

  .carrier-details-menu {
    // margin: 0;
    margin-top: 5.4rem;

    .v-tabs-slider-wrapper {
      height: 0.5rem !important;
      margin-left: 3.8rem !important;

      .v-tabs-slider {
        width: 4rem;
        margin-right: 3.8rem !important;
      }
    }

    .tabs-range {
      min-width: fit-content;

      padding: 0;
      padding-right: 3.8rem;
      padding-left: 3.8rem;
    }

    .theme--light.v-tabs > .v-tabs-bar {
      background-color: $main-lighten-80-color;
      font-size: 22px;
    }
    .tabs-range.v-tab.v-tab--active {
      background-color: #fff;
    }
  }

  @media #{map-get($display-breakpoints, 'sm-and-up')} {
    padding: 0 0 2rem 0;
  }

  @media #{map-get($display-breakpoints, 'xs-only')} {
    padding: 0;
  }

  .content-header-outer-wrapper {
    .actions-wrapper {
      @media #{map-get($display-breakpoints, 'sm-only')} {
        display: flex;
        flex-direction: column;

        .edit-action {
          margin-left: 0 !important;
          margin-top: 1rem !important;
        }
      }

      .edit-action {
        margin-left: 1rem;
        margin-top: 0;
      }
    }
  }

  .content-container {
    @media #{map-get($display-breakpoints, 'xs-only')} {
      max-height: calc(100vh - 5.4rem - 6rem);
      overflow-y: scroll;

      &.no-sticky-button {
        max-height: calc(100vh - 5.4rem);
      }
    }

    .technical-data {
      min-height: 25rem;
      padding-top: 4.7rem;

      .logo-outer-wrapper {
        margin-bottom: 1.5rem;

        @media #{map-get($display-breakpoints, 'sm-and-up')} {
          max-height: 30rem;
          padding-right: calc(100vw / (38 * 2));
        }

        @media #{map-get($display-breakpoints, 'xs-only')} {
          margin-top: 1.2rem;
        }

        .logo-picto {
          display: flex;
          justify-content: center;
          background-color: $white;
          padding-bottom: 1rem;

          img {
            height: 4rem;
            width: 4rem;

            &:nth-child(2) {
              margin-left: 1rem;
            }
          }
        }

        .logo-wrapper {
          position: relative;
          display: flex;
          justify-content: center;
          background-color: $white;
          padding-top: 1rem;
          padding-bottom: 1rem;
          border-radius: 0.3rem;

          .logo {
            width: 20.2rem;
            height: 10rem;
            margin: 0 3rem;
          }

          .carrier-new-wrapper {
            position: absolute;
            top: 0;
            right: 0;
            overflow: hidden;
            max-width: 4.5rem;
            min-width: 4.5rem;

            .carrier-new {
              transform: rotate(45deg);
              overflow: hidden;
              margin-bottom: 2rem;
              margin-top: 0.8rem;
              margin-right: -1.5rem;
              display: flex;
              justify-content: center;

              &.green {
                background-color: $success-color;
              }
            }

            span {
              color: $white;
            }
          }
        }
      }

      @media #{map-get($display-breakpoints, 'sm-and-up')} {
        background-color: $main-lighten-80-color;
        // padding-bottom: 4.2rem;
        margin-bottom: 3.8rem;
      }

      @media #{map-get($display-breakpoints, 'xs-only')} {
        padding-left: 2.5rem;
        padding-right: 2.5rem;
      }

      .technical-container {
        @media #{map-get($display-breakpoints, 'xs-only')} {
          margin-top: 2rem;
        }

        @media #{map-get($display-breakpoints, 'sm-and-up')} {
          // padding-right: 3.6rem;
          padding-left: calc(100vw / (38 * 2));
        }

        .state {
          text-align: right;
          margin-bottom: 1.5rem;

          .private {
            display: flex;
            justify-content: flex-start;
            align-items: center;

            i {
              margin-right: 1rem;
              color: $main-color;
            }
          }

          .valid {
            display: flex;
            justify-content: flex-end;
            align-items: center;

            i {
              margin-right: 1rem;
            }
          }
        }

        .data-container {
          margin-bottom: 1rem;
          display: flex;
          align-items: center;

          .label {
            display: flex;
            align-items: center;

            .regular12 {
              color: $main-lighten-52-color;
            }
          }

          .value {
            display: flex;
            justify-content: flex-end;

            span {
              word-break: break-all;
              text-align: right;

              &.value-bold {
                font-weight: 700 !important;
              }
            }
          }

          .displayed-color-wrapper {
            display: flex;
            justify-content: flex-end;

            .displayed-color {
              height: 2rem;
              width: 2rem;
              border-radius: 50%;
            }
          }

          .note-value-outer-wrapper {
            display: flex;
            flex-direction: row;
            justify-content: flex-end;

            span {
              display: flex;
              align-items: center;
            }
          }
        }

        .divider {
          margin-bottom: 1.3rem;
          background-color: $main-lighten-74-color;

          &.first {
            @media #{map-get($display-breakpoints, 'xs-only')} {
              display: none;
            }
          }
        }
      }

      .description {
        background-color: $white;
        text-align: center;
        padding: 1rem 1rem;
        word-break: break-word;
      }

      .navigation-button-wrapper {
        @media #{map-get($display-breakpoints, 'xs-only')} {
          border: 0.1rem solid $main-color;
          border-radius: 5rem;
        }
        display: flex;
        margin-bottom: 3.5rem;

        .navigation-button {
          @media #{map-get($display-breakpoints, 'sm-and-up')} {
            border: 0.1rem solid $main-color;
            border-radius: 5rem;
          }
          padding: 1.2rem 1.7rem;
          display: flex;
          align-items: center;
          cursor: pointer;

          i {
            color: $main-color;
          }

          &.left {
            margin-right: auto;
          }

          &.right {
            margin-left: auto;
          }
        }
      }
    }

    .content-dsk {
      .left-column {
        @media #{map-get($display-breakpoints, 'md-and-up')} {
          padding-right: 3.8rem;
        }
      }

      .contact {
        .claim-url-label-wrapper {
          margin-bottom: 1rem;

          .regular14 {
            color: $main-lighten-52-color;
          }
        }

        .value-wrapper {
          word-break: break-all;
        }
      }
    }

    .content-mobile {
      padding: 2.5rem 2.5rem 6.4rem 2.5rem;
      background-color: $main-lighten-74-color;

      .v-expansion-panel {
        margin-bottom: 0.5rem;
        margin-top: 0;

        .action-outer-wrapper {
          width: 100%;
          padding-left: 3rem;
          padding-right: 3rem;

          .label-wrapper {
            span {
              color: $main-lighten-52-color;
            }
          }

          .value-wrapper {
            word-break: break-all;
          }
        }
      }
    }
  }

  .sticky-selection-wrapper {
    max-width: 90%;
    min-height: 12rem;
    max-height: 12rem;
    border: 0.2rem solid $main-lighten-4-color;
    border-radius: 1.5rem;
    position: sticky;
    bottom: 3.5rem;
    display: flex;
    background-color: $white;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 2rem;
    z-index: 1;

    -webkit-box-shadow: 0 0.5rem 0.5rem 0.5rem rgba(0, 0, 0, 0.25);
    box-shadow: 0 0.5rem 0.5rem 0.5rem rgba(0, 0, 0, 0.25);

    .sticky-infos {
      margin-top: 2.9rem;
      margin-left: 5rem;

      .title {
        font-family: Work Sans, sans-serif !important;
        font-size: 2rem !important;
        line-height: 100% !important;
        font-weight: 500 !important;
        margin-bottom: 1.5rem;
      }
    }

    .actions-wrapper {
      margin-left: auto;
      margin-right: 3.3rem;
      display: flex;
      align-items: center;
    }
  }
}

#mp-dialog-confirmation {
  .main-dialog-content {
    .text-wrapper {
      margin: 2rem;
    }
  }
}
</style>
