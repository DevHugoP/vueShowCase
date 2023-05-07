import { ExchangePlaceState } from './types'
import { ExchangePlaceEntity } from '@/types'

const exchangePlaceData = (state: ExchangePlaceState): ExchangePlaceEntity => {
  return state.exchangePlace
}

const updatedSlots = (state: ExchangePlaceState): Record<string, Record<string, any[]>> =>
  state.updatedSlots

export default { exchangePlaceData, updatedSlots }
