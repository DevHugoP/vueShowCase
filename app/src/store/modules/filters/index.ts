import getters from './getters'
import mutations from './mutations'
import { FiltersState } from './types'

const state: FiltersState = {
  filters: {},
  activeFilters: 0,
  isPanelDisplayed: undefined,
}

export default {
  state,
  getters,
  mutations,
}
