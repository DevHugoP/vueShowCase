import { ExchangePlaceEntity } from '@/types'

export interface ExchangePlaceState {
  exchangePlace: ExchangePlaceEntity
  updatedSlots: Record<string, Record<string, any[]>>
}
