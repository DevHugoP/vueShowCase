<template>
  <v-app :class="hasLightLayout ? 'v-application--has-light-layout' : ''">
    <template v-if="isLoadingApp">
      <div class="app-loader">
        <v-img src="@/assets/logos/eyes_mini.gif" alt="loading" class="logo" />
        <v-progress-circular indeterminate size="64" />
        <div class="loader-text">
          {{ $t('common.loading_application') }}
        </div>
      </div>
    </template>
    <template v-else>
      <mp-snackbar
        v-model="snackbar.showing"
        v-if="snackbar.showing"
        :type="snackbar.type"
        :message="snackbar.message"
        :timeout="snackbar.timeout"
        :clearable="snackbar.clearable"
        @clear="removeSnackbar()"
        dataId="app-snackbar"
      />

      <template v-if="hasLightLayout">
        <router-view :key="$route.path" v-if="$vuetify.breakpoint.smAndUp" />

        <template v-else>
          <mp-header v-if="!isLoginRoute" />

          <router-view :key="$route.path" />
        </template>
      </template>
      <template v-else>
        <template v-if="$vuetify.breakpoint.smAndUp">
          <mp-header />

          <v-container fluid v-if="hasCenteredContent" class="main-content--centered__wrapper">
            <v-main class="main-content--centered">
              <router-view :key="$route.path" />
            </v-main>
          </v-container>

          <div v-else class="main-content">
            <router-view :key="$route.path" />
          </div>
        </template>
        <template v-else>
          <mp-header />

          <v-main class="main-content">
            <v-container :class="`main-wrapper pa-0${hasStepper ? ' with-stepper' : ''}`">
              <router-view :key="$route.path" />
            </v-container>
          </v-main>
        </template>
      </template>

      <v-overlay v-if="showLoader">
        <v-progress-circular indeterminate size="64" />
      </v-overlay>
    </template>
  </v-app>
</template>

<script lang="ts">
import { dateHelper } from '@/helpers/dateHelper'
import Vue from 'vue'
import { mapActions, mapGetters } from 'vuex'

import { LOCAL_STORAGE, ROUTES } from '@/constants'

import mpHeader from '@/components/header/header.vue'

import { applyRouterFirewall, redirectToLogin } from '@/router'

import vTruncate from '@/filters/vTruncate'

import { SET_SNACKBAR, SET_SNACKBAR_SHOWING } from '@/store/mutation-types'

export default Vue.extend({
  name: 'App-bo-front-new',
  components: {
    mpHeader,
  },
  filters: {
    truncate: vTruncate,
  },
  watch: {
    $route() {
      if (!this.isLoadingApp) {
        applyRouterFirewall()
      }
    },
  },
  async beforeMount() {
    if (localStorage.getItem(LOCAL_STORAGE.ACCESS_TOKEN)) {
      try {
        await this.fetchUserData()
        // This force update of i18n system to allow the use of this.$t in methods and computeds
        this.$root.$i18n.i18nLoadedAt = dateHelper.getDate().toString()
      } catch (err) {
        await this.logout()
        this.setAppIsLoading(false)
        redirectToLogin()
        return
      }
    }

    applyRouterFirewall()

    this.setAppIsLoading(false)
  },
  computed: {
    ...mapGetters({
      hasStepper: 'hasStepper',
      hasLightLayout: 'hasLightLayout',
      hasCenteredContent: 'hasCenteredContent',
      snackbar: 'snackbar',
      isLoadingApp: 'isLoadingApp',
      showLoader: 'showLoader',
    }),
    isLoginRoute(): boolean {
      return this.$route.name === ROUTES.login
    },
  },
  methods: {
    ...mapActions('auth', {
      logout: 'logout',
      fetchUserData: 'fetchUserData',
    }),
    ...mapActions({
      setAppIsLoading: 'setAppIsLoading',
    }),
    removeSnackbar() {
      this.$store.commit(SET_SNACKBAR_SHOWING, false)
      this.$store.commit(SET_SNACKBAR, {
        type: '',
        text: '',
        timeout: 2000,
        clearable: false,
      })
    },
  },
})
</script>

<style lang="scss">
@import './styles/global.scss';

html {
  overflow-y: auto !important;
}

.pointer {
  cursor: pointer;
}

#app {
  background: $primary-color;

  .app-loader {
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    flex-direction: column;

    .logo {
      flex-grow: 0;
      width: 130px;
    }

    .loader-text {
      font-size: 1.4em;
    }
  }

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

  .main-content--centered__wrapper {
    max-width: 95%;
  }

  .v-tab,
  .v-btn {
    text-transform: none !important;
  }
  .v-dialog--fullscreen {
    overflow-y: auto !important;
  }

  .switch-wrapper {
    display: flex;
    align-items: center;

    .v-input__slot {
      margin-bottom: 0;
    }

    .v-messages {
      display: none;
    }
  }

  .border-none {
    border: none !important;
  }
}

.v-application--wrap {
  & > .container {
    padding-top: 0;
    padding-bottom: 0;
  }
}

.theme--dark.v-sheet {
  color: $main-color !important;
}

.v-sheet.v-card.v-card--outlined {
  box-shadow: none !important;
}

.v-avatar {
  &.initials {
    background-color: $primary-color;

    h2,
    h3 {
      color: $white;
    }
  }
}

@media #{map-get($display-breakpoints, 'sm-and-up')} {
  .main-content,
  .main-content--centered {
    margin-top: 8.5rem;
  }
}

@media #{map-get($display-breakpoints, 'xs-only')} {
  .main-content {
    background-color: $white;
    margin-top: 5.4rem;
  }
}
</style>
