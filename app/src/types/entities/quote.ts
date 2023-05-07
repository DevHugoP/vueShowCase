export interface QuoteEntity {
  id: number
  externalQuoteId: string
  taxExcludedAmount: number
  taxIncludedAmount: number
  taxAmount: number
  currency: string
  vehicleType: string
  orderId: number
  carrierId: number
  createdAt: string
  updatedAt: string
  score: {
    total: number
    price: [number, number]
    environment: [number, number]
    satisfaction: [number, number]
  }
  eligibilitySpecifications?: {
    label: boolean
    cancelOrder: boolean
    updateOrder: boolean
    closeDelivery: boolean
    carrierTracking: boolean
  }
  comment: string | null
  reasons: string[] | null
  refused: boolean
  manual: boolean
  isOutdated: boolean
}
