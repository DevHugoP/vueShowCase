<template>
  <v-row
    no-gutters
    class="block"
    data-id="order-create-block-ticketContent"
    id="order-create-block-ticket-content"
  >
    <v-col cols="12" class="header">
      <div>
        <h2>{{ $t('page.createOrder.titles.ticketContent') }}</h2>
        <span class="block-info">{{ $t('page.createOrder.infos.ticketContent') }}</span>
      </div>
    </v-col>

    <!-- Packages -->
    <div class="container-padding">
      <v-row no-gutters>
        <v-col cols="12" class="packages-wrapper">
          <div class="packages-wrapper-title">
            <h4 :class="`${$vuetify.breakpoint.smAndDown ? 'mb-2' : ''}`">
              {{
                $t(`page.order.ticketContent.package`, {
                  nbOfPackage: nbOfPackage,
                })
              }}
            </h4>
            <mp-button
              dataId="order-create-block-ticketContent-add-package-btn"
              :text="
                $vuetify.breakpoint.smAndUp ? $t('page.order.ticketContent.addCustomPackage') : ''
              "
              icon="plus"
              :format="$vuetify.breakpoint.smAndUp ? 'secondary' : 'primary'"
              :small="$vuetify.breakpoint.smAndDown"
              @click="showAddPackageDialog = true"
            />
          </div>

          <v-row
            no-gutters
            v-for="(localPackage, index) of miscellaneous.availablesPackageSize"
            :key="`packages-${index}`"
          >
            <v-col class="package-wrapper">
              <v-row no-gutters>
                <v-col
                  :cols="$vuetify.breakpoint.smAndDown && localPackage.type === 'DEFAULT' ? 2 : 12"
                >
                  <span class="regular14 main-color">{{ localPackage.label }}</span>
                </v-col>

                <v-col
                  :cols="$vuetify.breakpoint.smAndDown && localPackage.type === 'DEFAULT' ? 10 : 12"
                  class="package-dimension"
                  :class="
                    `${
                      $vuetify.breakpoint.smAndDown && localPackage.type === 'DEFAULT' ? '' : 'mt-2'
                    }`
                  "
                >
                  <span>{{
                    $t('page.createOrder.steps.step2.packageForm.dimension', {
                      ...{
                        height: localPackage.dimension.height,
                        width: localPackage.dimension.width,
                        length: localPackage.dimension.length,
                        unit: localPackage.unit,
                      },
                    })
                  }}</span>
                </v-col>
              </v-row>

              <div
                class="icons-and-counter-wrapper"
                :class="
                  `${
                    $vuetify.breakpoint.smAndDown
                      ? `${
                        localPackage.type !== AVAILABLE_PACKAGE_SIZE_TYPE.OTHER
                          ? 'justify-end'
                          : 'justify-space-between'
                      }`
                      : ''
                  } `
                "
              >
                <div
                  v-if="localPackage.type === AVAILABLE_PACKAGE_SIZE_TYPE.OTHER"
                  class="d-flex justify-center"
                >
                  <v-icon
                    size="1.8rem"
                    class="main-lighten-52 mr-3"
                    @click="
                      selectedPackage = localPackage
                      showEditPackage()
                    "
                  >
                    mdi-pencil
                  </v-icon>
                  <v-icon
                    size="1.8rem"
                    class="main-lighten-52 mr-3"
                    @click="
                      selectedPackage = localPackage
                      showDeletePackageDialog = true
                    "
                  >
                    mdi-trash-can-outline
                  </v-icon>
                </div>
                <mp-counter
                  title=""
                  v-model="localPackage.quantity"
                  :minValue="0"
                  :maxValue="maxPackage(localPackage)"
                  maxMessage="page.order.ticketContent.max"
                  dataId="order-create-ticketContent-product-counter"
                />
              </div>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </div>

    <!-- Products -->
    <div class="container-padding">
      <v-row no-gutters>
        <v-col cols="12" class="products-wrapper">
          <div class="d-flex justify-space-between align-center products-wrapper-title">
            <h4>
              {{
                $t(`page.order.ticketContent.productsList`, {
                  nbOfProducts: nbOfProducts,
                })
              }}
            </h4>
            <mp-button
              dataId="order-create-block-ticketContent-add-btn"
              :text="$vuetify.breakpoint.smAndUp ? $t('action.add.product') : ''"
              icon="plus"
              :format="$vuetify.breakpoint.smAndUp ? 'secondary' : 'primary'"
              :small="$vuetify.breakpoint.smAndDown"
              @click="showAddDialog = true"
            />
          </div>
          <v-row class="search-field" no-gutters>
            <v-col cols="12">
              <mp-textfield
                class="product-search"
                :label="$t('page.order.ticketContent.searchPlaceholder')"
                v-model="search"
                dataId="order-create-block-ticketContent-search"
                prepend-inner-icon="mdi-magnify"
                hideDetails
                outlined
              />
            </v-col>
          </v-row>

          <div :class="`${products && products.length > 5 ? 'product-scroll' : ''}`">
            <v-row
              no-gutters
              v-for="(product, index) of products"
              :key="`products-${index}`"
              class="product-wrapper"
            >
              <v-col :cols="$vuetify.breakpoint.smAndUp ? 7 : 12">
                <v-row no-gutters class="product-infos">
                  <v-col cols="12">
                    <span class="medium14"> {{ product.label }} </span>
                  </v-col>
                  <v-col cols="12" v-if="product.type" class="mt-1">
                    <span class="regular14 main-lighten-52">
                      {{ $t(`technical.typologies.${product.type}`) }}
                    </span>
                  </v-col>
                  <v-col cols="12" v-if="product.ean || product.cug" class="mt-1">
                    <span class="regular12 main-lighten-52">
                      {{
                        `${product.cug ? `CUG : ${product.cug}` : ''}${
                          product.ean && product.cug ? ' - ' : ''
                        }${product.ean ? `EAN : ${product.ean}` : ''}`
                      }}
                    </span>
                  </v-col>
                </v-row>
              </v-col>
              <v-col
                :cols="$vuetify.breakpoint.smAndUp ? 5 : 12"
                :class="$vuetify.breakpoint.smAndDown ? 'mt-2' : ''"
              >
                <div class="icons-and-counter-wrapper">
                  <mp-counter
                    title=""
                    v-model="product.quantity"
                    :minValue="minProduct(product)"
                    :minMessage="
                      product.quantity === 1
                        ? 'page.order.ticketContent.ProductNotNull'
                        : 'page.order.ticketContent.max'
                    "
                    dataId="order-create-ticketContent-product-counter"
                  />
                  <v-icon
                    @click="
                      showDeleteDialog = true
                      selectedProductToDelete = product
                    "
                    size="1.8rem"
                    class="delete-btn"
                  >
                    mdi-trash-can-outline
                  </v-icon>
                </div>
              </v-col>
            </v-row>
          </div>

          <v-row no-gutters class="mt-5">
            <v-col cols="12" v-if="!products.length">
              <no-data dataId="products-noData" :content="$t('common.noData.products')" />
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </div>

    <!-- Delete product -->
    <mp-dialog-confirmation
      v-if="showDeleteDialog"
      classWrapper="TdC-ticketContent-delete-product-dialog"
      dataId="delete-product-dialog"
      color="error"
      :header="{
        iconClose: 'mdi-close',
        icon: $vuetify.breakpoint.smAndUp ? 'mdi-exclamation-thick' : '',
        isColorBackground: false,
      }"
      :btnCancel="{ text: $t('action.cancel.base'), format: 'link', linkColor: 'black' }"
      :btnValidation="{
        text: $t(`action.confirm.base`),
        format: 'error',
      }"
      :btnToColumn="$vuetify.breakpoint.xsOnly"
      @close="showDeleteDialog = false"
      :textContent="
        $t(`page.order.ticketContent.deleteProduct`, { label: selectedProductToDelete.label })
      "
      @submit="deleteProduct()"
      :fullscreen="$vuetify.breakpoint.xsOnly"
    />

    <!-- Add product -->
    <mp-dialog-confirmation
      v-if="showAddDialog"
      classWrapper="TdC-ticketContent-add-product-dialog"
      dataId="add-product-dialog"
      color="primary"
      :header="{
        iconClose: 'mdi-close',
        icon: $vuetify.breakpoint.smAndUp ? 'mdi-plus' : '',
        isColorBackground: true,
        text: $t('page.order.ticketContent.addProduct'),
        textPolice: 'medium16',
      }"
      :btnCancel="{ text: $t('action.cancel.base'), format: 'link', linkColor: 'black' }"
      :btnValidation="{
        text: $t(`action.add.base`),
        format: 'success',
        disabled: $v.addProductForm.$invalid,
      }"
      :btnToColumn="$vuetify.breakpoint.xsOnly"
      @close="closeAddProduct()"
      @submit="addProduct()"
      :fullscreen="$vuetify.breakpoint.xsOnly"
    >
      <template #content>
        <v-row no-gutters>
          <!-- Label -->
          <v-col cols="10" offset="1" class="mt-10">
            <v-menu
              id="label"
              offset-y
              v-model="addProductForm.labelMenu"
              content-class="create-order-product-menu-custom-offset-y"
              key="label"
            >
              <template v-slot:activator="{}">
                <div>
                  <mp-textfield
                    class="mb-5"
                    :label="`${$t('page.createOrder.steps.step2.productForm.description')} *`"
                    type="text"
                    key="add-product-dialog-description"
                    v-model="addProductForm.label"
                    @input="
                      $v.addProductForm.label.$touch()
                      getSuggestions(CatalogTypeEnum.label, $event)
                    "
                    @blur="$v.addProductForm.label.$touch()"
                    :errors="getModelErrors($v.addProductForm.label)"
                    :isDirty="$v.addProductForm.label.$dirty"
                    dataId="add-product-dialog-description"
                  />
                </div>
              </template>
              <v-list>
                <v-list-item
                  v-for="(suggestion, index) in addProductForm.suggestions"
                  :key="`catalog-suggestions-label-${index}`"
                  class="suggestion-wrapper"
                  @click="setDataFromSuggestion(suggestion)"
                >
                  <v-list-item-title>{{ suggestion.label }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-col>

          <!-- Type && Quantity -->
          <v-col cols="10" offset="1" class="d-flex mb-5">
            <mp-select
              class="pr-4"
              dataId="add-product-dialog-typology"
              :label="`${$t('page.createOrder.steps.step2.productForm.typology')} *`"
              :items="typologyItems"
              v-model="addProductForm.type"
              @input="$v.addProductForm.type.$touch()"
              @blur="$v.addProductForm.type.$touch()"
              :errors="getModelErrors($v.addProductForm.type)"
              :isDirty="$v.addProductForm.type.$dirty"
              attach="#packages-products-types"
              dropdownId="packages-products-types"
            />

            <mp-counter
              v-model="addProductForm.quantity"
              dataId="add-product-dialog-quantity"
              :title="''"
            />
          </v-col>

          <!-- CUG && EAN -->
          <v-col cols="10" offset="1">
            <v-row no-gutters class="d-flex">
              <v-col cols="10" md="4">
                <v-menu
                  id="cug"
                  offset-y
                  v-model="addProductForm.cugMenu"
                  content-class="create-order-product-menu-custom-offset-y"
                  key="cug"
                >
                  <template v-slot:activator="{}">
                    <div>
                      <mp-textfield
                        :label="$t('page.createOrder.steps.step2.productForm.CUG')"
                        type="number"
                        v-model="addProductForm.cug"
                        @input="
                          $v.addProductForm.cug.$touch()
                          getSuggestions(CatalogTypeEnum.cug, $event)
                        "
                        @blur="$v.addProductForm.cug.$touch()"
                        :errors="getModelErrors($v.addProductForm.cug)"
                        :isDirty="$v.addProductForm.cug.$dirty"
                        dataId="add-product-dialog-CUG"
                      />
                    </div>
                  </template>
                  <v-list>
                    <v-list-item
                      v-for="(suggestion, suggestionIndex) in addProductForm.suggestions"
                      :key="`catalog-suggestions-CUG-${suggestionIndex}`"
                      class="suggestion-wrapper"
                      @click="setDataFromSuggestion(suggestion)"
                    >
                      <v-list-item-title>{{ suggestion.cug }}</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-col>

              <v-col cols="10" md="7" offset="0" offset-md="1">
                <v-menu
                  id="ean"
                  offset-y
                  v-model="addProductForm.eanMenu"
                  content-class="create-order-product-menu-custom-offset-y"
                  key="ean"
                >
                  <template v-slot:activator="{}">
                    <div>
                      <mp-textfield
                        :label="$t('page.createOrder.steps.step2.productForm.EAN')"
                        type="text"
                        v-model="addProductForm.ean"
                        @input="
                          $v.addProductForm.ean.$touch()
                          getSuggestions(CatalogTypeEnum.ean, $event)
                        "
                        @blur="$v.addProductForm.ean.$touch()"
                        :errors="getModelErrors($v.addProductForm.ean)"
                        :isDirty="$v.addProductForm.ean.$dirty"
                        dataId="add-product-dialog-EAN"
                      />
                    </div>
                  </template>
                  <v-list>
                    <v-list-item
                      v-for="(suggestion, suggestionIndex) in addProductForm.suggestions"
                      :key="`catalog-suggestions-EAN-${suggestionIndex}`"
                      class="suggestion-wrapper"
                      @click="setDataFromSuggestion(suggestion)"
                    >
                      <v-list-item-title>{{ suggestion.ean }}</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </template>
    </mp-dialog-confirmation>

    <!-- Add package -->
    <mp-dialog-confirmation
      v-if="showAddPackageDialog"
      classWrapper="TdC-ticketContent-add-package-dialog"
      dataId="add-package-dialog"
      color="primary"
      :header="{
        iconClose: 'mdi-close',
        icon: $vuetify.breakpoint.smAndUp ? 'mdi-plus' : '',
        isColorBackground: true,
        text: selectedPackage
          ? $t('page.order.ticketContent.editPackage')
          : $t('page.order.ticketContent.addPackage'),
        textPolice: 'medium16',
      }"
      :btnCancel="{ text: $t('action.cancel.base'), format: 'link', linkColor: 'black' }"
      :btnValidation="{
        text: selectedPackage ? $t(`action.save`) : $t(`action.add.base`),
        format: 'success',
        disabled: $v.addPackageForm.$invalid,
      }"
      :btnToColumn="$vuetify.breakpoint.xsOnly"
      @close="closeAddPackage()"
      @submit="addPackage()"
      :fullscreen="$vuetify.breakpoint.xsOnly"
    >
      <template #content>
        <v-row no-gutters>
          <v-col cols="10" offset="1" class="dimension-wrapper">
            <mp-textfield
              :label="`${$t('page.createOrder.steps.step2.productForm.length')} *`"
              type="number"
              v-model="addPackageForm.length"
              @input="$v.addPackageForm.length.$touch()"
              @blur="$v.addPackageForm.length.$touch()"
              :errors="getModelErrors($v.addPackageForm.length)"
              :isDirty="$v.addPackageForm.length.$dirty"
              dataId="add-package-dialog-length"
              :suffix="$t('common.unit.centimeter')"
            />

            <mp-textfield
              :label="`${$t('page.createOrder.steps.step2.productForm.width')} *`"
              type="number"
              v-model="addPackageForm.width"
              @input="$v.addPackageForm.width.$touch()"
              @blur="$v.addPackageForm.width.$touch()"
              :errors="getModelErrors($v.addPackageForm.width)"
              :isDirty="$v.addPackageForm.width.$dirty"
              dataId="add-package-dialog-width"
              :suffix="$t('common.unit.centimeter')"
            />

            <mp-textfield
              :label="`${$t('page.createOrder.steps.step2.productForm.height')} *`"
              type="number"
              v-model="addPackageForm.height"
              @input="$v.addPackageForm.height.$touch()"
              @blur="$v.addPackageForm.height.$touch()"
              :errors="getModelErrors($v.addPackageForm.height)"
              :isDirty="$v.addPackageForm.height.$dirty"
              dataId="add-package-dialog-height"
              :suffix="$t('common.unit.centimeter')"
            />
          </v-col>
        </v-row>
      </template>
    </mp-dialog-confirmation>

    <!-- Delete package -->
    <mp-dialog-confirmation
      v-if="showDeletePackageDialog"
      classWrapper="TdC-ticketContent-delete-package-dialog"
      dataId="delete-package-dialog"
      color="error"
      :header="{
        iconClose: 'mdi-close',
        icon: $vuetify.breakpoint.smAndUp ? 'mdi-exclamation-thick' : '',
        isColorBackground: false,
      }"
      :btnCancel="{ text: $t('action.cancel.base'), format: 'link', linkColor: 'black' }"
      :btnValidation="{
        text: $t(`action.confirm.base`),
        format: 'error',
      }"
      :btnToColumn="$vuetify.breakpoint.xsOnly"
      @close="showDeletePackageDialog = false"
      :textContent="$t('page.order.ticketContent.deletePackage')"
      @submit="deletePackage()"
      :fullscreen="$vuetify.breakpoint.xsOnly"
    />
  </v-row>
</template>

<script lang="ts">
import { AVAILABLE_PRODUCT_TYPOLOGIES } from '@/constants/shared'
import {
  CreateOrderStateEligibility,
  CreateOrderStateMiscellaneous,
} from '@/store/modules/createOrder/types'
import {
  AvailablePackageSizeType,
  CarrierEligibilityEntity,
  CatalogProduct,
  CatalogTypeEnum,
  PackageEntity,
  ProductEntity,
  SelectItem,
} from '@/types'

import mpCounter from '@/components/form/counter/counter.vue'
import RetailerService from '@/services/retailer/RetailerService'
import { AVAILABLE_PACKAGE_SIZE, AVAILABLE_PACKAGE_SIZE_TYPE } from '@/constants'
import { defaultPackage } from '@/store/modules/createOrder/orderContent'
import { minValue, required } from 'vuelidate/lib/validators'
import CatalogProductService from '@/services/catalogProduct/CatalogProductService'
import { validationMixin } from '@/mixins'
import mixins from 'vue-typed-mixins'
import noData from '@/components/noData/noData.vue'
import { CreateOrderStateOrderContent } from '@/store/modules/createOrder/orderContent/types'
import { CreateOrderStateSenderIdentity } from '@/store/modules/createOrder/senderIdentity/types'

const defaultProductForm = () => {
  return {
    label: '',
    type: '',
    quantity: 1,
    cug: '',
    ean: '',
    suggestions: [] as CatalogProduct[],
    labelMenu: false,
    cugMenu: false,
    eanMenu: false,
    settingSuggestion: false,
  }
}

const defaultPackageForm = () => {
  return {
    length: 0,
    width: 0,
    height: 0,
  }
}

export default mixins(validationMixin).extend({
  name: 'order-create-ticket-content',
  components: {
    mpCounter,
    noData,
  },
  data: () => ({
    search: '',
    selectedProductToDelete: null as ProductEntity | null,
    showDeleteDialog: false,
    showAddDialog: false,
    addProductForm: defaultProductForm(),
    CatalogTypeEnum,
    typologyItems: [] as SelectItem[],
    showAddPackageDialog: false,
    addPackageForm: defaultPackageForm(),
    AVAILABLE_PACKAGE_SIZE_TYPE,
    selectedPackage: null as AvailablePackageSizeType | null,
    showDeletePackageDialog: false,
  }),
  validations: {
    addProductForm: {
      label: { required },
      type: { required },
      quantity: { required, minValue: minValue(1) },
      cug: {},
      ean: {},
    },
    addPackageForm: {
      length: { required, minValue: minValue(0.01) },
      width: { required, minValue: minValue(0.01) },
      height: { required, minValue: minValue(0.01) },
    },
  },
  computed: {
    orderContent(): CreateOrderStateOrderContent {
      return this.$store.getters['createOrder/orderContent/orderContent']
    },
    senderIdentity(): CreateOrderStateSenderIdentity {
      return this.$store.getters['createOrder/senderIdentity/senderIdentity']
    },
    miscellaneous(): CreateOrderStateMiscellaneous {
      return this.$store.getters['createOrder/miscellaneous']
    },
    eligibility(): CreateOrderStateEligibility {
      return this.$store.getters['createOrder/eligibility']
    },
    products(): ProductEntity[] {
      return this.orderContent.packages
        .reduce((acc, localPackage) => {
          return [...acc, ...(localPackage.products || [])]
        }, [] as ProductEntity[])
        .filter(product => product.label!.toLowerCase().includes(this.search))
    },
    nbOfProducts(): number {
      return this.orderContent.packages.reduce((acc, localPackage) => {
        const productsQuantity = localPackage.products!.reduce((accProducts, localProduct) => {
          accProducts += localProduct.quantity

          return accProducts
        }, 0)
        acc += localPackage.quantity * productsQuantity

        return acc
      }, 0)
    },
    nbOfPackage(): number {
      return this.miscellaneous.availablesPackageSize.reduce((acc, localPackage) => {
        acc += localPackage.quantity!
        return acc
      }, 0)
    },
  },
  async beforeMount() {
    let availablesPackageSize: AvailablePackageSizeType[] = []
    if (this.senderIdentity.retailerId) {
      const retailer =
        this.miscellaneous.retailer || (await RetailerService.get(this.senderIdentity.retailerId))

      if (retailer.packagesDimensions && retailer.packagesDimensions.length) {
        availablesPackageSize = retailer.packagesDimensions.map((dimension, index) => {
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
            quantity: 0,
          }
        })
      } else {
        availablesPackageSize = AVAILABLE_PACKAGE_SIZE.map(localPackage => {
          return { ...localPackage, quantity: 0 }
        })
      }
    } else {
      availablesPackageSize = AVAILABLE_PACKAGE_SIZE.map(localPackage => {
        return { ...localPackage, quantity: 0 }
      })
    }

    const packages: PackageEntity[] = [{ ...defaultPackage() }]

    for (const localPackage of this.orderContent.packages) {
      for (const product of localPackage.products!) {
        if (
          packages[0]?.products?.length &&
          packages[0].products[packages[0].products.length - 1].label === product.label
        ) {
          packages[0].products[packages[0].products.length - 1].quantity += product.quantity
        } else {
          packages[0].products!.push(product)
        }
      }

      for (const packageSize of availablesPackageSize) {
        if (
          localPackage.width.value &&
          localPackage.length.value &&
          localPackage.height.value &&
          packageSize.dimension.width === localPackage.width.value.toString() &&
          packageSize.dimension.length === localPackage.length.value.toString() &&
          packageSize.dimension.height === localPackage.height.value.toString()
        ) {
          packageSize.quantity!++
        }
      }

      // if dimension doesn't exist create a custom package
      if (
        !availablesPackageSize.some(packageSize => {
          return (
            localPackage.width.value &&
            localPackage.length.value &&
            localPackage.height.value &&
            packageSize.dimension.width === localPackage.width.value.toString() &&
            packageSize.dimension.length === localPackage.length.value.toString() &&
            packageSize.dimension.height === localPackage.height.value.toString()
          )
        })
      ) {
        if (!localPackage.width.value) {
          break
        }

        availablesPackageSize.push({
          label: this.$t('page.order.ticketContent.customPackage'),
          type: AVAILABLE_PACKAGE_SIZE_TYPE.OTHER,
          value: availablesPackageSize[availablesPackageSize.length - 1].value + 1,
          unit: localPackage.length.unit,
          dimension: {
            width: localPackage.width.value?.toString() || '',
            length: localPackage.length.value?.toString() || '',
            height: localPackage.height.value?.toString() || '',
          },
          quantity: localPackage.quantity,
        })
      }
    }

    if (!availablesPackageSize.some(packageSize => packageSize.quantity! > 0)) {
      availablesPackageSize[0].quantity = 1
    }

    this.miscellaneous.availablesPackageSize = availablesPackageSize

    this.orderContent.packages = packages

    this.getTypologyItems(this.eligibility.unfilteredCarriers)
  },
  methods: {
    maxPackage(localPackage: AvailablePackageSizeType): number {
      return localPackage.quantity! + (this.nbOfProducts - this.nbOfPackage)
    },
    minProduct(product: ProductEntity): number {
      const minProduct = product.quantity - (this.nbOfProducts - this.nbOfPackage)
      return minProduct > 0 ? minProduct : 1
    },
    async getSuggestions(type: CatalogTypeEnum, value: string) {
      if (this.addProductForm.settingSuggestion || !value) {
        return
      }

      const params: { retailerId: number; cug?: string; ean?: string; label?: string } = {
        retailerId: this.senderIdentity.retailerId!,
        [type]: value,
      }

      try {
        if (Object.keys(params).length > 1) {
          const localSuggestions = await CatalogProductService.getAll(params)

          for (const suggestion of localSuggestions) {
            for (const key in suggestion) {
              if (suggestion[key] && suggestion[key] === 'NULL') {
                suggestion[key] = null
              }
            }
          }

          if (!localSuggestions.length) {
            this.addProductForm[`${type}Menu`] = false
          } else {
            this.addProductForm[`${type}Menu`] = true
          }

          this.addProductForm.suggestions = localSuggestions
        } else {
          this.addProductForm[`${type}Menu`] = false
          this.addProductForm.suggestions = []
        }
      } catch (e) {
        this.addProductForm[`${type}Menu`] = false
        this.addProductForm.suggestions = []
      }
    },
    getTypologyItems(orderEligibilities: CarrierEligibilityEntity[]) {
      let typologyItems = Array.from(Object.values(AVAILABLE_PRODUCT_TYPOLOGIES))

      if (orderEligibilities?.length) {
        typologyItems = Array.from(
          orderEligibilities.reduce(
            (acc: Set<string>, { typologies }: { typologies: string[] }) => {
              for (const typology of typologies) {
                acc.add(typology)
              }
              return acc
            },
            new Set(),
          ),
        )
      }

      this.typologyItems = typologyItems.map(value => ({
        text: this.$t(`technical.typologies.${value}`),
        value: value as string,
      }))
    },
    setDataFromSuggestion(suggestion: CatalogProduct) {
      this.addProductForm.settingSuggestion = true

      this.addProductForm.cug = suggestion.cug || ''
      this.addProductForm.ean = suggestion.ean || ''
      this.addProductForm.label = suggestion.label || ''

      this.$nextTick(() => {
        this.addProductForm.settingSuggestion = false
      })
    },
    addProduct(): void {
      if (!this.orderContent.packages[0].products) {
        this.orderContent.packages[0].products = []
      }

      const { label, type, quantity, cug, ean } = this.addProductForm

      this.orderContent.packages[0].products.push({
        label,
        type,
        quantity,
        cug,
        ean,
        value: this.orderContent.packages[0].products.length
          ? this.orderContent.packages[0].products[
              this.orderContent.packages[0].products.length - 1
            ].value! + 1
          : 1,
      })
      this.closeAddProduct()
    },
    closeAddProduct(): void {
      this.showAddDialog = false
      this.addProductForm = defaultProductForm()
      this.$nextTick(() => {
        this.$v.addProductForm.$reset()
      })
    },
    deleteProduct(): void {
      if (!this.orderContent.packages[0].products || !this.selectedProductToDelete) {
        return
      }

      this.orderContent.packages[0].products.splice(
        this.orderContent.packages[0].products.findIndex(
          product => product.value === this.selectedProductToDelete?.value,
        ),
        1,
      )

      this.selectedProductToDelete = null
      this.showDeleteDialog = false
    },
    addPackage(): void {
      // if selectedPackage that's an edit
      if (this.selectedPackage) {
        const localPackageIndex = this.miscellaneous.availablesPackageSize.findIndex(
          packageSize => packageSize.value === this.selectedPackage!.value,
        )

        this.miscellaneous.availablesPackageSize[localPackageIndex] = {
          ...this.miscellaneous.availablesPackageSize[localPackageIndex],
          dimension: {
            length: this.addPackageForm.length.toString(),
            width: this.addPackageForm.width.toString(),
            height: this.addPackageForm.height.toString(),
          },
        }

        this.closeAddPackage()
        return
      }

      this.miscellaneous.availablesPackageSize.push({
        label: this.$t('page.order.ticketContent.customPackage'),
        type: AVAILABLE_PACKAGE_SIZE_TYPE.OTHER,
        value:
          this.miscellaneous.availablesPackageSize[
            this.miscellaneous.availablesPackageSize.length - 1
          ].value + 1,
        unit: 'cm',
        dimension: {
          width: this.addPackageForm.width.toString(),
          length: this.addPackageForm.length.toString(),
          height: this.addPackageForm.height.toString(),
        },
        quantity: 1,
      })

      this.closeAddPackage()
    },
    closeAddPackage(): void {
      this.showAddPackageDialog = false
      this.addPackageForm = defaultPackageForm()
      this.$nextTick(() => {
        this.$v.addPackageForm.$reset()
      })
    },
    showEditPackage(): void {
      this.addPackageForm = {
        length: parseInt(this.selectedPackage!.dimension.length, 10),
        width: parseInt(this.selectedPackage!.dimension.width, 10),
        height: parseInt(this.selectedPackage!.dimension.height, 10),
      }
      this.showAddPackageDialog = true
    },
    deletePackage(): void {
      this.miscellaneous.availablesPackageSize.splice(
        this.miscellaneous.availablesPackageSize.findIndex(
          packageSize => packageSize.value === this.selectedPackage!.value,
        ),
        1,
      )
      this.showDeletePackageDialog = false
      this.selectedPackage = null
    },
  },
  watch: {
    'eligibility.unfilteredCarriers'(next) {
      this.getTypologyItems(next)
    },
  },
  destroyed() {
    const packages: PackageEntity[] = []
    const products: ProductEntity[] = this.products
    for (const localPackage of this.miscellaneous.availablesPackageSize) {
      for (let it = 0; it < localPackage.quantity!; it++) {
        const product = products[0]
        packages.push({
          length: { value: parseInt(localPackage.dimension.length, 10), unit: localPackage.unit! },
          width: { value: parseInt(localPackage.dimension.width, 10), unit: localPackage.unit! },
          height: { value: parseInt(localPackage.dimension.height, 10), unit: localPackage.unit! },
          weight: { value: 1, unit: 'kg' },
          quantity: 1,
          products: product
            ? [
                {
                  label: product.label,
                  ean: product.ean,
                  cug: product.cug,
                  type: product.type,
                  quantity: 1,
                },
              ]
            : [],
        })

        product.quantity--

        if (!product.quantity) {
          products.shift()
        }
      }
    }

    if (
      packages[packages.length - 1].products?.length &&
      products[0] &&
      packages[packages.length - 1].products![0].label === products[0].label
    ) {
      packages[packages.length - 1].products![0].quantity += products[0].quantity
      products.shift()
    }
    packages[packages.length - 1].products = [
      ...packages[packages.length - 1].products!,
      ...products,
    ]

    this.orderContent.packages = packages
  },
})
</script>

<style lang="scss">
#order-create-block-ticket-content {
  width: 100%;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    h2 {
      @media #{map-get($display-breakpoints, 'sm-and-down')} {
        font-size: 2.8rem !important;
      }
    }
    i {
      cursor: pointer;
    }
  }

  .products-wrapper {
    margin-top: 3rem;
    margin-bottom: 3rem;
    border: 0.1rem solid $main-lighten-74-color;
    padding: 0 2rem 0 2rem;

    .products-wrapper-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 2.5rem;
      padding-bottom: 2.5rem;

      .v-size--small .v-icon {
        margin-right: 0rem !important;
      }
    }

    .search-field {
      .v-input--is-focused {
        .mdi-magnify {
          color: $success-color !important;
        }
      }
    }

    .product-wrapper {
      padding: 2rem 0 2rem 0;
      align-items: center;
      border-bottom: 0.1rem solid $main-lighten-74-color;
      width: 100%;
    }

    .icons-and-counter-wrapper {
      display: flex;
      justify-content: space-between;

      & > * {
        margin-right: 1rem;
      }

      .delete-btn {
        color: $main-lighten-65-color;
        // margin-left: 1.6rem;
        cursor: pointer;

        &:hover {
          color: $main-color;
        }
      }

      @media #{map-get($display-breakpoints, 'sm-and-up')} {
        justify-content: flex-end;
      }
    }
  }

  .packages-wrapper {
    margin-top: 3rem;
    margin-bottom: 3rem;
    background-color: $main-lighten-80-color;
    padding: 0 2rem 0 2rem;

    .packages-wrapper-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 2.5rem;
      padding-bottom: 1.1rem;

      .v-size--small .v-icon {
        margin-right: 0rem !important;
      }
    }

    .package-wrapper {
      display: flex;
      justify-content: space-between;
      padding-top: 1.6rem;
      padding-bottom: 1.6rem;
      border-bottom: 0.1rem solid $main-lighten-74-color;
      align-items: center;

      .row {
        width: 100%;
      }

      .package-dimension {
        padding: 0.5rem 1rem 0.5rem 1rem;
        background-color: $main-lighten-74-color;
        color: $main-lighten-52-color;
        max-width: fit-content;
        border-radius: 5rem;
      }

      .add-package {
        display: flex;
        align-items: center;
        cursor: pointer;
      }

      .icons-and-counter-wrapper {
        display: flex;
        justify-content: flex-end;
        width: 100%;

        @media #{map-get($display-breakpoints, 'sm-and-down')} {
          flex-direction: row-reverse;
          margin-top: 1rem;
          justify-content: align-center;
        }
      }

      @media #{map-get($display-breakpoints, 'sm-and-down')} {
        flex-direction: column;
      }
    }
  }

  .container-padding {
    width: 100%;
    @media #{map-get($display-breakpoints, 'sm-and-up')} {
      padding-left: 3.5rem;
      padding-right: 3.5rem;
    }
  }

  .product-scroll {
    @import '../../../../styles/mixins/macScrollbar';
    overflow-y: scroll;
    overflow-x: hidden;
    max-height: calc(9.8rem * 5);
    @include setMacScrollbar('&');
  }
}

.TdC-ticketContent-add-product-dialog {
  @import '../../../../styles/mixins/macScrollbar';
  .main-dialog-content {
    max-height: calc(60vh - 8rem);
    min-height: calc(45vh - 8rem);
    overflow-y: scroll;
    overflow-x: hidden;
    @include setMacScrollbar('&');
    border-bottom: 0.1rem solid $main-lighten-74-color;
  }
}

.TdC-ticketContent-add-package-dialog {
  @import '../../../../styles/mixins/macScrollbar';
  .main-dialog-content {
    max-height: calc(30vh - 8rem);
    min-height: calc(30vh - 8rem);
    overflow-y: scroll;
    overflow-x: hidden;
    @include setMacScrollbar('&');
    border-bottom: 0.1rem solid $main-lighten-74-color;
  }

  .dimension-wrapper {
    margin-top: 4rem;
    display: flex;
    margin-bottom: 2rem;

    @media #{map-get($display-breakpoints, 'sm-and-down')} {
      display: block;
    }

    .mp-textfield {
      padding-right: 2rem !important;

      @media #{map-get($display-breakpoints, 'sm-and-down')} {
        padding-right: 0 !important;
      }

      &:last-of-type {
        padding-right: 0 !important;
      }
    }
  }
}
</style>
