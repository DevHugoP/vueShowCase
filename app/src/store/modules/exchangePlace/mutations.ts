import { DataMutation } from '@/store/types'
import { ExchangePlaceState } from './types'
import { ExchangePlaceEntity } from '@/types'
import { SET_EXCHANGE_PLACE_DATA, SET_UPDATED_SLOTS } from './mutations-type'

const mutationSetExchangePlaceData: DataMutation<ExchangePlaceState, ExchangePlaceEntity> = (
  state,
  exchangePlaceData,
) => {
  state.exchangePlace = exchangePlaceData
}

const mutationSetUpdatedSlots: DataMutation<
  ExchangePlaceState,
  Record<string, Record<string, any[]>>
> = (state, value) => (state.updatedSlots = value)

export default {
  [SET_EXCHANGE_PLACE_DATA]: mutationSetExchangePlaceData,
  [SET_UPDATED_SLOTS]: mutationSetUpdatedSlots,
}
