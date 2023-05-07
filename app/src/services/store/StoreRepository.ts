import HttpRepository from '@/services/HttpRepository'
import { Filters, StoreEntity } from '@/types'
import Repository from '../Repository'

export interface IStoreRepository {
  getAll: (params: Record<string, any>) => Promise<{ stores: StoreEntity[] }>
  get: (id: number, params?: Record<string, any>) => Promise<{ store: StoreEntity }>
  update: (id: number | string, payload: Partial<StoreEntity>) => Promise<{ store: StoreEntity }>
  create: (payload: Partial<StoreEntity>) => Promise<{ store: StoreEntity }>
  checkout: (id: string, params: Record<string, any>) => Promise<any>
  getFilters(params: Record<string, any>): Promise<{ stores: Filters[] }>
  updateWeightingIndexes(
    id: number | string,
    payload: Record<string, any>,
  ): Promise<{ store: StoreEntity }>
}

export default class StoreRepository extends HttpRepository {
  async getFilters(params: Record<string, any>): Promise<{ stores: Filters[] }> {
    const { data } = await Repository.get(`filters${this.endpoint}`, {
      params: this.adaptParams(params),
    })
    return data
  }

  async updateWeightingIndexes(id: number | string, payload: Record<string, any>): Promise<any> {
    const { data } = await Repository.patch(`${this.endpoint}/${id}/weightingIndexes`, payload)

    return data
  }
}
