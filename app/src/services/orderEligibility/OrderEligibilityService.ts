import RepositoryFactory from '@/services/RepositoryFactory'
import { CarrierEligibilityEntity, CarrierZoningEligibility, Zoning } from '@/types'
import { IOrderEligibilityRepository } from './OrderEligibilityRepository'

export class OrderEligibilityService {
  private repository: IOrderEligibilityRepository

  constructor() {
    this.repository = RepositoryFactory.get('orderEligibility')
  }

  /**
   * @name getAll
   *
   * Get all OrderEligibilities and parents
   */
  public async getAll(
    params: Record<string, any> = {},
  ): Promise<{
    orderEligibilities: CarrierEligibilityEntity[]
    parents: CarrierEligibilityEntity[]
  }> {
    return await this.repository.getAll(params)
  }

  public async update(
    params: Record<string, any> = {},
    orderEligibility: Partial<CarrierEligibilityEntity>,
  ): Promise<CarrierEligibilityEntity> {
    const { orderEligibility: updatedEligibility } = await this.repository.updateMany(
      params,
      orderEligibility,
    )

    return updatedEligibility
  }

  public async updateTags(
    params: Record<string, any> = {},
    orderEligibility: Partial<CarrierEligibilityEntity>,
  ): Promise<void> {
    await this.repository.updateTags(params, orderEligibility)
  }

  public async updateCommitments(
    params: Record<string, any> = {},
    orderEligibility: Partial<CarrierEligibilityEntity>,
  ): Promise<void> {
    await this.repository.updateCommitments(params, orderEligibility)
  }

  public async enableDisable(
    params: Record<string, any>,
    payload: Record<string, any>,
  ): Promise<void> {
    await this.repository.enableDisable(params, payload)
  }

  public getAvailableList(
    parents: CarrierEligibilityEntity[],
    children: CarrierEligibilityEntity[],
  ): CarrierEligibilityEntity[] {
    return children.filter(child => {
      return parents.some(parent => parent.isActive && parent.carrierId === child.carrierId)
    })
  }

  public async getZoning(params: Record<string, any>): Promise<Zoning | null> {
    try {
      const { zoningEligibility } = await this.repository.getZoning(params)
      return zoningEligibility
    } catch (err) {
      return null
    }
  }

  public async checkZoning(
    params: Record<string, any>,
  ): Promise<CarrierZoningEligibility[] | null> {
    try {
      const { eligibility } = await this.repository.checkZoning(params)
      return eligibility
    } catch (err) {
      return null
    }
  }
}

export default new OrderEligibilityService()
