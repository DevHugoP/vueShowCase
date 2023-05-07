<template>
  <div v-if="$vuetify.breakpoint.xsOnly && hasLoaded" id="carriers" data-id="carrier-list">
    <v-row no-gutters justify="center" v-if="canAccessFilters">
      <carriers-filters
        @submit="getCarrierData(defaultFilters)"
        @reset="getCarrierData()"
        :filterResultLength="carriers && carriers.length ? carriers.length : 0"
      />
    </v-row>

    <div id="carrier-scroll" class="scroll">
      <header id="carriers__list-wrapper">
        <div
          v-if="!carriersDisclaimerIsOpen"
          class="infos-link-wrapper-mobile"
          @click="toggleCarrierDisclaimer()"
        >
          <v-icon
            class="mr-2 error-color"
            size="1.6rem"
          >
            mdi-alert-circle
          </v-icon>
          <div class="infos-link-content-mobile">
            <span class="medium16 infos-link-mobile">
              {{ $t('page.carriers.infos.disclaimerLinkMobileFirstPart') }}
            </span>
            <span class="medium16 infos-link-mobile">
              {{ $t('page.carriers.infos.disclaimerLinkMobileSecondPart') }}
            </span>
          </div>
          <v-icon class="main-color" size="1.6rem">mdi-chevron-down</v-icon>
        </div>
        <v-row no-gutters class="mb-8" v-if="carriersDisclaimerIsOpen">
          <v-col cols="10" offset="1" class="carriers-list-infos-mobile">
            <div class="carriers-list-infos-wrapper-mobile">
              <v-img src="@/assets/illustrations/customCheckout.svg" class="mb-6" />
              <div>
                <span class="medium16 mb-4">
                  {{ $t('page.carriers.infos.carriersDisclaimerFirstPart') }}
                </span>
                <span class="regular16">
                  {{ $t('page.carriers.infos.carriersDisclaimerSecondPart') }}
                </span>
              </div>
            </div>
            <v-icon
              class="close-carriers-list-infos-mobile"
              @click="toggleCarrierDisclaimer()"
            >
              mdi-close
            </v-icon>
          </v-col>
        </v-row>
        <ul id="carriers-tabs">
          <mp-chips-wrapper
            v-if="tabs"
            class="mt-3"
            :chips="tabsChips"
            v-model="selectedChips"
            dataId="chips-wrapper-tabs-mobile"
            :maxChips="5"
          />
        </ul>
        <ul id="carriers__list" class="d-flex flex-row">
          <li class="carriers__list-item" v-if="isAuthorized('CREATE_CARRIERS')">
            <mp-button
              class="carriers__add-button"
              icon="plus"
              :to="{ name: ROUTES.addCarrier }"
              dataId="carrier-list-createCarrier"
            />
          </li>

          <li
            class="carriers__list-item"
            v-for="carrier in carriers"
            :key="`carriers__${carrier.id}`"
          >
            <div
              :class="
                `carriers__logo-wrapper${
                  carrier.id === carrierSelected.id ? ' carriers__logo-wrapper--selected' : ''
                }`
              "
              @click.prevent="carrierSelected = carrier"
              data-id="carrier-list-select"
            >
              <v-img
                contain
                width="90%"
                height="5rem"
                class="carriers__logo"
                :src="carrier.logo"
                :alt="carrier.name"
                data-id="carrier-list-logo"
              />
            </div>
          </li>
        </ul>
      </header>
      <no-data
        v-if="carriers && !carriers.length"
        class="no-data-item"
        dataId="carriers-list-noData"
        :blocMode="false"
      />

      <section id="carriers__info" v-if="carrierSelected">
        <h2 class="carriers__name h2-28-bold" data-id="carrier-list-name">
          {{ carrierSelected.name }}
        </h2>
        <div class="carriers-description">
          <span class="italic12 main-color">
            {{
              carrierSelected.description &&
                carrierSelected.description[$store.getters['auth/currentUser'].language]
                ? carrierSelected.description[$store.getters['auth/currentUser'].language]
                : ''
            }}
          </span>
          <v-col cols="12" class="mt-3 logo-picto">
            <img
              v-if="carrierSelected && carrierSelected.isLabeled"
              src="@/assets/logos/label.svg"
            />
            <img
              v-if="
                carrierSelected &&
                  carrierSelected.ecologyType &&
                  carrierSelected.ecologyType === ECOLOGY_TYPE.FULL
              "
              src="@/assets/logos/green100.svg"
            />
            <img
              v-else-if="
                carrierSelected &&
                  carrierSelected.ecologyType &&
                  carrierSelected.ecologyType === ECOLOGY_TYPE.PARTIAL
              "
              src="@/assets/logos/green.svg"
            />
          </v-col>
        </div>
      </section>
    </div>

    <v-row no-gutters class="mt-auto" v-if="carrierSelected && isAuthorized('READ_CARRIERS')">
      <v-col cols="12" class="action-mobile-wrapper">
        <mp-button
          class="action-mobile"
          format="sticky"
          stickyColor="yellow"
          id="more-infos-mobile-btn"
          dataId="retailer-list-moreInfo"
          :text="$t('common.moreInformation')"
          :to="handleMoreInfo(carrierSelected.id)"
        />
      </v-col>
    </v-row>
  </div>

  <v-row no-gutters id="carriers" data-id="carrier-list" v-else-if="hasLoaded">
    <content-header id="carriers-header" dataId="carrier-list-header">
      <template #breadcrumb>
        <mp-breadcrumb />
      </template>
      <template #title>
        <v-row no-gutters>
          <v-col cols="12" class="title-infos-link-wrapper">
            <h1>{{ $t('page.carriers.title') }}</h1>
            <div
              v-if="!carriersDisclaimerIsOpen"
              class="infos-link-wrapper"
              @click="toggleCarrierDisclaimer()"
            >
              <v-icon
                class="mr-1"
                size="1.6rem"
                :color="$vuetify.theme.themes.light.errorColor"
              >
                mdi-alert-circle
              </v-icon>
              <span class="medium16 mr-1 infos-link">
                {{ $t('page.carriers.infos.disclaimerLink') }}</span>
              <v-icon class="main-color" size="1.6rem">mdi-chevron-down</v-icon>
            </div>
          </v-col>
        </v-row>
      </template>
    </content-header>

    <v-row no-gutters class="mb-8" v-if="carriersDisclaimerIsOpen">
      <v-col cols="10" offset="1" class="carriers-list-infos">
        <div class="carriers-list-infos-wrapper">
          <v-img src="@/assets/illustrations/customCheckout.svg" class="infos-image" />
          <div class="carriers-list-content-wrapper">
            <span class="medium14 mb-4">
              {{ $t('page.carriers.infos.carriersDisclaimerFirstPart') }}
            </span>
            <span class="regular14">
              {{ $t('page.carriers.infos.carriersDisclaimerSecondPart') }}
            </span>
          </div>
        </div>
        <v-icon
          class="close-carriers-list-infos"
          @click="toggleCarrierDisclaimer()"
        >
          mdi-close
        </v-icon>
      </v-col>
    </v-row>

    <carriers-filters
      @submit="getCarrierData(defaultFilters)"
      @reset="getCarrierData()"
      v-if="canAccessFilters"
      :filterResultLength="carriers && carriers.length ? carriers.length : 0"
    >
      <template #actions>
        <div class="carrier-list-actions-wrapper">
          <v-menu
            bottom
            offset-y
            origin="center top"
            transition="scale-transition"
            v-if="actions.length"
          >
            <template v-slot:activator="{ on, attrs }">
              <mp-button
                v-bind="attrs"
                v-on="on"
                dataId="carriers-actions"
                format="link"
                linkColor="black"
                :text="$t('action.base')"
                icon="apps"
                class="actionButton"
              />
            </template>
            <v-list>
              <v-list-item
                v-for="(action, index) in actions"
                :key="`carriers-list-actions-${index}`"
                @click="handleActionsClick(action.type)"
                :data-id="`carriers-list-actions-${index}`"
              >
                <v-list-item-icon>
                  <v-icon v-text="action.icon" />
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title v-text="action.text" />
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-menu>
          <div v-if="$vuetify.breakpoint.lgAndUp" class="display-button">
            <v-icon
              v-if="$vuetify.breakpoint.mdAndUp"
              :class="`ml-2 pa-2${displayType === DisplayTypeEnum.LIST ? ' selected' : ''}`"
              @click="displayType = DisplayTypeEnum.LIST"
            >
              mdi-format-list-bulleted
            </v-icon>
            <v-icon
              v-if="$vuetify.breakpoint.mdAndUp"
              :class="`ml-2 pa-2${displayType === DisplayTypeEnum.CARD ? ' selected' : ''}`"
              @click="displayType = DisplayTypeEnum.CARD"
            >
              mdi-view-grid
            </v-icon>
          </div>
        </div>
      </template>
    </carriers-filters>
    <v-col cols="10" offset="1" class="carriers-list-tab">
      <v-tabs ref="tabs" :show-arrows="false" v-model="selectedRange">
        <v-tab
          v-for="(range, index) in tabs"
          class="tabs-range"
          :ref="`tabs-${range.type}`"
          :key="index"
          v-ripple="false"
          :data-id="`carrier-list-slider-${index}`"
        >
          <h2
            :class="
              tabs[selectedRange] && tabs[selectedRange].type === range.type
                ? ' main-color'
                : 'main-lighten-52'
            "
          >
            {{ range.title }}
          </h2>
        </v-tab>
      </v-tabs>
    </v-col>
    <v-col v-if="carriers && carriers.length" cols="10" offset="1" class="carriers-list-content">
      <div
        :class="`carriers-list-cards-wrapper${$vuetify.breakpoint.xsOnly ? '-mobile' : ''}`"
        v-if="displayType === DisplayTypeEnum.CARD"
      >
        <carrier-card
          v-for="(carrier, index) in carriers"
          :key="`order-${carrier.id}-${index}`"
          :carrier="carrier"
        />
      </div>
      <div v-else>
        <carrier-list-data-table
          :carriers="carriers"
          :count="count"
          :pagination="pagination"
          :order="order"
          @getCarrierData="getCarrierData()"
        />
      </div>
    </v-col>
    <no-data v-if="carriers && !carriers.length" dataId="carrier-list-noData" :blocMode="false" />
  </v-row>
</template>

<script lang="ts">
import { authorizationMixin } from '@/mixins'
import mixins from 'vue-typed-mixins'

import contentHeader from '@/components/contentHeader/contentHeader.vue'
import mpBreadcrumb from '@/components/breadcrumb/breadcrumb.vue'
import carriersFilters from './carriersFilters/carriersFilters.vue'
import noData from '@/components/noData/noData.vue'
import CarrierService from '@/services/carrier/CarrierService'
import { CarrierEntity, MODELS, ECOLOGY_TYPE } from '@/types'
import AuthorizationService from '@/services/authorization/AuthorizationService'
import { mapGetters } from 'vuex'
import { ROUTES } from '@/constants'
import { DisplayTypeEnum } from '@/views/Order/List/Orders.vue'
import carrierCard from '@/views/Carrier/List/card/carrierCard.vue'
import carrierListDataTable from '@/views/Carrier/List/list/carrierList.vue'
import { SnackBarType } from '@/store/types'
import { SET_CARRIERS_LIGHT } from '@/store/modules/carrier/mutations-type'

const CARRIER_LIST_ACTIONS_TYPE = {
  ADD: 'ADD',
}

export default mixins(authorizationMixin).extend({
  name: 'carrierList',
  components: {
    contentHeader,
    mpBreadcrumb,
    carriersFilters,
    carrierCard,
    carrierListDataTable,
    noData,
  },
  data: () => ({
    ROUTES,
    carriers: null as CarrierEntity[] | null,
    carrierSelected: null as CarrierEntity | null,
    count: 0,
    pagination: {
      offset: 0,
      limit: null as number | null,
    },
    order: {
      sortBy: 'name',
      sort: 'ASC',
    },
    defaultFilters: {
      offset: 0,
    },
    actions: [] as Array<{ text: string; icon: string; type: string }>,
    displayType: DisplayTypeEnum.CARD as DisplayTypeEnum,
    DisplayTypeEnum,
    selectedRange: 0,
    selectedChips: null as any,
    hasLoaded: false,
    ECOLOGY_TYPE,
    carriersDisclaimerIsOpen: false,
  }),
  computed: {
    ...mapGetters({
      currentUser: 'auth/currentUser',
    }),
    canAccessFilters(): boolean {
      const { carrierIds } = AuthorizationService.getContext(this.currentUser.permissions)

      return !carrierIds.length || carrierIds.length > 1
    },
    tabs(): Array<{ title: string; type: string }> {
      return [
        { title: this.$t('common.carrierRange.all'), type: MODELS.ALL },
        { title: this.$t('common.carrierRange.local'), type: MODELS.LOCAL },
        {
          title: this.$t('common.carrierRange.national'),
          type: MODELS.NATIONAL,
        },
        {
          title: this.$t('common.carrierRange.international'),
          type: MODELS.INTERNATIONAL,
        },
        { title: this.$t('common.carrierRange.relay'), type: MODELS.RELAY },
      ]
    },
    tabsChips(): Array<{ title: string; type: string }> {
      return this.tabs.map((tab, index) => {
        return {
          ...tab,
          text: tab.title,
          value: tab.type,
          index,
        }
      })
    },
  },
  updated() {
    const scrollSection = document.getElementById('carrier-scroll')
    const header = document.getElementsByTagName('header')
    const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
    const carrierFilters = document.getElementById('carrier-list-filter')
    const button = document.getElementById('more-infos-mobile-btn')

    if (scrollSection && header && carrierFilters && button) {
      const newHeight =
        vh - header[0].clientHeight - carrierFilters.clientHeight - button.clientHeight
      scrollSection.style.height = `${newHeight}px`
    }
  },
  async beforeMount() {
    if (this.isAuthorized('CREATE_CARRIERS')) {
      this.actions.push({
        text: this.$t('action.add.carrier'),
        icon: 'mdi-plus',
        type: CARRIER_LIST_ACTIONS_TYPE.ADD,
      })
    }
  },
  async mounted() {
    if (!this.canAccessFilters) {
      await this.getCarrierData()
    }

    const { hash } = location

    if (hash) {
      const tab = hash.substring(1)

      const viewOrCard = tab.split('-')[0]
      const range = tab.split('-')[1]

      if (this.$vuetify.breakpoint.mdAndDown) {
        this.displayType = DisplayTypeEnum.CARD
      } else {
        this.displayType = viewOrCard as DisplayTypeEnum
      }

      this.selectedRange = this.tabs.findIndex(localTab => localTab.type === range)
      if (this.$vuetify.breakpoint.xsOnly) {
        this.$nextTick(() => {
          let mobileTab = this.tabs.find(localTab => localTab.type === range)!
          mobileTab = {
            ...mobileTab,
            text: mobileTab.title,
            value: mobileTab.type,
            index: this.tabs.findIndex(localTab => localTab.type === range),
          } as any

          this.selectedChips = mobileTab
        })
      }
    }

    window.location.hash = `${this.displayType}-${this.tabs[this.selectedRange || 0].type}`

    if (this.$refs[`tabs-${MODELS.ALL}`] || this.$refs.tab) {
      this.$nextTick(() => {
        // bug: slider is not align after a refresh (position decide without the font loaded) / code propose by vuetify in one of there issue
        const tab = (this.$refs[`tabs-${MODELS.ALL}`] as any)[0] || (this.$refs.tab as any)[0]
        const initial = tab.$el.offsetWidth
        const interval = setInterval(() => {
          if (tab) {
            if (tab.$el.offsetWidth !== initial) {
              clearInterval(interval)
              ;(this.$refs.tabs as any).callSlider()
            }
          }
        }, 500)
      })
    }

    this.$nextTick(() => {
      this.hasLoaded = true
    })
  },
  methods: {
    async getCarrierData(params: Record<string, any> = {}): Promise<void> {
      const filters = this.$store.getters['filters/filters']
      const defaultParams = { count: true }
      if (this.$vuetify.breakpoint.xsOnly || this.displayType === DisplayTypeEnum.CARD) {
        this.pagination = { limit: null, offset: 0 }
      }

      const { hash } = location
      const range = hash.substring(1).split('-')[1]

      if (range && range !== MODELS.ALL) {
        params = { ...params, models: [range] }
      }

      let carriers: CarrierEntity[] = []
      let count = 0

      try {
        ;({ carriers, count } = await CarrierService.getAll({
          ...defaultParams,
          ...filters,
          ...this.pagination,
          ...this.order,
          ...params,
        }))
      } catch (error) {
        this.$store.dispatch('setSnackbar', {
          type: SnackBarType.ERROR,
          message: this.$t('messages.error'),
        })
      }

      const lightCarrier = carriers.map(carrier => {
        return { id: carrier.id, name: carrier.name }
      })

      this.$store.commit(`carrier/${SET_CARRIERS_LIGHT}`, lightCarrier)

      this.carriers = carriers
      this.count = count
      this.carrierSelected = this.carriers[0]
    },
    toggleCarrierDisclaimer() {
      this.carriersDisclaimerIsOpen = !this.carriersDisclaimerIsOpen
    },
    handleActionsClick(type: string) {
      if (type === CARRIER_LIST_ACTIONS_TYPE.ADD) {
        this.$router.push({ name: ROUTES.addCarrier })
      }
    },
    handleMoreInfo(carrierId: string) {
      if (!carrierId) {
        return
      }

      if (this.isAuthorized('READ_CARRIERS', { carrierId: Number(carrierId) })) {
        return { name: ROUTES.detailCarrier, params: { carrierId } }
      }
    },
  },
  watch: {
    displayType(next) {
      const { hash } = location

      window.location.hash = `${next}-${hash.substring(1).split('-')[1]}`

      if (next === DisplayTypeEnum.CARD) {
        this.getCarrierData()
      }
    },
    selectedRange(next) {
      const { hash } = location

      window.location.hash = `${hash.substring(1).split('-')[0]}-${this.tabs[next].type}`

      this.getCarrierData()
    },
    selectedChips(next) {
      if (!this.hasLoaded) {
        return
      }
      const { hash } = location

      window.location.hash = `${hash.substring(1).split('-')[0]}-${next.value}`
      this.getCarrierData()
    },
  },
})
</script>

<style lang="scss">
@import '../../../styles/mixins/styleMixin';

@media #{map-get($display-breakpoints, 'xs-only')} {
  .v-main__wrap {
    overflow: hidden;
  }
}

.title-infos-link-wrapper {
  display: flex;
  flex: 1 1;
  flex-direction: row;
  justify-content: space-between;
  align-items: baseline;

  .infos-link-wrapper {
    display: flex;
    flex-direction: row;
    justify-content: end;
    width: 50%;
    &:hover {
      cursor: pointer;
    }

    .infos-link {
      text-decoration: underline;
    }
  }
}

#carriers {
  .carriers-list-infos {
    background-color: $main-lighten-80-color;
    border: 0.1rem solid $main-lighten-80-color;
    border-radius: 0.4rem;
    position: relative;
    display: flex;
    min-height: 14.4rem;

    .carriers-list-infos-wrapper {
      display: flex;
      flex-direction: row;
      justify-content: center;

      .carriers-list-infos-content-title {
        font-weight: bold !important;
      }
    }

    .carriers-list-content-wrapper {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      padding: 2.5rem 4rem;
    }

    .close-carriers-list-infos {
      position: absolute;
      right: 2rem;
      top: 2rem;
      color: $main-color;
    }
  }

  .action-mobile-wrapper {
    .action-mobile {
      width: 100%;
      min-height: 6rem;
    }
  }

  @media #{map-get($display-breakpoints, 'xs-only')} {
    .scroll {
      overflow-y: scroll !important;
      min-height: calc(100vh - 5.4rem - 8.6rem - 6rem);
      max-height: calc(100vh - 5.4rem);
    }

    #carriers__list-wrapper {
      background: $white;
      @include boxShadowWithGradient;

      .infos-link-wrapper-mobile {
        display: flex;
        align-items: flex-start;
        margin: 2rem 0 2rem 2.4rem;
        align-items: center;
        .infos-link-content-mobile {
          display: flex;
          flex-direction: column;
        }
        .infos-link-mobile {
          margin-right: 0.8rem;
          text-decoration: underline;
        }
      }

      .carriers-list-infos-mobile {
        position: relative;
        display: flex;
        align-items: flex-start;
        min-height: 14.4rem;
        padding: 2rem 0;

        .carriers-list-infos-wrapper-mobile {
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .close-carriers-list-infos-mobile {
          position: absolute;
          right: 1.2rem;
          top: 1.2rem;
          color: $main-color;
        }
      }

      #carriers__list {
        list-style-type: none;
        margin: 0 0 0 2.4rem;
        padding: 2rem 0;
        overflow-x: auto;
        overflow-y: hidden;

        .carriers__list-item {
          margin: 0 0.8rem;
          display: flex;

          &:first-child {
            margin-left: 0;
          }

          .carriers__logo-wrapper {
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

            .carriers__logo {
              width: 90%;
              height: 5rem;
            }
          }

          .carriers__add-button {
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

    #carriers__info {
      padding: 0 2.4rem 3rem 2.4rem;
      margin-bottom: 6rem;

      .carriers-line {
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: 1.4rem 0;

        .carriers-line__value {
          @include storeNumber;
          min-width: fit-content;
        }

        .carriers__weighting & {
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

      .carriers-description {
        text-align: center;
        padding-bottom: 1.2rem;
        word-break: break-word;

        .logo-picto {
          bottom: 6rem;
          position: absolute;
          left: 0;
          right: 0;
          display: flex;
          justify-content: center;
          background-color: $white;
          padding-bottom: 1rem;

          img {
            height: 4rem;
            width: 4rem;

            &:nth-child(2) {
              margin-left: 1rem;
            }
          }
        }
      }

      .carriers__name {
        text-align: center;
        margin: 2.3rem 0 1.6rem;
        color: $main-color;
        word-break: break-word;
      }

      .carriers__contact {
        font-style: normal;
        background: $main-lighten-80-color;
        border-radius: 0.4rem;
        padding: 1rem 1rem 1.6rem;

        .carriers-contact__name {
          color: $main-color;
          text-align: center;
        }

        .carriers-contact__list {
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

    #carriers__switch-wrapper {
      margin-bottom: 5rem;
      padding-bottom: 3rem;
      .mp-switch {
        .v-input__slot {
          margin: 0;
        }

        .v-messages {
          display: none;
        }
      }
    }
  }

  .carriers-filters__fields {
    margin-top: 2rem;
  }

  .carrier-list-actions-wrapper {
    display: flex;

    .selected {
      border: 0.1rem $main-color solid;
      border-radius: 0.4rem;
    }

    button {
      cursor: pointer;
      color: $main-color;

      border: 0.1rem transparent solid;
      border-radius: 0.4rem;

      span {
        word-break: normal;
      }

      &:hover:not(:focus, .selected, .actionButton) {
        border: 0.1rem $main-lighten-65-color solid;
      }

      &:focus {
        &::after {
          opacity: 0 !important;
        }
      }
    }
  }
  .carriers-list-tab {
    margin-top: 4.4rem;
    margin-bottom: 2rem;

    .tabs-range {
      min-width: fit-content;
      margin-right: 3.8rem;
      padding: 0;
    }

    .v-tabs-slider-wrapper {
      height: 0.5rem !important;

      .v-tabs-slider {
        width: 4rem;
      }
    }
  }

  .carriers-list-content {
    .v-tabs-slider-wrapper {
      height: 0.5rem !important;

      .v-tabs-slider {
        width: 4rem;
      }
    }

    .carriers-list-cards-wrapper {
      margin-top: 5rem;
      display: grid;
      grid-template-columns: repeat(auto-fill, 17rem);
      justify-content: space-between;
      grid-gap: 3.8rem;
      grid-row-gap: 2.4rem;
    }

    .carriers-list-cards-wrapper-mobile {
      margin-top: 5rem;
      display: grid;
      grid-template-columns: repeat(auto-fill, 14rem);
      justify-content: space-between;
      grid-gap: 3.8rem;
      grid-row-gap: 2.4rem;
    }
  }
}

.no-data-item {
  height: 100%;
  overflow: hidden;
}

.display-button {
  margin-right: 50px;
  display: flex;
  flex-direction: inline;
}
</style>
