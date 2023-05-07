import {
  ClientPageCategory,
  ClientPageType,
  CollectClientPageType,
  DeliveryClientPageType,
} from '@/constants'
import { i18n } from '@/plugins/i18n'

export const getDefaultQuestion = (): Question => {
  return {
    title: i18n.t('page.editClientPage.questions.question.title', { number: 1 }),
    type: '',
    question: '',
    toggle: undefined,
    required: true,
  }
}

export const getDefaultInstruction = (): Instruction => {
  return {
    title: '',
    rank: 1,
  }
}

export type Question = {
  title: string
  type: string
  toggle?: boolean
  question: string
  required: boolean
}

export type CustomContent = {
  toggle: boolean
  body?: string
}

export type Instruction = {
  title: string
  rank: number
}

export type ClientPageConfigHeader = {
  showLogo: boolean
  showOrderId: boolean
  showOrderCreationDate: boolean
  showDeliveryDate?: boolean
  showCarrierName?: boolean
  showPickingDate?: boolean
}

export type ClientPageConfigCarrierInfos = {
  showCarrierLogo: boolean
  followDelivery: boolean
  showClaimUrl: boolean
  phone: {
    type: string
    number?: string
  }
  phoneLanguage?: string
  email: {
    type: string
    value?: string
  }
}

export type ClientPageConfigBody = {
  title: string
  informations: string
  showInterval: boolean
  showDriveName: boolean
  instructions: Instruction[]
}

export type ClientPageConfigFooter = {
  phone: {
    type: string
    number?: string
  }
  phoneLanguage?: string
  customerServiceUrl?: string
  legalNotice?: string
  criticalScore?: number
}

export type ClientPageConfig = {
  title: string
  default: boolean
  header: ClientPageConfigHeader
  body: ClientPageConfigBody | Record<string, never>
  footer: ClientPageConfigFooter
  carrierInfos?: ClientPageConfigCarrierInfos
  content?: Question[]
  customContent?: CustomContent
}

export type ClientPage = {
  id: string
  retailerId: number | null
  type: CollectClientPageType | DeliveryClientPageType | string
  category: ClientPageCategory | string
  isActive: boolean
  language: string
  config: ClientPageConfig
  createdAt: string
  updatedAt: string | null
}

export type ClientPageCreate = Omit<ClientPage, 'id' | 'createdAt' | 'updatedAt'> & {
  id?: string
}

export type ClientPageUpdate = Partial<ClientPage>

export const defaultHeader = (): ClientPageConfigHeader => ({
  showCarrierName: true,
  showDeliveryDate: true,
  showLogo: true,
  showOrderCreationDate: false,
  showOrderId: false,
})

export const defaultCarrierInfos = (): ClientPageConfigCarrierInfos => ({
  showCarrierLogo: false,
  followDelivery: false,
  showClaimUrl: false,
  phone: {
    type: '',
    number: '',
  },
  phoneLanguage: 'FR',
  email: {
    type: '',
    value: '',
  },
})

export const defaultMultiTrackingHeader = (): ClientPageConfigHeader => ({
  showLogo: false,
  showOrderCreationDate: false,
  showOrderId: false,
  showPickingDate: false,
})

export const defaultFooter = (): ClientPageConfigFooter => ({
  phone: {
    type: '',
    number: '',
  },
  phoneLanguage: 'FR',
  customerServiceUrl: '',
  legalNotice: '',
  criticalScore: undefined,
})

export const defaultBody = (): ClientPageConfigBody => ({
  title: '',
  informations: '',
  showInterval: false,
  showDriveName: false,
  instructions: [],
})

export const defaultCustomContent = (): CustomContent => ({
  toggle: false,
  body: '',
})

// According to Client Page type, set fields and default values
export const ClientPageConfigMapping = {
  header: {
    [ClientPageType.DELIVERY.CONFIRMATION]: {
      showDeliveryDate: false,
      showLogo: true,
      showOrderCreationDate: true,
      showOrderId: true,
    },
    [ClientPageType.COLLECT.DRIVE_CONFIRMATION]: {
      showLogo: true,
      showOrderCreationDate: true,
      showOrderId: true,
    },
    [ClientPageType.DELIVERY.TRACKING]: defaultHeader(),
    [ClientPageType.DELIVERY.SURVEY]: defaultHeader(),
    [ClientPageType.COLLECT.DRIVE_SURVEY]: {
      showLogo: true,
      showOrderCreationDate: true,
      showOrderId: true,
    },
    [ClientPageType.DELIVERY.MULTI_TRACKING]: defaultMultiTrackingHeader(),
    [ClientPageType.COLLECT.DRIVE_TRACKING]: {
      showLogo: false,
      showOrderCreationDate: false,
      showOrderId: false,
    },
    [ClientPageType.COLLECT.DRIVE_SLOT]: {
      showLogo: false,
      showOrderId: false,
      showOrderCreationDate: false,
    },
    [ClientPageType.COLLECT.DRIVE_SLOT_SUCCESS]: {
      showLogo: false,
      showOrderId: false,
      showOrderCreationDate: false,
    },
    [ClientPageType.COLLECT.REPORT_PRESENCE_AT_DRIVE]: {
      showLogo: false,
      showOrderId: false,
      showOrderCreationDate: false,
    },
    [ClientPageType.COLLECT.REPORT_PRESENCE_AT_DRIVE_SUCCESS]: {
      showLogo: false,
      showOrderId: false,
      showOrderCreationDate: false,
    },
  },
  body: {
    [ClientPageType.DELIVERY.CONFIRMATION]: {},
    [ClientPageType.DELIVERY.TRACKING]: {},
    [ClientPageType.DELIVERY.SURVEY]: {},
    [ClientPageType.COLLECT.DRIVE_SURVEY]: {},
    [ClientPageType.COLLECT.DRIVE_CONFIRMATION]: {},
    [ClientPageType.DELIVERY.MULTI_TRACKING]: {},
    [ClientPageType.COLLECT.DRIVE_TRACKING]: {},
    [ClientPageType.COLLECT.DRIVE_SLOT]: {},
    [ClientPageType.COLLECT.DRIVE_SLOT_SUCCESS]: {
      title: '',
      informations: '',
      showInterval: false,
      instructions: [],
    },
    [ClientPageType.COLLECT.REPORT_PRESENCE_AT_DRIVE]: {
      informations: '',
    },
    [ClientPageType.COLLECT.REPORT_PRESENCE_AT_DRIVE_SUCCESS]: {
      title: '',
      informations: '',
      showInterval: false,
      showDriveName: false,
    },
  },
  footer: {
    [ClientPageType.DELIVERY.CONFIRMATION]: {
      phone: {
        type: 'EMPTY',
        number: '',
      },
      phoneLanguage: 'FR',
      customerServiceUrl: '',
      legalNotice: '',
    },
    [ClientPageType.COLLECT.DRIVE_CONFIRMATION]: {
      phone: {
        type: 'EMPTY',
        number: '',
      },
      phoneLanguage: 'FR',
      customerServiceUrl: '',
      legalNotice: '',
    },
    [ClientPageType.DELIVERY.TRACKING]: {
      phone: {
        type: '',
        number: '',
      },
      phoneLanguage: 'FR',
      customerServiceUrl: '',
      legalNotice: '',
    },
    [ClientPageType.COLLECT.DRIVE_SURVEY]: defaultFooter(),
    [ClientPageType.DELIVERY.SURVEY]: defaultFooter(),
    [ClientPageType.DELIVERY.MULTI_TRACKING]: {
      phone: {
        type: '',
        number: '',
      },
      phoneLanguage: 'FR',
      customerServiceUrl: '',
      legalNotice: '',
    },
    [ClientPageType.COLLECT.DRIVE_TRACKING]: {
      phone: {
        type: '',
        number: '',
      },
      phoneLanguage: 'FR',
      customerServiceUrl: '',
      legalNotice: '',
    },
    [ClientPageType.COLLECT.DRIVE_SLOT]: {
      phone: {
        type: '',
        number: '',
      },
      phoneLanguage: 'FR',
      customerServiceUrl: '',
      legalNotice: '',
    },
    [ClientPageType.COLLECT.DRIVE_SLOT_SUCCESS]: {
      phone: {
        type: '',
        number: '',
      },
      phoneLanguage: 'FR',
      customerServiceUrl: '',
      legalNotice: '',
    },
    [ClientPageType.COLLECT.REPORT_PRESENCE_AT_DRIVE]: {
      phone: {
        type: '',
        number: '',
      },
      phoneLanguage: 'FR',
      customerServiceUrl: '',
      legalNotice: '',
    },
    [ClientPageType.COLLECT.REPORT_PRESENCE_AT_DRIVE_SUCCESS]: {
      phone: {
        type: '',
        number: '',
      },
      phoneLanguage: 'FR',
      customerServiceUrl: '',
      legalNotice: '',
    },
  },
  carrierInfos: {
    [ClientPageType.DELIVERY.TRACKING]: {
      showCarrierLogo: false,
      followDelivery: false,
      phone: {
        type: 'EMPTY',
        number: '',
      },
      phoneLanguage: 'FR',
      email: {
        type: 'EMPTY',
        value: '',
      },
    },
    [ClientPageType.DELIVERY.CONFIRMATION]: {},
    [ClientPageType.DELIVERY.SURVEY]: {},
    [ClientPageType.DELIVERY.MULTI_TRACKING]: {
      showCarrierLogo: false,
      followDelivery: false,
      phone: {
        type: 'EMPTY',
        number: '',
      },
      phoneLanguage: 'FR',
      email: {
        type: 'EMPTY',
        value: '',
      },
    },
    [ClientPageType.COLLECT.DRIVE_TRACKING]: {},
    [ClientPageType.COLLECT.DRIVE_SURVEY]: {},
    [ClientPageType.COLLECT.DRIVE_SLOT]: {},
    [ClientPageType.COLLECT.DRIVE_SLOT_SUCCESS]: {},
    [ClientPageType.COLLECT.REPORT_PRESENCE_AT_DRIVE]: {},
    [ClientPageType.COLLECT.REPORT_PRESENCE_AT_DRIVE_SUCCESS]: {},
  },
}
