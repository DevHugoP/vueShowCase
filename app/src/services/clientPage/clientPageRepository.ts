import { ClientPage, ClientPageUpdate, ClientPageCreate } from '@/types'
import HttpRepository from '../HttpRepository'
import Repository from '../Repository'

export interface IClientPageRepository {
  getAll: (params?: Record<string, any>) => Promise<{ clientPages: ClientPage[] }>
  get: (id: string, params?: Record<string, any>) => Promise<{ clientPage: ClientPage }>
  update: (id: string, payload: ClientPageUpdate) => Promise<{ clientPage: ClientPage }>
  create: (payload: ClientPageCreate) => Promise<{ clientPage: ClientPage }>
  delete: (id: string) => Promise<void>
  getLanguages: (payload: { retailerId: number; type: string }) => Promise<any>
  activate: (id: string, payload: { isActive: boolean }) => Promise<void>
}

export default class ClientPageRepository extends HttpRepository {
  async getLanguages(params: { retailerId: number; type: string }): Promise<any> {
    const { data } = await Repository.get(`${this.endpoint}/languages`, { params })

    return data
  }

  async activate(id: string, params: { isActive: boolean }): Promise<void> {
    return await Repository.patch(`${this.endpoint}/${id}`, params)
  }
}
