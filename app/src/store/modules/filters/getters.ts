import { FiltersState } from './types'

const filters = (state: FiltersState): Record<string, any> => state.filters
const activeFilters = (state: FiltersState): number => state.activeFilters
const isPanelDisplayed = (state: FiltersState): number | undefined => state.isPanelDisplayed

export default { filters, activeFilters, isPanelDisplayed }
