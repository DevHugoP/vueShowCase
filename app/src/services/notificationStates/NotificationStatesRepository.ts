import HttpRepository from '@/services/HttpRepository'
import { NotificationStatesEntity, NotificationStatesFilter } from '@/types'

export interface INotificationStatesRepository {
  get: (
    id: string,
    params: Record<string, any>,
  ) => Promise<{ notificationState: NotificationStatesEntity }>
  getAll: (
    params: NotificationStatesFilter,
  ) => Promise<{ notificationStates: NotificationStatesEntity[] }>
  update: (
    id: number,
    payload: Partial<NotificationStatesEntity>,
  ) => Promise<{ notificationState: NotificationStatesEntity }>
  updateMany: (
    filters: NotificationStatesFilter,
    payload: Partial<NotificationStatesEntity>,
  ) => Promise<{ notificationState: NotificationStatesEntity }>
  deleteMany: (filters: NotificationStatesFilter) => Promise<void>
  create: (
    notificationState: Partial<NotificationStatesEntity>,
  ) => Promise<{ notificationState: NotificationStatesEntity }>
}

export default class NotificationStatesRepository extends HttpRepository {}
