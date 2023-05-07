<template>
  <div class="pa-0">
    <mp-data-table
      id="product-selection-list-data-table"
      :headers="headers"
      :items="products"
      :isCustomMobile="$vuetify.breakpoint.xsOnly"
      pageLabel=""
    >
      <template v-slot:toReturn="{ toReturn, item, index }">
        <span class="d-flex flex-column justify-space-between align-center">
          <v-checkbox
            label=""
            class="toReturn-checkbox"
            @change="handleCheckboxChange(index, $event)"
            :data-id="`product-list-list-${item.ean || item.cug}-${index}`"
            :false-value="false"
            :true-value="true"
            :input-value="toReturn"
          />
        </span>
      </template>

      <template v-slot:label="{ label, index }">
        <span class="regular14 main-color product-label">
          {{ label || $t('page.detailOrder.detail.productNb', { number: index + 1 }) }}
        </span>
      </template>

      <template v-slot:ean="{ ean, item }">
        <div class="d-flex flex-column justify-space-between">
          <span v-if="ean" class="main-lighten-52 regular14">
            {{ $t('page.detailOrder.packagesAndProducts.ean') }}: {{ ean }}
          </span>
          <span v-if="item.cug" class="main-lighten-52 regular14">
            {{ $t('page.detailOrder.packagesAndProducts.cug') }}: {{ item.cug }}
          </span>
          <span class="italic12 main-lighten-28">
            {{ $t(`technical.typologies.${item.type}`) }}
          </span>
        </div>
      </template>

      <template v-slot:quantity="{ quantity, item, index }">
        <div class="quantity-wrapper">
          <span class="regular14 main-color">
            {{ `${$t('page.productReturn.product.quantity')}:` }}
          </span>
          <mp-textfield
            :disabled="!item.toReturn"
            @update="handleSelectQuantityChange(item, $event)"
            name="selectedQuantity"
            class="field-quantity-select"
            v-model="item.selectedQuantity"
            :dataId="`quantity-select-${index}`"
            label=""
            type="number"
            @input="$v.products[index].selectedQuantity.$touch()"
            @blur="$v.products[index].selectedQuantity.$touch()"
            :errors="getModelErrors($v.products[index].selectedQuantity)"
            :isDirty="$v.products[index].selectedQuantity.$dirty"
          />
          <span>/{{ quantity }}</span>
        </div>
      </template>

      <template v-slot:mobile="{ item, index }">
        <div class="mobile-wrapper">
          <div class="d-flex align-center">
            <v-checkbox
              class="toReturn-checkbox"
              @change="handleCheckboxChange(index, $event)"
              :data-id="`product-list-list-${item.ean || item.cug}-${index}`"
              :false-value="false"
              :true-value="true"
              :input-value="item.toReturn"
            />
            <span class="regular16 product-label">
              {{ item.label || $t('page.detailOrder.detail.productNb', { number: index + 1 }) }}
            </span>
          </div>

          <div class="d-flex flex-column ml-8 mt-4 justify-space-between">
            <span v-if="item.ean" class="main-lighten-52 regular14">
              {{ $t('page.detailOrder.packagesAndProducts.ean') }}: {{ item.ean }}
            </span>
            <span v-if="item.cug" class="main-lighten-52 regular14">
              {{ $t('page.detailOrder.packagesAndProducts.cug') }}: {{ item.cug }}
            </span>
            <span class="italic12 main-lighten-52">
              {{ item.type }}
            </span>
          </div>

          <div v-if="item.toReturn" class="quantity-wrapper">
            <span class="regular14 main-color">
              {{ $t('page.productReturn.product.quantity') }} :
            </span>
            <mp-textfield
              :disabled="!item.toReturn"
              @update="handleSelectQuantityChange(index, $event)"
              name="selectedQuantity"
              class="field-quantity-select"
              v-model="item.selectedQuantity"
              :dataId="`quantity-select-${index}`"
              label=""
              type="number"
              @input="$v.products[index].selectedQuantity.$touch()"
              @blur="$v.products[index].selectedQuantity.$touch()"
              :errors="getModelErrors($v.products[index].selectedQuantity)"
              :isDirty="$v.products[index].selectedQuantity.$dirty"
            />
            <span>/{{ item.quantity }}</span>
          </div>
        </div>
      </template>
    </mp-data-table>
  </div>
</template>

<script lang="ts">
import mixins from 'vue-typed-mixins'

import { validationMixin } from '@/mixins'
import { minValue, maxValue, requiredIf, integer, numeric } from 'vuelidate/lib/validators'
import { ProductReturnEntity } from '@/types'

export default mixins(validationMixin).extend({
  name: 'product-selection-step',
  props: {
    products: {
      type: Array as () => ProductReturnEntity[],
      required: true,
    },
  },
  validations() {
    const productRules = this.products.reduce(
      (acc, { quantity }, i) => ({
        ...acc,
        [i]: {
          selectedQuantity: {
            numeric,
            integer,
            required: requiredIf((currentProduct): boolean => currentProduct.toReturn),
            maxValue: maxValue(quantity),
            minValue: minValue(1),
          },
        },
      }),
      {},
    )

    return { products: productRules }
  },
  data: () => ({
    headers: [
      {
        text: '',
        align: 'center',
        sortable: false,
        value: 'toReturn',
        width: '10%',
      },
      { text: '', value: 'label', sortable: false },
      { text: '', value: 'ean', sortable: false, width: '20%' },
      { text: '', value: 'quantity', sortable: false, width: '30%' },
    ],
  }),
  methods: {
    handleCheckboxChange(itemIndex: number, event: boolean) {
      const product = this.products[itemIndex]
      const editedItem = {
        ...product,
        toReturn: event,
        selectedQuantity: event ? product.selectedQuantity : null,
      }
      this.$emit('updateProductReturn', { product: editedItem, index: itemIndex })
    },
    handleSelectQuantityChange(itemIndex: number, event: number) {
      const editedItem = { ...this.products[itemIndex], selectedQuantity: event }
      this.$emit('updateProductReturn', { product: editedItem, index: itemIndex })
    },
  },
  watch: {
    '$v.products.$invalid'(next: boolean) {
      this.$emit(
        'invalid',
        next ||
          !this.products.some(
            ({ toReturn: productReturn, selectedQuantity }) => productReturn && selectedQuantity,
          ),
      )
    },
    products(next: ProductReturnEntity[]) {
      this.$emit(
        'invalid',
        this.$v.$invalid ||
          !next.some(
            ({ toReturn: productReturn, selectedQuantity }) => productReturn && selectedQuantity,
          ),
      )
    },
  },
})
</script>

<style lang="scss">
#product-selection-list-data-table {
  .product-label {
    word-break: break-all;
  }

  .v-data-table-header {
    display: none;
  }
  .toReturn-checkbox {
    .v-input__slot {
      margin-bottom: 0 !important;
    }
    .v-messages {
      display: none !important;
    }

    i {
      &.mdi-checkbox-marked {
        color: $success-color !important;
      }
    }
  }

  tbody {
    tr {
      @include regular-16;

      color: $main-color;

      &:nth-child(even) {
        background-color: $main-lighten-80-color !important;
      }
      .field-quantity-select {
        width: fit-content;
      }
    }
  }

  .mobile-wrapper {
    padding: 2rem;
    width: 100%;
  }

  .quantity-wrapper {
    display: flex;
    align-items: baseline;
    justify-content: flex-end;

    @media #{map-get($display-breakpoints, 'xs-only')} {
      margin-left: 3.2rem;
      margin-top: 1.6rem;
    }

    .field-quantity-select {
      padding-left: 0.5rem !important;
      padding-right: 0.9rem !important;
      max-width: 10rem;

      @media #{map-get($display-breakpoints, 'xs-only')} {
        max-width: 10rem;
        margin-left: auto !important;
      }

      .v-input__slot {
        &::before {
          border: none;
        }
        &::after {
          border: none;
        }

        .v-text-field__slot {
          border: 0.1rem solid $main-lighten-65-color;
          border-radius: 0.4rem;

          input {
            text-align: right !important;

            @media #{map-get($display-breakpoints, 'xs-only')} {
              text-align: center !important;
            }
          }
        }

        .v-input__append-inner {
          display: none;
        }
      }
    }
  }
}
</style>
