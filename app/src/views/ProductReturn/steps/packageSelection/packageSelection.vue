<template>
  <div id="package-selection" class="pt-4">
    <v-row no-gutters>
      <v-col cols="12" class="pb-4">
        <h3>{{ $t('page.productReturn.packages.size.title') }}</h3>
      </v-col>

      <v-col cols="12" sm="6" class="left-page">
        <v-row no-gutters>
          <v-col cols="12" class="py-4 px-4 size-warning medium14">
            <span>{{ $t('page.productReturn.packages.size.warning') }}</span>
          </v-col>
          <v-col cols="12" class="dimension-wrapper">
            <package-selection-form
              @updateDimensions="updateDimensions($event)"
              @invalid="invalid => (invalids.dimensions = invalid)"
            />
          </v-col>
        </v-row>

        <v-row no-gutters>
          <v-col cols="12" class="pb-4">
            <h3>{{ $t('page.orders.filters.pickingDate') }}</h3>
          </v-col>

          <v-col cols="12">
            <product-return-date-hour
              :interval="picking.interval"
              @invalid="invalid => (invalids.pickingDate = invalid)"
              @updateInterval="updatePickingDate($event)"
              :validations="validations.picking.interval.$each[0]"
              :min="new Date().toISOString()"
              dataId="product-return-picking-date"
            />
          </v-col>
        </v-row>

        <v-row no-gutters class="mt-6">
          <v-col cols="12" class="pb-4">
            <h3>{{ $t('page.productReturn.delivery.date') }}</h3>
          </v-col>

          <v-col cols="12">
            <product-return-date-hour
              :interval="delivery.interval"
              @invalid="invalid => (invalids.deliveryDate = invalid)"
              @updateInterval="updateDeliveryDate($event)"
              :validations="validations.delivery.interval.$each[0]"
              :min="picking.interval[0].start"
              dataId="product-return-delivery-date"
            />
          </v-col>
        </v-row>

        <v-row no-gutters class="mt-6">
          <v-col cols="12" class="pb-4">
            <h3>{{ $t('page.productReturn.picking.address.title') }}</h3>
          </v-col>
          <v-col cols="12">
            <address-selection-form
              :pickupAddress="picking.address"
              @updatePickingAddress="updatePickingAddress($event)"
            />
          </v-col>
        </v-row>

        <v-row no-gutters class="mt-6">
          <v-col cols="12" class="pb-4">
            <h3>{{ $t('page.productReturn.delivery.address.title') }}</h3>
          </v-col>
          <v-col cols="12">
            <arrival-address-selection
              :retailerId="retailerId"
              :storeId="storeId"
              :deliveryAddress="delivery.address"
              @updateDeliveryAddress="updateDeliveryAddress($event)"
            />
          </v-col>
        </v-row>

        <v-row no-gutters class="mt-6">
          <v-col cols="12" class="pb-4">
            <h3>{{ $t('page.productReturn.carrier.title') }}</h3>
          </v-col>
          <v-col cols="12">
            <carrier-selection
              :retailerId="retailerId"
              :storeId="storeId"
              @updateCarrier="updateCarrierCode($event)"
              :initialCarrier="initialCarrier"
              :picking="picking"
            />
          </v-col>
        </v-row>
      </v-col>

      <v-col sm="6" cols="12" class="right-page">
        <div class="product-list">
          <v-card class="products-card py-8 m-4" outlined :ripple="false">
            <v-row no-gutters>
              <v-col cols="10" offset="1">
                <h3>{{ $t('page.productReturn.toReturn') }}</h3>
              </v-col>

              <v-col cols="10" offset="1" class="py-4 px-3">
                <v-row
                  no-gutter
                  v-for="({ label, quantity, ean }, index) of products"
                  :key="`${index}-${ean}`"
                  class="products d-flex justify-space-between py-4"
                >
                  <v-col cols="12" class="d-flex justify-space-between">
                    <span class="selected-product-label regular14">
                      {{ label || $t('page.detailOrder.detail.productNb', { number: index + 1 }) }}
                    </span>
                    <span class="regular14 selected-quantity">{{ quantity }}</span>
                  </v-col>
                </v-row>
              </v-col>

              <v-col cols="10" offset="1" class="d-flex justify-center">
                <mp-button
                  :text="$t('action.modify.base')"
                  format="secondary"
                  icon="pencil"
                  @click="$emit('returnToSelectProducts')"
                  dataId="product-return-select-products"
                />
              </v-col>
            </v-row>
          </v-card>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import mixins from 'vue-typed-mixins'

import { validationMixin } from '@/mixins'

import packageSelectionForm from './components/packageSelectionForm/formPackage.vue'
import addressSelectionForm from './components/addressSelectionForm/addressSelection.vue'
import arrivalAddressSelection from './components/addressSelectionForm/arrivalAddressSelection.vue'
import carrierSelection from './components/carrierSelection/carrierSelection.vue'
import { Dimension, ProductReturnEntity, Unit, PickingInformations, Address } from '@/types'
import productReturnDateHour from '@/views/ProductReturn/steps/packageSelection/components/dateHour.vue'

export default mixins(validationMixin).extend({
  name: 'package-selection-step',
  components: {
    packageSelectionForm,
    addressSelectionForm,
    arrivalAddressSelection,
    carrierSelection,
    productReturnDateHour,
  },
  props: {
    retailerId: {
      type: Number,
      required: true,
    },
    storeId: {
      type: Number,
      required: true,
    },
    products: {
      type: Array as () => ProductReturnEntity[],
      required: true,
    },
    packages: {
      type: Object,
      required: true,
    },
    picking: {
      type: Object as () => PickingInformations,
      required: true,
    },
    delivery: {
      type: Object as () => PickingInformations,
      required: true,
    },
    validations: {
      type: Object as () => Record<string, any>,
      required: true,
    },
    initialCarrier: {
      type: String,
      default: null,
    },
  },
  data: () => ({
    carrierCode: null as string | null,
    invalids: {
      deliveryDate: true,
      pickingDate: true,
      dimensions: true,
    },
  }),
  methods: {
    updateDimensions(dimensions: Dimension & { unit: string; weight: Unit }) {
      const { width, unit, height, length, weight } = dimensions
      this.$emit('updatePackages', {
        ...this.packages,
        weight,
        width: { value: Number(width), unit },
        height: { value: Number(height), unit },
        length: { value: Number(length), unit },
      })
    },
    updateWeight(weight: Unit) {
      this.$emit('updatePackages', { ...this.packages, weight })
    },
    updateCarrierCode(carrierCode: string) {
      this.carrierCode = carrierCode
      this.$emit('updateCarrier', carrierCode)
    },
    updatePickingAddress(pickingAddress: Address) {
      this.$emit('updatePickingAddress', pickingAddress)
    },
    updateDeliveryAddress(deliveryAddress: Address) {
      this.$emit('updateDeliveryAddress', deliveryAddress)
    },
    updatePickingDate(pickingDate: string) {
      this.picking.interval = [{ start: pickingDate, end: pickingDate }]
    },
    updateDeliveryDate(deliveryDate: string) {
      this.delivery.interval = [{ start: deliveryDate, end: deliveryDate }]
    },
  },
  watch: {
    invalids: {
      deep: true,
      handler() {
        this.$emit(
          'invalid',
          Object.values(this.invalids).some(invalid => invalid),
        )
      },
    },
  },
})
</script>

<style lang="scss">
#package-selection {
  .size-warning {
    border: 0.1rem solid $alert-color;
    color: $alert-color;
    box-sizing: border-box;
  }

  @media #{map-get($display-breakpoints, 'sm-and-up')} {
    .right-page {
      padding-left: calc(100vw / (38 * 2));
    }

    .left-page {
      padding-right: calc(100vw / (38 * 2));
    }
  }

  @media #{map-get($display-breakpoints, 'xs-only')} {
    .right-page {
      margin-top: 2.8rem;
    }
  }

  .left-page {
    padding-top: 0;
    margin-top: 0;

    .dimension-wrapper {
      span {
        color: $main-lighten-52-color;
      }

      .mp-radio {
        label {
          color: $main-lighten-28-color;
        }
      }
    }
  }

  .product-list {
    background-color: $main-lighten-80-color !important;
    max-height: fit-content;
    height: fit-content;
    padding: 3.2rem;

    .products-card {
      .products {
        display: flex;
        justify-content: space-between;
        &:not(:last-child) {
          border-bottom: 0.1rem $main-lighten-74-color solid;
        }

        .selected-product-label {
          display: list-item;
          list-style: inside;
          word-break: break-all;
        }

        .selected-quantity {
          color: $main-lighten-52-color;
        }
      }
    }
  }
}
</style>
