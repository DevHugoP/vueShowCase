<template>
  <v-container id="retailer-detail-catalog" data-id="retailer-detail-catalog">
    <mp-block
      id="retailer-detail-catalog-block"
      :title="$vuetify.breakpoint.smAndUp ? $t('page.retailerDetail.catalogs.title') : ''"
      :hasBorder="$vuetify.breakpoint.smAndUp"
      :hasMarginBottom="$vuetify.breakpoint.smAndUp"
      titleHasPaddingBottom
    >
      <v-row no-gutters v-if="$vuetify.breakpoint.smAndUp">
        <v-col cols="12">
          <v-expansion-panels
            flat
            class="expension-panels"
            :style="{ maxHeight }"
            v-model="catalogsPanels"
            v-if="catalogs && catalogs.length > 0"
          >
            <mp-collapse
              v-for="(catalog, index) in catalogs"
              :key="`catalog-${index}`"
              :ref="`catalog-${index}`"
              :title="catalog.title"
              hasBorder
              leftIcon="mdi-book"
              leftIconSize="1.8rem"
              :dataId="`retailer-detail-catalog-collapse-${index}-info`"
            >
              <mp-retailer-catalog-info
                :catalog="catalog"
                :retailerId="retailerId"
                @deleteCatalog="deleteCatalog($event)"
                @updateCatalog="updateCatalog($event)"
                :dataId="`retailer-detail-catalog-collapse-${index}-info`"
              />
            </mp-collapse>
          </v-expansion-panels>

          <no-data v-else dataId="retailer-data-catalog-noData" />
        </v-col>
      </v-row>

      <v-row no-gutters v-else class="mobile">
        <v-col cols="12">
          <v-row
            no-gutters
            v-for="(catalog, index) in computedCatalogs"
            :key="`catalogs-${index}`"
            class="catalog"
            @click="openDetailCatalog(catalog)"
            :data-id="`retailer-detail-catalog-${index}-info`"
          >
            <v-col cols="10" class="title-wrapper">
              <span class="regular14" :data-id="`retailer-detail-catalog-${index}-info-title`">
                <v-icon size="1.8rem">mdi-book</v-icon>
                {{ catalog.title }}
              </span>
            </v-col>
            <v-col cols="2" class="icon-wrapper">
              <v-icon size="1.8rem">mdi-chevron-right</v-icon>
            </v-col>
          </v-row>

          <no-data v-if="computedCatalogs.length === 0" dataId="retailer-detail-catalog-noData" />

          <v-row
            no-gutters
            v-if="catalogs && catalogs.length > 3"
            class="action-show-more-outer-wrapper"
          >
            <v-col cols="12" class="action-wrapper">
              <mp-button
                dataId="retailer-detail-catalog-showMoreAndShowLess"
                :text="$t('action.show.base')"
                format="secondary"
                small
                :icon="mobileShowLess ? 'plus' : 'minus'"
                @click="mobileShowLess = !mobileShowLess"
              />
            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <v-row
        no-gutters
        class="action-outer-wrapper"
        v-if="isAuthorized('CREATE_CATALOGS', { retailerId })"
      >
        <v-col cols="12" class="action-wrapper">
          <mp-button
            icon="plus"
            iconSize="1.8rem"
            :text="$t('action.add.base')"
            dataId="retailer-detail-catalog-addCatalog"
            shape="rounded"
            depressed
            @click="showDialogAddCatalog = !showDialogAddCatalog"
          />
        </v-col>
      </v-row>
    </mp-block>

    <mp-retailer-add-catalog
      v-if="showDialogAddCatalog"
      :showDialog="showDialogAddCatalog"
      :isModified="false"
      @hide="hideModal()"
      @updateCatalog="updateCatalog"
      dataId="retailer-detail-catalog-modalAddCatalog"
    />

    <mp-retailer-modal-detail-catalog
      v-if="showDialogDetailCatalog"
      :showDialog="showDialogDetailCatalog"
      :catalog="selectedDetailCatalog"
      @hide="hideDetailModal()"
      @deleteCatalog="deleteCatalog"
      @updateCatalog="updateCatalog"
      dataId="retailer-detail-catalog-modalDetailCatalog"
    />
  </v-container>
</template>

<script lang="ts">
import mixins from 'vue-typed-mixins'

import CatalogService from '@/services/catalog/CatalogService'

import noData from '@/components/noData/noData.vue'
import mpBlock from '@/components/block/block.vue'

import mpRetailerAddCatalog from '@/views/Retailer/Detail/catalog/modals/addCatalog.vue'
import mpRetailerModalDetailCatalog from '@/views/Retailer/Detail/catalog/modals/detailCatalog.vue'
import mpRetailerCatalogInfo from '@/views/Retailer/Detail/catalog/components/catalogInfo.vue'

import { SnackBarType } from '@/store/types'

import { authorizationMixin } from '@/mixins'
import { CatalogEntity } from '@/types'

export interface UpdateCatalog {
  id: string
  catalog: CatalogEntity
}

export default mixins(authorizationMixin).extend({
  name: 'mp-retailer-detail-catalog',
  components: {
    mpRetailerAddCatalog,
    mpRetailerModalDetailCatalog,
    mpRetailerCatalogInfo,
    noData,
    mpBlock,
  },
  props: {
    retailerId: {
      type: Number,
      required: true,
    },
  },
  data: () => ({
    catalogs: null as CatalogEntity[] | null,
    showDialogAddCatalog: false,
    maxHeight: 'none',
    catalogsPanels: null as number | null,
    saveCatalogsPanelsIndex: 1,
    mobileShowLess: true,
    showDialogDetailCatalog: false,
    selectedDetailCatalog: null as CatalogEntity | null,
  }),
  computed: {
    computedCatalogs() {
      if (!this.catalogs) {
        return []
      }

      return this.catalogs.slice(0, this.mobileShowLess ? 3 : this.catalogs.length)
    },
  },
  async mounted() {
    try {
      this.catalogs = await CatalogService.getAll({
        retailerId: parseInt(this.$route.params.id, 10),
      })

      if (this.$vuetify.breakpoint.smAndUp) {
        this.$nextTick(() => {
          this.calculateMaxHeight()
        })
      }
    } catch (err) {
      this.catalogs = null
    }
  },
  methods: {
    hideModal() {
      this.showDialogAddCatalog = false
    },
    openDetailCatalog(catalog: CatalogEntity) {
      this.selectedDetailCatalog = catalog
      this.showDialogDetailCatalog = true
    },
    hideDetailModal() {
      this.showDialogDetailCatalog = false
      this.selectedDetailCatalog = null
    },
    async deleteCatalog(catalog: CatalogEntity) {
      this.showDialogDetailCatalog = false

      try {
        if (this.catalogs) {
          this.catalogs = this.catalogs.filter(({ id }) => id !== catalog.id)

          this.catalogsPanels = null
          await CatalogService.delete(catalog.id)

          this.$store.dispatch('setSnackbar', {
            type: SnackBarType.SUCCESS,
            message: this.$t('messages.catalogDeleteConfirmed'),
          })
        }
      } catch (e) {
        this.$store.dispatch('setSnackbar', {
          type: SnackBarType.ERROR,
          message: this.$t('messages.catalogDeleteError'),
        })
      } finally {
        this.showDialogDetailCatalog = false
      }
    },
    updateCatalog({ id, catalog }: UpdateCatalog) {
      let currentCatalogs = this.catalogs!
      if (catalog.productsCount) {
        currentCatalogs = currentCatalogs
          .filter(currentCatalog => id !== currentCatalog.id)
          .concat(catalog)
      } else {
        currentCatalogs = currentCatalogs.map(currentCatalog => {
          if (currentCatalog.id === id) {
            return {
              ...currentCatalog,
              ...catalog,
            }
          }

          return currentCatalog
        })
      }

      this.showDialogAddCatalog = false
      this.showDialogDetailCatalog = false

      this.catalogs = currentCatalogs
    },
    calculateMaxHeight(index = 0, toSave = false) {
      if (this.catalogs && this.catalogs.length > 3) {
        if (index === this.saveCatalogsPanelsIndex) {
          index = index === 0 ? 1 : 0
        }

        this.maxHeight = `${((this.$refs[`catalog-${index === 2 ? 0 : index}`] as any)[0].$el
          .offsetHeight +
          (this.$refs[`catalog-${this.saveCatalogsPanelsIndex}`] as any)[0].$el.offsetHeight +
          (this.$refs['catalog-2'] as any)[0].$el.offsetHeight +
          20) /
          10}rem`

        // save the current index for next call of calculateMaxHeight
        if (toSave) {
          this.saveCatalogsPanelsIndex = index
        }
      } else {
        this.maxHeight = 'none'
      }
    },
  },
  watch: {
    // adapt height scroll bar when open/close collapse
    catalogsPanels(val) {
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
@import '../../../../styles/mixins/macScrollbar';

#retailer-detail-catalog {
  padding: 0;

  @media #{map-get($display-breakpoints, 'xs-only')} {
    border-top: solid 0.1rem $main-lighten-74-color;
  }

  .title-outer-wrapper {
    margin-bottom: 2.3rem;
  }

  .expension-panels {
    overflow: auto;
    @include setMacScrollbar('&');

    .template-collapse-wrapper {
      margin-bottom: 0.7rem;
      margin-top: 0;

      &:last-of-type {
        margin-bottom: 0;
      }

      .v-expansion-panel-header {
        border-bottom-left-radius: inherit;
        border-bottom-right-radius: inherit;
      }
    }
  }

  .action-outer-wrapper {
    margin-top: 2.5rem;
    margin-bottom: 0.1rem;

    @media #{map-get($display-breakpoints, 'xs-only')} {
      margin-top: 2.3rem;
    }

    .action-wrapper {
      display: flex;
      justify-content: center;

      i {
        margin-right: 1rem;
      }
    }
  }

  .left-icon {
      color: $main-color;
  }

  .mobile {
    .catalog {
      min-height: 6rem;
      display: flex;
      align-items: center;
      border: solid 0.1rem $main-lighten-74-color;
      border-radius: 0.4rem;
      margin-bottom: 0.5rem;
      padding-left: 2rem;

      .title-wrapper {
        i {
          color: $main-color;
          margin-right: 1.2rem;
        }
      }
    }

    .action-show-more-outer-wrapper {
      .action-wrapper {
        margin-top: 2.5rem;
        display: flex;
        justify-content: center;
        align-items: center;

        .v-btn__content {
          display: flex;
          flex-direction: row-reverse;

          i {
            margin-right: 0;
            margin-left: 1rem;
          }
        }
      }
    }
  }
}
</style>
