import AlertSubscriptionRepository from '@/services/alertSubscription/AlertSubscriptionRepository'
import UserAlertRepository from '@/services/userAlert/UserAlertRepository'
import AddressRepository from './address/AddressRepository'
import AdministrationRepository from './administration/AdministrationRepository'
import AlertsRepository from './alerts/AlertsRepository'
import BillingRepository from './billing/BillingRepository'
import CarrierScoreRepository from './carrier-score/CarrierScoreRepository'
import CarrierRepository from './carrier/CarrierRepository'
import CatalogRepository from './catalog/CatalogRepository'
import CatalogProductRepository from './catalogProduct/CatalogProductRepository'
import ClientPageRepository from './clientPage/clientPageRepository'
import CollectRepository from './collect/CollectRepository'
import CommentRepository from './comment/CommentRepository'
import createOrderRepository from './createOrder/createOrderRepository'
import DashboardRepository from './dashboard/DashboardRepository'
import DeliveryRepository from './delivery/DeliveryRepository'
import ExchangePlaceRepository from './exchangePlace/ExchangePlaceRepository'
import FtpRepository from './ftp/FtpRepository'
import FtpAccountsRepository from './ftpAccounts/FtpAccountsRepository'
import NotificationRepository from './notification/NotificationRepository'
import NotificationStatesRepository from './notificationStates/NotificationStatesRepository'
import OrderRepository from './order/OrderRepository'
import OrderEligibilityRepository from './orderEligibility/OrderEligibilityRepository'
import ParcelRepository from './parcels/ParcelRepository'
import pickupPointsRepository from './pickupPoints/pickupPointsRepository'
import QuoteRepository from './quote/QuoteRepository'
import RetailerRepository from './retailer/RetailerRepository'
import RulesGroupRepository from './rulesGroup/RulesGroupRepository'
import RulesRepository from './rulesGroup/RulesRepository'
import StoreRepository from './store/StoreRepository'
import SubscriptionRepository from './subscription/SubscriptionRepository'
import UserRepository from './user/UserRepository'
import CheckoutRepository from './checkouts/checkoutsRepository'
import ReceiptsRepository from './receipts/receiptsRepository'

const repositories: any = {
  order: new OrderRepository('/orders'),
  retailer: new RetailerRepository('/retailers'),
  store: new StoreRepository('/stores'),
  carrier: new CarrierRepository('/carriers'),
  quote: new QuoteRepository('/quotes'),
  catalog: new CatalogRepository('/catalogs'),
  catalogProduct: new CatalogProductRepository('/catalogs/products'),
  billing: new BillingRepository('/billings'),
  comment: new CommentRepository('/comments'),
  notification: new NotificationRepository('/notifications'),
  notificationState: new NotificationStatesRepository('/notificationStates'),
  notificationActivations: new NotificationStatesRepository('/notificationActivations'),
  exchangePlace: new ExchangePlaceRepository('/exchangePlaces'),
  orderEligibility: new OrderEligibilityRepository('/orderEligibilities'),
  user: new UserRepository('/users'),
  address: new AddressRepository('/addresses'),
  userAlert: new UserAlertRepository('/userAlerts'),
  alertSubscription: new AlertSubscriptionRepository('/alertSubscriptions'),
  delivery: new DeliveryRepository('/deliveries'),
  rules: new RulesRepository('/rules'),
  rulesGroup: new RulesGroupRepository('/rulesGroups'),
  subscription: new SubscriptionRepository('/subscriptions'),
  clientPage: new ClientPageRepository('/clientPages'),
  dashboard: new DashboardRepository('/dashboards'),
  administration: new AdministrationRepository('/administrations'),
  collect: new CollectRepository('/collects'),
  statusMapping: new CollectRepository('/statusMappings'),
  createOrder: new createOrderRepository('/createOrder'),
  pickupPoints: new pickupPointsRepository('/pickupPoints'),
  parcels: new ParcelRepository('/parcels'),
  alerts: new AlertsRepository('/alerts'),
  carrierScores: new CarrierScoreRepository('/carrierScores'),
  ftpAccounts: new FtpAccountsRepository('/ftpAccounts'),
  ftp: new FtpRepository('/ftp'),
  checkouts: new CheckoutRepository('/checkouts'),
  receipts: new ReceiptsRepository('/receipts'),
}

const RepositoryFactory = {
  get: (name: string): any => repositories[name],
}

export default RepositoryFactory
