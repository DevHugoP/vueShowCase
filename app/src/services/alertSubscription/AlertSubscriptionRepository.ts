import HttpRepository from '@/services/HttpRepository'
import Repository from '@/services/Repository'
import { AlertSubscription, UserAlertParams } from '@/types'

export interface IAlertRepository {
  getAll: (params: UserAlertParams) => Promise<{ alertSubscriptions: AlertSubscription[] }>
  create: (payload: { alertSubscriptions: AlertSubscription[] }) => Promise<AlertSubscription[]>
  update: (
    id: string,
    payload: {
      email: boolean
    },
  ) => Promise<{ alertSubscription: AlertSubscription }>
  bulkUpdate: (payload: {
    id: string
    email: boolean
  }) => Promise<{ alertSubscriptions: AlertSubscription[] }>
  bulkDelete: (params: { id: string }) => Promise<void>
}

export default class AlertSubscriptionRepository extends HttpRepository {
  async bulkUpdate(payload: { alertSubscriptions: AlertSubscription[] }): Promise<any> {
    const { data } = await Repository.patch(`${this.endpoint}`, payload)
    return data
  }

  async bulkDelete(params: { ids: string[] }): Promise<void> {
    await Repository.delete(`${this.endpoint}`, { params })
  }
}
