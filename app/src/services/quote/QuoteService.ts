import RepositoryFactory from '@/services/RepositoryFactory'
import { QuoteEntity } from '@/types'
import { IQuoteRepository } from './QuoteRepository'

export class QuoteService {
  private quoteRepository: IQuoteRepository

  constructor() {
    this.quoteRepository = RepositoryFactory.get('quote')
  }

  public async getAll(params: Record<string, any> = {}): Promise<QuoteEntity[]> {
    let { quotes } = await this.quoteRepository.getAll(params)

    quotes = quotes.sort((elemA: QuoteEntity, elemB: QuoteEntity) => {
      const scoreA = elemA.score && !elemA.refused ? elemA.score.total : 99
      const scoreB = elemB.score && !elemB.refused ? elemB.score.total : 99
      return scoreB - scoreA
    })

    return quotes
  }
}

export default new QuoteService()
