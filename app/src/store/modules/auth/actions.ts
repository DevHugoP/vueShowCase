import { LOCAL_STORAGE } from '@/constants'
import { AVAILABLE_LANGUAGES, i18n } from '@/plugins/i18n'
import Repository from '@/services/Repository'
import UserService from '@/services/user/UserService'
import { Action, DataAction } from '@/store/types'
import { AuthTokenKeycloakType, AuthTokenRequest } from '@/types'
import { isAuthenticated } from './getters'
import {
  AUTH_ERROR,
  AUTH_LOGOUT,
  AUTH_PARTNER,
  AUTH_PROVIDER,
  AUTH_RESET_TOKEN,
  AUTH_SUCCESS,
  AUTH_TOKEN_REQUEST,
  AUTH_WAITING_PROVIDER_LOGIN,
  SET_CURRENT_USER_DATA,
} from './mutations-types'
import { AuthState } from './types'

const authLogout = (refreshToken: string) => {
  // Close keycloak session
  return Repository.get(`auth/logout?token=${refreshToken}`)
}

const authKeycloakToken = (login: { username: string; password: string }) => {
  return Repository.post('/auth/login', login)
}

const authKeycloakProviderToken = (code: string, provider: string, language?: string) => {
  return Repository.get(`/auth/provider/${provider}/token`, {
    params: { code, language: language || 'en' },
  })
}

const authTokenRequest: DataAction<AuthState, AuthTokenRequest> = async (
  { commit, dispatch, state },
  tokenRequest,
) => {
  commit(AUTH_TOKEN_REQUEST)
  localStorage.removeItem(LOCAL_STORAGE.WAITING_PROVIDER_LOGIN)

  try {
    let response

    if (tokenRequest.type === AuthTokenKeycloakType) {
      const { code } = tokenRequest
      if (code) {
        let language = navigator.language.toLowerCase()
        const providerId = tokenRequest.provider || state.provider

        if (
          !AVAILABLE_LANGUAGES.includes(language) &&
          !AVAILABLE_LANGUAGES.includes(language.split('-')[0])
        ) {
          language = 'en'
        } else if (
          !AVAILABLE_LANGUAGES.includes(language) &&
          AVAILABLE_LANGUAGES.includes(language.split('-')[0])
        ) {
          language = language.split('-')[0]
        }

        response = await authKeycloakProviderToken(code, providerId, language)
      } else {
        const { username = '', password = '' } = tokenRequest
        response = await authKeycloakToken({ username, password })
        if (response.data.reset_token) {
          const reset_token = response.data.reset_token
          localStorage.setItem(LOCAL_STORAGE.RESET_TOKEN, reset_token)
          commit(AUTH_RESET_TOKEN, { reset_token })
          return
        }
      }
    } else {
      dispatch('auth/authError', 'Unknown token type', { root: true })
      return
    }

    const {
      data: { access_token, provider },
    } = response

    if (!access_token) {
      dispatch('auth/authError', 'Unable to retrieve access_code', { root: true })
      return
    }

    if (tokenRequest.type === AuthTokenKeycloakType) {
      if (provider) {
        localStorage.removeItem(LOCAL_STORAGE.PROVIDER_NAME)
      }
    } else {
      dispatch('auth/authError', 'Unknown token type', { root: true })
      return
    }

    commit(AUTH_SUCCESS)

    await dispatch('auth/fetchUserData', null, { root: true })
  } catch (err) {
    dispatch('auth/authError', err, { root: true })
  }
}

const logout: Action<AuthState> = async ({ commit, dispatch }) => {
  try {
    const refreshToken = localStorage.getItem(LOCAL_STORAGE.REFRESH_TOKEN)

    if (refreshToken) {
      await authLogout(refreshToken)
    }
  } catch (err) {
    dispatch('auth/authError', err, { root: true })
  }

  commit(AUTH_LOGOUT)
  localStorage.removeItem(LOCAL_STORAGE.ACCESS_TOKEN)
  localStorage.removeItem(LOCAL_STORAGE.REFRESH_TOKEN)
  commit(SET_CURRENT_USER_DATA, UserService.buildDefaultCurrentUserEntity())
}

const fetchUserData: Action<AuthState> = async ({ commit }) => {
  if (!isAuthenticated()) {
    return
  }

  const currentUser = await UserService.getCurrent()
  const providers = await UserService.getCurrentUserProviders()
  commit(SET_CURRENT_USER_DATA, { ...currentUser, providers })
  i18n.changeLanguage(currentUser.language)
}

const authWaitingProviderLogin: Action<AuthState> = ({ commit }) => {
  commit(AUTH_WAITING_PROVIDER_LOGIN)
  localStorage.setItem(LOCAL_STORAGE.WAITING_PROVIDER_LOGIN, 'true')
}

const authMustResetPassword: Action<AuthState> = ({ commit }) => {
  commit(AUTH_RESET_TOKEN, { reset_token: '' })
  localStorage.removeItem(LOCAL_STORAGE.RESET_TOKEN)
}

const authSetPartnerName: DataAction<AuthState, string> = ({ commit }, partnerName) => {
  commit(AUTH_PARTNER, partnerName)
  localStorage.setItem(LOCAL_STORAGE.SPECIFIC_PARTNER_LOGIN_CODE, partnerName)
}

const authSetProvider: DataAction<AuthState, string> = ({ commit }, provider) => {
  commit(AUTH_PROVIDER, provider)
  localStorage.setItem(LOCAL_STORAGE.PROVIDER_NAME, provider)
}

const authError: DataAction<AuthState, string> = ({ commit }, error) => {
  commit(AUTH_ERROR, error)
}

export default {
  authSetPartnerName,
  authSetProvider,
  authError,
  authTokenRequest,
  logout,
  fetchUserData,
  authWaitingProviderLogin,
  authMustResetPassword,
}
