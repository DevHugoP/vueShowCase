import { AVAILABLE_LEVEL_SERVICES } from '@/constants/shared'
import { validationMixin } from '@/mixins'
import { requiredIf, requiredUnless } from 'vuelidate/lib/validators'
import {
  CreateOrderState,
  CreateOrderStateEligibility,
  CreateOrderStateMiscellaneous,
  defaultCreateOrderNewStateOrder,
  defaultCreateOrderStateEligibility,
  defaultCreateOrderStateMiscellaneous,
  displayRadioType,
  displayType,
} from './types'

import { CreateOrderStateOrderContent } from './orderContent/types'

import Vue from 'vue'
import actions from './actions'
import getters from './getters'
import mutations from './mutations'

import minDateHelper from '@/helpers/minDateHelper'
import { Address, Contact, OrderEntity } from '@/types'
import { defaultSenderIdentity } from './senderIdentity'
import { defaultPackage } from './orderContent'
import { defaultService } from './service'
import { defaultShippingDate } from './shippingDate'
import { defaultDeliveryDate } from './deliveryDate'
import { defaultCustomerCode } from './customerCode'
import { defaultCarriers } from './carriers'
import { defaultAddress as arrivalDefaultAddress } from './arrival'
import { defaultContact as deliveryDefaultContact } from './deliveryContact'
import { defaultAddress as departureDefaultAddress } from './departure'
import { defaultContact as shippingDefaultContact } from './shippingContact'
import { dateHelperGetTimezonedDate } from '@/helpers/dateHelper'
import { defaultState } from './state'
import { CreateOrderStateSenderIdentity } from './senderIdentity/types'
import { CreateOrderStateCustomerCode } from './customerCode/types'
import { CreateOrderStateState } from './state/types'
import { CreateOrderStateDeparture } from './departure/types'
import { CreateOrderStateShippingContact } from './shippingContact/types'
import { CreateOrderStateShippingDate } from './shippingDate/types'
import { CreateOrderStateArrival } from './arrival/types'
import { CreateOrderStateDeliveryContact } from './deliveryContact/types'
import { CreateOrderStateDeliveryDate } from './deliveryDate/types'
import { CreateOrderStateService } from './service/types'
import { CreateOrderStateCarriers } from './carriers/types'

export const orderInitialState: CreateOrderState = {
  order: { ...defaultCreateOrderNewStateOrder() },
  miscellaneous: { ...defaultCreateOrderStateMiscellaneous() },
  eligibility: { ...defaultCreateOrderStateEligibility() },
}

export default function(store: any): any {
  const validator: any = new Vue({
    mixins: [validationMixin],
    computed: {
      order() {
        return store.getters['createOrder/order']
      },
      orderContent() {
        return store.getters['createOrder/orderContent/orderContent']
      },
      eligibility() {
        return store.getters['createOrder/eligibility']
      },
      miscellaneous() {
        return store.getters['createOrder/miscellaneous']
      },
      senderIdentity(): CreateOrderStateSenderIdentity {
        return store.getters['createOrder/senderIdentity/senderIdentity']
      },
      customerCode(): CreateOrderStateCustomerCode {
        return store.getters['createOrder/customerCode/customerCode']
      },
      state(): CreateOrderStateState {
        return store.getters['createOrder/state/stateValue']
      },
      departure(): CreateOrderStateDeparture {
        return store.getters['createOrder/departure/departure']
      },
      shippingContact(): CreateOrderStateShippingContact {
        return store.getters['createOrder/shippingContact/shippingContact']
      },
      shippingDate(): CreateOrderStateShippingDate {
        return store.getters['createOrder/shippingDate/shippingDate']
      },
      arrival(): CreateOrderStateArrival {
        return store.getters['createOrder/arrival/arrival']
      },
      deliveryContact(): CreateOrderStateDeliveryContact {
        return store.getters['createOrder/deliveryContact/deliveryContact']
      },
      deliveryDate(): CreateOrderStateDeliveryDate {
        return store.getters['createOrder/deliveryDate/deliveryDate']
      },
      service(): CreateOrderStateService {
        return store.getters['createOrder/service/service']
      },
      carriers(): CreateOrderStateCarriers {
        return store.getters['createOrder/carriers/carriers']
      },
      pickupPoint() {
        return store.getters['createOrder/pickupPoint/pickupPoint']
      },
      serviceValidations() {
        return store.getters['createOrder/service/$v']
      },
      deliveryDateValidations() {
        return store.getters['createOrder/deliveryDate/$v']
      },
    },
    validations: {
      service: {
        services: {
          isAnAvailableService() {
            let availableServices = new Set(Object.values(AVAILABLE_LEVEL_SERVICES))
            if (validator.eligibility.filteredCarriers.length) {
              availableServices = validator.eligibility.filteredCarriers.reduce(
                (acc: Set<string>, { services }: { services: string[] }) => {
                  for (const service of services) {
                    acc.add(service)
                  }
                  return acc
                },
                new Set(),
              )
            }

            if (!validator.service.services || !validator.service.services.length) {
              return false
            }

            return validator.service.services.every((localService: string) =>
              availableServices.has(localService),
            )
          },
        },
      },
      deliveryDate: {
        interval: {
          required: requiredUnless(() => {
            return validator.service.services.includes(AVAILABLE_LEVEL_SERVICES.PICKUP_POINT)
          }),
          $each: {
            start: {
              dateIsSameOrBefore: () => {
                return minDateHelper(validator.shippingDate.interval[0].start)(
                  dateHelperGetTimezonedDate(validator.deliveryDate.interval[0].start),
                )
              },
            },
            bookingId: {
              required: requiredIf(
                () =>
                  validator.miscellaneous.deliveryDateTypeToDisplay === displayType.SLOT ||
                  (validator.miscellaneous.deliveryDateTypeToDisplay === displayType.MIXED &&
                    validator.miscellaneous.deliveryTypeRadioType === displayRadioType.CUSTOM),
              ),
            },
          },
        },
      },
      pickupPoint: {
        pickupPoint: {
          required: requiredIf(() =>
            validator.service.services.includes(AVAILABLE_LEVEL_SERVICES.PICKUP_POINT),
          ),
        },
      },
    },
  })

  return {
    state: orderInitialState,
    getters: {
      ...getters,
      $v() {
        return Object.assign({}, validator.$v)
      },
      isServiceInvalid(): boolean {
        return validator.serviceValidations.$invalid || validator.$v.service.$invalid
      },
      isDeliveryDateInvalid(): boolean {
        return validator.deliveryDateValidations.$invalid || validator.$v.deliveryDate.$invalid
      },
      isPickupPointInvalid(): boolean {
        return validator.$v.pickupPoint.$invalid
      },
      orderValidator() {
        return Object.assign({}, validator.$v)
      },
      isTicketContentInvalid(): boolean {
        const nbOfProducts = (validator.orderContent as CreateOrderStateOrderContent).packages.reduce(
          (acc, localPackage) => {
            const productsQuantity = localPackage.products!.reduce((accProducts, localProduct) => {
              accProducts += localProduct.quantity

              return accProducts
            }, 0)
            acc += localPackage.quantity * productsQuantity

            return acc
          },
          0,
        )

        const nbOfPackages = (validator.miscellaneous as CreateOrderStateMiscellaneous).availablesPackageSize.reduce(
          (acc, localPackage) => {
            acc += localPackage.quantity!
            return acc
          },
          0,
        )

        return !(nbOfPackages && nbOfProducts && nbOfProducts >= nbOfPackages)
      },
    },
    actions: {
      ...actions,
      $touch() {
        validator.$v.$touch()
      },
      $reset() {
        validator.$v.$reset()
      },
      async setOrder(state: any, order: OrderEntity | null): Promise<any> {
        state.state.order.id = order ? order.id : null
        state.state.order.tags = order?.tags?.length ? order.tags : []

        return Promise.all([
          store.dispatch(
            'createOrder/senderIdentity/setSenderIdentity',
            order
              ? {
                  retailerId: order.retailerId,
                  storeId: order.storeId,
                }
              : defaultSenderIdentity(),
          ),
          store.dispatch(
            'createOrder/departure/setDeparture',
            order ? order.picking.address : departureDefaultAddress(),
          ),
          store.dispatch(
            'createOrder/arrival/setArrival',
            order ? order.delivery.address : arrivalDefaultAddress(),
          ),
          store.dispatch('createOrder/orderContent/setOrderContent', {
            packages: order ? order.packages : [defaultPackage()],
          }),
          store.dispatch('createOrder/service/setService', {
            services: order ? order.services : defaultService().services,
          }),
          store.dispatch('createOrder/shippingDate/setShippingDate', {
            interval: order ? order.picking.interval : defaultShippingDate().interval,
          }),
          store.dispatch('createOrder/deliveryDate/setDeliveryDate', {
            interval: order ? order.delivery.interval : defaultDeliveryDate().interval,
          }),
          store.dispatch('createOrder/customerCode/setCustomerCode', {
            externalOrderId: order ? order.externalOrderId : defaultCustomerCode().externalOrderId,
            referenceNumber: order ? order.referenceNumber : defaultCustomerCode().referenceNumber,
          }),
          store.dispatch('createOrder/state/setState', {
            state: order ? order.state : defaultState().state,
          }),
          store.dispatch('createOrder/carriers/setCarriers', {
            carrierSelection: order ? order.carrierSelection : defaultCarriers().carrierSelection,
          }),
          store.dispatch('createOrder/shippingContact/setShippingContact', {
            contact: order ? order.picking.contact : shippingDefaultContact(),
          }),
          store.dispatch('createOrder/deliveryContact/setDeliveryContact', {
            contact: order ? order.delivery.contact : deliveryDefaultContact(),
          }),
          store.dispatch('createOrder/pickupPoint/setPickupPoint', {
            pickupPoint: order?.pickupPoint || null,
          }),

          store.dispatch('createOrder/scan/setScan', {
            ticket: order?.referenceNumber || null,
          }),
        ])
      },
      async resetValidation(): Promise<any> {
        JSON.parse(JSON.stringify(validator.$v))
        validator.$v.$reset()

        return Promise.all([
          store.dispatch('createOrder/arrival/$reset'),
          store.dispatch('createOrder/customerCode/$reset'),
          store.dispatch('createOrder/state/$reset'),
          store.dispatch('createOrder/deliveryContact/$reset'),
          store.dispatch('createOrder/deliveryDate/$reset'),
          store.dispatch('createOrder/departure/$reset'),
          store.dispatch('createOrder/orderContent/$reset'),
          store.dispatch('createOrder/scan/$reset'),
          store.dispatch('createOrder/senderIdentity/$reset'),
          store.dispatch('createOrder/service/$reset'),
          store.dispatch('createOrder/shippingContact/$reset'),
          store.dispatch('createOrder/shippingDate/$reset'),
        ])
      },
      setEligibility(state: any, eligibility: CreateOrderStateEligibility | null): void {
        state.state.eligibility = eligibility ? eligibility : defaultCreateOrderStateEligibility()
      },
      setMiscellaneous(state: any, miscellaneous: CreateOrderStateMiscellaneous | null): void {
        let localMiscellaneous = miscellaneous
        if (!miscellaneous) {
          localMiscellaneous = defaultCreateOrderStateMiscellaneous()
        }
        state.state.miscellaneous = {
          ...localMiscellaneous,
          retailers: localMiscellaneous!.retailers ? localMiscellaneous!.retailers : [],
        }
      },
      isContactEmpty(state: any, contact: Contact): boolean {
        if (!contact) {
          return true
        }
        return !(
          Boolean(contact.firstName) ||
          Boolean(contact.lastName) ||
          Boolean(contact.email) ||
          Boolean(contact.phone) ||
          Boolean(contact.language) ||
          Boolean(contact.timezone)
        )
      },
      hasAddressChanged(state: any, type: string): boolean {
        const nowAddress: Address = type === 'departure' ? validator.departure : validator.arrival
        const oldAddress: Address = validator.miscellaneous.saveAddress[type]
          ? validator.miscellaneous.saveAddress[type].address
          : undefined

        if (!oldAddress) {
          return false
        }

        if (
          nowAddress.exchangePlaceId &&
          nowAddress.exchangePlaceId !== -1 &&
          oldAddress.exchangePlaceId &&
          oldAddress.exchangePlaceId !== -1 &&
          nowAddress.exchangePlaceId !== oldAddress.exchangePlaceId
        ) {
          return true
        }

        return !(
          nowAddress.addressLine1 === oldAddress.addressLine1 &&
          nowAddress.country === oldAddress.country &&
          nowAddress.postalCode === oldAddress.postalCode &&
          nowAddress.city === oldAddress.city
        )
      },
      isChangingContactSame(state: any, type: string): boolean {
        const oldContact: Contact =
          type === 'picking' ? validator.shippingContact.contact : validator.deliveryContact.contact
        const newContact: Contact =
          validator.miscellaneous.saveAddress[type === 'picking' ? 'departure' : 'arrival']
            .newContact

        if (!oldContact || !newContact) {
          return false
        }

        return (
          oldContact.firstName === newContact.firstName &&
          oldContact.lastName === newContact.lastName &&
          oldContact.email === newContact.email &&
          oldContact.phone === newContact.phone &&
          oldContact.language === newContact.language &&
          oldContact.timezone === newContact.timezone
        )
      },
    },
    mutations,
  }
}
