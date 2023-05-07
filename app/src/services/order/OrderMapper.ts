import { COUNTRY } from '@/constants/shared'
import objectHelper from '@/helpers/objectHelper'
import { Address } from '@/types'

export default class OrderMapper {
  static getCountryName(country: string): string {
    const countryKey = objectHelper.getKeyFromValue(COUNTRY, country)

    return countryKey.charAt(0).toUpperCase() + countryKey.slice(1).toLowerCase()
  }

  static getFormatedAddress(address: Address): string {
    const { addressLine1, postalCode, country, city, formated } = address

    return formated || `${addressLine1}, ${postalCode} ${city}, ${this.getCountryName(country)}`
  }
}
