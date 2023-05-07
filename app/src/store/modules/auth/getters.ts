import { AuthStatus, LOCAL_STORAGE } from '@/constants'
import { CurrentUserEntity } from '@/types'
import { AuthState } from './types'

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem(LOCAL_STORAGE.ACCESS_TOKEN)
}

export const mustResetPassword = (state: AuthState): boolean => {
  return !!state.reset
}

const status = (state: AuthState): AuthStatus => {
  return state.status
}

const provider = (state: AuthState): string => {
  return state.provider
}

const isPending = (state: AuthState): boolean => {
  return state.status === AuthStatus.PENDING
}

const isError = (state: AuthState): boolean => {
  return state.status === AuthStatus.ERROR
}

const getError = (state: AuthState): string => {
  return state.error
}

const isSuccess = (state: AuthState): boolean => {
  return state.status === AuthStatus.SUCCESS
}

const reset = (state: AuthState): string => {
  return state.reset
}

const specificPartnerLoginCode = (state: AuthState): string => {
  return state.specificPartnerLoginCode
}

const currentUser = (state: AuthState): CurrentUserEntity => {
  return state.currentUser
}

export default {
  isAuthenticated,
  mustResetPassword,
  status,
  provider,
  isPending,
  isError,
  isSuccess,
  reset,
  specificPartnerLoginCode,
  currentUser,
  getError,
}
