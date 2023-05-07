<template>
  <div v-if="hasData" id="product-return-list">
    <template v-if="$vuetify.breakpoint.smAndUp">
      <content-header
        id="product-return__header"
        className="d-flex flex-row"
        dataId="product-return-list"
      >
        <template #breadcrumb>
          <mp-breadcrumb />
        </template>
        <template #title>
          <span class="d-flex align-center">
            <h1 class="mr-4">
              {{ $t('page.createProductReturn.title', { step: currentStep, stepCount: 2 }) }}
            </h1>
          </span>
        </template>
        <template #actions-button>
          <mp-button
            :text="$t('action.cancel.base')"
            format="link"
            linkColor="black"
            @click="returnToOrder"
            dataId="product-return-create-previous"
          />

          <mp-button
            :disabled="invalid"
            :text="currentStep !== 2 ? $t('common.nextStep') : $t('common.validateReturn')"
            @click="goToNextStep"
            class="action-next"
            dataId="product-return-create-next"
          />
        </template>
      </content-header>
    </template>

    <v-row class="product-return-content" no-gutters>
      <v-col
        cols="12"
        sm="10"
        offset="0"
        offset-sm="1"
        v-if="currentStep === 1"
      >
        <product-selection
          @invalid="isInvalid => (invalids.step1 = isInvalid)"
          @updateProductReturn="updateProductReturn"
          :products="products"
        />
      </v-col>

      <v-col cols="10" offset="1" v-if="currentStep === 2">
        <package-selection
          @invalid="isInvalid => (invalids.step2 = isInvalid)"
          :products="returnOrder.packages[0].products"
          @returnToSelectProducts="() => currentStep--"
          @updateCarrier="selectedCarrier => (returnOrder.Carrier.code = selectedCarrier)"
          :picking="returnOrder.picking"
          :delivery="returnOrder.delivery"
          @updatePickingAddress="pickingAddress => (returnOrder.picking.address = pickingAddress)"
          @updateDeliveryAddress="deliveryAddress => (returnOrder.delivery.address = deliveryAddress)"
          :packages="returnOrder.packages[0]"
          @updatePackages="packages => returnOrder.packages.splice(0, 1, packages)"
          :retailerId="returnOrder.retailerId"
          :storeId="returnOrder.storeId"
          :validations="$v.returnOrder"
          :initialCarrier="initialCarrier"
        />
      </v-col>

      <v-col
        cols="10"
        offset="1"
        class="d-flex justify-end mt-4"
        v-if="$vuetify.breakpoint.smAndUp"
      >
        <mp-button
          :text="$t('action.cancel.base')"
          format="link"
          linkColor="black"
          @click="returnToOrder"
          dataId="product-return-create-previous"
        />

        <mp-button
          :disabled="invalid"
          :text="currentStep !== 2 ? $t('common.nextStep') : $t('common.validateReturn')"
          @click="goToNextStep"
          class="action-next"
          dataId="product-return-create-next"
        />
      </v-col>
    </v-row>

    <div
      v-if="$vuetify.breakpoint.xsOnly"
      class="d-flex justify-space-between actions-wrapper-mobile"
    >
      <mp-button
        :text="$t('action.cancel.base')"
        @click="returnToOrder"
        dataId="product-return-create-previous"
        tile
        class="action-previous"
      />

      <mp-button
        :disabled="invalid"
        :text="currentStep !== 2 ? $t('common.nextStep') : $t('common.validateReturn')"
        @click="goToNextStep"
        class="action-next"
        dataId="product-return-create-next"
        tile
      />
    </div>
  </div>
</template>

<script lang="ts">
import { AVAILABLE_LEVEL_SERVICES } from '@/constants/shared'
import mixins from 'vue-typed-mixins'
import contentHeader from '@/components/contentHeader/contentHeader.vue'
import mpBreadcrumb from '@/components/breadcrumb/breadcrumb.vue'
import { ROUTES, DELIVERY_STATUS } from '@/constants'
import { SET_HEADER_TITLE } from '@/store/mutation-types'

import OrderService from '@/services/order/OrderService'
import ProductSelection from './steps/productsSelection/productSelection.vue'
import PackageSelection from './steps/packageSelection/packageSelection.vue'
import { authorizationMixin, validationMixin } from '@/mixins'
import { v4 } from 'uuid'
import {
  CarrierEntity,
  OrderEntity,
  PackageEntity,
  ProductEntity,
  ProductReturnEntity,
  CarrierSelectionMode,
} from '@/types'
import { dateHelperGetTimezonedDate, dateHelperGetUtcDate } from '@/helpers/dateHelper'
import { minLength, required } from 'vuelidate/lib/validators'
import minDateHelper from '@/helpers/minDateHelper'
import { SnackBarType } from '@/store/types'

export default mixins(authorizationMixin, validationMixin).extend({
  name: 'productReturn',
  components: {
    contentHeader,
    mpBreadcrumb,
    ProductSelection,
    PackageSelection,
  },
  data: () => ({
    ROUTES,
    hasData: false,
    order: {} as OrderEntity,
    invalids: { step1: true, step2: true },
    products: [] as ProductReturnEntity[],
    returnOrder: {} as OrderEntity,
    currentStep: 1,
    showCommentModal: false,
    initialCarrier: null as string | null,
  }),
  validations() {
    const {
      returnOrder: { picking, delivery },
    } = this
    return {
      returnOrder: {
        picking: {
          interval: {
            required,
            $each: {
              start: {
                required,
                dateIsSameOrBefore() {
                  if (!picking.interval.length) {
                    return false
                  }

                  return (
                    minDateHelper(picking.interval[0].start)(picking.interval[0].end) &&
                    minDateHelper(dateHelperGetTimezonedDate().toISOString())(
                      picking.interval[0].start,
                    )
                  )
                },
              },
              end: {
                required,
                dateIsSameOrBefore() {
                  if (!picking.interval.length) {
                    return false
                  }

                  return minDateHelper(picking.interval[0].start)(picking.interval[0].end)
                },
              },
            },
          },
        },
        delivery: {
          interval: {
            $each: {
              start: {
                required,
                dateIsSameOrBefore: () => {
                  if (!delivery.interval.length) {
                    return false
                  }

                  const isMoreThanPickingDate = minDateHelper(picking.interval[0].start)(
                    delivery.interval[0].start,
                  )

                  if (!isMoreThanPickingDate) {
                    return isMoreThanPickingDate
                  }

                  return minDateHelper(delivery.interval[0].start)(delivery.interval[0].end)
                },
              },
              end: {
                required,
                dateIsSameOrBefore() {
                  if (!delivery.interval.length) {
                    return false
                  }

                  const isMoreThanPickingDate = minDateHelper(picking.interval[0].end)(
                    delivery.interval[0].end,
                  )

                  if (!isMoreThanPickingDate) {
                    return isMoreThanPickingDate
                  }

                  return minDateHelper(delivery.interval[0].start)(delivery.interval[0].end)
                },
              },
            },
          },
        },
        services: { required, minLength: minLength(1) },
      },
    }
  },
  async beforeMount() {
    try {
      if (isNaN(parseInt(this.$route.params.id, 10))) {
        return this.$router.push({ name: ROUTES.notFound })
      }

      this.order = await OrderService.get(parseInt(this.$route.params.id, 10), {
        personalData: true,
      })

      this.products = this.order.packages.flatMap(({ products = [], quantity }) =>
        products.map(
          product =>
            ({
              ...product,
              quantity: quantity * product.quantity,
              toReturn: false,
              selectedQuantity: null,
            } as ProductReturnEntity),
        ),
      )

      if (this.order?.Delivery) {
        const {
          order: {
            Delivery: { status: currentDeliveryStatus },
          },
        } = this

        if (currentDeliveryStatus !== DELIVERY_STATUS.OK) {
          return this.$router.push({ name: ROUTES.noAccess })
        }

        const {
          storeId,
          retailerId,
          Carrier: { code: initialCarrier = null },
        } = this.order

        this.initialCarrier = initialCarrier
        this.returnOrder = {
          externalOrderId: v4(),
          referenceNumber: this.order.referenceNumber,
          picking: { ...this.order.delivery, interval: [{ start: '', end: '' }] },
          delivery: { ...this.order.picking, interval: [{ start: '', end: '' }] },
          packages: [{}] as PackageEntity[],
          services: [AVAILABLE_LEVEL_SERVICES.RETURN],
          storeId,
          retailerId,
          Carrier: {} as CarrierEntity,
        } as OrderEntity
      }
    } catch (e) {
      if (e.response?.status === 403) {
        return this.$router.push({ name: ROUTES.noAccess })
      }
      if (e.response?.status === 404) {
        return this.$router.push({ name: ROUTES.notFound })
      }
    }
    this.hasData = true
    this.setTitle()
  },
  computed: {
    invalid(): boolean {
      return (
        (this.currentStep === 2 && this.$v.$invalid) ||
        Object.values(this.invalids).some((invalid, i) => i <= this.currentStep - 1 && invalid)
      )
    },
  },
  methods: {
    setTitle() {
      this.$store.commit(
        SET_HEADER_TITLE,
        this.$t('page.createProductReturn.title', {
          step: this.currentStep,
          stepCount: Object.keys(this.invalids).length,
        }),
      )
    },
    async goToNextStep() {
      if (this.currentStep === 1) {
        this.returnOrder.packages[0].products = this.products.reduce(
          (acc, { toReturn, selectedQuantity, label, ...product }, index) => {
            if (toReturn) {
              acc.push({
                ...product,
                label: label || this.$t('page.detailOrder.detail.productNb', { number: index + 1 }),
                quantity: selectedQuantity as number,
              })
            }
            return acc
          },
          [] as ProductEntity[],
        )
      }

      if (this.currentStep === 2) {
        const {
          packages,
          Carrier: { code },
          ...returnOrder
        } = this.returnOrder

        const payload = {
          ...returnOrder,
          picking: {
            ...returnOrder.picking,
            interval: [
              {
                start: dateHelperGetUtcDate(returnOrder.picking.interval[0].start).toISOString(),
                end: dateHelperGetUtcDate(returnOrder.picking.interval[0].end).toISOString(),
              },
            ],
          },
          delivery: {
            ...returnOrder.delivery,
            interval: [
              {
                start: dateHelperGetUtcDate(returnOrder.delivery.interval[0].start).toISOString(),
                end: dateHelperGetUtcDate(returnOrder.delivery.interval[0].end).toISOString(),
              },
            ],
          },
          packages,
          ...(code && {
            carrierSelection: {
              mode: CarrierSelectionMode.INCLUSION,
              carrierCodes: [code],
            },
          }),
        }
        try {
          const order = await OrderService.create(payload)
          this.$store.dispatch('setSnackbar', {
            type: SnackBarType.SUCCESS,
            message: this.$t('page.productReturn.successMessage'),
          })
          return this.$router.push({
            name: ROUTES.detailOrder,
            params: { id: order.id.toString() },
          })
        } catch (e) {
          this.$store.dispatch('setSnackbar', {
            type: SnackBarType.ERROR,
            message: this.$t('messages.error'),
          })
          return
        }
      }

      this.currentStep++

      this.setTitle()
    },
    returnToOrder() {
      return this.$router.push({
        name: ROUTES.detailOrder,
        params: { id: this.$route.params.id },
      })
    },
    updateProductReturn({ product, index }: { product: ProductReturnEntity; index: number }) {
      this.products.splice(index, 1, { ...product })
    },
  },
})
</script>

<style lang="scss">
#product-return-list {
  h1 {
    width: fit-content !important;
  }

  .product-return-content {
    padding-bottom: 2rem;

    @media #{map-get($display-breakpoints, 'xs-only')} {
      padding-bottom: 8rem;
    }
  }

  .actions-wrapper-mobile {
    position: fixed;
    bottom: 0;
    width: 100%;
    z-index: 3;

    .action-next {
      float: right;

      @media #{map-get($display-breakpoints, 'xs-only')} {
        padding-left: 2rem !important;
        padding-right: 2rem !important;
      }
    }

    .action-next,
    .action-previous {
      height: 6rem !important;
      border-radius: 0;
      flex-grow: 1;
    }

    .full-size {
      width: 100%;
    }

    .half-size {
      width: 50%;
    }
  }
}
</style>
