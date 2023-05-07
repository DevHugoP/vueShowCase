<template>
  <filters-panel
    id="retailer-list-filter"
    dataId="retailer-list-filter"
    @deleteFilters="handleSubmit($event)"
    translateKey="page.retailers.filters"
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
      {{ $t('action.filter.retailers') }}
    </template>

    <template #search>
      <mp-textfield
        :class="{
          'has-data': filters.name,
          'retailer-search-animated': $vuetify.breakpoint.mdAndUp,
          'retailer-search': !$vuetify.breakpoint.mdAndUp,
        }"
        :label="$t('action.search.placeholder')"
        v-model="filters.name"
        @press-enter="handleSubmit()"
        dataId="retailer-list-retailersFilters-form-name"
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

    <template #form>
      <v-form id="filter-retailers-form" ref="form" data-id="retailer-list-retailersFilters-form">
        <v-row
          no-gutters
          class="retailers-filters__fields"
          :class="{
            'flex-column': $vuetify.breakpoint.xsOnly,
            'offset-1 col-10 pa-0': !$vuetify.breakpoint.xsOnly,
            'no-data': !filterResultLength,
          }"
        >
          <v-col :cols="$vuetify.breakpoint.xsOnly ? 12 : 6" class="price-wrapper">
            <mp-textfield
              type="number"
              :label="$t('page.retailers.filters.price')"
              v-model="filters.price"
              @press-enter="handleSubmit()"
              dataId="retailer-list-retailersFilters-form-capacity"
              @input="$v.filters.price.$touch()"
              @blur="$v.filters.price.$touch()"
              :errors="getModelErrors($v.filters.price)"
              :isDirty="$v.filters.price.$dirty"
            />
          </v-col>

          <v-col :cols="$vuetify.breakpoint.xsOnly ? 12 : 6" class="environment-wrapper">
            <mp-textfield
              type="number"
              :label="$t('page.retailers.filters.environment')"
              v-model="filters.environment"
              @press-enter="handleSubmit()"
              dataId="retailer-list-retailersFilters-form-capacity"
              @input="$v.filters.environment.$touch()"
              @blur="$v.filters.environment.$touch()"
              :errors="getModelErrors($v.filters.environment)"
              :isDirty="$v.filters.environment.$dirty"
            />
          </v-col>

          <v-col :cols="$vuetify.breakpoint.xsOnly ? 12 : 6" class="quality-wrapper">
            <mp-textfield
              type="number"
              :label="$t('page.retailers.filters.satisfaction')"
              v-model="filters.quality"
              @press-enter="handleSubmit()"
              dataId="retailer-list-retailersFilters-form-capacity"
              @input="$v.filters.quality.$touch()"
              @blur="$v.filters.quality.$touch()"
              :errors="getModelErrors($v.filters.quality)"
              :isDirty="$v.filters.quality.$dirty"
            />
          </v-col>

          <v-col :cols="$vuetify.breakpoint.xsOnly ? 12 : 6" class="countries-wrapper">
            <mp-select
              :label="$t('common.country.base')"
              v-model="filters.countries"
              :items="countryItems"
              multiple
              chips
              smallChips
              clearable
              deletableChips
              hideSelected
              attach="#retailer-filters-country-select"
              dropdownId="retailer-filters-country-select"
              dataId="retailer-list-retailersFilters-form-country"
              @input="$v.filters.countries.$touch()"
              @blur="$v.filters.countries.$touch()"
              :errors="getModelErrors($v.filters.countries)"
              :isDirty="$v.filters.countries.$dirty"
            />
          </v-col>
        </v-row>
      </v-form>
    </template>
  </filters-panel>
</template>

<script lang="ts">
import { COUNTRY } from '@/constants/shared'
import mixins from 'vue-typed-mixins'
import { mapGetters } from 'vuex'

import { filterFormMixin, validationMixin } from '@/mixins'
import { minValue, integer } from 'vuelidate/lib/validators'
import filtersPanel from '@/components/filtersPanel/filtersPanel.vue'
import objectHelper from '@/helpers/objectHelper'

export interface RetailersFilters {
  name: string
  countries: string[]
  price?: number
  environment?: number
  quality?: number
}

const defaultFilters = (): RetailersFilters => ({
  name: '',
  countries: [],
  price: undefined,
  environment: undefined,
  quality: undefined,
})

export default mixins(filterFormMixin, validationMixin).extend({
  name: 'retailers-filters',
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
    filters: defaultFilters() as RetailersFilters,
    filtersContent: { countries: [] as any[] },
    isModified: false,
    savedState: '',
    canSaveFilter: false,
    canReset: false,
  }),
  validations: {
    filters: {
      name: {},
      countries: {},
      price: { integer, minValue: minValue(0) },
      environment: { integer, minValue: minValue(0) },
      quality: { integer, minValue: minValue(0) },
    },
  },
  async mounted() {
    const storeFilters = this.fromQueryToFilters(defaultFilters())

    if (typeof storeFilters?.countries === 'string') {
      storeFilters.countries = [storeFilters.countries]
    }

    this.filters = {
      ...this.filters,
      ...(storeFilters && Object.keys(storeFilters).length && this.filterFilled(storeFilters)),
    }

    setTimeout(() => {
      this.submit(this.filters)
    }, 50)

    this.filtersContent.countries = Object.values(COUNTRY).map(value => ({
      name: this.$t(`common.country.${value}`),
      id: value,
    }))
  },
  computed: {
    ...mapGetters('filters', {
      activeFilters: 'activeFilters',
    }),
    countryItems() {
      return Object.values(COUNTRY).map(value => ({
        text: this.$t(`common.country.${value}`),
        value,
      }))
    },
  },
  methods: {
    handleReset() {
      this.reset(defaultFilters())
    },
    handleSubmit(filters?: RetailersFilters) {
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
    checkFilterEmpty(filters: RetailersFilters) {
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
#retailer-list-filter {
  .retailer-search-animated {
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
  .retailer-search {
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
#filter-retailers-form {
  .retailers-filters__fields {
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

        &:nth-child(odd) {
          padding-left: 0;
        }

        &:nth-child(even) {
          padding-right: 0;
        }
      }
    }
  }

  .retailers-filters__actions {
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
