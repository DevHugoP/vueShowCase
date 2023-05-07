import RepositoryFactory from '@/services/RepositoryFactory'
import { AlertSubscription, UserAlertParams } from '@/types'
import { IAlertRepository } from './AlertSubscriptionRepository'

export class AlertSubscriptionService {
  private alertRepository: IAlertRepository

  constructor() {
    this.alertRepository = RepositoryFactory.get('alertSubscription')
  }

  public async get(params: UserAlertParams): Promise<AlertSubscription[]> {
    const { alertSubscriptions } = await this.alertRepository.getAll(params)
    return alertSubscriptions
  }

  public async getAll(): Promise<AlertSubscription[]> {
    const { alertSubscriptions } = await this.alertRepository.getAll({})
    return alertSubscriptions
  }

  async bulkUpdate(payload: { id: string; email: boolean }): Promise<AlertSubscription> {
    const { id, ...alertSubscription } = payload
    const { alertSubscription: updatedAlertSubscription } = await this.alertRepository.update(
      id,
      alertSubscription,
    )
    return updatedAlertSubscription
  }

  async bulkCreate(payload: {
    alertSubscriptions: AlertSubscription[]
  }): Promise<AlertSubscription[]> {
    return await this.alertRepository.create(payload)
  }

  async delete(payload: { id: string }): Promise<void> {
    return await this.alertRepository.bulkDelete(payload)
  }
}

export default new AlertSubscriptionService()
