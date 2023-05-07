<template>
  <filters-panel
    id="carrier-list-filter"
    dataId="carrier-list-filter"
    @deleteFilters="handleSubmit($event)"
    translateKey="page.carriers.filters"
    :filtersContent="filtersContent"
    :filterResultLength="filterResultLength"
    :canSaveFilter="canSaveFilter"
    :filterSave="savedState"
    @resetFilterState="setFilterToSavedState($event)"
    :canReset="canReset"
    @reset="resetFilter()"
    @submit="handleSubmit()"
  >
    <template #search>
      <mp-textfield
        :class="{
          'has-data': filters.name,
          'carrier-search-animated': $vuetify.breakpoint.mdAndUp,
          'carrier-search': !$vuetify.breakpoint.mdAndUp,
        }"
        :label="$t('action.search.placeholder')"
        v-model="filters.name"
        @press-enter="handleSubmit()"
        dataId="carrier-list-carriersFilters-form-name"
        @input="$v.filters.name.$touch()"
        @blur="$v.filters.name.$touch()"
        :errors="getModelErrors($v.filters.name)"
        :isDirty="$v.filters.name.$dirty"
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
      <v-form id="filter-carriers-form" ref="form" data-id="carrier-list-carriersFilters-form">
        <v-row
          no-gutters
          class="carriers-filters-fields"
          :class="{ 'no-data': !filterResultLength !== undefined }"
        >
          <v-col cols="12" sm="10" offset-sm="1">
            <v-row no-gutters>
              <v-col :cols="$vuetify.breakpoint.xsOnly ? 12 : 4" class="pr-5 custom-search-select">
                <mp-select
                  :label="$t('common.service_plural')"
                  v-model="filters.services"
                  :items="services()"
                  multiple
                  chips
                  smallChips
                  clearable
                  deletableChips
                  hideSelected
                  attach="#carrier-filters-services-select"
                  dropdownId="carrier-filters-services-select"
                  dataId="carrier-list-carriersFilters-form-services"
                  :search="{ model: '', label: $t('action.search.base') }"
                />
              </v-col>

              <v-col :cols="$vuetify.breakpoint.xsOnly ? 12 : 4" class="pr-5">
                <mp-select
                  :label="$t('common.statuses.active')"
                  v-model="filters.active"
                  :items="getSelectItems('active')"
                  cacheItems
                  clearable
                  attach="#carrier-filters-active-select"
                  dropdownId="carrier-filters-active-select"
                  dataId="carrier-list-carriersFilters-form-active"
                />
              </v-col>

              <v-col
                :cols="$vuetify.breakpoint.xsOnly ? 12 : 4"
                class="pr-5"
                v-if="getSelectItems('private').length > 1"
              >
                <mp-select
                  :label="$t('page.carriers.filters.isPrivate')"
                  v-model="filters.isPrivate"
                  :items="getSelectItems('private')"
                  cacheItems
                  clearable
                  attach="#carrier-filters-private-select"
                  dropdownId="carrier-filters-private-select"
                  dataId="carrier-list-carriersFilters-form-private"
                />
              </v-col>

              <v-col :cols="$vuetify.breakpoint.xsOnly ? 12 : 4" class="pr-5">
                <mp-select
                  :label="$t('common.ecology.level')"
                  v-model="filters.ecologyType"
                  :items="getSelectItems('ecologyType')"
                  cacheItems
                  clearable
                  attach="#carrier-filters-ecology-select"
                  dropdownId="carrier-filters-ecology-select"
                  dataId="carrier-list-carriersFilters-form-ecology"
                />
              </v-col>

              <v-col :cols="$vuetify.breakpoint.xsOnly ? 12 : 4" class="pr-5">
                <mp-select
                  :label="$t('page.carrier.logistics.title')"
                  v-model="filters.logistics"
                  :items="getSelectItems('logistic')"
                  multiple
                  chips
                  smallChips
                  clearable
                  deletableChips
                  hideSelected
                  attach="#carrier-filters-logistic-select"
                  dropdownId="carrier-filters-logistic-select"
                  dataId="carrier-list-carriersFilters-form-logistic"
                />
              </v-col>

              <v-col :cols="$vuetify.breakpoint.xsOnly ? 12 : 4" class="pr-5">
                <mp-select
                  :label="$t('page.carrier.deliveryModel.title')"
                  v-model="filters.models"
                  :items="getSelectItems('model')"
                  multiple
                  chips
                  smallChips
                  clearable
                  deletableChips
                  hideSelected
                  attach="#carrier-filters-model-select"
                  dropdownId="carrier-filters-model-select"
                  dataId="carrier-list-carriersFilters-form-model"
                />
              </v-col>

              <v-col :cols="$vuetify.breakpoint.xsOnly ? 12 : 4" class="pr-5">
                <mp-select
                  :label="$t('page.carrier.promises.title')"
                  v-model="filters.promises"
                  :items="getSelectItems('promise')"
                  multiple
                  chips
                  smallChips
                  clearable
                  deletableChips
                  hideSelected
                  attach="#carrier-filters-promise-select"
                  dropdownId="carrier-filters-promise-select"
                  dataId="carrier-list-carriersFilters-form-promise"
                />
              </v-col>

              <v-col :cols="$vuetify.breakpoint.xsOnly ? 12 : 4" class="pr-5">
                <mp-select
                  :label="$t('common.integrated.level')"
                  v-model="filters.status"
                  :items="getSelectItems('status')"
                  cacheItems
                  clearable
                  attach="#carrier-filters-status-select"
                  dropdownId="carrier-filters-status-select"
                  dataId="carrier-list-carriersFilters-form-status"
                />
              </v-col>

              <v-col :cols="$vuetify.breakpoint.xsOnly ? 12 : 4" class="pr-5 custom-search-select">
                <mp-select
                  :label="$t('common.productTypology_plural')"
                  v-model="filters.typologies"
                  :items="typologies()"
                  multiple
                  chips
                  smallChips
                  clearable
                  deletableChips
                  hideSelected
                  attach="#carrier-filters-typologies-select"
                  dropdownId="carrier-filters-typologies-select"
                  dataId="carrier-list-carriersFilters-form-typologies"
                  :search="{ model: '', label: $t('action.search.base') }"
                />
              </v-col>

              <v-col :cols="$vuetify.breakpoint.xsOnly ? 12 : 4" class="pr-5 custom-search-select">
                <mp-select
                  :label="$t('page.carrier.vehicleType.title')"
                  v-model="filters.vehicleTypes"
                  :items="vehicleTypes()"
                  multiple
                  chips
                  smallChips
                  clearable
                  deletableChips
                  hideSelected
                  attach="#carrier-filters-vehicleType-select"
                  dropdownId="carrier-filters-vehicleType-select"
                  dataId="carrier-list-carriersFilters-form-vehicleType"
                  :search="{ model: '', label: $t('action.search.base') }"
                />
              </v-col>

              <v-col :cols="$vuetify.breakpoint.xsOnly ? 12 : 4" class="pr-5 custom-search-select">
                <mp-select
                  :label="$t('common.country.base')"
                  v-model="filters.countries"
                  :items="getCountryItems()"
                  multiple
                  chips
                  smallChips
                  clearable
                  deletableChips
                  hideSelected
                  attach="#carrier-filters-country-select"
                  dropdownId="carrier-filters-country-select"
                  dataId="carrier-list-carriersFilters-form-country"
                  :search="{ model: '', label: $t('action.search.base') }"
                  @change="handleCountryChange($event)"
                />
              </v-col>

              <v-col :cols="$vuetify.breakpoint.xsOnly ? 12 : 4" class="pr-5 custom-search-select">
                <mp-select
                  :label="$t('common.department_plural')"
                  v-model="filters.departments"
                  :items="getDepartmentsItems()"
                  multiple
                  chips
                  smallChips
                  clearable
                  deletableChips
                  hideSelected
                  attach="#carrier-filters-departments-select"
                  dropdownId="carrier-filters-departments-select"
                  dataId="carrier-list-carriersFilters-form-departments"
                  :search="{ model: '', label: $t('action.search.base') }"
                  :disabled="
                    !filters.countries ||
                      !(
                        filters.countries.length === 1 && filters.countries.includes(COUNTRY.FRANCE)
                      )
                  "
                />
              </v-col>

              <v-col :cols="$vuetify.breakpoint.xsOnly ? 12 : 4" class="pr-5">
                <mp-textfield
                  type="number"
                  :label="$t('page.carriers.filters.maxCombinedLength')"
                  v-model="filters.maxCombinedLength"
                  dataId="carrier-list-carriersFilters-form-maxCombinedLength"
                  @input="$v.filters.maxCombinedLength.$touch()"
                  @blur="$v.filters.maxCombinedLength.$touch()"
                  :errors="getModelErrors($v.filters.maxCombinedLength)"
                  :isDirty="$v.filters.maxCombinedLength.$dirty"
                />
              </v-col>

              <v-col :cols="$vuetify.breakpoint.xsOnly ? 12 : 4" class="pr-5">
                <mp-textfield
                  type="number"
                  :label="$t('page.carriers.filters.maxKilogramCapacity')"
                  v-model="filters.maxKilogramCapacity"
                  dataId="carrier-list-carriersFilters-form-maxKilogramCapacity"
                  @input="$v.filters.maxKilogramCapacity.$touch()"
                  @blur="$v.filters.maxKilogramCapacity.$touch()"
                  :errors="getModelErrors($v.filters.maxKilogramCapacity)"
                  :isDirty="$v.filters.maxKilogramCapacity.$dirty"
                />
              </v-col>

              <v-col :cols="$vuetify.breakpoint.xsOnly ? 12 : 4" class="pr-5">
                <mp-textfield
                  type="number"
                  :label="$t('page.carriers.filters.maxKilometricDistance')"
                  v-model="filters.maxKilometricDistance"
                  dataId="carrier-list-carriersFilters-form-maxKilometricDistance"
                  @input="$v.filters.maxKilometricDistance.$touch()"
                  @blur="$v.filters.maxKilometricDistance.$touch()"
                  :errors="getModelErrors($v.filters.maxKilometricDistance)"
                  :isDirty="$v.filters.maxKilometricDistance.$dirty"
                />
              </v-col>

              <v-col :cols="$vuetify.breakpoint.xsOnly ? 12 : 4" class="pr-5">
                <mp-checkbox-new
                  class="regular16 checkbox-color"
                  :label="$t('page.carriers.filters.isNew')"
                  :input-value="filters.isNew"
                  v-model="filters.isNew"
                  dataId="carrier-list-carriersFilters-form-new"
                  @change="filters.isNew = $event || undefined"
                />
              </v-col>

              <v-col :cols="$vuetify.breakpoint.xsOnly ? 12 : 4" class="pr-5">
                <mp-checkbox-new
                  class="regular16 checkbox-color"
                  :label="$t('page.carriers.filters.isLabeled')"
                  :input-value="filters.isLabeled"
                  v-model="filters.isLabeled"
                  dataId="carrier-list-carriersFilters-form-label"
                  @change="filters.isLabeled = $event || undefined"
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
import {
  ALLOWED_VEHICLE_TYPES,
  AVAILABLE_LEVEL_SERVICES,
  AVAILABLE_PRODUCT_TYPOLOGIES,
  COUNTRY,
  DEPARTMENTS,
} from '@/constants/shared'
import mixins from 'vue-typed-mixins'
import { authorizationMixin, filterFormMixin, validationMixin } from '@/mixins'
import { mapGetters } from 'vuex'
import { maxInt } from '@/constants'
import { maxValue, minValue, integer } from 'vuelidate/lib/validators'
import filtersPanel from '@/components/filtersPanel/filtersPanel.vue'

import { ECOLOGY_TYPE, INTEGRATION_STATUS, LOGISTICS, MODELS, PROMISES, SelectItem } from '@/types'
import objectHelper from '@/helpers/objectHelper'

export interface CarriersFilters {
  name: string
  services: string[]
  active?: boolean
  isNew?: boolean
  isPrivate?: boolean
  ecologyType?: ECOLOGY_TYPE
  models?: MODELS[]
  logistics?: LOGISTICS
  promises?: PROMISES[]
  status?: INTEGRATION_STATUS
  vehicleTypes?: string[]
  typologies: string[]
  countries: string[]
  departments: number[]
  maxCombinedLength?: number
  maxKilogramCapacity?: number
  maxKilometricDistance?: number
  isLabeled?: boolean
}

const defaultFilters = (): CarriersFilters => ({
  name: '',
  services: [],
  active: undefined,
  isPrivate: undefined,
  isNew: undefined,
  ecologyType: undefined,
  vehicleTypes: [],
  models: undefined,
  logistics: undefined,
  promises: undefined,
  status: undefined,
  typologies: [],
  countries: [],
  departments: [],
  maxCombinedLength: undefined,
  maxKilogramCapacity: undefined,
  maxKilometricDistance: undefined,
  isLabeled: undefined,
})

export default mixins(filterFormMixin, validationMixin, authorizationMixin).extend({
  name: 'carriers-filters',
  components: {
    filtersPanel,
  },
  props: {
    filterResultLength: {
      type: Number,
      required: true,
    },
  },
  data: () => ({
    COUNTRY,
    filters: defaultFilters() as CarriersFilters,
    active: [] as Array<{ name: string; id: boolean }>,
    private: [] as Array<{ name: string; id: boolean }>,
    ecologyType: [] as Array<{ name: string; id: ECOLOGY_TYPE }>,
    status: [] as Array<{ name: string; id: INTEGRATION_STATUS }>,
    model: [] as Array<{ name: string; id: MODELS }>,
    logistic: [] as Array<{ name: string; id: LOGISTICS }>,
    promise: [] as Array<{ name: string; id: PROMISES }>,
    filtersContent: {
      countries: [] as any,
      departments: [] as any,
      active: [] as any,
      isPrivate: [] as any,
      logistics: [] as any,
      promises: [] as any,
      ecologyType: [] as any,
      status: [] as any,
      models: [] as any,
      typologies: [] as any,
      services: [] as any,
      vehicleTypes: [] as any,
    },
    isModified: false,
    savedState: '',
    canSaveFilter: false,
    canReset: false,
  }),
  validations: {
    filters: {
      name: {},
      maxCombinedLength: { integer, minValue: minValue(0), maxValue: maxValue(maxInt) },
      maxKilogramCapacity: { integer, minValue: minValue(0), maxValue: maxValue(maxInt) },
      maxKilometricDistance: { integer, minValue: minValue(0), maxValue: maxValue(maxInt) },
    },
  },
  computed: {
    ...mapGetters('filters', {
      activeFilters: 'activeFilters',
    }),
  },
  async beforeMount() {
    this.active = [
      { name: this.$t('common.active'), id: true },
      { name: this.$t('common.inactiveVariant'), id: false },
    ]

    this.private = [
      ...(this.isAuthorized('READ_PRIVATE_CARRIERS')
        ? [{ name: this.$t('common.private'), id: true }]
        : []),
      { name: this.$t('common.public'), id: false },
    ]

    this.logistic = [
      { name: this.$t('page.carrier.logistics.crossdock'), id: LOGISTICS.CROSSDOCK },
      { name: this.$t('page.carrier.logistics.sorting'), id: LOGISTICS.SORTING },
      { name: this.$t('page.carrier.logistics.packaging'), id: LOGISTICS.PACKAGING },
      { name: this.$t('page.carrier.logistics.preparation'), id: LOGISTICS.PREPARATION },
    ]

    this.promise = [
      { name: this.$t('page.carrier.promises.scheduled'), id: PROMISES.SCHEDULED },
      { name: this.$t('page.carrier.promises.standard'), id: PROMISES.STANDARD },
      { name: this.$t('page.carrier.promises.same_day'), id: PROMISES.SAME_DAY },
      { name: this.$t('page.carrier.promises.next_day'), id: PROMISES.NEXT_DAY },
    ]

    this.ecologyType = [
      { name: this.$t('common.ecology.full'), id: ECOLOGY_TYPE.FULL },
      { name: this.$t('common.ecology.partial'), id: ECOLOGY_TYPE.PARTIAL },
      { name: this.$t('common.ecology.none'), id: ECOLOGY_TYPE.NONE },
    ]

    this.status = [
      { name: this.$t('common.integrated.study'), id: INTEGRATION_STATUS.STUDY },
      { name: this.$t('common.integrated.onGoing'), id: INTEGRATION_STATUS.IN_PROGRESS },
      { name: this.$t('common.integrated.base'), id: INTEGRATION_STATUS.INTEGRATED },
    ]

    this.model = [
      { name: this.$t('page.carrier.deliveryModel.local'), id: MODELS.LOCAL },
      { name: this.$t('page.carrier.deliveryModel.national'), id: MODELS.NATIONAL },
      { name: this.$t('page.carrier.deliveryModel.international'), id: MODELS.INTERNATIONAL },
      { name: this.$t('page.carrier.deliveryModel.relay'), id: MODELS.RELAY },
      { name: this.$t('page.carrier.deliveryModel.delivery'), id: MODELS.DELIVERY },
      { name: this.$t('page.carrier.deliveryModel.tour'), id: MODELS.TOUR },
      { name: this.$t('page.carrier.deliveryModel.store'), id: MODELS.STORE },
      { name: this.$t('page.carrier.deliveryModel.warehouse'), id: MODELS.WAREHOUSE },
    ]

    this.filtersContent.active = this.active
    this.filtersContent.isPrivate = this.private
    this.filtersContent.ecologyType = this.ecologyType
    this.filtersContent.status = this.status
    this.filtersContent.models = this.model
    this.filtersContent.promises = this.promise
    this.filtersContent.logistics = this.logistic
  },
  mounted() {
    const storeFilters = this.fromQueryToFilters(defaultFilters())

    if (typeof storeFilters?.countries === 'string') {
      storeFilters.countries = [storeFilters.countries]
    }

    if (typeof storeFilters?.departments === 'number') {
      storeFilters.departments = [storeFilters.departments.toString()]
    } else if (typeof storeFilters?.departments === 'string') {
      storeFilters.departments = [storeFilters.departments]
    }

    if (typeof storeFilters?.services === 'string') {
      storeFilters.services = [storeFilters.services]
    }

    if (typeof storeFilters?.typologies === 'string') {
      storeFilters.typologies = [storeFilters.typologies]
    }

    if (typeof storeFilters?.vehicleTypes === 'string') {
      storeFilters.vehicleTypes = [storeFilters.vehicleTypes]
    }

    if (typeof storeFilters?.logistics === 'string') {
      storeFilters.logistics = [storeFilters.logistics]
    }

    if (typeof storeFilters?.promises === 'string') {
      storeFilters.promises = [storeFilters.promises]
    }

    if (typeof storeFilters?.models === 'string') {
      storeFilters.models = [storeFilters.models]
    }

    if (typeof storeFilters?.country === 'string') {
      storeFilters.country = [storeFilters.country]
    }

    if (typeof storeFilters?.active === 'boolean') {
      storeFilters.active = storeFilters.active.toString()
    }

    if (typeof storeFilters?.isPrivate === 'boolean') {
      storeFilters.isPrivate = storeFilters.isPrivate.toString()
    }

    this.filters = {
      ...this.filters,
      ...(storeFilters && Object.keys(storeFilters).length && this.filterFilled(storeFilters)),
    }

    setTimeout(() => {
      this.submit(this.filters)
    }, 50)

    // Services
    const services: any[] = []

    for (const service in AVAILABLE_LEVEL_SERVICES) {
      if (AVAILABLE_LEVEL_SERVICES[service]) {
        services.push({
          id: AVAILABLE_LEVEL_SERVICES[service],
          name: this.$t(`technical.services.${AVAILABLE_LEVEL_SERVICES[service]}`),
        })
      }
    }

    this.filtersContent.services = services

    const typologies: any[] = []

    for (const typology in AVAILABLE_PRODUCT_TYPOLOGIES) {
      if (AVAILABLE_PRODUCT_TYPOLOGIES[typology]) {
        typologies.push({
          id: AVAILABLE_PRODUCT_TYPOLOGIES[typology],
          name: this.$t(`technical.typologies.${AVAILABLE_PRODUCT_TYPOLOGIES[typology]}`),
        })
      }
    }

    this.filtersContent.typologies = typologies

    const vehicleTypes: any[] = []

    for (const vehicle in ALLOWED_VEHICLE_TYPES) {
      if (ALLOWED_VEHICLE_TYPES[vehicle]) {
        vehicleTypes.push({
          id: ALLOWED_VEHICLE_TYPES[vehicle],
          name: this.$t(`technical.vehicleType.${ALLOWED_VEHICLE_TYPES[vehicle]}`),
        })
      }
    }

    this.filtersContent.vehicleTypes = vehicleTypes

    this.filtersContent.countries = Object.values(COUNTRY).map(value => ({
      name: this.$t(`common.country.${value}`),
      id: value,
    }))

    this.filtersContent.departments = Object.keys(DEPARTMENTS[COUNTRY.FRANCE]).map(value => ({
      name: DEPARTMENTS[COUNTRY.FRANCE][value],
      id: value,
    }))
  },
  methods: {
    vehicleTypes(): SelectItem[] {
      const vehicles: SelectItem[] = []

      for (const vehicle in ALLOWED_VEHICLE_TYPES) {
        if (ALLOWED_VEHICLE_TYPES[vehicle]) {
          vehicles.push({
            value: ALLOWED_VEHICLE_TYPES[vehicle],
            text: this.$t(`technical.vehicleType.${ALLOWED_VEHICLE_TYPES[vehicle]}`),
          })
        }
      }
      return vehicles
    },
    typologies(): SelectItem[] {
      const typologies: SelectItem[] = []

      for (const typology in AVAILABLE_PRODUCT_TYPOLOGIES) {
        if (AVAILABLE_PRODUCT_TYPOLOGIES[typology]) {
          typologies.push({
            value: AVAILABLE_PRODUCT_TYPOLOGIES[typology],
            text: this.$t(`technical.typologies.${AVAILABLE_PRODUCT_TYPOLOGIES[typology]}`),
          })
        }
      }
      return typologies
    },
    services(): SelectItem[] {
      const services: SelectItem[] = []

      for (const service in AVAILABLE_LEVEL_SERVICES) {
        if (AVAILABLE_LEVEL_SERVICES[service]) {
          services.push({
            value: AVAILABLE_LEVEL_SERVICES[service],
            text: this.$t(`technical.services.${AVAILABLE_LEVEL_SERVICES[service]}`),
          })
        }
      }
      return services
    },
    getCountryItems() {
      return Object.values(COUNTRY).map(value => ({
        text: this.$t(`common.country.${value}`),
        value,
      }))
    },
    getDepartmentsItems() {
      return Object.keys(DEPARTMENTS[COUNTRY.FRANCE]).map(value => ({
        text: DEPARTMENTS[COUNTRY.FRANCE][value],
        value,
      }))
    },
    handleCountryChange(countries: string[]): void {
      if (!(countries.length === 1 && countries[0] === COUNTRY.FRANCE)) {
        this.filters.departments = []
      }
    },
    getSelectItems(type: string) {
      switch (type) {
        case 'active':
          return this.active.length
            ? this.active.map(({ id, name }: any) => ({
                value: id.toString(),
                text: name,
              }))
            : []
        case 'private':
          return this.private.length
            ? this.private.map(({ id, name }: any) => ({
                value: id.toString(),
                text: name,
              }))
            : []
        case 'ecologyType':
          return this.ecologyType.length
            ? this.ecologyType.map(({ id, name }: any) => ({
                value: id.toString(),
                text: name,
              }))
            : []
        case 'logistic':
          return this.logistic.length
            ? this.logistic.map(({ id, name }: any) => ({
                value: id.toString(),
                text: name,
              }))
            : []
        case 'promise':
          return this.promise.length
            ? this.promise.map(({ id, name }: any) => ({
                value: id.toString(),
                text: name,
              }))
            : []
        case 'model':
          return this.model.length
            ? this.model.map(({ id, name }: any) => ({
                value: id.toString(),
                text: name,
              }))
            : []
        case 'status':
          return this.status.length
            ? this.status.map(({ id, name }: any) => ({
                value: id.toString(),
                text: name,
              }))
            : []
        default:
          return
      }
    },
    handleReset() {
      this.reset(defaultFilters())
    },
    handleSubmit(filters?: CarriersFilters) {
      if (this.$v.filters.$invalid) {
        return null
      }
      this.canSaveFilter = true

      if (filters) {
        this.filters = filters
      }

      this.submit(this.filters)
      this.isModified = false

      this.$nextTick(() => {
        this.canSaveFilter = false
      })
    },
    checkFilterEmpty(filters: CarriersFilters) {
      if (filters.isNew === true || filters.isLabeled === true) {
        return false
      }
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
#carrier-list-filter {
  .carrier-search-animated {
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
  .carrier-search {
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
#filter-carriers-form {
  .carriers-filters-fields {
    .checkbox-color {
      .v-input__slot {
        margin-bottom: 0 !important;
      }
      .v-messages {
        display: none !important;
      }

      i {
        &.mdi-checkbox-marked {
          color: $success-color !important;
        }
      }
    }

    .custom-search-select {
      .v-list-item__content {
        padding: 0;
      }

      hr {
        display: none;
      }
    }

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
    }
  }

  .carriers-filters__actions {
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
