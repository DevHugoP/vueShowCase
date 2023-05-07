import { DateInterval } from '@/types'

interface Team {
  members: Array<{ id: number | string }>
}

export interface Appointment {
  old: DateInterval
  new: DateInterval
}

export interface DeliveryStatusEntity {
  id: number | null
  date: string
  status: string
  comment: string | null
  deliveryId: number | null
  createdAt: string
  updatedAt: string
  team: Team | null
  appointment?: Appointment
  additionalData?: Array<Record<string, any>>
}
