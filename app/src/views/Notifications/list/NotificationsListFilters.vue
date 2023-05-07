<template>
  <filters-panel
    id="notifications-list-filter"
    dataId="notifications-list-filter"
    @deleteFilters="handleSubmit($event)"
    translateKey="technical.notifications"
    :filtersContent="filtersContent"
    :disableFilterBtn="isStripActive"
    :canSaveFilter="canSaveFilter"
    :filterSave="savedState"
    @resetFilterState="setFilterToSavedState($event)"
    :canReset="canReset"
    @reset="resetFilter()"
    @submit="handleSubmit()"
  >
    <template #actions>
      <slot name="actions" />
    </template>

    <template #form>
      <v-form ref="form" id="filters-notifications-form" v-if="hasLoaded">
        <v-row
          no-gutters
          :class="`filters-collects-fields${$vuetify.breakpoint.smAndUp ? ' pa-0' : ''}`"
        >
          <v-col cols="10" offset="1">
            <v-row no-gutters>
              <v-col :cols="fieldWrapperCols">
                <mp-select
                  :label="$t('common.retailer')"
                  v-model="filters.retailerId"
                  :items="getSelectItems(NotificationsItems.RETAILER)"
                  clearable
                  attach="#notifications-filters-retailer-select"
                  dropdownId="notifications-filters-retailer-select"
                  dataId="filters-notifications-fields-retailer"
                  :search="{ model: '', label: $t('action.search.base') }"
                />
              </v-col>

              <v-col :cols="fieldWrapperCols">
                <mp-select
                  :label="$t('common.store')"
                  v-model="filters.storeId"
                  :items="getSelectItems(NotificationsItems.STORE)"
                  @change="disableExchangePlacesField($event)"
                  clearable
                  attach="#notifications-filters-store-select"
                  dropdownId="notifications-filters-store-select"
                  dataId="filters-notifications-fields-store"
                  multiple
                  :disabled="!filters.retailerId"
                  chips
                  smallChips
                  deletableChips
                  hideSelected
                  :search="{ model: '', label: $t('action.search.base') }"
                />
              </v-col>

              <v-col :cols="fieldWrapperCols">
                <mp-select
                  :label="$t('common.exchangePlace')"
                  v-model="filters.exchangePlaceId"
                  :items="getSelectItems(NotificationsItems.EXCHANGE_PLACES)"
                  attach="#notifications-filters-exchangePlace-select"
                  dropdownId="notifications-filters-exchangePlace-select"
                  dataId="filters-notifications-fields-exchangePlace"
                  multiple
                  :disabled="disableExchangePlaces"
                  chips
                  smallChips
                  deletableChips
                  hideSelected
                  clearable
                  :search="{ model: '', label: $t('action.search.base') }"
                />
              </v-col>

              <v-col :cols="fieldWrapperCols">
                <mp-select
                  :label="$t('common.carrier')"
                  v-model="filters.carrierId"
                  :items="getSelectItems(NotificationsItems.CARRIER)"
                  @change="getCarriers($event)"
                  clearable
                  attach="#notifications-filters-carrier-select"
                  dropdownId="notifications-filters-carrier-select"
                  dataId="filters-notifications-fields-carrier"
                  multiple
                  chips
                  smallChips
                  deletableChips
                  hideSelected
                  :search="{ model: '', label: $t('action.search.base') }"
                />
              </v-col>

              <v-col :cols="fieldWrapperCols">
                <mp-select
                  :label="$t('page.detailOrder.notification.toCustomer')"
                  v-model="filters.target"
                  :items="getSelectItems(NotificationsItems.TARGET)"
                  clearable
                  attach="#notifications-filters-target-select"
                  dropdownId="notifications-filters-target-select"
                  dataId="filters-notifications-fields-target"
                  :search="{ model: '', label: $t('action.search.base') }"
                />
              </v-col>

              <v-col :cols="fieldWrapperCols">
                <mp-select
                  :label="$t('common.language')"
                  v-model="filters.language"
                  :items="getSelectItems(NotificationsItems.LANGUAGE)"
                  clearable
                  hideSelected
                  attach="#notifications-filters-lang-select"
                  dropdownId="notifications-filters-lang-select"
                  dataId="filters-notifications-fields-lang"
                />
              </v-col>

              <v-col :cols="fieldWrapperCols">
                <mp-select
                  :label="$t('technical.notifications.deliveryEvent')"
                  v-model="filters.event"
                  :items="getSelectItems(NotificationsItems.DELIVERY_EVENT)"
                  @change="disableEventField($event)"
                  clearable
                  attach="#notifications-filters-eventDelivery-select"
                  dropdownId="notifications-filters-eventDelivery-select"
                  dataId="filters-notifications-fields-eventDelivery"
                  multiple
                  chips
                  :disabled="disableDelivery"
                  smallChips
                  deletableChips
                  hideSelected
                  :search="{ model: '', label: $t('action.search.base') }"
                />
              </v-col>

              <v-col :cols="fieldWrapperCols">
                <mp-select
                  :label="$t('technical.notifications.collectEvent')"
                  v-model="filters.event"
                  :items="getSelectItems(NotificationsItems.COLLECT_EVENT)"
                  @change="disableCollectField($event)"
                  clearable
                  attach="#notifications-filters-eventClickAndCollect-select"
                  dropdownId="notifications-filters-eventClickAndCollect-select"
                  dataId="filters-notifications-fields-eventClickAndCollect"
                  multiple
                  chips
                  :disabled="disableCollect"
                  smallChips
                  deletableChips
                  hideSelected
                  :search="{ model: '', label: $t('action.search.base') }"
                />
              </v-col>

              <v-col :cols="fieldWrapperCols">
                <mp-checkbox-new
                  class="regular16"
                  dataId="filter-notifications-isReturn-checkbox"
                  :input-value="filters.isReturn"
                  :false-value="false"
                  :true-value="true"
                  @change="setIsReturn($event)"
                  :label="$t('technical.services.SERVICE_RETURN')"
                />
              </v-col>

              <v-col :cols="fieldWrapperCols">
                <div class="radio-wrapper" dataId="notification-filter-radio-wrapper">
                  <span class="main-lighten-52 regular16">{{
                    $t('technical.notifications.format')
                  }}</span>
                  <div class="radio-toolbar">
                    <input
                      type="radio"
                      id="radioSMS"
                      name="isActiveradio"
                      value="SMS"
                      v-model="filters.channel"
                      @click="toggleBtnChannel(NotificationsChannel.SMS)"
                      dataId="notification-filter-input-sms"
                    />
                    <label for="radioSMS" class="label type-label">
                      <v-icon class="main-color" size="1.6rem">mdi-message-reply-text</v-icon>
                      <span class="regular16">{{ $t('page.notificationAdministration.SMS') }}</span>
                    </label>
                    <input
                      dataId="notification-filter-input-mail"
                      type="radio"
                      id="radioEmail"
                      name="isActiveradio"
                      value="MAIL"
                      v-model="filters.channel"
                      @click="toggleBtnChannel(NotificationsChannel.MAIL)"
                    />
                    <label for="radioEmail" class="label type-label">
                      <v-icon color="black" size="16">mdi-email</v-icon>
                      <span class="regular16">{{
                        $t('page.notificationAdministration.MAIL')
                      }}</span>
                    </label>
                  </div>
                </div>
              </v-col>

              <v-col :cols="fieldWrapperCols">
                <div class="radio-wrapper" dataId="notification-filter-radio-wrapper">
                  <span class="main-lighten-52 regular16">{{ $t('common.state') }}</span>
                  <div class="radio-toolbar">
                    <input
                      type="radio"
                      id="radioActiveStateFilter"
                      name="isActiveRadio"
                      :value="true"
                      v-model="filters.isActive"
                      @click="toggleBtnIsActive(true)"
                      dataId="notification-filter-radio-active"
                    />
                    <label class="regular16 label active-label" for="radioActiveStateFilter">{{
                      $t('common.active')
                    }}</label>
                    <input
                      type="radio"
                      id="radioInactiveStateFilter"
                      name="isActiveRadio"
                      :value="false"
                      v-model="filters.isActive"
                      @click="toggleBtnIsActive(false)"
                      dataId="notification-filter-radio-inactive"
                    />
                    <label
                      for="radioInactiveStateFilter"
                      class="regular16 label active-label"
                    >{{ $t('common.inactiveVariant') }}
                    </label>
                  </div>
                </div>
              </v-col>

              <v-col :cols="fieldWrapperCols">
                <mp-checkbox-new
                  class="regular16"
                  dataId="filter-notifications-setAside-checkbox"
                  :label="$t('technical.notifications.asideCarrier')"
                  :input-value="filters.isCarrierSetAside"
                  :false-value="false"
                  :true-value="true"
                  @change="setAsideCarrier($event)"
                />
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-form>
    </template>
  </filters-panel>
</template>

<script lang="ts">
import mixins from 'vue-typed-mixins'
import RetailerService from '@/services/retailer/RetailerService'
import StoreService from '@/services/store/StoreService'
import CarrierService from '@/services/carrier/CarrierService'
import ExchangePlaceService from '@/services/exchangePlace/ExchangePlaceService'

import {
  RulesKey,
  CollectEvent,
  NOTIFICATIONS_TARGET,
  MappedItem,
  NotificationsChannel,
  NotificationsItems,
  DeliveryEventCustom,
} from '@/types'

import { filterFormMixin } from '@/mixins'

import { NotificationFilter } from '@/types'

import { AVAILABLE_LANGUAGES } from '@/plugins/i18n'

import filtersPanel from '@/components/filtersPanel/filtersPanel.vue'
import objectHelper from '@/helpers/objectHelper'

const rule: RulesKey = 'LIST_NOTIFICATION_STATE'

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
  subEvent: '',
  isCarrierSetAside: undefined,
  filterBy: undefined,
  target: '',
})

export default mixins(filterFormMixin).extend({
  name: 'notifications-list-filters',
  components: {
    filtersPanel,
  },
  props: {
    isStripActive: {
      type: Boolean,
      required: false,
    },
  },
  data: () => ({
    NotificationsChannel,
    NotificationsItems,
    disableCollect: false,
    disableDelivery: false,
    disableExchangePlaces: false,
    hasLoaded: false,
    filters: defaultFilters() as NotificationFilter,
    filtersContent: {
      carrierId: [] as MappedItem[],
      retailerId: [] as MappedItem[],
      storeId: [] as MappedItem[],
      exchangePlaceId: [] as MappedItem[],
      event: [] as MappedItem[],
      target: [] as MappedItem[],
      channel: [] as MappedItem[],
      isActive: [] as MappedItem[],
      isReturn: [] as MappedItem[],
      language: [] as MappedItem[],
      isCarrierSetAside: [] as MappedItem[],
    },
    isReturn: false,
    isCarrierSetAside: false,
    collectEvent: [] as MappedItem[],
    deliveryEvent: [] as any[],
    target: [] as MappedItem[],
    exchangePlaces: [] as MappedItem[],
    stores: [] as MappedItem[],
    retailers: [] as MappedItem[],
    carriers: [] as MappedItem[],
    languages: [] as MappedItem[],
    savedState: '',
    canSaveFilter: false,
    canReset: false,
  }),
  computed: {
    fieldWrapperCols(): number {
      const { xsOnly, mdAndDown } = this.$vuetify.breakpoint
      if (xsOnly) {
        return 12
      } else if (mdAndDown) {
        return 6
      }
      return 4
    },
  },
  beforeMount() {
    this.disableExchangePlaces = true
  },
  async mounted() {
    await this.getRetailers()
    await this.getCarriers()

    this.languages = Object.values(AVAILABLE_LANGUAGES).map(language => ({
      id: language,
      name: this.$t([`common.languages.${language}`]),
    }))

    this.filtersContent.language = this.languages
    ;(this.deliveryEvent = Object.values(DeliveryEventCustom as object).map(
      (deliveryStatus, index) => ({
        index: index,
        id: deliveryStatus.status,
        subEvent: deliveryStatus.subEvent ? deliveryStatus.subEvent : null,
        name: this.$t([
          `technical.status.delivery.${deliveryStatus.status}.${deliveryStatus.subStatus}`,
          `technical.notifications.subject.${deliveryStatus.status}.default`,
          `technical.notifications.subject.${deliveryStatus.status}`,
        ]),
      }),
    )),
      (this.target = Object.values(NOTIFICATIONS_TARGET).map(item => ({
        id: item,
        name: this.$t(`technical.notifications.targets.${item}`),
      }))),
      (this.filtersContent.target = this.target)

    this.collectEvent = Object.values(CollectEvent).map(item => ({
      id: item,
      name: this.$t([
        `technical.notifications.subject.${item}.default`,
        `technical.notifications.subject.${item}`,
      ]),
    }))

    this.filtersContent.event = [...this.collectEvent, ...this.deliveryEvent]

    this.filtersContent.isActive.push(
      { id: true, name: this.$t(`technical.notifications.active`) },
      { id: false, name: this.$t(`technical.notifications.inactive`) },
    )

    this.filtersContent.isReturn.push({
      id: true,
      name: this.$t(`technical.notifications.filterIsReturn`),
    })

    this.filtersContent.isCarrierSetAside.push({
      id: true,
      name: this.$t(`technical.notifications.filterSetAsideCarrier`),
    })

    this.filtersContent.channel.push(
      {
        id: 'SMS',
        name: this.$t(`technical.notifications.shortMessage`),
      },
      {
        id: 'MAIL',
        name: this.$t(`technical.notifications.mail`),
      },
    )
    const storeFilters = this.fromQueryToFilters(defaultFilters())

    if (typeof storeFilters?.retailerId === 'string') {
      storeFilters.retailerId = parseInt(storeFilters.retailerId, 10)
    }

    if (typeof storeFilters?.storeId === 'string') {
      storeFilters.storeId = [parseInt(storeFilters.storeId, 10)]
    } else if (Array.isArray(storeFilters?.storeId)) {
      storeFilters.storeId = storeFilters.storeId.map((sid: string) => parseInt(sid, 10))
    }

    if (typeof storeFilters?.exchangePlaceId === 'string') {
      storeFilters.exchangePlaceId = [parseInt(storeFilters.exchangePlaceId, 10)]
    }

    if (typeof storeFilters?.carrierId === 'string') {
      storeFilters.carrierId = [parseInt(storeFilters.carrierId, 10)]
    } else if (Array.isArray(storeFilters?.carrierId)) {
      storeFilters.carrierId = storeFilters.carrierId.map((sid: string) => parseInt(sid, 10))
    }

    if (typeof storeFilters?.event === 'string') {
      storeFilters.event = [storeFilters.event]
    }

    this.filters = {
      ...this.filters,
      ...(storeFilters && Object.keys(storeFilters).length && this.filterFilled(storeFilters)),
    }

    if (this.filters?.event?.length) {
      this.disableEventField(this.filters.event)
      this.disableCollectField(this.filters.event)
    }

    setTimeout(() => {
      this.submit(this.filters)
      this.hasLoaded = true
    }, 150)
  },
  methods: {
    disableEventField(deliveryEvent: string[]): void {
      if (
        this.deliveryEvent.find((element: any) =>
          Array.isArray(deliveryEvent)
            ? deliveryEvent.includes(element.id)
            : deliveryEvent === element.id,
        )
      ) {
        this.disableCollect = true
        return
      }
      this.disableCollect = false
    },
    disableCollectField(collectEvent: string[]): void {
      if (
        this.collectEvent.find((element: any) =>
          Array.isArray(collectEvent)
            ? collectEvent.includes(element.id)
            : collectEvent === element.id,
        )
      ) {
        this.disableDelivery = true
        return
      }
      this.disableDelivery = false
    },
    disableExchangePlacesField(echangePlaces: number[]): void {
      if (echangePlaces.length > 1) {
        this.disableExchangePlaces = true
        return
      }
      this.disableExchangePlaces = false
    },
    toggleBtnChannel(channel: string): void {
      if (typeof this.filters.channel === 'string') {
        if (this.filters.channel !== channel) {
          this.filters.channel = channel
        } else if (this.filters.channel === channel) {
          this.filters.channel = null
        }
      } else if (this.filters.channel === null) {
        this.filters.channel = channel
      }
    },
    toggleBtnIsActive(booleanValue: boolean): void {
      if (typeof this.filters.isActive === 'boolean') {
        if (this.filters.isActive === !booleanValue) {
          this.filters.isActive = booleanValue
          return
        }
        this.filters.isActive = null
      } else if (this.filters.isActive === null) {
        this.filters.isActive = booleanValue
      }
    },
    setIsReturn(isReturn: boolean): void {
      if (!isReturn) {
        this.filters.isReturn = undefined
      } else {
        this.isReturn = isReturn
        this.filters.isReturn = isReturn
      }
    },
    setAsideCarrier(setAside: boolean): void {
      if (!setAside) {
        this.filters.isCarrierSetAside = undefined
      } else {
        this.isCarrierSetAside = setAside
        this.filters.isCarrierSetAside = setAside
      }
    },
    async getRetailers(): Promise<void> {
      if (this.filters.retailerId) {
        this.retailers = []
        this.filters.retailerId = null
      }
      this.retailers = await RetailerService.getFilters({ forRule: rule })
      this.filtersContent.retailerId = this.retailers

      this.getStores(this.filters.retailerId)
    },
    async getStores(retailerId: number): Promise<void> {
      if (this.stores && this.hasLoaded) {
        this.stores = []
        this.filters.storeId = null
      }
      if (retailerId) {
        this.stores = await StoreService.getFilters({
          retailerId,
          forRule: rule,
        })
      }
      this.filtersContent.storeId = this.stores

      if (this.filters.storeId !== null) {
        this.getExchangePlaces(this.filters.storeId[0])
      }
    },
    async getExchangePlaces(storeId: number): Promise<void> {
      if (this.exchangePlaces && this.hasLoaded) {
        this.exchangePlaces = []
        this.filters.exchangePlaceId = null
      }
      if (storeId) {
        this.exchangePlaces = await ExchangePlaceService.getFilters({
          retailerId: this.filters.retailerId,
          storeId: this.filters.storeId[0],
          forRule: rule,
        })
      }
      this.filtersContent.exchangePlaceId = this.exchangePlaces
    },
    async getCarriers(): Promise<void> {
      this.carriers = await CarrierService.getFilters({ forRule: rule })
      this.filtersContent.carrierId = this.carriers
    },
    getSelectItems(type: string): Array<{ value: any; text: string }> | undefined {
      switch (type) {
        case NotificationsItems.RETAILER: {
          return this.retailers.length
            ? this.retailers.map(({ id, name }) => ({
                value: id,
                text: name,
              }))
            : []
        }
        case NotificationsItems.STORE:
          return this.stores.length
            ? this.stores.map(({ id, name }) => ({
                value: id,
                text: name,
              }))
            : []
        case NotificationsItems.CARRIER:
          return this.carriers.length
            ? this.carriers.map(({ id, name }) => ({
                value: id,
                text: name,
              }))
            : []
        case NotificationsItems.EXCHANGE_PLACES:
          return this.exchangePlaces.length
            ? this.exchangePlaces.map(({ id, name }) => ({
                value: id,
                text: name,
              }))
            : []
        case NotificationsItems.TARGET:
          return this.target.length
            ? this.target.map(({ id, name }) => ({
                value: id,
                text: name,
              }))
            : []
        case NotificationsItems.LANGUAGE:
          return this.languages.length
            ? this.languages.map(({ id, name }) => ({
                value: id,
                text: name,
              }))
            : []
        case NotificationsItems.DELIVERY_EVENT: {
          return Object.values(DeliveryEventCustom as object).map((deliveryStatus, index) => ({
            index: index,
            value: deliveryStatus.status,
            subEvent: deliveryStatus.subStatus ? deliveryStatus.subStatus : null,
            text: this.$t([
              `technical.status.delivery.${deliveryStatus.status}.${deliveryStatus.subStatus}`,
              `technical.notifications.subject.${deliveryStatus.status}.default`,
              `technical.notifications.subject.${deliveryStatus.status}`,
            ]),
          }))
        }
        case NotificationsItems.COLLECT_EVENT: {
          return Object.values(CollectEvent).map(item => ({
            value: item,
            text: this.$t([
              `technical.notifications.subject.${item}.default`,
              `technical.notifications.subject.${item}`,
            ]),
          }))
        }
        default:
          ;[]
      }
    },
    handleReset(): void {
      this.reset({ ...defaultFilters })
      this.disableDelivery = false
      this.disableCollect = false
    },
    handleSubmit(filters?: NotificationFilter): void {
      
      this.canSaveFilter = true
      
      if (filters) {
        if (filters.storeId) {
          if (!filters.storeId.length) {
            filters.exchangePlaceId = null
          }
        }
        this.filters = filters
      }

      this.submit(this.filters)

      this.$nextTick(() => {
        this.canSaveFilter = false
      })
    },
    setFilterToSavedState(savedState: string): void {
      this.filters = savedState ? JSON.parse(savedState) : defaultFilters()
    },
    resetFilter(): void {
      this.filters = defaultFilters()
    },
  },
  watch: {
    filters: {
      handler(next) {

        this.savedState = JSON.stringify(next)

        this.canReset = objectHelper.hasAtLeastOneDifference(next, defaultFilters())
      },
      deep: true,
    },
    'filters.retailerId'(next) {
      if (!next) {
        this.stores = []
        this.exchangePlaces = []
        return
      }

      this.getStores(next)
    },
    'filters.storeId'(next) {
      if (!next) {
        this.disableExchangePlaces = true
        return
      } else {
        if (next.length === 1) {
          this.disableExchangePlaces = false
          this.getExchangePlaces(next[0])
        } else if (next.length === 0) {
          this.exchangePlaces = []
          this.disableExchangePlaces = true
        } else if (next.length > 1) {
          this.disableExchangePlaces = true
          this.exchangePlaces = []
          this.filters.exchangePlaceId = []
        }
      }
    },
    'filters.event'(next) {
      if (!next?.length) {
        this.disableDelivery = false
        this.disableCollect = false
        return
      } else if (next.length === 0) {
        this.disableDelivery = false
        this.disableCollect = false
      }
    },
  },
})
</script>

<style lang="scss">
#notifications-list-filter {
  .collect-search {
    &.v-input--is-focused {
      .mdi-magnify {
        color: $success-color !important;
      }
    }
  }
}
#filters-notifications-form {
  margin-top: 1rem;

  .col {
    padding: 1rem;
  }

  .filters-notifications-actions {
    padding: 0 1.9rem 2rem 0;
    align-items: center;

    .action-reset,
    .action-apply {
      &-button {
        @media #{map-get($display-breakpoints, 'xs-only')} {
          height: 6rem !important;
        }
        width: 100%;
      }
    }

    .action-reset-wrapper {
      padding-right: 0.1rem;
      max-width: fit-content;
    }

    .action-apply-wrapper {
      padding-left: 0.1rem;
      max-width: fit-content;
    }
  }

  .radio-wrapper {
    display: flex;
    gap: 1rem;
    align-items: center;
  }
  .radio-toolbar {
    display: flex;
    gap: 1rem;
  }

  .radio-toolbar input[type='radio'] {
    opacity: 0;
    position: fixed;
    width: 0;
  }

  .label {
    font-size: 1.6rem;
    border-radius: 0.5rem;
    border: 0.1rem solid $main-lighten-65-color;
    display: flex;
    height: 4rem;
    justify-content: center;
    align-items: center;
    gap: 0.7rem;
    cursor: pointer;
  }
  .type-label {
    width: 10.4rem;
  }
  .active-label {
    width: 8.2rem;
  }
  .radio-toolbar input[type='radio']:checked + label {
    border: 0.2rem solid $main-color;
  }
}
</style>
