import HttpRepository from '@/services/HttpRepository'
import Repository from '@/services/Repository'
import { UpdateUserAlertsParams, UserAlert, UserAlertParams } from '@/types'

export interface IAlertRepository {
  getUserAlert: (params: UserAlertParams) => Promise<{ userAlerts: UserAlert[] }>
  updateUserAlert: (id: string, read: boolean) => Promise<UserAlert>
  updateAllUserAlert: (params: UpdateUserAlertsParams) => Promise<UserAlert[]>
  deleteUserAlert: (id: string) => Promise<void>
}

export default class UserAlertRepository extends HttpRepository {
  async getUserAlert<T>(params: UserAlertParams): Promise<T> {
    const { data } = await Repository.get<T>(`${this.endpoint}`, { params })
    return data
  }

  async updateUserAlert<T>(id: string, read: boolean): Promise<T> {
    const { data } = await Repository.patch<T>(`${this.endpoint}/${id}`, { read })
    return data
  }

  async updateAllUserAlert<T>(params: UpdateUserAlertsParams): Promise<T> {
    const { data } = await Repository.patch<T>(`${this.endpoint}`, {}, { params })
    return data
  }

  async deleteUserAlert<T>(id: string): Promise<T> {
    const { data } = await Repository.delete<T>(`${this.endpoint}/${id}`)
    return data
  }
}
