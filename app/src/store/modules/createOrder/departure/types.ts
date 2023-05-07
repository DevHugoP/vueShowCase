export interface CreateOrderStateDeparture {
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
}
