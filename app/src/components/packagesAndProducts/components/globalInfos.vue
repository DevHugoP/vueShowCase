<template>
  <v-row id="packages-and-products-product-global-infos-container">
    <v-col cols="8" sm="auto" class="d-flex justify-space-between flex-column">
      <span class="label medium12 main-lighten-52">
        {{
          $t('page.detailOrder.packagesAndProducts.packagesTotalWeight', { count: packagesCount })
        }}
      </span>
      <h3>{{ weight.value.toFixed(2).replace(/[.,]0+$/, '') }} {{ weight.unit }}</h3>
    </v-col>
    <v-col
      cols="4"
      sm="auto"
      class="dimensions d-flex justify-space-between flex-column ml-sm-auto"
    >
      <span class="label medium12 main-lighten-52">
        {{ $t('page.detailOrder.packagesAndProducts.packagesMaxWeight') }}
      </span>
      <h3>{{ maxWeight.value.toFixed(2).replace(/[.,]0+$/, '') }} {{ maxWeight.unit }}</h3>
    </v-col>
    <v-col sm="auto" class="dimensions d-flex justify-space-between flex-column">
      <span class="label medium12 main-lighten-52">
        {{ $t('page.detailOrder.packagesAndProducts.packagesMaxLength') }}
      </span>
      <h3>{{ maxLength.value.toFixed(2).replace(/[.,]0+$/, '') }} {{ maxLength.unit }}</h3>
    </v-col>
    <v-col sm="auto" class="dimensions d-flex justify-space-between flex-column">
      <span class="label medium12 main-lighten-52">
        {{ $t('page.detailOrder.packagesAndProducts.packagesMaxWidth') }}
      </span>
      <h3>{{ maxWidth.value.toFixed(2).replace(/[.,]0+$/, '') }} {{ maxWidth.unit }}</h3>
    </v-col>
    <v-col sm="auto" class="dimensions d-flex justify-space-between flex-column">
      <span class="label medium12 main-lighten-52">
        {{ $t('page.detailOrder.packagesAndProducts.packagesMaxHeight') }}
      </span>
      <h3>{{ maxHeight.value.toFixed(2).replace(/[.,]0+$/, '') }} {{ maxHeight.unit }}</h3>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'
import convert from 'convert-units'
import { PackageEntity, Unit } from '@/types'

export default Vue.extend({
  name: 'mp-packages-and-products-product-global-info',
  props: {
    packages: {
      type: Array as () => PackageEntity[],
      required: true,
    },
  },
  data: () => ({
    maxHeight: {
      value: 0,
      unit: 'cm',
    } as Unit,
    maxLength: {
      value: 0,
      unit: 'cm',
    } as Unit,
    maxWidth: {
      value: 0,
      unit: 'cm',
    } as Unit,
    maxWeight: {
      value: 0,
      unit: 'kg',
    } as Unit,
    weight: {
      value: 0,
      unit: 'kg',
    } as Unit,
    packagesCount: 0,
  }),
  beforeMount() {
    const { packagesCount, totalWeight, maxWeight, maxHeight, maxLength, maxWidth } = this.packages.reduce(
      (acc, { quantity, products = [], weight, height, width, length }) => ({
        totalWeight: {
          value:
            (acc.totalWeight.value as number) +
            convert(weight.value as number)
              .from(weight.unit as any)
              .to(acc.totalWeight.unit as any) *
              quantity,
          unit: acc.totalWeight.unit,
        },
        maxWeight: {
          value: this.getBiggestValue(acc.maxWeight.value as number, weight, 'kg'),
          unit: 'kg',
        },
        maxHeight: {
          value: this.getBiggestValue(acc.maxHeight.value as number, height, 'cm'),
          unit: 'cm',
        },
        maxLength: {
          value: this.getBiggestValue(acc.maxLength.value as number, length, 'cm'),
          unit: 'cm',
        },
        maxWidth: {
          value: this.getBiggestValue(acc.maxWidth.value as number, width, 'cm'),
          unit: 'cm',
        },
        packagesCount:
          acc.packagesCount +
          quantity *
            products.reduce((productAcc, { quantity: productQuantity }) => {
              return productAcc + productQuantity
            }, 0),
      }),
      {
        packagesCount: 0,
        totalWeight: { unit: 'kg', value: 0 },
        maxWeight: { unit: 'kg', value: 0 },
        maxHeight: { unit: 'cm', value: 0 },
        maxLength: { unit: 'cm', value: 0 },
        maxWidth: { unit: 'cm', value: 0 },
      } as {
        packagesCount: number
        totalWeight: Unit
        maxWeight: Unit
        maxHeight: Unit
        maxLength: Unit
        maxWidth: Unit
      },
    )

    this.maxHeight = maxHeight
    this.maxWeight = maxWeight
    this.maxLength = maxLength
    this.maxWidth = maxWidth
    this.weight = totalWeight
    this.packagesCount = packagesCount
  },
  methods: {
    getBiggestValue(currentValue: number, toCompare: Unit, unitToConvertIn: convert.Unit): number {
      const convertedValue = convert(toCompare.value as number)
        .from(toCompare.unit as any)
        .to(unitToConvertIn)
      return currentValue > convertedValue ? currentValue : convertedValue
    },
  },
})
</script>

<style lang="scss" scoped>
#packages-and-products-product-global-infos-container {
  border: 0.1rem solid $main-color;
  box-sizing: border-box;
  border-radius: 0.4rem;
  margin: 0 0 2.2rem 0;

  .dimensions {
    min-height: 6.2rem !important;
  }

  .label {
    color: $main-lighten-65-color;
    @include regular-14();

    @media #{map-get($display-breakpoints, 'xs-only')} {
      @include medium-12();
    }
  }
}
</style>
