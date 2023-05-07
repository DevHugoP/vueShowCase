import { RulesGroupLight, SelectItem } from '@/types'

export enum ContextFormSubject {
  'CARRIER' = 'carrier',
  'RETAILER' = 'retailer',
  'STORE' = 'store',
}

export interface ContextForm {
  subject: ContextFormSubject | string
  value: {
    carrierId: number | null
    retailerId: number | null
    storeIds?: number[] | number | null
  }
  carrierItems: SelectItem[]
  retailerItems: SelectItem[]
  storeItems: SelectItem[]
}

export interface GroupsForm {
  items: Array<RulesGroupLight & { value: boolean }>
  ids: string[]
}

export const getDefaultContextForm = (): ContextForm => ({
  subject: '',
  value: {
    carrierId: null,
    retailerId: null,
    storeIds: null,
  },
  carrierItems: [],
  retailerItems: [],
  storeItems: [],
})

export const getDefaultGroupsForm = (): GroupsForm => ({
  items: [],
  ids: [],
})

export interface PermissionFormData {
  groups: GroupsForm
  contexts: ContextForm[]
}

export interface DashboardState {
  permissionBeingEditedIndex: number | null
  permission: PermissionFormData
  permissions: PermissionFormData[]
}
