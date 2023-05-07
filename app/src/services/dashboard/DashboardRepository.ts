import HttpRepository from '@/services/HttpRepository'
import {
  DashboardEntity,
  DashboardFilters,
  DashboardFormEntry,
  DashboardResult,
  PermissionContext,
  PermissionEntity,
  SharedWith,
} from '@/types'
import Repository from '../Repository'

export interface IDashboardRepository {
  getAll: (params: DashboardFilters) => Promise<{ dashboards: DashboardResult[] }>
  get: (id: string) => Promise<{ dashboard: DashboardEntity }>
  delete: (id: string) => Promise<void>
  create: (payload: DashboardFormEntry) => Promise<{ dashboard: DashboardEntity }>
  update: (
    dashboardId: string,
    payload: DashboardFormEntry,
  ) => Promise<{ dashboard: DashboardEntity }>

  getPermission: (id: string, permissionId: string) => Promise<{ permission: PermissionEntity }>
  getPermissions: (id: string) => Promise<{ permissions: PermissionEntity[] }>
  createPermission: (
    id: string,
    payload: { contexts: PermissionContext[]; rulesGroupIds: string[] },
  ) => Promise<Record<string, unknown>>
  updatePermission: (
    id: string,
    permissionId: string,
    payload: { contexts: PermissionContext[]; rulesGroupIds: string[] },
  ) => Promise<Record<string, unknown>>
  deletePermission: (id: string, permissionId: string) => Promise<Record<string, unknown>>
  shareWith: (id: string, userId: string) => Promise<{ sharedWith: SharedWith[] }>
  deleteShared: (id: string, userId: string) => Promise<{ sharedWith: SharedWith[] }>
  getSharedWith: (id: string) => Promise<{ sharedWith: SharedWith[] }>
}

export default class DashboardRepository extends HttpRepository {
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

  public async shareWith(id: string, userId: string): Promise<{ sharedWith: SharedWith[] }> {
    const { data } = await Repository.post(`${this.endpoint}/${id}/permissions/share`, { userId })
    return data
  }

  public async deleteShared(id: string, userId: string): Promise<{ sharedWith: SharedWith[] }> {
    const { data } = await Repository.delete(`${this.endpoint}/${id}/permissions/share/${userId}`)
    return data
  }

  public async getSharedWith(id: string): Promise<{ sharedWith: SharedWith[] }> {
    const { data } = await Repository.get(`${this.endpoint}/${id}/permissions/share`)
    return data
  }

  public async createPermission(
    id: string,
    payload: { contexts: PermissionContext[]; rulesGroupIds: string[] },
  ): Promise<Record<string, unknown>> {
    const { data } = await Repository.post(`${this.endpoint}/${id}/permissions`, payload)
    return data
  }

  public async updatePermission(
    id: string,
    permissionId: string,
    payload: { contexts: PermissionContext[]; rulesGroupIds: string[] },
  ): Promise<Record<string, unknown>> {
    const { data } = await Repository.put(
      `${this.endpoint}/${id}/permissions/${permissionId}`,
      payload,
    )
    return data
  }

  public async deletePermission(
    id: string,
    permissionId: string,
  ): Promise<Record<string, unknown>> {
    const { data } = await Repository.delete(`${this.endpoint}/${id}/permissions/${permissionId}`)
    return data
  }
}
