import { UserAlert } from '@/types'
import HttpRepository from '../HttpRepository'
import Repository from '../Repository'

export interface IAlertRepository {
  getWithFilter: (params: {
    retailerId?: number
    storeId?: number
    carrierId?: number
    orderId?: number
    type?: string
  }) => Promise<UserAlert[]>
}

export default class AlertRepository extends HttpRepository {
  async getWithFilter(params: {
    retailerId?: number
    storeId?: number
    carrierId?: number
    orderId: number
    type?: string
  }): Promise<any> {
    const { data } = await Repository.get(`${this.endpoint}`, { params })

    return data
  }
}
