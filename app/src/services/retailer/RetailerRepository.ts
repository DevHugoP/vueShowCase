import HttpRepository from '@/services/HttpRepository'
import { AuthInfos, Filters, RetailerEntity } from '@/types'
import { AxiosRequestConfig } from 'axios'
import Repository from '../Repository'

export interface IRetailerRepository {
  getAll: (params: Record<string, any>) => Promise<{ retailers: RetailerEntity[]; count: number }>
  get: (id: number, params?: Record<string, any>) => Promise<{ retailer: RetailerEntity }>
  create: (
    retailer: Record<string, any>,
    options: AxiosRequestConfig,
  ) => Promise<{ retailer: RetailerEntity }>
  update: (
    id: string,
    retailer: Record<string, any>,
    options: AxiosRequestConfig,
  ) => Promise<{ retailer: RetailerEntity }>
  updateFeatures: (
    id: string,
    retailer: Record<string, any>,
  ) => Promise<{ retailer: RetailerEntity }>
  getAuthInfos(retailerCode: string): Promise<AuthInfos | undefined>
  getFilters(params: Record<string, any>): Promise<{ retailers: Filters[] }>
}

export default class RetailerRepository extends HttpRepository {
  async getAuthInfos(retailerCode: string): Promise<AuthInfos | undefined> {
    try {
      const { data } = await Repository.get(`auth/retailer/${retailerCode}`)
      return data
    } catch {
      return undefined
    }
  }

  async getFilters(params: Record<string, any>): Promise<{ retailers: Filters[]; count: number }> {
    const { data } = await Repository.get(`filters${this.endpoint}`, {
      params: this.adaptParams(params),
    })

    return data
  }

  async updateFeatures(
    id: string,
    retailer: Record<string, any>,
  ): Promise<{ retailer: RetailerEntity }> {
    const { data } = await Repository.put(`${this.endpoint}/${id}/features`, retailer)
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
