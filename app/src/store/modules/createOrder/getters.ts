// import clientPageService from '@/services/clientPage/clientPageService'
import {
  CreateOrderEntity,
  CreateOrderNewStateOrder,
  CreateOrderState,
  CreateOrderStateEligibility,
  CreateOrderStateMiscellaneous,
} from './types'

const order = (state: CreateOrderState): CreateOrderNewStateOrder => state.order
const miscellaneous = (state: CreateOrderState): CreateOrderStateMiscellaneous =>
  state.miscellaneous
const eligibility = (state: CreateOrderState): CreateOrderStateEligibility => state.eligibility

const orderFormattedData = (state: any, getters: any): CreateOrderEntity => {
  for (const localPackage of getters['orderContent/orderContent'].packages) {
    for (const reference of localPackage.references ? localPackage.references : []) {
      if (reference.reference && (!reference.barcode || !reference.barcode.value)) {
        reference.barcode = undefined
      }
    }
  }

  return {
    retailerId: getters['senderIdentity/senderIdentity'].retailerId,
    storeId: getters['senderIdentity/senderIdentity'].storeId,
    externalOrderId: getters['customerCode/customerCode'].externalOrderId,
    state: getters['state/stateValue'],
    picking: {
      address: getters['departure/departure'],
      contact: {
        ...getters['shippingContact/shippingContact'].contact,
        email: getters['shippingContact/shippingContact']?.contact?.email
          ? getters['shippingContact/shippingContact'].contact.email.toLowerCase()
          : '',
      },
      interval: getters['shippingDate/shippingDate'].interval,
    },
    delivery: {
      address: getters['arrival/arrival'],
      contact: {
        ...getters['deliveryContact/deliveryContact'].contact,
        email: getters['deliveryContact/deliveryContact']?.contact?.email
          ? getters['deliveryContact/deliveryContact'].contact.email.toLowerCase()
          : '',
      },
      interval: getters['deliveryDate/deliveryDate'].interval,
    },
    packages: getters['orderContent/orderContent'].packages,
    pickupPoint: null,
    deliveryType: null,
    services: getters['service/service'].services,
    ...(getters['carriers/carriers'].carrierSelection && {
      carrierSelection: getters['carriers/carriers'].carrierSelection,
    }),
  }
}

export default { miscellaneous, order, eligibility, orderFormattedData }
