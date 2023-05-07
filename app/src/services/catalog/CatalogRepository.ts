import HttpRepository from '@/services/HttpRepository'
import { CatalogEntity, CatalogFilter } from '@/types'
import { AxiosRequestConfig } from 'axios'

export interface ICatalogRepository {
  getAll: (params: CatalogFilter) => Promise<{ catalogs: CatalogEntity[] }>
  create: (
    payload: Record<string, any>,
    options: AxiosRequestConfig,
  ) => Promise<{ catalog: CatalogEntity }>
  update: (
    id: string,
    payload: Record<string, any>,
    options: AxiosRequestConfig,
  ) => Promise<{ catalog: CatalogEntity }>
  delete: (id: string) => Promise<void>
}

export default class CatalogRepository extends HttpRepository {}
