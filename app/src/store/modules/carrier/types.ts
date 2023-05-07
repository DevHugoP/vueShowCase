import { CarrierEntity } from '@/types'

export interface CarrierState {
  carriers: CarrierEntity[]
  carrier: CarrierEntity
  carriersLight: Array<{ id: number; name: string }>
}
