import { TicketContent } from '@/store/modules/createOrder/types'
import RepositoryFactory from '../RepositoryFactory'
import { IReceiptsRepository } from './receiptsRepository'

export class ReceiptsService {
  private receiptsRepository: IReceiptsRepository

  constructor() {
    this.receiptsRepository = RepositoryFactory.get('receipts')
  }

  public async get(id: string, params: { retailerId: number }): Promise<TicketContent> {
    return await this.receiptsRepository.get(id, params)
  }
}

export default new ReceiptsService()
