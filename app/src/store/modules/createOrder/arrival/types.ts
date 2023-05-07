export enum CreateOrderArrivalType {
  HOME = 'HOME',
  PICKUP_POINT = 'PICKUP_POINT',
}

export interface CreateOrderStateArrival {
  addressLine1: string
  addressLine2?: string
  city: string
  country: string
  doorCode?: string | null
  elevator?: boolean | null
  exchangePlaceId?: string | number | null
  floor?: number | null
  postalCode: string
  type?: string
  comment?: string
  district?: string | null
  formated?: string
  typeFront?: number | null
  arrivalType: CreateOrderArrivalType | null
  storeId?: number
  pickupPointId?: string
  carrierCode?: string
  scanVariant: boolean
}
