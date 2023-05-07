enum DELIVERY_STATUS {
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
}

enum SUB_STATUS {
  FAILED = 'FAILED',
  FAILED_WITH_RETRY = 'FAILED_WITH_RETRY',
  FAILED_WITH_RETURN = 'FAILED_WITH_RETURN',
  WITH_CLAIM = 'WITH_CLAIM',
  REFUSED = 'REFUSED',
  NOT_COLLECTED = 'NOT_COLLECTED',
}

export type StatusMappingEntity = {
  externalStatus: string
  description?: string
  status: string | DELIVERY_STATUS
  subStatus?: string | SUB_STATUS
  carrierId: number
  createdAt?: string
  updatedAt?: string
  active: boolean
}