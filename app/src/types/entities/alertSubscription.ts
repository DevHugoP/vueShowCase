import { Filters } from '..'

export enum TYPE_ALERT {
  UNDER_RATE_SCORE = 'ALERT_UNDER_RATE_SCORE',
  FORBIDDEN_CANCEL_ORDER = 'ALERT_FORBIDDEN_CANCEL_ORDER',
  FORBIDDEN_EDIT_ORDER = 'ALERT_FORBIDDEN_EDIT_ORDER',
  ORDER_TO_BE_COMPLETED = 'ALERT_ORDER_TO_BE_COMPLETED',
  ORDER_WITH_NO_QUOTE = 'ALERT_ORDER_WITH_NO_QUOTE',
  ORDER_WITH_NO_CARRIER_ELIGIBLE = 'ALERT_ORDER_WITH_NO_CARRIER_ELIGIBLE',
  ORDER_WITH_NO_CARRIER_AVAILABLE = 'ALERT_ORDER_WITH_NO_CARRIER_AVAILABLE',
  DELIVERY_PICK_UP_KO = 'ALERT_DELIVERY_PICK_UP_KO',
  DELIVERED_WITH_CLAIM = 'ALERT_DELIVERY_DELIVERED_WITH_CLAIM',
  FAILED_WITH_RETURN = 'ALERT_DELIVERY_FAILED_WITH_RETURN',
  PRODUCT_RETURN = 'ALERT_PRODUCT_RETURN',
  CANCELLED = 'ALERT_DELIVERY_CANCELLED',
  BLOCKED = 'ALERT_DELIVERY_BLOCKED',
  DELAYED = 'ALERT_DELIVERY_DELAYED',
}

export interface DetailAlertRetailer extends Filters {
  stores?: Filters[]
}

export type AlertSubscription = {
  carrierId?: number | null
  createdAt?: Date
  email: boolean
  id?: string
  retailerId?: number | null
  storeId?: number | null
  type: string
  updatedAt?: Date | null
  userId?: string
}

export type AlertSubscriptionFront = {
  userId: string
  retailerId: number | null
  storeIds: number[]
  types: Array<{
    type: string
    email: boolean
    ids: string[]
  }>
}

export type AlertContext = {
  retailerId?: number | null
  carrierId?: number | null
  storeIds?: number[] | null
  retailers?: DetailAlertRetailer[]
}

export type AlertType = {
  name: TYPE_ALERT
  checked: boolean
  email: boolean
}
