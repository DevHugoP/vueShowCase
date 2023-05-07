import { dateHelper } from '@/helpers/dateHelper'
import AddressService from '@/services/address/AddressService'
import OpeningHoursIntervalService from '@/services/openingHoursInterval/openingHoursIntervalService'
import RepositoryFactory from '@/services/RepositoryFactory'
import {
  DayCapacity,
  ExchangePlaceEntity,
  Filters,
  FrequencyAvailable,
  getDefaultExchangePlace,
  getDefaultOpenningHour,
  OpeningHours,
} from '@/types'
import ExchangePlaceRepository, { IExchangePlaceRepository } from './ExchangePlaceRepository'

export class ExchangePlaceService {
  private exchangePlaceRepository: IExchangePlaceRepository & ExchangePlaceRepository

  constructor() {
    this.exchangePlaceRepository = RepositoryFactory.get('exchangePlace')
  }

  public async getAll(params: Record<string, any> = {}): Promise<ExchangePlaceEntity[]> {
    const { exchangePlaces } = await this.exchangePlaceRepository.getAll(params)

    return exchangePlaces
  }

  public async get(id: number): Promise<ExchangePlaceEntity> {
    const { exchangePlace } = await this.exchangePlaceRepository.get(id)

    return exchangePlace
  }

  public async create(exchangePlace: Record<string, any>): Promise<ExchangePlaceEntity> {
    const { exchangePlace: createdExchangePlace } = await this.exchangePlaceRepository.create(
      exchangePlace,
    )

    return createdExchangePlace
  }

  public async update(
    id: string | number,
    exchangePlace: Record<string, any>,
  ): Promise<ExchangePlaceEntity> {
    const { exchangePlace: updatedExchangePlace } = await this.exchangePlaceRepository.update(
      id,
      exchangePlace,
    )

    return updatedExchangePlace
  }

  public async updateValidityPeriod(
    id: string | number,
    exchangePlace: Record<string, any>,
  ): Promise<ExchangePlaceEntity> {
    const {
      exchangePlace: updatedExchangePlace,
    } = await this.exchangePlaceRepository.updateValidityPeriod(id, exchangePlace)

    return updatedExchangePlace
  }

  public async updateExceptions(
    id: string | number,
    exceptions: Array<Record<string, any>>,
  ): Promise<ExchangePlaceEntity> {
    const {
      exchangePlace: updatedExchangePlace,
    } = await this.exchangePlaceRepository.updateExceptions(id, { exceptions })

    return updatedExchangePlace
  }

  public async updateSchedules(
    id: string | number,
    schedule: Record<string, any>,
  ): Promise<ExchangePlaceEntity> {
    const {
      exchangePlace: updatedExchangePlace,
    } = await this.exchangePlaceRepository.updateSchedules(id, { schedule })

    return updatedExchangePlace
  }

  public async updateWeightingIndexes(
    id: number | string,
    payload: Record<string, any>,
  ): Promise<ExchangePlaceEntity> {
    const { exchangePlace } = await this.exchangePlaceRepository.updateWeightingIndexes(id, payload)

    return exchangePlace
  }

  public async getFilters(params: Record<string, any> = {}): Promise<Filters[]> {
    const { exchangePlaces } = await this.exchangePlaceRepository.getFilters(params)

    return exchangePlaces
  }

  public buildExchangePlace(
    exchangePlace: ExchangePlaceEntity,
    canOpeningHoursBeEmpty = false,
    hasSeveralAddress = false,
  ): ExchangePlaceEntity {
    const localExchangePlace = { ...getDefaultExchangePlace(), ...exchangePlace }

    localExchangePlace.address = AddressService.BuildAddress(
      exchangePlace.address,
      hasSeveralAddress,
    )
    localExchangePlace.openingHours = this.buildExchangePlaceOpeningHours(
      exchangePlace.openingHours,
      exchangePlace.timezone,
      canOpeningHoursBeEmpty,
    )

    return localExchangePlace
  }

  public generateSlots(
    openingHours: OpeningHours,
    frequencyType: string,
  ): Record<string, DayCapacity[]> {
    const slots: Record<string, DayCapacity[]> = {}

    // Go through opening hour define in the exchangePlace
    for (const [key, value] of Object.entries(openingHours)) {
      // Capacity for the day to []
      slots[key] = []

      // Value is the slots define for the day
      for (const time of value) {
        const currentDate = dateHelper.getDate()

        // Get start hour and end hour for the current slot
        const [beginHours, beginMinutes] = time.start.split(':')
        const [endHours, endMinutes] = time.end.split(':')

        let start = dateHelper.set(currentDate, {
          hours: beginHours,
          minutes: beginMinutes,
          seconds: 0,
        })

        const end = dateHelper.set(currentDate, {
          hours: endHours,
          minutes: endMinutes,
          seconds: 0,
        })

        // if frequency is custom
        if (frequencyType === FrequencyAvailable.CUSTOM) {
          continue
        }

        // Create enough capacity slot inside a opening slot
        while (
          dateHelper.isSameOrBefore(
            dateHelper.add(start, this.getAddedTime(frequencyType) as Duration),
            end,
          )
        ) {
          const next = dateHelper.add(start, this.getAddedTime(frequencyType) as Duration)

          slots[key].push({
            start: `${this.formatHourMinute(start.getHours().toString())}:${this.formatHourMinute(
              start.getMinutes().toString(),
            )}`,
            end: `${this.formatHourMinute(next.getHours().toString())}:${this.formatHourMinute(
              next.getMinutes().toString(),
            )}`,
            capacity: 0,
          })

          start = next
        }
      }
    }

    return this.sortSlots(slots)
  }

  private buildExchangePlaceOpeningHours(
    openingHours: OpeningHours,
    timezone: string,
    canOpeningHoursBeEmpty = false,
  ): OpeningHours {
    const localOpeningHours = getDefaultOpenningHour()

    for (const day in openingHours) {
      if (openingHours[day]) {
        for (const slot of openingHours[day]) {
          slot.start = dateHelper.formatToTimezone(
            dateHelper.getUtcDate(slot.start, 'UTC'),
            timezone,
            'p',
          )
          slot.end = dateHelper.formatToTimezone(
            dateHelper.getUtcDate(slot.end, 'UTC'),
            timezone,
            'p',
          )
        }
      }
    }

    localOpeningHours.monday =
      openingHours.monday ||
      (canOpeningHoursBeEmpty ? [] : [OpeningHoursIntervalService.buildOpeningHoursInterval()])
    localOpeningHours.tuesday =
      openingHours.tuesday ||
      (canOpeningHoursBeEmpty ? [] : [OpeningHoursIntervalService.buildOpeningHoursInterval()])
    localOpeningHours.wednesday =
      openingHours.wednesday ||
      (canOpeningHoursBeEmpty ? [] : [OpeningHoursIntervalService.buildOpeningHoursInterval()])
    localOpeningHours.thursday =
      openingHours.thursday ||
      (canOpeningHoursBeEmpty ? [] : [OpeningHoursIntervalService.buildOpeningHoursInterval()])
    localOpeningHours.friday =
      openingHours.friday ||
      (canOpeningHoursBeEmpty ? [] : [OpeningHoursIntervalService.buildOpeningHoursInterval()])
    localOpeningHours.saturday =
      openingHours.saturday ||
      (canOpeningHoursBeEmpty ? [] : [OpeningHoursIntervalService.buildOpeningHoursInterval()])
    localOpeningHours.sunday =
      openingHours.sunday ||
      (canOpeningHoursBeEmpty ? [] : [OpeningHoursIntervalService.buildOpeningHoursInterval()])

    return localOpeningHours
  }

  private getAddedTime(frequencyType: string) {
    switch (frequencyType) {
      case FrequencyAvailable.QUARTER:
        return { minutes: 15 }
      case FrequencyAvailable.DEMI:
        return { minutes: 30 }
      case FrequencyAvailable.HOUR:
        return { hours: 1 }
    }
  }

  private sortSlots(slots: Record<string, DayCapacity[]>): Record<string, DayCapacity[]> {
    for (const day in slots) {
      if (slots[day]) {
        slots[day].sort((slotA, slotB) => (slotA.start > slotB.start ? 1 : -1))
      }
    }
    return slots
  }

  private formatHourMinute(time: string) {
    return `${time.length === 1 ? '0' : ''}${time}`
  }
}

export default new ExchangePlaceService()
