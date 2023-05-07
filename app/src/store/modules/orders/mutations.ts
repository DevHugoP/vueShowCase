import { DataMutation, Mutation } from '@/store/types'
import {
  PUSH_LABELS,
  PUSH_ORDER_TO_MERGE,
  REMOVE_LABELS,
  REMOVE_ORDER_TO_MERGE,
  RESET_LABELS,
  RESET_MERGE,
  SET_IS_LABEL_MODE,
  SET_IS_MERGE_MODE,
  SET_MAIN_ORDER_TO_MERGE,
} from './mutations-types'
import { OrdersState } from './types'
import { OrderLightEntity } from '@/types'

const setIsMergeMode: DataMutation<OrdersState, boolean> = (state, value) => {
  state.isMergeMode = value
}

const setMainOrderToMerge: DataMutation<OrdersState, OrderLightEntity> = (state, value) => {
  state.merge.main = value
}

const pushOrderToMerge: DataMutation<OrdersState, OrderLightEntity> = (state, value) => {
  const { toMerge } = state.merge

  if (toMerge.some((order: OrderLightEntity) => order.orderId === value.orderId)) {
    return
  }

  state.merge.toMerge.push(value)
}

const removeOrderToMerge: DataMutation<OrdersState, OrderLightEntity> = (state, value) => {
  const { toMerge } = state.merge

  state.merge.toMerge = toMerge.filter(merge => value.orderId !== merge.orderId)
}

const resetMerge: Mutation<OrdersState> = state => {
  state.isMergeMode = false
  state.merge = {
    main: null,
    toMerge: [],
  }
}

const setIsLabelMode: DataMutation<OrdersState, boolean> = (state, value) => {
  state.isLabelMode = value
}

const pushLabels: DataMutation<OrdersState, OrderLightEntity> = (state, value) => {
  state.labels.push(value)
}

const removeLabels: DataMutation<OrdersState, OrderLightEntity> = (state, value) => {
  state.labels = state.labels.filter(label => value.orderId !== label.orderId)
}

const resetLabels: Mutation<OrdersState> = state => {
  state.isLabelMode = false
  state.labels = []
}

export default {
  [SET_IS_MERGE_MODE]: setIsMergeMode,
  [SET_MAIN_ORDER_TO_MERGE]: setMainOrderToMerge,
  [PUSH_ORDER_TO_MERGE]: pushOrderToMerge,
  [REMOVE_ORDER_TO_MERGE]: removeOrderToMerge,
  [RESET_MERGE]: resetMerge,
  [SET_IS_LABEL_MODE]: setIsLabelMode,
  [PUSH_LABELS]: pushLabels,
  [REMOVE_LABELS]: removeLabels,
  [RESET_LABELS]: resetLabels,
}
