import { DataAction, SnackbarState } from '@/store/types'
import { RootState } from './types'
import { SET_SNACKBAR, SET_SNACKBAR_SHOWING, SET_IS_LOADING_APP } from './mutation-types'

const setSnackbar: DataAction<RootState, SnackbarState> = (
  { commit },
  { type, message, timeout, clearable },
) => {
  commit(SET_SNACKBAR, { type, message, timeout, clearable })
  commit(SET_SNACKBAR_SHOWING, true)
}

const setAppIsLoading: DataAction<RootState, boolean> = ({ commit }, loading) => {
  commit(SET_IS_LOADING_APP, loading)
}

export default {
  setSnackbar,
  setAppIsLoading,
}
