export * from '@/types/entities/address'
export * from '@/types/entities/administration'
export * from '@/types/entities/alertSubscription'
export * from '@/types/entities/auth'
export * from '@/types/entities/billing'
export * from '@/types/entities/carrier'
export * from '@/types/entities/carrierEligibility'
export * from '@/types/entities/carrierScore'
export * from '@/types/entities/catalog'
export * from '@/types/entities/clientPage'
export * from '@/types/entities/collect'
export * from '@/types/entities/comment'
export * from '@/types/entities/dashboard'
export * from '@/types/entities/delivery'
export * from '@/types/entities/deliveryStatus'
export * from '@/types/entities/exchangePlace'
export * from '@/types/entities/ftpAccount'
export * from '@/types/entities/notification'
export * from '@/types/entities/notificationStates'
export * from '@/types/entities/order'
export * from '@/types/entities/package'
export * from '@/types/entities/parcel'
export * from '@/types/entities/perimeter'
export * from '@/types/entities/pickupPoint'
export * from '@/types/entities/quote'
export * from '@/types/entities/retailer'
export * from '@/types/entities/statusMapping'
export * from '@/types/entities/store'
export * from '@/types/entities/subscription'
export * from '@/types/entities/user'
export * from '@/types/entities/userAlert'

export type VFormType = Vue & {
  validate: () => boolean
  reset(): void
  resetErrorBag(): void
  resetValidation(): void
}

export interface NavLink {
  route: string | null
  title: string
  children?: NavLink[]
  feature?: string
}

export type DateInterval = {
  start: string
  end: string
  bookingId?: string
}

export const getDefaultContact = (): Contact => {
  return {
    main: false,
    email: '',
    phone: '',
    title: '',
    language: '',
    lastName: '',
    firstName: '',
    timezone: '',
    isProfessional: false,
  }
}

export interface Contact {
  main?: boolean | null | string
  email: string
  phone: string
  title?: string
  language: string
  lastName: string
  firstName: string
  timezone: string
  isProfessional?: boolean
}

export const getDefaultAddress = (severalContacts = false): Address => {
  return {
    title: '',
    main: false,
    addressLine1: '',
    addressLine2: '',
    elevator: false,
    floor: 0,
    doorCode: '',
    postalCode: '',
    city: '',
    district: '',
    country: '',
    comment: '',
    contacts: severalContacts ? [getDefaultContact()] : getDefaultContact(),
  }
}

export interface Address {
  type?: string
  title?: string | null
  main?: boolean | null
  addressLine1: string
  addressLine2?: string
  elevator?: boolean | null
  floor?: number | null
  doorCode?: string | null
  postalCode: string
  city: string
  district?: string | null
  country: string
  comment?: string
  contacts?: Contact[] | Contact
  formated?: string
  exchangePlaceId?: string | number | null
  typeFront?: number | null
  storeId?: number
  coordinates?: Coordinates
  pickupPointId?: string
  carrierCode?: string
  address?: Address
}

export interface SelectItem {
  value?: any
  text: string
}

export interface BreadCrumb {
  name: string
  link: string
}

export interface RadioValues {
  label: string
  value: string | number
}

export interface Filters {
  id: number
  name: string
  externalId?: string
  active?: boolean
  timezone?: string
  language?: string
}

export interface Coordinates {
  latitude: number
  longitude: number
}

export const getDefaultManualQuote = (): ManualQuote => {
  return {
    currency: '',
    externalDeliveryId: '',
    taxExcludedAmount: '',
    vehicleType: '',
    eligibilityParams: null,
  }
}

export interface ManualQuote {
  externalDeliveryId: string
  taxExcludedAmount: string
  vehicleType: string
  currency: string
  eligibilityParams: {
    carrierId?: number
    retailerId: number
    storeId: number
    exchangePlaceId?: number
  } | null
}

// shared with DS if modify here modify DS too
export interface ExpandBlockEntityInfo {
  icon: string
  text: string
}

// shared with DS if modify here modify DS too
export interface ExpandBlockEntity {
  id: string | number
  logo?: string
  name?: string
  infos: ExpandBlockEntityInfo[]
}

export enum BadgeColor {
  GREEN = 'green',
  ORANGE = 'orange',
  RED = 'red',
}

export interface DataTableHeader {
  text: string
  tooltip?: string
  align?: string
  sortable: boolean
  value: string
  width?: string
  icon?: string
  picto?: string
  hide?: boolean
}

export enum CHECKOUT_BLOCKS {
  SENDER_IDENTITY = 'SENDER_IDENTITY',
  SHIPPING_CONTACT = 'SHIPPING_CONTACT',
  SHIPPING_DATE = 'SHIPPING_DATE',
  DEPARTURE = 'DEPARTURE',
  DELIVERY_CONTACT = 'DELIVERY_CONTACT',
  DELIVERY_DATE = 'DELIVERY_DATE',
  ARRIVAL = 'ARRIVAL',
  CUSTOMER_CODE = 'CUSTOMER_CODE',
  ORDER_CONTENT = 'ORDER_CONTENT',
  TICKET_CONTENT = 'TICKET_CONTENT',
  SERVICES = 'SERVICES',
  CARRIERS = 'CARRIERS',
  PICKUP_POINT = 'PICKUP_POINT',
  SCAN = 'SCAN',
  STATE = 'STATE',
}

export interface CustomCheckoutBlock {
  name: string
  isOptional: boolean
  isRecommended: boolean
  fakeId?: number
  disabled: boolean
}

export interface CheckoutSteps {
  step1: string[]
  step2: string[]
  step3: string[]
  step4: string[]
  step5: string[]
}

export interface Checkout {
  published: boolean
  steps: CheckoutSteps
  updatedAt: string
  id: number | null
  retailerId: number | null
  storeId?: number | null
  name: string
  createdAt: string
}

export const defaultFilledSteps = (): CheckoutSteps => {
  return {
    step1: ['SENDER_IDENTITY', 'DEPARTURE', 'ARRIVAL'],
    step2: ['ORDER_CONTENT'],
    step3: ['SHIPPING_DATE', 'SERVICES'],
    step4: ['DELIVERY_DATE', 'CARRIERS', 'PICKUP_POINT'],
    step5: ['CUSTOMER_CODE', 'SHIPPING_CONTACT', 'DELIVERY_CONTACT'],
  }
}
export const defaultCheckoutFilled = (): Checkout => {
  return {
    published: false,
    steps: { ...defaultFilledSteps() },
    updatedAt: '',
    id: 0,
    retailerId: null,
    storeId: undefined,
    name: '',
    createdAt: '',
  }
}

export enum Week {
  MONDAY = 'monday',
  TUESDAY = 'tuesday',
  WEDNESDAY = 'wednesday',
  THURSDAY = 'thursday',
  FRIDAY = 'friday',
  SATURDAY = 'saturday',
  SUNDAY = 'sunday',
}

export type CutOff = {
  hours: string
  minutes: string
}
