import actions from '@/store/actions'
import getters from '@/store/getters'
import auth from '@/store/modules/auth'
import carrier from '@/store/modules/carrier'
import carrierEligibility from '@/store/modules/carrierEligibility'
import dashboard from '@/store/modules/dashboard'
import exchangePlace from '@/store/modules/exchangePlace'
import filters from '@/store/modules/filters'
import orders from '@/store/modules/orders'
import retailer from '@/store/modules/retailer'
import rulesGroups from '@/store/modules/rulesGroups'
import store from '@/store/modules/store'
import user from '@/store/modules/user'
import alert from '@/store/modules/alert'
import mutations from '@/store/mutations'
import { RootState, SnackBarType } from '@/store/types'
import Vue from 'vue'
import Vuex from 'vuex'
import createOrder from './modules/createOrder'
import createOrderArrival from './modules/createOrder/arrival'
import createOrderCarriers from './modules/createOrder/carriers'
import createOrderCustomerCode from './modules/createOrder/customerCode'
import createOrderState from './modules/createOrder/state'
import createOrderDeliveryContact from './modules/createOrder/deliveryContact'
import createOrderDeliveryDate from './modules/createOrder/deliveryDate'
import createOrderDeparture from './modules/createOrder/departure'
import createOrderOrderContent from './modules/createOrder/orderContent'
import createOrderPickupPoint from './modules/createOrder/pickupPoint'
import createOrderSenderIdentity from './modules/createOrder/senderIdentity'
import createOrderService from './modules/createOrder/service'
import createOrderShippingContact from './modules/createOrder/shippingContact'
import createOrderShippingDate from './modules/createOrder/shippingDate'
import createOrderScan from './modules/createOrder/scan'

Vue.use(Vuex)

const state: RootState = {
  isLoadingApp: true,
  hasStepper: false,
  headerTitle: '',
  headerData: '',
  hasLightLayout: false,
  hasCenteredContent: true,
  breadcrumbsLabel: '',
  snackbar: {
    showing: false,
    type: SnackBarType.INFO,
    message: '',
    timeout: 2000,
    clearable: false,
  },
  showLoader: false,
}

const localStore = new Vuex.Store({
  modules: {
    auth: {
      namespaced: true,
      ...auth,
    },
    orders: {
      namespaced: true,
      ...orders,
    },
    exchangePlace: {
      namespaced: true,
      ...exchangePlace,
    },
    filters: {
      namespaced: true,
      ...filters,
    },
    carrier: {
      namespaced: true,
      ...carrier,
    },
    store: {
      namespaced: true,
      ...store,
    },
    retailer: {
      namespaced: true,
      ...retailer,
    },
    carrierEligibility: {
      namespaced: true,
      ...carrierEligibility,
    },
    rulesGroups: {
      namespaced: true,
      ...rulesGroups,
    },
    user: {
      namespaced: true,
      ...user,
    },
    dashboard: {
      namespaced: true,
      ...dashboard,
    },
    alert: {
      namespaced: true,
      ...alert,
    },
  },
  state,
  actions,
  getters,
  mutations,
})

localStore.registerModule('createOrder/senderIdentity', {
  ...createOrderSenderIdentity(localStore),
  namespaced: true,
})

localStore.registerModule('createOrder/departure', {
  ...createOrderDeparture(localStore),
  namespaced: true,
})

localStore.registerModule('createOrder/arrival', {
  ...createOrderArrival(localStore),
  namespaced: true,
})

localStore.registerModule('createOrder/orderContent', {
  ...createOrderOrderContent(localStore),
  namespaced: true,
})

localStore.registerModule('createOrder/service', {
  ...createOrderService(localStore),
  namespaced: true,
})

localStore.registerModule('createOrder/shippingDate', {
  ...createOrderShippingDate(localStore),
  namespaced: true,
})

localStore.registerModule('createOrder/deliveryDate', {
  ...createOrderDeliveryDate(localStore),
  namespaced: true,
})

localStore.registerModule('createOrder/customerCode', {
  ...createOrderCustomerCode(localStore),
  namespaced: true,
})

localStore.registerModule('createOrder/state', {
  ...createOrderState(localStore),
  namespaced: true,
})

localStore.registerModule('createOrder/carriers', {
  ...createOrderCarriers(localStore),
  namespaced: true,
})

localStore.registerModule('createOrder/shippingContact', {
  ...createOrderShippingContact(localStore),
  namespaced: true,
})

localStore.registerModule('createOrder/deliveryContact', {
  ...createOrderDeliveryContact(localStore),
  namespaced: true,
})

localStore.registerModule('createOrder/pickupPoint', {
  ...createOrderPickupPoint(localStore),
  namespaced: true,
})

localStore.registerModule('createOrder/scan', {
  ...createOrderScan(localStore),
  namespaced: true,
})

localStore.registerModule('createOrder', { ...createOrder(localStore), namespaced: true })

export default localStore
