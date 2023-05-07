import RepositoryFactory from '@/services/RepositoryFactory'
import { AdministrationConfig } from '@/types'
import { IAdministrationRepository } from './AdministrationRepository'

export class AdministrationService {
  private administrationRepository: IAdministrationRepository

  constructor() {
    this.administrationRepository = RepositoryFactory.get('administration')
  }

  public async getAllAvailableConfig(): Promise<string[]> {
    const {
      availableConfigurationsKeys,
    } = await this.administrationRepository.getAvailableConfigurationsKey()

    return availableConfigurationsKeys
  }

  public async getAll(): Promise<AdministrationConfig> {
    const { administrationConfig } = await this.administrationRepository.getAll()

    return administrationConfig
  }

  public async update(key: string, payload: Record<string, any>): Promise<AdministrationConfig> {
    const { administrationConfig } = await this.administrationRepository.update(key, payload)

    return administrationConfig
  }
}

export default new AdministrationService()
