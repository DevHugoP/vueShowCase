<template>
  <div class="create-order-packages-product" v-if="hasLoaded">
    <collapse
      :id="`packages-${index}`"
      :title="
        `${$t('common.package')} ${index + 1} (${getLabelFromAvailablesPackageSize(packageSize)})`
      "
      icon="mdi-package-variant-closed"
      :open.sync="isPackageOpen"
      :appendIcons="['mdi-trash-can-outline']"
      @appendIcon0="showDeletePackageDialog = true"
    >
      <template #content>
        <v-row no-gutters class="mt-5">
          <v-col cols="12">
            <mp-select
              :label="`${$t('page.typicalWeek.type.packageType')} *`"
              dataId="order-create-orderContent-type"
              v-model="orderContent.packages[index].type"
              :items="getTypes"
              @input="validations.orderContent.packages.$each[index].type.$touch()"
              @blur="validations.orderContent.packages.$each[index].type.$touch()"
              :errors="getModelErrors(validations.orderContent.packages.$each[index].type)"
              :isDirty="validations.orderContent.packages.$each[index].type.$dirty"
            />
          </v-col>
        </v-row>
        <v-row no-gutters :class="`package-size-wrapper${isOther ? '' : ' mb-5'}`">
          <header class="radio-group-header regular12">
            <span>
              {{ $t('page.createOrder.steps.step2.packageForm.size') }}
              <v-chip small :class="`ship${$vuetify.breakpoint.smAndDown ? ' mt-2' : ''}`">
                {{
                  $t('page.createOrder.steps.step2.packageForm.dimension', {
                    ...getDimension,
                  })
                }}
              </v-chip>
            </span>
          </header>

          <mp-radio-group
            v-if="packageSize && !isPackageDisabled"
            class="radio-group-custom"
            row
            dataId="order-create-orderContent-package-size"
            v-model="packageSize"
            :errors="[]"
            :radioValues="availablesPackageSize"
            :disabled="isPackageDisabled"
          />
        </v-row>

        <v-row no-gutters v-if="isOther">
          <v-col cols="12" class="dimension-wrapper">
            <mp-textfield
              :label="`${$t('page.createOrder.steps.step2.productForm.length')} *`"
              type="number"
              :class="{ 'pb-4': $vuetify.breakpoint.xsOnly }"
              :value="orderContent.packages[index].length.value"
              @input="
                ;(orderContent.packages[index].length.value = parseFloat($event)),
                  updateFirstCollapseHeight()
              "
              @blur="validations.orderContent.packages.$each[index].length.value.$touch()"
              :errors="getModelErrors(validations.orderContent.packages.$each[index].length.value)"
              :isDirty="validations.orderContent.packages.$each[index].length.value.$dirty"
              dataId="order-create-orderContent-package-length"
            />

            <mp-textfield
              :label="`${$t('page.createOrder.steps.step2.productForm.width')} *`"
              type="number"
              :class="{ 'pb-4': $vuetify.breakpoint.xsOnly }"
              :value="orderContent.packages[index].width.value"
              @input="
                ;(orderContent.packages[index].width.value = parseFloat($event)),
                  updateFirstCollapseHeight()
              "
              @blur="validations.orderContent.packages.$each[index].width.value.$touch()"
              :errors="getModelErrors(validations.orderContent.packages.$each[index].width.value)"
              :isDirty="validations.orderContent.packages.$each[index].width.value.$dirty"
              dataId="order-create-orderContent-package-width"
            />

            <mp-textfield
              :label="`${$t('page.createOrder.steps.step2.productForm.height')} *`"
              type="number"
              :value="orderContent.packages[index].height.value"
              @input="
                ;(orderContent.packages[index].height.value = parseFloat($event)),
                  updateFirstCollapseHeight()
              "
              @blur="validations.orderContent.packages.$each[index].height.value.$touch()"
              :errors="getModelErrors(validations.orderContent.packages.$each[index].height.value)"
              :isDirty="validations.orderContent.packages.$each[index].height.value.$dirty"
              dataId="order-create-orderContent-package-height"
            />
          </v-col>
        </v-row>

        <v-row no-gutters class="mb-5 footprint-wrapper">
          <v-col cols="12">
            <mp-checkbox-new
              :label="$t('page.order.packages.fillFootprint')"
              v-model="hasFootprint"
              :hide-details="true"
              data-id="order-create-orderContent-hasFootprint"
              :disabled="
                Boolean(
                  orderContent.packages[index].attributes &&
                    orderContent.packages[index].attributes.footprint.value,
                ) ||
                  Boolean(
                    orderContent.packages[index].attributes &&
                      orderContent.packages[index].attributes.footprint.unit,
                  )
              "
            />

            <div
              :class="`mt-7 ${$vuetify.breakpoint.smAndUp ? 'd-flex' : 'd-block'}`"
              v-if="hasFootprint"
            >
              <mp-textfield
                :label="$t('page.order.packages.footprint')"
                v-model="orderContent.packages[index].attributes.footprint.value"
                type="number"
                dataId="order-create-orderContent-footprint-value"
                @input="
                  validations.orderContent.packages.$each[index].attributes.footprint.value.$touch()
                "
                @blur="
                  validations.orderContent.packages.$each[index].attributes.footprint.value.$touch()
                "
                :errors="
                  getModelErrors(
                    validations.orderContent.packages.$each[index].attributes.footprint.value,
                  )
                "
                :isDirty="
                  validations.orderContent.packages.$each[index].attributes.footprint.value.$dirty
                "
              />

              <mp-select
                class="footprint-unit"
                :label="$t('common.unit.base')"
                clearable
                dataId="order-create-orderContent-footprint-unit"
                v-model="orderContent.packages[index].attributes.footprint.unit"
                :items="getUnits"
                @input="
                  validations.orderContent.packages.$each[index].attributes.footprint.unit.$touch()
                "
                @blur="
                  validations.orderContent.packages.$each[index].attributes.footprint.unit.$touch()
                "
                :errors="
                  getModelErrors(
                    validations.orderContent.packages.$each[index].attributes.footprint.unit,
                  )
                "
                :isDirty="
                  validations.orderContent.packages.$each[index].attributes.footprint.unit.$dirty
                "
                :attach="`#order-create-orderContent-footprint-unit-${index}`"
                :dropdownId="`order-create-orderContent-footprint-unit-${index}`"
              />
            </div>
          </v-col>
        </v-row>

        <v-row no-gutters class="mb-5">
          <v-col cols="12" class="counter-weight-wrapper">
            <mp-counter
              v-model="orderContent.packages[index].quantity"
              :title="`${$t('common.numberOfPackage')} *`"
              dataId="order-create-orderContent-package-counter"
            />

            <mp-textfield
              class="weight"
              :label="`${$t('page.createOrder.steps.step2.productForm.weight')} *`"
              type="number"
              :suffix="$t('common.unit.kilogram')"
              v-model="orderContent.packages[index].weight.value"
              @input="validations.orderContent.packages.$each[index].weight.value.$touch()"
              @blur="validations.orderContent.packages.$each[index].weight.value.$touch()"
              :errors="getModelErrors(validations.orderContent.packages.$each[index].weight.value)"
              :isDirty="validations.orderContent.packages.$each[index].weight.value.$dirty"
              dataId="order-create-orderContent-package-weight"
            />
          </v-col>
        </v-row>

        <v-row no-gutters>
          <v-col cols="12" class="product-package-actions-wrapper">
            <mp-button
              :dataId="`order-create-orderContent-packages-${index}-delete`"
              :text="$t('action.delete.base')"
              format="link"
              linkColor="black"
              @click="showDeletePackageDialog = true"
            />

            <mp-button
              :dataId="`order-create-orderContent-packages-${index}-addProduct`"
              icon="plus"
              :text="$t('action.add.product')"
              format="primary"
              @click="
                showProduct = true
                isPackageOpen = false
                !orderContent.packages[index].products.length ? addProduct() : null
              "
              :disabled="isInvalid || isPackageDisabled"
            />
          </v-col>
        </v-row>

        <v-row no-gutters class="package-more-detail-wrapper">
          <v-col cols="12">
            <v-row no-gutters class="package-more-detail">
              <v-col cols="12" class="package-more-detail-header">
                <span>
                  {{ $t('page.order.packages.showReferences') }}
                </span>
                <mp-switch
                  dataId="order-create-orderContent-package-show-reference"
                  :value="showReferences"
                  @input="showReferences = $event"
                />
              </v-col>

              <v-col cols="12">
                <mp-chips-wrapper
                  v-if="showReferences && getReferencesChips.length"
                  class="mt-3"
                  v-model="selectedReference"
                  :chips="getReferencesChips"
                  :dataId="`order-create-orderContent-package-${index}-reference-chips-wrapper`"
                  :maxChips="4"
                />
              </v-col>

              <v-col
                cols="12"
                v-if="
                  showReferences && orderContent.packages[index].references[selectedReference.value]
                "
              >
                <mp-textfield
                  class="mt-3"
                  :dataId="`order-create-orderContent-package-${index}-reference`"
                  :label="`${$t('page.order.packages.reference')} *`"
                  v-model="
                    orderContent.packages[index].references[selectedReference.value].reference
                  "
                />
              </v-col>

              <v-col
                cols="12"
                v-if="
                  showReferences &&
                    orderContent.packages[index].references[selectedReference.value].barcode
                "
              >
                <mp-textfield
                  :dataId="`order-create-orderContent-package-${index}-barcode`"
                  :label="$t('page.order.packages.barcode')"
                  v-model="
                    orderContent.packages[index].references[selectedReference.value].barcode.value
                  "
                />
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </template>
    </collapse>

    <collapse
      :id="`packages-${index}-product`"
      title="produits"
      :open.sync="isProductOpen"
      v-if="showProduct"
    >
      <template #title>
        <div @click="openCollapse()" class="chips-wrapper-wrapper">
          <mp-chips-wrapper
            class="d-flex"
            :canAdd="!isPackageDisabled"
            :chips="productsChips"
            v-model="selectedProduct"
            :dataId="`order-create-orderContent-create-packages-${index}-products`"
            @addChip="addProduct()"
          />
        </div>
      </template>
      <template #content>
        <div
          class="product-form-wrapper"
          v-if="selectedProduct && orderContent.packages[index].products[getProductIndex]"
        >
          <v-menu
            :id="`label-${getProductIndex}`"
            offset-y
            v-model="selectedProduct.labelMenu"
            content-class="create-order-product-menu-custom-offset-y"
            :key="`label-${selectedProduct.value}`"
          >
            <template v-slot:activator="{}">
              <div>
                <mp-textfield
                  class="mb-5"
                  :label="`${$t('page.createOrder.steps.step2.productForm.description')}`"
                  type="text"
                  :key="`packages-${index}-products-${getProductIndex}`"
                  v-model="orderContent.packages[index].products[getProductIndex].label"
                  @input="
                    validations.orderContent.packages.$each[index].products.$each[
                      getProductIndex
                    ].label.$touch()
                    getSuggestions(CatalogTypeEnum.label, $event)
                  "
                  @blur="
                    validations.orderContent.packages.$each[index].products.$each[
                      getProductIndex
                    ].label.$touch()
                  "
                  :errors="
                    getModelErrors(
                      validations.orderContent.packages.$each[index].products.$each[getProductIndex]
                        .label,
                    )
                  "
                  :isDirty="
                    validations.orderContent.packages.$each[index].products.$each[getProductIndex]
                      .label.$dirty
                  "
                  dataId="order-create-orderContent-formProduct-description"
                />
              </div>
            </template>
            <v-list>
              <v-list-item
                v-for="(suggestion, index) in selectedProduct.suggestions"
                :key="`catalog-suggestions-label-${index}`"
                class="suggestion-wrapper"
                @click="setDataFromSuggestion(suggestion)"
              >
                <v-list-item-title>{{ suggestion.label }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>

          <mp-select
            class="mb-5"
            dataId="order-create-orderContent-formProduct-typology"
            :label="`${$t('page.createOrder.steps.step2.productForm.typology')} *`"
            :items="typologyItems"
            v-model="orderContent.packages[index].products[getProductIndex].type"
            @input="
              validations.orderContent.packages.$each[index].products.$each[
                getProductIndex
              ].type.$touch()
            "
            @blur="
              validations.orderContent.packages.$each[index].products.$each[
                getProductIndex
              ].type.$touch()
            "
            :errors="
              getModelErrors(
                validations.orderContent.packages.$each[index].products.$each[getProductIndex].type,
              )
            "
            :isDirty="
              validations.orderContent.packages.$each[index].products.$each[getProductIndex].type
                .$dirty
            "
            :attach="`#packages-${index}-products-${getProductIndex}`"
            :dropdownId="`packages-${index}-products-${getProductIndex}`"
          />

          <mp-counter
            class="mb-7"
            v-model="orderContent.packages[index].products[getProductIndex].quantity"
            :title="`${$t('page.detailOrder.packagesAndProducts.quantity')} *`"
            dataId="order-create-orderContent-formProduct-counter"
          />

          <div class="more-detail mb-5">
            <div class="more-detail-header">
              <span>{{ $t('common.fillMoreDetail') }}</span>
              <mp-switch
                dataId="order-create-orderContent-formProduct-show-more"
                v-model="selectedProduct.showMore"
                @input="updateCollapseHeight()"
              />
            </div>

            <div class="more-detail-content" v-if="selectedProduct.showMore">
              <v-row no-gutters>
                <v-col cols="12" md="4">
                  <div
                    :id="`cug-${getProductIndex}-list`"
                    class="create-order-product-menu-custom-offset-y-wrapper"
                  >
                    <v-menu
                      :id="`cug-${getProductIndex}`"
                      offset-y
                      v-model="selectedProduct.cugMenu"
                      content-class="create-order-product-menu-custom-offset-y"
                      :key="`cug-${selectedProduct.value}`"
                      :attach="`#cug-${getProductIndex}-list`"
                    >
                      <template v-slot:activator="{}">
                        <div>
                          <mp-textfield
                            :label="$t('page.createOrder.steps.step2.productForm.CUG')"
                            type="number"
                            v-model="orderContent.packages[index].products[getProductIndex].cug"
                            @input="
                              validations.orderContent.packages.$each[index].products.$each[
                                getProductIndex
                              ].cug.$touch()
                              getSuggestions(CatalogTypeEnum.cug, $event)
                            "
                            @blur="
                              validations.orderContent.packages.$each[index].products.$each[
                                getProductIndex
                              ].cug.$touch()
                            "
                            :errors="
                              getModelErrors(
                                validations.orderContent.packages.$each[index].products.$each[
                                  getProductIndex
                                ].cug,
                              )
                            "
                            :isDirty="
                              validations.orderContent.packages.$each[index].products.$each[
                                getProductIndex
                              ].cug.$dirty
                            "
                            dataId="order-create-orderContent-formProduct-CUG"
                          />
                        </div>
                      </template>
                      <v-list>
                        <v-list-item
                          v-for="(suggestion, suggestionIndex) in selectedProduct.suggestions"
                          :key="`catalog-suggestions-CUG-${suggestionIndex}`"
                          class="suggestion-wrapper"
                          @click="setDataFromSuggestion(suggestion)"
                        >
                          <v-list-item-title>{{ suggestion.cug }}</v-list-item-title>
                        </v-list-item>
                      </v-list>
                    </v-menu>
                  </div>
                </v-col>

                <v-col cols="12" md="7" offset="0" offset-md="1">
                  <div
                    :id="`ean-${getProductIndex}-list`"
                    class="create-order-product-menu-custom-offset-y-wrapper"
                  >
                    <v-menu
                      :id="`ean-${getProductIndex}`"
                      offset-y
                      v-model="selectedProduct.eanMenu"
                      content-class="create-order-product-menu-custom-offset-y"
                      :key="`ean-${selectedProduct.value}`"
                      :attach="`#ean-${getProductIndex}-list`"
                    >
                      <template v-slot:activator="{}">
                        <div>
                          <mp-textfield
                            :label="$t('page.createOrder.steps.step2.productForm.EAN')"
                            type="text"
                            v-model="orderContent.packages[index].products[getProductIndex].ean"
                            @input="
                              validations.orderContent.packages.$each[index].products.$each[
                                getProductIndex
                              ].ean.$touch()
                              getSuggestions(CatalogTypeEnum.ean, $event)
                            "
                            @blur="
                              validations.orderContent.packages.$each[index].products.$each[
                                getProductIndex
                              ].ean.$touch()
                            "
                            :errors="
                              getModelErrors(
                                validations.orderContent.packages.$each[index].products.$each[
                                  getProductIndex
                                ].ean,
                              )
                            "
                            :isDirty="
                              validations.orderContent.packages.$each[index].products.$each[
                                getProductIndex
                              ].ean.$dirty
                            "
                            dataId="order-create-orderContent-formProduct-EAN"
                          />
                        </div>
                      </template>
                      <v-list>
                        <v-list-item
                          v-for="(suggestion, suggestionIndex) in selectedProduct.suggestions"
                          :key="`catalog-suggestions-EAN-${suggestionIndex}`"
                          class="suggestion-wrapper"
                          @click="setDataFromSuggestion(suggestion)"
                        >
                          <v-list-item-title>{{ suggestion.ean }}</v-list-item-title>
                        </v-list-item>
                      </v-list>
                    </v-menu>
                  </div>
                </v-col>
              </v-row>
            </div>
          </div>

          <div class="products-product-action-wrapper">
            <mp-button
              :dataId="`order-create-orderContent-packages-${index}-products-${getProductIndex}`"
              @click="
                showDeleteProductDialog = true
                productIndex = getProductIndex
              "
              icon="trash-can-outline"
              format="link"
              linkColor="red"
              :text="$t('action.delete.product')"
            />
          </div>
        </div>
      </template>
    </collapse>

    <mp-dialog-confirmation
      v-if="showDeletePackageDialog"
      dataId="order-create-orderContent-package-delete"
      :textContent="$t('page.order.packages.warningDeletePackage')"
      @close="showDeletePackageDialog = false"
      @submit="deletePackage()"
      color="error"
      :header="{
        icon: 'mdi-trash-can-outline',
        isColorBackground: false,
        iconClose: 'mdi-close',
      }"
      :btnCancel="{ text: $t('action.cancel.base'), format: 'link', linkColor: 'black' }"
      :btnValidation="{ text: $t('action.delete.base'), format: 'error' }"
      :btnToColumn="$vuetify.breakpoint.smAndDown"
    />

    <mp-dialog-confirmation
      v-if="showDeleteProductDialog"
      dataId="order-create-orderContent-product-delete"
      :textContent="$t('page.order.packages.warningDeleteProduct')"
      @close="showDeleteProductDialog = false"
      @submit="deleteProduct(productIndex)"
      color="error"
      :header="{ icon: 'mdi-trash-can-outline', isColorBackground: false, iconClose: 'mdi-close' }"
      :btnCancel="{ text: $t('action.cancel.base'), format: 'link', linkColor: 'black' }"
      :btnValidation="{ text: $t('action.delete.base'), format: 'error' }"
      :btnToColumn="$vuetify.breakpoint.smAndDown"
    />
  </div>
</template>

<script lang="ts">
import {
  AvailablePackageSizeType,
  CreateOrderProductSelected,
  SelectItem,
  CatalogTypeEnum,
  CatalogProduct,
  PackageEntity,
  ProductEntity,
  BarcodeFormat,
  BarcodeType,
  FootprintType,
  PackageType,
} from '@/types'
import { mapActions, mapGetters } from 'vuex'
import { validationMixin } from '@/mixins'

import collapse from '@/components/lightCollapse/lightCollapse.vue'
import mpCounter from '@/components/form/counter/counter.vue'

import { AVAILABLE_PACKAGE_SIZE_TYPE } from '@/constants'

import CatalogProductService from '@/services/catalogProduct/CatalogProductService'
import convert from 'convert-units'
import mixins from 'vue-typed-mixins'
import { CreateOrderStateOrderContent } from '@/store/modules/createOrder/orderContent/types'
import { defaultProduct } from '@/store/modules/createOrder/orderContent'
import { CreateOrderStateScan } from '@/store/modules/createOrder/scan/types'
import { CreateOrderStateSenderIdentity } from '@/store/modules/createOrder/senderIdentity/types'

export default mixins(validationMixin).extend({
  name: 'create-order-packages-product',
  components: {
    collapse,
    mpCounter,
  },
  props: {
    availablesPackageSize: {
      type: Array as () => AvailablePackageSizeType[],
      required: true,
    },
    typologyItems: {
      type: Array as () => SelectItem[],
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
    isEditing: {
      type: Boolean,
      required: true,
    },
    validations: {
      type: Object,
      required: true,
    },
    orderContent: {
      type: Object as () => CreateOrderStateOrderContent,
      required: true,
    },
  },
  data: () => ({
    packageSize: null as number | null,
    hasLoaded: false,
    selectedProduct: null as CreateOrderProductSelected | null,
    isProductOpen: true,
    isPackageOpen: true,
    isPackageDisabled: false,
    settingSuggestion: false,
    CatalogTypeEnum,
    showProduct: false,
    productsChips: [] as CreateOrderProductSelected[],
    showDeletePackageDialog: false,
    showDeleteProductDialog: false,
    productIndex: -1,
    showReferences: false,
    currentReference: '',
    selectedReference: { value: 0 },
    hasFootprint: false,
  }),
  computed: {
    ...mapGetters({
      isOnePackageInvalid: 'createOrder/orderContent/isOnePackageInvalid',
      isPackagesInvalid: 'createOrder/orderContent/isPackagesInvalid',
    }),
    scan(): CreateOrderStateScan {
      return this.$store.getters['createOrder/scan/scan']
    },
    senderIdentity(): CreateOrderStateSenderIdentity {
      return this.$store.getters['createOrder/senderIdentity/senderIdentity']
    },
    getDimension(): { height?: string; width?: string; length?: string; unit?: string } {
      if (!this.packageSize) {
        return {}
      }

      return {
        height: this.orderContent.packages[this.index].height.value?.toString() || '',
        width: this.orderContent.packages[this.index].width.value?.toString() || '',
        length: this.orderContent.packages[this.index].length.value?.toString() || '',
        unit: this.orderContent.packages[this.index].height.unit,
      }
    },
    isInvalid(): boolean {
      return (this.isOnePackageInvalid as any)(this.index)
    },
    localPackage(): PackageEntity {
      return this.orderContent.packages[this.index]
    },
    getProductIndex(): number {
      if (!this.selectedProduct) {
        return 0
      }
      return this.orderContent.packages[this.index].products!.findIndex(
        product => product.value === this.selectedProduct!.value,
      )
    },
    isOther(): boolean {
      return (
        this.availablesPackageSize.find(size => size.value === this.packageSize)?.type ===
        AVAILABLE_PACKAGE_SIZE_TYPE.OTHER
      )
    },
    getCurrentProduct(): ProductEntity {
      return this.orderContent.packages[this.index].products![this.getProductIndex]
    },
    getReferencesChips(): Array<{
      text: string
      value: number
      errorIcon?: string
      successIcon?: string
    }> {
      if (!this.orderContent.packages[this.index].quantity) {
        return []
      }

      return Array(this.orderContent.packages[this.index].quantity || 1)
        .fill({})
        .map((value, index) => {
          const reference = this.orderContent.packages[this.index].references?.[index]?.reference
          return {
            text: this.$t('page.order.packages.number', { number: index + 1 }),
            value: index,
            ...(reference
              ? { successIcon: 'mdi-check-circle' }
              : { errorIcon: 'mdi-close-circle' }),
          }
        })
    },
    getTypes(): SelectItem[] {
      return Object.values(PackageType).map(value => ({
        text: this.$t(`page.order.packages.types.${value}`),
        value,
      }))
    },
    getUnits(): SelectItem[] {
      return Object.values(FootprintType).map(value => ({
        text: this.$t(`page.order.packages.footprintUnit.${value}`),
        value,
      }))
    },
  },
  mounted() {
    this.orderContent.packages[this.index].products = this.orderContent.packages[
      this.index
    ].products!.map(product => {
      return {
        ...product,
        value: product.value || Math.random(),
      }
    })

    this.updateChips()

    if (this.isEditing || (!this.isEditing && !this.isPackagesInvalid)) {
      if (!this.orderContent.packages[this.index].type) {
        this.orderContent.packages[this.index].type = PackageType.PACKAGE
      }

      // Package size
      const dimension = {
        height: this.orderContent.packages[this.index].height.value?.toString() || '',
        width: this.orderContent.packages[this.index].width.value?.toString() || '',
        length: this.orderContent.packages[this.index].length.value?.toString() || '',
      }

      const size = this.availablesPackageSize.find(
        localSize =>
          localSize.dimension.width === dimension.width &&
          localSize.dimension.length === dimension.length &&
          localSize.dimension.height === dimension.height,
      )

      if (!dimension.height && !dimension.width && !dimension.length) {
        this.packageSize = 1

        this.updatePackage(0)

        this.$nextTick(() => {
          this.hasLoaded = true
        })

        return
      } else if (size) {
        this.packageSize = size.value
      } else {
        this.packageSize =
          this.availablesPackageSize.find(
            localSize => localSize.type === AVAILABLE_PACKAGE_SIZE_TYPE.OTHER,
          )?.value || null
      }

      // Weight
      this.orderContent.packages[this.index].weight.value = convert(
        this.orderContent.packages[this.index].weight.value || undefined,
      )
        .from(this.orderContent.packages[this.index].weight.unit as any)
        .to('kg')

      // Unit to Kg
      this.orderContent.packages[this.index].weight.unit = 'kg'

      // Product
      this.showProduct = true
      this.selectedProduct = this.productsChips[0]

      setTimeout(() => {
        this.isProductOpen = false
        this.isPackageOpen = false
      }, 250)

      if (
        this.orderContent.packages[this.index].attributes?.footprint?.unit &&
        this.orderContent.packages[this.index].attributes?.footprint?.value
      ) {
        this.hasFootprint = true
      }
    } else {
      this.packageSize = 1
      this.orderContent.packages[this.index].type = PackageType.PACKAGE
    }

    if (this.orderContent.packages[this.index].references?.length) {
      this.showReferences = true
    }

    this.$nextTick(() => {
      if (this.scan.ticket) {
        setTimeout(() => {
          this.showProduct = true
          this.isPackageOpen = false
        }, 250)
      }

      this.hasLoaded = true

      if (this.orderContent.packages[this.index].references) {
        this.orderContent.packages[this.index].references = this.orderContent.packages[
          this.index
        ].references!.map(({ reference, barcode }) => ({
          reference: reference || '',
          barcode: barcode || {
            value: '',
            format: BarcodeFormat.EAN128,
            type: BarcodeType.BARCODE,
          },
        }))
      }
    })
  },
  methods: {
    ...mapActions({
      filterEligibleCarriers: 'createOrder/filterEligibleCarriers',
    }),
    addProduct() {
      this.orderContent.packages[this.index].products!.push({
        ...defaultProduct(),
        type: this.typologyItems[0].value as string,
        label: `${this.$t('common.product')} ${this.orderContent.packages[this.index].products!
          .length + 1}`,
      })

      this.validations.orderContent.packages.$each[this.index].products.$each[
        this.orderContent.packages[this.index].products!.length - 1
      ].$touch()
    },
    openCollapse() {
      if (!this.isProductOpen) {
        this.isProductOpen = true
      }
    },
    updateFirstCollapseHeight() {
      this.isPackageOpen = false
      this.$nextTick(() => {
        this.isPackageOpen = true
      })
    },
    updateCollapseHeight() {
      this.isProductOpen = false
      this.$nextTick(() => {
        this.isProductOpen = true
      })
    },
    async getSuggestions(type: CatalogTypeEnum, value: string) {
      if (this.getProductIndex) {
        return
      }
      if (this.settingSuggestion || !value) {
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
              if (suggestion[key]) {
                if (suggestion[key] === 'NULL') {
                  suggestion[key] = null
                }
              }
            }
          }

          if (!localSuggestions.length) {
            this.selectedProduct![`${type}Menu`] = false
          } else {
            this.selectedProduct![`${type}Menu`] = true
          }

          this.selectedProduct!.suggestions = localSuggestions
        } else {
          this.selectedProduct![`${type}Menu`] = false
          this.selectedProduct!.suggestions = []
        }
      } catch (e) {
        this.selectedProduct![`${type}Menu`] = false
        this.selectedProduct!.suggestions = []
      }
    },
    setDataFromSuggestion(suggestion: CatalogProduct) {
      this.settingSuggestion = true

      const localPackage = this.orderContent.packages[this.index]
      const product = this.orderContent.packages[this.index].products![
        this.selectedProduct!.productIndex
      ]

      product.cug = suggestion.cug || ''
      product.ean = suggestion.ean || ''
      product.label = suggestion.label || ''

      if (product.cug || product.ean) {
        this.selectedProduct!.showMore = true
        const currentProductChip = this.productsChips.find(
          productChip => productChip.value === product.value,
        )

        if (currentProductChip) {
          currentProductChip.showMore = true
        }

        this.updateCollapseHeight()
      }

      this.$nextTick(() => {
        this.settingSuggestion = false
        this.isPackageOpen = true
        this.packageSize =
          this.availablesPackageSize.findIndex(
            size => size.type === AVAILABLE_PACKAGE_SIZE_TYPE.OTHER,
          ) + 1

        this.isPackageDisabled = true

        this.$nextTick(() => {
          localPackage.width = {
            unit: 'cm',
            value: suggestion.width || ('' as any),
          }

          localPackage.height = {
            unit: 'cm',
            value: suggestion.height || ('' as any),
          }

          localPackage.length = {
            unit: 'cm',
            value: suggestion.length || ('' as any),
          }

          localPackage.weight = {
            unit: 'kg',
            value: suggestion.weight || ('' as any),
          }
        })
      })
    },
    getLabelFromAvailablesPackageSize(value: number) {
      return (
        this.availablesPackageSize.find(
          availablePackageSize => availablePackageSize.value === value,
        )?.label || ''
      )
    },
    deletePackage() {
      this.orderContent.packages.splice(this.index, 1)
      this.showDeletePackageDialog = false
    },
    deleteProduct(productIndex: number) {
      this.orderContent.packages[this.index].products!.splice(productIndex, 1)
      this.showDeleteProductDialog = false

      if (!this.orderContent.packages[this.index].products?.length) {
        this.$emit('destroyPackage', this.index)

        this.$nextTick(() => {
          // this.updateFirstPackage()
        })
      }
    },
    truncate(label: string, productIndex: number) {
      return productIndex > 2
        ? label
        : label.length > 9
        ? `${label.slice(0, 9)}...`
        : label.slice(0, 9)
    },
    updateChips() {
      this.productsChips = this.orderContent.packages[this.index].products!.map(
        (product, productIndex) => {
          return {
            ...product,
            value: product.value!,
            text: product.label
              ? this.truncate(product.label || '', productIndex)
              : `${this.$t('common.product')} ${productIndex + 1}`,
            productIndex,
            showMore:
              this.isEditing || (!this.isEditing && !this.isPackagesInvalid)
                ? Boolean(product.ean || product.cug)
                : false,
            cugMenu: false,
            eanMenu: false,
            labelMenu: false,
            suggestions: [],
          }
        },
      )
    },
    handleEnterReference() {
      this.orderContent.packages[this.index].references!.push({ reference: this.currentReference })
      this.currentReference = ''

      this.isPackageOpen = false
      this.$nextTick(() => {
        this.isPackageOpen = true
      })
    },
    updatePackage(index: number) {
      const unit = this.availablesPackageSize[index].unit || 'cm'
      const dimension = this.availablesPackageSize[index].dimension

      this.orderContent.packages[this.index].width = {
        value: this.isOther ? null : parseFloat(dimension.width),
        unit,
      }

      this.orderContent.packages[this.index].height = {
        value: this.isOther ? null : parseFloat(dimension.height),
        unit,
      }

      this.orderContent.packages[this.index].length = {
        value: this.isOther ? null : parseFloat(dimension.length),
        unit,
      }
    },
  },
  watch: {
    packageSize(next) {
      if (
        !next ||
        (!this.hasLoaded && (this.isEditing || (!this.isEditing && !this.isPackagesInvalid)))
      ) {
        return
      }

      this.updatePackage(next - 1)
    },
    'localPackage.products': {
      deep: true,
      handler(next: ProductEntity[]) {
        this.productsChips = next.map((product, productIndex) => {
          const currentProduct = this.productsChips.find(
            productChips => productChips.value === product.value,
          )

          if (currentProduct) {
            return {
              ...currentProduct,
              text: product.label
                ? this.truncate(product.label || '', productIndex)
                : `${this.$t('common.product')} ${productIndex + 1}`,
              productIndex,
              ...product,
            }
          }
          return {
            ...product,
            value: product.value!,
            text: product.label
              ? this.truncate(product.label || '', productIndex)
              : `${this.$t('common.product')} ${productIndex + 1}`,
            productIndex,
            showMore: false,
            cugMenu: false,
            eanMenu: false,
            labelMenu: false,
            suggestions: [],
          }
        })
      },
    },
    'localPackage.quantity'(next) {
      if (!this.orderContent.packages[this.index].references || !this.showReferences) {
        return
      }

      if (this.orderContent.packages[this.index].references!.length < next) {
        const newReferences = Array(
          next - this.orderContent.packages[this.index].references!.length,
        )
          .fill({})
          .map(() => ({
            reference: '',
            barcode: {
              value: '',
              format: BarcodeFormat.EAN128,
              type: BarcodeType.BARCODE,
            },
          }))
        this.orderContent.packages[this.index].references!.push(...newReferences)
      }

      if (this.orderContent.packages[this.index].references!.length > next) {
        this.orderContent.packages[this.index].references!.splice(next, 1)
      }
    },
    selectedProduct() {
      if (!this.hasLoaded) {
        return
      }

      this.$nextTick(() => {
        this.updateCollapseHeight()
      })
    },
    isOther() {
      this.isPackageOpen = false
      this.$nextTick(() => {
        this.isPackageOpen = true
      })
    },
    getCurrentProduct: {
      deep: true,
      handler() {
        if (this.hasLoaded && !this.isPackagesInvalid) {
          this.filterEligibleCarriers({
            stepNumber: parseInt(this.$route.query.stepNumber as string, 10),
          })
        }
      },
    },
    getPackageEligibilityData: {
      deep: true,
      handler() {
        if (this.hasLoaded && !this.isPackagesInvalid) {
          this.filterEligibleCarriers({
            stepNumber: parseInt(this.$route.query.stepNumber as string, 10),
          })
        }
      },
    },
    showReferences(next: boolean) {
      if (
        next &&
        this.orderContent.packages[this.index].references?.length !==
          this.orderContent.packages[this.index].quantity
      ) {
        this.orderContent.packages[this.index].references = Array(
          this.orderContent.packages[this.index].quantity,
        )
          .fill({})
          .map(() => ({
            reference: '',
            barcode: {
              value: '',
              format: BarcodeFormat.EAN128,
              type: BarcodeType.BARCODE,
            },
          }))
      }

      if (!next) {
        this.orderContent.packages[this.index].references = []
      }

      this.isPackageOpen = false
      this.$nextTick(() => {
        this.isPackageOpen = true
      })
    },
    hasFootprint(next) {
      if (!next) {
        this.validations.orderContent.packages.$each[this.index].attributes.footprint.$reset()
      }
      this.isPackageOpen = false
      this.$nextTick(() => {
        this.isPackageOpen = true
      })
    },
  },
})
</script>

<style lang="scss">
@import '../../../../../styles/mixins/macScrollbar';

.create-order-product-menu-custom-offset-y-wrapper {
  position: relative;
}
.create-order-product-menu-custom-offset-y {
  margin-top: -2rem;
}

.create-order-packages-product {
  .counter-weight-wrapper {
    display: flex;
    align-items: baseline;
    min-height: 8rem;

    @media #{map-get($display-breakpoints, 'sm-and-down')} {
      flex-direction: column;
    }

    .weight {
      align-self: flex-end;
      padding-left: 2rem !important;
      max-width: 16rem;

      @media #{map-get($display-breakpoints, 'sm-and-down')} {
        align-self: flex-start;
        margin-top: 2rem !important;
        padding-left: 0 !important;
        max-width: 100%;
      }
    }
  }

  .package-size-wrapper {
    @media #{map-get($display-breakpoints, 'sm-and-down')} {
      .v-input--radio-group.v-input--radio-group--row .v-radio {
        margin-top: 1.7rem !important;
      }
    }

    @media #{map-get($display-breakpoints, 'xs-only')} {
      .v-input--radio-group__input {
        display: flex;
        justify-content: space-evenly;
      }
    }

    .radio-group-header {
      color: $main-lighten-52-color;
      margin-bottom: 1.7rem;

      .ship {
        color: $main-lighten-52-color;
        background-color: $main-lighten-80-color;
        height: fit-content;

        .v-chip__content {
          white-space: break-spaces;
        }
      }
    }

    flex-direction: column;
    margin-top: 1rem !important;

    @media #{map-get($display-breakpoints, 'xs-only')} {
      margin-top: 0 !important;
    }

    .radio-group-custom {
      .mp-radio.v-item--active {
        .primary--text {
          color: $success-color !important;
          caret-color: $success-color !important;
        }
      }

      label {
        @include regular-16();
        color: $main-color !important;
      }
    }
  }

  .chips-wrapper-wrapper {
    overflow: auto;
    @include setMacScrollbar('&');
  }

  .product-form-wrapper {
    .more-detail {
      background-color: $main-lighten-80-color;
      padding: 2.2rem 1.9rem 2.1rem 2rem;

      .more-detail-header {
        display: flex;
        justify-content: space-between;
        align-items: center;

        span {
          @include regular-14();
          color: $main-lighten-52-color;
        }
      }

      .more-detail-content {
        margin-top: 2rem;
      }
    }

    .products-product-action-wrapper {
      display: flex;
      justify-content: center;
      align-items: center;

      @media #{map-get($display-breakpoints, 'sm-and-down')} {
        button {
          padding: 0 !important;
        }
      }
    }
  }

  .product-package-actions-wrapper {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 1rem;

    @media #{map-get($display-breakpoints, 'sm-and-down')} {
      flex-direction: column-reverse;
      align-items: center;

      button {
        max-width: fit-content;
      }
    }

    @media #{map-get($display-breakpoints, 'md-only')} {
      flex-direction: column-reverse;
      align-items: center;

      > button {
        margin-bottom: 1rem;
      }
    }
  }

  .dimension-wrapper {
    display: flex;
    margin-bottom: 2rem;

    @media #{map-get($display-breakpoints, 'sm-and-down')} {
      display: block;
    }

    .mp-textfield {
      padding-right: 1rem !important;

      @media #{map-get($display-breakpoints, 'sm-and-down')} {
        padding-right: 0 !important;
      }

      &:last-of-type {
        padding-right: 0 !important;
      }
    }
  }

  .package-more-detail-wrapper {
    margin-top: 3rem;

    .package-more-detail {
      background-color: $main-lighten-80-color;
      padding: 2.2rem 1.9rem 2.1rem 2rem;

      .package-more-detail-header {
        display: flex;
        justify-content: space-between;
        align-items: center;

        span {
          @include regular-14();
          color: $main-lighten-52-color;
        }
      }

      .package-more-detail-content {
        padding-top: 2rem;
        max-height: unset;
      }
    }
  }

  .footprint-wrapper {
    @media #{map-get($display-breakpoints, 'sm-and-up')} {
      .footprint-unit {
        max-width: 30%;
        margin-left: 2.3rem !important;
      }
    }

    @media #{map-get($display-breakpoints, 'xs-only')} {
      .footprint-unit {
        margin-top: 2rem !important;
      }
    }
  }
}
</style>
