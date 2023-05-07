import Config from '@/config/Config'
import { dateHelperGetUtcDate, dateHelperSetUtcTime } from '@/helpers/dateHelper'
import RepositoryFactory from '@/services/RepositoryFactory'
import {
  DeliverySlot,
  DeliverySlotsCreateBooking,
  DeliverySlotsParams,
  DialogOrderDetailUpdateStatus,
  OrderDetailCloseDelivery,
} from '@/types'
import { IDeliveryRepository } from './DeliveryRepository'

const DEFAULT_OPTIONS = {
  headers: {
    'Content-type': 'multipart/form-data',
  },
}

export class DeliveryService {
  private repository: IDeliveryRepository

  constructor() {
    this.repository = RepositoryFactory.get('delivery')
  }

  public async getSchedules(params: Record<string, any>): Promise<Record<string, any>> {
    return this.repository.getSchedules(params)
  }

  public async getScheduleById(id: string): Promise<Record<string, any>> {
    return this.repository.getScheduleById(id as any)
  }

  public async createSchedules(payload: Record<string, any>): Promise<Record<string, any>> {
    return this.repository.createSchedules(payload)
  }

  public async updateSchedules(
    id: number | string,
    payload: Record<string, any>,
  ): Promise<Record<string, any>> {
    return this.repository.updateSchedules(id, payload)
  }

  public async deleteSchedule(id: number | string): Promise<any> {
    return this.repository.deleteSchedule(id)
  }

  public async getSlots(params: DeliverySlotsParams): Promise<DeliverySlot[]> {
    return this.repository.getSlots(params)
  }

  public async createBooking(payload: DeliverySlotsCreateBooking): Promise<{ bookingId: string }> {
    return this.repository.createBooking(payload)
  }

  public async deleteBooking(id: string): Promise<any> {
    return this.repository.deleteBooking(id)
  }

  async getTrackingPageUrl(id: string): Promise<any> {
    const { trackingPageUrl } = await this.repository.getTrackingPageUrl(id)
    return trackingPageUrl
  }

  async generateInternalTrackingURL(accessToken: string, language: string): Promise<string> {
    return `${Config.get('VUE_APP_FRONT_OFFICE_BASE_URL')}/t/${accessToken}?language=${language}`
  }

  async generateInternalMultiTrackingURL(accessToken: string, language: string): Promise<string> {
    return `${Config.get('VUE_APP_FRONT_OFFICE_BASE_URL')}/m/${accessToken}?language=${language}`
  }

  async updateStatus(id: number, params: DialogOrderDetailUpdateStatus): Promise<any> {
    const { status, comment, timezone, date, time, files, parcelId, subStatus } = params
    const [hours, minutes] = time.toString().split(':')

    const payload = {
      status,
      comment,
      date: dateHelperGetUtcDate(
        dateHelperSetUtcTime(new Date(date), {
          hours: Number(hours),
          minutes: Number(minutes),
          seconds: 0,
          milliseconds: 0,
        }).toISOString(),
        timezone,
      ).toISOString(),
      parcelId,
      ...(subStatus && { subStatus }),
    }
    const form = new FormData()

    if (files?.length) {
      for (const key in files) {
        if (files[key]) {
          form.append('files', files[key])
        }
      }
    }

    for (const [key, value] of Object.entries(payload)) {
      if (value !== undefined) {
        form.append(key, value)
      }
    }

    return this.repository.updateStatus(id, form, DEFAULT_OPTIONS)
  }

  createAppointment(id: string, appointment: { start: string; end: string }): Promise<void> {
    return this.repository.createAppointment(id, appointment)
  }

  close(id: string, payload: OrderDetailCloseDelivery): Promise<any> {
    return this.repository.close(id, payload)
  }

  public getPackageFollow(id: number, packageId: number): Promise<any> {
    return this.repository.getPackageFollow(id, packageId)
  }

  public async getScore(id: string): Promise<any> {
    const { deliveryScore } = await this.repository.getScore(id)
    return deliveryScore
  }

  public async downloadSlip(params: Record<string, any>): Promise<string> {
    const { data } = await this.repository.downloadSlip(params)
    return data
  }
}

export default new DeliveryService()
