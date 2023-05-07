import { BillingFilter, BillingEntity } from '@/types'
import HttpRepository from '@/services/HttpRepository'

export interface IBillingRepository {
  getAll: (params: BillingFilter) => Promise<{ billings: BillingEntity[] }>
}

export default class BillingRepository extends HttpRepository {}
