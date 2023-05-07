import { ROUTES } from '@/constants'
import AdministrationConfig from '@/views/AdministrationConfig/detail.vue'
import EditAdministrationConfig from '@/views/AdministrationConfig/edit/editAdministrationConfig.vue'
import AlertConfigDetail from '@/views/Alert/Config/detail/detail.vue'
import AlertConfigEdit from '@/views/Alert/Config/edit/add.vue'
import Alert from '@/views/Alert/detail.vue'
import CreateCarrier from '@/views/Carrier/create/create.vue'
import DetailCarrier from '@/views/Carrier/Detail/detail.vue'
import CarrierTypicalWeek from '@/views/Carrier/Detail/parameter/typicalWeekBlock/carrierCreateTypicalWeek.vue'
import carrierCreateExceptions from '@/views/Carrier/Exception/create/exceptionCreate.vue'
import carrierDetailExceptions from '@/views/Carrier/Exception/detail/exceptionDetail.vue'
import Carriers from '@/views/Carrier/List/Carriers.vue'
import DetailClientPage from '@/views/ClientPage/detail/detail.vue'
import EditClientPage from '@/views/ClientPage/edit/EditClientPage.vue'
import DetailCollect from '@/views/Collect/Detail/Detail.vue'
import ListCollect from '@/views/Collect/list/List.vue'
import customCheckout from '@/views/customCheckout/customCheckout.vue'
import DetailDashboard from '@/views/Dashboard/Detail/detail.vue'
import EditDashboard from '@/views/Dashboard/Detail/edit/editDashboard.vue'
import ShareDashboard from '@/views/Dashboard/Share/detail/detail.vue'
import EditDashboardPermission from '@/views/Dashboard/Share/edit/EditPermission.vue'
import CreateException from '@/views/Exceptions/create/exceptionCreate.vue'
import DetailException from '@/views/Exceptions/detail/exceptionDetail.vue'
import CreateExchangePlace from '@/views/ExchangePlace/create/create.vue'
import ExchangePlace from '@/views/ExchangePlace/detail/exchangePlace.vue'
import NoAccess from '@/views/Fallback/NoAccess.vue'
import NotFound from '@/views/Fallback/NotFound.vue'
import EditFtpAccount from '@/views/FtpAccounts/edit/EditFtpAccount.vue'
import FtpAccounts from '@/views/FtpAccounts/FtpAccounts.vue'
import Login from '@/views/Login/Login.vue'
import NotificationAdministration from '@/views/NotificationAdministration/list.vue'
import CreateNotification from '@/views/Notifications/create/CreateNotification.vue'
import NotificationDetail from '@/views/Notifications/detail/Detail.vue'
import EditNotification from '@/views/Notifications/edit/EditNotification.vue'
import NotificationsReporting from '@/views/Notifications/list/NotificationsReporting.vue'
import CreateOrder from '@/views/Order/Create/create.vue'
import DetailOrder from '@/views/Order/Detail/Detail.vue'
import Orders from '@/views/Order/List/Orders.vue'
import ProductReturn from '@/views/ProductReturn/ProductReturn.vue'
import CreateRetailer from '@/views/Retailer/create/create.vue'
import DetailRetailer from '@/views/Retailer/Detail/Detail.vue'
import Retailers from '@/views/Retailer/List/Retailers.vue'
import EditRulesGroup from '@/views/RulesGroup/Edit/EditRulesGroup.vue'
import RulesGroups from '@/views/RulesGroup/List/RulesGroups.vue'
import StatusMapping from '@/views/StatusMapping/StatusMapping.vue'
import CreateStore from '@/views/Store/create/create.vue'
import DetailStore from '@/views/Store/Detail/detail.vue'
import TypicalWeek from '@/views/TypicalWeek/typicalWeek.vue'
import CreateUser from '@/views/User/Create/CreateUser.vue'
import DetailUser from '@/views/User/Detail/User.vue'
import Users from '@/views/User/List/Users.vue'
import EditPermission from '@/views/User/Permission/EditPermission.vue'
import ValiditySlotPeriod from '@/views/ValiditySlotPeriod/ValiditySlotPeriod.vue'

const routes = [
  {
    path: '/',
    name: ROUTES.root,
    redirect: '/orders',
  },
  {
    path: '/login',
    name: ROUTES.login,
    component: Login,
  },
  {
    path: '/login/:partnerCode',
    name: ROUTES.specificPartnerLogin,
    component: Login,
  },
  {
    path: '/orders',
    name: ROUTES.orders,
    component: Orders,
    meta: {
      breadcrumbs: [
        { name: 'breadcrumbs.home', link: '/' },
        { name: 'breadcrumbs.orders', link: '/orders' },
      ],
    },
  },
  {
    path: '/orders/add',
    name: ROUTES.createOrder,
    component: CreateOrder,
    meta: {
      breadcrumbs: [
        { name: 'breadcrumbs.home', link: '/' },
        { name: 'breadcrumbs.createOrders', link: '/orders' },
      ],
    },
  },
  {
    path: '/orders/add',
    redirect: '/orders/add/1',
  },
  {
    path: '/orders/:id',
    name: ROUTES.detailOrder,
    component: DetailOrder,
    meta: {
      breadcrumbs: [
        { name: 'breadcrumbs.home', link: '/' },
        { name: 'breadcrumbs.orders', link: '/orders' },
        { name: 'breadcrumbs.ordersDetail', link: '/orders/:id', saveLink: '/orders/:id' },
      ],
    },
  },
  {
    path: '/orders/:id/return',
    name: ROUTES.createProductReturn,
    component: ProductReturn,
    meta: {
      breadcrumbs: [
        { name: 'breadcrumbs.home', link: '/' },
        { name: 'breadcrumbs.orders', link: '/orders' },
        { name: 'breadcrumbs.ordersDetail', link: '/orders/:id', saveLink: '/orders/:id' },
        {
          name: 'breadcrumbs.productReturn',
          link: '/orders/:id/return',
          saveLink: '/orders/:id/return',
        },
      ],
    },
  },
  {
    path: '/orders/:id/edit',
    name: ROUTES.editOrder,
    component: CreateOrder,
    meta: {
      breadcrumbs: [
        { name: 'breadcrumbs.home', link: '/' },
        { name: 'breadcrumbs.orders', link: '/orders' },
        { name: 'breadcrumbs.ordersDetail', link: '/orders/:id', saveLink: '/orders/:id' },
        { name: 'action.modify.base', link: '' },
      ],
    },
  },
  {
    path: '/retailers',
    name: ROUTES.retailers,
    component: Retailers,
    meta: {
      breadcrumbs: [
        { name: 'breadcrumbs.home', link: '/' },
        { name: 'breadcrumbs.retailers', link: '/retailers' },
      ],
    },
  },
  {
    path: '/retailers/add',
    name: ROUTES.addRetailer,
    component: CreateRetailer,
    meta: {
      breadcrumbs: [
        { name: 'breadcrumbs.home', link: '/' },
        { name: 'breadcrumbs.retailers', link: '/retailers' },
        { name: 'breadcrumbs.createRetailers', link: '/retailers' },
      ],
    },
  },
  {
    path: '/retailers/:id',
    name: ROUTES.detailRetailer,
    component: DetailRetailer,
    meta: {
      breadcrumbs: [
        { name: 'breadcrumbs.home', link: '/' },
        { name: 'breadcrumbs.retailers', link: '/retailers' },
        { name: 'retailers', link: '' },
      ],
    },
  },
  {
    path: '/retailers/:id/edit',
    name: ROUTES.editRetailer,
    component: CreateRetailer,
    meta: {
      breadcrumbs: [
        { name: 'breadcrumbs.home', link: '/' },
        { name: 'breadcrumbs.retailers', link: '/retailers' },
        { name: 'retailers', link: '/retailers/:id', saveLink: '/retailers/:id' },
        { name: 'action.modify.base', link: '' },
      ],
    },
  },
  {
    path: '/retailers/:id/customCheckout',
    name: ROUTES.retailerCustomCheckout,
    component: customCheckout,
    meta: {
      breadcrumbs: [
        { name: 'breadcrumbs.home', link: '/' },
        { name: 'breadcrumbs.retailers', link: '/retailers' },
        { name: 'retailers', link: '/retailers/:id', saveLink: '/retailers/:id' },
        { name: 'breadcrumbs.customCheckout', link: '' },
      ],
    },
  },
  {
    path: '/retailers/:id/customCheckout/:checkoutId/edit',
    name: ROUTES.retailerEditCustomCheckout,
    component: customCheckout,
    meta: {
      breadcrumbs: [
        { name: 'breadcrumbs.home', link: '/' },
        { name: 'breadcrumbs.retailers', link: '/retailers' },
        { name: 'retailers', link: '/retailers/:id', saveLink: '/retailers/:id' },
        { name: 'breadcrumbs.customCheckoutEdit', link: '' },
      ],
    },
  },
  {
    path: '/retailers/:id/customCheckout/preview/:checkoutId',
    name: ROUTES.retailerCustomCheckoutPreview,
    component: CreateOrder,
    meta: {
      breadcrumbs: [
        { name: 'breadcrumbs.home', link: '/' },
        { name: 'breadcrumbs.retailers', link: '/retailers' },
        { name: 'retailers', link: '/retailers/:id', saveLink: '/retailers/:id' },
        { name: 'breadcrumbs.customCheckoutPreview', link: '' },
      ],
    },
  },
  {
    path: '/retailers/:id/clientPage/add',
    name: ROUTES.addClientPage,
    component: EditClientPage,
    meta: {
      breadcrumbs: [
        { name: 'breadcrumbs.home', link: '/' },
        { name: 'breadcrumbs.retailers', link: '/retailers' },
        { name: 'retailers', link: '/retailers/:id', saveLink: '/retailers/:id' },
        { name: 'breadcrumbs.addClientPage', link: '' },
      ],
    },
  },
  {
    path: '/retailers/:id/clientPage/:clientPageId',
    name: ROUTES.detailClientPage,
    component: DetailClientPage,
    meta: {
      breadcrumbs: [
        { name: 'breadcrumbs.home', link: '/' },
        { name: 'breadcrumbs.retailers', link: '/retailers' },
        { name: 'retailers', link: '/retailers/:id', saveLink: '/retailers/:id' },
        { name: 'clientPage', link: '' },
      ],
    },
  },
  {
    path: '/retailers/:id/clientPage/:clientPageId/edit',
    name: ROUTES.editClientPage,
    component: EditClientPage,
    meta: {
      breadcrumbs: [
        { name: 'breadcrumbs.home', link: '/' },
        { name: 'breadcrumbs.retailers', link: '/retailers' },
        { name: 'retailers', link: '/retailers/:id', saveLink: '/retailers/:id' },
        {
          name: 'clientPage',
          link: '/retailers/:id/clientPage/:clientPageId',
          saveLink: '/retailers/:id/clientPage/:clientPageId',
        },
        { name: 'action.modify.base', link: '' },
      ],
    },
  },
  {
    path: '/retailers/:id/stores/add',
    name: ROUTES.createStore,
    component: CreateStore,
    meta: {
      breadcrumbs: [
        { name: 'breadcrumbs.home', link: '/' },
        { name: 'breadcrumbs.retailers', link: '/retailers' },
        { name: 'retailers', link: '/retailers/:id', saveLink: '/retailers/:id' },
        { name: 'breadcrumbs.createStore', link: '' },
      ],
    },
  },
  {
    path: '/retailers/:id/stores/:storeId',
    name: ROUTES.detailStore,
    component: DetailStore,
    meta: {
      breadcrumbs: [
        { name: 'breadcrumbs.home', link: '/' },
        { name: 'breadcrumbs.retailers', link: '/retailers' },
        { name: 'retailers', link: '/retailers/:id', saveLink: '/retailers/:id' },
        { name: 'stores', link: '' },
      ],
    },
  },
  {
    path: '/retailers/:id/stores/:storeId/edit',
    name: ROUTES.updateStore,
    component: CreateStore,
    meta: {
      breadcrumbs: [
        { name: 'breadcrumbs.home', link: '/' },
        { name: 'breadcrumbs.retailers', link: '/retailers' },
        { name: 'retailers', link: '/retailers/:id', saveLink: '/retailers/:id' },
        {
          name: 'stores',
          link: '/retailers/:id/stores/:storeId',
          saveLink: '/retailers/:id/stores/:storeId',
        },
        { name: 'action.modify.base', link: '' },
      ],
    },
  },
  {
    path: '/retailers/:id/stores/:storeId/customCheckout',
    name: ROUTES.storeCustomCheckout,
    component: customCheckout,
    meta: {
      breadcrumbs: [
        { name: 'breadcrumbs.home', link: '/' },
        { name: 'breadcrumbs.retailers', link: '/retailers' },
        { name: 'retailers', link: '/retailers/:id', saveLink: '/retailers/:id' },
        {
          name: 'stores',
          link: '/retailers/:id/stores/:storeId',
          saveLink: '/retailers/:id/stores/:storeId',
        },
        { name: 'breadcrumbs.customCheckout', link: '' },
      ],
    },
  },
  {
    path: '/retailers/:id/stores/:storeId/customCheckout/:checkoutId/edit',
    name: ROUTES.storeEditCustomCheckout,
    component: customCheckout,
    meta: {
      breadcrumbs: [
        { name: 'breadcrumbs.home', link: '/' },
        { name: 'breadcrumbs.retailers', link: '/retailers' },
        { name: 'retailers', link: '/retailers/:id', saveLink: '/retailers/:id' },
        {
          name: 'stores',
          link: '/retailers/:id/stores/:storeId',
          saveLink: '/retailers/:id/stores/:storeId',
        },
        { name: 'breadcrumbs.customCheckoutEdit', link: '' },
      ],
    },
  },
  {
    path: '/retailers/:id/stores/:storeId/customCheckout/preview/:checkoutId',
    name: ROUTES.storeCustomCheckoutPreview,
    component: CreateOrder,
    meta: {
      breadcrumbs: [
        { name: 'breadcrumbs.home', link: '/' },
        { name: 'breadcrumbs.retailers', link: '/retailers' },
        { name: 'retailers', link: '/retailers/:id', saveLink: '/retailers/:id' },
        {
          name: 'stores',
          link: '/retailers/:id/stores/:storeId',
          saveLink: '/retailers/:id/stores/:storeId',
        },
        { name: 'breadcrumbs.customCheckoutPreview', link: '' },
      ],
    },
  },
  {
    path: '/retailers/:id/stores/:storeId/exchangePlaces/add',
    name: ROUTES.createExchangePlace,
    component: CreateExchangePlace,
    meta: {
      breadcrumbs: [
        { name: 'breadcrumbs.home', link: '/' },
        { name: 'breadcrumbs.retailers', link: '/retailers' },
        { name: 'retailers', link: '/retailers/:id', saveLink: '/retailers/:id' },
        {
          name: 'stores',
          link: '/retailers/:id/stores/:storeId',
          saveLink: '/retailers/:id/stores/:storeId',
        },
        {
          name: 'breadcrumbs.createExchangePlace',
          link: '',
        },
      ],
    },
  },
  {
    path: '/retailers/:id/stores/:storeId/exchangePlaces/:exchangePlaceId',
    name: ROUTES.exchangePlace,
    component: ExchangePlace,
    meta: {
      breadcrumbs: [
        { name: 'breadcrumbs.home', link: '/' },
        { name: 'breadcrumbs.retailers', link: '/retailers' },
        { name: 'retailers', link: '/retailers/:id', saveLink: '/retailers/:id' },
        {
          name: 'stores',
          link: '/retailers/:id/stores/:storeId',
          saveLink: '/retailers/:id/stores/:storeId',
        },
        {
          name: 'exchangePlaces',
          link: '',
        },
      ],
    },
  },
  {
    path: '/retailers/:id/stores/:storeId/exchangePlaces/:exchangePlaceId/edit',
    name: ROUTES.updateExchangePlace,
    component: CreateExchangePlace,
    meta: {
      breadcrumbs: [
        { name: 'breadcrumbs.home', link: '/' },
        { name: 'breadcrumbs.retailers', link: '/retailers' },
        { name: 'retailers', link: '/retailers/:id', saveLink: '/retailers/:id' },
        {
          name: 'stores',
          link: '/retailers/:id/stores/:storeId',
          saveLink: '/retailers/:id/stores/:storeId',
        },
        {
          name: 'exchangePlaces',
          link: '/retailers/:id/stores/:storeId/exchangePlaces/:exchangePlaceId',
          saveLink: '/retailers/:id/stores/:storeId/exchangePlaces/:exchangePlaceId',
        },
        { name: 'action.modify.base', link: '' },
      ],
    },
  },
  {
    path: '/retailers/:id/stores/:storeId/exchangePlaces/:exchangePlaceId/schedule/create',
    name: ROUTES.createTypicalWeek,
    component: TypicalWeek,
    meta: {
      breadcrumbs: [
        { name: 'breadcrumbs.home', link: '/' },
        { name: 'breadcrumbs.retailers', link: '/retailers' },
        { name: 'retailers', link: '/retailers/:id', saveLink: '/retailers/:id' },
        {
          name: 'stores',
          link: '/retailers/:id/stores/:storeId',
          saveLink: '/retailers/:id/stores/:storeId',
        },
        {
          name: 'exchangePlaces',
          link: '/retailers/:id/stores/:storeId/exchangePlaces/:exchangePlaceId',
          saveLink: '/retailers/:id/stores/:storeId/exchangePlaces/:exchangePlaceId',
        },
        { name: 'breadcrumbs.typicalWeek', link: '' },
      ],
    },
  },
  {
    path: '/retailers/:id/stores/:storeId/exchangePlaces/:exchangePlaceId/schedule/edit',
    name: ROUTES.editTypicalWeek,
    component: TypicalWeek,
    meta: {
      breadcrumbs: [
        { name: 'breadcrumbs.home', link: '/' },
        { name: 'breadcrumbs.retailers', link: '/retailers' },
        { name: 'retailers', link: '/retailers/:id', saveLink: '/retailers/:id' },
        {
          name: 'stores',
          link: '/retailers/:id/stores/:storeId',
          saveLink: '/retailers/:id/stores/:storeId',
        },
        {
          name: 'exchangePlaces',
          link: '/retailers/:id/stores/:storeId/exchangePlaces/:exchangePlaceId',
          saveLink: '/retailers/:id/stores/:storeId/exchangePlaces/:exchangePlaceId',
        },
        { name: 'breadcrumbs.typicalWeek', link: '' },
      ],
    },
  },
  {
    path:
      '/retailers/:retailerId/stores/:storeId/exchangePlaces/:exchangePlaceId/carriers/:carrierId/schedule/create',
    name: ROUTES.createCarrierTypicalWeek,
    component: CarrierTypicalWeek,
    meta: {
      breadcrumbs: [
        { name: 'breadcrumbs.home', link: '/' },
        { name: 'breadcrumbs.retailers', link: '/retailers' },
        { name: 'retailers', link: '/retailers/:retailerId', saveLink: '/retailers/:retailerId' },
        {
          name: 'stores',
          link: '/retailers/:retailerId/stores/:storeId',
          saveLink: '/retailers/:retailerId/stores/:storeId',
        },
        {
          name: 'exchangePlaces',
          link: '/retailers/:retailerId/stores/:storeId/exchangePlaces/:exchangePlaceId',
          saveLink: '/retailers/:retailerId/stores/:storeId/exchangePlaces/:exchangePlaceId',
        },
        {
          name: 'carriers',
          link:
            '/retailers/:retailerId/stores/:storeId/exchangePlaces/:exchangePlaceId/carriers/:carrierId',
          saveLink:
            '/retailers/:retailerId/stores/:storeId/exchangePlaces/:exchangePlaceId/carriers/:carrierId',
        },
        { name: 'breadcrumbs.typicalWeek', link: '' },
      ],
    },
  },
  {
    path:
      '/retailers/:retailerId/stores/:storeId/exchangePlaces/:exchangePlaceId/carriers/:carrierId/schedule/:scheduleId/edit',
    name: ROUTES.editCarrierTypicalWeek,
    component: CarrierTypicalWeek,
    meta: {
      breadcrumbs: [
        { name: 'breadcrumbs.home', link: '/' },
        { name: 'breadcrumbs.retailers', link: '/retailers' },
        { name: 'retailers', link: '/retailers/:retailerId', saveLink: '/retailers/:retailerId' },
        {
          name: 'stores',
          link: '/retailers/:retailerId/stores/:storeId',
          saveLink: '/retailers/:retailerId/stores/:storeId',
        },
        {
          name: 'exchangePlaces',
          link: '/retailers/:retailerId/stores/:storeId/exchangePlaces/:exchangePlaceId',
          saveLink: '/retailers/:retailerId/stores/:storeId/exchangePlaces/:exchangePlaceId',
        },
        {
          name: 'carriers',
          link:
            '/retailers/:retailerId/stores/:storeId/exchangePlaces/:exchangePlaceId/carriers/:carrierId',
          saveLink:
            '/retailers/:retailerId/stores/:storeId/exchangePlaces/:exchangePlaceId/carriers/:carrierId',
        },
        { name: 'breadcrumbs.typicalWeek', link: '' },
      ],
    },
  },
  {
    path:
      '/retailers/:retailerId/stores/:storeId/exchangePlaces/:exchangePlaceId/carriers/:carrierId/schedule/:scheduleId/exceptions/create',
    name: ROUTES.carrierCreateExceptions,
    component: carrierCreateExceptions,
    meta: {
      breadcrumbs: [
        { name: 'breadcrumbs.home', link: '/' },
        { name: 'breadcrumbs.retailers', link: '/retailers' },
        { name: 'retailers', link: '/retailers/:retailerId', saveLink: '/retailers/:retailerId' },
        {
          name: 'stores',
          link: '/retailers/:retailerId/stores/:storeId',
          saveLink: '/retailers/:retailerId/stores/:storeId',
        },
        {
          name: 'exchangePlaces',
          link: '/retailers/:retailerId/stores/:storeId/exchangePlaces/:exchangePlaceId',
          saveLink: '/retailers/:retailerId/stores/:storeId/exchangePlaces/:exchangePlaceId',
        },
        {
          name: 'carriers',
          link:
            '/retailers/:retailerId/stores/:storeId/exchangePlaces/:exchangePlaceId/carriers/:carrierId',
          saveLink:
            '/retailers/:retailerId/stores/:storeId/exchangePlaces/:exchangePlaceId/carriers/:carrierId',
        },
        { name: 'breadcrumbs.exceptions', link: '' },
      ],
    },
  },
  {
    path:
      '/retailers/:retailerId/stores/:storeId/exchangePlaces/:exchangePlaceId/carriers/:carrierId/schedule/:scheduleId/exceptions/:exceptionId/detail',
    name: ROUTES.carrierDetailExceptions,
    component: carrierDetailExceptions,
    meta: {
      breadcrumbs: [
        { name: 'breadcrumbs.home', link: '/' },
        { name: 'breadcrumbs.retailers', link: '/retailers' },
        { name: 'retailers', link: '/retailers/:retailerId', saveLink: '/retailers/:retailerId' },
        {
          name: 'stores',
          link: '/retailers/:retailerId/stores/:storeId',
          saveLink: '/retailers/:retailerId/stores/:storeId',
        },
        {
          name: 'exchangePlaces',
          link: '/retailers/:retailerId/stores/:storeId/exchangePlaces/:exchangePlaceId',
          saveLink: '/retailers/:retailerId/stores/:storeId/exchangePlaces/:exchangePlaceId',
        },
        {
          name: 'carriers',
          link:
            '/retailers/:retailerId/stores/:storeId/exchangePlaces/:exchangePlaceId/carriers/:carrierId',
          saveLink:
            '/retailers/:retailerId/stores/:storeId/exchangePlaces/:exchangePlaceId/carriers/:carrierId',
        },
        { name: 'breadcrumbs.exceptions', link: '' },
      ],
    },
  },
  {
    path:
      '/retailers/:retailerId/stores/:storeId/exchangePlaces/:exchangePlaceId/carriers/:carrierId/schedule/:scheduleId/exceptions/:exceptionId/edit',
    name: ROUTES.carrierEditExceptions,
    component: carrierCreateExceptions,
    meta: {
      breadcrumbs: [
        { name: 'breadcrumbs.home', link: '/' },
        { name: 'breadcrumbs.retailers', link: '/retailers' },
        { name: 'retailers', link: '/retailers/:retailerId', saveLink: '/retailers/:retailerId' },
        {
          name: 'stores',
          link: '/retailers/:retailerId/stores/:storeId',
          saveLink: '/retailers/:retailerId/stores/:storeId',
        },
        {
          name: 'exchangePlaces',
          link: '/retailers/:retailerId/stores/:storeId/exchangePlaces/:exchangePlaceId',
          saveLink: '/retailers/:retailerId/stores/:storeId/exchangePlaces/:exchangePlaceId',
        },
        {
          name: 'carriers',
          link:
            '/retailers/:retailerId/stores/:storeId/exchangePlaces/:exchangePlaceId/carriers/:carrierId',
          saveLink:
            '/retailers/:retailerId/stores/:storeId/exchangePlaces/:exchangePlaceId/carriers/:carrierId',
        },
        { name: 'breadcrumbs.exceptions', link: '' },
      ],
    },
  },
  {
    path:
      '/retailers/:id/stores/:storeId/exchangePlaces/:exchangePlaceId/bookingValidityPeriod/edit',
    name: ROUTES.validitySlotPeriod,
    component: ValiditySlotPeriod,
    meta: {
      breadcrumbs: [
        { name: 'breadcrumbs.home', link: '/' },
        { name: 'breadcrumbs.retailers', link: '/retailers' },
        { name: 'retailers', link: '/retailers/:id', saveLink: '/retailers/:id' },
        {
          name: 'stores',
          link: '/retailers/:id/stores/:storeId',
          saveLink: '/retailers/:id/stores/:storeId',
        },
        {
          name: 'exchangePlaces',
          link: '/retailers/:id/stores/:storeId/exchangePlaces/:exchangePlaceId',
          saveLink: '/retailers/:id/stores/:storeId/exchangePlaces/:exchangePlaceId',
        },
        { name: 'breadcrumbs.validitySlotPeriod', link: '' },
      ],
    },
  },
  {
    path: '/retailers/:id/stores/:storeId/exchangePlaces/:exchangePlaceId/exceptions/create',
    name: ROUTES.createExceptions,
    component: CreateException,
    meta: {
      breadcrumbs: [
        { name: 'breadcrumbs.home', link: '/' },
        { name: 'breadcrumbs.retailers', link: '/retailers' },
        { name: 'retailers', link: '/retailers/:id', saveLink: '/retailers/:id' },
        {
          name: 'stores',
          link: '/retailers/:id/stores/:storeId',
          saveLink: '/retailers/:id/stores/:storeId',
        },
        {
          name: 'exchangePlaces',
          link: '/retailers/:id/stores/:storeId/exchangePlaces/:exchangePlaceId',
          saveLink: '/retailers/:id/stores/:storeId/exchangePlaces/:exchangePlaceId',
        },
        { name: 'breadcrumbs.exceptions', link: '' },
      ],
    },
  },
  {
    path:
      '/retailers/:id/stores/:storeId/exchangePlaces/:exchangePlaceId/exceptions/:exceptionId/detail',
    name: ROUTES.detailExceptions,
    component: DetailException,
    meta: {
      breadcrumbs: [
        { name: 'breadcrumbs.home', link: '/' },
        { name: 'breadcrumbs.retailers', link: '/retailers' },
        { name: 'retailers', link: '/retailers/:id', saveLink: '/retailers/:id' },
        {
          name: 'stores',
          link: '/retailers/:id/stores/:storeId',
          saveLink: '/retailers/:id/stores/:storeId',
        },
        {
          name: 'exchangePlaces',
          link: '/retailers/:id/stores/:storeId/exchangePlaces/:exchangePlaceId',
          saveLink: '/retailers/:id/stores/:storeId/exchangePlaces/:exchangePlaceId',
        },
        { name: 'breadcrumbs.exceptions', link: '' },
      ],
    },
  },
  {
    path:
      '/retailers/:id/stores/:storeId/exchangePlaces/:exchangePlaceId/exceptions/:exceptionId/edit',
    name: ROUTES.editExceptions,
    component: CreateException,
    meta: {
      breadcrumbs: [
        { name: 'breadcrumbs.home', link: '/' },
        { name: 'breadcrumbs.retailers', link: '/retailers' },
        { name: 'retailers', link: '/retailers/:id', saveLink: '/retailers/:id' },
        {
          name: 'stores',
          link: '/retailers/:id/stores/:storeId',
          saveLink: '/retailers/:id/stores/:storeId',
        },
        {
          name: 'exchangePlaces',
          link: '/retailers/:id/stores/:storeId/exchangePlaces/:exchangePlaceId',
          saveLink: '/retailers/:id/stores/:storeId/exchangePlaces/:exchangePlaceId',
        },
        {
          name: 'breadcrumbs.exceptions',
          link:
            '/retailers/:id/stores/:storeId/exchangePlaces/:exchangePlaceId/exceptions/:exceptionId/detail',
          saveLink:
            '/retailers/:id/stores/:storeId/exchangePlaces/:exchangePlaceId/exceptions/:exceptionId/detail',
        },
        { name: 'action.modify.base', link: '' },
      ],
    },
  },
  {
    path: '/carriers',
    name: ROUTES.carriers,
    component: Carriers,
    meta: {
      breadcrumbs: [
        { name: 'breadcrumbs.home', link: '/' },
        { name: 'breadcrumbs.carriers', link: '/carriers' },
      ],
    },
  },
  {
    path: '/carriers/add',
    name: ROUTES.addCarrier,
    component: CreateCarrier,
    meta: {
      breadcrumbs: [
        { name: 'breadcrumbs.home', link: '/' },
        { name: 'breadcrumbs.carriers', link: '/carriers' },
        { name: 'breadcrumbs.createCarrier', link: '/carriers' },
      ],
    },
  },
  {
    path: '/carriers/:carrierId',
    name: ROUTES.detailCarrier,
    component: DetailCarrier,
    meta: {
      breadcrumbs: [
        { name: 'breadcrumbs.home', link: '/' },
        { name: 'breadcrumbs.carriers', link: '/carriers' },
        { name: 'carriers', link: '' },
      ],
    },
  },
  {
    path: '/carriers/:carrierId/ftpAccounts',
    name: ROUTES.carrierFtpAccounts,
    component: FtpAccounts,
    meta: {
      breadcrumbs: [
        { name: 'breadcrumbs.home', link: '/' },
        { name: 'breadcrumbs.carriers', link: '/carriers' },
        { name: 'carriers', link: '/carriers/:carrierId', saveLink: '/carriers/:carrierId' },
        { name: 'page.ftpAccounts.title', link: '' },
      ],
    },
  },
  {
    path: '/carriers/:carrierId/ftpAccounts/:accountId/edit',
    name: ROUTES.editCarrierFtpAccounts,
    component: EditFtpAccount,
    meta: {
      breadcrumbs: [
        { name: 'breadcrumbs.home', link: '/' },
        { name: 'breadcrumbs.carriers', link: '/carriers' },
        { name: 'carriers', link: '/carriers/:carrierId', saveLink: '/carriers/:carrierId' },
        { name: 'page.ftpAccounts.title', link: '' },
      ],
    },
  },
  {
    path: '/carriers/:carrierId/ftpAccounts/add',
    name: ROUTES.addCarrierFtpAccounts,
    component: EditFtpAccount,
    meta: {
      breadcrumbs: [
        { name: 'breadcrumbs.home', link: '/' },
        { name: 'breadcrumbs.carriers', link: '/carriers' },
        { name: 'carriers', link: '/carriers/:carrierId', saveLink: '/carriers/:carrierId' },
        { name: 'page.ftpAccounts.title', link: '' },
      ],
    },
  },
  {
    path: '/retailers/:retailerId/ftpAccounts',
    name: ROUTES.retailerFtpAccounts,
    component: FtpAccounts,
    meta: {
      breadcrumbs: [
        { name: 'breadcrumbs.home', link: '/' },
        { name: 'breadcrumbs.retailers', link: '/retailers' },
        { name: 'retailers', link: '/retailers/:retailerId', saveLink: '/retailers/:retailerId' },
        { name: 'page.ftpAccounts.title', link: '' },
      ],
    },
  },
  {
    path: '/retailers/:retailerId/ftpAccounts/:accountId/edit',
    name: ROUTES.editRetailerFtpAccounts,
    component: EditFtpAccount,
    meta: {
      breadcrumbs: [
        { name: 'breadcrumbs.home', link: '/' },
        { name: 'breadcrumbs.retailers', link: '/retailers' },
        { name: 'retailers', link: '/retailers/:retailerId', saveLink: '/retailers/:retailerId' },
        { name: 'page.ftpAccounts.title', link: '' },
      ],
    },
  },
  {
    path: '/retailers/:retailerId/ftpAccounts/add',
    name: ROUTES.addRetailerFtpAccounts,
    component: EditFtpAccount,
    meta: {
      breadcrumbs: [
        { name: 'breadcrumbs.home', link: '/' },
        { name: 'breadcrumbs.retailers', link: '/retailers' },
        { name: 'retailers', link: '/retailers/:retailerId', saveLink: '/retailers/:retailerId' },
        { name: 'page.ftpAccounts.title', link: '' },
      ],
    },
  },
  {
    path: '/carriers/:carrierId/edit',
    name: ROUTES.editCarrier,
    component: CreateCarrier,
    meta: {
      breadcrumbs: [
        { name: 'breadcrumbs.home', link: '/' },
        { name: 'breadcrumbs.carriers', link: '/carriers' },
        { name: 'carriers', link: '/carriers/:carrierId', saveLink: '/carriers/:carrierId' },
        { name: 'action.modify.base', link: '' },
      ],
    },
  },
  {
    path: '/carriers/:carrierId/statusMappings',
    name: ROUTES.statusMappings,
    component: StatusMapping,
    meta: {
      breadcrumbs: [
        { name: 'breadcrumbs.home', link: '/' },
        { name: 'breadcrumbs.carriers', link: '/carriers' },
        { name: 'carriers', link: '/carriers/:carrierId', saveLink: '/carriers/:carrierId' },
        { name: 'breadcrumbs.statusMappings', link: '' },
      ],
    },
  },
  {
    path: '/retailers/:retailerId/carriers/:carrierId',
    name: ROUTES.detailCarrierRetailer,
    component: DetailCarrier,
    meta: {
      breadcrumbs: [
        { name: 'breadcrumbs.home', link: '/' },
        { name: 'breadcrumbs.retailers', link: '/retailers' },
        { name: 'retailers', link: '/retailers/:retailerId', saveLink: '/retailers/:retailerId' },
        { name: 'carriers', link: '' },
      ],
    },
  },
  {
    path: '/retailers/:retailerId/stores/:storeId/carriers/:carrierId',
    name: ROUTES.detailCarrierStore,
    component: DetailCarrier,
    meta: {
      breadcrumbs: [
        { name: 'breadcrumbs.home', link: '/' },
        { name: 'breadcrumbs.retailers', link: '/retailers' },
        { name: 'retailers', link: '/retailers/:retailerId', saveLink: '/retailers/:retailerId' },
        {
          name: 'stores',
          link: '/retailers/:retailerId/stores/:storeId',
          saveLink: '/retailers/:retailerId/stores/:storeId',
        },
        { name: 'carriers', link: '' },
      ],
    },
  },
  {
    path:
      '/retailers/:retailerId/stores/:storeId/exchangePlaces/:exchangePlaceId/carriers/:carrierId',
    name: ROUTES.detailCarrierExchangePlace,
    component: DetailCarrier,
    meta: {
      breadcrumbs: [
        { name: 'breadcrumbs.home', link: '/' },
        { name: 'breadcrumbs.retailers', link: '/retailers' },
        { name: 'retailers', link: '/retailers/:retailerId', saveLink: '/retailers/:retailerId' },
        {
          name: 'stores',
          link: '/retailers/:retailerId/stores/:storeId',
          saveLink: '/retailers/:retailerId/stores/:storeId',
        },
        {
          name: 'exchangePlaces',
          link: '/retailers/:retailerId/stores/:storeId/exchangePlaces/:exchangePlaceId',
          saveLink: '/retailers/:retailerId/stores/:storeId/exchangePlaces/:exchangePlaceId',
        },
        {
          name: 'carriers',
          link: '',
        },
      ],
    },
  },
  {
    path: '/users',
    name: ROUTES.users,
    component: Users,
    meta: {
      breadcrumbs: [
        { name: 'breadcrumbs.home', link: '/' },
        { name: 'breadcrumbs.users', link: '/users' },
      ],
    },
  },
  {
    path: '/profile',
    name: ROUTES.profile,
    component: DetailUser,
    meta: {
      breadcrumbs: [
        { name: 'breadcrumbs.home', link: '/' },
        { name: 'breadcrumbs.profile', link: '/profile' },
      ],
    },
  },
  {
    path: '/profile/edit',
    name: ROUTES.editProfile,
    component: CreateUser,
    meta: {
      breadcrumbs: [
        { name: 'breadcrumbs.home', link: '/' },
        { name: 'breadcrumbs.profile', link: '/profile', saveLink: '/profile' },
        { name: 'breadcrumbs.editProfile', link: '/profile/edit' },
      ],
    },
  },
  {
    path: '/users/add',
    name: ROUTES.addUser,
    component: CreateUser,
    meta: {
      breadcrumbs: [
        { name: 'breadcrumbs.home', link: '/' },
        { name: 'breadcrumbs.users', link: '/users' },
        { name: 'breadcrumbs.addUser', link: '/users/add' },
      ],
    },
  },
  {
    path: '/users/:id/edit',
    name: ROUTES.editUser,
    component: CreateUser,
    meta: {
      breadcrumbs: [
        { name: 'breadcrumbs.home', link: '/' },
        { name: 'breadcrumbs.users', link: '/users' },
        { name: 'user', link: '/users/:id', saveLink: '/users/:id' },
        { name: 'breadcrumbs.editUser', link: '/users/:id/edit' },
      ],
    },
  },
  {
    path: '/users/:id',
    name: ROUTES.detailUser,
    component: DetailUser,
    meta: {
      breadcrumbs: [
        { name: 'breadcrumbs.home', link: '/' },
        { name: 'breadcrumbs.users', link: '/users' },
        { name: 'user', link: '/users/:id', saveLink: '/users/:id' },
      ],
    },
  },
  {
    path: '/users/:id/permissions/add',
    name: ROUTES.addPermission,
    component: EditPermission,
    meta: {
      breadcrumbs: [
        { name: 'breadcrumbs.home', link: '/' },
        { name: 'breadcrumbs.users', link: '/users' },
        { name: 'user', link: '/users/:id', saveLink: '/users/:id' },
        { name: 'breadcrumbs.addPermission', link: '/users/:id/permissions/add' },
      ],
    },
  },
  {
    path: '/users/:id/permissions/:permissionId/edit',
    name: ROUTES.editPermission,
    component: EditPermission,
    meta: {
      breadcrumbs: [
        { name: 'breadcrumbs.home', link: '/' },
        { name: 'breadcrumbs.users', link: '/users' },
        { name: 'user', link: '/users/:id', saveLink: '/users/:id' },
        {
          name: 'permission',
          link: '/users/:id/permissions/:permissionId/edit',
          saveLink: '/users/:id/permissions/:permissionId/edit',
        },
      ],
    },
  },
  {
    path: '/rules-groups',
    name: ROUTES.rulesGroups,
    component: RulesGroups,
    meta: {
      breadcrumbs: [
        { name: 'breadcrumbs.home', link: '/' },
        { name: 'breadcrumbs.rulesGroups', link: '/rules-groups' },
      ],
    },
  },
  {
    path: '/rules-groups/add',
    name: ROUTES.addRulesGroup,
    component: EditRulesGroup,
    meta: {
      breadcrumbs: [
        { name: 'breadcrumbs.home', link: '/' },
        { name: 'breadcrumbs.rulesGroups', link: '/rules-groups' },
        { name: 'breadcrumbs.addRulesGroup', link: '/rules-groups/add' },
      ],
    },
  },
  {
    path: '/rules-groups/:id/edit',
    name: ROUTES.editRulesGroup,
    component: EditRulesGroup,
    meta: {
      breadcrumbs: [
        { name: 'breadcrumbs.home', link: '/' },
        { name: 'breadcrumbs.rulesGroups', link: '/rules-groups' },
        { name: 'rulesGroup', link: '/rules-groups/:id/edit', saveLink: '/rules-groups/:id/edit' },
      ],
    },
  },
  {
    path: '/rules-groups/:id',
    redirect: '/rules-groups/:id/edit',
  },
  {
    path: '/dashboards',
    name: ROUTES.dashboard,
    component: DetailDashboard,
    meta: {
      breadcrumbs: [
        { name: 'breadcrumbs.home', link: '/' },
        { name: 'breadcrumbs.dashboard', link: '/dashboards' },
      ],
    },
  },
  {
    path: '/dashboards/:id/add',
    name: ROUTES.createDashboard,
    component: EditDashboard,
    meta: {
      breadcrumbs: [
        { name: 'breadcrumbs.home', link: '/' },
        { name: 'breadcrumbs.dashboard', link: '/dashboards' },
        {
          name: 'breadcrumbs.dashboardAdd',
          link: '/dashboards/:id/edit',
        },
      ],
    },
  },
  {
    path: '/dashboards/:id/edit',
    name: ROUTES.editDashboard,
    component: EditDashboard,
    meta: {
      breadcrumbs: [
        { name: 'breadcrumbs.home', link: '/' },
        { name: 'breadcrumbs.dashboard', link: '/dashboards' },
        {
          name: 'breadcrumbs.dashboardEdit',
          link: '/dashboards/:id/edit',
        },
      ],
    },
  },
  {
    path: '/dashboards/:id/permissions',
    name: ROUTES.shareDashboard,
    component: ShareDashboard,
    meta: {
      breadcrumbs: [
        { name: 'breadcrumbs.home', link: '/' },
        { name: 'breadcrumbs.dashboard', link: '/dashboards' },
        {
          name: 'breadcrumbs.dashboardShare',
          link: '/dashboards/:id/permissions',
          saveLink: '/dashboards/:id/permissions',
        },
      ],
    },
  },
  {
    path: '/dashboards/:id/permissions/add',
    name: ROUTES.addDashboardPermissions,
    component: EditDashboardPermission,
    meta: {
      breadcrumbs: [
        { name: 'breadcrumbs.home', link: '/' },
        { name: 'breadcrumbs.dashboard', link: '/dashboards' },
        {
          name: 'breadcrumbs.dashboardShare',
          link: '/dashboards/:id/permissions',
          saveLink: '/dashboards/:id/permissions',
        },
        {
          name: 'permission',
          link: '/dashboards/:id/permissions/add',
          saveLink: '/dashboards/:id/permissions/add',
        },
      ],
    },
  },
  {
    path: '/dashboards/:id/permissions/:permissionId/edit',
    name: ROUTES.editDashboardPermissions,
    component: EditDashboardPermission,
    meta: {
      breadcrumbs: [
        { name: 'breadcrumbs.home', link: '/' },
        { name: 'breadcrumbs.dashboard', link: '/dashboards' },
        {
          name: 'breadcrumbs.dashboardShare',
          link: '/dashboards/:id/permissions',
          saveLink: '/dashboards/:id/permissions',
        },
        {
          name: 'permission',
          link: '/dashboards/:id/permissions/:permissionId/edit',
          saveLink: '/dashboards/:id/permissions/:permissionId/edit',
        },
      ],
    },
  },
  {
    path: '/administrations',
    name: ROUTES.administrationConfig,
    component: AdministrationConfig,
    meta: {
      breadcrumbs: [
        { name: 'breadcrumbs.home', link: '/' },
        { name: 'breadcrumbs.administrationConfig', link: '/administrations' },
      ],
    },
  },
  {
    path: '/administrations/edit',
    name: ROUTES.administrationConfigEdit,
    component: EditAdministrationConfig,
    meta: {
      breadcrumbs: [
        { name: 'breadcrumbs.home', link: '/' },
        { name: 'breadcrumbs.administrationConfig', link: '/administrations' },
      ],
    },
  },
  {
    path: '/alert/config/edit',
    name: ROUTES.alertConfigEdit,
    component: AlertConfigEdit,
    meta: {
      breadcrumbs: [
        { name: 'breadcrumbs.home', link: '/' },
        { name: 'breadcrumbs.alerts', link: '/alert/config/detail' },
        { name: 'action.add.parameter', link: '' },
      ],
    },
  },
  {
    path: '/alert/config/detail',
    name: ROUTES.alertConfigDetail,
    component: AlertConfigDetail,
    props: (query: { retailerId: number; storeIds: number[] }): Record<string, any> => ({
      retailerId: query.retailerId,
      storeIds: query.storeIds,
    }),
    meta: {
      breadcrumbs: [
        { name: 'breadcrumbs.home', link: '/' },
        { name: 'breadcrumbs.alerts', link: '' },
      ],
    },
  },
  {
    path: '/notificationAdministration',
    name: ROUTES.notificationAdministration,
    component: NotificationAdministration,
    meta: {
      breadcrumbs: [
        { name: 'breadcrumbs.home', link: '/' },
        { name: 'breadcrumbs.notificationAdministration', link: '/notifications' },
      ],
    },
  },
  {
    path: '/notifications',
    name: ROUTES.notificationsReporting,
    component: NotificationsReporting,
    meta: {
      breadcrumbs: [
        { name: 'breadcrumbs.home', link: '/' },
        { name: 'breadcrumbs.notificationsReporting', link: '/notifications' },
      ],
    },
  },
  {
    path: '/notifications/create',
    name: ROUTES.createNotification,
    component: CreateNotification,
    meta: {
      breadcrumbs: [
        { name: 'breadcrumbs.home', link: '/' },
        { name: 'breadcrumbs.notificationsReporting', link: '/notifications' },
        { name: 'breadcrumbs.addNotification', link: '/notifications/add' },
      ],
    },
  },
  {
    path: '/notifications/:id/edit',
    name: ROUTES.editNotification,
    component: EditNotification,
    meta: {
      breadcrumbs: [
        { name: 'breadcrumbs.home', link: '/' },
        { name: 'breadcrumbs.notificationsReporting', link: '/notifications' },
        { name: 'breadcrumbs.editNotification', link: '/notifications' },
      ],
    },
  },
  {
    path: '/notifications/:id',
    name: ROUTES.notificationDetail,
    component: NotificationDetail,
    meta: {
      breadcrumbs: [
        { name: 'breadcrumbs.home', link: '/' },
        { name: 'breadcrumbs.notificationsReporting', link: '/notifications' },
        {
          name: 'breadcrumbs.notificationsReporting',
          link: '/notifications/detail/:id',
        },
      ],
    },
  },
  {
    path: '/collects',
    name: ROUTES.listCollect,
    component: ListCollect,
    meta: {
      breadcrumbs: [
        { name: 'breadcrumbs.home', link: '/' },
        { name: 'breadcrumbs.collects', link: '/collects' },
      ],
    },
  },
  {
    path: '/collects/:id',
    name: ROUTES.detailCollect,
    component: DetailCollect,
    meta: {
      breadcrumbs: [
        { name: 'breadcrumbs.home', link: '/' },
        { name: 'breadcrumbs.collects', link: '/collects' },
        { name: 'breadcrumbs.collectDetail', link: '/collects/:id', saveLink: '/collects/:id' },
      ],
    },
  },
  {
    path: '/alert',
    name: ROUTES.alert,
    component: Alert,
  },
  {
    path: '/no-access',
    name: ROUTES.noAccess,
    component: NoAccess,
  },
  {
    path: '/not-found',
    name: ROUTES.notFound,
    component: NotFound,
  },
  {
    path: '*',
    redirect: '/not-found',
  },
]

export default routes
