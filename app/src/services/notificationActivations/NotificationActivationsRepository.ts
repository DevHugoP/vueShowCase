import HttpRepository from '@/services/HttpRepository'
import {
  NotificationActivationEntity,
  NotificationActivationsFilter,
} from '@/types/entities/notificationActivations'

export interface INotificationActivationsRepository {
  getAll: (
    params: NotificationActivationsFilter,
  ) => Promise<{ notificationStates: NotificationActivationEntity[] }>
}

export default class NotificationActivationsRepository extends HttpRepository {}
