export * from './rules'

export const ROUTES = {
  root: 'root',
  orders: 'orders',
  alert: 'alert',
  createOrder: 'createOrder',
  editOrder: 'editOrder',
  detailOrder: 'detailOrder',
  export: 'export',
  retailers: 'retailers',
  addRetailer: 'addRetailer',
  editRetailer: 'editRetailer',
  detailClientPage: 'detailClientPage',
  addClientPage: 'addClientPage',
  editClientPage: 'editClientPage',
  detailRetailer: 'detailRetailer',
  subscriptions: 'subscriptions',
  users: 'users',
  profile: 'profile',
  editProfile: 'editProfile',
  detailUser: 'detailUser',
  addUser: 'addUser',
  editUser: 'editUser',
  addPermission: 'addPermission',
  editPermission: 'editPermission',
  rulesGroups: 'rulesGroups',
  addRulesGroup: 'addRulesGroup',
  editRulesGroup: 'editRulesGroup',
  DesignSystem: 'DesignSystem',
  about: 'about',
  termsConditions: 'termsConditions',
  contact: 'contact',
  noAccess: 'noAccess',
  notFound: 'notFound',
  detailStore: 'detailStore',
  createStore: 'createStore',
  updateStore: 'updateStore',
  carriers: 'carriers',
  addCarrier: 'addCarrier',
  editCarrier: 'editCarrier',
  statusMappings: 'statusMappings',
  editCarrierRetailer: 'editCarrierRetailer',
  editCarrierStore: 'editCarrierStore',
  editCarrierExchangePlace: 'editCarrierExchangePlace',
  detailCarrier: 'detailCarrier',
  detailCarrierRetailer: 'detailCarrierRetailer',
  detailCarrierStore: 'detailCarrierStore',
  detailCarrierExchangePlace: 'detailCarrierExchangePlace',
  login: 'login',
  specificPartnerLogin: 'specificPartnerLogin',
  exchangePlace: 'exchangePlace',
  createExchangePlace: 'createExchangePlace',
  updateExchangePlace: 'updateExchangePlace',
  dashboard: 'dashboard',
  shareDashboard: 'shareDashboard',
  editDashboardPermissions: 'editDashboardPermissions',
  addDashboardPermissions: 'addDashboardPermissions',
  editDashboard: 'editDashboard',
  createDashboard: 'createDasboard',
  administrationConfig: 'administrationConfig',
  administrationConfigEdit: 'administrationConfigEdit',
  alertConfigEdit: 'alertConfigEdit',
  alertConfigDetail: 'alertConfigDetail',
  createTypicalWeek: 'createTypicalWeek',
  editTypicalWeek: 'editTypicalWeek',
  createCarrierTypicalWeek: 'createCarrierTypicalWeek',
  editCarrierTypicalWeek: 'editCarrierTypicalWeek',
  validitySlotPeriod: 'validitySlotPeriod',
  createExceptions: 'createExceptions',
  detailExceptions: 'detailExceptions',
  editExceptions: 'editExceptions',
  carrierCreateExceptions: 'carrierCreateExceptions',
  carrierDetailExceptions: 'carrierDetailExceptions',
  carrierEditExceptions: 'carrierEditExceptions',
  detailCollect: 'detailCollect',
  listCollect: 'listCollect',
  createProductReturn: 'createProductReturn',
  notificationAdministration: 'notificationAdministration',
  carrierFtpAccounts: 'carrierFtpAccounts',
  addCarrierFtpAccounts: 'addCarrierFtpAccounts',
  editCarrierFtpAccounts: 'editCarrierFtpAccounts',
  retailerFtpAccounts: 'retailerFtpAccounts',
  addRetailerFtpAccounts: 'addRetailerFtpAccounts',
  editRetailerFtpAccounts: 'editRetailerFtpAccounts',
  retailerCustomCheckout: 'retailerCustomCheckout',
  retailerEditCustomCheckout: 'retailerEditCustomCheckout',
  retailerCustomCheckoutPreview: 'retailerCustomCheckoutPreview',
  storeCustomCheckout: 'storeCustomCheckout',
  storeEditCustomCheckout: 'storeEditCustomCheckout',
  storeCustomCheckoutPreview: 'storeCustomCheckoutPreview',
  notificationsReporting: 'notificationsReporting',
  editNotification: 'editNotification',
  createNotification: 'createNotification',
  notificationDetail: 'notificationDetail',
}

export const TIME_UNIT = [
  {
    value: 'hours',
    text: 'hour_plural',
  },
  {
    value: 'minutes',
    text: 'minute_plural',
  },
  {
    value: 'days',
    text: 'day_plural',
  },
]

export enum CountriesCodeEnum {
  FR = 'FR',
  ES = 'ES',
  BE = 'BE',
}

export const maxInt = 2147483647

export enum LOCAL_STORAGE {
  ACCESS_TOKEN = 'access_token',
  REFRESH_TOKEN = 'refresh_token',
  RESET_TOKEN = 'reset_token',
  SPECIFIC_PARTNER_LOGIN_CODE = 'specific_partner_login_code',
  PROVIDER_NAME = 'provider_name',
  WAITING_PROVIDER_LOGIN = 'waiting_provider_login',
  REQUESTED_PAGE = 'requested_page',
}

export enum NOTIFICATIONS_TARGET {
  RETAILER_MAIN_CONTACT = 'RETAILER_MAIN_CONTACT',
  STORE_MAIN_CONTACT = 'STORE_MAIN_CONTACT',
  PICKING_CONTACT = 'PICKING_CONTACT',
  DELIVERY_CONTACT = 'DELIVERY_CONTACT',
  CARRIER_CONTACT = 'CARRIER_CONTACT',
}

export const SHOW_INFORMATION_LENGTH = 10000
export const REFRESH_DATA_INTERVAL = 300000
export const FILE_CATALOG_SIZE = 20000000
export const MAX_LOGO_SIZE = 2000000

export const DELIVERY_INTERVAL_MODE = {
  EXPRESS: 'INTERVAL_MODE_EXPRESS',
  STANDARD: 'INTERVAL_MODE_STANDARD',
}

export const NO_SENDING_DELAY = 'NO_SENDING_DELAY'

export const NO_MAX_DELAY = 'NO_MAX_DELAY'

export const DELAY_SLOT_TIME = [
  { text: '1h', value: '01h00' },
  { text: '2h', value: '02h00' },
  { text: '3h', value: '03h00' },
  { text: '4h', value: '04h00' },
  { text: '5h', value: '05h00' },
  { text: '6h', value: '06h00' },
  { text: '12h', value: '12h00' },
  { text: '24h', value: '24h00' },
  { text: '48h', value: '48h00' },
  { text: '72h', value: '72h00' },
  { text: '96h', value: '96h00' },
]

export enum PICKER_FORMAT {
  HOURS24 = '24hr',
  AMPM = 'ampm',
}

// more infos : https://github.com/ladjs/i18n-locales
export const LOCALE_TIME_PICKER_FORMAT_24H = [
  'fr',
  'fr-BE',
  'fr-CA',
  'fr-CH',
  'fr-FR',
  'fr-LU',
  'fr-MC',
]
export const LOCALE_TIME_PICKER_FORMAT_AM_PM = [
  'en',
  'en-AU',
  'en-BZ',
  'en-CA',
  'en-CB',
  'en-GB',
  'en-IE',
  'en-JM',
  'en-NZ',
  'en-PH',
  'en-TT',
  'en-US',
  'en-ZA',
  'en-ZW',
]

export const OTHER_TIME_SLOT_VALUE = 'otherTimeSlot'

export const DELIVERY_SLOT_TIME_SLOTS_FROM_API = [
  { text: '8h-10h', value: '08:00-10:00' },
  { text: '9h-11h', value: '09:00-11:00' },
  { text: '10h-12h', value: '10:00-12:00' },
  { text: '11h-13h', value: '11:00-13:00' },
  { text: '12h-14h', value: '12:00-14:00' },
  { text: '13h-15h', value: '13:00-15:00' },
  { text: '14h-16h', value: '14:00-16:00' },
  { text: '15h-17h', value: '15:00-17:00' },
  { text: '16h-18h', value: '16:00-18:00' },
  { text: '17h-19h', value: '17:00-19:00' },
  { text: '18h-20h', value: '18:00-20:00' },
  { text: '19h-21h', value: '19:00-21:00' },
  { text: '20h-22h', value: '20:00-22:00' },
]

export enum AuthStatus {
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  PENDING = 'PENDING',
  UNKNOWN = 'UNKNOWN',
}

export const MAX_EXISTING_CATCHPHRASE = 6

export const SHORT_DAY = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']

export const EXCHANGE_PLACE_TYPE = {
  EXCHANGE_PLACE_STORE: 'EXCHANGE_PLACE_STORE',
  EXCHANGE_PLACE_PFU: 'EXCHANGE_PLACE_PFU',
  EXCHANGE_PLACE_STORAGE: 'EXCHANGE_PLACE_STORAGE',
  EXCHANGE_PLACE_DRIVE: 'EXCHANGE_PLACE_DRIVE',
}

export const PAGINATION_LIMIT = 100

export const AVAILABLE_PACKAGE_SIZE_TYPE = {
  DEFAULT: 'DEFAULT',
  RETAILER: 'RETAILER',
  OTHER: 'OTHER',
}

export const AVAILABLE_PACKAGE_SIZE = [
  {
    label: 'XS',
    type: AVAILABLE_PACKAGE_SIZE_TYPE.DEFAULT,
    value: 1,
    unit: 'cm',
    dimension: {
      width: '20',
      length: '5',
      height: '25',
    },
  },
  {
    label: 'S',
    type: AVAILABLE_PACKAGE_SIZE_TYPE.DEFAULT,
    value: 2,
    unit: 'cm',
    dimension: {
      width: '30',
      length: '15',
      height: '35',
    },
  },
  {
    label: 'M',
    type: AVAILABLE_PACKAGE_SIZE_TYPE.DEFAULT,
    value: 3,
    unit: 'cm',
    dimension: {
      width: '40',
      length: '25',
      height: '45',
    },
  },
  {
    label: 'L',
    type: AVAILABLE_PACKAGE_SIZE_TYPE.DEFAULT,
    value: 4,
    unit: 'cm',
    dimension: {
      width: '50',
      length: '35',
      height: '55',
    },
  },
  {
    label: 'XL',
    type: AVAILABLE_PACKAGE_SIZE_TYPE.DEFAULT,
    value: 5,
    unit: 'cm',
    dimension: {
      width: '60',
      length: '45',
      height: '65',
    },
  },
  {
    label: 'XXL',
    type: AVAILABLE_PACKAGE_SIZE_TYPE.DEFAULT,
    value: 6,
    unit: 'cm',
    dimension: {
      width: '70',
      length: '55',
      height: '75',
    },
  },
]

export const CARRIER_SUBSCRIPTION = [
  'label',
  'quote',
  'score',
  'status',
  'delivery',
  'pickupPoint',
  'cancelDelivery',
  'update',
  'cancelQuote',
  'slip',
]

export const RETAILER_SUBSCRIPTION = [
  'carrier',
  'event',
  'orderStatus',
  'deliveryStatus',
  'parcelStatus',
  'score',
  'deliveryClosure',
  'deltaCost',
  'quote',
  'collectStatus',
  'deleteCollectBooking',
  'deliveryStop',
  'receipt',
  'tracking',
]

export enum LEGACY_DELIVERY_STATUS {
  INIT = 'DELIVERY_INIT',
  STARTED = 'DELIVERY_STARTED',
  PICK_UP_REACHED = 'DELIVERY_PICK_UP_REACHED',
  PICK_UP_OK = 'DELIVERY_PICK_UP_OK',
  PICK_UP_FAILED = 'DELIVERY_PICK_UP_FAILED',
  PICK_UP_PARTIALLY = 'DELIVERY_PICK_UP_PARTIALLY',
  IN_PROGRESS = 'DELIVERY_IN_PROGRESS',
  AT_DROP_OF_LOCATION = 'DELIVERY_AT_DROP_OF_LOCATION',
  DELIVERED_OK = 'DELIVERY_DELIVERED_OK',
  DELIVERED_WITH_CLAIM = 'DELIVERY_DELIVERED_WITH_CLAIM',
  DELIVERED_PARTIALLY = 'DELIVERY_DELIVERED_PARTIALLY',
  FAILED_WITH_RETURN = 'DELIVERY_FAILED_WITH_RETURN',
  RETURNED_TO_PICK_UP = 'DELIVERY_RETURNED_TO_PICK_UP',
  CANCELLED = 'DELIVERY_CANCELLED',
  CANCELLED_WITH_RETURN = 'DELIVERY_CANCELLED_WITH_RETURN',
  BLOCKED = 'DELIVERY_BLOCKED',
  DELAYED = 'DELIVERY_DELAYED',
  AVAILABLE = 'DELIVERY_AVAILABLE',
}

export enum DELIVERY_STATUS {
  INIT = 'DELIVERY_INIT',
  TEAM_ASSIGNED = 'DELIVERY_TEAM_ASSIGNED',
  PICK_UP_STARTED = 'DELIVERY_PICK_UP_STARTED',
  PICK_UP_REACHED = 'DELIVERY_PICK_UP_REACHED',
  PICK_UP_OK = 'DELIVERY_PICK_UP_OK',
  PICK_UP_KO = 'DELIVERY_PICK_UP_KO',
  IN_TRANSIT = 'DELIVERY_IN_TRANSIT',
  IN_PROGRESS = 'DELIVERY_IN_PROGRESS',
  AT_DROP_OFF_LOCATION = 'DELIVERY_AT_DROP_OFF_LOCATION',
  OK = 'DELIVERY_OK',
  KO = 'DELIVERY_KO',
  RETURNED_TO_SENDER = 'DELIVERY_RETURNED_TO_SENDER',
  CANCELLED = 'DELIVERY_CANCELLED',
  BLOCKED = 'DELIVERY_BLOCKED',
  DELAYED = 'DELIVERY_DELAYED',
  AVAILABLE = 'DELIVERY_AVAILABLE',
  CANCELLATION_REQUESTED = 'DELIVERY_CANCELLATION_REQUESTED',
  CANCELLATION_REJECTED = 'DELIVERY_CANCELLATION_REJECTED',
  REPLANNED = 'DELIVERY_REPLANNED',
  CLOSED = 'DELIVERY_CLOSED',
}

export enum SUB_STATUS {
  FAILED = 'FAILED',
  FAILED_WITH_RETRY = 'FAILED_WITH_RETRY',
  FAILED_WITH_RETURN = 'FAILED_WITH_RETURN',
  WITH_CLAIM = 'WITH_CLAIM',
  REFUSED = 'REFUSED',
  NOT_COLLECTED = 'NOT_COLLECTED',
}

export const DELIVERY_STATUS_DETAIL = [
  {
    status: DELIVERY_STATUS.INIT,
  },
  {
    status: DELIVERY_STATUS.TEAM_ASSIGNED,
  },
  {
    status: DELIVERY_STATUS.PICK_UP_STARTED,
  },
  {
    status: DELIVERY_STATUS.PICK_UP_REACHED,
  },
  {
    status: DELIVERY_STATUS.PICK_UP_OK,
  },
  {
    status: DELIVERY_STATUS.PICK_UP_KO,
    subStatus: SUB_STATUS.FAILED_WITH_RETRY,
  },
  {
    status: DELIVERY_STATUS.PICK_UP_KO,
    subStatus: SUB_STATUS.FAILED,
  },
  {
    status: DELIVERY_STATUS.IN_TRANSIT,
  },
  {
    status: DELIVERY_STATUS.IN_PROGRESS,
  },
  {
    status: DELIVERY_STATUS.AT_DROP_OFF_LOCATION,
  },
  {
    status: DELIVERY_STATUS.OK,
  },
  {
    status: DELIVERY_STATUS.OK,
    subStatus: SUB_STATUS.WITH_CLAIM,
  },
  {
    status: DELIVERY_STATUS.KO,
    subStatus: SUB_STATUS.FAILED_WITH_RETRY,
  },
  {
    status: DELIVERY_STATUS.KO,
    subStatus: SUB_STATUS.FAILED_WITH_RETURN,
  },
  {
    status: DELIVERY_STATUS.KO,
    subStatus: SUB_STATUS.REFUSED,
  },
  {
    status: DELIVERY_STATUS.KO,
    subStatus: SUB_STATUS.NOT_COLLECTED,
  },
  {
    status: DELIVERY_STATUS.RETURNED_TO_SENDER,
  },
  {
    status: DELIVERY_STATUS.CANCELLED,
  },
  {
    status: DELIVERY_STATUS.BLOCKED,
  },
  {
    status: DELIVERY_STATUS.DELAYED,
  },
  {
    status: DELIVERY_STATUS.AVAILABLE,
  },
  {
    status: DELIVERY_STATUS.REPLANNED,
  },
  {
    status: DELIVERY_STATUS.CLOSED,
  },
]

export const DELIVERY_STATUS_ERR: string[] = [
  DELIVERY_STATUS.PICK_UP_KO,
  DELIVERY_STATUS.KO,
  DELIVERY_STATUS.CANCELLED,
  DELIVERY_STATUS.DELAYED,
  DELIVERY_STATUS.BLOCKED,
  DELIVERY_STATUS.CLOSED,
]

export const CONTINUE_DELIVERY_STATUS: string[] = [DELIVERY_STATUS.CANCELLED]

export const ADDRESS_TYPE = {
  EXCHANGE_PLACE: 'exchangePlace',
  ADDRESS: 'address',
  PICKUP_POINT: 'pickupPoint',
  OTHER: 'other',
}

export enum ClientPageCategory {
  DELIVERY = 'DELIVERY',
  COLLECT = 'COLLECT',
}

export enum CollectClientPageType {
  DRIVE_TRACKING = 'DRIVE_TRACKING',
  DRIVE_SLOT = 'DRIVE_SLOT',
  DRIVE_SLOT_SUCCESS = 'DRIVE_SLOT_SUCCESS',
  REPORT_PRESENCE_AT_DRIVE = 'REPORT_PRESENCE_AT_DRIVE',
  REPORT_PRESENCE_AT_DRIVE_SUCCESS = 'REPORT_PRESENCE_AT_DRIVE_SUCCESS',
  DRIVE_SURVEY = 'DRIVE_SURVEY',
  DRIVE_CONFIRMATION = 'DRIVE_CONFIRMATION',
}
export enum DeliveryClientPageType {
  SURVEY = 'SURVEY',
  TRACKING = 'TRACKING',
  MULTI_TRACKING = 'MULTI_TRACKING',
  CONFIRMATION = 'CONFIRMATION',
}

export const ClientPageType = {
  COLLECT: CollectClientPageType,
  DELIVERY: DeliveryClientPageType,
}

export const AllClientPageTypes = {
  ...CollectClientPageType,
  ...DeliveryClientPageType,
}

export const DISABLED_DEFAULT_CLIENT_PAGE_TYPE = [
  ClientPageType.COLLECT.DRIVE_TRACKING,
  ClientPageType.COLLECT.DRIVE_SLOT,
  ClientPageType.COLLECT.DRIVE_SURVEY,
  ClientPageType.COLLECT.DRIVE_SLOT_SUCCESS,
  ClientPageType.COLLECT.REPORT_PRESENCE_AT_DRIVE,
  ClientPageType.COLLECT.REPORT_PRESENCE_AT_DRIVE_SUCCESS,
]

export enum ClientPageQuestionType {
  CUSTOM = 'CUSTOM',
  SCORE_SATISFACTION = 'SCORE_TYPE_SATISFACTION',
  SCORE_RECOMMENDATION = 'SCORE_TYPE_RECOMMENDATION',
}

export enum ClientPagePhoneType {
  STORE = 'STORE',
  EXCHANGE_PLACE = 'EXCHANGE_PLACE',
  CUSTOM = 'CUSTOM',
  EMPTY = 'EMPTY',
}

export enum CarrierContactType {
  CARRIER = 'CARRIER',
  CUSTOM = 'CUSTOM',
  EMPTY = 'EMPTY',
}

export const ORDER_LIST_ACTIONS_TYPE = {
  MERGE: 'MERGE',
  SLIP: 'SLIP',
  LABEL: 'LABEL',
}

export const ORDER_LIST_PANEL_TYPE = {
  MERGE: 'MERGE',
  LABEL: 'LABEL',
}

export const DASHBOARD_ACTIONS_TYPE = {
  MODIFY: 'MODIFY',
  SHARE: 'SHARE',
}

export const CONTACT_TITLES = {
  LEGAL_REPRESENTATIVE: 'LEGAL_REPRESENTATIVE',
  ADMINISTRATIVE: 'ADMINISTRATIVE',
  EXPLOITATION: 'EXPLOITATION',
}

export const USER_LIST_ACTIONS_TYPE = {
  EDIT_USERS: 'EDIT_USERS',
  SEND_INVITE: 'SEND_INVITE',
  TOGGLE_USER: 'TOGGLE_USER',
}

export const USER_DETAIL_ACTIONS_TYPE = {
  DELETE_USER: 'DELETE_USER',
  ADD_PERMISSION: 'ADD_PERMISSION',
  EDIT_USERS: 'EDIT_USERS',
  SEND_INVITE: 'SEND_INVITE',
}

export const LOCAL_ACCOUNT_ALLOWED = ['google']

export const INTERNAL_USER_PROVIDER = ['keycloak']
