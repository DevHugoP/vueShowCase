import RepositoryFactory from '@/services/RepositoryFactory'
import { FtpAccountUpdate } from '../../types'
import FtpRepository from './FtpRepository'

export class FtpService {
  private repository: FtpRepository

  constructor() {
    this.repository = RepositoryFactory.get('ftp')
  }

  async test(account: FtpAccountUpdate): Promise<{ status: boolean; errors?: string[] }> {
    return this.repository.testConnection(account)
  }
}

export default new FtpService()
