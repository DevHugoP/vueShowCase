import { UserState, UserFormData, PermissionFormData, ContextForm, GroupsForm } from './types'

const user = (state: UserState): UserFormData => {
  return state.user
}

const permissionBeingEditedIndex = (state: UserState): number | null => {
  return state.permissionBeingEditedIndex
}

const permissionContexts = (state: UserState): ContextForm[] => {
  return state.permission.contexts
}

const permissionGroups = (state: UserState): GroupsForm | null => {
  return state.permission.groups
}

const permission = (state: UserState): PermissionFormData => {
  return state.permission
}

const permissions = (state: UserState): PermissionFormData[] => {
  return state.permissions
}

export default {
  user,
  permissionBeingEditedIndex,
  permissionContexts,
  permissionGroups,
  permissions,
  permission,
}
