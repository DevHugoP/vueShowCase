<template>
  <filters-panel
    id="collect-list-filter"
    class="mb-4"
    dataId="collect-list-filter"
    @deleteFilters="handleSubmit($event)"
    translateKey="page.collects.filters"
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
      {{ $t('action.filter.collects') }}
    </template>
    <template #search>
      <mp-textfield
        :class="{
          'has-data': filters.id,
          'collect-search-animated': $vuetify.breakpoint.mdAndUp,
          'collect-search': !$vuetify.breakpoint.mdAndUp,
        }"
        :label="$t('page.collects.filters.id')"
        name="id"
        dataId="filters-collects-fields-id"
        v-model="filters.id"
        @press-enter="handleSubmit()"
        prepend-inner-icon="mdi-magnify"
        rounded
        hideDetails
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
      <v-form ref="form" id="filters-collects-form" v-if="hasLoaded">
        <v-row
          no-gutters
          class="filters-collects-fields"
          :class="{
            ' offset-1 col-10 pa-0': $vuetify.breakpoint.smAndUp,
            '': !$vuetify.breakpoint.smAndUp,
            'no-data': !filterResultLength,
          }"
        >
          <v-col :cols="fieldWrapperCols" v-if="retailers.length !== 1">
            <mp-select
              :label="$t('common.retailer')"
              v-model="filters.retailerId"
              :items="getSelectItems('retailer')"
              @change="getStores($event)"
              clearable
              attach="#collects-filters-retailer-select"
              dropdownId="collects-filters-retailer-select"
              dataId="filters-collects-fields-retailer"
              :search="{ model: '', label: $t('action.search.base') }"
            />
          </v-col>

          <v-col :cols="fieldWrapperCols" v-if="retailers.length !== 1 || stores.length !== 1">
            <mp-select
              :label="$t('common.store')"
              v-model="filters.storeId"
              :items="getSelectItems('store')"
              @change="getExchangePlaces($event)"
              clearable
              :disabled="!stores.length || !filters.retailerId"
              attach="#collects-filters-store-select"
              dropdownId="collects-filters-store-select"
              dataId="filters-collects-fields-store"
              :search="{ model: '', label: $t('action.search.base') }"
            />
          </v-col>

          <v-col
            :cols="fieldWrapperCols"
            v-if="retailers.length !== 1 || stores.length !== 1 || exchangePlaces.length !== 1"
          >
            <mp-select
              :label="$t('page.collects.filters.drive')"
              v-model="filters.exchangePlaceId"
              :items="getSelectItems('exchangePlace')"
              clearable
              :disabled="!exchangePlaces.length || !filters.storeId"
              attach="#collects-filters-exchangePlace-select"
              dropdownId="collects-filters-exchangePlace-select"
              dataId="filters-collects-fields-exchangePlace"
            />
          </v-col>

          <v-col :cols="fieldWrapperCols">
            <mp-select
              :label="$t('page.orders.filters.orderStatus')"
              v-model="filters.status"
              :items="getSelectItems('status')"
              cacheItems
              multiple
              chips
              smallChips
              clearable
              deletableChips
              hideSelected
              attach="#collects-filters-orderStatus-select"
              dropdownId="collects-filters-orderStatus-select"
              dataId="filters-collects-fields-status"
            />
          </v-col>

          <v-col :cols="fieldWrapperCols">
            <mp-date-range
              clearable
              :actions="{
                today: $t('common.today'),
                yesterday: $t('common.yesterday'),
                past30days: $t('components.daterange.past30days'),
              }"
              dataId="filters-collects-fields-createdDate"
              :label="$t('page.orders.filters.createdAt')"
              v-model="filters.createdAt"
              :dateHelper="dateHelper"
              attach="#filters-collects-form"
            />
          </v-col>

          <v-col :cols="fieldWrapperCols">
            <mp-date-range
              clearable
              :actions="{
                today: $t('common.today'),
                yesterday: $t('common.yesterday'),
                past30days: $t('components.daterange.past30days'),
              }"
              dataId="filters-collects-fields-pickDate"
              :label="$t('page.collects.filters.pickupDate')"
              v-model="filters.pickDate"
              :dateHelper="dateHelper"
              attach="#filters-collects-form"
            />
          </v-col>
        </v-row>
      </v-form>
    </template>
  </filters-panel>
</template>

<script lang="ts">
import mixins from 'vue-typed-mixins'
import { mapGetters } from 'vuex'

import { COLLECT_STATUS, RulesKey, Filters } from '@/types'

import ExchangePlaceService from '@/services/exchangePlace/ExchangePlaceService'

import { EXCHANGE_PLACE_TYPE } from '@/constants'

import { dateHelper } from '@/helpers/dateHelper'

import { filterFormMixin } from '@/mixins'
import StoreService from '@/services/store/StoreService'
import filtersPanel from '@/components/filtersPanel/filtersPanel.vue'
import objectHelper from '@/helpers/objectHelper'

const rule: RulesKey = 'LIST_COLLECTS'

export interface FilterCollectFilters {
  id: string
  retailerId: string
  storeId: string
  exchangePlaceId: string
  status?: string[]
  createdAt?: { start: string; end: string } | Record<string, never> | null
  pickDate?: { start: string; end: string } | Record<string, never> | null
}

const defaultFilter = (): FilterCollectFilters => ({
  id: '',
  retailerId: '',
  storeId: '',
  exchangePlaceId: '',
  status: [],
  createdAt: null,
  pickDate: null,
})

export default mixins(filterFormMixin).extend({
  name: 'collects-filter',
  components: {
    filtersPanel,
  },
  props: {
    filterResultLength: {
      type: Number,
      required: true,
    },
    retailers: {
      type: Array as () => Filters[],
      required: true,
    },
  },
  data: () => ({
    hasLoaded: false,
    filters: defaultFilter() as FilterCollectFilters,
    stores: [] as Array<{ id: number; name: string }>,
    exchangePlaces: [] as Array<{ id: number; name: string; externalId?: string }>,
    dateHelper,
    filtersContent: {
      retailerId: [] as any,
      storeId: [] as any,
      exchangePlaceId: [] as any,
      status: [] as any,
    },
    isModified: false,
    savedState: '',
    canSaveFilter: false,
    canReset: false,
  }),
  computed: {
    ...mapGetters('filters', {
      activeFilters: 'activeFilters',
    }),
    fieldWrapperCols() {
      const { xsOnly, mdAndDown } = this.$vuetify.breakpoint
      if (xsOnly) {
        return 12
      } else if (mdAndDown) {
        return 6
      }

      return 4
    },
  },
  mounted() {
    const storeFilters = this.fromQueryToFilters(defaultFilter())

    if (storeFilters && Object.keys(storeFilters).length) {
      const { status } = storeFilters

      if (status && typeof status === 'string') {
        storeFilters.status = [status]
      }
      
      this.filters = {
        ...this.filters,
        ...this.filterFilled(storeFilters),
      }
    }

    this.filtersContent.status = Object.values(COLLECT_STATUS).map(item => ({
      id: item,
      name: this.$t(`technical.status.collect.${item}`),
    }))
    this.hasLoaded = true
    this.submit(this.filters)
  },
  methods: {
    updateRetailers() {
      this.filtersContent.retailerId = this.retailers
      if (this.retailers.length === 1) {
        this.filters.retailerId = this.retailers[0].id.toString()
      }
    },
    async getStores(retailerId = '') {
      if (this.stores.length) {
        this.stores = []
        this.filters.storeId = ''
      }

      if (retailerId) {
        this.stores = await StoreService.getFilters({
          retailerId,
          forRule: rule,
        })

        this.filtersContent.storeId = this.stores

        if (this.stores.length === 1) {
          this.filters.storeId = this.stores[0].id.toString()
        }

        this.getExchangePlaces(this.filters.storeId)
      }
    },
    async getExchangePlaces(storeId = '') {
      if (this.exchangePlaces.length) {
        this.exchangePlaces = []
        this.filters.exchangePlaceId = ''
      }

      if (storeId) {
        this.exchangePlaces = await ExchangePlaceService.getFilters({
          retailerId: this.filters.retailerId,
          storeId,
          type: EXCHANGE_PLACE_TYPE.EXCHANGE_PLACE_DRIVE,
          forRule: rule,
        })

        this.filtersContent.exchangePlaceId = this.exchangePlaces

        this.filters.exchangePlaceId = ''

        if (this.exchangePlaces.length === 1) {
          this.filters.exchangePlaceId = this.exchangePlaces[0].id!.toString()
        }
      }
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
        case 'store': {
          return this.stores.length
            ? this.stores.map(({ id, name }) => ({
                value: id.toString(),
                text: name,
              }))
            : []
        }
        case 'exchangePlace': {
          return this.exchangePlaces.length
            ? this.exchangePlaces.map(({ id, name }) => ({
                value: id!.toString(),
                text: name,
              }))
            : []
        }
        case 'status': {
          return Object.values(COLLECT_STATUS).map(item => ({
            value: item,
            text: this.$t(`technical.status.collect.${item}`),
          }))
        }

        default: {
          return []
        }
      }
    },
    handleReset() {
      this.exchangePlaces = []
      this.reset({ ...defaultFilter })
    },
    handleSubmit(filters?: FilterCollectFilters) {
      this.canSaveFilter = true

      if (filters) {
        if (filters.createdAt && typeof filters.createdAt === 'string') {
          filters.createdAt = JSON.parse(filters.createdAt)
        }
        if ((filters as any).pickDate && typeof (filters as any).pickDate === 'string') {
          ;(filters as any).pickDate = JSON.parse((filters as any).pickDate)
        }
        this.filters = filters
      }
      this.isModified = false
      this.submit(this.filters)

      this.$nextTick(() => {
        this.canSaveFilter = false
      })
    },
    checkFilterEmpty(filters: FilterCollectFilters) {
      const isNullUndefEmptyStr = Object.values(filters).every(value => {
        if (!value || Object.keys(value).length === 0) {
          return true
        }
        return false
      })
      return isNullUndefEmptyStr
    },
    setFilterToSavedState(savedState: string): void {
      this.filters = savedState ? JSON.parse(savedState) : defaultFilter()
    },
    resetFilter(): void {
      this.filters = defaultFilter()
    },
  },
  watch: {
    filters: {
      handler(next) {
        this.isModified = true
        this.savedState = JSON.stringify(next)

        this.canReset = objectHelper.hasAtLeastOneDifference(next, defaultFilter())
      },
      deep: true,
    },
    retailers: {
      handler() {
        this.updateRetailers()
        this.getStores(this.filters.retailerId)
      },
      immediate: true,
    },
  },
})
</script>

<style lang="scss">
#collect-list-filter {
  .collect-search-animated {
    &.v-input {
      transition: width 0.54s;
      transition-timing-function: cubic-bezier(0.39, 0.08, 0.49, 0.92);
    }
    .mdi-magnify {
      color: $main-lighten-52-color !important;
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
  .collect-search {
    &.v-input--is-focused {
      .mdi-magnify {
        color: $main-lighten-52-color !important;
      }
      .mdi-close-circle {
        color: $main-color !important;
      }
    }
  }
}
#filters-collects-form {
  margin-top: 1rem;

  .filters-collects-fields {
    @media #{map-get($display-breakpoints, 'xs-only')} {
      max-height: calc(100vh - 17.5rem);
      min-height: calc(100vh - 17.5rem);
      overflow-y: scroll;
    }
  }

  .col {
    padding: 1rem;
  }

  .filters-collects-actions {
    @media #{map-get($display-breakpoints, 'sm-and-up')} {
      padding: 0 1.9rem 2rem 0;
      align-items: center;
    }

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

      @media #{map-get($display-breakpoints, 'xs-only')} {
        padding: 0 0.1rem 0 0;
      }

      @media #{map-get($display-breakpoints, 'sm-and-up')} {
        max-width: fit-content;
      }
    }

    .action-apply-wrapper {
      padding-left: 0.1rem;

      @media #{map-get($display-breakpoints, 'xs-only')} {
        padding: 0 0 0 0.1rem;
      }

      @media #{map-get($display-breakpoints, 'sm-and-up')} {
        max-width: fit-content;
      }
    }
  }
}
#filters-collects-form > .mp-daterange{
  @media #{map-get($display-breakpoints, 'xs-only')} {
    position: absolute;
    bottom: 6rem !important;
    top: unset !important;
  }
}
</style>
