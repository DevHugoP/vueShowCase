<template>
  <div id="retailers" data-id="retailer-list">
    <template v-if="$vuetify.breakpoint.xsOnly">
      <v-row no-gutters justify="center" v-if="canAccessFilters">
        <retailers-filters
          @submit="getRetailerData(defaultFilters)"
          @reset="getRetailerData()"
          :filterResultLength="retailers && retailers.length ? retailers.length : 0"
        />
      </v-row>

      <div id="retailer-scroll" class="scroll">
        <header id="retailers__list-wrapper">
          <ul id="retailers__list" class="d-flex flex-row">
            <li class="retailers__list-item" v-if="isAuthorized('CREATE_RETAILERS')">
              <mp-button
                dataId="retailers-addRetailer"
                class="retailers__add-button d-flex justify-center align-center text-center"
                icon="plus"
                :to="{ name: ROUTES.addRetailer }"
              />
            </li>

            <li
              class="retailers__list-item"
              v-for="retailer in retailers"
              :key="`retailers__${retailer.id}`"
            >
              <div
                :class="
                  `retailers__logo-wrapper${
                    retailer.id === retailerSelected.id ? ' retailers__logo-wrapper--selected' : ''
                  }`
                "
                @click.prevent="retailerSelected = retailer"
                data-id="retailer-list-select"
              >
                <v-img
                  contain
                  width="90%"
                  height="5rem"
                  class="retailers__logo"
                  :src="retailer.logo"
                  :alt="retailer.name"
                  data-id="retailer-list-logo"
                />
              </div>
            </li>
          </ul>
        </header>

        <v-row no-gutters v-if="retailers && !retailers.length">
          <no-data dataId="retailer-list-noData" :blocMode="false" class="no-data-item" />
        </v-row>
        <section id="retailers__info" v-if="retailerSelected">
          <h2 class="retailers__name h2-28-bold" data-id="retailers-retailerSelectedName">
            {{ retailerSelected.name }}
          </h2>

          <div class="retailers__weighting">
            <div
              class="retailers-line"
              :key="`weighting__${retailerSelected.id}__${key}`"
              v-for="(value, key) in retailerSelected.weightingIndexes"
            >
              <v-icon>{{ weightingIcon[key] }}</v-icon>

              <dl>
                <dt class="retailers-line__term regular16">
                  {{ $t([`common.${key}`, `common.weighting.${key}`]) }}
                </dt>
                <dd class="retailers-line__value">{{ getWeightingValue(value) }}</dd>
              </dl>
            </div>
          </div>
          <div class="retailers-line">
            <v-icon>mdi-truck</v-icon>
            <dl>
              <dt class="retailers-line__term regular16">
                {{ $t('page.retailers.carrier.activeCarrier') }}
              </dt>
              <dd
                class="retailers-line__value"
                data-id="retailers-retailerSelectedName-countActive"
              >
                {{ retailerSelected.carriercount }}
              </dd>
            </dl>
          </div>
          <div class="retailers-line">
            <v-icon>mdi-storefront-outline</v-icon>
            <dl>
              <dt class="retailers-line__term regular16">
                {{ $t('page.retailers.store.numberOfEligibleStore') }}
              </dt>
              <dd
                class="retailers-line__value"
                data-id="retailers-retailerSelectedName-countActive"
              >
                {{ retailerSelected.count.active }}
                <sub class="regular16">/{{ retailerSelected.count.all }}</sub>
              </dd>
            </dl>
          </div>
        </section>
      </div>

      <v-row no-gutters v-if="retailerSelected && isAuthorized('READ_RETAILERS')" class="mt-auto">
        <v-col cols="12" class="action-mobile-wrapper">
          <mp-button
            id="more-infos-mobile-btn"
            class="action-mobile"
            format="sticky"
            stickyColor="yellow"
            dataId="retailer-list-moreInfo"
            :text="$t('common.moreInformation')"
            :to="handleMoreInfo(retailerSelected)"
          />
        </v-col>
      </v-row>
    </template>

    <template v-else>
      <content-header id="retailers__header" className="d-flex flex-column" dataId="retailer-list">
        <template #breadcrumb>
          <mp-breadcrumb />
        </template>
        <template #title>
          <h1>{{ $t('page.retailers.title') }}</h1>
        </template>
        <template #actions-button v-if="isAuthorized('CREATE_RETAILERS')">
          <mp-button
            format="primary"
            icon="plus"
            :text="$t('action.add.retailer')"
            :to="{ name: ROUTES.addRetailer }"
            dataId="retailer-list-addRetailer"
          />
        </template>
      </content-header>

      <retailers-filters
        id="retailer-list-filter"
        v-if="canAccessFilters"
        @submit="getRetailerData(defaultFilters)"
        @reset="getRetailerData()"
        :filterResultLength="retailers && retailers.length ? retailers.length : 0"
      />

      <v-row no-gutters v-if="retailers && retailers.length">
        <v-col cols="10" offset="1" class="mb-5 pt-2">
          <mp-data-table
            :items="retailers"
            :headers="headers"
            :totalItems="count"
            :pageLabel="$t('common.page')"
            :footer-props="{ itemsPerPageOptions: [10, 25, 100] }"
            @update:options="onOptionsUpdated"
            :to="
              isAuthorized('READ_RETAILERS')
                ? { name: ROUTES.detailRetailer, paramKey: 'id', objectKey: 'id', toExclude: [] }
                : {}
            "
          >
            <template v-slot:name="{ name, item }">
              <v-img
                class="mx-auto mb-2"
                contain
                max-width="17.6rem"
                max-height="6rem"
                :src="item.logo"
                :alt="item.name"
                :data-id="`retailer-list-${item.id}-logo`"
              />
              <div class="d-flex justify-center">
                <span class="regular12 main-lighten-52-color">{{ name }}</span>
              </div>
            </template>

            <template v-slot:price="{ item }">
              <span class="regular16">{{ item.weightingIndexes.price }}</span>
            </template>

            <template v-slot:environment="{ item }">
              <span class="regular16">{{ item.weightingIndexes.environment }}</span>
            </template>

            <template v-slot:satisfaction="{ item }">
              <span class="regular16">{{ item.weightingIndexes.quality.value }}</span>
            </template>

            <template v-slot:carriercount="{ item }">
              <span class="regular16">{{ item.carriercount || 0 }}</span>
            </template>

            <template v-slot:count="{ count }">
              <div class="d-flex align-baseline">
                <span class="regular16">{{ count.active }} / {{ count.all }}</span>
              </div>
            </template>
          </mp-data-table>
        </v-col>
      </v-row>
      <v-row no-gutters v-if="retailers && !retailers.length">
        <no-data dataId="retailer-list-noData" :blocMode="false" style="height: 100%" />
      </v-row>
    </template>
  </div>
</template>

<script lang="ts">
import { authorizationMixin } from '@/mixins'
import { ROUTES } from '@/constants'

import contentHeader from '@/components/contentHeader/contentHeader.vue'
import mpBreadcrumb from '@/components/breadcrumb/breadcrumb.vue'
import noData from '@/components/noData/noData.vue'
import mixins from 'vue-typed-mixins'
import retailersFilters from './retailersFilters/retailersFilters.vue'

import RetailerService from '@/services/retailer/RetailerService'
import AuthorizationService from '@/services/authorization/AuthorizationService'

import { DataTableHeader, RetailerEntity, RulesKey, WeightingIndexes } from '@/types'
import { mapGetters } from 'vuex'

export default mixins(authorizationMixin).extend({
  name: 'retailerList',
  components: {
    contentHeader,
    mpBreadcrumb,
    noData,
    retailersFilters,
  },
  data: () => ({
    ROUTES,
    retailers: null as RetailerEntity[] | null,
    retailerSelected: null as RetailerEntity | null,
    weightingIcon: {
      price: 'mdi-currency-usd',
      environment: 'mdi-leaf',
      quality: 'mdi-diamond-stone',
    },
    headers: [] as DataTableHeader[],
    count: 0,
    pagination: {
      offset: 0,
      limit: 10 as number | null,
    },
    order: {
      sortBy: 'name',
      sort: 'ASC',
    },
    defaultFilters: {
      offset: 0,
    },
  }),
  updated() {
    const scrollSection = document.getElementById('retailer-scroll')
    const header = document.getElementsByTagName('header')
    const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
    const retailerFilters = document.getElementById('retailer-list-filter')
    const button = document.getElementById('more-infos-mobile-btn')

    if (scrollSection && header && retailerFilters && button) {
      const newHeight = vh - header[0].clientHeight - retailerFilters.clientHeight - button.clientHeight
      scrollSection.style.height = `${newHeight}px`
    }
  },
  async mounted() {
    if (!this.canAccessFilters) {
      await this.getRetailerData()
    }

    const headers = [
      {
        text: this.$t('common.retailer'),
        align: 'left',
        sortable: true,
        value: 'name',
        width: '20%',
      },
    ]

    if (this.$vuetify.breakpoint.smAndDown) {
      this.headers = headers
    } else {
      this.headers = [
        ...headers,
        {
          text: this.$t('common.weightingIndexes.price'),
          value: 'price',
          sortable: true,
          width: '7%',
        },
        {
          text: this.$t('common.weightingIndexes.environment'),
          value: 'environment',
          sortable: true,
          width: '15%',
        },
        {
          text: this.$t('common.weightingIndexes.satisfaction'),
          value: 'satisfaction',
          sortable: true,
          width: '10%',
        },
        {
          text: this.$t('page.retailers.carrier.activeCarrier'),
          value: 'carriercount',
          sortable: true,
          width: '15%',
        },
        {
          text: this.$t('page.retailers.store.eligibleStore'),
          value: 'count',
          sortable: true,
          width: '15%',
        },
      ]
    }
  },
  computed: {
    ...mapGetters({
      currentUser: 'auth/currentUser',
    }),
    canAccessFilters(): boolean {
      const { retailerIds } = AuthorizationService.getContext(this.currentUser.permissions)

      return !retailerIds.length || retailerIds.length > 1
    },
  },
  methods: {
    handleMoreInfo(retailerSelected: RetailerEntity) {
      if (!retailerSelected || !retailerSelected.id) {
        return
      }

      const { id: retailerId } = retailerSelected

      if (
        AuthorizationService.isAllowed('READ_RETAILERS' as RulesKey, this.currentUser.permissions, {
          retailerId,
        })
      ) {
        return { name: ROUTES.detailRetailer, params: { id: retailerId.toString() } }
      }
    },
    async getRetailerData(params: Record<string, any> = {}) {
      const filters = this.$store.getters['filters/filters']
      const defaultParams = { count: true }
      if (this.$vuetify.breakpoint.xsOnly) {
        this.pagination = { limit: null, offset: 0 }
      }
      const { retailers, count } = await RetailerService.getAll({
        ...defaultParams,
        ...filters,
        ...this.pagination,
        ...this.order,
        ...params,
      })

      this.retailers = retailers
      this.count = count
      this.retailerSelected = this.retailers[0]
    },
    onOptionsUpdated(options: Record<string, any>) {
      const {
        page,
        itemsPerPage,
        sortBy: [sortBy],
        sortDesc: [sortDesc],
      } = options

      this.pagination.limit = itemsPerPage > 0 ? itemsPerPage : null
      this.pagination.offset = itemsPerPage * (page - 1)

      this.order.sortBy = sortBy ?? 'name'
      this.order.sort = sortDesc ? 'DESC' : 'ASC'

      this.getRetailerData()
    },
    getWeightingValue(weighting: WeightingIndexes[keyof WeightingIndexes]) {
      return typeof (weighting as WeightingIndexes['quality']).value === 'number'
        ? (weighting as WeightingIndexes['quality']).value
        : weighting
    },
  },
})
</script>

<style lang="scss">
@import '../../../styles/mixins/macScrollbar';
@import '../../../styles/mixins/styleMixin';

#retailers {
  .no-data-item {
    height: 100%;
    overflow: hidden;
  }

  @media #{map-get($display-breakpoints, 'xs-only')} {
    .scroll {
      overflow-y: scroll !important;
      min-height: calc(100vh - 5.4rem - 8.6rem - 6rem);
      max-height: calc(100vh - 5.4rem);
    }

    .action-mobile-wrapper {
      .action-mobile {
        width: 100%;
        min-height: 6rem;
      }
    }

    #retailers__list-wrapper {
      background: $white;
      @include boxShadowWithGradient;

      #retailers__list {
        list-style-type: none;
        margin: 0 0 0 2.4rem;
        padding: 2rem 0;
        overflow-x: auto;
        overflow-y: hidden;

        .retailers__list-item {
          margin: 0 0.8rem;
          display: flex;

          &:first-child {
            margin-left: 0;
          }

          .retailers__logo-wrapper {
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            padding: 1rem;
            width: 11.5rem;
            height: 6.7rem;
            border: 0.1rem solid $main-lighten-65-color;
            border-radius: 0.4rem;

            &--selected {
              border: 0.2rem solid $main-color;
            }

            .retailers__logo {
              width: 90%;
              height: 5rem;
            }
          }

          .retailers__add-button {
            width: 4.4rem !important;
            height: 4.4rem !important;
            border: 0.2rem solid $primary-color;
            border-radius: 0.2rem;
            padding: 0 !important;
            box-sizing: border-box;
            box-shadow: none;
            align-self: center;

            .v-btn__content {
              font-size: 2rem;
            }
          }
        }
      }
    }

    #retailers__info {
      padding: 0 2.4rem 6rem 2.4rem;

      h3 {
        margin: 1.4rem 0;
      }

      .retailers-line {
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: 1.4rem 0;

        .retailers-line__value {
          @include storeNumber;
          font-size: 1.6rem;
          min-width: fit-content;
        }

        .retailers__weighting & {
          border-bottom: 0.1rem solid $main-lighten-65-color;
          &:last-child {
            border-bottom: none;
          }
        }

        .v-icon {
          color: $main-color;
          margin-right: 1.1rem;
        }

        dl {
          display: flex;
          flex-direction: row;
          align-items: center;
          width: 100%;
        }
      }

      .retailers__name {
        text-align: center;
        margin: 2.3rem 0 1.6rem;
        color: $main-color;
      }

      .retailers__contact {
        font-style: normal;
        background: $main-lighten-80-color;
        border-radius: 0.4rem;
        padding: 1rem 1rem 1.6rem;

        .retailers-contact__name {
          color: $main-color;
          text-align: center;
        }

        .retailers-contact__list {
          list-style-type: none;
          padding: 0 !important;
          display: flex;
          flex-direction: row;
          flex: 1 1 4rem;
          justify-content: center;
          margin: 2.4rem auto 0;

          li {
            &:nth-child(n + 2) {
              margin-left: 1.7rem;
            }
          }

          a {
            display: flex;
            text-decoration: none;
            flex: 1 1 4rem;
            width: 5rem;
            height: 5rem;
            align-items: center;
            justify-content: center;
            background: $primary-color;
            border-radius: 50%;
            color: $primary-color;

            .v-icon {
              color: $main-color;
            }
          }
        }
      }
    }
  }

  .retailer-result-margin {
    margin-right: 9%;
  }

  @media #{map-get($display-breakpoints, 'sm-and-up')} {
    .retailers__wrapper {
      padding: 0 0 3.4rem 0;
      word-break: break-all;
    }

    .retailer-row__wrapper {
      .row {
        display: flex;
        align-items: flex-end;
      }

      &:hover {
        background-color: $main-lighten-80-color;
      }
    }
  }

  .v-data-table__wrapper {
    .pointer {
      min-height: 10.7rem;
      height: 10.7rem;

      a {
        text-decoration: none;
      }
    }

    .contact-wrapper {
      display: flex;
      flex-direction: column;
    }

    .column-name {
      width: 17.6rem;
    }

    .column-price,
    .column-satisfaction {
      min-width: 7rem;
    }
  }
}

.mp-data-table tbody tr td {
  vertical-align: middle !important;
}
</style>
