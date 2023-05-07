import {
  UserEntity,
  PermissionEntity,
  PermissionContext,
  CurrentUserEntity,
  UserProvider,
} from '@/types'

import Repository from '@/services/Repository'
import HttpRepository from '@/services/HttpRepository'
import { UserFormData } from '@/store/modules/user/types'

export interface IUserRepository {
  getCurrent: () => Promise<CurrentUserEntity>
  updateCurrent: (payload: Record<string, any>) => Promise<CurrentUserEntity>
  createMany: (payload: Array<Record<string, any>>) => Promise<void>
  patch: (id: string, payload: Record<string, any>) => Promise<UserEntity>
  update: (id: string, payload: Record<string, any>) => Promise<{ token: string }>
  getPermission: (id: string, permissionId: string) => Promise<{ permission: PermissionEntity }>
  getPermissions: (id: string) => Promise<{ permissions: PermissionEntity[] }>
  getCurrentUserPermissions: () => Promise<{ permissions: PermissionEntity[] }>
  getCurrentUserProviders: () => Promise<{ providers: UserProvider[] }>
  createPermission: (
    id: string,
    payload: { contexts: PermissionContext[]; rulesGroupIds: string[] },
  ) => Promise<{ permissions: PermissionEntity[] }>
  updatePermission: (
    id: string,
    permissionId: string,
    payload: { contexts: PermissionContext[]; rulesGroupIds: string[] },
  ) => Promise<{ permissions: PermissionEntity[] }>
  deletePermission: (id: string, permissionId: string) => Promise<any>

  getAll: (params: Record<string, any>) => Promise<{ users: UserEntity[]; count: number }>
  get: (id: string) => Promise<{ user: UserEntity }>
  delete: (id: string) => Promise<void>
  create: (payload: UserFormData) => Promise<{ user: UserEntity }>
}

export default class UserRepository extends HttpRepository {
  public async getCurrent(): Promise<CurrentUserEntity> {
    const { data } = await Repository.get(`${this.endpoint}/me`)
    return data
  }

  public async updateCurrent(payload: Record<string, any>): Promise<CurrentUserEntity> {
    const { data } = await Repository.patch(`${this.endpoint}/me`, payload)
    return data
  }

  public async createMany(payload: Array<Record<string, any>>): Promise<void> {
    await Repository.post(`${this.endpoint}/bulk`, payload)
  }

  public async patch(id: string, payload: Record<string, any>): Promise<UserEntity> {
    const { data } = await Repository.patch(`${this.endpoint}/${id}`, payload)
    return data
  }

  public async getPermission(
    id: string,
    permissionId: string,
  ): Promise<{ permission: PermissionEntity }> {
    const { data } = await Repository.get(`${this.endpoint}/${id}/permissions/${permissionId}`)

    return data
  }

  public async getPermissions(id: string): Promise<{ permissions: PermissionEntity[] }> {
    const { data } = await Repository.get(`${this.endpoint}/${id}/permissions`)

    return data
  }

  public async getCurrentUserProviders(): Promise<{ providers: UserProvider[] }> {
    const { data } = await Repository.get(`${this.endpoint}/me/providers`)

    return data
  }

  public async getCurrentUserPermissions(): Promise<{ permissions: PermissionEntity[] }> {
    const { data } = await Repository.get(`${this.endpoint}/me/permissions`)

    return data
  }

  public async createPermission(
    id: string,
    payload: { contexts: PermissionContext[]; rulesGroupIds: string[] },
  ): Promise<{ permissions: PermissionEntity[] }> {
    const { data } = await Repository.post(`${this.endpoint}/${id}/permissions`, payload)
    return data
  }

  public async updatePermission(
    id: string,
    permissionId: string,
    payload: { contexts: PermissionContext[]; rulesGroupIds: string[] },
  ): Promise<{ permissions: PermissionEntity[] }> {
    const { data } = await Repository.put(
      `${this.endpoint}/${id}/permissions/${permissionId}`,
      payload,
    )
    return data
  }

  public async deletePermission(id: string, permissionId: string): Promise<any> {
    const { data } = await Repository.delete(`${this.endpoint}/${id}/permissions/${permissionId}`)
    return data
  }
}
