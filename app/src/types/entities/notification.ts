import { FilterByEnum } from '@/types/entities/notificationStates'

export interface NotificationFilter {
  carrierId?: number | number[] | null
  retailerId?: any
  storeId?: any
  exchangePlaceId?: number | number[] | null
  sort?: string
  offset?: number | null
  limit?: number | null
  ids?: number | number[] | null
  event?: any
  channel?: string | null
  isActive?: boolean | null
  language?: string
  isReturn?: boolean
  subEvent?: any
  isCarrierSetAside?: boolean
  filterBy?: FilterByEnum
  target?: string
}

export interface NotificationEntity {
  id: number
  date: string
  type: string
  subject: string
  message: string
  status: boolean
  failReason: string
  orderId: number
  createdAt: string
  updatedAt: string
  sender: string
  toCustomer: boolean
}
