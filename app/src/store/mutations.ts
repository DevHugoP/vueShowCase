import {
  SET_HAS_STEPPER,
  SET_IS_LOADING_APP,
  SET_HEADER_TITLE,
  SET_HEADER_DATA,
  SET_HAS_LIGHT_LAYOUT,
  SET_HAS_CENTERED_CONTENT,
  SET_BREADCRUMBS_LABEL,
  SET_SNACKBAR_SHOWING,
  SET_SNACKBAR,
  SET_SHOW_LOADER,
} from '@/store/mutation-types'
import { DataMutation, RootState, SnackbarState } from '@/store/types'

const mutationSetIsLoadingApp: DataMutation<RootState, boolean> = (state, loading) => {
  state.isLoadingApp = loading
}

const mutationSetHasStepper: DataMutation<RootState, boolean> = (state, value) => {
  state.hasStepper = value
}

const mutationSetHeaderTitle: DataMutation<RootState, string> = (state, value) => {
  state.headerTitle = value
}

const mutationSetHeaderData: DataMutation<RootState, string> = (state, value) => {
  state.headerData = value
}

const mutationSetHasLightLayout: DataMutation<RootState, boolean> = (state, value) => {
  state.hasLightLayout = value
}

const mutationSetHasCenteredContent: DataMutation<RootState, boolean> = (state, value) => {
  state.hasCenteredContent = value
}

const mutationSetBreadcrumbsLabel: DataMutation<RootState, string> = (state, value) => {
  state.breadcrumbsLabel = value
}

const mutationSetSnackbarShowing: DataMutation<RootState, boolean> = (state, value) => {
  state.snackbar.showing = value
}

const mutationSetSnackbar: DataMutation<RootState, SnackbarState> = (
  state,
  { message, type, timeout, clearable },
) => {
  state.snackbar.type = type
  state.snackbar.message = message
  state.snackbar.timeout = timeout
  state.snackbar.clearable = clearable
}

const mutationSetShowLoader: DataMutation<RootState, boolean> = (state, value) => {
  state.showLoader = value
}

export default {
  [SET_IS_LOADING_APP]: mutationSetIsLoadingApp,
  [SET_HAS_STEPPER]: mutationSetHasStepper,
  [SET_HEADER_TITLE]: mutationSetHeaderTitle,
  [SET_HEADER_DATA]: mutationSetHeaderData,
  [SET_HAS_LIGHT_LAYOUT]: mutationSetHasLightLayout,
  [SET_HAS_CENTERED_CONTENT]: mutationSetHasCenteredContent,
  [SET_BREADCRUMBS_LABEL]: mutationSetBreadcrumbsLabel,
  [SET_SNACKBAR_SHOWING]: mutationSetSnackbarShowing,
  [SET_SNACKBAR]: mutationSetSnackbar,
  [SET_SHOW_LOADER]: mutationSetShowLoader,
}
