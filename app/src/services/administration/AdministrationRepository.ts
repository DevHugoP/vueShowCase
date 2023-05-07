import HttpRepository from '@/services/HttpRepository'
import { AdministrationConfig } from '@/types'
import Repository from '../Repository'

export interface IAdministrationRepository {
  getAll: () => Promise<{ administrationConfig: AdministrationConfig }>
  update: (
    key: string,
    payload: Record<string, any>,
  ) => Promise<{ administrationConfig: AdministrationConfig }>
  getAvailableConfigurationsKey: () => Promise<{ availableConfigurationsKeys: string[] }>
}

export default class AdministrationRepository extends HttpRepository {
  public async getAvailableConfigurationsKey(
    _id: string,
  ): Promise<{ availableConfigurationsKeys: string[] }> {
    const { data } = await Repository.get(`${this.endpoint}/availableConfigurations`)

    return data
  }
}
