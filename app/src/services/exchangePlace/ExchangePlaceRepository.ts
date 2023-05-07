import { Filters } from '@/types'
import HttpRepository from '../HttpRepository'
import Repository from '../Repository'

export interface IExchangePlaceRepository {
  getAll: (params: Record<string, any>) => Promise<Record<string, any>>
  get: (id: number) => Promise<Record<string, any>>
  create: (exchangePlace: Record<string, any>) => Promise<Record<string, any>>
  update: (id: string | number, exchangePlace: Record<string, any>) => Promise<Record<string, any>>
  getFilters: (params: Record<string, any>) => Promise<{ exchangePlaces: Filters[] }>
  updateWeightingIndexes(
    id: number | string,
    payload: Record<string, any>,
  ): Promise<Record<string, any>>
}

export default class ExchangePlaceRepository extends HttpRepository {
  async getFilters(params: Record<string, any>): Promise<{ exchangePlaces: Filters[] }> {
    const { data } = await Repository.get(`filters${this.endpoint}`, {
      params: this.adaptParams(params),
    })
    return data
  }

  async updateExceptions(
    id: string | number,
    payload: Record<string, any>,
  ): Promise<Record<string, any>> {
    const { data } = await Repository.patch(`${this.endpoint}/${id}/exceptions`, payload)

    return data
  }

  async updateSchedules(
    id: string | number,
    payload: Record<string, any>,
  ): Promise<Record<string, any>> {
    const { data } = await Repository.patch(`${this.endpoint}/${id}/schedules`, payload)

    return data
  }

  async updateValidityPeriod(
    id: string | number,
    payload: Record<string, any>,
  ): Promise<Record<string, any>> {
    const { data } = await Repository.put(`${this.endpoint}/${id}/validityPeriods`, payload)

    return data
  }

  async updateWeightingIndexes(
    id: number | string,
    payload: Record<string, any>,
  ): Promise<Record<string, any>> {
    const { data } = await Repository.patch(`${this.endpoint}/${id}/weightingIndexes`, payload)

    return data
  }
}
