import { Checkout } from '@/types'
import HttpRepository from '../HttpRepository'

export interface ICheckoutsRepository {
  getAll: (params: Record<string, any>) => Promise<{ checkouts: Checkout[] }>
  get: (id: number) => Promise<{ checkout: Checkout }>
  create: (payload: Partial<Checkout>) => Promise<any>
  update: (id: number, payload: Checkout) => Promise<any>
  delete: (id: number) => Promise<any>
}

export default class CheckoutsRepository extends HttpRepository {}
