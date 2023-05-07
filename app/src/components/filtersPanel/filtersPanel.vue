<template>
  <v-row class="filters-panel" no-gutters justify="center" v-click-outside="onClickOutside">
    <div id="black-overlay" v-if="panelDisplay !== undefined" class="overlay"></div>
    <v-col cols="12">
      <v-row no-gutters :class="`filters__search${$vuetify.breakpoint.xsOnly ? ' pt-5' : ' pa-0'}`">
        <v-col cols="10" offset="1" class="d-flex header-wrapper">
          <div v-if="$slots.search">
            <slot name="search" />
          </div>
          <div id="searchBar" v-else-if="$slots.searchBar">
            <slot name="searchBar" />
          </div>

          <mp-button
            format="link"
            linkColor="black"
            :class="`filter_btn ${$slots.searchBar || $slots.search ? 'ml-6' : 'ml-0 pl-0'}`"
            @click="togglePanel()"
            :data-id="`${dataId}-showFilterPanel`"
            :text="
              panelDisplay === 0
                ? $t('action.close.base')
                : $vuetify.breakpoint.xsOnly
                  ? ''
                  : activeFilters > 0
                    ? `${$t('action.filter.base')} (${activeFilters})`
                    : $t('action.filter.base')
            "
            :icon="panelDisplay === 0 ? 'close' : 'tune'"
            v-if="showBtnPanel"
            :disabled="disableFilterBtn"
          />

          <mp-badge
            v-if="activeFilters && $vuetify.breakpoint.xsOnly"
            :content="activeFilters"
            class="badge-alert mr-auto"
            color="red"
            dataId="menu-profile-alertModal-badge"
          />

          <div v-if="$slots.actions && panelDisplay === undefined" class="ml-auto">
            <slot name="actions" />
          </div>
        </v-col>
      </v-row>

      <v-expansion-panels
        class="expansion-panels-filters"
        id="filters"
        v-model="panelDisplay"
        flat
        :data-id="`${dataId}-filters`"
      >
        <v-expansion-panel>
          <v-expansion-panel-content eager>
            <slot name="form" />

            <v-row no-gutters>
              <v-col
                :cols="$vuetify.breakpoint.xsOnly ? 12 : 10"
                :offset="$vuetify.breakpoint.xsOnly ? 0 : 1"
                class="d-flex justify-end mb-6 filter-action-btn"
              >
                <mp-button
                  :text="$t('action.erase.all')"
                  :format="$vuetify.breakpoint.xsOnly ? 'sticky' : 'link'"
                  linkColor="black"
                  stickyColor="yellow"
                  :dataId="`${dataId}-reset`"
                  :disabled="canReset"
                  @click="$emit('reset')"
                />

                <mp-button
                  :text="$t('action.apply')"
                  :format="$vuetify.breakpoint.xsOnly ? 'sticky' : 'success'"
                  stickyColor="yellow"
                  :dataId="`${dataId}-apply`"
                  @click="$emit('submit')"
                />
              </v-col>
            </v-row>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>

      <v-row no-gutters class="quick-filter" v-if="Object.values(filterFilled(filters)).length">
        <v-col
          cols="12"
          sm="10"
          offset-sm="1"
          offset="0"
          :class="$vuetify.breakpoint.xsOnly ? 'd-block' : 'd-flex'"
        >
          <div class="erase-all-wrapper">
            <v-chip class="erase-all" @click="$emit('deleteFilters', {})">
              {{
                $vuetify.breakpoint.smAndUp ? $t('action.erase.all') : $t('action.erase.allMobile')
              }}
            </v-chip>
            <v-spacer v-if="$vuetify.breakpoint.xsOnly" />
            <div v-if="$vuetify.breakpoint.xsOnly">
              <div v-if="filterResultLength !== undefined">
                <p class="pt-2 main-lighten-28 mr-10">
                  {{ filterResultLength }} {{ $t('common.result', { count: filterResultLength }) }}
                </p>
              </div>
            </div>
          </div>
          <div v-if="$vuetify.breakpoint.smAndUp" class="filter-preview-wrapper">
            <div
              v-for="(filter, index) of Object.entries(filterFilled(filters)).filter(
                fls => $t(`${translateKey}.${fls[0]}`) !== `${translateKey}.${fls[0]}`,
              )"
              :key="`filter-${index}`"
              class="filter-preview"
            >
              <span class="main-lighten-28 mr-1 mt-1">
                {{ $t(`${translateKey}.${filter[0]}`).toUpperCase() }}
              </span>

              <mp-chips-wrapper
                class="chips-wrapper"
                :dataId="`${dataId}-chipsWrapper`"
                :chips="getLabelOfFilter(filter[0], filter[1])"
                isRemovable
                @deleteChip="deleteFilter(filter[0], $event)"
                :maxChips="$vuetify.breakpoint.mdAndDown ? 1 : 3"
              />
            </div>
          </div>
        </v-col>
        <div v-if="filterResultLength !== undefined && !$vuetify.breakpoint.xsOnly">
          <p class="mt-6 main-lighten-28 margin-result">
            {{ filterResultLength }} {{ $t('common.result', { count: filterResultLength }) }}
          </p>
        </div>
      </v-row>
    </v-col>
  </v-row>
</template>

<script lang="ts">
/* eslint vue/require-default-prop: off */
import Vue from 'vue'
import { mapGetters } from 'vuex'

import { SET_IS_PANEL_DISPLAYED } from '@/store/modules/filters/mutations-types'
import { dateHelperFormatToTimezone } from '@/helpers/dateHelper'

const DATE_INTERVAL_KEY = ['createdAt', 'pickDate', 'deliveryDate']

export default Vue.extend({
  name: 'filters-panel',
  props: {
    disableFilterBtn: {
      type: Boolean,
      required: false,
      default: false,
    },
    dataId: {
      type: String,
      required: true,
    },
    translateKey: {
      type: String,
      default: '',
    },
    filtersContent: {
      type: Object,
      default: () => {
        return {}
      },
    },
    showBtnPanel: {
      type: Boolean,
      default: true,
    },
    filterResultLength: {
      type: Number,
    },
    filterSave: {
      type: String,
      required: true,
    },
    canSaveFilter: {
      type: Boolean,
      default: false,
    },
    canReset: {
      type: Boolean,
      required: true,
    },
  },
  data: () => ({
    localFilterSave: '',
  }),
  computed: {
    ...mapGetters('filters', {
      activeFilters: 'activeFilters',
      getIsPanelDisplayed: 'isPanelDisplayed',
      filters: 'filters',
    }),
    panelDisplay: {
      get(): any {
        return this.getIsPanelDisplayed
      },
      set(value): void {
        this.$store.commit(`filters/${SET_IS_PANEL_DISPLAYED}`, value)
      },
    },
  },
  methods: {
    togglePanel() {
      this.panelDisplay = this.panelDisplay === undefined ? 0 : undefined

      if (this.panelDisplay === undefined) {
        this.$emit('resetFilterState', this.localFilterSave)
      }
    },
    onClickOutside() {
      if (this.panelDisplay === 0) {
        this.togglePanel()
      }
    },
    getLabelOfFilter(filterKey: string, value: string | string[]) {
      if (DATE_INTERVAL_KEY.includes(filterKey)) {
        if (typeof value === 'string') {
          value = JSON.parse(value)
        }

        return [
          {
            text: `${dateHelperFormatToTimezone(
              (value as any).start,
              'P',
            )} - ${dateHelperFormatToTimezone((value as any).end, 'P')}`,
            value,
          },
        ]
      }

      if (this.filtersContent?.[filterKey]) {
        return this.filtersContent[filterKey]
          .filter((filter: { id: string; externalId: string }) =>
            isNaN(Number(filter.id)) || isNaN(Number(value))
              ? value.includes(filter.id) || value.includes(filter.externalId)
              : Number(filter.id) === Number(value),
          )
          .map((val: { name: any; id: any; index?: any; subEvent?: any }) => ({
            subEvent: val.subEvent || null,
            index: val.index || null,
            text: val.name,
            value: val.id,
          }))
      }

      if (typeof value === 'boolean') {
        return [
          {
            text: this.$t(`${this.translateKey}.${filterKey}`),
            value,
          },
        ]
      }

      return [value]
    },
    deleteFilter(filterKey: string, event: any) {
      const filtersCopy = JSON.parse(JSON.stringify(this.filters))

      if (Array.isArray(filtersCopy[filterKey])) {
        filtersCopy[filterKey] = filtersCopy[filterKey].filter(
          (filterValue: any) => filterValue !== event.value,
        )
      } else {
        delete filtersCopy[filterKey]
      }

      if (!filtersCopy.retailerId) {
        delete filtersCopy.storeId
        delete filtersCopy.exchangePlaceId
      } else if (!filtersCopy.storeId) {
        delete filtersCopy.exchangePlaceId
      }

      if (!filtersCopy.retailerIds?.length && !filtersCopy.retailerId) {
        filtersCopy.storeIds = []
      }

      this.$emit('deleteFilters', filtersCopy)
    },
    filterFilled(fields: any) {
      return Object.entries(fields)
        .filter(([_key, value]) => {
          return (
            ((typeof value === 'string' || typeof value === 'number') && value) ||
            typeof value === 'boolean' ||
            (Array.isArray(value) && value.length) ||
            (typeof value === 'object' && value !== null && Object.values(value).length)
          )
        })
        .reduce((obj, [key]) => {
          obj[key] = fields[key]

          return obj
        }, {} as Record<string, any>)
    },
  },
  watch: {
    panelDisplay: {
      immediate: true,
      handler(next) {
        if (next === undefined && !this.canSaveFilter) {
          this.$emit('resetFilterState', this.localFilterSave)
          this.localFilterSave = ''
        } else {
          this.localFilterSave = this.filterSave
        }
      },
    },
  },
  destroyed() {
    this.$store.commit(`filters/${SET_IS_PANEL_DISPLAYED}`, undefined)
  },
})
</script>

<style lang="scss">
.overlay {
  position: absolute;
  display: block;
  top: 38rem;
  left: 0%;
  background: rgb(0, 0, 0, 0.1);
  z-index: 2;
  width: 100%;
  height: 90%;
  pointer-events: none;
}
.filters-panel {
  #filters {
    .filter-action-btn {
      @media #{map-get($display-breakpoints, 'xs-only')} {
        width: 100%;
        margin-bottom: 0 !important;
        margin-top: 1rem;

        button {
          width: 50%;
        }
      }
    }

    @media #{map-get($display-breakpoints, 'xs-only')} {
      z-index: 4; // Fix expansion-panel being behind switch component
    }

    .v-expansion-panel {
      box-shadow: 0 0.4rem 0.8rem -0.4rem rgba(0, 0, 0, 0.18);

      .v-expansion-panel-header {
        padding: 0;
        @include medium-14();

        min-height: 5.4rem;
        max-height: 5.4rem;

        &--active {
          background-color: $white;
          z-index: 2;
        }
      }

      .v-expansion-panel-content {
        box-shadow: 0 0.4rem 0.8rem -0.4rem rgba(0, 0, 0, 0.18);
        width: 100%;
        position: absolute;
        background-color: $white;

        &__wrap {
          padding: 0;
        }
      }
    }
  }

  .header-wrapper {
    @media #{map-get($display-breakpoints, 'xs-only')} {
      justify-content: space-between !important;
    }
  }

  .header-wrapper {
    > .mp-textfield {
      @media #{map-get($display-breakpoints, 'sm-and-up')} {
        max-width: 17rem;
      }
    }
  }

  .filters__search {
    display: flex;

    .filter_btn {
      @media #{map-get($display-breakpoints, 'xs-only')} {
        padding: 1.4rem !important;
      }
    }

    .filter_btn span i {
      font-size: 2.2rem !important;
    }
    .filter_btn:hover {
      background-color: $main-lighten-80-color;
    }
    .filter_btn_clicked {
      background-color: $main-lighten-80-color;
    }
  }

  .margin-result {
    margin-left: -8.5rem;
  }

  .expansion-panels-filters {
    z-index: 4;
  }

  .quick-filter {
    padding-top: 2rem;

    @media #{map-get($display-breakpoints, 'sm-and-up')} {
      padding-bottom: 2rem;
    }

    background-color: $main-lighten-80-color;
    display: flex;

    .erase-all-wrapper {
      display: flex;
      align-items: flex-start;
      @media #{map-get($display-breakpoints, 'sm-and-up')} {
        margin-top: 1.2rem;
      }
      @media #{map-get($display-breakpoints, 'xs-only')} {
        padding-left: 3rem;
        margin-bottom: 1rem;
      }

      .erase-all {
        background-color: $main-color;
        color: $white;
        height: 3rem;
      }
    }

    .filter-preview-wrapper {
      margin-left: 2rem;
      padding-right: 10rem;

      @media #{map-get($display-breakpoints, 'xs-only')} {
        max-width: calc(100vw - 2rem);
      }

      .filter-preview {
        display: inline-block;
        @media #{map-get($display-breakpoints, 'xs-only')} {
          max-width: calc(100vw - 2rem);
          display: flex;
        }
        align-items: center;
        margin-right: 1rem;

        .chips-wrapper {
          display: inline-block !important;
          overflow: inherit !important;
          margin-top: 1rem;
          .v-chip {
            margin-bottom: 0.5rem !important;
          }
        }
      }
    }
  }
}

#alert-number-filter {
  .badge-alert {
    margin-left: -2.5rem;
    margin-top: -2.5rem;
  }
}
</style>
