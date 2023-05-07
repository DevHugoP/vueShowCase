import {
  translationKeyMapping,
  ValidationRulesNames,
} from '@/mixins/validationMixin/validationMixin'
import RepositoryFactory from '@/services/RepositoryFactory'
import store from '@/store/index'
import {
  SET_MISCELLANEOUS_TOTAL_ERRORS,
  SET_MISCELLANEOUS_TOTAL_ERRORS_LEFT,
} from '@/store/modules/createOrder/mutations-types'
import {
  Address,
  Checkout,
  CHECKOUT_BLOCKS,
  defaultFilledSteps,
  PackageEntity,
  Valuation,
} from '@/types'
import { ICreateOrderRepository } from './createOrderRepository'

const blockNameBackToblockNameFront = {
  SENDER_IDENTITY: 'senderIdentity',
  SHIPPING_CONTACT: 'shippingContact',
  SHIPPING_DATE: 'shippingDate',
  DEPARTURE: 'departure',
  DELIVERY_CONTACT: 'deliveryContact',
  DELIVERY_DATE: 'deliveryDate',
  ARRIVAL: 'arrival',
  CUSTOMER_CODE: 'customerCode',
  ORDER_CONTENT: 'orderContent',
  SERVICES: 'service',
  CARRIERS: 'carriers',
  PICKUP_POINT: 'pickupPoint',
  STATE: 'state',
}

export class CreateOrderService {
  private createOrderRepository: ICreateOrderRepository

  constructor() {
    this.createOrderRepository = RepositoryFactory.get('createOrder')
  }

  public async getDistance(payload: { placeOne: Address; placeTwo: Address }): Promise<any> {
    const { distance } = await this.createOrderRepository.getDistance(payload)
    return distance
  }

  public async getValuations(payload: {
    retailerId: number
    storeId: number
    carrierIds: number[]
    packages: PackageEntity[]
    services: string[]
  }): Promise<Valuation[]> {
    const { valuations } = await this.createOrderRepository.getValuations(payload)

    return valuations
  }

  public getVuelidateError(checkout: Checkout, init = false): Record<string, any> {
    let steps = defaultFilledSteps()

    if (checkout.published) {
      steps = checkout.steps
    }

    const stepsErrors = {
      step1: [],
      step2: [],
      step3: [],
      step4: [],
      step5: [],
    } as any

    for (const step in steps) {
      if ((steps as any)[step]) {
        for (const block of (steps as any)[step]) {
          const blockName = (blockNameBackToblockNameFront as any)[block]
          const validations = store.getters[`createOrder/${blockName}/$v`]

          if (validations && Object.keys(validations).length) {
            let deepErrors = this.getDeepErrors(validations, blockName)

            if (
              block === CHECKOUT_BLOCKS.SHIPPING_DATE ||
              block === CHECKOUT_BLOCKS.DELIVERY_DATE
            ) {
              const type = block === CHECKOUT_BLOCKS.SHIPPING_DATE ? 'shippingDate' : 'deliveryDate'

              deepErrors = deepErrors.map(dateError => {
                if (dateError.key.includes('interval')) {
                  const startOrEnd = dateError.key.split('.').pop()

                  return {
                    error: `page.order.keys.${type}.interval.${startOrEnd}`,
                    key: `page.order.keys.${type}.interval.${startOrEnd}Detail`,
                  }
                }

                return dateError
              })
            }

            stepsErrors[step] = [...stepsErrors[step], ...deepErrors]

            if (block === CHECKOUT_BLOCKS.SERVICES || block === CHECKOUT_BLOCKS.DELIVERY_DATE) {
              let secondValidations = this.getDeepErrors(
                store.getters[`createOrder/orderValidator`],
                blockName,
              )

              if (block === CHECKOUT_BLOCKS.DELIVERY_DATE) {
                secondValidations = secondValidations.map(dateError => {
                  if (dateError.key.includes('interval')) {
                    const startOrEnd = dateError.key.split('.').pop()

                    return {
                      error: `page.order.keys.deliveryDate.interval.${startOrEnd}`,
                      key: `page.order.keys.deliveryDate.interval.${startOrEnd}Detail`,
                    }
                  }

                  return dateError
                })
              }
              stepsErrors[step] = [...stepsErrors[step], ...secondValidations]
            }
          }
        }
      }
    }

    store.commit(
      `createOrder/${init ? SET_MISCELLANEOUS_TOTAL_ERRORS : SET_MISCELLANEOUS_TOTAL_ERRORS_LEFT}`,
      stepsErrors.step1.length +
        stepsErrors.step2.length +
        stepsErrors.step3.length +
        stepsErrors.step4.length +
        stepsErrors.step5.length,
    )

    return stepsErrors
  }

  private getDeepErrors(
    outerObj: any,
    outerKey: string,
    linkOuterKey = '',
  ): Array<{ key: string; error: string }> {
    const obj = outerObj[outerKey]

    return Object.keys(obj).reduce((acc: Array<{ key: string; error: string }>, key) => {
      if (key.charAt(0) === '$' && key !== '$each') {
        return acc
      }

      if (typeof obj[key] === 'object') {
        return acc.concat(
          this.getDeepErrors(obj, key, `${linkOuterKey}${linkOuterKey ? '.' : ''}${outerKey}`),
        )
      }

      if (!obj[key]) {
        acc.push({
          key: linkOuterKey ? `page.order.keys.${linkOuterKey}.${outerKey}` : outerKey,
          error: translationKeyMapping[key as ValidationRulesNames],
        })
      }

      return acc
    }, [])
  }
}

export default new CreateOrderService()
