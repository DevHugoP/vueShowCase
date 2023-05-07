import { ADDRESS_TYPE } from '@/constants'
import orchService from '@/helpers/orch'
import AddressService from '@/services/address/AddressService'
import OrderEligibilityService from '@/services/orderEligibility/OrderEligibilityService'
import { Action } from '@/store/types'
import { CHECKOUT_BLOCKS, Coordinates } from '@/types'
import { OrchService } from '@meltingpoint/lastmile-orch'
import { debounce } from 'debounce'
import { CreateOrderArrivalType } from './arrival/types'
import {
  ELIGIBILITY_ERROR_MESSAGE,
  ELIGILIBILITY_FILTERED,
  SET_MISCELLANEOUS_ERROR_MESSAGES,
} from './mutations-types'
import { CreateOrderState } from './types'

// if calculateAllError = false stop at the first erreur else get all eligibility errors
const filterEligibleCarriers: Action<CreateOrderState> | any = debounce(
  async (
    { commit, state, getters }: any,
    payload: { calculateAllError: boolean } = {
      calculateAllError: false,
    },
  ) => {
    // reset previous error
    const errorMessages = []
    commit(ELIGIBILITY_ERROR_MESSAGE, '')

    if (!state.eligibility.unfilteredCarriers.length) {
      commit(ELIGILIBILITY_FILTERED, [])
      commit(ELIGIBILITY_ERROR_MESSAGE, 'technical.incidents.carrier.servicesAndProductType')

      if (payload.calculateAllError) {
        errorMessages.push('technical.incidents.carrier.servicesAndProductType')
      } else {
        return
      }
    }

    // if no  checkout return
    if (!state.miscellaneous.checkout) {
      return
    }

    // get data needed for eligibility
    const {
      packages,
      delivery,
      delivery: { address: deliveryLocation, interval: deliveryInterval },
      picking: { address: pickingLocation, interval: pickingInterval },
      services,
      retailerId,
      storeId,
    } = getters.orderFormattedData

    const exchangePlaceId =
      pickingLocation.type === ADDRESS_TYPE.EXCHANGE_PLACE && pickingLocation.exchangePlaceId
    const countryCode = deliveryLocation.country

    // set data needed for eligibility
    const packagesParams = orchService.getPackagesDetailedValues(packages)
    let filteredCarriers = JSON.parse(JSON.stringify(state.eligibility.unfilteredCarriers))
    let distance = null
    const filters = []

    // get all block from previous and current step

    const blocks = []

    for (
      let stepNumber = Object.keys(state.miscellaneous.checkout.steps).length;
      stepNumber > 0;
      stepNumber--
    ) {
      blocks.push(...state.miscellaneous.checkout.steps[`step${stepNumber}`])
    }

    const arrivalValidations = getters['arrival/$v']

    for (const blockName of blocks) {
      switch (blockName) {
        case CHECKOUT_BLOCKS.SENDER_IDENTITY: {
          const senderIdentityValidations = getters['senderIdentity/$v']
          if (
            getters['arrival/arrival'].arrivalType === CreateOrderArrivalType.HOME &&
            !senderIdentityValidations.$invalid
          ) {
            filters.push({
              method: 'filterByInitialized',
              params: [],
              errorKey: 'technical.incidents.carrier.carrierSubscriptions',
            })
          }
          break
        }
        case CHECKOUT_BLOCKS.ARRIVAL: {
          if (
            getters['arrival/arrival'].arrivalType === CreateOrderArrivalType.HOME &&
            !arrivalValidations.$invalid
          ) {
            filters.push({
              method: 'filterByCountry',
              params: [delivery],
              errorKey: 'technical.incidents.carrier.noCarrierInDepartement',
            })
          }
          break
        }
        case CHECKOUT_BLOCKS.ORDER_CONTENT: {
          const orderContentValidations = getters['orderContent/$v']
          if (!orderContentValidations.$invalid) {
            filters.push({
              method: 'filterByMinKilogram',
              params: [packagesParams.totalWeight],
              errorKey: 'technical.incidents.carrier.minPackagesWeight',
            })

            filters.push({
              method: 'filterByMaxKilogram',
              params: [packagesParams.totalWeight],
              errorKey: 'technical.incidents.carrier.packagesWeight',
            })
            filters.push({
              method: 'filterByPackageWeight',
              params: [packagesParams.weight.min, 'min'],
              errorKey: 'technical.incidents.carrier.packageMinWeight',
            })
            filters.push({
              method: 'filterByPackageWeight',
              params: [packagesParams.weight.max, 'max'],
              errorKey: 'technical.incidents.carrier.packageMaxWeight',
            })
            filters.push({
              method: 'filterByCombinedLength',
              params: [packagesParams.combinedLength.min, 'min'],
              errorKey: 'technical.incidents.carrier.minCombinedLength',
            })
            filters.push({
              method: 'filterByCombinedLength',
              params: [packagesParams.combinedLength.max, 'max'],
              errorKey: 'technical.incidents.carrier.maxCombinedLength',
            })
            filters.push({
              method: 'filterByLength',
              params: [packagesParams.length.min, 'min'],
              errorKey: 'technical.incidents.carrier.minLength',
            })
            filters.push({
              method: 'filterByLength',
              params: [packagesParams.length.max, 'max'],
              errorKey: 'technical.incidents.carrier.maxLength',
            })
            filters.push({
              method: 'filterByTypology',
              params: [packages],
              errorKey: 'technical.incidents.carrier.servicesAndProductType',
            })
            filters.push({
              method: 'filterByPackageQuantity',
              params: [packagesParams.totalQuantity, 'max'],
              errorKey: 'technical.incidents.carrier.maxPackageQuantity',
            })
          }
          break
        }
        case CHECKOUT_BLOCKS.SERVICES: {
          const servicesValidations = getters['service/$v']
          if (!servicesValidations.$invalid) {
            filters.push({
              method: 'filterByService',
              params: [services],
              errorKey: 'technical.incidents.carrier.servicesAndProductType',
            })
          }
          break
        }
        case CHECKOUT_BLOCKS.DELIVERY_DATE: {
          const shippingDateValidations = getters['shippingDate/$v']
          const deliveryDateValidations = getters['deliveryDate/$v']
          if (
            !shippingDateValidations.$invalid &&
            !deliveryDateValidations.$invalid &&
            deliveryInterval.length
          ) {
            filters.push({
              method: 'filterByStorage',
              params: [pickingInterval, deliveryInterval],
              errorKey: 'technical.incidents.carrier.noStorage',
            })

            filters.push({
              method: 'filterByDeliveryNoticePeriod',
              params: [pickingInterval],
              errorKey: 'technical.incidents.carrier.deliveryNoticePeriod',
            })
            filters.push({
              method: 'filterByMinDeliveryTime',
              params: [pickingInterval, deliveryInterval],
              errorKey: 'technical.incidents.carrier.minDeliveryTime',
            })
            if (!delivery.interval?.[0]?.bookingId) {
              filters.push({
                method: 'filterByCutOffs',
                params: [delivery.interval],
                errorKey: 'technical.incidents.carrier.cutOffs',
              })
            }
          }

          break
        }
      }
    }

    const departureValidations = getters['departure/$v']
    if (
      blocks.includes(CHECKOUT_BLOCKS.ARRIVAL) &&
      !arrivalValidations.$invalid &&
      blocks.includes(CHECKOUT_BLOCKS.DEPARTURE) &&
      !departureValidations.$invalid &&
      getters['arrival/arrival'].arrivalType === CreateOrderArrivalType.HOME
    ) {
      let pickingCoordinates: Coordinates | null =
        state.eligibility.cache['pickingLocation']?.result || null
      let deliveryCoordinates: Coordinates | null =
        state.eligibility.cache['deliveryLocation']?.result || null

      if (!state.eligibility.cache?.['pickingLocation']) {
        state.eligibility.cache['pickingLocation'] = {}
      }
      if (
        !state.eligibility.cache['pickingLocation']?.result ||
        state.eligibility.cache['pickingLocation']?.params !==
          JSON.stringify({ address: pickingLocation })
      ) {
        state.eligibility.cache['pickingLocation'].params = JSON.stringify({
          address: pickingLocation,
        })
        pickingCoordinates = await AddressService.getCoordinates({ address: pickingLocation })
        state.eligibility.cache['pickingLocation'].result = pickingCoordinates
      }

      if (!state.eligibility.cache?.['deliveryLocation']) {
        state.eligibility.cache['deliveryLocation'] = {}
      }
      if (
        !state.eligibility.cache['deliveryLocation']?.result ||
        state.eligibility.cache['deliveryLocation']?.params !==
          JSON.stringify({ address: deliveryLocation })
      ) {
        state.eligibility.cache['deliveryLocation'].params = JSON.stringify({
          address: deliveryLocation,
        })
        deliveryCoordinates = await AddressService.getCoordinates({ address: deliveryLocation })
        state.eligibility.cache['deliveryLocation'].result = deliveryCoordinates
      }

      distance = orchService.calculateDistanceBetweenCoordinates(
        pickingCoordinates!,
        deliveryCoordinates!,
      )

      filters.push({
        method: 'filterByDistance',
        params: [
          { ...pickingLocation, coordinates: pickingCoordinates },
          { ...deliveryLocation, coordinates: deliveryCoordinates },
          distance,
          'max',
        ],
        errorKey: 'technical.incidents.carrier.distanceMax',
      })

      filters.push({
        method: 'filterByDistance',
        params: [
          { ...pickingLocation, coordinates: pickingCoordinates },
          { ...deliveryLocation, coordinates: deliveryCoordinates },
          distance,
          'min',
        ],
        errorKey: 'technical.incidents.carrier.distanceMin',
      })

      filters.push({
        method: 'filterByZone',
        params: [
          async (eligibilities: any) =>
            checkZoning(
              eligibilities,
              storeId,
              retailerId,
              exchangePlaceId,
              deliveryCoordinates,
              countryCode,
              state.eligibility.cache,
            ),
        ],
        errorKey: 'technical.incidents.carrier.noCarrierZoning',
      })
    }

    const saveFilteredCarriers = filteredCarriers

    // launch every eligibility methods
    for (const { method, params, errorKey } of filters) {
      try {
        if (payload.calculateAllError) {
          filteredCarriers = await orchService[`${method}` as keyof OrchService](
            saveFilteredCarriers,
            //   @ts-ignore
            ...params,
          )
        } else {
          filteredCarriers = await orchService[`${method}` as keyof OrchService](
            filteredCarriers,
            //   @ts-ignore
            ...params,
          )
        }

        if (!filteredCarriers.length) {
          commit(ELIGILIBILITY_FILTERED, [])
          commit(ELIGIBILITY_ERROR_MESSAGE, errorKey)

          if (payload.calculateAllError) {
            errorMessages.push(errorKey)
          } else {
            return
          }
        }
      } catch (err) {
        commit(ELIGILIBILITY_FILTERED, [])
        commit(ELIGIBILITY_ERROR_MESSAGE, errorKey)
        if (payload.calculateAllError) {
          errorMessages.push(errorKey)
        } else {
          return
        }
      }
    }

    if (payload.calculateAllError) {
      commit(SET_MISCELLANEOUS_ERROR_MESSAGES, errorMessages)
    } else {
      commit(ELIGILIBILITY_FILTERED, filteredCarriers)
    }
  },
  300,
)

const checkZoning = async (
  eligibilities: any,
  storeId: number | string,
  retailerId: number | string,
  exchangePlaceId: number | string,
  deliveryCoordinates: any,
  countryCode: string,
  cache: Record<string, any>,
) => {
  const params = {
    storeId,
    retailerId,
    ...(exchangePlaceId && { exchangePlaceId }),
    ...deliveryCoordinates,
    carrierIds: eligibilities.map(({ carrierId }: { carrierId: number }) => carrierId),
    countryCode,
  }
  if (!cache['checkZoning']) {
    cache['checkZoning'] = {}
  }
  if (!cache['checkZoning']?.result || cache['checkZoning']?.params !== JSON.stringify(params)) {
    cache['checkZoning'].params = JSON.stringify(params)
    cache['checkZoning'].result = OrderEligibilityService.checkZoning(params)
  }

  return cache['checkZoning'].result
}

export default { filterEligibleCarriers }
