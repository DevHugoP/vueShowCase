import {
  Address,
  Contact,
  getDefaultAddress,
  getDefaultContact,
  DateInterval,
  WeightingIndexes,
  Week,
} from '@/types'
import { StoreEntity } from './store'

export const getDefaultOpenningHourInterval = (): DateInterval => {
  return {
    end: '',
    start: '',
  }
}

export const getDefaultOpenningHour = (): OpeningHours => {
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

export interface OpeningHours {
  [key: string]: any
  monday?: DateInterval[]
  tuesday?: DateInterval[]
  wednesday?: DateInterval[]
  thursday?: DateInterval[]
  friday?: DateInterval[]
  saturday?: DateInterval[]
  sunday?: DateInterval[]
}

export interface OpeningDay {
  value: Week
  text: string
  disabled: boolean
}

export const getDefaultExchangePlace = (): ExchangePlaceEntity => {
  return {
    id: 0,
    externalPlaceId: '',
    minuteBeforeCutoff: '0',
    name: '',
    type: '',
    active: false,
    retailerId: 0,
    storeId: 0,
    address: { ...getDefaultAddress() },
    openingHours: { ...getDefaultOpenningHour() },
    contacts: [{ ...getDefaultContact() }],
    storeIds: [],
    createdAt: '',
    updatedAt: '',
    timezone: '',
    bookingValidityPeriod: {
      type: 'day',
      validity: {
        value: 1,
        unit: 'hour',
      },
      slots: [],
    },
  }
}

export interface ExchangePlaceEntity {
  id: number
  externalPlaceId: string
  minuteBeforeCutoff: number | string
  name: string
  type: string
  active: boolean
  storeId: number
  address: Address
  openingHours: OpeningHours
  contacts: Contact[]
  storeIds: null | number[]
  createdAt: string
  updatedAt: string
  Store?: StoreEntity
  timezone: string
  schedule?: {
    slots: Record<string, DayCapacity[]>
    slotsFrequency: FrequencyAvailable
  }
  exceptions?: any[]
  retailerId: number
  bookingValidityPeriod?: BookingValidityPeriod
  weightingIndexes?: WeightingIndexes | null
}

export interface BookingValidityPeriod {
  type: string
  validity?: {
    value: number
    unit: string
  }
  slots?: BookingValiditySlot[]
}

export interface BookingValiditySlot {
  id: string
  start: string
  end: string
  validity: {
    value: number
    unit: string
  }
}

export interface CreateExchangePlace {
  externalPlaceId: string
  minuteBeforeCutoff: number | string
  name: string
  type: string
  active: boolean
  address: Address
  openingHours: OpeningHours
  contacts: Contact[]
  storeIds: null | number[]
  timezone: string
  schedule?: {
    slots: Record<string, DayCapacity[]>
    slotsFrequency: FrequencyAvailable
  }
  exceptions?: any[]
}

export interface DayCapacity {
  start: string
  end: string
  capacity: number | null
}

export enum FrequencyAvailable {
  QUARTER = 'QUARTER_HOUR',
  DEMI = 'HALF_HOUR',
  HOUR = 'ONE_HOUR',
  CLOSED = 'CLOSED',
  CUSTOM = 'CUSTOM',
}

export enum CarrierFrequencyAvailable {
  ONE_HOUR = 'ONE_HOUR',
  TWO_HOUR = 'TWO_HOURS',
  THREE_HOUR = 'THREE_HOURS',
  FOUR_HOUR = 'FOUR_HOURS',
  CUSTOM = 'CUSTOM',
}

export enum SubFrequencyAvailable {
  FOUR_HOUR = 'FOUR_HOURS',
  THREE_HOUR = 'THREE_HOURS',
  TWO_HOUR = 'TWO_HOURS',
  ONE_HOUR = 'ONE_HOUR',
  HALF_HOUR = 'HALF_HOUR',
  QUARTER_HOUR = 'QUARTER_HOUR',
}

export interface TypicalWeekFrequency {
  type: FrequencyAvailable | ''
  planning: OpeningHours
}
