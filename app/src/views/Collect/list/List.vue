<template>
  <div id="drive">
    <content-header
      id="drives-header"
      className="d-flex flex-column"
      dataId="drive-list"
      v-if="$vuetify.breakpoint.smAndUp"
    >
      <template #breadcrumb>
        <mp-breadcrumb />
      </template>

      <template #title>
        <h1 data-id="drive-list-title">{{ $t('page.collects.title') }}</h1>
      </template>
    </content-header>

    <filter-collects
      :filterResultLength="collects.length"
      @submit="submit($event)"
      @reset="submit()"
      :retailers="retailers"
    >
      <template #actions>
        <div class="collects-icons-wrapper" v-if="$vuetify.breakpoint.smAndUp">
          <v-icon
            v-if="$vuetify.breakpoint.mdAndUp"
            :class="`${displayType === DisplayTypeEnum.LIST ? 'selected' : ''} pa-2`"
            @click="displayType = DisplayTypeEnum.LIST"
          >
            mdi-format-list-bulleted
          </v-icon>
          <v-icon
            v-if="$vuetify.breakpoint.mdAndUp"
            :class="`ml-5${displayType === DisplayTypeEnum.CARD ? ' selected' : ''} pa-2`"
            @click="displayType = DisplayTypeEnum.CARD"
          >
            mdi-view-grid
          </v-icon>
        </div>
      </template>
    </filter-collects>

    <div id="content-cards">
      <v-row no-gutters v-if="hasLoaded && collects.length">
        <v-col cols="12">
          <v-row no-gutters id="content-collect-list">
            <v-col
              :cols="$vuetify.breakpoint.xsOnly ? '12' : '10'"
              offset-sm="1"
              class="card-wrapper"
              v-if="displayType === DisplayTypeEnum.CARD"
            >
              <div v-for="(collect, index) in collects" :key="`collects-${index}`">
                <router-link :to="getCollectRoute(collect.id)">
                  <collect-card :collect="collect" />
                </router-link>
              </div>
            </v-col>

            <v-col cols="10" offset="1" class="mb-5 pt-2" v-else-if="collects.length">
              <mp-data-table
                id="collect-list-data-table"
                :items="collects"
                :headers="headers"
                :itemsPerPage="-1"
                :pageLabel="$t('common.page')"
                @update:options="onOptionsUpdated"
                :to="{ name: ROUTES.detailCollect, paramKey: 'id', objectKey: 'id', toExclude: [] }"
              >
                <template v-slot:externalCollectId="{ externalCollectId }">
                  <span class="regular14 main-lighten-28 table-span collect-id">
                    {{ externalCollectId }}
                  </span>
                </template>

                <template v-slot:retailerId="{ retailerId }">
                  <span class="regular14 main-lighten-28 table-span">
                    {{ getRetailerName(retailerId) }}
                  </span>
                </template>

                <template v-slot:createdAt="{ createdAt }">
                  <span class="regular14 main-lighten-28 table-span">
                    {{ getDate(createdAt, 'P p') }}
                  </span>
                </template>

                <template v-slot:start="{ start }">
                  <span class="regular14 main-lighten-28 table-span">
                    {{ getDate(start, 'P p') }}
                  </span>
                </template>

                <template v-slot:status="{ item, status }">
                  <mp-badge
                    :color="getColor(item)"
                    :dataId="`collect-list-data-table-${item.id}-badge`"
                    :content="$t(`technical.status.collect.${status}`)"
                  />
                </template>
              </mp-data-table>
            </v-col>
          </v-row>
        </v-col>

        <v-row no-gutters class="see-more-content mt-5" v-if="showSeeMoreBtn">
          <v-col cols="12" class="see-more-btn-wrapper">
            <div class="d-flex align-center justify-center mb-5">
              <mp-button
                dataId="collect-list-see-more"
                class="see-more-btn"
                :text="$t('action.show.more')"
                @click="loadMore()"
                format="primary"
              />
            </div>
          </v-col>
        </v-row>
      </v-row>
      <v-row no-gutters v-else-if="!collects.length && hasLoaded" class="no-data-container">
        <no-data dataId="collect-noData" :blocMode="false" />
      </v-row>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import contentHeader from '@/components/contentHeader/contentHeader.vue'
import mpBreadcrumb from '@/components/breadcrumb/breadcrumb.vue'
import filterCollects from '@/views/Collect/list/filters/filters.vue'
import collectCard from '@/views/Collect/list/collectCard/collectCard.vue'
import noData from '@/components/noData/noData.vue'

import CollectService from '@/services/collect/CollectService'
import RetailerService from '@/services/retailer/RetailerService'
import { PAGINATION_LIMIT, ROUTES } from '@/constants'

import { dateHelper, dateHelperGetTimezonedDate } from '@/helpers/dateHelper'
import { SnackBarType } from '@/store/types'
import { SET_SHOW_LOADER } from '@/store/mutation-types'
import { mapMutations } from 'vuex'
import { DisplayTypeEnum } from '@/views/Order/List/Orders.vue'
import { Collect, COLLECT_STATUS, DataTableHeader, Filters, RulesKey } from '@/types'
import { CardColor } from '@/views/Order/List/orderCard/orderCard.vue'

const RULE_LIST_COLLECT: RulesKey = 'LIST_COLLECTS'

export type CollectFilter = {
  collectId?: string
  retailerId?: number | number[]
  exchangePlaceId?: string | string[]
  status?: COLLECT_STATUS[]
  start?: string
  end?: string
  createdAtStart?: string
  createdAtEnd?: string
  offset?: number
  limit?: number
  sort?: string
  sortBy?: string
}

export default Vue.extend({
  name: 'collect-list',
  components: {
    contentHeader,
    mpBreadcrumb,
    filterCollects,
    collectCard,
    noData,
  },
  data: () => ({
    collects: [] as Collect[],
    retailers: [] as Filters[],
    displayType: DisplayTypeEnum.CARD,
    DisplayTypeEnum,
    headers: [] as DataTableHeader[],
    ROUTES,
    hasLoaded: false,
    pagination: {
      offset: 0,
      limit: PAGINATION_LIMIT,
    },
    order: {
      sortBy: 'createdAt',
      sort: 'DESC',
    },
    filters: {} as CollectFilter,
    loadingMore: false,
    numberOfCollectInLastPagination: 0,
    defaultCardsHeight: 0,
  }),
  computed: {
    showSeeMoreBtn(): boolean {
      return this.numberOfCollectInLastPagination === this.pagination.limit
    },
  },
  beforeMount() {
    this.headers = [
      {
        text: this.$t('common.id'),
        value: 'externalCollectId',
        sortable: true,
      },
      {
        text: this.$t('common.retailer'),
        value: 'retailerId',
        sortable: false,
        width: '15%',
      },
      {
        text: this.$t('page.orders.table.created'),
        value: 'createdAt',
        sortable: true,
        width: '20%',
      },
      {
        text: this.$t('page.collects.filters.pickupDate'),
        value: 'start',
        sortable: true,
        width: '20%',
      },
      { text: this.$t('common.status'), value: 'status', sortable: true, width: '20%' },
    ]
  },
  mounted() {
    this.setShowLoader(true)
    const { hash } = location

    if (hash) {
      const displayType = hash.substring(1)

      if (this.$vuetify.breakpoint.xsOnly) {
        this.displayType = DisplayTypeEnum.CARD
      } else {
        this.displayType = displayType as DisplayTypeEnum
      }
    }

    this.getRetailers()
    window.location.hash = this.displayType
  },
  updated() {
    if (this.$vuetify.breakpoint.xsOnly) {
      if (!this.defaultCardsHeight) {
        this.defaultCardsHeight = document.getElementById('content-cards')!.clientHeight
      }
      this.resizeContentCards()
    }
  },
  methods: {
    ...mapMutations({
      setShowLoader: SET_SHOW_LOADER,
    }),
    async getRetailers() {
      this.retailers = await RetailerService.getFilters({ forRule: RULE_LIST_COLLECT })
    },
    getRetailerName(retailerId: number) {
      return this.retailers.find(retailer => retailerId === retailer.id)?.name
    },
    getCollectRoute(id: string) {
      return {
        name: ROUTES.detailCollect,
        params: {
          id,
        },
      }
    },
    getColor(item: Collect) {
      switch (item.status) {
        case COLLECT_STATUS.PICK_UP_FAILED:
        case COLLECT_STATUS.PICK_UP_PARTIALLY:
        case COLLECT_STATUS.BLOCKED:
        case COLLECT_STATUS.DELAYED:
          return CardColor.ORANGE
        case COLLECT_STATUS.INIT:
        case COLLECT_STATUS.STOCK_OK:
        case COLLECT_STATUS.READY:
        case COLLECT_STATUS.STARTED:
        case COLLECT_STATUS.AWAITING:
        case COLLECT_STATUS.IN_PROGRESS:
        case COLLECT_STATUS.REPLANNED:
          return CardColor.MAIN
        case COLLECT_STATUS.CANCELLED:
          return CardColor.GREY
        case COLLECT_STATUS.PICK_UP_OK:
          return CardColor.GREEN
      }
    },
    async submit(filter?: any) {
      try {
        if (filter) {
          this.filters = {
            ...filter,
            ...this.pagination,
            ...this.order,
            collectId: filter.id,
            start: filter.pickDate?.start,
            end: filter.pickDate?.end,
            createdAtStart: filter.createdAt?.start,
            createdAtEnd: filter.createdAt?.end,
          }

          this.collects = await CollectService.getAll(this.filters)
        } else {
          this.filters = {}
          this.collects = await CollectService.getAll(this.pagination)
        }
      } catch (e) {
        this.$store.dispatch('setSnackbar', {
          type: SnackBarType.ERROR,
          message: this.$t('messages.error'),
        })
      } finally {
        this.numberOfCollectInLastPagination = this.collects.length
        this.setShowLoader(false)

        if (!this.hasLoaded) {
          this.hasLoaded = true
        }
      }
    },
    async loadMore() {
      const { offset, limit } = this.pagination

      if (!this.hasLoaded || this.numberOfCollectInLastPagination < PAGINATION_LIMIT || this.loadingMore) {
        return
      }

      this.setShowLoader(true)
      this.loadingMore = true

      this.pagination.offset = offset + limit

      const params = {
        ...this.filters,
        ...this.pagination,
      }

      const collects = await CollectService.getAll(params)
      this.numberOfCollectInLastPagination = collects.length
      this.collects = [...this.collects, ...collects]

      this.loadingMore = false
      this.setShowLoader(false)
    },
    onOptionsUpdated(options: Record<string, any>) {
      const {
        sortBy: [sortBy],
        sortDesc: [sortDesc],
      } = options

      this.order.sortBy = sortBy ?? 'createdAt'
      this.order.sort = sortDesc === undefined ? 'DESC' : sortDesc ? 'DESC' : 'ASC'

      this.submit(this.filters)
    },
    resizeContentCards() {
      const header = document.getElementsByTagName('header')
      const collectFilter = document.getElementById('collect-list-filter')
      const contentCards = document.getElementById('content-cards')

      if (contentCards) {
        contentCards.style.height = `${this.defaultCardsHeight}px`
        if (header && collectFilter) {
          const newHeight =
            contentCards.offsetHeight - collectFilter.clientHeight + header[0].clientHeight
          contentCards.style.height = `${newHeight}px`
        }
      }
    },
    getDate(date: string, format: string) {
      return dateHelper.formatToTimezone(dateHelperGetTimezonedDate(date), 'UTC', format)
    },
  },
  watch: {
    displayType(next) {
      window.location.hash = next
    },
    collects(next) {
      this.collects = next
    }
  },
})
</script>

<style lang="scss">
#drive {
  .card-wrapper {
    display: grid;
    grid-template-columns: repeat(auto-fill, 17rem);
    justify-content: flex-start;
    grid-gap: 3rem;
    grid-row-gap: 4rem;

    @media #{map-get($display-breakpoints, 'xs-only')} {
      grid-template-columns: repeat(auto-fill, 14rem);
      grid-gap: 1rem;
      grid-row-gap: 3rem;
      margin-top: 5rem;
      justify-content: center;
    }

    margin-bottom: 5rem;

    a {
      text-decoration: none;
    }
  }

  .collects-icons-wrapper {
    display: flex;
    align-items: center;

    .selected {
      border: 0.1rem $main-color solid;
      border-radius: 0.4rem;
    }

    button {
      cursor: pointer;
      color: $main-color;

      border: 0.1rem transparent solid;
      border-radius: 0.4rem;

      &:hover:not(:focus, .selected) {
        border: 0.1rem $main-lighten-65-color solid;
      }

      &:focus {
        &::after {
          opacity: 0 !important;
        }
      }
    }
  }

  #collect-list-data-table {
    a {
      text-decoration: none;
    }

    .collect-id {
      word-break: break-all;
    }
  }

  @media #{map-get($display-breakpoints, 'xs-only')} {
    #content-cards {
      height: calc(100vh - 10.8rem);
      overflow: scroll;
    }
  }

  .no-data-container {
    height: 100%;
  }
}
</style>
