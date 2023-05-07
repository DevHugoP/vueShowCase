import HttpRepository from '@/services/HttpRepository'
import { Address, PackageEntity, PickupPoint } from '@/types'
import Repository from '../Repository'

export interface IPickupPointsRepository {
  getPickupPoints: (params: {
    address: Address
    carriersCode: string[]
    depositDate: string
    forRule: string
    packages: PackageEntity[]
    types?: string[] | Record<string, string[]>
  }) => Promise<{ pickupPoints: PickupPoint[] }>

  getPickupPointById: (params: {
    id: string
    carrierCode: string
    forRule: string
    retailerId: number
  }) => Promise<{ pickupPoint: PickupPoint }>
}

export default class PickupPointsRepository extends HttpRepository {
  public async getPickupPoints(params: {
    address: Address
    carriersCode: string[]
    depositDate: string
    forRule: string
    packages: PackageEntity[]
    types?: string[] | Record<string, string[]>
  }): Promise<any> {
    const { data } = await Repository.post(
      `${this.endpoint}`,
      {
        address: params.address,
        carriersCode: params.carriersCode,
        depositDate: params.depositDate,
        packages: params.packages,
        type: Array.isArray(params.types)
          ? params.carriersCode.reduce(
              (acc, carrierCode) => ({ ...acc, [carrierCode]: params.types }),
              {},
            )
          : params.types,
      },
      { params: { forRule: params.forRule } },
    )

    return data
  }

  public async getPickupPointById(params: {
    id: string
    carrierCode: string
    forRule: string
    retailerId: number
  }): Promise<any> {
    const { data } = await Repository.get(`${this.endpoint}/${params.id}`, {
      params: {
        carrierCode: params.carrierCode,
        forRule: params.forRule,
        retailerId: params.retailerId,
      },
    })

    return data
  }
}
