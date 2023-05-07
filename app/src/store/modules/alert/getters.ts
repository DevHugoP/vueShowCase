import { AlertState } from './types'

const paginationLimit = (state: AlertState): number => {
  return state.paginationLimit
}

const unreadAlertsCount = (state: AlertState): number => {
  return state.unreadAlertsCount
}

export default {
  paginationLimit,
  unreadAlertsCount,
}
