import { ORDER_LIST_PANEL_TYPE } from '@/constants'
import { Action } from '@/store/types'
import { OrderLightEntity } from '@/types'
import {
  PUSH_LABELS,
  PUSH_ORDER_TO_MERGE,
  REMOVE_LABELS,
  REMOVE_ORDER_TO_MERGE,
  SET_MAIN_ORDER_TO_MERGE,
} from './mutations-types'
import { OrdersState } from './types'

const setMainOrderToMerge: Action<OrdersState> | any = (
  { commit }: any,
  payload: {
    externalOrderId: string
    orderId: number
    retailerId: number
    storeId: number
    mainOrderToMerge: OrderLightEntity | null
    ordersToMerge: OrderLightEntity[]
  },
) => {
  if (payload.mainOrderToMerge) {
    commit(PUSH_ORDER_TO_MERGE, payload.mainOrderToMerge)
  }

  if (payload.ordersToMerge.some((order: OrderLightEntity) => order.orderId === payload.orderId)) {
    commit(REMOVE_ORDER_TO_MERGE, {
      externalOrderId: payload.externalOrderId,
      orderId: payload.orderId,
      retailerId: payload.retailerId,
      storeId: payload.storeId,
    })
  }

  commit(SET_MAIN_ORDER_TO_MERGE, {
    externalOrderId: payload.externalOrderId,
    orderId: payload.orderId,
    retailerId: payload.retailerId,
    storeId: payload.storeId,
  })
}

const pushOrderToMerge: Action<OrdersState> | any = (
  { commit }: any,
  payload: {
    externalOrderId: string
    orderId: number
    retailerId: number
    storeId: number
    mainOrderToMerge: OrderLightEntity | null
  },
) => {
  if (
    payload.mainOrderToMerge &&
    payload.mainOrderToMerge.externalOrderId === payload.externalOrderId
  ) {
    commit(SET_MAIN_ORDER_TO_MERGE, '')
  }

  commit(PUSH_ORDER_TO_MERGE, {
    externalOrderId: payload.externalOrderId,
    orderId: payload.orderId,
    retailerId: payload.retailerId,
    storeId: payload.storeId,
  })
}

const manageLabels: Action<OrdersState> | any = (
  { commit }: any,
  payload: { order: OrderLightEntity; labels: OrderLightEntity[] },
) => {
  const labelIndex = payload.labels.findIndex(label => label.orderId === payload.order.orderId)

  if (labelIndex === -1) {
    commit(PUSH_LABELS, payload.order)
  } else {
    commit(REMOVE_LABELS, payload.order)
  }
}

const clearControlPanel: Action<OrdersState> | any = (
  { commit }: any,
  payload: {
    externalOrderId: string
    orderId: number
    retailerId: number
    storeId: number
    order: OrderLightEntity
  },
) => {
  commit(REMOVE_ORDER_TO_MERGE, {
    externalOrderId: payload.externalOrderId,
    orderId: payload.orderId,
    retailerId: payload.retailerId,
    storeId: payload.storeId,
  })

  commit(SET_MAIN_ORDER_TO_MERGE, '')

  commit(REMOVE_LABELS, payload.order)
}

const handleCloseOverlay: Action<OrdersState> | any = (
  context: any,
  payload: {
    externalOrderId: string
    orderId: number
    retailerId: number
    storeId: number
    order: OrderLightEntity
    panelType: string
  },
) => {
  switch (payload.panelType) {
    case ORDER_LIST_PANEL_TYPE.MERGE:
      if (context.getters.isInOrdersBeingMerged(payload.externalOrderId, payload.orderId)) {
        context.commit(REMOVE_ORDER_TO_MERGE, {
          externalOrderId: payload.externalOrderId,
          orderId: payload.orderId,
          retailerId: payload.retailerId,
          storeId: payload.storeId,
        })
      } else if (context.getters.isMainOrderBeingMerged(payload.externalOrderId, payload.orderId)) {
        context.commit(SET_MAIN_ORDER_TO_MERGE, '')
      }
      break
    case ORDER_LIST_PANEL_TYPE.LABEL:
      context.commit(REMOVE_LABELS, payload.order)
      break
  }
}

export default {
  setMainOrderToMerge,
  pushOrderToMerge,
  manageLabels,
  clearControlPanel,
  handleCloseOverlay,
}
