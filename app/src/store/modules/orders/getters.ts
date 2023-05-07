import { DELIVERY_STATUS } from '@/constants'
import { ORDER_STATUS } from '@/constants/shared'
import { OrderLightEntity } from '@/types'
import { OrdersState } from './types'

const isMergeMode = (state: OrdersState): boolean => {
  return state.isMergeMode
}

const mainOrderToMerge = (state: OrdersState): OrderLightEntity | null => {
  return state.merge.main
}

const ordersToMerge = (state: OrdersState): OrderLightEntity[] => {
  return state.merge.toMerge
}

const isLabelMode = (state: OrdersState): boolean => {
  return state.isLabelMode
}

const labels = (state: OrdersState): OrderLightEntity[] => {
  return state.labels
}

const isInOrdersBeingMerged = (state: OrdersState) => (
  externalOrderId: string,
  orderId: number,
): boolean => {
  let returnValue = false

  if (!externalOrderId) {
    return returnValue
  }

  if (state.merge.toMerge.some((order: OrderLightEntity) => order.orderId === orderId)) {
    returnValue = true
  }

  return returnValue
}

const isMainOrderBeingMerged = (state: OrdersState) => (
  externalOrderId: string,
  orderId: number,
): boolean => {
  let returnValue = false

  if (!externalOrderId) {
    return returnValue
  }

  if (state.merge.main && state.merge.main.orderId === orderId) {
    returnValue = true
  }

  return returnValue
}

const canBeMerged = (state: OrdersState) => (localOrder: OrderLightEntity): boolean => {
  const {
    externalOrderId,
    orderCurrentStatus,
    deliveryCurrentStatus,
    retailerId,
    storeId,
  } = localOrder

  if (!externalOrderId) {
    return false
  }

  const unmergableStatuses = [
    ORDER_STATUS.TO_BE_COMPLETED,
    ORDER_STATUS.CANCELLED,
    ORDER_STATUS.DELIVERED,
  ]
  const allowedStatuses: string[] = [
    DELIVERY_STATUS.INIT,
    DELIVERY_STATUS.PICK_UP_KO,
    DELIVERY_STATUS.RETURNED_TO_SENDER,
  ]

  let sameEntity = true

  if (state.merge.toMerge.length || state.merge.main) {
    if (state.merge.main) {
      const { retailerId: mainRetailerId, storeId: mainStoreId } = state.merge.main
      sameEntity = mainRetailerId === retailerId && mainStoreId === storeId
    } else {
      sameEntity = state.merge.toMerge.every(
        (order: OrderLightEntity) => order.retailerId === retailerId && order.storeId === storeId,
      )
    }
  }

  return (
    sameEntity &&
    (!unmergableStatuses.includes(orderCurrentStatus) ||
      allowedStatuses.includes(deliveryCurrentStatus as string))
  )
}

export default {
  isMergeMode,
  mainOrderToMerge,
  ordersToMerge,
  isLabelMode,
  labels,
  isInOrdersBeingMerged,
  isMainOrderBeingMerged,
  canBeMerged,
}
