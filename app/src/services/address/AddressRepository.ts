import { DetailFilter, AutoCompleteFilter, AddressDescription, Address, Coordinates } from '@/types'
import Repository from '@/services/Repository'
import HttpRepository from '@/services/HttpRepository'

export interface IAddressRepository {
  autoComplete: (params: AutoCompleteFilter) => Promise<{ addresses: AddressDescription[] }>
  getDetail: (params: DetailFilter) => Promise<{ address: Address }>
  getCoordinates: (query: { address: Address }) => Promise<{ coordinates: Coordinates }>
}

export default class AddressRepository extends HttpRepository {
  async autoComplete<T>(params?: Record<string, any>): Promise<T> {
    const { data } = await Repository.get<T>(`${this.endpoint}/autocomplete`, {
      params: this.adaptParams(params),
    })
    return data
  }

  async getDetail<T>(params?: Record<string, any>): Promise<T> {
    const { data } = await Repository.get<T>(`${this.endpoint}/details`, {
      params: this.adaptParams(params),
    })
    return data
  }

  public async getCoordinates(query: { address: Address }): Promise<any> {
    const { data } = await Repository.get(`${this.endpoint}/coordinates`, { params: query })

    return data
  }
}
