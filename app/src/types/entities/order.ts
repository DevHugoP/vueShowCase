import {
  Address,
  AddressDescription,
  BillingEntity,
  CarrierEligibilityEntity,
  CarrierEntity,
  CatalogProduct,
  Contact,
  DateInterval,
  DeliveryEntity,
  DeliveryStatusEntity,
  PackageEntity,
  PickupPoint,
  ProductEntity,
  QuoteEntity,
  RetailerEntity,
  Specifications,
  StoreEntity,
} from '@/types'

export interface PickingInformations {
  address: Address
  infos?: string | null
  interval: DateInterval[]
  contact: Contact
}

export interface OrderStatusEntity {
  id: number
  date: string
  status: string
  comment: string
  orderId: number
  createdAt: string
  updatedAt: string
}

export interface OrderHistoryLight {
  id: number
  type: string
  orderId: number
  createdAt: string | Date
  updatedAt: string | Date
  author: {
    id: string
    name: string
  }
  requestId: string
}

export type OrderHistory = OrderHistoryLight & {
  before: any
  after: any
}

export enum CarrierSelectionMode {
  EXCLUSION = 'EXCLUSION',
  INCLUSION = 'INCLUSION',
}

export type CarrierSelection = {
  mode: CarrierSelectionMode
  carrierCodes: string[]
}

export interface OrderEntity {
  state?: string
  id: number
  externalOrderId: string
  referenceNumber?: string
  picking: PickingInformations
  delivery: PickingInformations
  storeId: number
  createdAt: string
  updatedAt: string
  retailerId: number
  isAnonymized: boolean
  services: string[]
  productsPrice: number | null
  status: string
  OrderStatus: OrderStatusEntity[]
  OrderEligibility: Partial<CarrierEligibilityEntity>
  Store: StoreEntity
  Retailer: RetailerEntity
  Delivery: DeliveryEntity
  Carrier: CarrierEntity
  Billing: BillingEntity[]
  Quote: QuoteEntity | null
  DeliveryScore: any[]
  DeliveryStatus: DeliveryStatusEntity[]
  DeliveryPackage: any[]
  packages: PackageEntity[]
  tags: Array<{ key: string; value: string; applyToOrchestration?: boolean }>
  specifications?: Specifications
  carrierId?: number
  pickupPoint?: PickupPoint
  carrierSelection?: CarrierSelection
  distance?: number
}

export interface OrderLightEntity {
  date: string
  retailerId: number
  retailerName: string
  storeName: string
  storeId: number
  deliveryCurrentStatus: string | null
  deliverySubStatus: string | null
  pickingStartDate: string
  deliveryStartDate: string
  deliveryEndDate: string
  deliveryContactLastName: string
  deliveryContactPhone: string
  externalDeliveryId: string | null
  orderId: number
  referenceNumber: string
  externalOrderId: string
  carrierName: string | null
  carrierId: number | null
  orderCurrentStatus: string
  internalFleetId: number | null
  internalFleetName: number | null
  internalFleetDrive: number | null
  services: string[]
}

export interface OrderDocument {
  id: string
  date: string
  type: string
  name: string
}

export interface Price {
  currency: string
  value: number
}

export type Valuation = {
  carrierId: number
  price: Price
}

export interface CreateOrderItinerayAddress {
  apiAddress: AddressDescription | null
  loading: boolean
  suggestions: AddressDescription[]
  showMore: boolean
}

export interface CreateOrderApiAddress {
  apiAddress: AddressDescription | null
  loading: boolean
  suggestions: AddressDescription[]
  showMore: boolean
}

export enum CreateOrderItineraryClearFieldsType {
  RETAILER = 'RETAILER',
  STORE = 'STORE',
  STORE_DELIVERY = 'STORE_DELIVERY',
  EXCHANGE_PLACE = 'EXCHANGE_PLACE',
  EXCHANGE_PLACE_DELIVERY = 'EXCHANGE_PLACE_DELIVERY',
  API_CHANGE_PICKING = 'API_CHANGE_PICKING',
  API_CLEAR_PICKING = 'API_CLEAR_PICKING',
  API_CHANGE_DELIVERY = 'API_CHANGE_DELIVERY',
  API_CLEAR_DELIVERY = 'API_CLEAR_DELIVERY',
}

export enum CreateOrderServicePickingDayType {
  TODAY = 'TODAY',
  TOMORROW = 'TOMORROW',
  OTHER = 'OTHER',
}

export interface AvailablePackageSizeDimensionType {
  width: string
  length: string
  height: string
}

export interface AvailablePackageSizeType {
  label: string
  type: string
  value: number
  dimension: AvailablePackageSizeDimensionType
  unit?: string
  quantity?: number
}

export enum CatalogTypeEnum {
  cug = 'cug',
  ean = 'ean',
  label = 'label',
}

export interface CreateOrderProductSelected extends ProductEntity {
  text: string
  value: number
  productIndex: number
  showMore: boolean
  cugMenu: boolean
  eanMenu: boolean
  labelMenu: boolean
  suggestions: CatalogProduct[]
  [key: string]: any
}

export interface DialogOrderDetailUpdateStatus {
  status: string
  subStatus?: string
  date: string
  time: string
  timezone: string
  comment: string
  files: File[]
  parcelId?: string
}

export interface OrderDetailCloseDelivery {
  comment: string
}
