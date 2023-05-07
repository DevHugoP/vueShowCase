<template>
  <div
    id="create-order-wrapper-new"
    ref="create-order-wrapper-new"
    @scroll.passive="handleScroll($event)"
  >
    <div ref="create-order-wrapper" data-id="order-create">
      <v-row
        no-gutters
        ref="content-scroll-wrapper"
        class="content-scroll-wrapper"
        :style="{
          'margin-bottom': `${getMargin}`,
          'min-height': getScreenSize,
          'max-height': getScreenSize,
        }"
      >
        <!-- Header -->
        <v-col cols="12" class="header-wrapper" v-if="$vuetify.breakpoint.mdAndUp">
          <v-row no-gutters>
            <transition name="fade">
              <v-col cols="10" offset="1" v-show="showHeaderTop">
                <mp-breadcrumb />

                <h1>
                  {{
                    isEditing
                      ? $t('page.order.common.editOrder')
                      : $t('page.order.common.createOrder')
                  }}
                </h1>
              </v-col>
            </transition>

            <v-col cols="10" offset="1" class="mt-5">
              <v-row no-gutters class="d-flex align-center justify-space-between">
                <v-col cols="6">
                  <create-order-stepper
                    :stepNumber="stepNumber"
                    :isEditing="isEditing"
                    :checkout="checkout"
                    @goToStep="goToStep($event)"
                  />
                </v-col>
                <v-col cols="6" class="d-flex">
                  <mp-button
                    class="ml-auto"
                    dataId="create-order-nextStep"
                    :text="
                      stepNumber === (!checkout ? 5 : Object.keys(checkout.steps).length)
                        ? $t('page.order.common.finish')
                        : $t('page.order.common.nextStep')
                    "
                    @click="goToNextStep()"
                    :disabled="isStepIsDisabled"
                  />
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-col>

        <!-- Stepper mobile -->
        <v-col cols="10" offset="1" v-if="$vuetify.breakpoint.xsOnly">
          <create-order-stepper
            class="mt-5"
            :stepNumber="stepNumber"
            :isEditing="isEditing"
            :checkout="checkout"
            @goToStep="goToStep($event)"
          />
        </v-col>

        <!-- Content -->
        <v-col
          cols="12"
          :class="`block-wrapper${$refs['preview-block'] && !showNextStepBtn ? ' mb-preview' : ''}`"
        >
          <v-row no-gutters>
            <!-- left -->
            <v-col cols="10" md="6" offset="1" class="left-blocks">
              <div
                v-if="stepNumber === 1"
                v-show="
                  (miscellaneous.retailers && miscellaneous.retailers.length !== 1) ||
                    (miscellaneous.stores && miscellaneous.stores.length !== 1) ||
                    showCheckoutSelect
                "
              >
                <sender-identity
                  :isEditing="isEditing"
                  :availableCheckouts="availableCheckouts"
                  :showCheckoutSelect="showCheckoutSelect"
                  @checkout="handleSelectCheckout($event)"
                />
              </div>

              <div v-if="checkout">
                <div v-for="(step, stepIndex) in checkout.steps" :key="`steps-${stepIndex}`">
                  <div
                    v-for="(block, blockIndex) in step"
                    :key="`steps-${step}-blocks-${blockIndex}`"
                  >
                    <select-block
                      :class="blockHasMarginTop(blockIndex) ? 'mt-6' : ''"
                      v-if="
                        stepNumber === parseInt(stepIndex[4], 10) &&
                          block !== CHECKOUT_BLOCKS.SENDER_IDENTITY
                      "
                      :block="block"
                      :isEditing="isEditing"
                      :stepNumber="stepNumber"
                      @playEligibility="getEligibilities(true)"
                    />
                  </div>
                </div>
              </div>
            </v-col>

            <!-- right -->
            <v-col md="4">
              <create-order-summary :stepNumber="stepNumber" @goToStep="goToStep($event)" />
            </v-col>
          </v-row>
        </v-col>

        <!-- Next step btn -->
        <v-col
          cols="10"
          md="6"
          offset="1"
          :class="
            `mt-6 d-flex padding-half-gutter justify-end${
              $refs['preview-block'] && showNextStepBtn ? ' mb-preview' : ''
            }${$refs['error-block'] ? ' mb-errors-block' : ''}`
          "
          v-if="showNextStepBtn && $vuetify.breakpoint.smAndUp"
        >
          <mp-button
            dataId="create-order-nextStep"
            :text="
              stepNumber === (!checkout ? 5 : Object.keys(checkout.steps).length)
                ? $t('page.order.common.finish')
                : $t('page.order.common.nextStep')
            "
            @click="goToNextStep()"
            :disabled="isStepIsDisabled"
          />
        </v-col>

        <!-- Preview mode -->
        <v-col
          cols="10"
          class="block-sticky"
          ref="preview-block"
          v-if="isPreview && $vuetify.breakpoint.smAndUp"
        >
          <div>
            <div class="d-flex mb-2">
              <v-icon size="1.6rem" class="main-lighten-52">mdi-eye</v-icon>
              <h3 class="ml-3 main-lighten-28">{{ $t('page.customCheckout.preview.title') }}</h3>
            </div>
            <span class="regular14 ml-7 main-lighten-28">
              {{ $t('page.customCheckout.preview.info') }}
            </span>
          </div>
          <div class="d-flex align-center">
            <mp-button
              format="link"
              linkColor="black"
              @click="previewCancel()"
              data-id="order-create-preview-cancel"
              :text="$t('page.customCheckout.preview.cancel')"
            />

            <mp-button
              format="black"
              @click="previewModify()"
              data-id="order-create-preview-modify"
              :text="$t('action.modify.base')"
            />
          </div>
        </v-col>

        <!-- Error mode -->
        <v-col
          cols="10"
          class="block-sticky errors-wrapper"
          ref="error-block"
          v-if="miscellaneous.isErrorMode && $vuetify.breakpoint.smAndUp"
        >
          <div class="d-flex justify-space-between align-center">
            <div class="d-flex">
              <div class="chip-error-counter">
                <div class="d-flex align-center">
                  <span class="medium14">
                    {{
                      $t('page.order.errors.totalError', { count: miscellaneous.totalErrorsLeft })
                    }}
                  </span>

                  <span class="medium14 counteur ml-1">
                    {{ miscellaneous.totalErrorsLeft }}
                  </span>
                </div>
              </div>

              <div class="error-text-wrapper">
                <h4>{{ $t(errorMessage) }}</h4>
                <span class="regular14 main-lighten-52">{{ $t(errorKeyMessage) }}</span>
              </div>
            </div>

            <div>
              <mp-button
                dataId="test"
                :text="
                  $t(
                    `page.order.errors.${
                      miscellaneous.totalErrorsLeft === 1 || miscellaneous.totalErrorsLeft === 0
                        ? 'finish'
                        : 'nextError'
                    }`,
                  )
                "
                :format="
                  miscellaneous.totalErrorsLeft === 1 || miscellaneous.totalErrorsLeft === 0
                    ? 'success'
                    : 'secondary'
                "
                @click="goToNextError()"
              />
            </div>
          </div>
        </v-col>

        <!-- Dialog leave -->
        <mp-dialog-confirmation
          v-if="showLeavePageDialog"
          dataId="create-order-dialog-leave-page"
          :textContent="$t('validation.confirmation.leavePage')"
          @close="
            to = null
            showLeavePageDialog = false
          "
          @submit="
            showLeavePageDialog = false
            $router.push(to)
          "
          color="error"
          :header="{
            icon: 'mdi-exclamation-thick',
            isColorBackground: false,
            iconClose: 'mdi-close',
          }"
          :btnCancel="{ text: $t('action.cancel.base'), format: 'link', linkColor: 'black' }"
          :btnValidation="{ text: $t('action.giveUp.order'), format: 'error' }"
          :btnToColumn="$vuetify.breakpoint.smAndDown"
        />

        <!-- Dialog contact -->
        <change-contact-dialog @submit="handleChangeContact()" v-if="showChangeContactDialog" />
      </v-row>

      <!-- Overlay validation order -->
      <v-overlay :value="showOverlay" absolute>
        <div class="d-flex flex-column justify-center align-center">
          <v-progress-circular indeterminate size="64" class="primary-color" />
          <h3 class="mt-3">
            {{ $t(`page.order.common.${order.id ? 'editLoader' : 'createLoader'}`) }}
          </h3>
        </div>
      </v-overlay>

      <!-- Overlay opening order -->
      <v-overlay :value="showOverlayOpening" absolute>
        <div class="d-flex flex-column justify-center align-center">
          <v-progress-circular indeterminate size="64" class="primary-color" />
          <h3 class="mt-3">
            {{ $t('page.order.common.openOrder') }}
          </h3>
        </div>
      </v-overlay>
    </div>

    <!-- btn mobile -->
    <mp-button
      v-if="$vuetify.breakpoint.xsOnly"
      class="btn-mobile-sticky"
      dataId="create-order-nextStep"
      format="sticky"
      stickyColor="yellow"
      :text="
        stepNumber === (!checkout ? 5 : Object.keys(checkout.steps).length)
          ? $t('page.order.common.finish')
          : $t('page.order.common.nextStep')
      "
      @click="goToNextStep()"
      :disabled="isStepIsDisabled"
    />
  </div>
</template>

<script lang="ts">
import { AVAILABLE_LEVEL_SERVICES } from '@/constants/shared'
import {
  CreateOrderNewStateOrder,
  CreateOrderStateEligibility,
  CreateOrderStateMiscellaneous,
} from '@/store/modules/createOrder/types'
import { ROUTES } from '@/constants'

import mixins from 'vue-typed-mixins'
import CheckoutsService from '@/services/checkouts/checkoutsService'
import AuthorizationService, { contextFlatten } from '@/services/authorization/AuthorizationService'

import createOrderStepper from '@/views/Order/Create/components/stepper.vue'
import mpBreadcrumb from '@/components/breadcrumb/breadcrumb.vue'
import selectBlock from '@/views/Order/Create/components/selectBlock.vue'
import senderIdentity from '@/views/Order/Create/senderIdentity/senderIdentity.vue'
import createOrderSummary from '@/views/Order/Create/components/summary.vue'
import changeContactDialog from '@/views/Order/Create/components/changeContactDialog/changeContactDialog.vue'

import OrderEligibilityService from '@/services/orderEligibility/OrderEligibilityService'
import { mapActions } from 'vuex'
import OrderService from '@/services/order/OrderService'
import { CHECKOUT_BLOCKS, Checkout, Filters } from '@/types'
import { wait } from '@/helpers/helper'
import { SnackBarType } from '@/store/types'
import RetailerService from '@/services/retailer/RetailerService'
import { Steps } from '@/views/customCheckout/customCheckout.vue'
import { SET_BREADCRUMBS_LABEL, SET_HEADER_TITLE } from '@/store/mutation-types'
import { Route } from 'vue-router'
import createOrderService from '@/services/createOrder/createOrderService'
import StoreService from '@/services/store/StoreService'
import { defaultContact as deliveryDefaultContact } from '@/store/modules/createOrder/deliveryContact'
import { defaultContact as shippingDefaultContact } from '@/store/modules/createOrder/shippingContact'
import {
  CreateOrderArrivalType,
  CreateOrderStateArrival,
} from '@/store/modules/createOrder/arrival/types'
import { debounce } from 'debounce'
import pickupPointsService from '@/services/pickupPoints/pickupPointsService'
import { arrivalMixin, authorizationMixin, departureMixin, senderIdentityMixin } from '@/mixins'
import { CreateOrderStateSenderIdentity } from '@/store/modules/createOrder/senderIdentity/types'
import { CreateOrderStatePickupPoint } from '@/store/modules/createOrder/pickupPoint/types'
import { CreateOrderStateDeparture } from '@/store/modules/createOrder/departure/types'
import { CreateOrderStateShippingContact } from '@/store/modules/createOrder/shippingContact/types'
import { CreateOrderStateDeliveryContact } from '@/store/modules/createOrder/deliveryContact/types'
import { CreateOrderStateService } from '@/store/modules/createOrder/service/types'
import { CreateOrderStateOrderContent } from '@/store/modules/createOrder/orderContent/types'
import { CreateOrderStateShippingDate } from '@/store/modules/createOrder/shippingDate/types'
import { CreateOrderStateDeliveryDate } from '@/store/modules/createOrder/deliveryDate/types'
import { CreateOrderStateCustomerCode } from '@/store/modules/createOrder/customerCode/types'
import { CreateOrderStateScan } from '@/store/modules/createOrder/scan/types'
import { CreateOrderStateCarriers } from '@/store/modules/createOrder/carriers/types'
import { CreateOrderStateState } from '@/store/modules/createOrder/state/types'

export const blockNameBackToblockNameFront = {
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
  SCAN: 'scan',
  TICKET_CONTENT: 'ticketContent',
  STATE: 'state',
}

export default mixins(senderIdentityMixin, departureMixin, arrivalMixin, authorizationMixin).extend(
  {
    name: 'order-create',
    components: {
      changeContactDialog,
      createOrderStepper,
      mpBreadcrumb,
      selectBlock,
      senderIdentity,
      createOrderSummary,
    },
    data: () => ({
      getErrorsHeight: 0,
      stepNumber: 0,
      showOverlay: false,
      AVAILABLE_LEVEL_SERVICES,
      checkout: null as Checkout | null,
      CHECKOUT_BLOCKS,
      ROUTES,
      to: null as Route | null,
      showLeavePageDialog: false,
      orderErrors: {
        step1: [],
        step2: [],
        step3: [],
        step4: [],
        step5: [],
        eligibility: [],
      } as {
        step1: any[]
        step2: any[]
        step3: any[]
        step4: any[]
        step5: any[]
        eligibility?: string[]
      },
      errorKeyMessage: '',
      errorMessage: '',
      showChangeContactDialog: false,
      contextFlatten: null as contextFlatten | null,
      retailerCheckouts: [] as Checkout[],
      storeCheckouts: [] as Checkout[],
      availableCheckouts: [] as Checkout[],
      showCheckoutSelect: false,
      showOverlayOpening: false,
      showHeaderTop: true,
    }),
    computed: {
      order(): CreateOrderNewStateOrder {
        return this.$store.getters['createOrder/order']
      },
      senderIdentity(): CreateOrderStateSenderIdentity {
        return this.$store.getters['createOrder/senderIdentity/senderIdentity']
      },
      arrival(): CreateOrderStateArrival {
        return this.$store.getters['createOrder/arrival/arrival']
      },
      pickupPoint(): CreateOrderStatePickupPoint {
        return this.$store.getters['createOrder/pickupPoint/pickupPoint']
      },
      departure(): CreateOrderStateDeparture {
        return this.$store.getters['createOrder/departure/departure']
      },
      shippingContact(): CreateOrderStateShippingContact {
        return this.$store.getters['createOrder/shippingContact/shippingContact']
      },
      deliveryContact(): CreateOrderStateDeliveryContact {
        return this.$store.getters['createOrder/deliveryContact/deliveryContact']
      },
      service(): CreateOrderStateService {
        return this.$store.getters['createOrder/service/service']
      },
      orderContent(): CreateOrderStateOrderContent {
        return this.$store.getters['createOrder/orderContent/orderContent']
      },
      shippingDate(): CreateOrderStateShippingDate {
        return this.$store.getters['createOrder/shippingDate/shippingDate']
      },
      deliveryDate(): CreateOrderStateDeliveryDate {
        return this.$store.getters['createOrder/deliveryDate/deliveryDate']
      },
      customerCode(): CreateOrderStateCustomerCode {
        return this.$store.getters['createOrder/customerCode/customerCode']
      },
      scan(): CreateOrderStateScan {
        return this.$store.getters['createOrder/scan/scan']
      },
      carriers(): CreateOrderStateCarriers {
        return this.$store.getters['createOrder/carriers/carriers']
      },
      state(): CreateOrderStateState {
        return this.$store.getters['createOrder/state/stateValue']
      },
      miscellaneous(): CreateOrderStateMiscellaneous {
        return this.$store.getters['createOrder/miscellaneous']
      },
      eligibility(): CreateOrderStateEligibility {
        return this.$store.getters['createOrder/eligibility']
      },
      isEditing(): boolean {
        return this.$route.name === ROUTES.editOrder
      },
      getMargin(): string {
        return this.$vuetify.breakpoint.smAndUp && Boolean(this.getErrorsHeight)
          ? `${this.getErrorsHeight + 20}px`
          : '0'
      },
      getScreenSize(): string {
        return this.$vuetify.breakpoint.xsOnly && Boolean(this.getErrorsHeight)
          ? `calc(100vh - 5.4rem - ${this.getErrorsHeight}px)`
          : 'undefined'
      },
      isStepIsDisabled(): boolean {
        if (!this.checkout) {
          return true
        }

        let invalidStep = false

        for (const block of this.checkout.steps[`step${this.stepNumber}` as keyof Steps]) {
          let invalidBlock = false
          switch (block) {
            case CHECKOUT_BLOCKS.ORDER_CONTENT:
              invalidBlock =
                this.$store.getters[
                  `createOrder/${
                    (blockNameBackToblockNameFront as any)[CHECKOUT_BLOCKS.ORDER_CONTENT]
                  }/$v`
                ].$invalid ||
                this.$store.getters[
                  `createOrder/${
                    (blockNameBackToblockNameFront as any)[CHECKOUT_BLOCKS.ORDER_CONTENT]
                  }/isPackagesInvalid`
                ]
              break
            case CHECKOUT_BLOCKS.SERVICES:
              invalidBlock = this.$store.getters[`createOrder/isServiceInvalid`]
              break
            case CHECKOUT_BLOCKS.DELIVERY_DATE:
              invalidBlock = this.$store.getters[`createOrder/isDeliveryDateInvalid`]
              break
            case CHECKOUT_BLOCKS.PICKUP_POINT:
              invalidBlock = this.$store.getters[`createOrder/isPickupPointInvalid`]
              break
            case CHECKOUT_BLOCKS.TICKET_CONTENT:
              invalidBlock = this.$store.getters[`createOrder/isTicketContentInvalid`]
              break
            default:
              invalidBlock = this.$store.getters[
                `createOrder/${(blockNameBackToblockNameFront as any)[block]}/$v`
              ].$invalid
          }

          if (invalidBlock) {
            invalidStep = true
          }
        }

        return invalidStep
      },
      isPreview(): boolean {
        return (
          this.$route.name === ROUTES.retailerCustomCheckoutPreview ||
          this.$route.name === ROUTES.storeCustomCheckoutPreview
        )
      },
      showNextStepBtn(): boolean {
        return (
          (this.isPreview &&
            this.stepNumber !== (!this.checkout ? 5 : Object.keys(this.checkout.steps).length)) ||
          !this.isPreview
        )
      },
    },
    async beforeMount() {
      this.showOverlayOpening = true
      setTimeout(() => {
        this.showOverlayOpening = false
      }, 2000)
      this.stepNumber = parseInt(this.$route.query.stepNumber as string, 10)

      const user = this.$store.getters['auth/currentUser']
      this.contextFlatten = AuthorizationService.getContext(user.permissions)

      try {
        if (this.isPreview) {
          const checkout = await CheckoutsService.get(parseInt(this.$route.params.checkoutId, 10))
          this.checkout = checkout
          this.miscellaneous.checkout = checkout

          const retailer = await RetailerService.getFilters({
            forRule: 'CREATE_ORDERS',
            id: parseInt(this.$route.params.id, 10),
          })
          let store: Filters[] | null = null

          if (this.$route.params.storeId) {
            store = await StoreService.getFilters({
              forRule: 'CREATE_ORDERS',
              id: parseInt(this.$route.params.storeId, 10),
            })
          }

          if (retailer) {
            this.senderIdentity.retailerId = retailer[0].id
            let breadcrumbLabel = {
              retailers: retailer[0].name,
            }

            if (store) {
              this.senderIdentity.storeId = store[0].id
              breadcrumbLabel = {
                ...breadcrumbLabel,
                stores: store[0].name,
              } as any
            }

            this.$store.commit(SET_BREADCRUMBS_LABEL, JSON.stringify(breadcrumbLabel))

            this.$store.commit(SET_HEADER_TITLE, store ? store[0].name : retailer[0].name)
          }
        } else if (this.miscellaneous.isErrorMode) {
          // Gestions d'erreurs
          this.checkout = this.miscellaneous.checkout

          this.orderErrors = createOrderService.getVuelidateError(this.checkout!, true)
          this.goToNextError()
        }

        if (
          this.isEditing &&
          this.arrival.type === 'pickupPoint' &&
          !this.pickupPoint.pickupPoint
        ) {
          this.pickupPoint.pickupPoint = await pickupPointsService.getPickupPointById({
            id: this.arrival.pickupPointId!,
            carrierCode: this.arrival.carrierCode!,
            retailerId: this.senderIdentity.retailerId!,
            forRule: 'CREATE_ORDERS',
          })

          this.arrival.arrivalType = CreateOrderArrivalType.PICKUP_POINT
        }
      } catch (e) {
        this.$store.dispatch('setSnackbar', {
          type: SnackBarType.ERROR,
          message: this.$t('messages.error'),
        })
      }

      if (this.isEditing) {
        if (
          this.checkout
            ? this.checkout.steps[`step${this.stepNumber}` as keyof Steps].includes(
                CHECKOUT_BLOCKS.SENDER_IDENTITY,
              )
            : this.stepNumber !== 1
        ) {
          await this.senderIdentityGetRetailers()
        }
        this.miscellaneous.saveAddress = JSON.parse(
          JSON.stringify({
            departure: {
              address: this.departure,
              contact: this.shippingContact.contact,
            },
            arrival: {
              address: this.arrival,
              contact: this.deliveryContact.contact,
            },
          }),
        )

        this.miscellaneous.hasDepartureContactAlreadyBeenSet = true
        this.miscellaneous.hasDeliveryContactAlreadyBeenSet = true

        await this.updateContact(false)

        if (this.miscellaneous.checkout) {
          await this.handleSelectCheckout(this.miscellaneous.checkout)
        }
      }
    },
    methods: {
      ...mapActions({
        filterEligibleCarriers: 'createOrder/filterEligibleCarriers',
      }),
      async getEligibilities(updateContact = false) {
        if (!this.senderIdentity.storeId) {
          return
        }

        const params = {
          retailerId: this.senderIdentity.retailerId,
          storeId: this.senderIdentity.storeId,
          exchangePlaceId:
            this.departure.exchangePlaceId && this.departure.exchangePlaceId > 0
              ? this.departure.exchangePlaceId
              : 'null',
          isActive: true,
        }

        if (JSON.stringify(params) === this.miscellaneous.eligibilitiesParams) {
          return
        }

        this.miscellaneous.eligibilitiesParams = JSON.stringify(params)

        const [{ orderEligibilities }] = await Promise.all([OrderEligibilityService.getAll(params)])

        // DO NOT REMOVE
        if (!this.senderIdentity.storeId) {
          return
        }

        this.eligibility.unfilteredCarriers = orderEligibilities

        this.filterEligibleCarriers({ stepNumber: this.stepNumber })

        if (updateContact) {
          await this.updateContact(false)
        }
      },
      async goToStep(stepNumber: number) {
        if (await this.updateMiscSave()) {
          return
        }

        if (this.isPreview) {
          if (this.$route.params.storeId) {
            this.$router.push({
              name: ROUTES.storeCustomCheckoutPreview,
              query: { stepNumber: stepNumber.toString() },
            })
          } else {
            this.$router.push({
              name: ROUTES.retailerCustomCheckoutPreview,
              query: { stepNumber: stepNumber.toString() },
            })
          }
        } else {
          this.$router.push({
            name: this.isEditing ? ROUTES.editOrder : ROUTES.createOrder,
            query: { stepNumber: stepNumber.toString() },
          })
        }

        this.$nextTick(() => {
          ;(this.$refs['create-order-wrapper-new'] as any)!.scrollTop = 0
        })
      },
      async updateMiscSave(): Promise<boolean> {
        if (
          (this.checkout?.steps[`step${this.stepNumber}` as keyof Steps].includes(
            CHECKOUT_BLOCKS.DEPARTURE,
          ) &&
            (await this.$store.dispatch('createOrder/hasAddressChanged', 'departure'))) ||
          (this.checkout?.steps[`step${this.stepNumber}` as keyof Steps].includes(
            CHECKOUT_BLOCKS.ARRIVAL,
          ) &&
            (await this.$store.dispatch('createOrder/hasAddressChanged', 'arrival')))
        ) {
          await this.updateContact()
          return true
        }

        return false
      },
      async goToNextStep(save = false) {
        if (
          !this.checkout
            ? this.stepNumber === 5
            : this.stepNumber === Object.keys(this.checkout.steps).length || save
        ) {
          if (!this.isEditing) {
            this.miscellaneous.checkShippingDateToNow = true
            await this.$nextTick(async () => {
              await this.$store.dispatch('createOrder/shippingDate/resetValue')
              this.miscellaneous.checkShippingDateToNow = false
            })
          }

          this.orderErrors = createOrderService.getVuelidateError(
            this.checkout ? this.checkout : ({ published: false } as any),
          )

          if (this.miscellaneous.totalErrorsLeft) {
            this.miscellaneous.isErrorMode = true
            this.goToNextError()
            return
          }

          this.showOverlay = true

          let id = 0

          let arrival = null

          if (this.service.services.includes(AVAILABLE_LEVEL_SERVICES.PICKUP_POINT)) {
            arrival = {
              ...this.pickupPoint.pickupPoint!.address,
              type: 'pickupPoint',
              carrierCode: this.pickupPoint.pickupPoint!.carrier.code,
              pickupPointId: this.pickupPoint.pickupPoint!.id,
            }
          } else {
            arrival = {
              ...this.arrival,
              exchangePlaceId:
                this.arrival.exchangePlaceId && this.arrival.exchangePlaceId > 0
                  ? this.arrival.exchangePlaceId
                  : undefined,
            }
          }

          const packages = this.orderContent.packages.map(localPackage => {
            return {
              ...localPackage,
              references: !localPackage.references?.length ? undefined : localPackage.references,
            }
          })

          const payload = {
            storeId: this.senderIdentity.storeId,
            picking: {
              address: {
                ...this.departure,
                exchangePlaceId:
                  this.departure.exchangePlaceId === -1
                    ? undefined
                    : this.departure.exchangePlaceId,
              },
              interval: [
                {
                  start: this.shippingDate.interval[0].start,
                  end: this.shippingDate.interval[0].end,
                },
              ],
              contact: {
                ...this.shippingContact.contact,
                email: this.shippingContact.contact.email.toLowerCase(),
              },
            },
            delivery: {
              address: arrival,
              interval: [
                {
                  start: this.deliveryDate.interval[0].start,
                  end: this.deliveryDate.interval[0].end,
                  bookingId: this.deliveryDate.interval[0].bookingId || undefined,
                },
              ],
              contact: {
                ...this.deliveryContact.contact,
                email: this.deliveryContact.contact.email.toLowerCase(),
              },
            },
            externalOrderId: this.customerCode.externalOrderId,
            referenceNumber:
              this.customerCode.referenceNumber ||
              this.scan.ticket ||
              this.customerCode.externalOrderId,
            retailerId: this.senderIdentity.retailerId,
            packages: packages.map(pack => {
              return {
                ...pack,
                attributes:
                  !pack.attributes?.footprint?.unit && !pack.attributes?.footprint?.value
                    ? undefined
                    : pack.attributes,
              }
            }),
            services: this.service.services,
            carrierSelection: !arrival.carrierCode ? this.carriers.carrierSelection : null,
            tags: this.order.tags?.length ? this.order.tags : [],
            state: this.state.state || null,
          }

          try {
            // update Order
            if (this.order.id) {
              await OrderService.update(this.order.id, payload)
              id = this.order.id
            } else {
              // create order
              const { id: orderId } = await OrderService.create(payload)
              id = orderId
            }

            // show loader when create or edit order
            await wait(4000)
            this.showOverlay = false

            this.$store.dispatch('setSnackbar', {
              type: SnackBarType.SUCCESS,
              message: this.$t(this.order.id ? 'messages.orderUpdated' : 'messages.orderCreated'),
            })
            this.$router.push({
              name: ROUTES.detailOrder,
              params: { id: id.toString() },
            })
            return
          } catch (e) {
            if (e.response?.status === 409) {
              this.$store.dispatch('setSnackbar', {
                type: SnackBarType.ERROR,
                message: this.$t('messages.orderAlreadyExists'),
              })
            } else if (e.response?.status === 403) {
              this.$store.dispatch('setSnackbar', {
                type: SnackBarType.ERROR,
                message: this.$t('messages.carrierError'),
              })
            } else {
              this.$store.dispatch('setSnackbar', {
                type: SnackBarType.ERROR,
                message: this.$t('messages.error'),
              })
            }

            this.showOverlay = false
          }

          return
        }

        if (await this.updateMiscSave()) {
          return
        }

        if (this.isPreview) {
          if (this.$route.params.storeId) {
            this.$router.push({
              name: ROUTES.storeCustomCheckoutPreview,
              query: { stepNumber: `${this.stepNumber + 1}` },
            })
          } else {
            this.$router.push({
              name: ROUTES.retailerCustomCheckoutPreview,
              query: { stepNumber: `${this.stepNumber + 1}` },
            })
          }
        } else {
          this.$router.push({
            name: this.isEditing ? ROUTES.editOrder : ROUTES.createOrder,
            query: { stepNumber: `${this.stepNumber + 1}` },
          })
        }

        this.$nextTick(() => {
          ;(this.$refs['create-order-wrapper-new'] as any)!.scrollTop = 0
        })
      },
      previewCancel(): void {
        if (this.$route.params.storeId) {
          this.$router.push({
            name: ROUTES.detailStore,
            params: { id: this.$route.params.id, storeId: this.$route.params.storeId },
          })
        } else {
          this.$router.push({ name: ROUTES.detailRetailer, params: { id: this.$route.params.id } })
        }
      },
      previewModify(): void {
        if (this.$route.params.storeId) {
          this.$router.push({
            name: ROUTES.storeEditCustomCheckout,
            params: { id: this.$route.params.id, storeId: this.$route.params.storeId },
          })
        } else {
          this.$router.push({
            name: ROUTES.retailerEditCustomCheckout,
            params: { id: this.$route.params.id },
          })
        }
      },
      async goToNextError() {
        if (await this.updateMiscSave()) {
          return
        }

        this.orderErrors = createOrderService.getVuelidateError(
          this.checkout ? this.checkout : ({ published: false } as any),
        )
        if (this.miscellaneous.totalErrorsLeft === 0) {
          this.goToNextStep(true)
        }

        this.$nextTick(() => {
          ;(this.$refs['create-order-wrapper-new'] as any)!.scrollTop = 0
        })
      },
      async updateContact(showDialog = true) {
        let shippingContact = null
        let deliveryContact = null

        if (this.eligibility.exchangePlace) {
          const mainContact = this.eligibility.exchangePlace?.contacts.find(c => c.main)
          shippingContact = mainContact ? mainContact : this.eligibility.exchangePlace?.contacts[0]
        } else {
          const store = await StoreService.get(this.senderIdentity.storeId!)
          const mainContact = store.contacts.find(c => c.main)
          shippingContact = mainContact ? mainContact : store.contacts[0]
        }

        if (this.miscellaneous.deliveryExchangePlace) {
          const mainContact = this.miscellaneous.deliveryExchangePlace?.contacts.find(c => c.main)
          deliveryContact = mainContact
            ? mainContact
            : this.miscellaneous.deliveryExchangePlace?.contacts[0]
        } else {
          const store = await StoreService.get(this.senderIdentity.storeId!)
          const mainContact = store.contacts.find(c => c.main)
          deliveryContact = mainContact ? mainContact : store.contacts[0]
        }

        shippingContact = shippingContact || shippingDefaultContact()
        deliveryContact = deliveryContact || deliveryDefaultContact()

        const shippingContactEmpty = await this.$store.dispatch(
          'createOrder/isContactEmpty',
          this.shippingContact.contact,
        )
        const deliveryContactEmpty = await this.$store.dispatch(
          'createOrder/isContactEmpty',
          this.deliveryContact.contact,
        )

        if (
          this.isEditing &&
          !this.miscellaneous.saveAddress.departure &&
          !this.miscellaneous.saveAddress.arrival
        ) {
          this.miscellaneous.saveAddress = JSON.parse(
            JSON.stringify({
              departure: {
                address: this.departure,
                contact: this.shippingContact.contact,
              },
              arrival: {
                address: this.arrival,
                contact: this.deliveryContact.contact,
              },
            }),
          )
        }

        if (
          this.departure.type === 'exchangePlace' ||
          (this.departure.type === 'address' && this.arrival.type === 'address') ||
          (this.departure.type === 'address' &&
            this.arrival.arrivalType === CreateOrderArrivalType.PICKUP_POINT)
        ) {
          if (
            !this.isEditing &&
            shippingContactEmpty &&
            deliveryContactEmpty &&
            !this.miscellaneous.hasDepartureContactAlreadyBeenSet
          ) {
            this.shippingContact.contact = JSON.parse(JSON.stringify(shippingContact))

            this.miscellaneous.saveAddress.departure!.contact = JSON.parse(
              JSON.stringify(this.shippingContact.contact),
            )
            this.miscellaneous.hasDepartureContactAlreadyBeenSet = true
          } else {
            this.miscellaneous.saveAddress.departure!.newContact = JSON.parse(
              JSON.stringify(shippingContact),
            )
          }
        } else {
          this.miscellaneous.saveAddress.departure!.newContact = undefined
        }

        if (this.arrival.type === 'exchangePlace') {
          if (
            !this.isEditing &&
            shippingContactEmpty &&
            deliveryContactEmpty &&
            !this.miscellaneous.hasDeliveryContactAlreadyBeenSet
          ) {
            this.deliveryContact.contact = JSON.parse(JSON.stringify(deliveryContact))

            this.miscellaneous.saveAddress.arrival!.contact = JSON.parse(
              JSON.stringify(this.deliveryContact.contact),
            )

            this.miscellaneous.hasDeliveryContactAlreadyBeenSet = true
          } else {
            this.miscellaneous.saveAddress.arrival!.newContact = JSON.parse(
              JSON.stringify(deliveryContact),
            )
          }
        } else {
          this.miscellaneous.saveAddress.arrival!.newContact = undefined
        }

        if (showDialog) {
          this.showChangeContactDialog = true
        }
      },
      handleChangeContact() {
        this.showChangeContactDialog = false

        this.$store.dispatch('setSnackbar', {
          type: SnackBarType.SUCCESS,
          message: this.$t('page.order.contact.dialog.registeredChoice'),
        })
      },
      blockHasMarginTop(blockIndex: number): boolean {
        if (
          blockIndex === 1 &&
          this.miscellaneous.retailers?.length === 1 &&
          this.miscellaneous.stores?.length === 1
        ) {
          return false
        }
        return blockIndex !== 0
      },
      getCheckout: debounce(async function(this: any) {
        if (this.isPreview) {
          return
        }
        this.checkout = null
        this.availableCheckouts = []
        this.showCheckoutSelect = false
        this.miscellaneous.checkout = null
        const { permissions } = this.$store.getters['auth/currentUser']

        if (AuthorizationService.isAllowed('LIST_CUSTOM_CHECKOUT', permissions)) {
          const retailerCheckouts = await CheckoutsService.getAll({
            retailerId: this.senderIdentity.retailerId,
          })
          this.retailerCheckouts = retailerCheckouts.filter(
            localCheckout => localCheckout.published,
          )

          const storeCheckouts = await CheckoutsService.getAll({
            retailerId: this.senderIdentity.retailerId,
            storeId: this.senderIdentity.storeId,
          })

          this.storeCheckouts = storeCheckouts.filter(localCheckout => localCheckout.published)
        }

        const { checkout, availableCheckouts } = OrderService.getCheckouts(
          this.retailerCheckouts,
          this.storeCheckouts,
        )

        if (!checkout && availableCheckouts?.length === 1 && !availableCheckouts[0].id) {
          this.checkout = availableCheckouts[0]
        }

        if (
          availableCheckouts?.length > 1 ||
          (availableCheckouts?.length === 1 && availableCheckouts[0].id)
        ) {
          this.availableCheckouts = availableCheckouts
          this.showCheckoutSelect = true
        }

        if (checkout && !this.checkout) {
          this.checkout = checkout

          if (
            availableCheckouts?.length > 1 ||
            (availableCheckouts?.length === 1 && availableCheckouts[0].id)
          ) {
            this.availableCheckouts = [this.checkout, ...this.availableCheckouts]
            this.showCheckoutSelect = true
          }
        }

        if (this.checkout) {
          this.miscellaneous.checkout = this.checkout
        }
      }, 250),
      async handleSelectCheckout(checkout: Checkout) {
        this.checkout = checkout

        this.miscellaneous.checkout = this.checkout
      },
      handleScroll(event: any): void {
        this.showHeaderTop = event.srcElement.scrollTop < 50
      },
    },
    beforeRouteLeave(to, from, next) {
      if (
        this.to ||
        to.name === ROUTES.detailOrder ||
        to.name === ROUTES.specificPartnerLogin ||
        this.isPreview ||
        (this.isStepIsDisabled && this.stepNumber === 1)
      ) {
        next()
      } else {
        this.to = to
        this.showLeavePageDialog = true
      }
    },
    async destroyed() {
      await Promise.all([
        this.$store.dispatch('createOrder/setOrder', null),
        this.$store.dispatch('createOrder/setEligibility', null),
        this.$store.dispatch('createOrder/setMiscellaneous', null),
      ])

      await this.$store.dispatch('createOrder/resetValidation')
    },
    watch: {
      orderErrors: {
        deep: true,
        immediate: true,
        handler() {
          const steps = {
            step1: 1,
            step2: 2,
            step3: 3,
            step4: 4,
            step5: 5,
          }
          for (const errorObject in this.orderErrors) {
            if ((this.orderErrors as any)[errorObject].length) {
              this.errorKeyMessage = (this.orderErrors as any)[errorObject][0].key
              this.errorMessage = (this.orderErrors as any)[errorObject][0].error
              if ((steps as any)[errorObject] !== this.stepNumber) {
                this.$router.push({
                  name: this.isEditing ? ROUTES.editOrder : ROUTES.createOrder,
                  query: { stepNumber: (steps as any)[errorObject] },
                })
              }
              return
            }
          }
        },
      },
      'eligibility.errorMessage'(next) {
        if (!next) {
          return
        }

        if (this.miscellaneous.lastEligibilityError !== next) {
          this.$store.dispatch('setSnackbar', {
            type: SnackBarType.ERROR,
            message: this.$t(next),
          })
        }

        this.miscellaneous.lastEligibilityError = next
      },
      'senderIdentity.retailerId': {
        immediate: true,
        handler: debounce(async function(this: any, next: number) {
          if (!next || this.isPreview) {
            return
          }

          this.checkout = null
          this.availableCheckouts = []
          this.showCheckoutSelect = false
          this.miscellaneous.checkout = null

          if (!this.miscellaneous.retailer || this.miscellaneous.retailer.id !== next) {
            this.miscellaneous.retailer = await RetailerService.get(next)
          }
        }, 250),
      },
      'senderIdentity.storeId': {
        immediate: true,
        handler: debounce(async function(this: any, next: number) {
          if (!next) {
            this.eligibility.unfilteredCarriers = []
            return
          }

          try {
            if (!this.isPreview) {
              this.checkout = null
              this.availableCheckouts = []
              this.showCheckoutSelect = false
              this.miscellaneous.checkout = null

              this.$nextTick(() => {
                this.getCheckout()
              })
            }
          } catch (e) {
            this.$store.dispatch('setSnackbar', {
              type: SnackBarType.ERROR,
              message: this.$t('messages.error'),
            })
          }

          await this.getEligibilities()
        }, 250),
      },
      'departure.exchangePlaceId': {
        immediate: true,
        async handler() {
          await this.getEligibilities()
        },
      },
      checkout: {
        async handler() {
          await this.getEligibilities()
        },
      },
      '$route.query.stepNumber'(next) {
        this.stepNumber = parseInt(next, 10)
      },
    },
  },
)
</script>

<style lang="scss">
#create-order-wrapper-new {
  @import '../../../styles/mixins/macScrollbar';
  @media #{map-get($display-breakpoints, 'sm-and-up')} {
    height: 100%;
    background-color: $main-lighten-80-color;
    min-height: calc(100vh - 8.5rem);
    max-height: calc(100vh - 8.5rem);
    overflow: auto;
    @include setMacScrollbar('&');
    padding-bottom: 2rem;
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s;
  }
  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }

  .header-wrapper {
    background-color: $white;
    padding-bottom: 3.1rem;
    position: fixed;
    z-index: 1;
  }

  .block-wrapper {
    margin-top: 19rem;

    .left-blocks {
      @media #{map-get($display-breakpoints, 'xs-only')} {
        padding-bottom: 2rem;
      }

      @media #{map-get($display-breakpoints, 'sm-and-up')} {
        padding-right: 4.15%;
      }
    }
    .block {
      @media #{map-get($display-breakpoints, 'sm-and-up')} {
        border: 0.1rem solid $main-lighten-65-color;
        border-radius: 0.4rem;
      }

      background-color: $white;

      .header {
        @media #{map-get($display-breakpoints, 'sm-and-up')} {
          padding: 3.5rem 4.1rem 2.1rem 3.5rem;
          border-bottom: 0.1rem solid $main-lighten-74-color;
        }

        .block-info {
          color: $main-lighten-52-color;
          @include italic-14(!important);
        }
      }

      .content {
        @media #{map-get($display-breakpoints, 'sm-and-up')} {
          padding: 2.1rem 4.1rem 3.5rem 3.5rem;
        }

        @media #{map-get($display-breakpoints, 'xs-only')} {
          padding-top: 3rem;
        }
      }
    }
  }

  .block-sticky {
    border: 0.2rem solid $main-color;
    background-color: $white;
    box-sizing: border-box;
    box-shadow: 0 0.4rem 1.2rem rgba(0, 0, 0, 0.18);
    border-radius: 1rem;
    padding: 2rem;
    position: fixed;
    bottom: 2rem;
    z-index: 5;
    margin-left: 4.15%;
    display: flex;
    justify-content: space-between;
  }

  .errors-wrapper {
    > div {
      width: 100%;
    }

    .chip-error-counter {
      background-color: $error-color;
      height: fit-content;
      padding: 0.4rem 0.8rem 0.5rem 0.7rem;
      border-radius: 5rem;
      color: $white;
      align-items: center;

      .counteur {
        color: $error-color;
        background-color: $white;
        border-radius: 50%;
        padding: 0.2rem 0.6rem 0.3rem 0.5rem;
      }
    }

    .error-text-wrapper {
      margin-left: 1rem;
    }
  }

  .mb-preview {
    margin-bottom: 10rem;
  }

  .mb-errors-block {
    margin-bottom: 15rem;
  }

  @media #{map-get($display-breakpoints, 'xs-only')} {
    .content-scroll-wrapper {
      min-height: calc(100vh - 5.4rem - 5rem);
      max-height: calc(100vh - 5.4rem - 5rem);
      overflow: auto;
      @include setMacScrollbar('&');
    }

    .btn-mobile-sticky {
      width: 100%;
    }
  }

  @media #{map-get($display-breakpoints, 'sm-and-up')} {
    .padding-half-gutter {
      padding-right: 4.15%;
    }
  }
}
</style>
