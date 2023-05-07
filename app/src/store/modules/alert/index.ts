import getters from './getters'
import mutations from './mutations'
import { AlertState } from './types'

const state: AlertState = {
  paginationLimit: 25,
  unreadAlertsCount: 0,
}

export default {
  state,
  getters,
  mutations,
}
