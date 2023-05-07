<template>
  <div id="login" data-id="login" v-if="createdHookFinished">
    <template v-if="$vuetify.breakpoint.xsOnly">
      <v-row class="login-logo" no-gutters justify="center" align="center">
        <v-col cols="10" offset="1" class="login-logo-wrapper">
          <v-img src="@/assets/logos/logo_dark.svg" data-id="login-logo" />
        </v-col>
        <v-col cols="2">
          <mp-language-switch
            dataId="login-language-switch"
            :selectedLanguage="$root.$i18n.i18next.language"
            @input="changeLanguage($event)"
            :countries="languages"
            :countriesName="languagesNames"
            class="ml-3"
          />
        </v-col>
      </v-row>

      <div v-if="display.catchphrases">
        <v-row class="login-content" no-gutters>
          <v-col offset="1" cols="10">
            <catchphrase :index="catchphraseIndex" />
          </v-col>
        </v-row>


        <v-row class="login-button__outer-wrapper" no-gutters>
          <v-col cols="12" class="login-retailer-logo">
            <v-img
              v-if="specificPartner"
              contain
              :src="specificPartner.logo"
              alt="retailer-logo"
              max-width="17rem"
              max-height="6rem"
            />
            <v-row no-gutters v-else class="no-image" />
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col cols="12" class="action-mobile-wrapper">
            <mp-button
              format="sticky"
              stickyColor="yellow"
              class="action-mobile"
              :text="$t('action.login')"
              dataId="login-login"
              @click="specificPartner ? handleLoginRequest() : changeDisplayForm({})"
            />
          </v-col>
        </v-row>
      </div>
      <div v-else-if="display.resetPassword">
        <v-row no-gutters>
          <v-col cols="12">
            <mp-form-reset-password
              @submit="resetPassword($event)"
              @return="changeDisplayForm({})"
            />
          </v-col>
        </v-row>
      </div>
      <div v-else-if="display.sendResetCallback">
        <v-row no-gutters>
          <v-col cols="12">
            <mp-form-send-reset
              :username="username"
              @submit="sendResetPasswordCallback($event)"
              @return="changeDisplayForm({ catchphrases: true })"
            />
          </v-col>
        </v-row>
      </div>
      <div v-else-if="display.passwordLess">
        <v-row no-gutters>
          <v-col cols="12">
            <mp-form-password-less
              :username="username"
              @submit="sendPasswordLessAuthentication($event)"
              @return="changeDisplayForm({ catchphrases: true })"
            />
          </v-col>
        </v-row>
      </div>
      <div v-else>
        <v-row no-gutters>
          <v-col cols="12">
            <mp-form-login @submit="login($event)" @sendToCallback="sendToResetCallback($event)" />
          </v-col>
        </v-row>
      </div>
    </template>

    <template v-else>
      <v-row class="split-screen__wrapper" no-gutters>
        <v-col class="split-screen__wrapper--left d-flex align-center" cols="6">
          <v-row class="login-logo__main" no-gutters>
            <v-col offset="2" cols="8">
              <v-img src="@/assets/logos/eyes.gif" data-id="login-logo" />
            </v-col>
          </v-row>
        </v-col>
        <v-col class="split-screen__wrapper--right" cols="6">
          <v-row class="login-logo" no-gutters>
            <v-col offset="1" cols="10" class="login-logo-wrapper">
              <v-col cols="5" class="pa-0 logo-woop">
                <v-img src="@/assets/logos/logo_dark.svg" data-id="login-logo" class="logo-size" />
              </v-col>

              <v-col cols="5">
                <v-img
                  v-if="specificPartner"
                  contain
                  :src="specificPartner.logo"
                  alt="retailer-logo"
                  class="logo-size"
                />
              </v-col>
              <v-col cols="2">
                <mp-language-switch
                  dataId="login-language-switch"
                  :selectedLanguage="$root.$i18n.i18next.language"
                  @input="changeLanguage($event)"
                  :countries="languages"
                  :countriesName="languagesNames"
                  class="ml-3"
                />
              </v-col>
            </v-col>
          </v-row>

          <div v-if="display.catchphrases">
            <v-row class="login-content" no-gutters>
              <v-col offset="1" cols="8">
                <catchphrase :index="catchphraseIndex" />
              </v-col>
            </v-row>

            <v-row class="login-button__wrapper" no-gutters>
              <v-col offset="1" cols="10" class="login-button-wrapper">
                <mp-button
                  format="primary"
                  :text="$t('action.login').toUpperCase()"
                  dataId="login-login"
                  @click="specificPartner ? handleLoginRequest() : changeDisplayForm({})"
                />
              </v-col>
            </v-row>
          </div>
          <div v-else-if="display.sendResetCallback">
            <v-row no-gutters>
              <v-col cols="10" sm="8" offset="1">
                <mp-form-send-reset
                  :username="username"
                  @submit="sendResetPasswordCallback($event)"
                  @return="changeDisplayForm({ catchphrases: true })"
                />
              </v-col>
            </v-row>
          </div>
          <div v-else-if="display.resetPassword">
            <v-row no-gutters>
              <v-col cols="10" sm="8" offset="1">
                <mp-form-reset-password
                  @submit="resetPassword($event)"
                  @return="changeDisplayForm({})"
                />
              </v-col>
            </v-row>
          </div>
          <div v-else-if="display.passwordLess">
            <v-row no-gutters>
              <v-col cols="10" sm="8" offset="1">
                <mp-form-password-less
                  :username="username"
                  @submit="sendPasswordLessAuthentication($event)"
                  @return="changeDisplayForm({ catchphrases: true })"
                />
              </v-col>
            </v-row>
          </div>
          <div v-else>
            <v-row no-gutters>
              <v-col cols="10" sm="8" offset="1">
                <mp-form-login
                  @submit="login($event)"
                  @sendToCallback="sendToResetCallback($event)"
                />
              </v-col>
            </v-row>
          </div>
        </v-col>
      </v-row>
    </template>
  </div>
</template>

<script lang="ts">
import { MAX_EXISTING_CATCHPHRASE, LOCAL_STORAGE } from '@/constants'
import { redirectToLogin } from '@/router'
import AuthenticationService from '@/services/authentication/AuthenticationService'
import CarrierService from '@/services/carrier/CarrierService'

import RetailerService from '@/services/retailer/RetailerService'
import { SnackBarType } from '@/store/types'

import { AuthInfos, AuthTokenKeycloakType, AuthTokenRequest } from '@/types'
import mpFormLogin from '@/views/Login/loginForm/form.vue'
import mpFormResetPassword from '@/views/Login/resetPasswordForm/form.vue'
import mpFormSendReset from '@/views/Login/sendResetForm/form.vue'
import mpFormPasswordLess from '@/views/Login/passwordLess/form.vue'
import Vue from 'vue'
import { mapActions, mapGetters } from 'vuex'

import catchphrase from './catchphrase/catchphrase.vue'

import { i18n, AVAILABLE_LANGUAGES, TRANSLATED_LANGUAGES } from '@/plugins/i18n'
import { dateHelper } from '@/helpers/dateHelper'

export default Vue.extend({
  name: 'login',
  components: {
    catchphrase,
    mpFormLogin,
    mpFormResetPassword,
    mpFormSendReset,
    mpFormPasswordLess,
  },
  data: () => ({
    catchphraseIndex: -1,
    specificPartner: undefined as AuthInfos | undefined,
    display: {
      catchphrases: true,
      resetPassword: false,
      sendResetCallback: false,
      passwordLess: false,
    },
    createdHookFinished: false,
    token: '',
    username: '',
  }),
  async created() {
    const {
      query: { language },
    } = this.$route

    const currentLang = language?.toString() || window.localStorage.getItem('i18nextLng')
    this.changeLanguage(currentLang || 'fr')

    // When access to login page when connected, redirect to homepage
    if (localStorage.getItem(LOCAL_STORAGE.ACCESS_TOKEN)) {
      this.$router.push('/')
    } else {
      if (this.isPending) {
        this.setAppIsLoading(true)
      }

      let authToken: AuthTokenRequest | undefined

      if (this.$route.query.code) {
        const code = this.$route.query.code as string
        this.removeCodeFromQueryParams()
        authToken = {
          type: AuthTokenKeycloakType,
          code,
          provider: this.provider,
        }
      }

      if (this.$route.query.access_token) {
        const passwordlessToken = this.$route.query.access_token as string

        localStorage.setItem(LOCAL_STORAGE.ACCESS_TOKEN, passwordlessToken)
        this.redirectToRequestedPage()
        authToken = {
          type: AuthTokenKeycloakType,
          provider: this.provider,
        }
      }

      if (this.$route.query.token) {
        this.token = this.$route.query.token as string
        this.removeCodeFromQueryParams()

        this.changeDisplayForm({
          resetPassword: true,
        })
      }

      if (this.$route.params.partnerCode) {
        const partnerName = this.$route.params.partnerCode as string
        // Ask for specific retailer login
        const [retailer, carrier] = await Promise.all([
          RetailerService.getAuthInfos(partnerName),
          CarrierService.getAuthInfos(partnerName),
        ])
        this.specificPartner = retailer || carrier

        authToken = await (this.handleProviderLogin(partnerName) as any)
      }

      authToken = authToken ?? {
        type: AuthTokenKeycloakType,
        specificPartner: this.specificPartner,
      }

      if (authToken && this.isPending) {
        await this.authTokenRequest(authToken)

        if (this.isSuccess) {
          this.redirectToRequestedPage()
        } else {
          this.logout()
          this.setSnackbar({
            type: SnackBarType.ERROR,
            message: this.$t('messages.loginError'),
            timeout: 5000,
          })
        }
      }
    }

    this.createdHookFinished = true
    this.setAppIsLoading(false)
  },
  beforeMount() {
    this.catchphraseIndex = Math.floor(Math.random() * Math.floor(MAX_EXISTING_CATCHPHRASE))
  },
  computed: {
    ...mapGetters('auth', {
      specificPartnerLoginCode: 'specificPartnerLoginCode',
      mustResetPassword: 'mustResetPassword',
      reset: 'reset',
      provider: 'provider',
      isSuccess: 'isSuccess',
      isPending: 'isPending',
      isError: 'isError',
    }),
    languagesNames() {
      return AVAILABLE_LANGUAGES.reduce((countriesNames, language) => {
        countriesNames = { ...countriesNames, [language]: TRANSLATED_LANGUAGES[`${language}`] }
        return countriesNames
      }, {})
    },
    languages() {
      return AVAILABLE_LANGUAGES
    },
  },
  methods: {
    ...mapActions('auth', {
      authTokenRequest: 'authTokenRequest',
      authMustResetPassword: 'authMustResetPassword',
      authWaitingProviderLogin: 'authWaitingProviderLogin',
      authError: 'authError',
      authSetPartnerName: 'authSetPartnerName',
      authSetProvider: 'authSetProvider',
      logout: 'logout',
    }),
    ...mapActions({
      setAppIsLoading: 'setAppIsLoading',
      setSnackbar: 'setSnackbar',
    }),
    async handleProviderLogin(partnerName: string) {
      if (!this.specificPartner) {
        return
      }

      this.authSetPartnerName(partnerName)

      if (this.specificPartner.code !== 'google') {
        if (!this.specificPartner.authProviderId) {
          return
        }
      }

      return {
        type: AuthTokenKeycloakType,
        specificPartner: this.specificPartner,
        provider: this.specificPartner.authProviderId,
      }
    },
    changeLanguage(language: string) {
      i18n.changeLanguage(language)
      dateHelper.changeLocale(language)
      // This force update of i18n system to allow the use of this.$t in methods and computeds
      this.$root.$i18n.i18nLoadedAt = dateHelper.getDate().toString()
    },
    async handleLoginRequest(): Promise<void> {
      this.authWaitingProviderLogin()

      if (this.specificPartner?.passwordLess) {
        this.changeDisplayForm({ passwordLess: true })
      } else if (this.specificPartner?.authProviderId) {
        this.authSetProvider(this.specificPartner?.authProviderId)
        const { url } = await AuthenticationService.initializeProvider(
          this.specificPartner.authProviderId,
        )
        window.location.href = url.toString()
      } else {
        this.changeDisplayForm({})
      }
    },
    changeDisplayForm({ catchphrases = false, resetPassword = false, sendResetCallback = false, passwordLess = false }) {
      this.display = {
        catchphrases,
        resetPassword,
        sendResetCallback,
        passwordLess,
      }
    },
    sendToResetCallback({ username }: { username: string }) {
      this.username = username
      this.changeDisplayForm({ sendResetCallback: true })
    },
    async login(login: { username: string; password: string }) {
      try {
        await this.authTokenRequest({ type: AuthTokenKeycloakType, ...login, provider: '' })

        if (this.isError) {
          this.$store.dispatch('setSnackbar', {
            type: SnackBarType.ERROR,
            message: this.$t('messages.loginError'),
          })
        }

        if (this.mustResetPassword) {
          this.token = this.reset
          this.authMustResetPassword()
          this.changeDisplayForm({
            resetPassword: true,
          })
        }

        this.redirectToRequestedPage()
      } catch (e) {
        redirectToLogin()
      }
    },
    redirectToRequestedPage() {
      // When login succeed, redirect user to requested page
      const redirect = localStorage.getItem(LOCAL_STORAGE.REQUESTED_PAGE) || '/'

      localStorage.removeItem(LOCAL_STORAGE.REQUESTED_PAGE)

      this.$router.push({ path: redirect })
    },
    async sendResetPasswordCallback({ email, token }: { email: string; token: string }) {
      const language = i18n.getCurrentLanguage()

      try {
        await AuthenticationService.sendResetPasswordCallbackUrl({ email, language, token })

        this.$store.dispatch('setSnackbar', {
          type: SnackBarType.SUCCESS,
          message: this.$t('messages.emailSent'),
        })

        this.changeDisplayForm({
          catchphrases: true,
        })
      } catch (e) {
        this.$store.dispatch('setSnackbar', {
          type: SnackBarType.ERROR,
          message: this.$t('messages.error'),
        })
      }
    },
    async sendPasswordLessAuthentication(email: string) {
      try {
        const code = this.specificPartner!.code
        await AuthenticationService.sendPasswordLessAuthentication({ email, code })

        this.$store.dispatch('setSnackbar', {
          type: SnackBarType.SUCCESS,
          message: this.$t('messages.passwordLessEmail'),
        })
      } catch (e) {
        this.$store.dispatch('setSnackbar', {
          type: SnackBarType.ERROR,
          message: this.$t('messages.error'),
        })
      }

      this.changeDisplayForm({
        catchphrases: true,
      })
    },
    async resetPassword(password: { password: string; passwordConfirmation: string }) {
      try {
        await AuthenticationService.resetUserPassword({ token: this.token, ...password })

        this.$store.dispatch('setSnackbar', {
          type: SnackBarType.SUCCESS,
          message: this.$t('messages.passwordReset'),
        })
      } catch (e) {
        this.$store.dispatch('setSnackbar', {
          type: SnackBarType.ERROR,
          message: this.$t('messages.error'),
        })
      }

      this.changeDisplayForm({
        catchphrases: true,
      })
    },
    removeCodeFromQueryParams(): void {
      const query = Object.assign({}, this.$route.query)
      delete query.code
      delete query.state
      delete query.token
      delete query.session_state
      this.$router.replace({ query })
    },
  },
})
</script>

<style lang="scss">
#login {
  @media #{map-get($display-breakpoints, 'xs-only')} {
    height: 100%;
    width: 100%;
    position: fixed;
    top: 0;
    padding-bottom: 6.4rem !important;
    background-color: $white;

    .login-logo {
      height: 13.7rem;
      background-color: $primary-color;

      .login-logo-wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-left: 0;
      }

      .v-image {
        width: 20.5rem;
        height: 7.8rem;
      }
    }

    .login-content {
      background-color: $white;
      overflow: hidden;
      min-height: calc(100vh - 13.7rem - 14rem);
      max-height: calc(100vh - 13.7rem - 6rem);
      padding: 3.8rem 0 2.6rem 0;
    }

    .login-retailer-logo {
      display: flex;
      justify-content: center;
      align-items: flex-start;
      margin: 1rem;
    }

    .no-image {
      height: 6rem;
    }

    .action-mobile-wrapper {
      .action-mobile {
        width: 100%;
        min-height: 6rem;

        .v-btn__content {
          @include h3-18-medium;
          text-transform: uppercase;
        }
      }
    }
  }

  @media #{map-get($display-breakpoints, 'sm-and-up')} {
    .split-screen__wrapper {
      &--right {
        overflow: auto;
        max-height: 100%;
        padding-bottom: 1rem;

        .logo-size {
          max-width: 18rem !important;
          max-height: 6.8rem !important;
        }

        .login-logo {
          margin: 10rem 0 7.5rem 0;
          display: flex;
          align-items: center;

          .login-logo-wrapper {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
        }

        .login-content {
          margin-bottom: 6rem;
        }

        .logo-woop {
          height: fit-content;
        }

        .login-button__wrapper {
          .login-button-wrapper {
            display: flex;
            justify-content: flex-start;
            cursor: pointer;

            button {
              min-height: 6rem;
              padding-left: 5rem !important;
              padding-right: 5rem !important;
            }

            i {
              color: $main-color;
            }
          }
        }
      }

      &--left {
        .login-logo__main {
          width: 100%;
        }
      }
    }
  }
}
</style>
