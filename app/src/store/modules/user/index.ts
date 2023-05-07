import getters from './getters'
import mutations from './mutations'
import { UserState } from './types'

const state: UserState = {
  user: {
    firstname: '',
    lastname: '',
    email: '',
    language: 'fr',
    password: '',
    passwordConfirmation: '',
    active: true,
    local: false,
    sendEmail: true,
  },
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
