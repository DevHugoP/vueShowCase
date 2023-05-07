import { dateHelper } from '@/helpers/dateHelper'
import ContactMapper from '@/services/contact/ContactMapper'
import { CreateExchangePlace, ExchangePlaceEntity, OpeningHours } from '@/types'

export default class ExchangePlaceMapper {
  static toDto(exchangePlace: ExchangePlaceEntity): CreateExchangePlace {
    const { contacts, timezone } = exchangePlace
    let { openingHours } = exchangePlace

    openingHours = this.hourToUtc(openingHours, timezone)

    return {
      ...exchangePlace,
      openingHours,
      contacts: contacts.map(contact => ContactMapper.toDto(contact)),
    }
  }

  static hourToUtc(planning: OpeningHours, timezone: string): OpeningHours {
    for (const day in planning) {
      if (planning[day]) {
        for (const slot of planning[day]) {
          const slipStartDate = dateHelper
            .getUtcDate(slot.start, timezone)
            .toISOString()
            .split('T')[1]
            .split(':')

          const slipEndDate = dateHelper
            .getUtcDate(slot.end, timezone)
            .toISOString()
            .split('T')[1]
            .split(':')

          slot.start = `${this.formatHour(slipStartDate[0])}:${this.formatHour(slipStartDate[1])}`
          slot.end = `${this.formatHour(slipEndDate[0])}:${this.formatHour(slipEndDate[1])}`
        }
      }
    }

    return planning
  }

  static formatHour(hour: string): string {
    if (hour.length === 1) {
      return `0${hour}`
    }
    return hour
  }
}
