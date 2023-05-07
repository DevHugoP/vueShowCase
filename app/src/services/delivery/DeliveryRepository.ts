import HttpRepository from '@/services/HttpRepository'
import {
  DeliveryPackage,
  DeliveryScore,
  DeliverySlot,
  DeliverySlotsCreateBooking,
  DeliverySlotsParams,
} from '@/types'
import { AxiosRequestConfig, AxiosResponse } from 'axios'
import Repository from '../Repository'

export interface IDeliveryRepository {
  getTrackingPageUrl: (id: string) => Promise<{ trackingPageUrl: string }>
  getPackageFollow: (id: number, packageId: number) => Promise<{ packages: DeliveryPackage[] }>
  getScore: (id: string) => Promise<{ deliveryScore: DeliveryScore }>
  getSlots: (params: DeliverySlotsParams) => Promise<DeliverySlot[]>
  createBooking: (payload: DeliverySlotsCreateBooking) => Promise<{ bookingId: string }>
  deleteBooking: (id: string) => Promise<void>
  updateStatus: (
    id: number,
    params: Record<string, any>,
    options?: AxiosRequestConfig,
  ) => Promise<void>
  close: (id: string, params: Record<string, any>) => Promise<void>
  downloadSlip: (params: Record<string, any>) => Promise<AxiosResponse>
  createAppointment: (id: string, payload: { start: string; end: string }) => Promise<void>
  getSchedules: (params: Record<string, any>) => Promise<any>
  getScheduleById: (id: string) => Promise<any>
  createSchedules: (payload: Record<string, any>) => Promise<any>
  updateSchedules: (id: string | number, payload: Record<string, any>) => Promise<any>
  deleteSchedule: (id: string | number) => Promise<any>
}

export default class DeliveryRepository extends HttpRepository {
  async getTrackingPageUrl(id: number): Promise<any> {
    const { data } = await Repository.get(`${this.endpoint}/${id}/trackingUrl`)
    return data
  }

  async updateStatus(
    id: number,
    payload: Record<string, any>,
    options?: AxiosRequestConfig,
  ): Promise<any> {
    return await Repository.put(`${this.endpoint}/${id}/status`, payload, options)
  }

  async close(id: string, payload: Record<string, any>): Promise<any> {
    return Repository.post(`${this.endpoint}/${id}/close`, payload)
  }

  async getPackageFollow(id: number, packageId: number): Promise<any> {
    const { data } = await Repository.get(`deliveries/${id}/packages/${packageId}`)
    return data
  }

  async getSchedules(params: Record<string, any>): Promise<Record<string, any>> {
    const { data } = await Repository.get(`${this.endpoint}/scheduleConfigs`, { params })
    return data
  }

  async getScheduleById(id: string): Promise<Record<string, any>> {
    const { data } = await Repository.get(`${this.endpoint}/scheduleConfigs/${id}`)
    return data
  }

  async createSchedules(payload: Record<string, any>): Promise<Record<string, any>> {
    const { data } = await Repository.post(`${this.endpoint}/scheduleConfigs`, payload)

    return data
  }

  async updateSchedules(
    id: string | number,
    payload: Record<string, any>,
  ): Promise<Record<string, any>> {
    const { data } = await Repository.put(`${this.endpoint}/scheduleConfigs/${id}`, payload)

    return data
  }

  async deleteSchedule(id: number | string): Promise<any> {
    return await Repository.delete(`${this.endpoint}/scheduleConfigs/${id}`)
  }

  async getScore(id: string): Promise<any> {
    const { data } = await Repository.get(`${this.endpoint}/${id}/scores`)
    return data
  }

  async createAppointment(id: string, payload: { start: string; end: string }): Promise<void> {
    return Repository.post(`${this.endpoint}/${id}/appointment`, payload)
  }

  async downloadSlip(params: Record<string, any>): Promise<any> {
    return Repository.get(`${this.endpoint}/download`, {
      params: this.adaptParams(params),
      responseType: 'arraybuffer',
    })
  }

  async getSlots(params: DeliverySlotsParams): Promise<DeliverySlot[]> {
    const {
      data: { slots },
    } = await Repository.get(`${this.endpoint}/slots`, { params })
    return slots
  }

  async createBooking(payload: DeliverySlotsCreateBooking): Promise<{ bookingId: string }> {
    const { data } = await Repository.post(`${this.endpoint}/bookings`, payload)

    return data
  }

  async deleteBooking(id: string): Promise<void> {
    return await Repository.delete(`${this.endpoint}/bookings/${id}`)
  }
}
