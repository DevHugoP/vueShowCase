import { Checkout } from '@/types'
import RepositoryFactory from '../RepositoryFactory'
import { ICheckoutsRepository } from './checkoutsRepository'

export class CheckoutsService {
  private checkoutRepository: ICheckoutsRepository

  constructor() {
    this.checkoutRepository = RepositoryFactory.get('checkouts')
  }

  public async getAll(params: {
    retailerId: number
    storeId?: number
    published?: boolean
    name?: string
  }): Promise<Checkout[]> {
    const { checkouts } = await this.checkoutRepository.getAll(params)

    return checkouts
  }

  public async get(id: number): Promise<Checkout> {
    const { checkout } = await this.checkoutRepository.get(id)

    return checkout
  }

  public async create(payload: Partial<Checkout>): Promise<any> {
    return await this.checkoutRepository.create(payload)
  }

  public async update(id: number, payload: Checkout): Promise<any> {
    return await this.checkoutRepository.update(id, payload)
  }

  public async delete(id: number): Promise<any> {
    return await this.checkoutRepository.delete(id)
  }
}

export default new CheckoutsService()
