import { LOCAL_STORAGE, ROUTES } from '@/constants'
import AuthorizationService from '@/services/authorization/AuthorizationService'
import OrderService from '@/services/order/OrderService'
import store from '@/store'
import { SET_HAS_CENTERED_CONTENT, SET_HAS_LIGHT_LAYOUT } from '@/store/mutation-types'
import { BreadCrumb, RulesKey } from '@/types'
import { CurrentContext, PermissionRules } from '@/types/entities/user'
import Vue from 'vue'
import VueRouter, { Location } from 'vue-router'
import routes from './routes'

Vue.use(VueRouter)

const router = new VueRouter({
  scrollBehavior() {
    return { x: 0, y: 0 }
  },
  mode: 'history',
  routes,
})

/**
 * Navigation Guards
 */

// Helpers functions
const allowedUnauthenticatedRoutes: string[] = [
  ROUTES.login,
  ROUTES.specificPartnerLogin,
  ROUTES.termsConditions,
  ROUTES.about,
  ROUTES.contact,
]

const routesRules: Record<string, RulesKey | RulesKey[]> = {
  [ROUTES.orders]: 'LIST_ORDERS',
  [ROUTES.dashboard]: 'READ_DASHBOARD',
  [ROUTES.detailOrder]: 'READ_ORDERS',
  [ROUTES.createOrder]: 'CREATE_ORDERS',
  [ROUTES.retailers]: 'LIST_RETAILERS',
  [ROUTES.detailRetailer]: 'READ_RETAILERS',
  [ROUTES.addRetailer]: 'CREATE_RETAILERS',
  [ROUTES.editRetailer]: 'EDIT_RETAILERS',
  [ROUTES.addClientPage]: 'CREATE_CLIENT_PAGES',
  [ROUTES.editClientPage]: 'EDIT_CLIENT_PAGES',
  [ROUTES.detailClientPage]: 'READ_CLIENT_PAGES',
  [ROUTES.detailStore]: 'READ_STORES',
  [ROUTES.createStore]: 'CREATE_STORES',
  [ROUTES.updateStore]: 'EDIT_STORES',
  [ROUTES.exchangePlace]: 'READ_EXCHANGE_PLACES',
  [ROUTES.createExchangePlace]: 'CREATE_EXCHANGE_PLACES',
  [ROUTES.updateExchangePlace]: 'EDIT_EXCHANGE_PLACES',
  [ROUTES.createTypicalWeek]: 'WRITE_EXCHANGE_PLACE_SCHEDULES',
  [ROUTES.editTypicalWeek]: 'WRITE_EXCHANGE_PLACE_SCHEDULES',
  [ROUTES.validitySlotPeriod]: 'WRITE_EXCHANGE_PLACE_VALIDITY_PERIOD',
  [ROUTES.createExceptions]: 'WRITE_EXCHANGE_PLACE_SCHEDULE_EXCEPTIONS',
  [ROUTES.editExceptions]: 'WRITE_EXCHANGE_PLACE_SCHEDULE_EXCEPTIONS',
  [ROUTES.detailExceptions]: 'READ_EXCHANGE_PLACE_SCHEDULE_EXCEPTIONS',
  [ROUTES.users]: 'LIST_USERS',
  [ROUTES.addUser]: 'CREATE_USERS',
  [ROUTES.editUser]: 'EDIT_USERS',
  [ROUTES.addPermission]: 'CREATE_PERMISSIONS',
  [ROUTES.editPermission]: 'EDIT_PERMISSIONS',
  [ROUTES.rulesGroups]: 'LIST_RULES_GROUP',
  [ROUTES.editRulesGroup]: 'EDIT_RULES_GROUP',
  [ROUTES.addRulesGroup]: 'CREATE_RULES_GROUP',
  [ROUTES.carriers]: 'LIST_CARRIERS',
  [ROUTES.detailCarrier]: 'READ_CARRIERS',
  [ROUTES.addCarrier]: 'CREATE_CARRIERS',
  [ROUTES.editCarrier]: 'EDIT_CARRIERS',
  [ROUTES.administrationConfig]: 'READ_ADMINISTRATION',
  [ROUTES.administrationConfigEdit]: 'EDIT_ADMINISTRATION',
  [ROUTES.shareDashboard]: 'SHARE_DASHBOARD',
  [ROUTES.detailCollect]: 'READ_COLLECT',
  [ROUTES.listCollect]: 'LIST_COLLECTS',
  [ROUTES.notificationsReporting]: 'LIST_NOTIFICATION_STATE',
  [ROUTES.createNotification]: 'WRITE_NOTIFICATION_STATE',
  [ROUTES.editNotification]: 'WRITE_NOTIFICATION_STATE',
  [ROUTES.notificationDetail]: 'READ_NOTIFICATION_STATE',
  [ROUTES.statusMappings]: 'READ_CARRIERS_TECHNICAL',
  [ROUTES.alert]: 'LIST_USER_ALERTS',
  [ROUTES.alertConfigDetail]: 'LIST_ALERTS_SUBSCRIPTIONS',
  [ROUTES.alertConfigEdit]: 'CREATE_ALERTS_SUBSCRIPTIONS',
  [ROUTES.createProductReturn]: 'CREATE_PRODUCTS_RETURN',
  [ROUTES.notificationAdministration]: ['LIST_NOTIFICATION_ACTIVATION', 'LIST_RETAILERS'],
  [ROUTES.carrierFtpAccounts]: 'READ_CARRIERS_TECHNICAL',
  [ROUTES.retailerFtpAccounts]: 'LIST_RETAILER_FTP',
  [ROUTES.addCarrierFtpAccounts]: 'WRITE_CARRIER_FTP',
  [ROUTES.editCarrierFtpAccounts]: 'WRITE_CARRIER_FTP',
  [ROUTES.addRetailerFtpAccounts]: 'WRITE_RETAILER_FTP',
  [ROUTES.editRetailerFtpAccounts]: 'WRITE_RETAILER_FTP',
  [ROUTES.retailerCustomCheckout]: 'MANAGE_CUSTOM_CHECKOUT',
  [ROUTES.retailerEditCustomCheckout]: 'MANAGE_CUSTOM_CHECKOUT',
  [ROUTES.retailerCustomCheckoutPreview]: 'MANAGE_CUSTOM_CHECKOUT',
  [ROUTES.storeCustomCheckout]: 'MANAGE_CUSTOM_CHECKOUT',
  [ROUTES.storeEditCustomCheckout]: 'MANAGE_CUSTOM_CHECKOUT',
  [ROUTES.storeCustomCheckoutPreview]: 'MANAGE_CUSTOM_CHECKOUT',
}

const routesOperator: Record<string, string> = {
  [ROUTES.notificationAdministration]: 'AND',
}

export const redirectToLogin = (): void => {
  router.push(getLoginPage())
}

const getLoginPage = (): Location => {
  const specificPartnerCode = localStorage.getItem(LOCAL_STORAGE.SPECIFIC_PARTNER_LOGIN_CODE)

  if (specificPartnerCode) {
    return {
      name: ROUTES.specificPartnerLogin,
      params: {
        partnerCode: specificPartnerCode,
      },
    }
  }

  return { name: ROUTES.login }
}

const shouldRedirectToNoAccessPage = (
  routeName: string,
  permissions: PermissionRules[],
  rules: RulesKey | RulesKey[],
  context?: CurrentContext,
  operator?: string,
): boolean => {
  const profile = routeName === ROUTES.profile || routeName === ROUTES.editProfile
  if (routeName === ROUTES.noAccess || profile) {
    return false
  }

  if (allowedUnauthenticatedRoutes.includes(routeName)) {
    return false
  }

  if (!permissions.length) {
    return true
  }

  if (!rules || !rules.length) {
    return false
  }

  return !AuthorizationService.isAllowed(rules, permissions, context, operator)
}

export const applyRouterFirewall = (): void => {
  const { name, params, fullPath } = router.currentRoute

  if (!name) {
    return
  }

  // Redirect to login page when user is not authenticated
  if (
    !allowedUnauthenticatedRoutes.includes(name) &&
    !localStorage.getItem(LOCAL_STORAGE.ACCESS_TOKEN)
  ) {
    // When redirect to login, keep route want to access to redirect after login
    if (![ROUTES.noAccess, ROUTES.notFound].includes(name)) {
      localStorage.setItem(LOCAL_STORAGE.REQUESTED_PAGE, router.currentRoute.path)
    }

    router.push(getLoginPage())
    return
  }

  // Apply permissions
  const { permissions, features } = store.getters['auth/currentUser']

  if (features && !features.order && fullPath.includes('orders')) {
    router.push({ name: ROUTES.noAccess })
  }

  if (features && !features.collect && fullPath.includes('collects')) {
    router.push({ name: ROUTES.noAccess })
  }

  const rules: RulesKey | RulesKey[] = routesRules[name]
  const operator: string = routesOperator[name]

  let context

  if ([ROUTES.detailRetailer, ROUTES.editRetailer, ROUTES.createStore].includes(name)) {
    let id = params.id

    if (!id) {
      id = params.retailerId
    }

    context = {
      retailerId: parseInt(id, 10),
    }
  }

  if (
    [
      ROUTES.detailStore,
      ROUTES.updateStore,
      ROUTES.createExchangePlace,
      ROUTES.exchangePlace,
      ROUTES.updateExchangePlace,
    ].includes(name)
  ) {
    context = {
      ...context,
      storeId: parseInt(params.storeId, 10),
    }
  }

  if (shouldRedirectToNoAccessPage(name, permissions, rules, context, operator)) {
    router.push({ name: ROUTES.noAccess })
  }
}

// Guards
router.beforeEach(async (to, from, next) => {
  const { name, meta, params } = to

  if (!name) {
    return
  }

  if (from.name !== ROUTES.editOrder && name === ROUTES.editOrder) {
    try {
      const order = await OrderService.get(parseInt(params.id, 10), {
        personalData: true,
      })

      if (
        (order.Delivery && !order.Delivery.quoteId) ||
        (order?.Quote?.eligibilitySpecifications &&
          !order.Quote.eligibilitySpecifications.updateOrder)
      ) {
        next({ name: ROUTES.noAccess })
      }

      await store.dispatch('createOrder/setOrder', order)
    } catch (e) {
      if (e.response?.status === 403) {
        return next({ name: ROUTES.noAccess })
      }
      if (e.response?.status === 404) {
        return next({ name: ROUTES.notFound })
      }
    }
  }

  // Set pages wich have a light layout design
  const lightLayoutPages = [ROUTES.login, ROUTES.specificPartnerLogin]

  store.commit(SET_HAS_LIGHT_LAYOUT, lightLayoutPages.includes(name))

  // Set pages wich have a centered content
  const noCenteredContentPages = [ROUTES.noAccess, ROUTES.contact, ROUTES.notFound]

  store.commit(SET_HAS_CENTERED_CONTENT, !noCenteredContentPages.includes(name))

  // Format breadcrumb link
  const {
    meta: { breadcrumbs: fromBreadcrumbs },
  } = from as any

  if (fromBreadcrumbs) {
    for (const breadcrumb of fromBreadcrumbs) {
      if (breadcrumb.saveLink) {
        breadcrumb.link = breadcrumb.saveLink
      }
    }
  }

  if (meta?.breadcrumbs) {
    meta.breadcrumbs.forEach((breadcrumb: BreadCrumb) => {
      if (breadcrumb.link.search(':') !== -1) {
        breadcrumb.link.split('/').forEach((urlSplit: string) => {
          if (urlSplit.search(':') !== -1) {
            const toReplace = urlSplit
            const value = params[toReplace.substr(1, toReplace.length - 1)]
            breadcrumb.link = breadcrumb.link.replace(toReplace, value)
          }
        })
      }
    })
  }

  let stepNumber = to.query.stepNumber

  if (stepNumber && typeof stepNumber === 'number') {
    stepNumber = (stepNumber as number).toString()
  }

  if (from.name !== ROUTES.createOrder && to.name === ROUTES.createOrder) {
    await Promise.all([
      store.dispatch('createOrder/setOrder', null),
      store.dispatch('createOrder/setEligibility', null),
      store.dispatch('createOrder/setMiscellaneous', null),
    ])

    await store.dispatch('createOrder/resetValidation')
  }

  if (
    from.name !== ROUTES.createOrder &&
    to.name === ROUTES.createOrder &&
    (!stepNumber || stepNumber !== '1')
  ) {
    return next({
      name: ROUTES.createOrder,
      query: {
        stepNumber: '1',
      },
    })
  }

  if (
    from.name !== ROUTES.retailerCustomCheckoutPreview &&
    to.name === ROUTES.retailerCustomCheckoutPreview &&
    (!to.query.stepNumber || to.query.stepNumber !== '1')
  ) {
    return next({
      name: ROUTES.retailerCustomCheckoutPreview,
      query: {
        stepNumber: '1',
      },
    })
  }

  if (
    from.name !== ROUTES.storeCustomCheckoutPreview &&
    to.name === ROUTES.storeCustomCheckoutPreview &&
    (!to.query.stepNumber || to.query.stepNumber !== '1')
  ) {
    return next({
      name: ROUTES.storeCustomCheckoutPreview,
      query: {
        stepNumber: '1',
      },
    })
  }

  next()
})

export default router
