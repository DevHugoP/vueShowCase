import RepositoryFactory from '@/services/RepositoryFactory'
import { UserAlert, UserAlertParams } from '@/types'
import { IAlertRepository } from './UserAlertRepository'

export class UserAlertService {
  private userAlertRepository: IAlertRepository

  constructor() {
    this.userAlertRepository = RepositoryFactory.get('userAlert')
  }

  public async getUserAlert(params: UserAlertParams): Promise<UserAlert[]> {
    const { userAlerts } = await this.userAlertRepository.getUserAlert(params)
    return userAlerts
  }

  public async updateUserAlert(id: string, read: boolean): Promise<UserAlert> {
    return await this.userAlertRepository.updateUserAlert(id, read)
  }

  public async deleteUserAlert(id: string): Promise<void> {
    return await this.userAlertRepository.deleteUserAlert(id)
  }

  public async updateAllUserAlert(ids: string[]): Promise<UserAlert[]> {
    return await this.userAlertRepository.updateAllUserAlert({ ids })
  }
}

export default new UserAlertService()
