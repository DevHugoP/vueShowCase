<template>
  <filters-panel
    id="order-list-filter"
    dataId="order-list-filter"
    @deleteFilters="handleSubmit($event)"
    translateKey="page.orders.filters"
    :filtersContent="filtersContent"
    :filterResultLength="filterResultLength"
    :canSaveFilter="canSaveFilter"
    :filterSave="savedState"
    @resetFilterState="setFilterToSavedState($event)"
    :canReset="canReset"
    @reset="resetFilter()"
    @submit="handleSubmit()"
  >
    <template #title>
      {{ $t('action.filter.orders') }}
    </template>

    <template #search>
      <mp-textfield
        :class="{
          'has-data': filters.referenceNumber,
          'order-search-animated': $vuetify.breakpoint.mdAndUp,
          'order-search': !$vuetify.breakpoint.mdAndUp,
        }"
        :label="translate('referenceNumber')"
        v-model="filters.referenceNumber"
        dataId="order-list-filters-referenceNumber"
        @press-enter="handleSubmit()"
        @input="$v.filters.referenceNumber.$touch()"
        @blur="$v.filters.referenceNumber.$touch()"
        :errors="getModelErrors($v.filters.referenceNumber)"
        :isDirty="$v.filters.referenceNumber.$dirty"
        prepend-inner-icon="mdi-magnify"
        hideDetails
        rounded
        outlined
        clearable
        dense
        :showValidationIcon="false"
      />
    </template>

    <template #actions>
      <slot name="actions" />
    </template>

    <template #form>
      <v-form ref="form" id="filter-orders-form" v-if="hasLoaded">
        <v-row
          no-gutters
          class="orders-filters__fields"
          :class="{
            'offset-1 col-10 pa-0': $vuetify.breakpoint.smAndUp,
            'no-data': filterResultLength !== undefined,
          }"
        >
          <v-col :cols="fieldWrapperCols" class="delivery-id-wrapper">
            <mp-textfield
              :label="translate('externalDeliveryId')"
              name="delivery-id"
              dataId="order-list-filters-externalDeliveryId"
              v-model="filters.externalDeliveryId"
              @press-enter="handleSubmit()"
              @input="$v.filters.externalDeliveryId.$touch()"
              @blur="$v.filters.externalDeliveryId.$touch()"
              :errors="getModelErrors($v.filters.externalDeliveryId)"
              :isDirty="$v.filters.externalDeliveryId.$dirty"
            />
          </v-col>

          <v-col :cols="fieldWrapperCols" class="retailer-wrapper" v-if="retailers.length !== 1">
            <mp-select
              :label="translate('retailer')"
              v-model="filters.retailerId"
              :items="getSelectItems('retailer')"
              @change="getStores($event)"
              clearable
              attach="#order-filters-retailer-select"
              dropdownId="order-filters-retailer-select"
              dataId="order-list-filters-retailer"
              :search="{ model: '', label: $t('action.search.base') }"
              disableLookup
            />
          </v-col>

          <v-col
            :cols="fieldWrapperCols"
            class="store-wrapper"
            v-if="retailers.length !== 1 || stores.length !== 1"
          >
            <mp-select
              :label="translate('store')"
              v-model="filters.storeId"
              :items="getSelectItems('store')"
              :disabled="!stores.length || !filters.retailerId"
              clearable
              attach="#order-filters-store-select"
              dropdownId="order-filters-store-select"
              dataId="order-list-filters-store"
              :search="{ model: '', label: $t('action.search.base') }"
              disableLookup
            />
          </v-col>

          <v-col :cols="fieldWrapperCols" class="order-status-wrapper">
            <mp-select
              :label="translate('orderStatus')"
              v-model="filters.status"
              :items="getOrderStatus"
              cacheItems
              multiple
              chips
              smallChips
              clearable
              deletableChips
              hideSelected
              attach="#order-filters-orderStatus-select"
              dropdownId="order-filters-orderStatus-select"
              dataId="order-list-filters-orderStatus"
            />
          </v-col>

          <v-col :cols="fieldWrapperCols" class="delivery-status-wrapper">
            <mp-select
              :label="translate('deliveryStatus')"
              v-model="filters.deliveryStatus"
              :items="getDeliveryStatus"
              cacheItems
              multiple
              chips
              smallChips
              clearable
              deletableChips
              hideSelected
              attach="#order-filters-deliveryStatus-select"
              dropdownId="order-filters-deliveryStatus-select"
              dataId="order-list-filters-deliveryStatus"
            />
          </v-col>

          <v-col :cols="fieldWrapperCols" class="picking-date-wrapper">
            <mp-date-range
              clearable
              dataId="order-list-filters-pickingDate"
              :actions="{
                today: $t('common.today'),
                yesterday: $t('common.yesterday'),
                past30days: $t('components.daterange.past30days'),
              }"
              :label="translate('pickingDate')"
              v-model="filters.pickDate"
              :dateHelper="dateHelper"
              attach="#filter-orders-form"
            />
          </v-col>

          <v-col :cols="fieldWrapperCols">
            <mp-date-range
              clearable
              dataId="order-list-filters-deliveryDate"
              :actions="{
                today: $t('common.today'),
                yesterday: $t('common.yesterday'),
                past30days: $t('components.daterange.past30days'),
              }"
              :label="translate('deliveryDate')"
              v-model="filters.deliveryDate"
              :dateHelper="dateHelper"
              attach="#filter-orders-form"
            />
          </v-col>

          <v-col :cols="fieldWrapperCols" class="created-at-wrapper">
            <mp-date-range
              clearable
              :actions="{
                today: $t('common.today'),
                yesterday: $t('common.yesterday'),
                past30days: $t('components.daterange.past30days'),
              }"
              dataId="order-list-filters-createdAt"
              :label="translate('createdAt')"
              v-model="filters.createdAt"
              :dateHelper="dateHelper"
              attach="#filter-orders-form"
            />
          </v-col>

          <v-col :cols="fieldWrapperCols" class="carrier-wrapper" v-if="carriers.length !== 1">
            <mp-select
              :label="translate('carrier')"
              v-model="filters.carrierId"
              :items="getSelectItems('carrier')"
              cacheItems
              clearable
              attach="#order-filters-carrier-select"
              dropdownId="order-filters-carrier-select"
              dataId="order-list-filters-carrier"
            />
          </v-col>

          <v-col :cols="fieldWrapperCols" class="services-wrapper">
            <mp-select
              :label="translate('deliveryService')"
              v-model="filters.services"
              :items="getDeliveryServices"
              cacheItems
              multiple
              chips
              smallChips
              clearable
              deletableChips
              hideSelected
              attach="#order-filters-deliveryService-select"
              dropdownId="order-filters-deliveryService-select"
              dataId="order-list-filters-deliveryService"
            />
          </v-col>

          <v-col :cols="fieldWrapperCols">
            <mp-textfield
              :label="translate('lastname')"
              name="lastname"
              dataId="order-list-filters-lastname"
              v-model="filters.lastname"
            />
          </v-col>

          <v-col :cols="fieldWrapperCols">
            <mp-textfield
              :label="translate('email')"
              name="email"
              dataId="order-list-filters-email"
              v-model="filters.email"
            />
          </v-col>

          <v-col :cols="fieldWrapperCols">
            <mp-select
              :label="translate('withComment')"
              v-model="filters.withComment"
              :items="getSelectItems('comment')"
              cacheItems
              clearable
              attach="#order-list-filters-withComment-select"
              dropdownId="order-list-filters-withComment-select"
              dataId="order-list-filters-withComment"
            />
          </v-col>
        </v-row>
      </v-form>
    </template>
  </filters-panel>
</template>

<script lang="ts">
import { AVAILABLE_LEVEL_SERVICES, ORDER_STATUS } from '@/constants/shared'
import { dateHelper } from '@/helpers/dateHelper'
import objectHelper from '@/helpers/objectHelper'
import { mapGetters } from 'vuex'

import { filterFormMixin, validationMixin } from '@/mixins'

import StoreService from '@/services/store/StoreService'
import filtersPanel from '@/components/filtersPanel/filtersPanel.vue'
import { Filters, RulesKey } from '@/types'
import { DELIVERY_STATUS_DETAIL } from '@/constants'
import mixins from 'vue-typed-mixins'
import { DateHelper } from '@meltingpoint/lastmile-internationalization'

export interface OrdersFilters {
  referenceNumber?: string
  externalDeliveryId?: string
  retailerId?: string
  storeId?: string
  status?: string[]
  services?: string[]
  deliveryStatus?: string[]
  deliverySubStatus?: string[]
  pickDate?: { start: string; end: string } | Record<string, unknown> | null
  deliveryDate?: { start: string; end: string } | Record<string, unknown> | null
  createdAt?: { start: string; end: string } | Record<string, unknown> | null
  carrierId?: string
  incidentType?: string[]
  lastname?: string
  email?: string
  withComment?: boolean | null
}

export interface OrdersFiltersVueData {
  retailers: Filters[]
  stores: Filters[]
  carriers: Filters[]
  dateHelper: DateHelper
  filters: OrdersFilters
  hasLoaded: boolean
  filtersContent: {
    retailerId: any[]
    storeId: any[]
    status: any[]
    deliveryStatus: any[]
    services: any[]
    carrierId: any[]
    incidentType: any[]
  }
}

const rule: RulesKey = 'LIST_ORDERS'

const defaultFilters = (): OrdersFilters => ({
  referenceNumber: '',
  externalDeliveryId: '',
  retailerId: undefined,
  storeId: undefined,
  services: [],
  status: [],
  deliveryStatus: [],
  pickDate: null,
  deliveryDate: null,
  createdAt: null,
  carrierId: undefined,
  lastname: '',
  email: '',
  withComment: null,
})

export default mixins(filterFormMixin, validationMixin).extend({
  name: 'orders-filters',
  components: {
    filtersPanel,
  },
  props: {
    retailers: {
      type: Array as () => Filters[],
      required: true,
    },
    carriers: {
      type: Array as () => Filters[],
      required: true,
    },
    filterResultLength: {
      type: Number,
      required: true,
    },
  },
  data: () => ({
    stores: [] as Filters[],
    withComment: [] as Array<{ name: string; id: boolean }>,
    dateHelper,
    filters: defaultFilters(),
    hasLoaded: false,
    filtersContent: {
      retailerId: [] as any[],
      storeId: [] as any[],
      status: [] as any[],
      deliveryStatus: [] as any[],
      services: [] as any[],
      carrierId: [] as any[],
      incidentType: [] as any[],
      withComment: [] as any[],
    },
    isModified: false,
    savedState: '',
    canSaveFilter: false,
    canReset: false,
  }),
  validations: {
    filters: {
      referenceNumber: {},
      externalDeliveryId: {},
    },
  },
  computed: {
    ...mapGetters('filters', {
      activeFilters: 'activeFilters',
    }),
    fieldWrapperCols(): number {
      const { xsOnly, mdAndDown } = this.$vuetify.breakpoint
      if (xsOnly) {
        return 12
      } else if (mdAndDown) {
        return 6
      }

      return 4
    },
    getOrderStatus(): Array<{ value: object; text: string }> {
      return Object.values(ORDER_STATUS as object).map(item => ({
        value: item,
        text: this.$t(`technical.status.order.${item}`),
      }))
    },
    getDeliveryStatus(): Array<{ value: number; text: string }> {
      return Object.values(DELIVERY_STATUS_DETAIL as object).map((deliveryStatus, index) => ({
        value: index,
        text: this.$t([
          `technical.status.delivery.${deliveryStatus.status}.${deliveryStatus.subStatus}`,
          `technical.status.delivery.${deliveryStatus.status}.default`,
        ]),
      }))
    },
    getDeliveryServices(): Array<{ value: object; text: string }> {
      return Object.values(AVAILABLE_LEVEL_SERVICES as object).map(item => ({
        value: item,
        text: this.$t(`technical.services.${item}`),
      }))
    },
  },
  beforeMount() {
    this.withComment = [{ name: this.$t('common.yes'), id: true }]

    this.filtersContent.withComment = this.withComment
  },
  async mounted() {
    // Fill fields if query params
    const storeFilters = this.fromQueryToFilters(defaultFilters())

    if (storeFilters && Object.keys(storeFilters).length) {
      const { deliveryStatus, services, status, withComment } = storeFilters

      if (deliveryStatus) {
        // array of index of DELIVERY_STATUS_DETAIL
        storeFilters.deliveryStatus = Array.isArray(deliveryStatus)
          ? deliveryStatus.map(statusIndex => Number(statusIndex))
          : [Number(deliveryStatus)]
      }

      if (services && typeof services === 'string') {
        storeFilters.services = [services]
      }

      if (status && typeof status === 'string') {
        storeFilters.status = [status]
      }

      if (typeof withComment === 'boolean') {
        storeFilters.withComment = storeFilters.withComment.toString()
      }

      this.filters = {
        ...this.filters,
        ...this.filterFilled(storeFilters),
      }
    }

    const { retailerId } = this.filters

    if (retailerId) {
      await this.getStores(retailerId)
    }

    this.filtersContent.status = Object.values(ORDER_STATUS).map(item => ({
      id: item,
      name: this.$t(`technical.status.order.${item}`),
    }))

    this.filtersContent.deliveryStatus = Object.values(DELIVERY_STATUS_DETAIL).map(
      (deliveryStatus, index) => ({
        id: index,
        name: this.$t([
          `technical.status.delivery.${deliveryStatus.status}.${deliveryStatus.subStatus}`,
          `technical.status.delivery.${deliveryStatus.status}.default`,
        ]),
      }),
    )

    this.filtersContent.services = Object.values(AVAILABLE_LEVEL_SERVICES).map(item => ({
      id: item,
      name: this.$t(`technical.services.${item}`),
    }))

    this.hasLoaded = true
  },
  methods: {
    translate(key: string) {
      return this.$t(`page.orders.filters.${key}`)
    },
    getSelectItems(type: string) {
      switch (type) {
        case 'retailer': {
          return this.retailers.length
            ? this.retailers.map(({ id, name }) => ({
                value: id.toString(),
                text: name,
              }))
            : []
        }

        case 'store':
          return this.stores.length
            ? this.stores.map(({ id, name }) => ({
                value: id.toString(),
                text: name,
              }))
            : []

        case 'carrier':
          return this.carriers.length
            ? this.carriers.map(({ id, name }) => ({
                value: id.toString(),
                text: name,
              }))
            : []

        case 'comment':
          return this.withComment.length
            ? this.withComment.map(({ id, name }) => ({
                value: id.toString(),
                text: name,
              }))
            : []

        default:
          return
      }
    },
    async getStores(retailerId: string | number | null = null) {
      this.stores = []
      const saveStoreId = this.filters.storeId?.toString()
      this.filters.storeId = undefined
      if (retailerId) {
        this.stores = await StoreService.getFilters({ forRule: rule, retailerId })
        this.filtersContent.storeId = this.stores

        if (this.stores.length === 1) {
          this.filters.storeId = this.stores[0].id.toString()
        } else if (saveStoreId && this.stores.find(store => store.id.toString() === saveStoreId)) {
          this.filters.storeId = saveStoreId
        }
      }
    },
    handleReset() {
      this.reset(defaultFilters())
    },
    handleSubmit(filters: OrdersFilters) {
      this.canSaveFilter = true

      if (filters) {
        if (filters.createdAt && typeof filters.createdAt === 'string') {
          filters.createdAt = JSON.parse(filters.createdAt)
        }

        if (filters.pickDate && typeof filters.pickDate === 'string') {
          filters.pickDate = JSON.parse(filters.pickDate)
        }

        if (filters.deliveryDate && typeof filters.deliveryDate === 'string') {
          filters.deliveryDate = JSON.parse(filters.deliveryDate)
        }
        this.filters = filters
      }
      this.isModified = false
      this.submit(this.filters)
      this.$nextTick(() => {
        this.canSaveFilter = false
      })
    },
    checkFilterEmpty(filters: OrdersFilters) {
      const isNullUndefEmptyStr = Object.values(filters).every(value => {
        if (!value || Object.keys(value).length === 0) {
          return true
        }
        return false
      })
      return isNullUndefEmptyStr
    },
    setFilterToSavedState(savedState: string): void {
      this.filters = savedState ? JSON.parse(savedState) : defaultFilters()
    },
    resetFilter(): void {
      this.filters = defaultFilters()
    },
  },
  watch: {
    'filters.retailerId'(next) {
      this.getStores(next)
    },
    retailers: {
      immediate: true,
      handler() {
        this.filtersContent.retailerId = this.retailers

        if (this.retailers.length === 1) {
          this.filters.retailerId = this.retailers[0].id.toString()
        }
      },
    },
    carriers: {
      immediate: true,
      handler() {
        this.filtersContent.carrierId = this.carriers

        if (this.carriers.length === 1) {
          this.filters.carrierId = this.carriers[0].id.toString()
        }
      },
    },
    filters: {
      handler(next) {
        this.isModified = true
        this.savedState = JSON.stringify(next)

        this.canReset = objectHelper.hasAtLeastOneDifference(next, defaultFilters())
      },
      deep: true,
    },
  },
})
</script>

<style lang="scss">
#order-list-filter {
  .order-search-animated {
    &.v-input {
      transition: width 0.54s;
      transition-timing-function: cubic-bezier(0.39, 0.08, 0.49, 0.92);
    }
    .mdi-magnify {
      color: $main-lighten-65-color !important;
    }
    &.v-input--is-focused {
      .mdi-close-circle {
        color: $main-color !important;
      }
      width: 40rem;
    }
    color: $main-color;
    width: 30rem;

    &.has-data {
      width: 40rem;
    }

    height: 5rem;
  }
  .order-search {
    &.v-input--is-focused {
      .mdi-magnify {
        color: $main-lighten-65-color !important;
      }
      .mdi-close-circle {
        color: $main-color !important;
      }
    }
  }
}
#filter-orders-form {
  .orders-filters__fields {
    @media #{map-get($display-breakpoints, 'xs-only')} {
      padding: 0 2.4rem;
      overflow: scroll;
      max-height: calc(100vh - 18.5rem);
      min-height: calc(100vh - 18.5rem);
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
      }

      @media #{map-get($display-breakpoints, 'md-and-down')} {
        &:nth-child(odd) {
          padding-left: 0;
        }

        &:nth-child(even) {
          padding-right: 0;
        }
      }

      @media #{map-get($display-breakpoints, 'lg-and-up')} {
        margin-top: 2rem;

        &:nth-child(3n + 1) {
          padding-left: 0;
        }

        &:nth-child(3n) {
          padding-right: 0;
        }
      }
    }
  }

  .orders-filters__actions {
    @media #{map-get($display-breakpoints, 'sm-and-up')} {
      padding: 0 1.9rem 2rem 0;
    }

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
  .mp-daterange{
    @media #{map-get($display-breakpoints, 'xs-only')} {
      position: absolute;
      bottom: 6rem !important;
      top: unset !important;
    }
  }
}
</style>
