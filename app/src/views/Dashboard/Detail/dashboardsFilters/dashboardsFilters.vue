<template>
  <filters-panel
    dataId="dashboard-list"
    class="dashboard-filter-panel"
    @deleteFilters="handleSubmit($event)"
    translateKey="page.dashboard.filters"
    :filtersContent="filtersContent"
    :canSaveFilter="canSaveFilter"
    :filterSave="savedState"
    @resetFilterState="setFilterToSavedState($event)"
    :canReset="canReset"
    @reset="resetFilter()"
    @submit="handleSubmit()"
  >
    <template #title>
      {{ $t('action.filter.dashboards') }}
    </template>

    <template #form>
      <v-form id="filter-dashboard-form" data-id="dashboardFilters-form" ref="form">
        <div
          :class="
            `dashboard-filters__fields${$vuetify.breakpoint.xsOnly ? '' : ' offset-1 col-10 pa-0'}`
          "
        >
          <v-row no-gutters>
            <v-col
              :cols="$vuetify.breakpoint.xsOnly ? 12 : 6"
              class="retailer-wrapper"
              v-if="retailers.length !== 1"
            >
              <mp-select
                :label="$t('common.retailer')"
                v-model="filters.retailerIds"
                :items="getSelectItems('retailers')"
                multiple
                chips
                smallChips
                clearable
                deletableChips
                hideSelected
                :search="{ model: '', label: $t('action.search.base') }"
                attach="#dashboard-filters-retailer-select"
                dropdownId="dashboard-filters-retailer-select"
                dataId="dashboardFilters-form-retailer"
              />
            </v-col>

            <v-col
              :cols="$vuetify.breakpoint.xsOnly ? 12 : 6"
              class="store-wrapper"
              v-if="retailers.length !== 1 || stores.length !== 1"
            >
              <mp-select
                :label="$t('common.store')"
                v-model="filters.storeIds"
                :search="{ model: '', label: $t('action.search.base') }"
                :items="getSelectItems('stores')"
                :disabled="(stores && !stores.length > 0) || !retailers.length"
                multiple
                chips
                smallChips
                clearable
                deletableChips
                hideSelected
                attach="#dashboard-filters-store-select"
                dropdownId="dashboard-filters-store-select"
                dataId="dashboardFilters-form-store"
              />
            </v-col>
            <v-col
              :cols="$vuetify.breakpoint.xsOnly ? 12 : 6"
              class="carrier-wrapper"
              v-if="carriers.length !== 1"
            >
              <mp-select
                :label="$t('common.carrier')"
                v-model="filters.carrierIds"
                :search="{ model: '', label: $t('action.search.base') }"
                :items="getSelectItems('carriers')"
                :disabled="!carriers.length > 0"
                multiple
                chips
                smallChips
                clearable
                deletableChips
                hideSelected
                attach="#dashboard-filters-carrier-select"
                dropdownId="dashboard-filters-carrier-select"
                dataId="dashboardFilters-form-carrier"
              />
            </v-col>
          </v-row>
        </div>
      </v-form>
    </template>
  </filters-panel>
</template>

<script lang="ts">
import filtersPanel from '@/components/filtersPanel/filtersPanel.vue'
import objectHelper from '@/helpers/objectHelper'

import { authorizationMixin, filterFormMixin, validationMixin } from '@/mixins'
import CarrierService from '@/services/carrier/CarrierService'

import RetailerService from '@/services/retailer/RetailerService'
import StoreService from '@/services/store/StoreService'

import { CarrierEntity, Filters, RetailerEntity, RulesKey, StoreEntity } from '@/types'
import mixins from 'vue-typed-mixins'
import { mapGetters } from 'vuex'

export interface DashboardFilters {
  retailerIds?: number[]
  storeIds?: number[]
  carrierIds?: number[]
}

const rule: RulesKey = 'READ_DASHBOARD'

const defaultFilters = (): DashboardFilters => ({
  retailerIds: [],
  storeIds: [],
  carrierIds: [],
})

export default mixins(filterFormMixin, validationMixin, authorizationMixin).extend({
  name: 'dashboard-filters',
  components: {
    filtersPanel,
  },
  data: () => ({
    stores: [] as Filters[],
    retailers: [] as Filters[],
    carriers: [] as Filters[],
    filters: defaultFilters() as DashboardFilters,
    filtersContent: {
      retailerIds: [] as any[],
      storeIds: [] as any[],
      carrierIds: [] as any[],
    },
    isModified: false,
    savedState: '',
    canSaveFilter: false,
    canReset: false,
  }),
  computed: {
    ...mapGetters({
      rulesGroups: 'rulesGroups/rulesGroups',
    }),
    ...mapGetters('filters', {
      activeFilters: 'activeFilters',
    }),
  },
  async beforeMount() {
    if (this.isAuthorized(rule)) {
      this.retailers = await RetailerService.getFilters({ forRule: rule })
      this.filtersContent.retailerIds = this.retailers.map(retailer => {
        return {
          ...retailer,
          id: retailer.id.toString(),
        }
      })
      this.$store.dispatch('rulesGroups/fetchAllRulesGroups')

      if (this.retailers.length === 1) {
        this.filters.retailerIds = [this.retailers[0].id]

        await this.getStores(this.filters.retailerIds)
      }

      this.carriers = await CarrierService.getFilters({ forRule: rule })
      this.filtersContent.carrierIds = this.carriers.map(carrier => {
        return {
          ...carrier,
          id: carrier.id.toString(),
        }
      })

      if (this.carriers.length === 1) {
        this.filters.carrierIds = [this.carriers[0].id]
      }
    }

    const storeFilters = this.fromQueryToFilters(defaultFilters())

    if (storeFilters && Object.keys(storeFilters).length) {
      if (typeof storeFilters.retailerIds === 'string') {
        storeFilters.retailerIds = [storeFilters.retailerIds]
      }
      if (typeof storeFilters.storeIds === 'string') {
        storeFilters.storeIds = [storeFilters.storeIds]
      }
      if (typeof storeFilters.carrierIds === 'string') {
        storeFilters.carrierIds = [storeFilters.carrierIds]
      }

      this.filters = {
        ...this.filters,
        ...this.filterFilled(storeFilters),
      }

      setTimeout(() => {
        this.handleSubmit()
      }, 50)
    } else {
      this.handleSubmit()
    }
  },
  methods: {
    getSelectItems(type: string) {
      return (this as any)[type].length
        ? (this as any)[type].map(({ id, name }: RetailerEntity | StoreEntity | CarrierEntity) => ({
            value: id.toString(),
            text: name,
          }))
        : []
    },
    async getStores(retailerIds: string[] | number[] | null = null) {
      if (this.isAuthorized(rule) && retailerIds?.length) {
        let localStores = [] as Filters[]
        for (const retailerId of retailerIds) {
          localStores = [
            ...localStores,
            ...(await StoreService.getFilters({ forRule: rule, retailerId })),
          ]
        }
        this.stores = localStores

        if (this.filters.storeIds?.length) {
          this.filters.storeIds = this.filters.storeIds.filter(storeId =>
            localStores.some(({ id }) => id.toString() === ((storeId as unknown) as string)),
          )
        }

        this.filtersContent.storeIds = this.stores.map(store => {
          return {
            ...store,
            id: store.id.toString(),
          }
        })
      } else {
        this.filters.storeIds = []
        this.stores = []
      }
    },
    async handleReset() {
      this.reset(defaultFilters())

      const {
        filters: { retailerIds, carrierIds, storeIds },
      } = this

      this.submit({
        retailerIds,
        carrierIds,
        storeIds,
      })
    },
    handleSubmit(filters?: DashboardFilters) {
      this.canSaveFilter = true

      if (filters) {
        this.filters = filters
      }
      this.isModified = false
      this.submit(this.filters)
      this.$nextTick(() => {
        this.canSaveFilter = false
      })
    },
    checkFilterEmpty(filters: DashboardFilters) {
      return Object.values(filters).every(value => {
        return !value || Object.keys(value).length === 0
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
    'filters.retailerIds'(next) {
      this.getStores(next)
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
.dashboard-filter-panel {
  z-index: 2;

  #filter-dashboard-form {
    .dashboard-filters__fields {
      @media #{map-get($display-breakpoints, 'xs-only')} {
        padding: 0 2.4rem;
        overflow: scroll;
        max-height: calc(100vh - 18.5rem);
        min-height: calc(100vh - 18.5rem);
        display: flex;
        align-items: baseline;
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

    .dashboard-filters__actions {
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
  }
}
</style>
