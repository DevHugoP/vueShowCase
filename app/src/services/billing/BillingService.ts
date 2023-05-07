import RepositoryFactory from '@/services/RepositoryFactory'
import { BillingFilter, BillingEntity } from '@/types'
import { IBillingRepository } from './BillingRepository'

export class BillingService {
  private billingRepository: IBillingRepository

  constructor() {
    this.billingRepository = RepositoryFactory.get('billing')
  }

  public async getAll(params: BillingFilter): Promise<BillingEntity[]> {
    const { billings } = await this.billingRepository.getAll(params)

    return billings
  }
}

export default new BillingService()
