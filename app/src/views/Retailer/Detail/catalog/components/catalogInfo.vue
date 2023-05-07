<template>
  <v-container id="retailer-detail-catalog-info" :data-id="dataId">
    <v-row no-gutters class="data-container">
      <v-col cols="6">
        <span class="regular14 main-lighten-52">
          {{ $t('page.retailerDetail.catalogs.numberOfProducts') }}
        </span>
      </v-col>
      <v-col cols="6" class="value">
        <span
          class="regular14 main-color"
          :data-id="`${dataId}-productsCount`"
        >
          {{ catalog.productsCount }}
        </span>
      </v-col>
    </v-row>

    <v-row no-gutters class="data-container">
      <v-col cols="6">
        <span class="regular14 main-lighten-52">
          {{ $t('page.retailerDetail.catalogs.registerDate') }}
        </span>
      </v-col>
      <v-col cols="6" class="value">
        <span class="regular14 main-color" :data-id="`${dataId}-createdAt`">
          {{ getDate(catalog.createdAt, 'P p') }}
        </span>
      </v-col>
    </v-row>

    <v-row no-gutters class="data-container">
      <v-col cols="6">
        <span class="regular14 main-lighten-52">
          {{ $t('page.retailerDetail.catalogs.lastUpdate') }}
        </span>
      </v-col>
      <v-col cols="6" class="value">
        <span class="regular14 main-color" :data-id="`${dataId}-updateedAt`">
          {{ getDate(catalog.updatedAt, 'P p') }}
        </span>
      </v-col>
    </v-row>

    <v-row no-gutters class="data-container">
      <v-col cols="6">
        <span class="regular14 main-lighten-52">
          {{ $t('page.retailerDetail.catalogs.endDate') }}
        </span>
      </v-col>
      <v-col cols="6" class="value">
        <span class="regular14 main-color" :data-id="`${dataId}-outdatedAt`">
          {{ getDate(catalog.outdatedAt, DateFormat.DATE) }}
        </span>
      </v-col>
    </v-row>

    <v-row no-gutters class="data-container last">
      <v-col cols="6">
        <span class="regular14 main-lighten-52">
          {{ $t('page.retailerDetail.catalogs.reminderDate') }}
        </span>
      </v-col>
      <v-col cols="6" class="value">
        <span class="regular14 main-color" :data-id="`${dataId}-reminderDate`">
          {{ computedOutdatedDate }}
        </span>
      </v-col>
    </v-row>

    <v-row no-gutters class="action-outer-wrapper spacingBtn">
      <v-col cols="12" class="action-wrapper">
        <mp-button
          v-if="isAuthorized('DELETE_CATALOGS', { retailerId: retailerId })"
          class="action-reload"
          icon="trash-can-outline"
          iconSize="1.8rem"
          format="link"
          linkColor="red"
          :text="$t('action.delete.base')"
          @click="showDeleteDialog()"
          :dataId="`${dataId}-delete`"
        />

        <mp-button
          v-if="isAuthorized('EDIT_CATALOGS', { retailerId: retailerId })"
          class="action-refresh"
          icon="pencil"
          iconSize="1.8rem"
          format="secondary"
          :text="$t('action.update.base')"
          @click="showDialogAddCatalog = !showDialogAddCatalog"
          :dataId="`${dataId}-refresh`"
        />
      </v-col>
    </v-row>

    <mp-dialog-confirmation
      v-if="showDialogDeleteCatalog"
      :dataId="`${dataId}-modalDeleteCatalog`"
      @close="hideDeleteModal()"
      @submit="deleteCatalog()"
      color="error"
      :header="{
        icon: 'mdi-trash-can-outline',
        isColorBackground: false,
        iconClose: 'mdi-close',
      }"
      :textContent="$t('page.retailerDetail.catalogs.modalDelete.message')"
      :btnValidation="{ text: $t('action.delete.base'), format: 'error' }"
      :btnCancel="{ text: $t('action.cancel.base'), format: 'link', linkColor: 'black' }"
      :btnToColumn="$vuetify.breakpoint.xsOnly"
    />

    <mp-retailer-add-catalog
      v-if="showDialogAddCatalog"
      :showDialog="showDialogAddCatalog"
      :data="catalog"
      isModified
      @hide="updateCatalog($event)"
      :dataId="`${dataId}-modalUpdateCatalog`"
    />
  </v-container>
</template>

<script lang="ts">
import mixins from 'vue-typed-mixins'

import { dateHelper, DateFormat, dateHelperGetTimezonedDate } from '@/helpers/dateHelper'

import mpRetailerAddCatalog from '@/views/Retailer/Detail/catalog/modals/addCatalog.vue'

import { authorizationMixin } from '@/mixins'
import { CatalogEntity } from '@/types'
import { UpdateCatalog } from '../catalog.vue'

export default mixins(authorizationMixin).extend({
  name: 'mp-retailer-detail-catalog-infos',
  components: {
    mpRetailerAddCatalog,
  },
  props: {
    catalog: {
      type: Object as () => CatalogEntity,
      required: true,
    },
    dataId: {
      type: String,
      required: true,
    },
    retailerId: {
      type: Number,
      required: true,
    },
  },
  data: () => ({
    DateFormat,
    showDialogAddCatalog: false,
    showDialogDeleteCatalog: false,
  }),
  computed: {
    computedOutdatedDate() {
      return dateHelper.formatToTimezone(
        dateHelper.substract(dateHelperGetTimezonedDate(this.catalog.outdatedAt), {
          days: this.catalog.updateReminderInterval,
        }),
        'UTC',
        DateFormat.DATE,
      )
    },
  },
  methods: {
    updateCatalog(catalog: UpdateCatalog) {
      this.showDialogAddCatalog = false
      if (catalog) {
        this.$emit('updateCatalog', catalog)
      }
    },
    showDeleteDialog() {
      this.showDialogDeleteCatalog = true
    },
    hideDeleteModal() {
      this.showDialogDeleteCatalog = false
    },
    deleteCatalog() {
      this.showDialogDeleteCatalog = false
      this.$emit('deleteCatalog', this.catalog)
    },
    getDate(date: string, format: string) {
      return dateHelper.formatToTimezone(dateHelperGetTimezonedDate(date), 'UTC', format)
    },
  },
})
</script>

<style lang="scss">
#retailer-detail-catalog-info {
  padding: 0;

  @media #{map-get($display-breakpoints, 'xs-only')} {
    display: flex;
    flex-direction: column;
    gap: 4rem;
  }
  .spacingBtn {
    @media #{map-get($display-breakpoints, 'xs-only')} {
      margin-top: 3rem;
    }
  }

  .data-container {
    padding-bottom: 1.6rem;
    margin-bottom: 1.6rem;
    border-bottom: solid 0.1rem $main-lighten-74-color;

    &.last {
      border-bottom: none;
    }

    .value {
      display: flex;
      justify-content: flex-end;

      .regular14 {
        word-break: break-all;
        text-align: right;
      }
    }
  }

  .action-outer-wrapper {
    .action-wrapper {
      display: flex;
      justify-content: flex-end !important;
      flex-direction: row !important;

      @media #{map-get($display-breakpoints, 'xs-only')} {
        flex-direction: column-reverse !important;
        align-items: center !important;
      }

      button {
        width: fit-content;
      }

      .action-refresh {
        @media #{map-get($display-breakpoints, 'sm-and-up')} {
          margin-left: 2rem;
        }
      }
    }
  }
}
</style>
