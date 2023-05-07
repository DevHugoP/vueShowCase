import RepositoryFactory from '@/services/RepositoryFactory'
import { FtpAccountCreate, FtpAccountEntity, FtpAccountUpdate } from '../../types'
import FtpAccountsRepository from './FtpAccountsRepository'

export class FtpAccountsService {
  private repository: FtpAccountsRepository

  constructor() {
    this.repository = RepositoryFactory.get('ftpAccounts')
  }

  async getAll(filters: {
    type: 'carrier' | 'retailer'
    thirdPartyId: number
  }): Promise<FtpAccountEntity[]> {
    const data = await this.repository.getAllByThirdParty<{
      ftpAccounts: FtpAccountEntity[]
    }>(filters.thirdPartyId, filters.type)

    return data ? data.ftpAccounts : []
  }

  async delete(type: 'carrier' | 'retailer', id: number): Promise<void> {
    return this.repository.deleteByThirdParty(id, type)
  }

  async get(type: 'carrier' | 'retailer', id: number): Promise<FtpAccountEntity | null> {
    const data = await this.repository.getByThirdParty<{ ftpAccount: FtpAccountEntity }>(id, type)
    return data?.ftpAccount ? data.ftpAccount : null
  }

  async create(
    type: 'carrier' | 'retailer',
    account: FtpAccountCreate,
  ): Promise<FtpAccountEntity | null> {
    const data = await this.repository.createForThirdParty<{ ftpAccount: FtpAccountEntity }>(
      account,
      type,
    )
    return data?.ftpAccount ? data.ftpAccount : null
  }

  async update(
    type: 'carrier' | 'retailer',
    accountId: number,
    account: FtpAccountUpdate,
  ): Promise<FtpAccountEntity | null> {
    const data = await this.repository.updateForThirdParty<{ ftpAccount: FtpAccountEntity }>(
      accountId,
      account,
      type,
    )
    return data?.ftpAccount ? data.ftpAccount : null
  }
}

export default new FtpAccountsService()
