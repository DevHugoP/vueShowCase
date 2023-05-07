import { UserState } from '@/store/modules/user/types'
import { DataMutation, Mutation } from '@/store/types'
import { PermissionContext, RulesGroupLight, SelectItem } from '@/types'
import {
  PUSH_PERMISSION,
  PUSH_PERMISSION_GROUPS_ID,
  REMOVE_PERMISSION,
  REMOVE_PERMISSION_GROUPS_ID,
  RESET,
  SET_CONTEXT_CARRIERITEMS,
  SET_CONTEXT_RETAILERITEMS,
  SET_CONTEXT_STOREITEMS,
  SET_CONTEXT_EXCHANGEPLACEITEMS,
  SET_CONTEXT_VALUE,
  SET_PERMISSIONS,
  SET_PERMISSION_BEING_EDITED_INDEX,
  SET_PERMISSION_CONTEXTS,
  SET_PERMISSION_GROUPS,
  SET_PERMISSION_GROUPS_ITEMS,
} from './mutation-types'
import { ContextForm, DashboardState, GroupsForm, PermissionFormData } from './types'

const setPermissionBeingEditedIndex: DataMutation<DashboardState, number | null> = (
  state,
  value,
) => {
  state.permissionBeingEditedIndex = value
}

const setPermissionGroups: DataMutation<DashboardState, GroupsForm> = (state, value) => {
  state.permission.groups = value
}

const setPermissionGroupsItems: DataMutation<
  DashboardState,
  Array<RulesGroupLight & { value: boolean }>
> = (state, value) => {
  state.permission.groups.items = value
}

const setPermissionContexts: DataMutation<DashboardState, ContextForm[]> = (state, value) => {
  state.permission.contexts = value
}

const setContextStoreItems: DataMutation<DashboardState, { index: number; value: SelectItem[] }> = (
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

const setContextRetailerItems: DataMutation<
  DashboardState,
  { index: number; value: SelectItem[] }
> = (state, data) => {
  const { index, value } = data
  state.permission.contexts[index].retailerItems = value
}

const setContextCarrierItems: DataMutation<
  DashboardState,
  { index: number; value: SelectItem[] }
> = (state, data) => {
  const { index, value } = data
  state.permission.contexts[index].carrierItems = value
}

const setContextValue: DataMutation<DashboardState, { index: number; value: PermissionContext }> = (
  state,
  data,
) => {
  const { index, value } = data
  state.permission.contexts[index].value = value
}

const pushPermissionGroupsId: DataMutation<DashboardState, string> = (state, value) => {
  state.permission.groups.ids.push(value)
}

const removePermissionGroupsId: DataMutation<DashboardState, string> = (state, value) => {
  const ids = state.permission.groups.ids

  state.permission.groups.ids = ids.filter(x => x !== value)
}

const pushPermission: Mutation<DashboardState> = state => {
  const { permission } = state
  state.permissions.push({ ...permission })
}

const removePermission: DataMutation<DashboardState, number> = (state, index) => {
  const permissions = state.permissions

  state.permissions = permissions
    .slice(0, index)
    .concat(permissions.slice(index + 1, permissions.length))
}

const setPermissions: DataMutation<DashboardState, PermissionFormData[]> = (state, value) => {
  state.permissions = value
}

const reset: Mutation<DashboardState> = state => {
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
