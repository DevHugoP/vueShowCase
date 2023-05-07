export type ChannelType = 'SMS' | 'MAIL'

export interface NotificationActivationsFilter {
  retailerId?: number[]
  retailerName?: string
  active?: boolean
  channel?: ChannelType
}

export interface NotificationActivationRange {
  start: string
  end: string
  activation: boolean
  timezone: string
}

export interface NotificationActivationEntity {
  id: string
  retailerId: number
  channel: ChannelType
  active: boolean
  range?: NotificationActivationRange | null
}

export interface NotificationAdministrationConfig {
  name: string
  logo: string | null
  id: number
  notificationActivations: Record<ChannelType, NotificationActivationEntity>
  showActionsMobile?: boolean
}
