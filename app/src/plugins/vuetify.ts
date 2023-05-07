import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import { Plugin } from 'vue-fragment'
import FlagIcon from 'vue-flag-icon'

import fr from 'vuetify/es5/locale/fr'

export default new Vuetify({
  theme: {
    options: {
      customProperties: true,
    },
    themes: {
      light: {
        // vuetify properties
        primary: '#FFE000',
        error: '#FF4D4D',

        anchor: '#272833',

        // custom properties
        primaryActiveColor: '#BAA61B',
        primaryHoverColor: '#F2D60D',
        primaryDisabledColor: '#FFEE75',
        primaryLightColor: '#FFF4A8',

        aphroditeColor: '#AA47FF',
        athenaColor: '#FD99FF',

        infoColor: '#0053FF',
        infoActiveColor: '#0039AE',
        infoHoverColor: '#004BE5',
        infoDisabledColor: '#75A2FF',
        infoLightColor: '#E5EEFF',

        successColor: '#2CD2AD',
        successActiveColor: '#1A9E80',
        successHoverColor: '#22C9A4',
        successDisabledColor: '#89EFD8',
        successLightColor: '#CFF7EE',

        errorColor: '#FF4D4D',
        errorActiveColor: '#E60000',
        errorHoverColor: '#FF1A1A',
        errorDisabledColor: '#FFC2C2',
        errorLightColor: '#FFC2C2',

        alertColor: '#FFA800',
        alertActiveColor: '#DB9000',
        alertHoverColor: '#F5A200',
        alertDisabledColor: '#FFD686',
        alertLightColor: '#FFEAC0',

        mainColor: '#272833',
        mainLighten4Color: '#30313F',
        mainLighten8Color: '#393A4A',
        mainLighten28Color: '#656784',
        mainLighten52Color: '#9A9CB0',
        mainLighten65Color: '#CDCED9',
        mainLighten74Color: '#E7E7ED',
        mainLighten80Color: '#F8F8FA',
        white: '#FFFFFF',
      },
    },
  },
  lang: {
    locales: { fr },
    current: 'fr',
  },
})

Vue.use(Vuetify)
Vue.use(FlagIcon)
Vue.use(Plugin)
