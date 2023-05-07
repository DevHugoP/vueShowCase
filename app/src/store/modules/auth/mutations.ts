import { AuthStatus } from '@/constants'
import { CurrentUserEntity } from '@/types'

import { Mutation, DataMutation } from '@/store/types'
import {
  AUTH_RESET_TOKEN,
  AUTH_TOKEN_REQUEST,
  AUTH_WAITING_PROVIDER_LOGIN,
  AUTH_SUCCESS,
  AUTH_PROVIDER,
  AUTH_ERROR,
  AUTH_LOGOUT,
  SET_CURRENT_USER_DATA,
  AUTH_PARTNER,
} from './mutations-types'
import { AuthState } from './types'

const mutationAuthTokenRequest: Mutation<AuthState> = state => {
  state.status = AuthStatus.PENDING
}

const mutationAuthProvider: DataMutation<AuthState, { provider: string }> = (state, auth) => {
  state.provider = auth.provider
}

const mutationAuthPartner: DataMutation<AuthState, { partnerName: string }> = (state, auth) => {
  state.specificPartnerLoginCode = auth.partnerName
}

const mutationAuthResetToken: DataMutation<AuthState, { reset_token: string }> = (state, auth) => {
  state.reset = auth.reset_token
}

const mutationAuthSuccess: DataMutation<AuthState, string> = state => {
  state.status = AuthStatus.SUCCESS
}

const mutationAuthError: DataMutation<AuthState, string> = (state, error) => {
  state.status = AuthStatus.ERROR
  state.error = error
}

const mutationLogout: Mutation<AuthState> = state => {
  state.status = AuthStatus.UNKNOWN
}

const mutationSetCurrentUserData: DataMutation<AuthState, CurrentUserEntity> = (state, data) => {
  state.currentUser = { ...data }
}

const mutationAuthWaitingProviderLogin: Mutation<AuthState> = state => {
  state.status = AuthStatus.PENDING
}

export default {
  [AUTH_TOKEN_REQUEST]: mutationAuthTokenRequest,
  [AUTH_WAITING_PROVIDER_LOGIN]: mutationAuthWaitingProviderLogin,
  [AUTH_SUCCESS]: mutationAuthSuccess,
  [AUTH_RESET_TOKEN]: mutationAuthResetToken,
  [AUTH_PROVIDER]: mutationAuthProvider,
  [AUTH_PARTNER]: mutationAuthPartner,
  [AUTH_ERROR]: mutationAuthError,
  [AUTH_LOGOUT]: mutationLogout,
  [SET_CURRENT_USER_DATA]: mutationSetCurrentUserData,
}
