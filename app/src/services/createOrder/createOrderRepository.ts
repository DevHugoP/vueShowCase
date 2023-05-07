import HttpRepository from '@/services/HttpRepository'
import { Address, PackageEntity } from '@/types'
import Repository from '../Repository'

export interface ICreateOrderRepository {
  getDistance: (params: { placeOne: Address; placeTwo: Address }) => any
  getValuations: (payload: {
    retailerId: number
    storeId: number
    carrierIds: number[]
    packages: PackageEntity[]
    services: string[]
  }) => any
}

export default class CreateOrderRepository extends HttpRepository {
  public async getDistance(params: { placeOne: Address; placeTwo: Address }): Promise<any> {
    const { data } = await Repository.get(`/addresses/distance`, {
      params: {
        placeOne: JSON.stringify(params.placeOne),
        placeTwo: JSON.stringify(params.placeTwo),
      },
    })

    return data
  }

  public async getValuations(payload: {
    retailerId: number
    storeId: number
    carrierIds: number[]
    packages: PackageEntity[]
    services: string[]
  }): Promise<any> {
    const { data } = await Repository.post('/valuations', payload)

    return data
  }
}
