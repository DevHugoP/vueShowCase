import { UserAlert } from '@/types'
import RepositoryFactory from '../RepositoryFactory'
import { IAlertRepository } from './AlertsRepository'

export class AlertsService {
  private alertRepository: IAlertRepository

  constructor() {
    this.alertRepository = RepositoryFactory.get('alerts')
  }

  public async getWithFilter(params: {
    retailerId?: number
    storeId?: number
    carrierId?: number
    orderId?: number
    type?: string
  }): Promise<UserAlert[]> {
    return await this.alertRepository.getWithFilter(params)
  }
}

export default new AlertsService()
