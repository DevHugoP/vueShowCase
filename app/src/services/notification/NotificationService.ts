import RepositoryFactory from '@/services/RepositoryFactory'
import { NotificationEntity, NotificationFilter } from '@/types'
import { INotificationRepository } from './NotificationRepository'

export class NotificationService {
  private notificationRepository: INotificationRepository

  constructor() {
    this.notificationRepository = RepositoryFactory.get('notification')
  }

  public async getAll(params: NotificationFilter): Promise<NotificationEntity[]> {
    const { notifications } = await this.notificationRepository.getAll(params)

    return notifications
  }
}

export default new NotificationService()
