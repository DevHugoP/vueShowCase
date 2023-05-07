import { COUNTRY } from '@/constants/shared'
import { CountriesCodeEnum } from '@/constants'
import {
  CarrierEntity,
  CutOff,
  getDefaultCarrier,
  getDefaultExchangePlace,
  getDefaultRetailer,
  PICKUP_POINT_TYPES,
  RetailerEntity,
} from '@/types'
import {
  Address,
  Contact,
  ExchangePlaceEntity,
  getDefaultAddress,
  getDefaultContact,
  StoreEntity,
} from '..'
import { getDefaultStore } from './store'

export const getDefaultSpecifications = (): Specifications => {
  return {
    updateOrder: false,
    cancelOrder: false,
    label: false,
    carrierTracking: false,
    closeDelivery: false,
    quote: false,
  }
}

export const getDefaultCarrierEligibility = (): CarrierEligibilityEntity => {
  return {
    id: 0,
    retailerId: null,
    storeId: null,
    carrierId: null,
    exchangePlaceId: null,
    minKilogramCapacity: 0,
    maxKilogramCapacity: 0,
    minKilometricDistance: 0,
    maxKilometricDistance: 0,
    maxDevelopedDimensions: 0,
    maxHeight: 0,
    packageMinWeight: 0,
    packageMaxWeight: 0,
    minCombinedLength: 0,
    maxCombinedLength: 0,
    minLength: 0,
    maxLength: 0,
    services: [],
    typologies: [],
    trackingPageUrl: '',
    claimUrl: '',
    departments: Object.values(COUNTRY).reduce((acc, country) => {
      // @ts-ignore
      return { ...acc, [country]: Object.values(CountriesCodeEnum).includes(country) ? [] : false }
    }, {}) as Record<string, any>,
    isActive: false,
    storageAvailability: false,
    createdAt: '',
    updatedAt: '',
    Carrier: getDefaultCarrier(),
    Retailer: getDefaultRetailer(),
    Store: getDefaultStore(),
    ExchangePlace: getDefaultExchangePlace(),
    address: getDefaultAddress(),
    contact: getDefaultContact(),
    specifications: getDefaultSpecifications(),
    deliveryPromise: null,
    pickupPoint: null,
    pickupPointTypes: null,
  }
}

export interface Specifications {
  updateOrder: boolean
  cancelOrder: boolean
  label: boolean
  carrierTracking: boolean
  closeDelivery: boolean
  quote: boolean
}

export interface CommitmentEntity {
  name: string
  amount: number
  period: string
  scoreToAdd: number
  attributes?: Record<string, any> | null
}

export type Tag = {
  name: string
  key: string
  value: string
}

export interface CarrierEligibilityEntity {
  id: number
  retailerId?: number | null
  storeId?: number | null
  carrierId?: number | null
  exchangePlaceId?: number | null
  minKilogramCapacity: number | string
  maxKilogramCapacity: number | string
  minKilometricDistance?: number
  maxKilometricDistance?: number
  maxDevelopedDimensions?: number
  maxHeight?: number
  packageMinWeight?: number
  packageMaxWeight?: number
  minCombinedLength?: number
  maxCombinedLength?: number
  maxPackageQuantity?: number
  minLength?: number
  maxLength?: number
  services?: string[]
  typologies?: string[]
  departments?: Record<string, any> | null
  isActive: boolean
  storageAvailability?: boolean
  createdAt: string
  updatedAt: string
  Carrier: CarrierEntity
  Retailer?: Partial<RetailerEntity> | null
  Store?: Partial<StoreEntity> | null
  ExchangePlace?: Partial<ExchangePlaceEntity> | null
  contact: Contact
  deliveryPromise: DeliveryPromise | null
  deliveryNoticePeriod?: DeliveryPromise | null
  minDeliveryTime?: DeliveryPromise | null
  address: Address
  commitments?: Array<Partial<CommitmentEntity>>
  tags?: Tag[]
  claimUrl: string | null
  trackingPageUrl: string | null
  specifications?: Specifications
  pickupPoint?: {
    categories: Record<string, boolean>
  } | null
  pickupPointTypes: PICKUP_POINT_TYPES[] | null
  deliveryCutOffs?: DeliveryCutOffs | null
}

export interface DeliveryCutOffs {
  [key: string]: any
  timezone: string
  sameDay?: CutOff | null
  nextDay?: CutOff | null
}

export interface DeliveryCutOffsPayload {
  deliveryCutOffs: DeliveryCutOffs | null
}

export interface DeliveryPromise {
  value: null | number
  unit: string
}

export interface Zoning {
  country: string
  type: 'include' | 'exclude'
  postalCodes?: string[]
  cityCodes?: string[]
  updatedAt?: string
}

export interface CarrierZoningEligibility {
  carrierId: number
  eligible: boolean
}

export enum EligibilityContext {
  CARRIER = 'carrier',
  RETAILER = 'retailer',
  STORE = 'store',
  EXCHANGE_PLACE = 'exchangePlace',
}

export enum SPECIFICATIONS {
  UPDATE_ORDER = 'updateOrder',
  CANCEL_ORDER = 'cancelOrder',
  LABEL = 'label',
  CARRIER_TRACKING = 'carrierTracking',
  CLOSE_DELIVERY = 'closeDelivery',
  QUOTE = 'quote',
}
