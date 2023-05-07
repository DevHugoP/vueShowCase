import { DateInterval } from '@/types'

export interface DeliveryEntity {
  id: string
  externalDeliveryId: string
  accessToken: string
  status: string
  retailerId: number
  carrierId: number
  orderId: number
  quoteId: number | null
  createdAt: string
  updatedAt: string
  flag: boolean
  billedDistanceKilometer: number | null
  emittedCarbonDioxideGram: number | null
  vehicleType: string | null
  closureDone: boolean
  externalLabelId: string | null
  isOutdated: boolean
  externalReference: string
  trackingPageUrl?: string
  useMultiTracking: boolean
}

export interface DeliveryPackage {
  id: number
  deliveryId: string
  packageId: number
  externalPackageId: string
  createdAt: string
  updatedAt: string
  reference?: string | null
  statusHistory: StatusHistory[]
  carrierId: number
  externalOrderId?: string | null
  referenceNumber?: string | null
}

export interface StatusHistory {
  id: number
  deliveryPackageId: number
  date: string
  status: string
  comment: string
  externalStatus?: string | null
  externalLabel?: string | null
  createdAt?: string | null
  updatedAt?: string | null
}

export interface DeliveryScore {
  comment: Array<{ answer: string; question: string }>
  createdAt: string
  date: string
  deliveryId: string
  id: number
  postalCode: string
  score: Array<{ includedInCarrierScore: boolean; note: number; type: string; question: string }>
  updatedAt: string
}

export interface DriveScore {
  comment: Array<{ answer: string; question: string }>
  createdAt: string
  date: string
  collectId: string
  id: number
  score: Array<{ note: number; type: string; question: string }>
  updatedAt: string
}

export enum FrequencyAvailableNew {
  DEMI = 'HALF_HOUR',
  HOUR = 'ONE_HOUR',
  TWO_HOURS = 'TWO_HOURS',
  THREE_HOURS = 'THREE_HOURS',
  FOUR_HOURS = 'FOUR_HOURS',
  CLOSED = 'CLOSED',
}

export interface DayCapacityNew {
  start: string
  end: string
  capacity: number | null
}

export const getDefaultWorkingScheduleInterval = (): WorkingScheduleInterval => {
  return {
    end: '',
    start: '',
  }
}

export interface WorkingScheduleInterval {
  end: string
  start: string
}

export const getDefaultwWorkingSchedule = (): WorkingSchedule => {
  return {
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
    sunday: [],
  }
}

export interface WorkingSchedule {
  monday?: DateInterval[]
  tuesday?: DateInterval[]
  wednesday?: DateInterval[]
  friday?: DateInterval[]
  thursday?: DateInterval[]
  saturday?: DateInterval[]
  sunday?: DateInterval[]
}

export enum SchedulesConfigType {
  ORDERS_QUANTITY = 'ORDERS_QUANTITY',
  PACKAGES_QUANTITY = 'PACKAGES_QUANTITY',
  PALLETS_QUANTITY = 'PALLETS_QUANTITY',
  TRAYS_QUANTITY = 'TRAYS_QUANTITY',
  OTHER = 'OTHER',
}

export type SchedulesConfigRecord = {
  id: string
  retailerId: number
  exchangePlaceId: number
  carrierId: number
  schedule?: Schedule
  workingSchedule?: WorkingSchedule
  exceptions?: Exceptions[]
  timezone?: string
  type: SchedulesConfigType
}

export type FrequencyNew = ' HALF_HOUR | ONE_HOUR | TWO_HOURS | FOUR_HOURS | CUSTOM '

export type Slot = {
  start: string
  end: string
  capacity: number
}

export type Schedule = {
  slotsFrequency: FrequencyNew
  slots: Record<string, Slot[]>
}

export type Exceptions = {
  date: DateInterval
  slots: Slot[]
}

export type SchedulesConfig = Omit<SchedulesConfigRecord, 'id'>

export type Filter = {
  retailerId?: number
  exchangePlaceId?: string
}

export interface TypicalWeekFrequencyNew {
  type: FrequencyAvailableNew | ''
  planning: WorkingSchedule
}

export interface DeliverySlotsParams {
  fromDate?: string
  toDate: string
  limit?: number
  minRemainingCapacity?: number
  exchangePlaceId: number
  retailerId: number
  carrierId: number
}

export interface DeliverySlotsCreateBooking {
  slot: { start: string; end: string }
  exchangePlaceId: number
  retailerId: number
  carrierIds: number[]
}

export interface DeliverySlot {
  end: string
  remainingCapacity: number
  start: string
  carrierIds?: number[]
}
