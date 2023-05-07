import HttpRepository from '@/services/HttpRepository'
import Repository from '@/services/Repository'
import { SubscriptionEntity } from '@/types'
import { AxiosResponse } from 'axios'

export interface ISubscriptionRepository {
  getByCarrierId: (
    id: number | string,
    params?: Record<string, any>,
  ) => Promise<{ subscription: SubscriptionEntity }>
  getByRetailerId: (
    id: number | string,
    params?: Record<string, any>,
  ) => Promise<{ subscription: SubscriptionEntity }>
  updateByCarrierId: (
    id: number | string,
    retailerId: number | string,
    subscription: Partial<SubscriptionEntity>,
  ) => Promise<AxiosResponse>
  updateByRetailerId: (
    id: number | string,
    retailerId: number | string,
    subscription: Partial<SubscriptionEntity>,
  ) => Promise<AxiosResponse>
  createByCarrierId: (
    retailerId: number | string,
    subscription: Partial<SubscriptionEntity>,
  ) => Promise<AxiosResponse>
  createByRetailerId: (
    retailerId: number | string,
    subscription: Partial<SubscriptionEntity>,
  ) => Promise<AxiosResponse>
}

export default class SubscriptionRepository extends HttpRepository {
  async getByCarrierId(id: number | string): Promise<SubscriptionEntity> {
    const { data } = await Repository.get(`${this.endpoint}/carriers/${id}`)
    return data
  }

  async getByRetailerId(id: number | string): Promise<SubscriptionEntity> {
    const { data } = await Repository.get(`${this.endpoint}/retailers/${id}`)
    return data
  }

  async updateByCarrierId(
    id: number | string,
    carrierId: number | string,
    subscription: Partial<SubscriptionEntity>,
  ): Promise<SubscriptionEntity> {
    const { data } = await Repository.put(
      `${this.endpoint}/${id}/carriers/${carrierId}`,
      subscription,
    )
    return data
  }

  async updateByRetailerId(
    id: number | string,
    retailerId: number | string,
    subscription: Partial<SubscriptionEntity>,
  ): Promise<SubscriptionEntity> {
    const { data } = await Repository.put(
      `${this.endpoint}/${id}/retailers/${retailerId}`,
      subscription,
    )
    return data
  }

  async createByCarrierId(
    carrierId: number | string,
    subscription: Partial<SubscriptionEntity>,
  ): Promise<SubscriptionEntity> {
    const { data } = await Repository.post(`${this.endpoint}/carriers/${carrierId}`, subscription)
    return data
  }

  async createByRetailerId(
    retailerId: number | string,
    subscription: Partial<SubscriptionEntity>,
  ): Promise<SubscriptionEntity> {
    const { data } = await Repository.post(`${this.endpoint}/retailers/${retailerId}`, subscription)
    return data
  }
}
