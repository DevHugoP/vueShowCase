<template>
  <div
    id="order-detail-packages-and-products"
    v-if="packagesAndProducts"
    data-id="order-detail-packagesAndProducts"
  >
    <mp-block
      :title="$vuetify.breakpoint.smAndUp ? $t('page.detailOrder.packagesAndProducts.title') : ''"
      id="order-detail-packages-and-products-block"
      titleHasPaddingBottom
      :hasBorder="$vuetify.breakpoint.smAndUp"
      :hasMarginBottom="$vuetify.breakpoint.smAndUp"
    >
      <div v-if="hasData">
        <div
          v-if="packagesAndProducts.packages && packagesAndProducts.packages.length > 0"
          class="packages-container"
        >
          <mp-packages-and-products-product-global-infos :packages="packagesAndProducts.packages" />

          <div class="package-wrapper" :style="{ maxHeight }">
            <div
              v-for="(mpPackage, index) in packagesAndProducts.packages"
              :key="`packages-${index}`"
              class="package-container"
              :data-id="`order-detail-packagesAndProducts-packages-${index}`"
            >
              <div class="title-container">
                <div class="title-wrapper">
                  <v-chip
                    small
                    class="package-chips"
                    :data-id="
                      `order-detail-packagesAndProducts-packages-${index}-titleAndSizeAndWeight`
                    "
                  >
                    <span class="medium14">
                      {{
                        mpPackage.title ||
                          $t('page.detailOrder.detail.packageNb', { number: index + 1 })
                      }}
                    </span>
                  </v-chip>
                  <div class="package-informations">
                    <span class="label medium12 main-lighten-52" v-if="mpPackage.quantity > 1">
                      {{ ` x ${mpPackage.quantity} ` }}
                    </span>
                    <span class="label medium12 main-lighten-52">
                      <v-icon class="medium12 main-lighten-65">mdi-weight</v-icon>
                      {{ mpPackage.weight.value }} {{ mpPackage.weight.unit }}
                    </span>
                    <span class="label medium12 main-lighten-52">
                      {{ getDimensionInCm(mpPackage) }}
                    </span>
                    <span v-if="$vuetify.breakpoint.mdAndUp" class="label medium12 main-lighten-52">
                      <v-icon size="1.6rem" class="medium12 main-lighten-65">
                        mdi-package-variant-closed
                      </v-icon>
                      {{
                        $t([
                          `page.order.packages.types.${mpPackage.type}`,
                          `common.packageType.PACKAGE`,
                        ])
                      }}
                    </span>
                  </div>
                </div>

                <div v-if="shouldDisplayPackageFollowingBtn">
                  <mp-button
                    icon="package-variant-closed"
                    :text="$t('page.detailOrder.packagesAndProducts.followingPackage')"
                    dataId="orderDetail-packagesAndProducts-follow"
                    format="primary"
                    small
                    @click="handlePackageFollow(index)"
                  />
                </div>
              </div>

              <div class="products-container">
                <v-expansion-panels accordion flat v-model="packagesPanels[index]">
                  <mp-collapse
                    color="black"
                    :title="
                      product.label ||
                        $t('page.detailOrder.detail.productNb', { number: indexProduct + 1 })
                    "
                    :ref="`packages-${index}-products-${indexProduct}`"
                    v-for="(product, indexProduct) in mpPackage.products"
                    :key="`packages-${index}-products-${indexProduct}`"
                    :dataId="
                      `order-detail-packagesAndProducts-packages-${index}-collapse-${indexProduct}-info`
                    "
                    typographyClass="regular16"
                    @click="() => (showPackageAndProductInfos = true)"
                  >
                    <mp-packages-and-products-product-infos
                      v-if="showPackageAndProductInfos"
                      @hide="showPackageAndProductInfos = false"
                      :product="product"
                      :dataId="
                        `order-detail-packagesAndProducts-packages-${index}-collapse-${indexProduct}-info`
                      "
                    />
                  </mp-collapse>
                </v-expansion-panels>
              </div>
            </div>
          </div>
          <div v-if="showProductReturn" class="d-flex justify-center btn-wrapper">
            <mp-button
              :text="$t('page.detailOrder.packagesAndProducts.init-product-return')"
              icon="replay"
              :class="$vuetify.breakpoint.xsOnly ? 'text-center' : ''"
              dataId="init-product-return"
              :to="
                orderId
                  ? {
                    name: ROUTES.createProductReturn,
                    params: { id: orderId.toString() },
                  }
                  : {}
              "
            />
          </div>
        </div>

        <div v-else-if="$vuetify.breakpoint.xsOnly" class="mobile">
          <mp-packages-and-products-product-global-infos :packages="packagesAndProducts.packages" />
          <div v-if="packagesAndProducts.packages && packagesAndProducts.packages.length > 0">
            <div
              v-for="(mpPackage, index) in packagesAndProducts.packages"
              :key="`packages-${index}`"
              class="package-container"
              :data-id="`order-detail-packagesAndProducts-packages-${index}`"
            >
              <div class="title-container">
                <div class="d-flex justify-space-between title-wrapper">
                  <v-chip
                    small
                    class="medium16 package-label"
                    :data-id="
                      `order-detail-packagesAndProducts-packages-${index}-titleAndSizeAndWeight`
                    "
                  >
                    {{
                      mpPackage.title ||
                        $t(
                          `page.detailOrder.detail.${mpPackage.type?.toLowerCase() || 'package'}Nb`,
                          { number: index + 1 },
                        )
                    }}
                  </v-chip>
                  <div class="d-flex justify-space-between package-informations">
                    <span class="label regular12">
                      {{ mpPackage.quantity > 1 ? ` x${mpPackage.quantity} ` : '' }}
                    </span>
                    <span class="label regular12">
                      <v-icon class="icon label regular12" color="main-lighten-65">
                        mdi-weight
                      </v-icon>
                      {{ mpPackage.weight.value.toFixed(3).replace(/[.,]0+$/, '') }}
                      {{ mpPackage.weight.unit }}
                    </span>
                    <span class="label regular12">{{ getDimensionInCm(mpPackage) }}</span>
                  </div>
                </div>

                <v-chip small class="ml-8">
                  {{ getDimensionInCm(mpPackage) }}
                </v-chip>
              </div>
              <v-row
                no-gutters
                v-for="(product, indexProduct) in mpPackage.products"
                :key="`packages-${index}-products-${indexProduct}`"
                class="product"
                @click="handleProductClick(product, indexProduct)"
                :data-id="
                  `order-detail-packagesAndProducts-packages-${index}-products-${indexProduct}`
                "
              >
                <v-col cols="9" offset="1">
                  <span
                    class="regular14 label"
                    :data-id="
                      `order-detail-packagesAndProducts-packages-${index}-products-${indexProduct}-label`
                    "
                  >
                    {{
                      product.label ||
                        $t('page.detailOrder.detail.productNb', { number: indexProduct + 1 })
                    }}
                  </span>
                </v-col>
                <v-col cols="2" class="icon-wrapper">
                  <v-icon>mdi-chevron-right</v-icon>
                </v-col>
              </v-row>

              <v-row no-gutters :class="shouldDisplayPackageFollowingBtn ? '' : 'mt-2'">
                <v-col cols="12" class="d-flex align-center justify-space-between pl-2 pr-2">
                  <span class="regular14">
                    {{ $t('page.detailOrder.packagesAndProducts.followingPackage') }}
                  </span>

                  <mp-button
                    v-if="shouldDisplayPackageFollowingBtn"
                    class="mt-1"
                    :text="$t('action.follow.base')"
                    dataId="orderDetail-packagesAndProducts-follow"
                    small
                    @click="handlePackageFollow(index)"
                  />
                </v-col>
              </v-row>

              <div class="products-container">
                <v-expansion-panels accordion flat v-model="packagesPanels[index]">
                  <mp-collapse
                    color="black"
                    :title="
                      product.label ||
                        $t('page.detailOrder.detail.productNb', { number: indexProduct + 1 })
                    "
                    :ref="`packages-${index}-products-${indexProduct}`"
                    v-for="(product, indexProduct) in mpPackage.products"
                    :key="`packages-${index}-products-${indexProduct}`"
                    :dataId="
                      `order-detail-packagesAndProducts-packages-${index}-collapse-${indexProduct}-info`
                    "
                    typographyClass="regular16"
                  >
                    <mp-packages-and-products-product-infos
                      class="pl-6"
                      :product="product"
                      :dataId="
                        `order-detail-packagesAndProducts-packages-${index}-collapse-${indexProduct}-info`
                      "
                    />
                  </mp-collapse>
                </v-expansion-panels>
              </div>
            </div>
          </div>

          <div v-else>
            <v-row
              no-gutters
              v-for="(product, indexProduct) in packagesAndProducts.products.slice(
                0,
                mobileShowLess ? 3 : packagesAndProducts.products.length,
              )"
              :key="`products-${indexProduct}`"
              :ref="`product-container-${indexProduct}`"
              color="black"
              :title="product.label"
              hasBorder
              :dataId="`order-detail-packagesAndProducts-collapses-${indexProduct}-info`"
            >
              <v-col>
                <mp-packages-and-products-product-infos
                  :product="product"
                  :dataId="`order-detail-packagesAndProducts-collapses-${indexProduct}-info`"
                />
              </v-col>
            </v-row>
            <v-row
              no-gutters
              :class="shouldDisplayPackageFollowingBtn ? '' : 'mt-2'"
              v-if="shouldDisplayPackageFollowing && $vuetify.breakpoint.smAndUp"
            >
              <v-col cols="12" class="d-flex align-center justify-space-between pl-2 pr-2">
                <div v-if="showProductReturn" class="d-flex justify-center">
                  <mp-button
                    dataId="order-detail-packagesAndProducts-showMoreAndShowLess"
                    :text="
                      mobileShowLess ? `${$t('action.show.base')} +` : `${$t('action.show.base')} -`
                    "
                    format="secondary"
                    @click="mobileShowLess = !mobileShowLess"
                  />
                </div>
              </v-col>
            </v-row>

            <div v-if="showProductReturn" class="d-flex justify-center">
              <mp-button
                :text="$t('page.detailOrder.packagesAndProducts.init-product-return')"
                icon="restore"
                dataId="init-product-return"
                :to="
                  orderId
                    ? {
                      name: ROUTES.createProductReturn,
                      params: { id: orderId.toString() },
                    }
                    : {}
                "
              />
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <no-data dataId="order-detail-packagesAndProducts-noData" />
      </div>
    </mp-block>

    <mp-packages-and-products-mobile-product-infos
      v-if="showDialog"
      :showDialog="showDialog"
      :product="selectedProduct"
      @hide="handleCancelModal()"
    />

    <mp-packages-and-products-package-follow-dialog
      :selectedPackageId="selectedPackageId"
      :deliveryId="deliveryId"
      v-if="showPackageFollowDialog && deliveryId"
      @close="showPackageFollowDialog = false"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import mpPackagesAndProductsProductInfos from '@/components/packagesAndProducts/components/productInfos.vue'
import mpPackagesAndProductsProductGlobalInfos from '@/components/packagesAndProducts/components/globalInfos.vue'
import mpPackagesAndProductsMobileProductInfos from '@/components/packagesAndProducts/modals/mobileProductInfos.vue'
import mpPackagesAndProductsPackageFollowDialog from '@/components/packagesAndProducts/modals/packageFollow/packageFollow.vue'
import mpBlock from '@/components/block/block.vue'
import { ROUTES } from '@/constants'

import noData from '@/components/noData/noData.vue'

import objectHelper from '@/helpers/objectHelper'

export interface Measure {
  value: number
  unit: string
}

interface Product {
  cug: string
  ean: string
  label: string
  quantity: number
  type: string
  height?: Measure
  length?: Measure
  weight?: Measure
  width?: Measure
  indexProduct?: number
}

interface Package {
  title: string
  size: string
  createdAt: string
  height: Measure
  id: number
  length: Measure
  orderId: number
  products: Product[]
  quantity: number
  updatedAt: string
  weight: Measure
  width: Measure
}

export interface MpPackagesAndProducts {
  packages?: Package[]
  products?: Product[]
}

export default Vue.extend({
  name: 'mp-packages-and-products',
  components: {
    mpPackagesAndProductsProductGlobalInfos,
    mpPackagesAndProductsProductInfos,
    mpPackagesAndProductsMobileProductInfos,
    mpPackagesAndProductsPackageFollowDialog,
    noData,
    mpBlock,
  },
  props: {
    orderId: {
      type: Number,
      default: null,
    },
    showProductReturn: {
      type: Boolean,
      default: false,
    },
    packages: {
      type: Array as () => Package[],
      required: true,
    },
    deliveryId: {
      type: String,
      default: '',
    },
    shouldDisplayPackageFollowingBtn: {
      type: Boolean,
      required: false,
    },
    shouldDisplayPackageFollowing: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      packagesAndProducts: null as MpPackagesAndProducts | null,
      ROUTES,
      maxHeight: 'none',
      productsPanels: null as number | null,
      saveProductsPanelsIndex: 1,
      packagesPanels: [],
      mobileShowLess: true,
      showDialog: false,
      selectedProduct: null as Product | null,
      hasData: true,
      selectedPackageId: 0,
      showPackageFollowDialog: false,
      showPackageAndProductInfos: false,
    }
  },
  mounted() {
    this.packagesAndProducts = {
      packages: this.packages,
    }

    if (this.$vuetify.breakpoint.smAndUp) {
      this.$nextTick(() => {
        this.calculateMaxHeight()
      })
    }

    if (objectHelper.hasDeepProperty(this.packagesAndProducts, 'packages')) {
      this.hasData = true
    } else if (
      objectHelper.hasDeepProperty(this.packagesAndProducts, 'products') &&
      this.packagesAndProducts &&
      this.packagesAndProducts.products
    ) {
      this.hasData = this.packagesAndProducts.products.length > 0
    }
  },
  methods: {
    calculateMaxHeight(index = 0, toSave = false): void {
      // if more than 3 products in products
      if (this.packagesAndProducts!.products && this.packagesAndProducts!.products.length > 3) {
        if (index === this.saveProductsPanelsIndex) {
          index = index === 0 ? 1 : 0
        }
        // calculate height of 3 element / 3 close element or 1 open element 2 close or the openning one, the closing one and one close
        this.maxHeight = `${((this.$refs[`product-container-${index === 2 ? 0 : index}`] as any)[0]
          .$el.offsetHeight +
          (this.$refs[`product-container-${this.saveProductsPanelsIndex}`] as any)[0].$el
            .offsetHeight +
          (this.$refs[`product-container-2`] as any)[0].$el.offsetHeight +
          10) /
          10}rem`

        // save the current index for next call of calculateMaxHeight
        if (toSave) {
          this.saveProductsPanelsIndex = index
        }
      } else if (
        // if more than 3 products in packages
        this.packagesAndProducts!.packages &&
        this.packagesAndProducts!.packages.reduce(
          (acc: number, mpPackage: any) => acc + mpPackage.products.length,
          0,
        ) > 3
      ) {
        let totalProducts = 0
        let totalPackages = 0
        let totalHeight = 0
        // get height and number of package for display 3 products
        for (const [packageIndex, mpPackage] of this.packagesAndProducts!.packages.entries()) {
          for (const [productIndex] of mpPackage.products.entries()) {
            totalHeight += (this.$refs[
              `packages-${packageIndex}-products-${productIndex}`
            ] as any)[0].$el.offsetHeight
            totalProducts++
            if (totalProducts === 3) {
              break
            }
          }
          totalPackages++
          if (totalProducts === 3) {
            break
          }
        }

        // if open add the height of an open product
        if (
          Array.isArray(index) &&
          index.length > 0 &&
          index.filter((el: number) => el !== undefined).length > 0
        ) {
          totalHeight += 168
        }

        // return height in rem
        this.maxHeight = `${(totalHeight + 60 * totalPackages + (totalPackages === 3 ? 9 : 0)) /
          10}rem`
      }
    },
    handleProductClick(product: Product, indexProduct: number): void {
      this.selectedProduct = {
        ...product,
        indexProduct,
      }
      this.showDialog = true
    },
    handleCancelModal(): void {
      this.showDialog = false
      this.selectedProduct = null
    },
    getDimensionInCm(mpPackage: Package): string {
      return this.$t('page.detailOrder.detail.productDimension', {
        length: mpPackage.length.value.toFixed(2).replace(/[.,]0+$/, ''),
        width: mpPackage.width.value.toFixed(2).replace(/[.,]0+$/, ''),
        height: mpPackage.height.value.toFixed(2).replace(/[.,]0+$/, ''),
        unit: mpPackage.height.unit,
      })
    },
    handlePackageFollow(index: number): void {
      this.selectedPackageId = this.packagesAndProducts!.packages![index].id
      this.showPackageFollowDialog = true
    },
  },
  watch: {
    productsPanels(val) {
      if (this.$vuetify.breakpoint.smAndUp) {
        const inter = setInterval(() => {
          this.calculateMaxHeight(val)
        }, 10)
        setTimeout(() => {
          this.calculateMaxHeight(val, true)
          clearInterval(inter)
        }, 500)
      }
    },
    packagesPanels(val) {
      if (this.$vuetify.breakpoint.smAndUp) {
        const inter = setInterval(() => {
          this.calculateMaxHeight(val)
        }, 10)
        setTimeout(() => {
          this.calculateMaxHeight(val, true)
          clearInterval(inter)
        }, 500)
      }
    },
  },
})
</script>

<style lang="scss">
@import '../../styles/mixins/macScrollbar';

#order-detail-packages-and-products {
  padding: 0;

  @media #{map-get($display-breakpoints, 'xs-only')} {
    border-top: solid 0.1rem $main-lighten-74-color;
  }

  .packages-container {
    .btn-wrapper {
      margin-top: 2.5rem;
      margin-bottom: 0.1rem;
    }
    .package-wrapper {
      @media #{map-get($display-breakpoints, 'sm-and-up')} {
        overflow: auto;
        @include setMacScrollbar('&');
      }

      margin-bottom: 2.8rem;

      .package-container {
        margin-bottom: 3rem;
        border-bottom: 0.1rem solid $main-lighten-74-color;

        &:last-child {
          margin-bottom: 0;
        }

        .icon {
          color: $main-lighten-65-color;
        }

        .package-chips {
          background-color: $main-lighten-52-color;
          color: $white;
          height: 2.6rem;
        }

        .title-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          color: $main-color;
          margin-bottom: 1.2rem;

          @media #{map-get($display-breakpoints, 'sm-and-down')} {
            flex-direction: column;
            align-items: flex-start;

            div:not(.title-wrapper):not(.package-informations) {
              margin-top: 1.1rem;
            }
          }

          .title-wrapper {
            display: flex;
            align-items: center;
            justify-content: space-between;
          }

          .medium16 {
            margin-left: 0.8rem;
          }

          i {
            color: $main-color;
          }
        }

        .package-informations {
          color: $main-lighten-52-color;
          width: fit-content;
          display: flex;

          span {
            margin-left: 1.5rem;
          }
        }
      }
    }
  }

  .v-expansion-panels {
    margin-bottom: 1.9rem;
    border-color: $main-lighten-74-color;

    .v-expansion-panel-header {
      padding: 0 0.8rem 0 0;

      .collapse-title {
        @include regular-16(!important);
        color: $main-color;

        display: list-item;
        list-style-type: disc;
        list-style-position: inside;
      }

      .v-expansion-panel-header__icon {
        .v-icon {
          color: $main-color;
        }
      }
    }

    .v-expansion-panel-content {
      margin-top: 1rem;

      .v-expansion-panel-content__wrap {
        padding-left: 3.3rem;
      }
    }
  }

  .products-container-scroll {
    overflow: auto;
    @include setMacScrollbar('&');
  }
}
</style>
