import { Address, PackageEntity, PickupPoint } from '@/types'
import RepositoryFactory from '../RepositoryFactory'
import { IPickupPointsRepository } from './pickupPointsRepository'

export class PickupPointsService {
  private pickupPointsRepository: IPickupPointsRepository

  constructor() {
    this.pickupPointsRepository = RepositoryFactory.get('pickupPoints')
  }

  public async getPickupPoints(params: {
    address: Address
    carriersCode: string[]
    depositDate: string
    forRule: string
    packages: PackageEntity[]
    types?: string[] | Record<string, string[]>
  }): Promise<PickupPoint[]> {
    const { pickupPoints } = await this.pickupPointsRepository.getPickupPoints(params)
    return pickupPoints
  }

  public async getPickupPointById(params: {
    id: string
    carrierCode: string
    retailerId: number
    forRule: string
  }): Promise<PickupPoint> {
    const { pickupPoint } = await this.pickupPointsRepository.getPickupPointById(params)

    return pickupPoint
  }
}

export default new PickupPointsService()
