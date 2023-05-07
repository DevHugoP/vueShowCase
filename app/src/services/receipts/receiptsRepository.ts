import { TicketContent } from '@/store/modules/createOrder/types'
import HttpRepository from '../HttpRepository'

export interface IReceiptsRepository {
  get: (id: string, params: { retailerId: number }) => Promise<TicketContent>
}

export default class ReceiptsRepository extends HttpRepository {}
