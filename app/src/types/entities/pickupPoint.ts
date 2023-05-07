import { Address, Coordinates, OpeningHours, Unit } from '..'

export interface PickupPoint {
  id: string
  coordinates: Coordinates
  address: Address
  openingHours: OpeningHours
  closingDates: string[]
  packageMaxWeight: Unit
  carrier: {
    code: string
    name: string
  }
  type?: string
  category?: string
}
