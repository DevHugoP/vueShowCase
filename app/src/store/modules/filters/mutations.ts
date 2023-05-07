import { DataMutation } from '@/store/types'
import { FiltersState } from './types'
import {
  SET_FILTERS,
  SET_ACTIVE_FILTERS,
  ADD_FILTER,
  REMOVE_FILTER,
  SET_IS_PANEL_DISPLAYED,
} from './mutations-types'

const setFilters: DataMutation<FiltersState, Record<string, any>> = (state, value) =>
  (state.filters = value)

const setActiveFilters: DataMutation<FiltersState, number> = (state, value) =>
  (state.activeFilters = value)

const addFilter: DataMutation<FiltersState, { key: string; value: any }> = (
  state,
  { key, value },
) => (state.filters[key] = value)

const removeFilter: DataMutation<FiltersState, string> = (state, key) => delete state.filters[key]

const setIsPanelDisplayed: DataMutation<FiltersState, number | undefined> = (state, value) =>
  (state.isPanelDisplayed = value)

export default {
  [SET_FILTERS]: setFilters,
  [SET_ACTIVE_FILTERS]: setActiveFilters,
  [ADD_FILTER]: addFilter,
  [REMOVE_FILTER]: removeFilter,
  [SET_IS_PANEL_DISPLAYED]: setIsPanelDisplayed,
}
