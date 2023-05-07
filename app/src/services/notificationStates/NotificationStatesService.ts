import RepositoryFactory from '@/services/RepositoryFactory'
import { NotificationStatesEntity, NotificationStatesFilter } from '@/types'
import NotificationRepository from '../notification/NotificationRepository'
import { INotificationStatesRepository } from './NotificationStatesRepository'

export class NotificationStateService {
  private notificationStateRepository: NotificationRepository & INotificationStatesRepository

  constructor() {
    this.notificationStateRepository = RepositoryFactory.get('notificationState')
  }

  public async getAll(
    params: NotificationStatesFilter,
  ): Promise<{ count: number; notificationStates: NotificationStatesEntity[] }> {
    return this.notificationStateRepository.getAll(params)
  }

  public async get(
    id: string,
    params: Record<string, any> = {},
  ): Promise<NotificationStatesEntity> {
    return this.notificationStateRepository.get(id, params)
  }

  public async update(id: number, payload: Record<string, any>): Promise<NotificationStatesEntity> {
    const { notificationState } = await this.notificationStateRepository.update(id, payload)

    return notificationState
  }

  public async create(payload: NotificationStatesEntity): Promise<NotificationStatesEntity> {
    return this.notificationStateRepository.create(payload)
  }

  public async deleteById(id: string): Promise<void> {
    await this.notificationStateRepository.delete(id)
  }

  public async bulkDelete(filters: NotificationStatesFilter): Promise<void> {
    await this.notificationStateRepository.deleteMany(
      this.notificationStateRepository.adaptParams(filters),
    )
  }

  public async bulkUpdate(
    filters: NotificationStatesFilter,
    payload: Partial<NotificationStatesEntity>,
  ): Promise<{ notificationStates: NotificationStatesEntity[] }> {
    return this.notificationStateRepository.updateMany(
      this.notificationStateRepository.adaptParams(filters),
      payload,
    )
  }
}

export default new NotificationStateService()
