import { TYPE_ALERT } from '..'

export type UserAlert = {
  read: boolean
  userId: string
  id: string
  createdAt: Date
  retailerId: string
  retailerName: string
  storeId: string
  storeName: string
  carrierId: string
  carrierName?: string
  orderId: string
  type: TYPE_ALERT
  comment: string
  referenceNumber: string
  externalOrderId: string
  updatedAt: string
  resolved: boolean
}

export type AlertList = {
  today: UserAlert[]
  yesterday: UserAlert[]
  past: UserAlert[]
}

export type UserAlertParams = {
  limit?: number
  offset?: number
  retailerId?: number | null
  carrierIds?: number[]
  storeIds?: number[] | null
  types?: string[]
  read?: boolean
}

export type UpdateUserAlertsParams = {
  ids: string[]
}
