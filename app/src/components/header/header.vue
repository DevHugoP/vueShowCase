<template>
  <div v-if="hasLoaded" id="header">
    <template v-if="$vuetify.breakpoint.lgAndUp">
      <v-app-bar flat hide-on-scroll>
        <router-link v-if="$vuetify.breakpoint.lgAndUp" to="/">
          <v-img class="logo" src="@/assets/logos/logo_dark.svg" />
        </router-link>

        <template v-if="isAuthenticated">
          <v-row class="dsk-wrapper" no-gutters>
            <v-col class="header-content-wrapper" cols="12">
              <div class="d-flex header-menu-links">
                <v-tabs ref="tabs" :hide-slider="showSlider" :show-arrows="false">
                  <v-tab
                    v-for="(link, i) in navLinksFiltered"
                    :key="i"
                    :ref="i === 0 ? 'tab' : `tab-${link.route}`"
                    :class="`tab-nav-link${i === navLinksFiltered.length - 1 ? ' last' : ''}`"
                    :data-id="`header-routes-${link.route}`"
                    :to="{ name: link.route }"
                  >
                    <span class="medium14 main-color">{{ $t(link.title) }}</span>
                  </v-tab>
                </v-tabs>
              </div>

              <div class="d-flex align-center">
                <mp-button
                  v-if="
                    isAuthenticated && isFeatureEnabled('order') && isAuthorized('CREATE_ORDERS')
                  "
                  :disabled="isCreateOrderButtonDisabled"
                  :text="$t('action.create.order')"
                  :to="{ name: ROUTES.createOrder, query: { stepNumber: 1 } }"
                  class="create-order-btn"
                  dataId="header-createOrder"
                  format="secondary"
                />

                <menu-profile v-if="isAuthenticated" class="ml-3" />
              </div>
            </v-col>
          </v-row>
        </template>
      </v-app-bar>
    </template>

    <template v-else>
      <v-navigation-drawer
        v-model="sidebar"
        class="v-navigation-drawer--header"
        fixed
        width="30rem"
      >
        <template v-if="isAuthenticated">
          <div class="ml-5 mr-5 mt-5 d-flex justify-space-between">
            <span class="regular14 main-lighten-52">
              {{ `${currentUser.lastname} ${currentUser.firstname}` }}
            </span>

            <mp-language-switch
              disabled
              dataId="header-language-switch"
              :selectedLanguage="currentUser.language || $root.$i18n.i18next.language"
              bottom
              left
              @input="changeLanguage($event)"
            />
          </div>

          <v-list dense>
            <v-list-item
              v-for="link in mobileNavLinks"
              :key="link.route"
              :data-id="`header-routes-${link.route}`"
              :to="{ name: link.route }"
              link
            >
              <v-list-item-content>
                <v-list-item-title class="d-flex align-center">
                  <span class="regular14">{{ $t(link.title) }}</span>
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>

          <v-divider />

          <menu-profile />

          <div class="mobile-action-wrapper" v-if="isAuthorized('CREATE_ORDERS')">
            <mp-button
              :disabled="isCreateOrderButtonDisabled"
              :text="$t('action.create.order')"
              :to="{ name: ROUTES.createOrder, query: { stepNumber: 1 } }"
              class="create-order-btn"
              dataId="header-createOrder"
              format="primary"
              small
            />
          </div>
        </template>
      </v-navigation-drawer>

      <v-app-bar v-if="$router.currentRoute.name !== 'specificPartnerLogin'" clipped-left dark flat>
        <v-app-bar-nav-icon
          v-if="isAuthenticated"
          class="menu--hamburger"
          data-id="header-sidebar"
          @click.stop="sidebar = !sidebar"
        />

        <div id="title-alert" class="align-center">
          <v-toolbar-title class="h1-mobile"> {{ headerTitle }}</v-toolbar-title>
          <div @click="$router.push({ name: ROUTES.alert })" class="link">
            <v-icon class="px-0 main-color">mdi-bell</v-icon>
            <mp-badge
              v-if="unreadAlertsCount"
              :content="
                unreadAlertsCount > paginationLimit ? `${paginationLimit}+` : unreadAlertsCount
              "
              class="badge-alert"
              color="red"
              dataId="alertModal"
            />
          </div>
        </div>
      </v-app-bar>
    </template>
  </div>
</template>

<script lang="ts">
import mixins from 'vue-typed-mixins'
import { mapGetters } from 'vuex'

import { NavLink } from '@/types'
import { ROUTES } from '@/constants'

import menuDropdown from '@/components/header/menuDropdown/menuDropdown.vue'
import menuProfile from '@/components/header/menuProfile/menuProfile.vue'
import { dateHelper } from '@/helpers/dateHelper'

import { authorizationMixin, socketMixin } from '@/mixins'

import { AVAILABLE_LANGUAGES, i18n, TRANSLATED_LANGUAGES } from '@/plugins/i18n'

import { headerNavLinks, mobileHeaderNavLinks } from '@/router/menuNavLinks'
import {
  INCREMENT_UNREAD_ALERTS_COUNT,
  SET_UNREAD_ALERTS_COUNT,
} from '@/store/modules/alert/mutations-types'

import { SET_HEADER_TITLE } from '@/store/mutation-types'

export default mixins(authorizationMixin, socketMixin).extend({
  name: 'Header',
  components: {
    menuDropdown,
    menuProfile,
  },
  sockets: {
    connect() {
      this.socketEmit('connection')
      this.socketEmit('unreadAlertsCount')
    },
    NEW_ALERT_CREATED() {
      this.$store.commit(`alert/${INCREMENT_UNREAD_ALERTS_COUNT}`)
    },
    ALERTS_COUNT(payload: Record<string, any>) {
      const { count } = payload

      this.$store.commit(`alert/${SET_UNREAD_ALERTS_COUNT}`, parseInt(count, 10))
    },
  } as any,
  data: () => ({
    sidebar: false,
    headerNavLinks,
    ROUTES,
    hasLoaded: false,
  }),
  async mounted() {
    this.$nextTick(() => {
      const name = this.$router.currentRoute.name

      if (name) {
        this.setTitle(name)
      }
    })

    this.connectSocket()
    this.hasLoaded = true
    if (this.$vuetify.breakpoint.lgAndUp) {
      this.$nextTick(() => {
        // bug: slider is not align after a refresh (position decide without the font loaded) / code propose by vuetify in one of there issue
        const tab = (this.$refs[`tab-${ROUTES.orders}`] as any)[0] || (this.$refs.tab as any)[0]
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
  },
  methods: {
    changeLanguage(language: string): void {
      i18n.changeLanguage(language)
      dateHelper.changeLocale(language)
      // This force update of i18n system to allow the use of this.$t in methods and computeds
      this.$root.$i18n.i18nLoadedAt = dateHelper.getDate().toString()
    },
    setTitle(routeName: string): void {
      let headerTitle = this.$t(`page.${routeName}.title`)

      if (routeName === ROUTES.detailOrder) {
        headerTitle = this.$t(`page.${routeName}.title`, { orderId: this.headerData })
      }

      this.$store.commit(SET_HEADER_TITLE, headerTitle)
    },
  },
  computed: {
    ...mapGetters({
      currentUser: 'auth/currentUser',
      isAuthenticated: 'auth/isAuthenticated',
      headerTitle: 'getHeaderTitle',
      headerData: 'getHeaderData',
      paginationLimit: 'alert/paginationLimit',
      unreadAlertsCount: 'alert/unreadAlertsCount',
    }),
    languagesNames(): Record<string, string> {
      return AVAILABLE_LANGUAGES.reduce((languagesNames, language) => {
        languagesNames = { ...languagesNames, [language]: TRANSLATED_LANGUAGES[`${language}`] }
        return languagesNames
      }, {})
    },
    countries(): string[] {
      return AVAILABLE_LANGUAGES
    },
    mobileNavLinks(): Array<NavLink | NavLink[]> {
      const localHeaderLinkMobile = [...headerNavLinks, ...mobileHeaderNavLinks]

      return localHeaderLinkMobile.map(item => {
        const { children } = item

        return children && children.length ? children : item
      })
    },
    isCreateOrderButtonDisabled(): boolean {
      return this.$route.name === ROUTES.createOrder
    },
    showSlider(): boolean {
      const notAllowed = [
        ROUTES.users,
        ROUTES.addUser,
        ROUTES.editUser,
        ROUTES.detailUser,
        ROUTES.rulesGroups,
        ROUTES.addRulesGroup,
        ROUTES.editRulesGroup,
        ROUTES.profile,
        ROUTES.addPermission,
        ROUTES.editPermission,
        ROUTES.administrationConfig,
        ROUTES.administrationConfigEdit,
        ROUTES.alertConfigEdit,
        ROUTES.alertConfigDetail,
        ROUTES.notificationsReporting,
        ROUTES.notificationDetail,
        ROUTES.editNotification,
        ROUTES.createNotification,
        ROUTES.notificationAdministration,
      ]

      return notAllowed.includes(this.$route.name!)
    },
    navLinksFiltered(): NavLink[] {
      return headerNavLinks.filter(({ feature }) => !feature || this.isFeatureEnabled(feature))
    },
  },
  watch: {
    $route(to) {
      const { name } = to

      if (name) {
        this.setTitle(name)
      }
    },
  },
})
</script>

<style lang="scss">
:root {
  --header-height: 8.5rem !important;
}

#header {
  width: 100%;
  z-index: 6;
  left: 0;
  right: 0;
  position: fixed;
  top: 0;

  header {
    max-height: 8.5rem;
  }

  .dsk-wrapper {
    .header-content-wrapper {
      display: flex;
      justify-content: space-between;
    }

    .v-tabs-slider-wrapper {
      height: 0.5rem !important;

      .v-tabs-slider {
        width: 4rem;
      }
    }

    .tab-nav-link {
      margin-right: 4.5rem;
      padding: 0;
      display: flex;
      justify-content: flex-start;
      min-width: fit-content;

      &:hover {
        color: $white !important;
      }

      &:focus {
        color: $white !important;
      }

      &.last {
        margin-right: 0;
      }
    }
  }

  @media #{map-get($display-breakpoints, 'md-and-down')} {
    .v-toolbar__content {
      display: flex;
      justify-content: flex-start !important;
    }
  }

  .v-app-bar {
    transform: translateY(0) !important;
  }

  @media #{map-get($display-breakpoints, 'xs-only')} {
    position: fixed;
    top: 0;

    .v-stepper--alt-labels {
      max-height: 5rem;
    }

    .logo-wrapper {
      background-color: $primary-color;
    }

    .v-app-bar,
    .v-toolbar__content {
      height: 5.4rem !important;
      background-color: $primary-color;

      .v-toolbar__title {
        padding-left: 0;
      }

      .v-btn__content {
        color: $main-color;
      }
    }
  }

  .menu--hamburger {
    color: $main-color;
  }

  @media #{map-get($display-breakpoints, 'sm-and-up')} {
    .v-app-bar {
      background-color: $white;
      border-bottom: 0.1rem solid $main-lighten-74-color;
      height: var(--header-height) !important;
      display: flex;
      justify-content: center;
      align-items: center;

      .v-toolbar__content {
        width: 100%;
        display: flex;
        justify-content: space-between;
        padding: 0 4rem;

        .logo {
          margin-right: 6rem;
        }

        .action-create-order-wrapper {
          display: flex;
          align-items: center;
          justify-content: flex-end;

          .create-order-btn {
            font-weight: normal;

            .v-btn__content {
              text-align: center;
            }

            padding-right: 3.2rem;
            padding-left: 3.2rem;
          }
        }
      }
    }
  }
}

#app {
  .v-navigation-drawer--header {
    .v-navigation-drawer__content {
      display: flex;
      flex-direction: column;
    }

    .v-list {
      .v-list-item {
        padding-left: 2rem;

        &.v-list-item--active {
          background-color: $main-lighten-80-color;
        }

        .v-list-item__content {
          padding: 1.2rem 0;

          .v-list-item__title {
            color: $main-color;

            > .mp-badge {
              margin-top: 0;
            }
          }
        }

        .v-list-item__icon {
          margin: 1.2rem 1rem 1.2rem 0;

          .v-icon {
            color: $main-lighten-65-color;
          }
        }
      }
    }

    .mobile-action-wrapper {
      display: flex;
      justify-content: center;
      margin-top: auto;
      margin-bottom: 2.4rem;
    }
  }
}

#title-alert {
  width: 100%;
  max-width: 94%;
  display: flex;
  justify-content: space-between;

  .h1-mobile {
    max-width: 80%;
  }

  .link {
    text-decoration: none;
  }

  .badge-alert {
    margin-left: -15px;
  }
}
</style>
