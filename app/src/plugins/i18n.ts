import { dateHelper } from '@/helpers/dateHelper'
import resources from '@/locales/fr/translation.json'
import { I18nHelper } from '@meltingpoint/lastmile-internationalization'
import VueI18Next from '@panter/vue-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import Backend from 'i18next-http-backend'
import Vue from 'vue'

Vue.use(VueI18Next)

export const AVAILABLE_LANGUAGES = [
  'fr',
  'en',
  'nl-be',
  'it',
  'es',
  'ca',
  'de',
  'pt',
  'sk',
  'cz',
  'hu',
]

export const TRANSLATED_LANGUAGES: { [key: string]: string } = {
  fr: 'Français',
  en: 'English (UK)',
  'nl-be': 'Vlaams',
  es: 'Español',
  it: 'Italiano',
  ca: 'Català',
  de: 'Deutsche',
  pt: 'Português',
  sk: 'slovenčina',
  cz: 'čeština',
  hu: 'magyar',
}

export const AVAILABLE_LANGUAGES_OBJECT = [
  {
    id: 'fr',
    name: 'Français',
  },
  {
    id: 'en',
    name: 'English (UK)',
  },
  {
    id: 'es',
    name: 'Español',
  },
  {
    id: 'nl-be',
    name: 'Vlaams',
  },
  {
    id: 'it',
    name: 'Italiano',
  },
  {
    id: 'ca',
    name: 'Català',
  },
  {
    id: 'de',
    name: 'Deutsche',
  },
  {
    id: 'pt',
    name: 'Português',
  },
  {
    id: 'sk',
    name: 'slovenčina',
  },
  {
    id: 'cz',
    name: 'čeština',
  },
  {
    id: 'hu',
    name: 'magyar',
  },
]

let i18n: I18nHelper

const getI18nHelper = (configUrl?: string) => {
  if (i18n) {
    return i18n
  }

  const path = '/locales/{{lng}}/{{ns}}.json'
  const url = `${configUrl}${path}`

  i18n = new I18nHelper(
    {
      fallbackLng: 'fr',
      detection: {
        order: [
          'querystring',
          'cookie',
          'localStorage',
          'sessionStorage',
          'navigator',
          'htmlTag',
          'path',
          'subdomain',
        ],
      },
      load: 'currentOnly',
      lowerCaseLng: true,
      backend: {
        crossDomain: true,
        loadPath: url,
        expirationTime: 60 * 60 * 1000,
      },
    },
    [...(configUrl ? [Backend] : []), LanguageDetector],
  )

  setTimeout(() => {
    // Load local if remote translation file failed
    const weblateTranslations = i18n.getResource('fr')
    i18n.addResource({ language: 'fr', resources: { ...resources, ...weblateTranslations } })

    dateHelper.changeLocale(i18n.getLanguageCode())
  }, 1)

  return i18n
}

export const loadI18n = (url: string): VueI18Next => {
  const localI18nHelper = getI18nHelper(url)

  return new VueI18Next(localI18nHelper.getI18next())
}

export { i18n }
