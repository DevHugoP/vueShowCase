import { rules } from '@/constants'

// Create type of all sub rules
type valueof<T> = T[keyof T]
export type RulesKey = valueof<typeof rules>[number]

export interface PermissionContext {
  carrierId: number | null
  retailerId: number | null
  storeIds?: number[] | number
  exchangePlaceIds?: number[]
}

export interface CurrentContext {
  carrierId?: number | null
  retailerId?: number | null
  storeId?: number | null
  exchangePlaceId?: number | null
}

export interface PermissionRules {
  contexts: PermissionContext[]
  rules: RulesKey[]
}

export interface PermissionEntityNotCreated {
  contexts: PermissionContext[]
  rulesGroups: RulesGroupLight[]
}

export type PermissionEntity = PermissionEntityNotCreated & {
  id: string
  userId: string
  createdAt: Date | string
  updatedAt: Date | string | null
}

export interface RulesGroupLight {
  id: string
  name: string
}

export interface UserProvider {
  id: string
  local: boolean
  userId: string
  password?: null
  provider: string
  createdAt: string
  externalId: string
  resetPassword: boolean
  lastConnection: Date | string | null
}

export type RulesGroupEntity = RulesGroupLight & {
  rules: RulesKey[]
  createdAt: Date | string
  updatedAt: Date | string | null
}

interface BaseUser {
  id: string
  firstname: string
  lastname: string
  email: string
  active: boolean
  language: string
}

export type CurrentUserEntity = BaseUser & {
  permissions: PermissionRules[]
}

export type UserEntity = BaseUser & {
  carrierIds?: number[]
  retailerIds?: number[]
  createdAt: Date | string
  updatedAt: Date | string | null
  lastConnection?: Date | string | null
  groups?: string[]
  local?: boolean
  external?: boolean
  providers?: UserProvider[]
}

export interface UsersFilters {
  name: string
  email: string
  carrierId?: string
  retailerId?: string
  storeId?: string
  rulesGroupId?: string
  inModeration?: boolean
  active?: boolean
}
