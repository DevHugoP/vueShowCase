import { Checkout, Contact, RetailerEntity, WeightingIndexes } from '@/types'

export const getDefaultStore = (): StoreEntity => {
  return {
    id: 0,
    externalStoreId: '',
    active: false,
    retailerId: 0,
    createdAt: '',
    updatedAt: '',
    name: '',
    contacts: [],
    timezone: '',
    language: '',
  }
}

export interface StoreEntity {
  id: number
  externalStoreId: string
  active: boolean
  retailerId: number
  createdAt: string
  updatedAt: string
  name: string
  contacts: Contact[]
  Retailer?: RetailerEntity
  language?: string
  timezone?: string
  weightingIndexes?: WeightingIndexes | null
  checkout?: Checkout
}

export interface CreateStore {
  externalStoreId: string
  active: boolean
  name: string
  contacts: Contact[]
  language?: string
  timezone?: string
}
