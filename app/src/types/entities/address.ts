export type AutoCompleteFilter = {
  input: string
  sessionToken: string
}

export type DetailFilter = {
  placeId: string
  sessionToken: string
}

export type AddressDescription = {
  address: string
  placeId: string
}

export enum AddressType {
  ADDRESS = 'address',
  PICKUP_POINT = 'pickupPoint',
  EXCHANGE_PLACE = 'exchangePlace',
}
