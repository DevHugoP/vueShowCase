import getters from './getters'
import mutations from './mutations'
import { DashboardState } from './types'

const state: DashboardState = {
  permissionBeingEditedIndex: null,
  permission: {
    contexts: [],
    groups: {
      ids: [],
      items: [],
    },
  },
  permissions: [],
}

export default {
  state,
  getters,
  mutations,
}
