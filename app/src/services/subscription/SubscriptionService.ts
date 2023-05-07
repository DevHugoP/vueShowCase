import RepositoryFactory from '@/services/RepositoryFactory'
import { SubscriptionEntity } from '@/types'
import { ISubscriptionRepository } from './SubscriptionRepository'

export class SubscriptionService {
  private repository: ISubscriptionRepository

  constructor() {
    this.repository = RepositoryFactory.get('subscription')
  }

  async getByCarrierId(id: number | string): Promise<SubscriptionEntity> {
    const { subscription } = await this.repository.getByCarrierId(id)

    return subscription
  }

  async getByRetailerId(id: number | string): Promise<SubscriptionEntity> {
    const { subscription } = await this.repository.getByRetailerId(id)

    return subscription
  }

  async updateByCarrierId(
    id: number | string,
    carrierId: number | string,
    subscription: Partial<SubscriptionEntity>,
  ): Promise<void> {
    await this.repository.updateByCarrierId(id, carrierId, subscription)
  }

  async updateByRetailerId(
    id: number | string,
    retailerId: number | string,
    subscription: Partial<SubscriptionEntity>,
  ): Promise<void> {
    await this.repository.updateByRetailerId(id, retailerId, subscription)
  }

  async createByCarrierId(
    carrierId: number | string,
    subscription: Partial<SubscriptionEntity>,
  ): Promise<void> {
    await this.repository.createByCarrierId(carrierId, subscription)
  }

  async createByRetailerId(
    retailerId: number | string,
    subscription: Partial<SubscriptionEntity>,
  ): Promise<void> {
    await this.repository.createByRetailerId(retailerId, subscription)
  }
}

export default new SubscriptionService()
