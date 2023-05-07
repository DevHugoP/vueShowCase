import { ContextForm, DashboardState, GroupsForm, PermissionFormData } from './types'

const permissionBeingEditedIndex = (state: DashboardState): number | null => {
  return state.permissionBeingEditedIndex
}

const permissionContexts = (state: DashboardState): ContextForm[] => {
  return state.permission.contexts
}

const permissionGroups = (state: DashboardState): GroupsForm | null => {
  return state.permission.groups
}

const permission = (state: DashboardState): PermissionFormData => {
  return state.permission
}

const permissions = (state: DashboardState): PermissionFormData[] => {
  return state.permissions
}

export default {
  permissionBeingEditedIndex,
  permissionContexts,
  permissionGroups,
  permissions,
  permission,
}
