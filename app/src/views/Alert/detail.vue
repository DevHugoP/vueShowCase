<template>
  <div id="alert-dialog">
    <!-- Header -->
    <div class="header">
      <h3 v-if="$vuetify.breakpoint.smAndUp">{{ $t('components.alertModal.title') }}</h3>
      <v-row no-gutters class="d-flex justify-center">
        <v-col
          cols="10"
          offset="0"
          sm="6"
          offset-sm="0"
          class="read"
        >
          <mp-chips-wrapper
            v-if="$vuetify.breakpoint.smAndUp"
            dataId="alert-dialog"
            :chips="[
              { text: $t('components.alertModal.all'), value: true },
              {
                text: $t('components.alertModal.nonRead'),
                value: false,
                disabled: !unreadAlertsCount,
              },
            ]"
            v-model="selectedChip"
            @input="userAlertParams.read = $event.value ? undefined : $event.value"
          />

          <mp-switch-tab
            class="switch-tab"
            v-else
            v-model="selectedChip"
            :labels="[$t('components.alertModal.all'), $t('components.alertModal.nonRead')]"
            :dataIds="['alertModal-read', 'alertModal-unread']"
            @input="userAlertParams.read = $event === 0 ? undefined : false"
            :disabled="[false, !unreadAlertsCount]"
          />
        </v-col>

        <v-col cols="10" sm="6" offset-sm="0" class="d-flex align-center">
          <v-icon
            :ripple="false"
            class="px-1 main-color"
            size="1.6rem"
            @click="
              $emit('closeModal')
              $router.push({
                name: ROUTES.alertConfigDetail,
              })
            "
          >
            mdi-cog
          </v-icon>
          <div
            class="filter-mobile-wrapper"
            v-if="$vuetify.breakpoint.xsOnly"
            @click="$refs.filtersPanel.togglePanel()"
          >
            <v-icon size="1.6rem" :ripple="false" class="main-color ml-6">
              mdi-tune
            </v-icon>
            <mp-badge
              v-if="getActiveFilter"
              :content="getActiveFilter"
              color="red"
              dataId="alertModal-filter-badge"
            />
          </div>

          <a
            :class="
              `regular14 d-flex align-center read-all${!unreadAlertsCount ? ' disabled' : ''}`
            "
            @click="unreadAlertsCount ? markAllAsRead() : null"
            data-id="alerts-mark-all-as-read"
          >
            <v-icon :ripple="false" class="px-1 main-color" size="1.5rem">mdi-bell-outline</v-icon>
            {{ $t('components.alertModal.markRead') }}
          </a>
        </v-col>
      </v-row>
    </div>

    <!-- Filtres -->
    <div class="filters" v-if="$vuetify.breakpoint.smAndUp">
      <span class="regular14 main-lighten-52 filters-title ">
        {{ `${$t('components.alertModal.filter')}:` }}
      </span>
      <div class="filters-menu-wrapper d-flex">
        <v-menu
          v-model="menuRetailer"
          :closeOnContentClick="false"
          bottom
          content-class="filter-list-menu nav-dropdown nav-dropdown__profile"
          left
          offset-y
          transition="slide-y-transition"
        >
          <template v-slot:activator="{ on }">
            <span v-on="on" class="regular14 activator-text pr-4" data-id="filter-retailers">
              {{ retailerMenuText }}
            </span>
          </template>

          <div class="filter-list-wrapper" data-id="filter-retailers-menu">
            <div
              :class="
                `filter-list${isFilterSelected(retailer, selectedRetailers) ? ' selected' : ''}`
              "
              v-for="(retailer, index) in retailers"
              :key="`filter-list-retailer-${index}`"
              @click="manageFilter(retailer, 'selectedRetailers')"
            >
              <span class="filter-list-text regular14">
                {{ retailer.text }}
              </span>
            </div>
          </div>
        </v-menu>

        <v-menu
          v-model="menuStore"
          :disabled="!userAlertParams.retailerId || !stores.length"
          :closeOnContentClick="false"
          bottom
          content-class="filter-list-menu nav-dropdown nav-dropdown__profile"
          left
          offset-y
          transition="slide-y-transition"
        >
          <template v-slot:activator="{ on }">
            <span
              v-on="on"
              :class="
                `regular14 px-4 activator-text${
                  !userAlertParams.retailerId || !stores.length ? ' disabled' : ''
                }`
              "
              data-id="filter-stores"
            >
              {{ storeMenuText }}
            </span>
          </template>

          <div class="filter-list-wrapper" data-id="filter-stores-menu">
            <div
              :class="`filter-list${isFilterSelected(store, selectedStores) ? ' selected' : ''}`"
              v-for="(store, index) in stores"
              :key="`filter-list-store-${index}`"
              @click="manageFilter(store, 'selectedStores')"
            >
              <span class="filter-list-text regular14">
                {{ store.text }}
              </span>
            </div>
          </div>
        </v-menu>

        <v-menu
          v-model="menuAlertType"
          :closeOnContentClick="false"
          bottom
          content-class="filter-list-menu nav-dropdown nav-dropdown__profile"
          left
          offset-y
          transition="slide-y-transition"
        >
          <template v-slot:activator="{ on }">
            <span v-on="on" class="regular14 activator-text pl-4" data-id="filter-types">
              {{ alertTypeMenuText }}
            </span>
          </template>

          <div class="filter-list-wrapper" data-id="filter-types-menu">
            <div
              :class="
                `filter-list${isFilterSelected(alertType, selectedAlertTypes) ? ' selected' : ''}`
              "
              v-for="(alertType, index) in alertTypes"
              :key="`filter-list-alertType-${index}`"
              @click="manageFilter(alertType, 'selectedAlertTypes')"
            >
              <span class="filter-list-text regular14">
                {{ alertType.text }}
              </span>
            </div>
          </div>
        </v-menu>
      </div>
    </div>

    <!-- Filter panel -->
    <filters-panel
      v-if="$vuetify.breakpoint.xsOnly"
      id="alert-list-filter"
      dataId="alert-list-filter"
      @deleteFilters="filterMobile($event)"
      ref="filtersPanel"
      :filtersContent="filtersContent"
      translateKey="page.alert.filters"
      :canSaveFilter="canSaveFilter"
      :filterSave="savedState"
      @resetFilterState="setFilterToSavedState($event)"
      :canReset="canReset"
      @reset="resetFilterPanel()"
      @submit="filterMobile()"
    >
      <template #form>
        <v-form id="filter-alerts-form" ref="form" data-id="alert-list-filters-form">
          <v-row no-gutters class="alerts-filters__fields flex-column">
            <v-col cols="12">
              <mp-select
                class="mb-5"
                :items="retailers"
                :label="$t('page.alert.filters.retailer')"
                cacheItems
                clearable
                dataId="alert-list-filters-retailer"
                v-model="filters.retailerId"
              />

              <mp-select
                class="mb-5"
                :items="stores"
                :label="$t('page.alert.filters.store')"
                clearable
                dataId="alert-list-filters-store"
                v-model="filters.storeIds"
                multiple
                chips
                smallChips
                deletableChips
                hideSelected
                :disabled="!stores.length"
              />

              <mp-select
                :items="alertTypes"
                :label="$t('page.alert.filters.types')"
                clearable
                dataId="alert-list-filters-type"
                v-model="filters.types"
                multiple
                chips
                smallChips
                deletableChips
                hideSelected
                top
              />
            </v-col>
          </v-row>
        </v-form>
      </template>
    </filters-panel>

    <!-- Content -->
    <div v-if="allAlertList.length" id="alert-list" class="list">
      <div v-for="category in categories" :key="`alert-${category}`" class="alert">
        <div v-if="alerts[`${category}`].length > 0" class="alert-day-header">
          <span class="medium16">
            {{ $t(`components.alertModal.${category}`) }}
          </span>
        </div>

        <div
          v-for="(alert, index) in alerts[`${category}`]"
          :key="`alert-${category}-${alert.id}`"
          :class="
            `alert-content d-flex${!alert.read ? ' unread' : ''}${index === 0 ? ' first' : ''}`
          "
          @click="
            updateReadAlert(alert.id, true)
            $emit('closeModal')
          "
        >
          <router-link :to="getOrderRoute(alert.orderId)" class="link-wrapper">
            <div class="d-flex">
              <!-- date && hour -->
              <div
                :class="
                  `alert-date d-flex regular12${$vuetify.breakpoint.xsOnly ? ' align-center' : ''}`
                "
              >
                <div>
                  <v-icon :ripple="false" class="date-icon main-lighten-52" size="1.8rem">
                    mdi-calendar-month
                  </v-icon>
                </div>
                <div class="pl-2" v-if="$vuetify.breakpoint.smAndUp">
                  <span class="regular12 main-lighten-52">
                    {{ dateHelper.format(alert.createdAt, 'P') }}
                  </span>
                  <br />
                  <span class="regular12 main-lighten-52">
                    {{ dateHelper.format(alert.createdAt, 'p') }}
                  </span>
                </div>
                <div v-else class="pl-2">
                  <span class="regular12 main-lighten-52">
                    {{
                      `${dateHelper.format(alert.createdAt, 'P')} - ${dateHelper.format(
                        alert.createdAt,
                        'p',
                      )}`
                    }}
                  </span>
                </div>
              </div>

              <div class="content-wrapper">
                <!-- Content of alert -->
                <mp-alert-model-display-content
                  v-if="$vuetify.breakpoint.smAndUp"
                  :name="`${alert.retailerName} - ${alert.storeName}`"
                  :type="alert.type"
                  :referenceNumber="alert.referenceNumber"
                />

                <!-- Action/Icon -->
                <div class="action-wrapper">
                  <div class="d-flex align-start">
                    <v-icon
                      v-if="isAuthorized('UPDATE_USER_ALERTS')"
                      :ripple="false"
                      :class="`px-1 main-color${$vuetify.breakpoint.xsOnly ? ' pr-9' : ''}`"
                      size="1.5rem"
                      @click.prevent.stop="updateReadAlert(alert.id, !alert.read)"
                    >
                      {{ !alert.read ? 'mdi-bell' : 'mdi-bell-outline' }}
                    </v-icon>
                    <v-icon
                      v-if="isAuthorized('DELETE_USER_ALERTS')"
                      :ripple="false"
                      class="px-1 main-lighten-52"
                      size="1.5rem"
                      @click.prevent.stop="deleteReadAlert(alert.id)"
                    >
                      mdi-close
                    </v-icon>
                  </div>
                </div>
              </div>
            </div>

            <!-- Content of alert -->
            <div v-if="$vuetify.breakpoint.xsOnly" class="content-mobile">
              <mp-alert-model-display-content
                :name="`${alert.retailerName} - ${alert.storeName}`"
                :type="alert.type"
                :referenceNumber="alert.referenceNumber"
              />
            </div>
          </router-link>
        </div>
      </div>
    </div>

    <div v-else class="no-alert regular16">
      <no-data dataId="alert-list-no-alert" />
    </div>
  </div>
</template>

<script lang="ts">
import { ROUTES } from '@/constants'
import { dateHelper } from '@/helpers/dateHelper'
import RetailerService from '@/services/retailer/RetailerService'
import StoreService from '@/services/store/StoreService'
import UserAlertService from '@/services/userAlert/UserAlertService'
import {
  AlertList,
  Filters,
  RulesKey,
  SelectItem,
  TYPE_ALERT,
  UserAlert,
  UserAlertParams,
} from '@/types'
import { OperationUnit } from '@meltingpoint/lastmile-internationalization'
import mixins from 'vue-typed-mixins'
import { mapGetters } from 'vuex'
import { authorizationMixin, filterFormMixin, socketMixin } from '@/mixins'

import noData from '@/components/noData/noData.vue'
import mpAlertModelDisplayContent from './components/displayContent/displayContent.vue'
import filtersPanel from '@/components/filtersPanel/filtersPanel.vue'
import objectHelper from '@/helpers/objectHelper'

export interface Alert {
  id: string
  createdAt: Date
  retailerId: string
  retailerName: string
  storeName: string
  storeId: string
  carrierId: string
  orderId: string
  type: TYPE_ALERT
  comment: string
  read: boolean
}

export interface AlertsFilters {
  retailerId?: number
  storeIds?: number[]
  types?: string[]
}

const rule: RulesKey = 'LIST_USER_ALERTS'

const defaultFilters = (): AlertsFilters => ({
  retailerId: undefined,
  storeIds: [],
  types: [],
})

export default mixins(authorizationMixin, socketMixin, filterFormMixin).extend({
  name: 'alert-dialog',
  components: {
    filtersPanel,
    mpAlertModelDisplayContent,
    noData,
  },
  data: () => ({
    allAlertList: [] as UserAlert[],
    categories: [] as string[],
    retailers: [] as SelectItem[],
    selectedRetailers: [] as SelectItem[],
    menuRetailer: false,
    retailerMenuText: '',
    stores: [] as SelectItem[],
    selectedStores: [] as SelectItem[],
    menuStore: false,
    storeMenuText: '',
    alertTypes: [] as SelectItem[],
    selectedAlertTypes: [] as SelectItem[],
    alertTypeMenuText: '',
    menuAlertType: false,
    ROUTES,
    alerts: {
      today: [],
      yesterday: [],
      past: [],
    } as AlertList,
    selectedChip: null as null | number | { text: string; value: boolean },
    dateHelper,
    userAlertParams: {
      read: undefined,
      limit: undefined,
      offset: 0,
    } as UserAlertParams,
    saveSelecteds: {
      selectedRetailers: [] as SelectItem[],
      selectedStores: [] as SelectItem[],
      selectedAlertTypes: [] as SelectItem[],
    },
    filters: defaultFilters(),
    filtersContent: {
      retailerId: [] as any,
      storeIds: [] as any,
      types: [] as any,
    },
    defaultMobileHeight: 0,
    savedState: '',
    canSaveFilter: false,
    canReset: false,
  }),
  sockets: {
    newAlert(payload: UserAlert) {
      // @ts-ignore
      this.allAlertList.push(payload)
    },
  },
  updated() {
    if (this.$vuetify.breakpoint.xsOnly) {
      const alertList = document.getElementById('alert-list')
      if (!this.defaultMobileHeight && alertList) {
        this.defaultMobileHeight = alertList.clientHeight
      }
      this.resizeMobileContent()
    }
  },
  computed: {
    ...mapGetters('alert', {
      paginationLimit: 'paginationLimit',
      unreadAlertsCount: 'unreadAlertsCount',
    }),
    getActiveFilter(): number {
      let activeFilter = 0

      if (this.selectedRetailers && !Array.isArray(this.selectedRetailers)) {
        activeFilter++
      }
      if (this.selectedStores && this.selectedStores.length) {
        activeFilter++
      }
      if (this.selectedAlertTypes && this.selectedAlertTypes.length) {
        activeFilter++
      }
      return activeFilter
    },
  },
  async beforeMount() {
    const types = Object.values(TYPE_ALERT).map(alertType => ({
      value: alertType,
      text: this.$t(`components.alertModal.typeAlertText.${alertType}`),
    }))

    if (this.$vuetify.breakpoint.lgAndUp) {
      types.unshift({
        text: this.$t('components.alertModal.allFeminin'),
        value: 0 as any,
      })
    }

    this.categories = ['today', 'yesterday', 'past']
    this.retailerMenuText = this.$t('breadcrumbs.retailers')
    this.storeMenuText = this.$t('common.stores')
    this.alertTypes = types
    this.alertTypeMenuText = this.$t('components.alertModal.type')
    this.selectedChip = this.$vuetify.breakpoint.xsOnly ? 0 : null
    this.userAlertParams.limit = this.paginationLimit

    if (this.$vuetify.breakpoint.lgAndUp && this.$route.name === ROUTES.alert) {
      this.$router.push(ROUTES.noAccess)
    }
    const filters = (await RetailerService.getFilters({ forRule: rule })).map((filter: Filters) => {
      return { value: filter.id.toString(), text: filter.name }
    })
    if (this.$vuetify.breakpoint.lgAndUp) {
      filters.unshift({ value: 0 as any, text: this.$t('components.alertModal.allFeminin') })
    }
    this.retailers = filters
    this.filtersContent.retailerId = this.retailers.map(item => ({
      id: item.value,
      name: item.text,
    }))

    this.filtersContent.types = this.alertTypes.map(item => ({
      id: item.value,
      name: item.text,
    }))
  },
  mounted() {
    if (this.$vuetify.breakpoint.xsOnly) {
      const storeFilters = this.fromQueryToFilters(defaultFilters())

      if (storeFilters && Object.keys(storeFilters).length) {
        const { storeIds, types } = storeFilters

        if (storeIds && typeof storeIds === 'string') {
          storeFilters.storeIds = [storeIds]
        }

        if (types && typeof types === 'string') {
          storeFilters.types = [types]
        }
      }

      const filters = {
        ...this.filters,
        ...(storeFilters && Object.keys(storeFilters).length && this.filterFilled(storeFilters)),
      }

      this.filterMobile(filters)
    }
    this.getMoreAlertListener()
  },
  methods: {
    resetFilter() {
      this.selectedRetailers = []
      this.selectedStores = []
      this.stores = []
      this.selectedAlertTypes = []
    },
    groupAlerts() {
      this.alerts = {
        today: [],
        yesterday: [],
        past: [],
      } as AlertList
      const today = new Date()
      for (const alert of this.allAlertList) {
        switch (dateHelper.diff(new Date(alert.createdAt), today, OperationUnit.DAYS)) {
          case 0:
            this.alerts.today.push(alert)
            break
          case 1:
            this.alerts.yesterday.push(alert)
            break
          default:
            this.alerts.past.push(alert)
            break
        }
      }
    },
    formatDate(date: Date) {
      return dateHelper.format(date, 'P p')
    },
    async updateAlerts() {
      this.userAlertParams = { ...this.userAlertParams }
      if (this.userAlertParams.read !== this.userAlertParams.read) {
        this.userAlertParams = {
          ...this.userAlertParams,
          limit: this.userAlertParams.limit,
          offset: this.userAlertParams.offset,
        }
      } else {
        this.userAlertParams = {
          ...this.userAlertParams,
          limit: this.paginationLimit,
          offset: 0,
        }
      }
      this.allAlertList = []
      this.getAlerts()
      this.socketEmit('unreadAlertsCount')
    },
    async getAlerts() {
      this.canSaveFilter = true

      const newAlerts = await UserAlertService.getUserAlert(this.userAlertParams)
      this.allAlertList = [...this.allAlertList, ...newAlerts]
      this.groupAlerts()

      this.$nextTick(() => {
        this.canSaveFilter = false
      })
    },
    async updateReadAlert(id: string, read: boolean) {
      await UserAlertService.updateUserAlert(id, read)
      this.updateAlerts()
    },
    async deleteReadAlert(id: string) {
      await UserAlertService.deleteUserAlert(id)
      this.updateAlerts()
    },
    async updateRetailer(retailerId: number) {
      if (retailerId) {
        const localStores = (await StoreService.getFilters({ forRule: rule, retailerId })).map(
          (store: Filters) => {
            return { value: store.id.toString(), text: store.name }
          },
        )
        if (this.$vuetify.breakpoint.smAndUp) {
          localStores.unshift({ value: 0 as any, text: this.$t('components.alertModal.all') })
        }
        this.stores = localStores
      } else {
        this.stores = []
      }

      if (this.$vuetify.breakpoint.xsOnly) {
        this.selectedStores = []
        this.filtersContent.storeIds = this.stores.map(item => ({
          id: item.value,
          name: item.text,
        }))
      }
    },
    getMoreAlertListener() {
      const alertList = document.getElementById('alert-list')

      alertList?.addEventListener('scroll', () => {
        const isAtBottom = alertList.scrollHeight - alertList.offsetHeight === alertList.scrollTop

        if (isAtBottom && Number.isInteger(this.allAlertList.length / this.paginationLimit)) {
          this.getMoreAlert()
        }
      })
    },
    async getMoreAlert() {
      if (this.userAlertParams.offset !== undefined && this.userAlertParams.limit !== undefined) {
        this.userAlertParams.offset += this.userAlertParams.limit
      }

      await this.getAlerts()
    },
    async markAllAsRead() {
      await UserAlertService.updateAllUserAlert(this.allAlertList.map((alert: Alert) => alert.id))
      this.updateAlerts()
    },
    isFilterSelected(localObject: SelectItem, selectedArray: SelectItem[]) {
      if (!selectedArray.length && localObject?.value === 0) {
        return true
      }
      return selectedArray.some(selected => selected.value === localObject.value)
    },
    manageFilter(localObject: SelectItem, selectedArray: string) {
      const isRetailer = selectedArray === 'selectedRetailers'

      if (localObject.value === 0) {
        ;(this as any)[selectedArray] = []
      } else {
        const localObjectIndex = ((this as any)[selectedArray] as SelectItem[]).findIndex(
          obj => obj.value === localObject.value,
        )

        if (localObjectIndex === -1) {
          if (isRetailer) {
            ;(this as any)[selectedArray] = [localObject]
            this.selectedStores = []
          } else {
            ;((this as any)[selectedArray] as SelectItem[]).push(localObject)
          }
        } else {
          ;((this as any)[selectedArray] as SelectItem[]).splice(localObjectIndex, 1)
        }
      }
    },
    getOrderRoute(orderId: number) {
      return {
        name: ROUTES.detailOrder,
        params: {
          id: orderId.toString(),
        },
      }
    },
    filterMobile(filters?: AlertsFilters) {
      if (filters) {
        this.filters = { ...defaultFilters(), ...filters }
      }

      this.userAlertParams = { ...this.userAlertParams, ...this.filters }
      this.updateAlerts()
      this.submit(this.filters)
    },
    resetFilterMobile() {
      const { selectedRetailers, selectedStores, selectedAlertTypes } = this.saveSelecteds
      this.selectedRetailers = selectedRetailers
      if (selectedRetailers && selectedRetailers.length) {
        this.updateRetailer(selectedRetailers as any)
      } else {
        this.updateRetailer(this.userAlertParams.retailerId!)
      }
      this.selectedStores = selectedStores
      this.selectedAlertTypes = selectedAlertTypes

      this.reset(defaultFilters())
    },
    resizeMobileContent() {
      const header = document.getElementsByTagName('header')
      const header2 = document.getElementsByClassName('header')
      const filter = document.getElementById('alert-list-filter')
      const mobileContent = document.getElementById('alert-list')

      if (mobileContent) {
        let newHeight = this.defaultMobileHeight
        if (header && header2 && filter) {
          newHeight =
            newHeight - (filter.clientHeight + header2[0].clientHeight) + header[0].clientHeight
        }
        mobileContent.style.height = `${newHeight}px`
      }
    },
    setFilterToSavedState(savedState: string): void {
      this.filters = savedState ? JSON.parse(savedState) : defaultFilters()
    },
    resetFilterPanel(): void {
      this.filters = defaultFilters()
    },
  },
  watch: {
    'filters.retailerId'(next) {
      this.updateRetailer(next as any)
    },
    allAlertList: {
      handler() {
        this.groupAlerts()
      },
    },
    selectedStores() {
      if (this.selectedStores.length) {
        this.storeMenuText = `${this.$t('common.stores')} (${this.selectedStores.length})`
      } else {
        this.storeMenuText = this.$t('common.stores')
      }
    },
    selectedChip() {
      this.updateAlerts()
    },
    menuRetailer(next) {
      if (!next) {
        if (!this.selectedRetailers.length) {
          this.userAlertParams.retailerId = null
          this.userAlertParams.storeIds = []
          this.selectedStores = []
          this.retailerMenuText = this.$t('breadcrumbs.retailers')
          this.storeMenuText = this.$t('common.stores')
        } else {
          const { text, value } = this.selectedRetailers[0]

          this.userAlertParams.retailerId = value as number
          this.updateRetailer(value as number)
          this.retailerMenuText = text
        }
        this.updateAlerts()
      }
    },
    menuStore(next) {
      if (!next) {
        if (!this.selectedStores.length) {
          this.userAlertParams.storeIds = []
          this.storeMenuText = this.$t('common.stores')
        } else {
          this.userAlertParams.storeIds = this.selectedStores.map(store => {
            return store.value as number
          })

          this.storeMenuText = `${this.$t('common.stores')} (${this.selectedStores.length})`
        }
        this.updateAlerts()
      }
    },
    menuAlertType(next) {
      if (!next) {
        if (!this.selectedAlertTypes.length) {
          this.userAlertParams.types = []
          this.alertTypeMenuText = this.$t('components.alertModal.type')
        } else {
          this.userAlertParams.types = this.selectedAlertTypes.map(alertType => {
            return alertType.value as string
          })

          this.alertTypeMenuText = `${this.$t('components.alertModal.type')} (${
            this.selectedAlertTypes.length
          })`
        }
        this.updateAlerts()
      }
    },
    filters: {
      deep: true,
      handler(next) {
        this.savedState = JSON.stringify(next)

        this.canReset = objectHelper.hasAtLeastOneDifference(next, defaultFilters())
      },
    },
  },
})
</script>

<style lang="scss">
@import '../../styles/mixins/macScrollbar';
#alert-dialog {
  .no-alert {
    background-color: $white;
    padding: 5rem;
    text-align: center;
  }

  @media #{map-get($display-breakpoints, 'sm-and-up')} {
    width: 54.2rem;
  }
  background-color: $white;

  .filters {
    display: flex;
    align-items: center;
    padding-left: 3rem;
    margin-top: 1.5rem;

    .filters-title {
      min-width: fit-content;
    }

    .filters-menu-wrapper {
      padding-left: 3rem;
      width: 100%;
    }

    .activator-text {
      cursor: pointer;
      word-break: break-word;
      max-width: 33%;

      &:not(:first-of-type) {
        border-left: 0.1rem solid $main-lighten-65-color;
      }

      &.disabled {
        color: $main-lighten-65-color;
        cursor: not-allowed;
      }
    }
  }

  .filters-panel {
    .filters__search {
      display: none;
    }

    #filter-alerts-form {
      .alerts-filters__fields {
        @media #{map-get($display-breakpoints, 'xs-only')} {
          padding: 0 2.4rem;
          overflow: scroll;
          max-height: calc(100vh - 24rem);
          min-height: calc(100vh - 24rem);
        }

        .col {
          margin-top: 1.2rem;
          margin-bottom: 1.2rem;

          @media #{map-get($display-breakpoints, 'xs-only')} {
            &:first-child {
              margin-top: 4.4rem;
            }
          }

          @media #{map-get($display-breakpoints, 'sm-and-up')} {
            padding: 0 1.9rem;

            &:nth-child(odd) {
              padding-left: 0;
            }

            &:nth-child(even) {
              padding-right: 0;
            }
          }
        }
      }

      .alerts-filters__actions {
        .action-reset,
        .action-apply {
          &__button {
            @media #{map-get($display-breakpoints, 'xs-only')} {
              height: 6rem !important;
            }

            width: 100%;
          }
        }

        .action-reset__wrapper {
          padding-right: 0.1rem;

          @media #{map-get($display-breakpoints, 'sm-and-up')} {
            max-width: fit-content;
          }
        }

        .action-apply__wrapper {
          padding-left: 0.1rem;

          @media #{map-get($display-breakpoints, 'sm-and-up')} {
            max-width: fit-content;
          }
        }
      }
    }
  }

  .header {
    width: 100%;
    height: 7rem;
    border-bottom: 0.1rem solid $main-lighten-74-color;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 3rem;
    padding-right: 1.4rem;

    @media #{map-get($display-breakpoints, 'xs-only')} {
      margin: 2.4rem 0 1rem 0;
      padding: 0;
      height: fit-content;
      border-bottom: none;
    }

    .read {
      width: fit-content;
      display: flex;

      @media #{map-get($display-breakpoints, 'sm-and-up')} {
        padding-left: 1.6rem;
      }

      @media #{map-get($display-breakpoints, 'xs-only')} {
        margin-bottom: 2.4rem;
      }

      .chip {
        margin-bottom: 0;
      }
    }

    .read-all {
      @media #{map-get($display-breakpoints, 'xs-only')} {
        margin-left: auto;
      }

      &.disabled {
        cursor: not-allowed;
        color: $main-lighten-65-color;

        i {
          color: $main-lighten-65-color !important;
        }
      }
    }

    .tab-wrapper {
      .v-tab {
        min-width: 50%;
      }
    }

    .filter-mobile-wrapper {
      display: flex;

      .v-badge {
        margin-left: -1rem;
        margin-bottom: 1.5rem;

        .v-badge__wrapper {
          max-width: 1rem;
          max-height: 1rem;

          .v-badge__badge {
            padding: 0.7rem;
            max-height: 100%;
            max-width: 100%;
            min-width: 100%;
            position: inherit;
          }
        }
      }
    }
  }

  .list {
    background-color: $white;
    max-height: 30rem;
    overflow-y: auto;
    margin-top: 0.5rem;
    margin-bottom: 0.1rem;
    @include setMacScrollbar('&');

    @media #{map-get($display-breakpoints, 'xs-only')} {
      max-height: calc(100vh - 9.2rem - 5.4rem);
    }

    .alert-day-header {
      margin: 3rem 0 0.5rem 3rem;

      @media #{map-get($display-breakpoints, 'xs-only')} {
        margin: 2rem 0 1.7rem 3rem;
      }
    }

    .alert-content {
      justify-content: space-between;
      padding: 1.5rem 2rem 1.5rem 3rem;
      height: fit-content;
      width: 100%;
      border-bottom: 0.1rem solid $main-lighten-74-color;

      &.first {
        border-top: 0.1rem solid $main-lighten-74-color;
      }

      a {
        text-decoration: none;
      }

      .link-wrapper {
        width: inherit;

        .content-wrapper {
          display: flex;
          justify-content: space-between;
          width: 100%;
        }
      }

      @media #{map-get($display-breakpoints, 'xs-only')} {
        .link-wrapper {
          display: flex;
          width: 100%;
          flex-direction: column;

          .alert-date {
            width: 100%;
          }

          .action-wrapper {
            display: flex;
            margin-left: auto;
          }

          .content-mobile {
            margin-top: 1rem;
          }
        }
      }
    }

    .unread {
      background-color: $main-lighten-80-color;
    }
  }
}

.filter-list-menu {
  background-color: $white;

  .filter-list-wrapper {
    background-color: $white;
    overflow-y: auto;
    max-height: calc(3.7rem * 7);

    .filter-list {
      min-height: 3.7rem;
      max-height: 3.7rem;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      margin: 0.6rem 1.2rem 0 1.2rem;
      border: 0.1rem solid $main-lighten-74-color;
      border-radius: 0.4rem;
      cursor: pointer;

      &:first-of-type {
        margin-top: 1.2rem;
      }

      &:last-of-type {
        margin-bottom: 1.2rem;
      }

      &.selected {
        border: 0.2rem solid $main-color;
      }

      .filter-list-text {
        padding-left: 1rem;
        padding-right: 1rem;
      }
    }
  }
}

.alert-filter-dialog {
  .modal-header-text-wrapper {
    margin-left: 1rem !important;
  }

  .main-dialog-content {
    min-height: calc(100vh - 5.2rem - 6rem);
    max-height: calc(100vh - 5.2rem - 6rem);
    overflow: auto;
  }

  .alert-modal-dialog-filter-actions-wrapper {
    button {
      width: 50%;
      min-height: 6rem;

      &:first-of-type {
        margin-right: 0.1rem;
      }
    }
  }
}

.switch-tab {
  .v-tabs-bar__content {
    justify-content: space-between;

    .v-tab {
      margin-left: 0 !important;
      margin-right: 0 !important;
    }
  }
}
</style>
