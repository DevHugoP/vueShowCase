<template>
  <filters-panel
    id="user-list-filter"
    dataId="user-list-filter"
    @deleteFilters="handleSubmit($event)"
    translateKey="page.users.filters"
    :filtersContent="filtersContent"
    :canSaveFilter="canSaveFilter"
    :filterSave="savedState"
    @resetFilterState="setFilterToSavedState($event)"
    :canReset="canReset"
    @reset="resetFilter()"
    @submit="handleSubmit()"
  >
    <template #title>
      {{ $t('action.filter.users') }}
    </template>

    <template #search>
      <mp-textfield
        :class="{
          'has-data': filters.name,
          'user-search-animated': $vuetify.breakpoint.mdAndUp,
          'user-search': !$vuetify.breakpoint.mdAndUp,
        }"
        :label="$t('action.search.placeholder')"
        v-model="filters.name"
        @press-enter="handleSubmit()"
        @input="$v.filters.name.$touch()"
        @blur="$v.filters.name.$touch()"
        :errors="getModelErrors($v.filters.name)"
        :isDirty="$v.filters.name.$dirty"
        dataId="user-list-usersFilters-form-name"
        prepend-inner-icon="mdi-magnify"
        hideDetails
        rounded
        outlined
        clearable
        dense
        :showValidationIcon="false"
      />
    </template>

    <template #form>
      <v-form id="filter-users-form" data-id="user-list-usersFilters-form" ref="form">
        <v-row
          no-gutters
          :class="
            `users-filters__fields${$vuetify.breakpoint.xsOnly ? '' : ' offset-1 col-10 pa-0'}`
          "
        >
          <v-col :cols="$vuetify.breakpoint.xsOnly ? 12 : 6" class="email-wrapper">
            <mp-textfield
              :label="$t('common.email')"
              v-model="filters.email"
              @press-enter="handleSubmit()"
              @input="$v.filters.email.$touch()"
              @blur="$v.filters.email.$touch()"
              :errors="getModelErrors($v.filters.email)"
              :isDirty="$v.filters.email.$dirty"
              dataId="user-list-usersFilters-form-email"
            />
          </v-col>

          <v-col
            :cols="$vuetify.breakpoint.xsOnly ? 12 : 6"
            class="carrier-wrapper"
            v-if="carriers.length !== 1"
          >
            <mp-select
              :label="$t('common.carrier')"
              v-model="filters.carrierId"
              :items="getSelectItems('carrier')"
              cacheItems
              clearable
              attach="#user-filters-carrier-select"
              dropdownId="user-filters-carrier-select"
              dataId="user-list-usersFilters-form-carrier"
            />
          </v-col>

          <v-col
            :cols="$vuetify.breakpoint.xsOnly ? 12 : 6"
            class="retailer-wrapper"
            v-if="retailers.length !== 1"
          >
            <mp-select
              :label="$t('common.retailer')"
              v-model="filters.retailerId"
              :items="getSelectItems('retailer')"
              clearable
              attach="#user-filters-retailer-select"
              dropdownId="user-filters-retailer-select"
              dataId="user-list-usersFilters-form-retailer"
              :search="{ model: '', label: $t('action.search.base') }"
            />
          </v-col>

          <v-col
            :cols="$vuetify.breakpoint.xsOnly ? 12 : 6"
            class="store-wrapper"
            v-if="retailers.length !== 1 || stores.length !== 1"
          >
            <mp-select
              :label="$t('common.store')"
              v-model="filters.storeId"
              :items="getSelectItems('store')"
              :disabled="!stores.length > 0"
              clearable
              attach="#user-filters-store-select"
              dropdownId="user-filters-store-select"
              dataId="user-list-usersFilters-form-store"
            />
          </v-col>

          <v-col :cols="$vuetify.breakpoint.xsOnly ? 12 : 6" class="rules-group-wrapper">
            <mp-select
              :label="$t('common.rulesGroup')"
              v-model="filters.rulesGroupId"
              :items="getSelectItems('rulesGroup')"
              :disabled="!canUseGroupFilter"
              clearable
              attach="#user-filters-rulesGroup-select"
              dropdownId="user-filters-rulesGroup-select"
              dataId="user-list-usersFilters-form-rulesGroup"
            />
          </v-col>

          <v-col :cols="$vuetify.breakpoint.xsOnly ? 12 : 6" class="in-moderation-wrapper">
            <mp-select
              :label="$t('page.users.filters.inModeration')"
              v-model="filters.inModeration"
              :items="getSelectItems('inModeration')"
              cacheItems
              clearable
              attach="#user-filters-inModeration-select"
              dropdownId="user-filters-inModeration-select"
              dataId="carrier-list-usersFilters-form-inModeration"
            />
          </v-col>

          <v-col :cols="$vuetify.breakpoint.xsOnly ? 12 : 6" class="active-wrapper">
            <mp-select
              :label="$t('common.active')"
              v-model="filters.active"
              :items="getSelectItems('active')"
              cacheItems
              clearable
              attach="#user-filters-active-select"
              dropdownId="user-filters-active-select"
              dataId="carrier-list-usersFilters-form-active"
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
import { email, minLength } from 'vuelidate/lib/validators'

import { RulesGroupEntity, UsersFilters } from '@/types'

import RetailerService from '@/services/retailer/RetailerService'
import StoreService from '@/services/store/StoreService'

import { RulesKey, Filters } from '@/types'

import { filterFormMixin, validationMixin } from '@/mixins'
import CarrierService from '@/services/carrier/CarrierService'
import AuthorizationService from '@/services/authorization/AuthorizationService'

import filtersPanel from '@/components/filtersPanel/filtersPanel.vue'
import objectHelper from '@/helpers/objectHelper'

const rule: RulesKey = 'LIST_USERS'

const defaultFilters = (): UsersFilters => ({
  name: '',
  email: '',
  carrierId: undefined,
  retailerId: undefined,
  storeId: undefined,
  rulesGroupId: undefined,
  inModeration: undefined,
  active: undefined,
})

export default mixins(filterFormMixin, validationMixin).extend({
  name: 'users-filters',
  components: {
    filtersPanel,
  },
  data: () => ({
    stores: [] as Filters[],
    retailers: [] as Filters[],
    carriers: [] as Filters[],
    inModeration: [] as any[],
    active: [] as any[],
    filters: defaultFilters() as UsersFilters,
    filtersContent: {
      carrierId: [] as any[],
      retailerId: [] as any[],
      storeId: [] as any[],
      rulesGroupId: [] as any[],
      inModeration: [] as any[],
      active: [] as any[],
    },
    isModified: false,
    savedState: '',
    canSaveFilter: false,
    canReset: false,
  }),
  validations: {
    filters: {
      name: {},
      email: { email, minLength: minLength(3) },
      inModeration: {},
      active: {},
    },
  },
  computed: {
    ...mapGetters({
      rulesGroups: 'rulesGroups/rulesGroups',
      currentUser: 'auth/currentUser',
    }),
    ...mapGetters('filters', {
      activeFilters: 'activeFilters',
    }),
    canUseGroupFilter() {
      const { permissions } = this.currentUser

      if (permissions.length && !AuthorizationService.isAllowed('LIST_RULES_GROUP', permissions)) {
        return false
      }
      this.$store.dispatch('rulesGroups/fetchAllRulesGroups')
      return true
    },
  },
  async beforeMount() {
    this.carriers = await CarrierService.getFilters({ forRule: rule })
    this.filtersContent.carrierId = this.carriers

    if (this.carriers.length === 1) {
      this.filters.carrierId = this.carriers[0].id.toString()
    }

    const boolFilter = [
      { name: this.$t('common.yes'), id: true },
      { name: this.$t('common.no'), id: false },
    ]
    this.inModeration = boolFilter
    this.active = boolFilter

    this.filtersContent.inModeration = this.inModeration
    this.filtersContent.active = this.active
  },
  async mounted() {
    const storeFilters = await this.fromQueryToFilters(defaultFilters())

    if (typeof storeFilters?.inModeration === 'boolean') {
      storeFilters.inModeration = storeFilters.inModeration.toString()
    }

    if (typeof storeFilters?.active === 'boolean') {
      storeFilters.active = storeFilters.active.toString()
    }

    if (storeFilters && Object.keys(storeFilters).length) {
      this.filters = {
        ...this.filters,
        ...this.filterFilled(storeFilters),
      }
    }

    setTimeout(() => {
      this.submit(this.filters)
    }, 50)

    await this.getRetailers()

    const { retailerId } = this.filters

    if (retailerId) {
      await this.getStores(retailerId)
    }
  },
  methods: {
    getSelectItems(type: string) {
      switch (type) {
        case 'carrier':
          return this.carriers.length
            ? this.carriers.map(({ id, name }) => ({
                value: id.toString(),
                text: name,
              }))
            : []

        case 'retailer':
          return this.retailers.length
            ? this.retailers.map(({ id, name }) => ({
                value: id.toString(),
                text: name,
              }))
            : []

        case 'store':
          return this.stores.length
            ? this.stores.map(({ id, name }) => ({
                value: id.toString(),
                text: name,
              }))
            : []

        case 'rulesGroup':
          return this.rulesGroups.length
            ? this.rulesGroups.map(({ id, name }: RulesGroupEntity) => ({
                value: id.toString(),
                text: name,
              }))
            : []

        case 'inModeration':
          return this.inModeration.length
            ? this.inModeration.map(({ id, name }: any) => ({
                value: id.toString(),
                text: name,
              }))
            : []

        case 'active':
          return this.active.length
            ? this.active.map(({ id, name }: any) => ({
                value: id.toString(),
                text: name,
              }))
            : []

        default:
          return
      }
    },
    async getStores(retailerId: string | number | null = null) {
      if (retailerId) {
        this.stores = []
        const saveStoreId = this.filters.storeId?.toString()
        this.stores = await StoreService.getFilters({ forRule: rule, retailerId })
        this.filtersContent.storeId = this.stores

        if (this.stores.length === 1) {
          this.filters.storeId = this.stores[0].id.toString()
        } else if (
          !saveStoreId ||
          !this.stores.find(store => store.id.toString() === saveStoreId)
        ) {
          this.filters.storeId = undefined
        }
      } else {
        this.filters.storeId = undefined
      }
    },
    async getRetailers() {
      this.retailers = await RetailerService.getFilters({ forRule: rule })
      this.filtersContent.retailerId = this.retailers

      if (this.retailers.length === 1) {
        this.filters.retailerId = this.retailers[0].id.toString()
      }
    },
    handleReset() {
      this.reset(defaultFilters())
    },
    handleSubmit(filters: UsersFilters) {
      if (this.$v.filters.$invalid) {
        return null
      }

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
    checkFilterEmpty(filters: UsersFilters) {
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
    'filters.retailerId'(next) {
      this.getStores(next)
    },
    rulesGroups(next) {
      this.filtersContent.rulesGroupId = next.length
        ? next.map(({ id, name }: RulesGroupEntity) => ({
            id: id.toString(),
            name,
          }))
        : []
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
#user-list-filter {
  .user-search-animated {
    &.v-input {
      transition: width 0.54s;
      transition-timing-function: cubic-bezier(0.39, 0.08, 0.49, 0.92);
    }
    .mdi-magnify {
      color: $main-lighten-52-color !important;
    }
    &.has-data {
      width: 40rem;
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
  .user-search {
    &.v-input--is-focused {
      .mdi-magnify {
        color: $main-color !important;
      }
      .mdi-close-circle {
        color: $main-color !important;
      }
    }
  }
}
#filter-users-form {
  .users-filters__fields {
    @media #{map-get($display-breakpoints, 'xs-only')} {
      padding: 0 2.4rem;
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

        &:nth-child(odd) {
          padding-left: 0;
        }

        &:nth-child(even) {
          padding-right: 0;
        }
      }
    }
  }

  .users-filters__actions {
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
</style>
