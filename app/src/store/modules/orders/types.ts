import { OrderLightEntity } from '@/types'

export interface OrdersState {
  isMergeMode: boolean
  merge: {
    main: OrderLightEntity | null
    toMerge: OrderLightEntity[]
  }
  isLabelMode: boolean
  labels: OrderLightEntity[]
}
