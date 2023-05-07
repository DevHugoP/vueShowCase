interface BaseDashboard {
  id: string
  name: string
  metabaseId: number
  active: boolean
}

export interface DashboardResult {
  id: string
  url: string
  name: string
}

export interface DashboardFilters {
  carrierIds?: number[]
  retailerIds?: number[]
  storeIds?: number[]
}

export interface SharedWith {
  id: string
  email: string
  userId: string
}

export type DashboardFormEntry = Omit<BaseDashboard, 'id'>

export type DashboardEntity = BaseDashboard
