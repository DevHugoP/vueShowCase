import App from '@/App.vue'
import { LOCAL_STORAGE, ROUTES } from '@/constants'
import vuetify from '@/plugins/vuetify'
import router, { redirectToLogin } from '@/router'
import AuthenticationService from '@/services/authentication/AuthenticationService'
import Repository from '@/services/Repository'
import store from '@/store'
import MeltingPointDesignSystem from '@meltingpoint/lastmile-design-system'
import '@meltingpoint/lastmile-design-system/lastmile-design-system.css'
import io from 'socket.io-client'
import Vue from 'vue'
import { VueReCaptcha } from 'vue-recaptcha-v3'
import VueSocketIOExt from 'vue-socket.io-extended'
import Vuelidate from 'vuelidate'
import Config from './config/Config'

Vue.config.productionTip = false

Vue.use(MeltingPointDesignSystem)
Vue.use(Vuelidate)

// Intercept unauthorized request responses
Repository.interceptors.response.use(
  response => {
    const {
      data: { access_token, refresh_token },
    } = response

    if (access_token) {
      localStorage.setItem(LOCAL_STORAGE.ACCESS_TOKEN, access_token)
    }

    if (refresh_token) {
      localStorage.setItem(LOCAL_STORAGE.REFRESH_TOKEN, refresh_token)
    }
    return response
  },
  async error => {
    const { config, response } = error
    const { name, path } = router.currentRoute
    const isRetry = config._retry ?? false

    if (
      response.status === 401 &&
      name !== ROUTES.login &&
      !!localStorage.getItem(LOCAL_STORAGE.REFRESH_TOKEN)
    ) {
      if (!isRetry) {
        const refreshToken = localStorage.getItem(LOCAL_STORAGE.REFRESH_TOKEN)
        localStorage.setItem(LOCAL_STORAGE.REQUESTED_PAGE, path)
        localStorage.removeItem(LOCAL_STORAGE.REFRESH_TOKEN)

        if (refreshToken) {
          // Try to get refresh token
          await AuthenticationService.refresh(refreshToken)

          // Retry original request
          config._retry = true
        }

        return Repository.request(config)
      }

      config._retry = false
      localStorage.setItem(LOCAL_STORAGE.REQUESTED_PAGE, path)
      await store.dispatch('auth/logout')
      redirectToLogin()
      return Promise.reject('Unauthorized')
    }
    return Promise.reject(error)
  },
)

Repository.interceptors.request.use(request => {
  const access_token = localStorage.getItem(LOCAL_STORAGE.ACCESS_TOKEN)

  if (access_token) {
    request.headers.Authorization = `Bearer ${access_token}`
  } else {
    localStorage.removeItem(LOCAL_STORAGE.ACCESS_TOKEN)
  }

  return request
})

Config.load().then(async () => {
  // Change default baseUrl for axios call
  Repository.defaults.baseURL = Config.get('VUE_APP_API_BASE_URL')
  const { loadI18n } = await import('@/plugins/i18n')

  const i18n = loadI18n(Config.get('TRANSLATION_URL'))

  const socket = io(Config.get('VUE_APP_API_BASE_URL'), {
    auth: {
      token: store.getters['auth/token'],
    },
    autoConnect: false,
    transports: ['websocket'],
  })

  Vue.use(VueSocketIOExt, socket, { store })
  Vue.use(VueReCaptcha as any, {
    siteKey: Config.get('GOOGLE_RECAPTCHA_V3'),
    loaderOptions: {
      size: 'invisible',
    },
  })

  new Vue({
    router,
    store,
    vuetify,
    i18n,
    render: h => h(App),
  }).$mount('#app')
})
