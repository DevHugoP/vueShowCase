<template>
  <filters-panel
    id="notif-admin-filter"
    dataId="notif-admin-filter"
    @deleteFilters="handleSubmit($event)"
    translateKey="page.notificationAdministration.filters"
    :showBtnPanel="false"
    :canSaveFilter="false"
    :filterSave="''"
    :canReset="false"
  >
    <template #title>
      {{ $t('action.filter.base') }}
    </template>

    <template #search>
      <mp-textfield
        class="notif-admin-search"
        :label="$t('action.search.placeholder')"
        v-model="filters.retailerName"
        @press-enter="handleSubmit()"
        dataId="notif-admin-list-form-name"
        @input="$v.filters.retailerName.$touch()"
        @blur="$v.filters.retailerName.$touch()"
        :errors="getModelErrors($v.filters.retailerName)"
        :isDirty="$v.filters.retailerName.$dirty"
        prepend-inner-icon="mdi-magnify"
      />
    </template>
  </filters-panel>
</template>

<script lang="ts">
import mixins from 'vue-typed-mixins'

import { filterFormMixin, validationMixin } from '@/mixins'

import { minLength } from 'vuelidate/lib/validators'
import filtersPanel from '@/components/filtersPanel/filtersPanel.vue'

export interface NotificationAdminFilters {
  retailerName?: string
}

const defaultFilters = (): NotificationAdminFilters => ({
  retailerName: '',
})

export default mixins(filterFormMixin, validationMixin).extend({
  name: 'notif-admin-filters',
  components: {
    filtersPanel,
  },
  data: () => ({
    filters: defaultFilters() as NotificationAdminFilters,
  }),
  validations: {
    filters: {
      retailerName: { minLength: minLength(3) },
    },
  },
  mounted() {
    const storeFilters = this.fromQueryToFilters(defaultFilters())

    this.filters = {
      ...this.filters,
      ...(storeFilters && Object.keys(storeFilters).length && this.filterFilled(storeFilters)),
    }

    setTimeout(() => {
      this.submit(this.filters)
    }, 50)
  },
  methods: {
    handleReset() {
      this.reset(defaultFilters())
    },
    handleSubmit(filters?: NotificationAdminFilters) {
      if (this.$v.filters.$invalid) {
        return null
      }

      if (filters) {
        this.filters = filters
      }

      this.submit(this.filters)
    },
  },
})
</script>

<style lang="scss">
#notif-admin-filter {
  .notif-admin-search {
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
  .carriers-filters__fields {
    @media #{map-get($display-breakpoints, 'xs-only')} {
      padding: 0 2.4rem;
      overflow: scroll;
      max-height: calc(100vh - 16.8rem);
      min-height: calc(100vh - 16.8rem);
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
        // padding: 0 1.9rem;

        // &:nth-child(odd) {
        //   padding-left: 0;
        // }

        // &:nth-child(even) {
        //   padding-right: 0;
        // }
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
