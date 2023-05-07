import { COUNTRY } from '@/constants/shared'
import { parsePhoneNumber } from 'libphonenumber-js'

export default {
  getCountries(): string[] {
    return Object.values(COUNTRY)
  },
  isValid(num: string, countryCode?: any): boolean {
    const phoneNumber = parsePhoneNumber(num, countryCode)

    return phoneNumber.isValid()
  },
  getCountryCode(num: string): string | undefined {
    try {
      const phoneNumber = parsePhoneNumber(num)

      if (phoneNumber.isValid()) {
        return phoneNumber.country
      }

      return undefined
    } catch (e) {
      return undefined
    }
  },
}
