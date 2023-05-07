<template>
  <v-row no-gutters class="block" v-if="hasLoaded" data-id="order-create-block-orderContent">
    <v-col cols="12" class="header">
      <h2>{{ $t('page.createOrder.titles.orderContent') }}</h2>
      <span class="block-info">{{ $t('page.createOrder.infos.orderContent') }}</span>
    </v-col>

    <v-col cols="12" class="content">
      <create-order-orderContent-product
        :class="`${index === 0 ? '' : 'mt-6'}`"
        v-for="(localPackage, index) in orderContent.packages"
        :key="`create-order-orderContent-${index}`"
        :typologyItems="typologyItems"
        :availablesPackageSize="availablesPackageSize"
        :index="index"
        :isEditing="isEditing"
        @destroyPackage="destroyPackage($event)"
        :validations="validations"
        :orderContent="orderContent"
      />

      <v-row no-gutters>
        <v-col cols="12" class="d-flex mt-5 justify-end">
          <mp-button
            dataId="order-create-orderContent-add-packages"
            :text="$t('page.order.packages.newPackage')"
            format="secondary"
            @click="addPackage()"
          />
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { AVAILABLE_PACKAGE_SIZE, AVAILABLE_PACKAGE_SIZE_TYPE } from '@/constants'
import { AVAILABLE_PRODUCT_TYPOLOGIES } from '@/constants/shared'
import RetailerService from '@/services/retailer/RetailerService'
import { CreateOrderStateOrderContent } from '@/store/modules/createOrder/orderContent/types'
import {
  CreateOrderStateEligibility,
  CreateOrderStateMiscellaneous,
} from '@/store/modules/createOrder/types'
import { AvailablePackageSizeType, CarrierEligibilityEntity, SelectItem } from '@/types'
import Vue from 'vue'
import { defaultPackage } from '@/store/modules/createOrder/orderContent'
import createOrderOrderContentProduct from '@/views/Order/Create/orderContent/component/product.vue'
import { CreateOrderStateSenderIdentity } from '@/store/modules/createOrder/senderIdentity/types'

export default Vue.extend({
  name: 'order-create-orderContent',
  components: {
    createOrderOrderContentProduct,
  },
  props: {
    isEditing: {
      type: Boolean,
      required: true,
    },
  },
  data: () => ({
    typologyItems: [] as SelectItem[],
    availablesPackageSize: [] as AvailablePackageSizeType[],
    hasLoaded: false,
  }),
  computed: {
    senderIdentity(): CreateOrderStateSenderIdentity {
      return this.$store.getters['createOrder/senderIdentity/senderIdentity']
    },
    eligibility(): CreateOrderStateEligibility {
      return this.$store.getters['createOrder/eligibility']
    },
    orderContent(): CreateOrderStateOrderContent {
      return this.$store.getters['createOrder/orderContent/orderContent']
    },
    validations(): any {
      return this.$store.getters['createOrder/orderContent/$v']
    },
    miscellaneous(): CreateOrderStateMiscellaneous {
      return this.$store.getters['createOrder/miscellaneous']
    },
  },
  async mounted() {
    if (this.senderIdentity.retailerId) {
      const retailer =
        this.miscellaneous.retailer || (await RetailerService.get(this.senderIdentity.retailerId))

      if (retailer.packagesDimensions && retailer.packagesDimensions.length) {
        this.availablesPackageSize = retailer.packagesDimensions.map((dimension, index) => {
          return {
            label: dimension.label,
            type: AVAILABLE_PACKAGE_SIZE_TYPE.RETAILER,
            value: index + 1,
            unit: dimension.dimension.width.unit,
            dimension: {
              width: dimension.dimension.width.value!.toString(),
              length: dimension.dimension.length.value!.toString(),
              height: dimension.dimension.height.value!.toString(),
            },
          }
        })
      } else {
        this.availablesPackageSize = AVAILABLE_PACKAGE_SIZE
      }
    } else {
      this.availablesPackageSize = AVAILABLE_PACKAGE_SIZE
    }

    if (!this.availablesPackageSize.find(size => size.type === AVAILABLE_PACKAGE_SIZE_TYPE.OTHER)) {
      this.availablesPackageSize.push({
        label: this.$t('common.other'),
        type: AVAILABLE_PACKAGE_SIZE_TYPE.OTHER,
        value: this.availablesPackageSize[this.availablesPackageSize.length - 1].value + 1,
        dimension: {
          width: '',
          length: '',
          height: '',
        },
        unit: 'cm',
      })
    }

    this.getTypologyItems(this.eligibility.unfilteredCarriers)
    this.hasLoaded = true
  },
  methods: {
    getTypologyItems(orderEligibilities: CarrierEligibilityEntity[]) {
      let typologyItems = Array.from(Object.values(AVAILABLE_PRODUCT_TYPOLOGIES))

      if (orderEligibilities?.length) {
        typologyItems = Array.from(
          orderEligibilities.reduce((acc: Set<string>, oe: CarrierEligibilityEntity) => {
            if (!oe.typologies?.length) {
              return acc
            }

            for (const typology of oe.typologies) {
              acc.add(typology)
            }
            return acc
          }, new Set()),
        )
      }

      this.typologyItems = typologyItems.map(value => ({
        text: this.$t(`technical.typologies.${value}`),
        value: value as string,
      }))
    },
    destroyPackage(index: number) {
      this.orderContent.packages.splice(index, 1)

      this.$nextTick(() => {
        this.orderContent.packages.splice(index, 0, defaultPackage())
      })
    },
    addPackage() {
      this.orderContent.packages.push(defaultPackage())
    },
  },
  watch: {
    'eligibility.unfilteredCarriers'(next) {
      this.getTypologyItems(next)
    },
  },
})
</script>
