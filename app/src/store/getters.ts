import { RootState, SnackbarState } from '@/store/types'

const isLoadingApp = (state: RootState): boolean => {
  return state.isLoadingApp
}

const hasStepper = (state: RootState): boolean => {
  return state.hasStepper
}

const getHeaderTitle = (state: RootState): string => {
  if (state.headerData) {
    return `${state.headerTitle} ${state.headerData}`
  }
  return state.headerTitle
}

const getHeaderData = (state: RootState): string => {
  return state.headerData
}

const hasLightLayout = (state: RootState): boolean => {
  return state.hasLightLayout
}

const hasCenteredContent = (state: RootState): boolean => {
  return state.hasCenteredContent
}

const getBreadcrumbsLabel = (state: RootState): string => {
  return state.breadcrumbsLabel
}

const snackbar = (state: RootState): SnackbarState => {
  return state.snackbar
}

const showLoader = (state: RootState): boolean => {
  return state.showLoader
}

export default {
  hasStepper,
  isLoadingApp,
  getHeaderTitle,
  getHeaderData,
  hasLightLayout,
  hasCenteredContent,
  getBreadcrumbsLabel,
  snackbar,
  showLoader,
}
