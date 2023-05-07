import RepositoryFactory from '@/services/RepositoryFactory'
import {
  ChannelType,
  NotificationActivationEntity,
  NotificationActivationRange,
  NotificationActivationsFilter,
} from '@/types/entities/notificationActivations'
import NotificationRepository from '../notification/NotificationRepository'
import { INotificationActivationsRepository } from './NotificationActivationsRepository'

export class NotificationActivationsService {
  private repository: NotificationRepository & INotificationActivationsRepository

  constructor() {
    this.repository = RepositoryFactory.get('notificationActivations')
  }

  public async getAll(
    params?: NotificationActivationsFilter,
  ): Promise<NotificationActivationEntity[]> {
    const { notificationActivations } = await this.repository.getAll(params || {})

    return notificationActivations
  }

  public async update(
    id: string,
    payload: { range: NotificationActivationRange | null; active: boolean },
  ): Promise<NotificationActivationEntity> {
    const { notificationActivation } = await this.repository.update(id, payload)

    return notificationActivation
  }

  public async updateAllByChannelAndRetailer(
    retailerId: number[],
    channel: ChannelType,
    payload: { range: NotificationActivationRange | null; active: boolean },
  ): Promise<NotificationActivationEntity[]> {
    const { notificationActivations } = await this.repository.updateMany(
      {
        channel,
        retailerId,
      },
      payload,
    )

    return notificationActivations
  }
}

export default new NotificationActivationsService()
