import Config from '@/config/Config'
import { DELIVERY_STATUS_DETAIL } from '@/constants'
import { dateHelper, dateHelperGetTimezonedDate } from '@/helpers/dateHelper'
import { i18n } from '@/plugins/i18n'
import { IOrderRepository, MergePayload } from '@/services/order/OrderRepository'
import RepositoryFactory from '@/services/RepositoryFactory'
import store from '@/store'
import {
  Address,
  Checkout,
  Contact,
  DateInterval,
  defaultCheckoutFilled,
  Filters,
  OrderDocument,
  OrderEntity,
  OrderHistory,
  OrderHistoryLight,
  OrderLightEntity,
} from '@/types'
import { DateHelper } from '@meltingpoint/lastmile-internationalization'
import AuthorizationService from '../authorization/AuthorizationService'
import StoreService from '../store/StoreService'

export class OrderService {
  private orderRepository: IOrderRepository

  constructor() {
    this.orderRepository = RepositoryFactory.get('order')
  }

  public async getOrderList(
    orderParams: Record<string, any> = {},
    retailers?: Filters[],
    carriers?: Filters[],
  ): Promise<OrderEntity[]> {
    let params = { ...orderParams }
    const { pickDate, createdAt, deliveryStatus } = orderParams

    if (pickDate) {
      params.pickDateOperator = 'between'
    }

    if (createdAt) {
      params.createdDateOperator = 'between'
    }

    if (deliveryStatus?.length) {
      const { statuses, subStatus } = deliveryStatus.reduce(
        (acc: Record<string, any>, statusIndex: number) => {
          const statusDetail = DELIVERY_STATUS_DETAIL[statusIndex]
          if (statusDetail?.status) {
            acc.statuses.push(statusDetail.status)
          }

          if (statusDetail?.subStatus) {
            acc.subStatus.push(statusDetail.subStatus)
          }

          return acc
        },
        {
          statuses: [],
          subStatus: [],
        },
      )

      params = {
        ...params,
        deliveryStatus: statuses,
        ...(subStatus?.length && { deliverySubStatus: subStatus }),
      }
    }

    const orders = await this.getOrders(params)

    if (!orders.length || !retailers || !carriers) {
      return orders
    }

    const storeIds = [...new Set(orders.map(({ storeId }) => storeId))]
    const stores = await StoreService.getFilters({ forRule: 'LIST_ORDERS', id: storeIds })

    return orders.map(order => {
      const retailerName = retailers.find(retailer => retailer.id === order.retailerId)?.name
      const carrierName = carriers.find(carrier => carrier.id === order.carrierId)?.name
      const storeName = stores.find(localStore => localStore.id === order.storeId)?.name

      return { ...order, retailerName, carrierName, storeName }
    })
  }

  public async getOrders(params: Record<string, any>): Promise<OrderEntity[]> {
    const { orders } = await this.orderRepository.getAll({
      ...params,
      ...(params.createdAt && { createdDateOperator: 'between' }),
    })
    return orders
  }

  public async get(id: number, params: Record<string, any> = {}): Promise<OrderEntity> {
    const { order } = await this.orderRepository.get(id, params)

    return order
  }

  public async create(order: Record<string, any>): Promise<OrderEntity> {
    const { order: newOrder } = await this.orderRepository.create(order)

    return newOrder
  }

  public async confirm(id: number): Promise<void> {
    return this.orderRepository.confirm(id)
  }

  public async getSlip(id: number): Promise<string> {
    const { data } = await this.orderRepository.getSlip(id)

    return data
  }

  public async getLabel(id: number): Promise<string> {
    const { data } = await this.orderRepository.getLabel(id)
    return data
  }

  public async update(id: number | string, payload: Record<string, any>): Promise<OrderEntity> {
    const { order } = await this.orderRepository.update(id, payload)

    return order
  }

  public async merge(payload: MergePayload): Promise<OrderEntity> {
    const { order } = await this.orderRepository.merge(payload)

    return order
  }

  public async getLabels(orders: OrderLightEntity[]): Promise<any> {
    const ids = orders.map(order => order.orderId)

    const { data } = await this.orderRepository.getLabels({ ids })
    return data
  }

  public async cancel(id: number | string): Promise<any> {
    await this.orderRepository.delete(id)
  }

  public async validate(id: number | string): Promise<void> {
    await this.orderRepository.validate(id)
  }

  public async createQuote(id: number | string, quote: Record<string, any>): Promise<void> {
    await this.orderRepository.createQuote(id, quote)
  }

  public formatItinerary(
    order: OrderEntity,
  ): {
    date: string
    address: Address
    hour: string
    contact: Contact
    showText: boolean
    interval: DateInterval[]
    type: string
    infos?: string | null
  }[] {
    const formatedItinerary = [
      {
        ...order.picking,
        address: order.picking.address || {},
        type: 'picking',
        date: '',
        hour: '',
        showText: false,
      },
      {
        ...order.delivery,
        address: order.delivery.address || {},
        type: 'delivery',
        date: '',
        hour: '',
        showText: false,
      },
    ]

    formatedItinerary.forEach(element => {
      element.interval.forEach((elem: DateInterval) => {
        if (elem.start && elem.end) {
          const start = dateHelperGetTimezonedDate(elem.start)
          const end = dateHelperGetTimezonedDate(elem.end)

          element.date = dateHelper.formatToTimezone(start, 'UTC', 'P')
          element.hour = `${dateHelper.formatToTimezone(
            start,
            'UTC',
            'p',
          )} - ${dateHelper.formatToTimezone(end, 'UTC', 'p')}`
        }
      })
    })

    return formatedItinerary
  }

  public async retry(id: number | string): Promise<void> {
    await this.orderRepository.retry(id)
  }

  public async getHistory(id: number | string): Promise<OrderHistoryLight[]> {
    const { histories } = await this.orderRepository.getHistory(id)
    return histories
  }

  public async getHistoryDetail(
    id: number | string,
    historyId: number | string,
  ): Promise<OrderHistory> {
    const { history } = await this.orderRepository.getHistoryDetail(id, historyId)
    return history
  }

  public getStackDriverUrl(history: OrderHistory): string {
    const helper = new DateHelper()
    const date = dateHelperGetTimezonedDate(history.createdAt, 'UTC')
    const timeRange = `timeRange=${helper
      .substract(date, { minutes: 5 })
      .toISOString()}%2F${helper.add(date, { minutes: 5 }).toISOString()}`

    return `https://console.cloud.google.com/logs/query;query=resource.type%3D"k8s_container"%0Aresource.labels.namespace_name%3D"${Config.get(
      'VUE_APP_NAMESPACE',
    )}"%0AjsonPayload.requestId%3D"${history.requestId}";${timeRange}?project=${Config.get(
      'VUE_APP_GCP_PROJECT_ID',
    )}&folder=true&organizationId=true`
  }

  public async getDocuments(id: number): Promise<OrderDocument[]> {
    const { documents } = await this.orderRepository.getDocuments(id)
    return documents
  }

  public async downloadDocument(orderId: number, documentId: string): Promise<ArrayBuffer> {
    const { data } = await this.orderRepository.downloadDocument(orderId, documentId)
    return data
  }

  public async callClient(orderId: number, isReturn: boolean): Promise<void> {
    const order = await this.get(orderId, {
      personalData: true,
    })

    window.location.href = `tel://${order[isReturn ? 'picking' : 'delivery'].contact.phone}`
  }

  public async goToMaps(orderId: number, isReturn: boolean): Promise<void> {
    const order = await this.get(orderId, {
      personalData: true,
    })

    const type = isReturn ? 'picking' : 'delivery'
    const reverseType = type === 'picking' ? 'delivery' : 'picking'
    const {
      picking: {
        address: {
          addressLine1: pickingAddress1,
          addressLine2: pickingAddress2,
          postalCode: pickingPostalCode,
          city: pickingCity,
        },
      },
    } = order

    const {
      delivery: {
        address: {
          addressLine1: deliveryAddress1,
          addressLine2: deliveryAddress2,
          postalCode: deliveryPostalCode,
          city: deliveryCity,
        },
      },
    } = order

    const pickingAddress = order[reverseType].address.formated
      ? order[reverseType].address.formated
      : `${pickingAddress1} ${pickingAddress2 || ''} ${pickingPostalCode} ${pickingCity}`

    const deliveryAddress = order[type].address.formated
      ? order[type].address.formated
      : `${deliveryAddress1} ${deliveryAddress2 || ''} ${deliveryPostalCode} ${deliveryCity}`

    const a = document.createElement('a')
    a.target = '_blank'

    if (
      navigator.platform.indexOf('iPhone') !== -1 ||
      navigator.platform.indexOf('iPad') !== -1 ||
      navigator.platform.indexOf('iPod') !== -1
    ) {
      a.href = encodeURI(
        `comgooglemapsurl://www.google.com/maps/dir/?api=1&origin=${pickingAddress}&destination=${deliveryAddress}&travelmode=driving&dir_action=navigate`,
      )
    } else {
      a.href = encodeURI(
        `https://www.google.com/maps/dir/?api=1&origin=${pickingAddress}&destination=${deliveryAddress}&travelmode=driving&dir_action=navigate`,
      )
    }

    a.dispatchEvent(new Event('click'))
    a.click()
  }

  public getCheckouts(
    retailerCheckouts: Checkout[],
    storeCheckouts: Checkout[],
  ): { checkout: Checkout | null; availableCheckouts: Checkout[] } {
    const { permissions } = store.getters['auth/currentUser']
    const contextFlatten = AuthorizationService.getContext(permissions)
    let checkout: Checkout | null = null
    let availableCheckouts: Checkout[] = []

    const defaultCheckout = { ...defaultCheckoutFilled(), name: i18n.t('common.default') }

    if (!contextFlatten) {
      checkout = null
    }

    if (
      !AuthorizationService.isAllowed('LIST_CUSTOM_CHECKOUT', permissions) ||
      (!retailerCheckouts.length && !storeCheckouts.length)
    ) {
      checkout = defaultCheckout
    } else if (retailerCheckouts.length && storeCheckouts.length) {
      if (contextFlatten.storeIds.length === 1) {
        if (storeCheckouts.length === 1) {
          checkout = storeCheckouts[0]
        } else {
          availableCheckouts = storeCheckouts
        }
      } else if (contextFlatten.retailerIds.length === 1 && retailerCheckouts.length === 1) {
        checkout = retailerCheckouts[0]
        availableCheckouts = [...retailerCheckouts, ...storeCheckouts]
      } else {
        availableCheckouts = [...retailerCheckouts, ...storeCheckouts]
      }
    } else if (retailerCheckouts.length) {
      if (contextFlatten.storeIds.length === 1) {
        checkout = retailerCheckouts.length === 1 ? retailerCheckouts[0] : defaultCheckout
      } else {
        if (retailerCheckouts.length === 1) {
          checkout = retailerCheckouts[0]
        } else {
          availableCheckouts = retailerCheckouts
        }
      }
    } else if (storeCheckouts.length) {
      if (contextFlatten.storeIds.length === 1) {
        switch (storeCheckouts.length) {
          case 0:
            checkout = defaultCheckout
            break
          case 1:
            checkout = storeCheckouts[0]
            break
          default:
            availableCheckouts = storeCheckouts
            break
        }
      } else {
        checkout = defaultCheckout
        availableCheckouts = storeCheckouts
      }
    }

    if (AuthorizationService.isAllowed('SHOW_DEFAULT_CHECKOUT', permissions)) {
      if (checkout?.id) {
        availableCheckouts = [defaultCheckout, checkout, ...availableCheckouts]
        checkout = null
      } else {
        availableCheckouts = [defaultCheckout, ...availableCheckouts]
      }
    }

    return { checkout, availableCheckouts }
  }
}

export default new OrderService()
