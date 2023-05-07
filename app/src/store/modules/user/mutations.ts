import { RulesGroupLight, SelectItem, PermissionContext } from '@/types'
import { UserState, PermissionFormData, GroupsForm, ContextForm, UserFormData } from './types'
import { DataMutation, Mutation } from '@/store/types'
import {
  SET_PERMISSION_GROUPS,
  SET_PERMISSION_GROUPS_ITEMS,
  PUSH_PERMISSION_GROUPS_ID,
  REMOVE_PERMISSION_GROUPS_ID,
  SET_PERMISSION_CONTEXTS,
  SET_CONTEXT_STOREITEMS,
  SET_CONTEXT_EXCHANGEPLACEITEMS,
  SET_CONTEXT_RETAILERITEMS,
  SET_CONTEXT_CARRIERITEMS,
  SET_CONTEXT_VALUE,
  PUSH_PERMISSION,
  REMOVE_PERMISSION,
  SET_PERMISSIONS,
  SET_PERMISSION_BEING_EDITED_INDEX,
  RESET,
  SET_BASIC_USER_INFOS,
} from './mutation-types'

const setBasicUserInfo: DataMutation<UserState, UserFormData> = (state, value) => {
  state.user.firstname = value.firstname
  state.user.lastname = value.lastname
  state.user.email = value.email
  state.user.language = value.language
  state.user.password = value.password
  state.user.passwordConfirmation = value.passwordConfirmation
  state.user.active = value.active
  state.user.local = value.local
  state.user.external = value.external
}

const setPermissionBeingEditedIndex: DataMutation<UserState, number | null> = (state, value) => {
  state.permissionBeingEditedIndex = value
}

const setPermissionGroups: DataMutation<UserState, GroupsForm> = (state, value) => {
  state.permission.groups = value
}

const setPermissionGroupsItems: DataMutation<
  UserState,
  Array<RulesGroupLight & { value: boolean }>
> = (state, value) => {
  state.permission.groups.items = value
}

const setPermissionContexts: DataMutation<UserState, ContextForm[]> = (state, value) => {
  state.permission.contexts = value
}

const setContextStoreItems: DataMutation<UserState, { index: number; value: SelectItem[] }> = (
  state,
  data,
) => {
  const { index, value } = data
  state.permission.contexts[index].storeItems = value
}

const setContextExchangePlaceItems: DataMutation<
  UserState,
  { index: number; value: SelectItem[] }
> = (state, data) => {
  const { index, value } = data
  state.permission.contexts[index].exchangePlaceItems = value
}

const setContextRetailerItems: DataMutation<UserState, { index: number; value: SelectItem[] }> = (
  state,
  data,
) => {
  const { index, value } = data
  state.permission.contexts[index].retailerItems = value
}

const setContextCarrierItems: DataMutation<UserState, { index: number; value: SelectItem[] }> = (
  state,
  data,
) => {
  const { index, value } = data
  state.permission.contexts[index].carrierItems = value
}

const setContextValue: DataMutation<UserState, { index: number; value: PermissionContext }> = (
  state,
  data,
) => {
  const { index, value } = data
  state.permission.contexts[index].value = value
}

const pushPermissionGroupsId: DataMutation<UserState, string> = (state, value) => {
  state.permission.groups.ids.push(value)
}

const removePermissionGroupsId: DataMutation<UserState, string> = (state, value) => {
  const ids = state.permission.groups.ids

  state.permission.groups.ids = ids.filter(x => x !== value)
}

const pushPermission: Mutation<UserState> = state => {
  const { permission } = state
  state.permissions.push({ ...permission })
}

const removePermission: DataMutation<UserState, number> = (state, index) => {
  const permissions = state.permissions

  state.permissions = permissions
    .slice(0, index)
    .concat(permissions.slice(index + 1, permissions.length))
}

const setPermissions: DataMutation<UserState, PermissionFormData[]> = (state, value) => {
  state.permissions = value
}

const reset: Mutation<UserState> = state => {
  state.user = {
    firstname: '',
    lastname: '',
    email: '',
    language: '',
    active: true,
    local: false,
    sendEmail: true,
  }

  state.permissionBeingEditedIndex = null

  state.permission = {
    contexts: [],
    groups: {
      ids: [],
      items: [],
    },
  }

  state.permissions = []
}

export default {
  [SET_BASIC_USER_INFOS]: setBasicUserInfo,
  [SET_PERMISSION_BEING_EDITED_INDEX]: setPermissionBeingEditedIndex,
  [SET_PERMISSION_GROUPS]: setPermissionGroups,
  [SET_PERMISSION_GROUPS_ITEMS]: setPermissionGroupsItems,
  [SET_PERMISSION_CONTEXTS]: setPermissionContexts,
  [SET_CONTEXT_STOREITEMS]: setContextStoreItems,
  [SET_CONTEXT_EXCHANGEPLACEITEMS]: setContextExchangePlaceItems,
  [SET_CONTEXT_RETAILERITEMS]: setContextRetailerItems,
  [SET_CONTEXT_CARRIERITEMS]: setContextCarrierItems,
  [SET_CONTEXT_VALUE]: setContextValue,
  [PUSH_PERMISSION_GROUPS_ID]: pushPermissionGroupsId,
  [REMOVE_PERMISSION_GROUPS_ID]: removePermissionGroupsId,
  [PUSH_PERMISSION]: pushPermission,
  [REMOVE_PERMISSION]: removePermission,
  [SET_PERMISSIONS]: setPermissions,
  [RESET]: reset,
}
