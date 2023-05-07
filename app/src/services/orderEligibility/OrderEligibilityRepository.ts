import HttpRepository from '@/services/HttpRepository'
import Repository from '@/services/Repository'
import { CarrierEligibilityEntity, CarrierZoningEligibility, Zoning } from '@/types'

export interface IOrderEligibilityRepository {
  getAll: (
    params: Record<string, any>,
  ) => Promise<{
    orderEligibilities: CarrierEligibilityEntity[]
    parents: CarrierEligibilityEntity[]
  }>
  updateMany: (
    params: Record<string, any>,
    orderEligibility: Partial<CarrierEligibilityEntity>,
  ) => Promise<{ orderEligibility: CarrierEligibilityEntity }>
  updateTags: (
    params: Record<string, any>,
    orderEligibility: Partial<CarrierEligibilityEntity>,
  ) => Promise<void>
  updateCommitments: (
    params: Record<string, any>,
    orderEligibility: Partial<CarrierEligibilityEntity>,
  ) => Promise<void>
  enableDisable: (
    params: Record<string, any>,
    orderEligibility: Partial<CarrierEligibilityEntity>,
  ) => Promise<void>
  getZoning: (params: Record<string, any>) => Promise<{ zoningEligibility: Zoning }>
  checkZoning(params: Record<string, any>): Promise<{ eligibility: CarrierZoningEligibility[] }>
}

export default class OrderEligibilityRepository extends HttpRepository {
  async updateTags(params: Record<string, any>, payload: Record<string, any>): Promise<void> {
    await Repository.put(`${this.endpoint}/tags`, payload, { params })
  }

  async updateCommitments(
    params: Record<string, any>,
    payload: Record<string, any>,
  ): Promise<void> {
    await Repository.put(`${this.endpoint}/commitments`, payload, { params })
  }

  async enableDisable(params: Record<string, any>, payload: Record<string, any>): Promise<void> {
    await Repository.post(`${this.endpoint}/activation`, payload, { params })
  }

  async getZoning(params: Record<string, any>): Promise<{ zoningEligibility: Zoning }> {
    const { data } = await Repository.get(`${this.endpoint}/zonings`, { params })
    return data
  }

  async checkZoning(
    params: Record<string, any>,
  ): Promise<{ eligibility: CarrierZoningEligibility[] }> {
    const { data } = await Repository.get(`${this.endpoint}/zonings/check`, {
      params: this.adaptParams(params),
    })
    return data
  }
}
