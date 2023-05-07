import {
  UserEntity,
  PermissionEntity,
  PermissionContext,
  CurrentUserEntity,
  UserProvider,
} from '@/types'
import { UserFormData } from '@/store/modules/user/types'

import RepositoryFactory from '@/services/RepositoryFactory'

import { IUserRepository } from './UserRepository'

export class UserService {
  private userRepository: IUserRepository

  constructor() {
    this.userRepository = RepositoryFactory.get('user')
  }

  public async getCurrent(): Promise<CurrentUserEntity> {
    return this.userRepository.getCurrent()
  }

  public async updateCurrent(payload: Record<string, any>): Promise<CurrentUserEntity> {
    return this.userRepository.updateCurrent(payload)
  }

  public async getCurrentUserPermissions(): Promise<PermissionEntity[]> {
    const { permissions } = await this.userRepository.getCurrentUserPermissions()

    return permissions
  }

  public async getCurrentUserProviders(): Promise<UserProvider[]> {
    const { providers } = await this.userRepository.getCurrentUserProviders()

    return providers
  }

  public async getAll(
    params: Record<string, any> = {},
  ): Promise<{ users: UserEntity[]; count: number }> {
    const { users, count } = await this.userRepository.getAll(params)

    return { users, count }
  }

  public async get(id: string): Promise<UserEntity> {
    const { user } = await this.userRepository.get(id)

    return user
  }

  public async create(payload: UserFormData): Promise<UserEntity> {
    const { user } = await this.userRepository.create(payload)

    return user
  }

  public async createMany(
    payload: Array<UserFormData & { role: string; retailerCode: string; storeId?: string }>,
  ): Promise<void> {
    await this.userRepository.createMany(payload)
  }

  public async patch(id: string, payload: any): Promise<UserEntity> {
    return this.userRepository.patch(id, payload)
  }

  public async delete(id: string): Promise<void> {
    return this.userRepository.delete(id)
  }

  public getInitials(user: UserEntity): string {
    if (!user.firstname && !user.lastname) {
      return user.email.substr(0, 1).toUpperCase()
    }

    return `${user.firstname.substring(0, 1).toUpperCase()}${user.lastname
      .substring(0, 1)
      .toUpperCase()}`
  }

  public getFullname(user: UserEntity): string {
    if (!user.firstname && !user.lastname) {
      return user.email
    }

    return `${user.firstname} ${user.lastname.toUpperCase()}`
  }

  public async inviteUser(id: string): Promise<string> {
    const { token } = await this.userRepository.update(id, {})

    return token
  }

  public async getPermission(id: string, permissionId: string): Promise<PermissionEntity> {
    const { permission } = await this.userRepository.getPermission(id, permissionId)

    return permission
  }

  public async getPermissions(id: string): Promise<PermissionEntity[]> {
    const { permissions } = await this.userRepository.getPermissions(id)

    return permissions
  }

  public async addPermission(
    id: string,
    payload: { contexts: PermissionContext[]; rulesGroupIds: string[] },
  ): Promise<any> {
    return await this.userRepository.createPermission(id, payload)
  }

  public async editPermission(
    id: string,
    permissionId: string,
    payload: { contexts: PermissionContext[]; rulesGroupIds: string[] },
  ): Promise<any> {
    return await this.userRepository.updatePermission(id, permissionId, payload)
  }

  public async deletePermission(id: string, permissionId: string): Promise<any> {
    return await this.userRepository.deletePermission(id, permissionId)
  }

  public buildDefaultUserEntity(): UserEntity {
    return {
      id: '',
      email: '',
      firstname: '',
      lastname: '',
      language: '',
      active: false,
      createdAt: '',
      updatedAt: null,
      lastConnection: null,
    }
  }
  public buildDefaultCurrentUserEntity(): CurrentUserEntity {
    return {
      id: '',
      firstname: '',
      lastname: '',
      email: '',
      language: '',
      active: false,
      permissions: [],
    }
  }

  public buildDefaultUserFormData(): UserFormData {
    return {
      firstname: '',
      lastname: '',
      email: '',
      language: 'fr',
      active: false,
      local: false,
      sendEmail: true,
    }
  }
}

export default new UserService()
