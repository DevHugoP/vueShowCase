import { getDefaultOpenningHourInterval, DateInterval } from '@/types'

export class OpeningHoursIntervalService {
  public buildOpeningHoursInterval(openingHoursInterval?: DateInterval): DateInterval {
    return { ...getDefaultOpenningHourInterval(), ...openingHoursInterval }
  }
}

export default new OpeningHoursIntervalService()
