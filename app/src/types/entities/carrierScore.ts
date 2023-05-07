export type CarrierScoreFilter = {
  carrierId: number | string
  retailerId?: number | string
  storeId?: number | string
  exchangePlaceId?: number | string
}

export type CarrierScore = {
  carrierId: number
  retailerId?: number
  storeId?: number
  exchangePlaceId?: number
  nps: number
  satisfaction: number
  onTimeDeliveryScore: number
}
