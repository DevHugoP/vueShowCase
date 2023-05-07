import { DateInterval } from '@/types'

export type Parcel = {
  id: number
  deliveryId: number
  packageId: number
  status: string
  subStatus?: string
  reference?: string
  externalParcelId: string
  ParcelStatus: ParcelStatus[]
  ParcelEvent: ParcelEvent[]
}

export type ParcelStatus = {
  id: number
  parcelId: number
  type: string
  status: string
  subStatus?: string
  externalStatus?: string
  date: string
  comment?: string
  appointment?: DateInterval
}

export type ParcelEvent = {
  id: number
  parcelId: number
  type: string
  date: string
  event: Event
}

export type Event = {
  comment?: string
  date: string
  author: object
  transmitter: string
  origin: string
  externalStatus: string
  subStatus: string
  appointment?: DateInterval
}
