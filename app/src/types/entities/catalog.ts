import { Unit } from '@/types'

export interface CatalogEntity {
  outdated: boolean
  isAlerted: boolean
  retailerId: number
  updateReminderInterval: number
  title: string
  outdatedAt: string
  createdAt: string
  updatedAt: string
  id: string
  productsCount: number
}

export interface CatalogFilter {
  retailerId?: number
  outdated?: boolean
}

export interface CatalogProductFilter {
  retailerId: number
  ean?: string
  cug?: string
  label?: string
}

export type CatalogProduct = {
  [key: string]: string | Unit | undefined | null
  ean: string | null
  cug: string | null
  label: string | null
  length?: Unit | null
  width?: Unit | null
  height?: Unit | null
  weight?: Unit | null
}
