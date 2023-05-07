import HttpRepository from '@/services/HttpRepository'
import { FtpAccountUpdate } from '../../types'
import Repository from '../Repository'

export default class FtpRepository extends HttpRepository {
  async testConnection(account: FtpAccountUpdate): Promise<{ status: boolean; errors?: string[] }> {
    const { data } = await Repository.post(`${this.endpoint}/connect`, account)
    return data
  }
}
