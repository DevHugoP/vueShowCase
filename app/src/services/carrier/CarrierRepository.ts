import HttpRepository from '@/services/HttpRepository'
import { AuthInfos, CarrierEligibilityEntity, CarrierEntity, Filters } from '@/types'
import { AxiosRequestConfig } from 'axios'
import Repository from '../Repository'

export type GetParamsKeys = 'carrierId' | 'retailerId' | 'storeId' | 'exchangePlaceId'

export interface GetCarrierParams {
  carrierId: number | undefined
  retailerId?: number
  storeId?: number
  exchangePlaceId?: number
}

export interface ICarrierRepository {
  getAll: (params: Record<string, any>) => Promise<{ carriers: CarrierEntity[]; count: number }>
  get: (id: number, params?: Record<string, any>) => Promise<{ carrier: CarrierEntity }>
  create: (
    carrier: Record<string, any>,
    options: AxiosRequestConfig,
  ) => Promise<{ carrier: Promise<Partial<CarrierEntity & CarrierEligibilityEntity>> }>
  update: (
    id: string | number,
    carrier: Record<string, any>,
    options: AxiosRequestConfig,
  ) => Promise<{ carrier: Promise<Partial<CarrierEntity & CarrierEligibilityEntity>> }>
  getAuthInfos(carrierCode: string): Promise<AuthInfos | undefined>
  getFilters(params: Record<string, any>): Promise<{ carriers: Filters[] }>
}

export default class CarrierRepository extends HttpRepository {
  async getAuthInfos(carrierCode: string): Promise<AuthInfos | undefined> {
    try {
      const { data } = await Repository.get(`auth/carrier/${carrierCode}`)
      return data
    } catch {
      return undefined
    }
  }

  async getFilters(params: Record<string, any>): Promise<{ carriers: Filters[] }> {
    const { data } = await Repository.get(`filters${this.endpoint}`, {
      params: this.adaptParams(params),
    })
    return data
  }

  async getActiveRetailers(
    id: number,
  ): Promise<{ retailers: Array<{ id: number; code: string; name: string; logo?: string }> }> {
    const { data } = await Repository.get(`carriers/${id}/retailers`)
    return data
  }

  async getSecret(id: string | number): Promise<{ file: any; filename: string; password: string }> {
    const { data: file, headers } = await Repository.get(`${this.endpoint}/${id}/secrets`, {
      responseType: 'arraybuffer',
    })
    const [, filename, password] = headers['content-disposition'].split(';')

    return {
      file,
      filename: filename.split('=')[1],
      password: password.split('=')[1],
    }
  }
}
