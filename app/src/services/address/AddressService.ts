import RepositoryFactory from '@/services/RepositoryFactory'
import {
  AddressDescription,
  AutoCompleteFilter,
  DetailFilter,
  Address,
  getDefaultAddress,
  Coordinates,
} from '@/types'
import ContactService from '@/services/contact/contactService'
import { IAddressRepository } from './AddressRepository'

export class AddressService {
  private addressRepository: IAddressRepository

  constructor() {
    this.addressRepository = RepositoryFactory.get('address')
  }

  public async autoComplete(params: AutoCompleteFilter): Promise<AddressDescription[]> {
    const { addresses } = await this.addressRepository.autoComplete(params)

    return addresses
  }

  public async getDetail(params: DetailFilter): Promise<Address> {
    const { address } = await this.addressRepository.getDetail(params)

    return address
  }

  public async getCoordinates(query: { address: Address }): Promise<Coordinates> {
    const { coordinates: calculatedCoordinates } = await this.addressRepository.getCoordinates(
      query,
    )

    return calculatedCoordinates
  }

  public BuildAddress(address?: Address, severalContactsAddress = false): Address {
    const localAddress = { ...getDefaultAddress(severalContactsAddress), ...address }

    if (
      address &&
      address.contacts &&
      address.contacts instanceof Array &&
      address.contacts.length > 0
    ) {
      localAddress.contacts = address.contacts
    } else {
      localAddress.contacts = severalContactsAddress
        ? [ContactService.buildContact()]
        : ContactService.buildContact()
    }
    return localAddress
  }

  public calculateDistanceBetweenCoordinates(
    coordinates1: Coordinates,
    coordinates2: Coordinates,
  ): number {
    const EARTH_RADIUS = 6371 // in km

    const { latitude: latitude1, longitude: lon1 } = coordinates1
    const { latitude: latitude2, longitude: lon2 } = coordinates2

    const dLat = this.toRad(latitude2 - latitude1)

    const dLon = this.toRad(lon2 - lon1)

    const lat1 = this.toRad(latitude1)
    const lat2 = this.toRad(latitude2)

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2)

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    return EARTH_RADIUS * c
  }

  /**
   * Convert degrees to radians
   */
  private toRad(degrees: number): number {
    return (degrees * Math.PI) / 180
  }
}

export default new AddressService()
