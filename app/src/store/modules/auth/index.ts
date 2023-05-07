import actions from './actions'
import getters from './getters'
import mutations from './mutations'
import { AuthState } from './types'
import { AuthStatus, LOCAL_STORAGE } from '@/constants'

import UserService from '@/services/user/UserService'

const state: AuthState = {
  status:
    localStorage.getItem(LOCAL_STORAGE.WAITING_PROVIDER_LOGIN) === 'true'
      ? AuthStatus.PENDING
      : AuthStatus.UNKNOWN,
  reset: localStorage.getItem(LOCAL_STORAGE.RESET_TOKEN) || '',
  currentUser: UserService.buildDefaultCurrentUserEntity(),
  specificPartnerLoginCode: localStorage.getItem(LOCAL_STORAGE.SPECIFIC_PARTNER_LOGIN_CODE) || '',
  error: '',
  provider: localStorage.getItem(LOCAL_STORAGE.PROVIDER_NAME) || '',
}

export default {
  state,
  actions,
  getters,
  mutations,
}
