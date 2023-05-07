export const getDefaultCarrier = (): CarrierEntity => {
  return {
    id: 0,
    name: '',
    logo: null,
    apiClientId: '',
    passwordLess: false,
    createdAt: '',
    updatedAt: '',
    isInitialized: false,
    siret: '',
    isLabeled: false,
    isNew: false,
    isPrivate: true,
    description: {},
    code: '',
  }
}

export interface CarrierEntity {
  id: number
  name: string
  logo: string | File | null
  apiClientId: string
  authProviderId?: string | null
  createdAt: string
  updatedAt: string
  isInitialized: boolean
  siret: string | null
  code?: string
  passwordLess?: boolean
  description?: Record<string, any>
  isPrivate?: boolean
  isNew?: boolean
  ecologyType?: ECOLOGY_TYPE
  isLabeled: boolean
  status?: INTEGRATION_STATUS
  models?: MODELS[] | null
  plus?: Record<string, any>
  logistics?: LOGISTICS[] | null
  characteristics?: CHARACTERISTICS[] | null
  processes?: PROCESSES[] | null
  promises?: PROMISES[] | null
  vehicleTypes?: string[] | null
}

export interface CreateCarrier {
  name: string
  code?: string
  logo?: string
  passwordLess?: boolean
  siret: string | null
  description?: Record<string, any>
  isPrivate?: boolean
  isNew?: boolean
  ecologyType?: ECOLOGY_TYPE
  isLabeled: boolean
  status?: INTEGRATION_STATUS
  models?: MODELS[]
  plus?: Record<string, any>
  logistics?: LOGISTICS[]
  characteristics?: CHARACTERISTICS[]
  processes?: PROCESSES[]
}

export enum MODELS {
  ALL = 'ALL',
  LOCAL = 'LOCAL',
  NATIONAL = 'NATIONAL',
  INTERNATIONAL = 'INTERNATIONAL',
  RELAY = 'RELAY',
  MODEL = 'MODEL',
  DELIVERY = 'DELIVERY',
  TOUR = 'TOUR',
  STORE = 'STORE',
  WAREHOUSE = 'WAREHOUSE',
}

export enum ECOLOGY_TYPE {
  FULL = 'FULL',
  PARTIAL = 'PARTIAL',
  NONE = 'NONE',
}

export enum INTEGRATION_STATUS {
  STUDY = 'STUDY',
  IN_PROGRESS = 'IN_PROGRESS',
  INTEGRATED = 'INTEGRATED',
}

export enum LOGISTICS {
  PREPARATION = 'PREPARATION',
  PACKAGING = 'PACKAGING',
  SORTING = 'SORTING',
  CROSSDOCK = 'CROSSDOCK',
}

export enum CHARACTERISTICS {
  REAL_TIME_STATUS = 'REAL_TIME_STATUS',
  CARRIER_TRACKING = 'CARRIER_TRACKING',
  BEST_PRACTICES = 'BEST_PRACTICES',
  API_IMPLEMENTATION = 'API_IMPLEMENTATION',
}

export enum PROCESSES {
  PICTURE = 'PICTURE',
  SIGNATURE = 'SIGNATURE',
  CALL_STORE = 'CALL_STORE',
  CALL_CLIENT = 'CALL_CLIENT',
}

export enum PROMISES {
  SCHEDULED = 'SCHEDULED',
  STANDARD = 'STANDARD',
  SAME_DAY = 'SAME_DAY',
  NEXT_DAY = 'NEXT_DAY',
}

export enum PICKUP_POINT_TYPES {
  AGENCY = 'PICKUP_POINT_AGENCY',
  POST_OFFICE = 'PICKUP_POINT_POST_OFFICE',
  RELAY_WITH_LOCKER = 'PICKUP_POINT_RELAY_WITH_LOCKER',
  RELAY_WITHOUT_LOCKER = 'PICKUP_POINT_RELAY_WITHOUT_LOCKER',
  DRIVE = 'PICKUP_POINT_DRIVE',
}
