import HttpRepository from '@/services/HttpRepository'
import { FtpAccountCreate, FtpAccountUpdate } from '../../types'
import Repository from '../Repository'

export default class FtpAccountsRepository extends HttpRepository {
  async getAllByThirdParty<T>(id: number, type: 'carrier' | 'retailer'): Promise<T | undefined> {
    try {
      const { data } = await Repository.get(`${this.endpoint}/${type}s/${id}`, {
        params: {},
      })
      return data
    } catch (err) {
      return
    }
  }

  async deleteByThirdParty(id: number, type: 'carrier' | 'retailer'): Promise<void> {
    await Repository.delete(`${this.endpoint}/${id}/${type}s`, {})
  }

  async getByThirdParty<T>(id: number, type: 'carrier' | 'retailer'): Promise<T | undefined> {
    try {
      const { data } = await Repository.get(`${this.endpoint}/${id}/${type}s`)
      return data
    } catch (err) {
      return
    }
  }

  async createForThirdParty<T>(
    account: FtpAccountCreate,
    type: 'carrier' | 'retailer',
  ): Promise<T | undefined> {
    const { thirdPartyId, ...ftpAccount } = account
    const { data } = await Repository.post(`${this.endpoint}/${type}s`, {
      ...ftpAccount,
      [`${type}Id`]: thirdPartyId,
    })

    return data
  }

  async updateForThirdParty<T>(
    accountId: number,
    account: FtpAccountUpdate,
    type: 'carrier' | 'retailer',
  ): Promise<T | undefined> {
    const { data } = await Repository.put(`${this.endpoint}/${accountId}/${type}s`, account)

    return data
  }
}
