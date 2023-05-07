import { Commit, Dispatch } from 'vuex'

export enum SnackBarType {
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
}

export interface SnackbarState {
  showing?: boolean
  type: SnackBarType
  message: string
  timeout?: number
  clearable?: boolean
}

export interface RootState {
  isLoadingApp: boolean
  hasStepper: boolean
  headerTitle: string
  headerData: string
  hasLightLayout: boolean
  hasCenteredContent: boolean
  breadcrumbsLabel: string
  snackbar: SnackbarState
  showLoader: boolean
}

export type DataAction<S, P> = (
  {
    commit,
    dispatch,
    state,
    rootState,
  }: {
    commit: Commit
    dispatch: Dispatch
    state: S
    rootState: Record<string, any>
  },
  payload: P,
) => void

export type Action<S> = ({
  commit,
  dispatch,
  state,
  rootState,
}: {
  commit: Commit
  dispatch: Dispatch
  state: S
  rootState: Record<string, any>
}) => void

export type DataMutation<S, P> = (state: S, payload: P) => void
export type Mutation<S> = (state: S) => void
