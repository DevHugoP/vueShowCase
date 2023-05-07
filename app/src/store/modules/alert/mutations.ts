import { DataMutation } from '@/store/types'
import {
  DECREMENT_UNREAD_ALERTS_COUNT,
  INCREMENT_UNREAD_ALERTS_COUNT,
  SET_PAGINATION_LIMIT,
  SET_UNREAD_ALERTS_COUNT,
} from './mutations-types'
import { AlertState } from './types'

const setPaginationLimit: DataMutation<AlertState, number> = (state, value) => {
  state.paginationLimit = value
}

const setUnreadAlertsCount: DataMutation<AlertState, number> = (state, value) => {
  state.unreadAlertsCount = value
}

const incrementUnreadAlertsCount: DataMutation<AlertState, number> = state => {
  state.unreadAlertsCount++
}

const decrementUnreadAlertsCount: DataMutation<AlertState, number> = state => {
  state.unreadAlertsCount--
}

export default {
  [SET_PAGINATION_LIMIT]: setPaginationLimit,
  [SET_UNREAD_ALERTS_COUNT]: setUnreadAlertsCount,
  [INCREMENT_UNREAD_ALERTS_COUNT]: incrementUnreadAlertsCount,
  [DECREMENT_UNREAD_ALERTS_COUNT]: decrementUnreadAlertsCount,
}
