import {
  Address,
  CarrierEligibilityEntity,
  Contact,
  ExchangePlaceEntity,
  Checkout,
  PickingInformations,
  PackageEntity,
  PickupPoint,
  AvailablePackageSizeType,
  RetailerEntity,
} from '@/types'
import { CreateOrderArrivalType } from './arrival/types'

export const defaultCreateOrderNewStateOrder = (): CreateOrderNewStateOrder => {
  return { id: null, tags: null }
}
export interface CreateOrderNewStateOrder {
  id?: number | null
  tags?: Array<Record<string, any>> | null
}

export const defaultCreateOrderStateMiscellaneous = (): CreateOrderStateMiscellaneous => {
  return {
    stores: [],
    retailers: [],
    deliveryExchangePlace: null,
    errorMessages: [],
    checkout: null,
    isErrorMode: false,
    totalErrors: 0,
    totalErrorsLeft: 0,
    lastEligibilityError: '',
    hasDepartureContactAlreadyBeenSet: false,
    hasDeliveryContactAlreadyBeenSet: false,
    saveAddress: {
      departure: {
        address: null,
        contact: null,
      },
      arrival: {
        address: null,
        contact: null,
      },
    },
    exchangePlaces: [],
    retailerName: '',
    storeName: '',
    availableAddresses: [],
    availablesPackageSize: [],
    selectedCarrierIds: [],
    deliveryDateTypeToDisplay: '',
    deliveryTypeRadioType: '',
    carrierWithoutTypicalWeek: [],
    eligibilitiesParams: '',
    retailer: null,
    checkShippingDateToNow: false,
  }
}

export interface CreateOrderStateMiscellaneous {
  stores: Array<{ id: number; name: string }>
  retailers: Array<{ id: number; name: string }>
  deliveryExchangePlace: ExchangePlaceEntity | null
  errorMessages: string[]
  checkout: Checkout | null
  isErrorMode: boolean
  totalErrors: number
  totalErrorsLeft: number
  lastEligibilityError: string
  hasDepartureContactAlreadyBeenSet: boolean
  hasDeliveryContactAlreadyBeenSet: boolean
  saveAddress: {
    [key: string]: {
      address: Address | null
      contact: Contact | null
      newContact?: Contact
    }
    departure: {
      address: Address | null
      contact: Contact | null
      newContact?: Contact
    }
    arrival: {
      address: Address | null
      contact: Contact | null
      newContact?: Contact
    }
  }
  exchangePlaces: Array<{ name: string; id: number }>
  retailerName: string
  storeName: string
  availableAddresses: Address[]
  availablesPackageSize: AvailablePackageSizeType[]
  selectedCarrierIds: number[]
  deliveryDateTypeToDisplay: string
  deliveryTypeRadioType: string
  carrierWithoutTypicalWeek: number[]
  eligibilitiesParams: string
  retailer: RetailerEntity | null
  checkShippingDateToNow: boolean
}

export const defaultCreateOrderStateEligibility = (): CreateOrderStateEligibility => {
  return {
    unfilteredCarriers: [],
    filteredCarriers: [],
    exchangePlace: null,
    errorMessage: '',
    cache: {},
  }
}

export interface CreateOrderStateEligibility {
  unfilteredCarriers: CarrierEligibilityEntity[]
  filteredCarriers: CarrierEligibilityEntity[]
  exchangePlace: ExchangePlaceEntity | null
  errorMessage: string
  cache: Record<string, any>
}

export interface CreateOrderState {
  // [key: string]: any
  order: CreateOrderNewStateOrder
  miscellaneous: CreateOrderStateMiscellaneous
  eligibility: CreateOrderStateEligibility
}

export interface CreateOrderEntity {
  [key: string]: any
  externalOrderId: string
  retailerId: number | null
  storeId: number | null
  picking: PickingInformations
  delivery: PickingInformations
  packages: PackageEntity[]
  services: string[]
  tags?: Array<{ key: string; value: string }>
  id?: number
  deliveryType: CreateOrderArrivalType | null
  pickupPoint: PickupPoint | null
}

export interface ShippingChoices {
  label: string
  value: string
  icon: string
  optionChoices?: OptionChoices[]
}

export interface OptionChoices {
  label: string
  value: string
  isSelected: boolean
  isDisabled?: boolean
}

export interface TicketContent {
  delivery: {
    contact: Contact
    addresses: Address[]
  }
  packages: PackageEntity[]
}

export enum displayType {
  SLOT = 'SLOT',
  DEFAULT = 'DEFAULT',
  MIXED = 'MIXED',
}

export enum displayRadioType {
  CUSTOM = 'custom',
  DEFAULT = 'default',
}
