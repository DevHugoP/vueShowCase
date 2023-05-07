import { Contact } from '@/types'

export interface NotificationStatesFilter {
  carrierId?: number | number[] | null
  retailerId?: number | null
  storeId?: number | null
  exchangePlaceId?: number | number[] | null
  sort?: string
  offset?: number | null
  limit?: number | null
  ids?: number | number[] | null
  event?: string
  channel?: string
  isReturn?: boolean
  isActive?: boolean
  language?: string
  isCarrierSetAside?: boolean
  filterBy?: FilterByEnum
}

export enum NotificationsProgram {
  TRIGGER = 'trigger',
  SENDING_DELAY = 'sendingDelay',
  CLOSING_DELAY = 'closingDelay',
}

export enum EventType {
  DELIVERY = 'DELIVERY',
  COLLECT = 'COLLECT',
}

export interface MappedItem {
  id: string | number | boolean
  name: string
  subEvent?: string | null
}

export enum NotificationsItems {
  RETAILER = 'retailer',
  STORE = 'store',
  CARRIER = 'carrier',
  EXCHANGE_PLACES = 'exchangePlaces',
  TARGET = 'target',
  LANGUAGE = 'language',
  DELIVERY_EVENT = 'deliveryEvent',
  COLLECT_EVENT = 'collectEvent',
  ATTACHMENT = 'attachment',
}

export enum NotificationsActions {
  DELETE_NOTIFICATIONS = 'DELETE_NOTIFICATIONS',
  DEACTIVATE_NOTIFICATIONS = 'DEACTIVATE_NOTIFICATIONS',
  ACTIVATE_NOTIFICATIONS = 'ACTIVATE_NOTIFICATIONS',
  CREATE_NOTIFICATION = 'CREATE_NOTIFICATION',
}

export enum NotificationSingleActions {
  EDIT_NOTIFICATION = 'EDIT_NOTIFICATION',
  SWITCH_NOTIFICATION = 'SWITCH_NOTIFICATION',
  DELETE_NOTIFICATION = 'DELETE_NOTIFICATION',
}

export enum NotificationsChannel {
  SMS = 'SMS',
  MAIL = 'MAIL',
}

export enum FilterByEnum {
  RETAILER = 'retailer',
  STORE = 'store',
  EXCHANGE_PLACE = 'exchangePlace',
}

export interface Delay {
  value: number
  unit: string
}

export interface NotificationStatesEntity {
  id: number
  carrierId?: number | null
  retailerId?: number | null
  storeId?: number | null
  exchangePlaceId?: number | null
  channel: string
  event: string
  subEvent: string
  config: Config
  createdAt: string
  updatedAt: string
  language: string
  isActive: boolean
  setAsideCarrierIds?: number[] | null
  selected?: boolean
}

export interface NotificationItem {
  id: number
  carrierId?: number | null
  carrierName?: string[] | string | null
  storeName?: string[] | string | null
  exchangePlaceName?: string[] | string | null
  retailerName?: string | null
  retailerId?: number | null
  storeId?: number | null
  exchangePlaceId?: number | null
  channel: string
  event: string
  subEvent: string
  config: Config
  createdAt: string
  updatedAt: string
  language: string
  isActive: boolean
  setAsideCarrierIds?: number[]
  selected?: boolean
}

export type CreateConfig = Omit<Config, 'content' | 'useDefault'> & {
  SMS: Record<string, ConfigByChannel>
  MAIL: Record<string, ConfigByChannel>
}

export type ConfigByChannel = {
  isActive: boolean
  subject?: string
  content: string
  useDefault: boolean
  senderName?: string
  recipients?: Contact[] | null
  attachment?: Attachment | null
}

export enum Attachment {
  LABEL = 'LABEL',
}

export type Config = {
  target?: string
  sendingDate?: SendingDate
  delay?: Delay
  eventMaxAge?: Delay
  subject?: string
  content?: string
  useDefault: boolean
  senderName?: string
  isActive?: boolean
  recipients?: Contact[] | null
  attachment?: Attachment | null
}

export type ConfigNew = {
  [key: string]: {
    [key: string]: {
      target?: string
      sendingDate?: SendingDate
      delay?: Delay
      eventMaxAge?: Delay
      subject?: string
      content?: string | null
      useDefault: boolean | null
      senderName?: string
      isActive?: boolean
      recipients?: Contact[] | null
      attachment?: Attachment | null
    }
  }
}

export enum SendingDate {
  // EVENT_RETRIEVED ='EVENT_RETRIEVED',
  DELIVERY_DATE = 'DELIVERY_DATE',
  PICKING_DATE = 'PICKING_DATE',
}

export enum NOTIFICATION_AFFILIATION_TYPES {
  ALL = 'all',
  RETAILER = 'retailer',
  STORE = 'store',
  EXCHANGE_PLACE = 'exchangePlace',
}

export enum NOTIFICATIONS_TARGET {
  RETAILER_MAIN_CONTACT = 'RETAILER_MAIN_CONTACT',
  STORE_MAIN_CONTACT = 'STORE_MAIN_CONTACT',
  PICKING_CONTACT = 'PICKING_CONTACT',
  DELIVERY_CONTACT = 'DELIVERY_CONTACT',
  CARRIER_CONTACT = 'CARRIER_CONTACT',
  CUSTOM = 'CUSTOM',
}

export enum NotificationSubEvent {
  FAILED = 'FAILED',
  FAILED_WITH_RETRY = 'FAILED_WITH_RETRY',
  FAILED_WITH_RETURN = 'FAILED_WITH_RETURN',
  WITH_CLAIM = 'WITH_CLAIM',
  REFUSED = 'REFUSED',
  NOT_COLLECTED = 'NOT_COLLECTED',
  CLOSED = 'CLOSED',
}

export enum CollectEvent {
  COLLECT_INIT = 'COLLECT_INIT',
  COLLECT_STARTED = 'COLLECT_STARTED',
  COLLECT_STOCK_OK = 'COLLECT_STOCK_OK',
  COLLECT_READY = 'COLLECT_READY',
  COLLECT_AWAITING = 'COLLECT_AWAITING',
  COLLECT_IN_PROGRESS = 'COLLECT_IN_PROGRESS',
  COLLECT_PICK_UP_OK = 'COLLECT_PICK_UP_OK',
  COLLECT_PICK_UP_PARTIALLY = 'COLLECT_PICK_UP_PARTIALLY',
  COLLECT_PICK_UP_FAILED = 'COLLECT_PICK_UP_FAILED',
  COLLECT_CANCELLED = 'COLLECT_CANCELLED',
  COLLECT_DELAYED = 'COLLECT_DELAYED',
  COLLECT_BLOCKED = 'COLLECT_BLOCKED',
  COLLECT_REPLANNED = 'COLLECT_REPLANNED',
}

export enum DeliveryEvent {
  ORDER_CREATED = 'ORDER_CREATED',
  DELIVERY_INIT = 'DELIVERY_INIT',
  DELIVERY_TEAM_ASSIGNED = 'DELIVERY_TEAM_ASSIGNED',
  DELIVERY_PICK_UP_OK = 'DELIVERY_PICK_UP_OK',
  DELIVERY_IN_PROGRESS = 'DELIVERY_IN_PROGRESS',
  DELIVERY_AT_DROP_OFF_LOCATION = 'DELIVERY_AT_DROP_OFF_LOCATION',
  DELIVERY_REPLANNED = 'DELIVERY_REPLANNED',
  DELIVERY_AVAILABLE = 'DELIVERY_AVAILABLE',
  DELIVERY_OK = 'DELIVERY_OK',
  ORDER_TO_BE_COMPLETED = 'ORDER_TO_BE_COMPLETED',
  ORDER_WITH_NO_CARRIER_ELIGIBLE = 'ORDER_WITH_NO_CARRIER_ELIGIBLE',
  ORDER_WITH_NO_CARRIER_AVAILABLE = 'ORDER_WITH_NO_CARRIER_AVAILABLE',
  ORDER_WITH_NO_QUOTE = 'ORDER_WITH_NO_QUOTE',
  DELIVERY_PICK_UP_KO = 'DELIVERY_PICK_UP_KO',
  DELIVERY_RETURNED_TO_SENDER = 'DELIVERY_RETURNED_TO_SENDER',
  DELIVERY_DELAYED = 'DELIVERY_DELAYED',
  ORDER_CANCELLED = 'ORDER_CANCELLED',
}

export enum MailLabelEvents {
  DELIVERY_IN_PROGRESS = 'DELIVERY_IN_PROGRESS',
  DELIVERY_TEAM_ASSIGNED = 'DELIVERY_TEAM_ASSIGNED',
  DELIVERY_OK = 'DELIVERY_OK',
  DELIVERY_INIT = 'DELIVERY_INIT',
  DELIVERY_PICK_UP_OK = 'DELIVERY_PICK_UP_OK',
  DELIVERY_AT_DROP_OFF_LOCATION = 'DELIVERY_AT_DROP_OFF_LOCATION',
  DELIVERY_AVAILABLE = 'DELIVERY_AVAILABLE',
  DELIVERY_RETURNED_TO_SENDER = 'DELIVERY_RETURNED_TO_SENDER',
}

export enum DELIVERY_TIMELINE_EVENTS {
  ORDER_CREATED = 'ORDER_CREATED',
  DELIVERY_INIT = 'DELIVERY_INIT',
  DELIVERY_TEAM_ASSIGNED = 'DELIVERY_TEAM_ASSIGNED',
  DELIVERY_PICK_UP_OK = 'DELIVERY_PICK_UP_OK',
  DELIVERY_IN_PROGRESS = 'DELIVERY_IN_PROGRESS',
  DELIVERY_AT_DROP_OFF_LOCATION = 'DELIVERY_AT_DROP_OFF_LOCATION',
  DELIVERY_REPLANNED = 'DELIVERY_REPLANNED',
  DELIVERY_AVAILABLE = 'DELIVERY_AVAILABLE',
  DELIVERY_OK = 'DELIVERY_OK',
}
export enum DELIVERY_TIMELINE_FAILED_EVENTS {
  ORDER_TO_BE_COMPLETED = 'ORDER_TO_BE_COMPLETED',
  ORDER_WITH_NO_CARRIER_ELIGIBLE = 'ORDER_WITH_NO_CARRIER_ELIGIBLE',
  ORDER_WITH_NO_CARRIER_AVAILABLE = 'ORDER_WITH_NO_CARRIER_AVAILABLE',
  ORDER_WITH_NO_QUOTE = 'ORDER_WITH_NO_QUOTE',
  DELIVERY_PICK_UP_KO = 'DELIVERY_PICK_UP_KO',
  DELIVERY_RETURNED_TO_SENDER = 'DELIVERY_RETURNED_TO_SENDER',
  DELIVERY_DELAYED = 'DELIVERY_DELAYED',
  ORDER_CANCELLED = 'ORDER_CANCELLED',
  DELIVERY_OK = 'DELIVERY_OK',
}

export enum COLLECT_TIMELINE_EVENTS {
  COLLECT_INIT = 'COLLECT_INIT',
  COLLECT_STARTED = 'COLLECT_STARTED',
  COLLECT_STOCK_OK = 'COLLECT_STOCK_OK',
  COLLECT_READY = 'COLLECT_READY',
  COLLECT_AWAITING = 'COLLECT_AWAITING',
  COLLECT_IN_PROGRESS = 'COLLECT_IN_PROGRESS',
  COLLECT_PICK_UP_OK = 'COLLECT_PICK_UP_OK',
  COLLECT_REPLANNED = 'COLLECT_REPLANNED',
}

export enum COLLECT_TIMELINE_FAILED_EVENTS {
  COLLECT_PICK_UP_PARTIALLY = 'COLLECT_PICK_UP_PARTIALLY',
  COLLECT_PICK_UP_FAILED = 'COLLECT_PICK_UP_FAILED',
  COLLECT_CANCELLED = 'COLLECT_CANCELLED',
  COLLECT_DELAYED = 'COLLECT_DELAYED',
  COLLECT_BLOCKED = 'COLLECT_BLOCKED',
}

export const MAIL_LABEL_EVENTS = [
  {
    status: DeliveryEvent.DELIVERY_IN_PROGRESS,
  },
  {
    status: DELIVERY_TIMELINE_FAILED_EVENTS.DELIVERY_OK,
    subStatus: NotificationSubEvent.WITH_CLAIM,
  },
  {
    status: DELIVERY_TIMELINE_FAILED_EVENTS.DELIVERY_OK,
  },
  {
    status: DELIVERY_TIMELINE_FAILED_EVENTS.DELIVERY_PICK_UP_KO,
    subStatus: NotificationSubEvent.FAILED_WITH_RETRY,
  },
  {
    status: DeliveryEvent.DELIVERY_INIT,
  },
  {
    status: DeliveryEvent.DELIVERY_TEAM_ASSIGNED,
  },
  {
    status: DeliveryEvent.DELIVERY_PICK_UP_OK,
  },
  {
    status: DeliveryEvent.DELIVERY_AT_DROP_OFF_LOCATION,
  },
  {
    status: DeliveryEvent.DELIVERY_AVAILABLE,
  },
  {
    status: DELIVERY_TIMELINE_FAILED_EVENTS.DELIVERY_RETURNED_TO_SENDER,
  },
  {
    status: DELIVERY_TIMELINE_FAILED_EVENTS.DELIVERY_DELAYED,
  },
  {
    status: DeliveryEvent.DELIVERY_REPLANNED,
  },
]

export const DELIVERY_TIMELINE_FAILED_EVENTS_CUSTOM = [
  {
    status: DELIVERY_TIMELINE_FAILED_EVENTS.ORDER_TO_BE_COMPLETED,
  },
  {
    status: DELIVERY_TIMELINE_FAILED_EVENTS.ORDER_WITH_NO_CARRIER_ELIGIBLE,
  },
  {
    status: DELIVERY_TIMELINE_FAILED_EVENTS.ORDER_WITH_NO_CARRIER_AVAILABLE,
  },
  {
    status: DELIVERY_TIMELINE_FAILED_EVENTS.ORDER_WITH_NO_QUOTE,
  },
  {
    status: DELIVERY_TIMELINE_FAILED_EVENTS.DELIVERY_PICK_UP_KO,
    subStatus: NotificationSubEvent.FAILED_WITH_RETRY,
  },
  {
    status: DELIVERY_TIMELINE_FAILED_EVENTS.DELIVERY_RETURNED_TO_SENDER,
  },
  {
    status: DELIVERY_TIMELINE_FAILED_EVENTS.DELIVERY_DELAYED,
  },
  {
    status: DELIVERY_TIMELINE_FAILED_EVENTS.ORDER_CANCELLED,
  },
  {
    status: DELIVERY_TIMELINE_FAILED_EVENTS.DELIVERY_OK,
    subStatus: NotificationSubEvent.WITH_CLAIM,
  },
]

export const DELIVERY_TIMELINE_FAILED_EVENTS_FILTERED = [
  {
    status: DELIVERY_TIMELINE_FAILED_EVENTS.DELIVERY_PICK_UP_KO,
    subStatus: NotificationSubEvent.FAILED_WITH_RETRY,
  },
  {
    status: DELIVERY_TIMELINE_FAILED_EVENTS.DELIVERY_RETURNED_TO_SENDER,
  },
  {
    status: DELIVERY_TIMELINE_FAILED_EVENTS.DELIVERY_DELAYED,
  },
  {
    status: DELIVERY_TIMELINE_FAILED_EVENTS.ORDER_CANCELLED,
  },
  {
    status: DELIVERY_TIMELINE_FAILED_EVENTS.DELIVERY_OK,
    subStatus: NotificationSubEvent.WITH_CLAIM,
  },
]

export const DeliveryEventCustom = [
  {
    status: DeliveryEvent.ORDER_CREATED,
  },
  {
    status: DeliveryEvent.DELIVERY_INIT,
  },
  {
    status: DeliveryEvent.DELIVERY_TEAM_ASSIGNED,
  },
  {
    status: DeliveryEvent.DELIVERY_PICK_UP_OK,
  },
  {
    status: DeliveryEvent.DELIVERY_IN_PROGRESS,
  },
  {
    status: DeliveryEvent.DELIVERY_AT_DROP_OFF_LOCATION,
  },
  {
    status: DeliveryEvent.DELIVERY_REPLANNED,
  },
  {
    status: DeliveryEvent.DELIVERY_AVAILABLE,
  },
  {
    status: DeliveryEvent.DELIVERY_OK,
  },
  ...DELIVERY_TIMELINE_FAILED_EVENTS_CUSTOM,
]

export type NotificationEvent = CollectEvent | DeliveryEvent | NOTIFICATIONS_TARGET
