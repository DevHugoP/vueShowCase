import { RulesGroupLight, SelectItem } from '@/types'

export enum ContextFormSubject {
  'CARRIER' = 'carrier',
  'RETAILER' = 'retailer',
  'STORE' = 'store',
  'EXCHANGE_PLACE' = 'exchangePlace',
}

export interface ContextForm {
  subject: ContextFormSubject | string
  value: {
    carrierId: number | null
    retailerId: number | null
    storeIds?: number[] | number
    exchangePlaceIds?: number[]
  }
  carrierItems: SelectItem[]
  retailerItems: SelectItem[]
  storeItems: SelectItem[]
  exchangePlaceItems: SelectItem[]
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
    storeIds: [],
    exchangePlaceIds: [],
  },
  carrierItems: [],
  retailerItems: [],
  storeItems: [],
  exchangePlaceItems: [],
})

export const getDefaultGroupsForm = (): GroupsForm => ({
  items: [],
  ids: [],
})

export interface UserFormData {
  firstname: string
  lastname: string
  email: string
  password?: string
  passwordConfirmation?: string
  active: boolean
  language: string
  local: boolean
  external?: boolean
  sendEmail?: boolean
}

export interface PermissionFormData {
  groups: GroupsForm
  contexts: ContextForm[]
}

export interface UserState {
  user: UserFormData
  permissionBeingEditedIndex: number | null
  permission: PermissionFormData
  permissions: PermissionFormData[]
}
