import RepositoryFactory from '@/services/RepositoryFactory'
import {
  DashboardEntity,
  DashboardFilters,
  DashboardFormEntry,
  DashboardResult,
  PermissionContext,
  PermissionEntity,
  SharedWith,
} from '@/types'
import { IDashboardRepository } from './DashboardRepository'

export class DashboardService {
  private dashboardRepository: IDashboardRepository

  constructor() {
    this.dashboardRepository = RepositoryFactory.get('dashboard')
  }

  public async get(dashboardId: string): Promise<DashboardEntity> {
    const { dashboard } = await this.dashboardRepository.get(dashboardId)
    return dashboard
  }

  public async getAll(params: DashboardFilters = {}): Promise<DashboardResult[]> {
    const { dashboards } = await this.dashboardRepository.getAll(params)

    return dashboards
  }

  public async getPermission(id: string, permissionId: string): Promise<PermissionEntity> {
    const { permission } = await this.dashboardRepository.getPermission(id, permissionId)

    return permission
  }

  public async getPermissions(id: string): Promise<PermissionEntity[]> {
    const { permissions } = await this.dashboardRepository.getPermissions(id)

    return permissions
  }

  public async shareWith(id: string, userId: string): Promise<SharedWith[]> {
    const { sharedWith } = await this.dashboardRepository.shareWith(id, userId)
    return sharedWith
  }

  public async deleteShared(id: string, userId: string): Promise<SharedWith[]> {
    const { sharedWith } = await this.dashboardRepository.deleteShared(id, userId)
    return sharedWith
  }

  public async getAllShared(id: string): Promise<SharedWith[]> {
    const { sharedWith } = await this.dashboardRepository.getSharedWith(id)
    return sharedWith
  }

  public async addPermission(
    id: string,
    payload: { contexts: PermissionContext[]; rulesGroupIds: string[] },
  ): Promise<Record<string, unknown>> {
    return await this.dashboardRepository.createPermission(id, payload)
  }

  public async editPermission(
    id: string,
    permissionId: string,
    payload: { contexts: PermissionContext[]; rulesGroupIds: string[] },
  ): Promise<Record<string, unknown>> {
    return await this.dashboardRepository.updatePermission(id, permissionId, payload)
  }

  public async deletePermission(
    id: string,
    permissionId: string,
  ): Promise<Record<string, unknown>> {
    return await this.dashboardRepository.deletePermission(id, permissionId)
  }

  public async create(payload: DashboardFormEntry): Promise<DashboardEntity> {
    const { dashboard } = await this.dashboardRepository.create(payload)

    return dashboard
  }

  public async update(dashboardId: string, payload: DashboardFormEntry): Promise<DashboardEntity> {
    const { dashboard } = await this.dashboardRepository.update(dashboardId, payload)

    return dashboard
  }

  public async delete(id: string): Promise<void> {
    return this.dashboardRepository.delete(id)
  }
}

export default new DashboardService()
