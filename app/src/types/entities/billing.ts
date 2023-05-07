export interface BillingEntity {
  id: number
  taxExcludedAmount: number
  taxIncludedAmount: number
  taxAmount: number
  currency: string
  date: string
  reason: string | null
  comment: string
  retailerId: number
  carrierId: number
  deliveryId: string
  createdAt: string
  updatedAt: string
}

export interface BillingFilter {
  retailerId?: number
  carrierId?: number
  deliveryId: string
}
