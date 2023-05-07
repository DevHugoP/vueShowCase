import { NotificationEntity, NotificationFilter } from '@/types'
import HttpRepository from '@/services/HttpRepository'

export interface INotificationRepository {
  getAll: (params: NotificationFilter) => Promise<{ notifications: NotificationEntity[] }>
}

export default class NotificationRepository extends HttpRepository {}
