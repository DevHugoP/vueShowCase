import { Checkout, Contact, StoreEntity, Unit } from '@/types'

export const getDefaultWeightingIndexes = (): WeightingIndexes => {
  return {
    price: '',
    environment: '',
    quality: {
      value: '',
      detail: {
        satisfaction: '',
        nps: '',
        onTimeDeliveryScore: '',
      },
    },
  }
}

interface Quality {
  value: number | string
  detail: {
    satisfaction: number | string
    nps: number | string
    onTimeDeliveryScore: number | string
  }
}

export interface WeightingIndexes {
  price: string | number
  environment: string | number
  quality: Quality
}

export const getDefaultAdministration = (): Administration => {
  return {
    url: '',
    mentions: '',
  }
}

export interface Administration {
  url?: string
  mentions?: string
}

export const getDefaultSteps = (): Steps => {
  return {
    STEP_ORDER: false,
    STEP_PACKAGES: false,
    STEP_SERVICES: false,
    STEP_PICKING_RANGE: false,
    STEP_DELIVERY_RANGE: false,
    STEP_PICKING_ADDRESS: false,
    STEP_DELIVERY_ADDRESS: false,
    STEP_DELIVERY_CONTACT: false,
  }
}

export interface Steps {
  STEP_ORDER: boolean
  STEP_PACKAGES: boolean
  STEP_SERVICES: boolean
  STEP_PICKING_RANGE: boolean
  STEP_DELIVERY_RANGE: boolean
  STEP_PICKING_ADDRESS: boolean
  STEP_DELIVERY_ADDRESS: boolean
  STEP_DELIVERY_CONTACT: boolean
}

export const getDefaultIdConfig = (): IdConfig => {
  return {
    prefix: '',
    suffix: '',
    generate: false,
  }
}

export interface IdConfig {
  prefix: string
  suffix: string
  generate: boolean
}

export const getDefaultCount = (): Count => {
  return {
    active: 0,
    all: 0,
  }
}

export interface Count {
  active: number
  all: number
}

export const getDefaultRetailer = (): RetailerEntity => {
  return {
    id: 0,
    name: '',
    logo: '',
    countries: [],
    externalRetailerId: '',
    administration: getDefaultAdministration(),
    weightingIndexes: getDefaultWeightingIndexes(),
    createdAt: '',
    updatedAt: '',
    apiClientId: '',
    authProviderId: '',
    brandColor: '',
    smsSendingName: '',
    orderCreationSteps: getDefaultSteps(),
    contacts: [],
    orderIdConfig: getDefaultIdConfig(),
    code: '',
    Store: [],
    count: getDefaultCount(),
    packagesDimensions: [],
    passwordLess: false,
  }
}

export interface PackagesDimensions {
  label: string
  dimension: Dimension
}

export interface Dimension {
  width: Unit
  height: Unit
  length: Unit
}

export interface RetailerEntity {
  id: number
  name: string
  logo: string | null
  countries: string[] | null
  externalRetailerId: string
  administration: Administration
  weightingIndexes: WeightingIndexes
  createdAt: string
  updatedAt: string
  apiClientId: string
  authProviderId: string
  brandColor: string
  smsSendingName: string
  orderCreationSteps: Steps
  contacts: Contact[]
  orderIdConfig: IdConfig
  code: string
  Store?: StoreEntity[]
  count?: Count
  packagesDimensions: PackagesDimensions[]
  passwordLess: boolean
  checkout?: Checkout
}

export interface CreateRetailer {
  name: string
  logo?: string
  countries?: string[]
  externalRetailerId: string
  administration: Administration
  weightingIndexes: WeightingIndexes
  authProviderId: string
  brandColor: string
  smsSendingName: string
  contacts: Contact[]
  orderIdConfig: IdConfig
  packagesDimensions?: PackagesDimensions[]
  apiFeatures?: string[]
  passwordLess: boolean
}

export enum ORDER_GENERATION {
  AUTOMATIC = 'AUTOMATIC',
  MANUAL = 'MANUAL',
}

export enum ORDER_GENERATION_PREFIX_SUFFIX {
  STORE_ID = 'STORE_ID',
  STORE_NAME = 'STORE_NAME',
  DAY_DATE = 'DAY_DATE',
}
