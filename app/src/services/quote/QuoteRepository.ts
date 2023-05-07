import { QuoteEntity } from '@/types'
import HttpRepository from '@/services/HttpRepository'

export interface IQuoteRepository {
  getAll: (params: Record<string, any>) => Promise<{ quotes: QuoteEntity[] }>
}

export default class QuoteRepository extends HttpRepository {}
