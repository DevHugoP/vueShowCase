import CarrierRepository, { ICarrierRepository } from '@/services/carrier/CarrierRepository'
import RepositoryFactory from '@/services/RepositoryFactory'
import {
  AuthInfos,
  CarrierEligibilityEntity,
  CarrierEntity,
  CreateCarrier,
  Filters,
  getDefaultCarrier,
} from '@/types'

export class CarrierService {
  private carrierRepository: ICarrierRepository & CarrierRepository

  constructor() {
    this.carrierRepository = RepositoryFactory.get('carrier')
  }

  /**
   * @name getAll
   *
   * Get all carriers
   */
  public async getAll(
    params: Record<string, any> = {},
  ): Promise<{ carriers: CarrierEntity[]; count: number }> {
    if (params.countries?.length) {
      params.countries = JSON.stringify(params.countries)
    }
    const { carriers, count } = await this.carrierRepository.getAll(params)

    return { carriers, count }
  }

  public async get(id: number, params?: Record<string, any>): Promise<CarrierEntity> {
    const { carrier } = await this.carrierRepository.get(id, params)

    return carrier
  }

  public async getActiveRetailer(
    id: number,
  ): Promise<{ id: number; code: string; name: string; logo?: string }[] | undefined> {
    const { retailers } = await this.carrierRepository.getActiveRetailers(id)
    return retailers
  }

  public async getAuthInfos(partnerCode: string): Promise<AuthInfos | undefined> {
    if (partnerCode === 'google') {
      return {
        brandColor: '#4285F4',
        authProviderId: 'google',
        name: 'Google',
        logo:
          'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/157px-Google_%22G%22_Logo.svg.png',
        code: 'google',
        passwordLess: false,
      }
    }
    return this.carrierRepository.getAuthInfos(partnerCode)
  }

  public async create(
    carrier: CreateCarrier,
  ): Promise<Partial<CarrierEntity & CarrierEligibilityEntity>> {
    const { carrier: createdCarrier } = await this.carrierRepository.create(carrier)

    return createdCarrier
  }

  public async update(id: string | number, carrier: Partial<CarrierEntity>): Promise<any> {
    const { carrier: updatedCarrier } = await this.carrierRepository.update(id.toString(), carrier)

    return updatedCarrier
  }

  public async getFilters(params: Record<string, any> = {}): Promise<Filters[]> {
    const { carriers } = await this.carrierRepository.getFilters(params)

    return carriers
  }

  public buildCarrier(carrier?: CarrierEntity): CarrierEntity {
    return {
      ...getDefaultCarrier(),
      ...carrier,
    }
  }

  getSecret(id: any): Promise<{ file: any; filename: string; password: string }> {
    return this.carrierRepository.getSecret(id)
  }
}

export default new CarrierService()
