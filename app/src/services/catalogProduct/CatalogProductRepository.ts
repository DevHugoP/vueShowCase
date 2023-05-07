import HttpRepository from '@/services/HttpRepository'
import { CatalogProduct, CatalogProductFilter } from '@/types'

export interface ICatalogProductRepository {
  getAll: (params: CatalogProductFilter) => Promise<{ products: CatalogProduct[] }>
}

export default class CatalogProductRepository extends HttpRepository {}
