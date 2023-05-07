<template>
  <mp-dialog-confirmation
    :dataId="dataId"
    @close="hide()"
    color="primary"
    :header="{
      isColorBackground: true,
      iconClose: 'mdi-arrow-left',
      text: catalog.title.toUpperCase(),
      textPolice: 'regular14',
    }"
    fullscreen
    classWrapper="modal-detail-retailer-catalogs"
  >
    <template #content>
      <mp-retailer-catalog-info
        :dataId="`${dataId}-infos`"
        :catalog="catalog"
        @deleteCatalog="$emit('deleteCatalog', $event)"
      />
    </template>
  </mp-dialog-confirmation>
</template>

<script lang="ts">
import Vue from 'vue'

import mpRetailerCatalogInfo from '@/views/Retailer/Detail/catalog/components/catalogInfo.vue'

export default Vue.extend({
  name: 'mp-retailer-detail-catalog-detail',
  components: {
    mpRetailerCatalogInfo,
  },
  props: {
    showDialog: {
      type: Boolean,
      required: true,
    },
    catalog: {
      type: Object,
      required: true,
    },
    dataId: {
      type: String,
      required: true,
    },
  },
  methods: {
    hide() {
      this.$emit('hide')
    },
  },
})
</script>

<style lang="scss">
.modal-detail-retailer-catalogs {
  .main-dialog-content {
    padding: 3rem 2rem 2rem 2rem !important;
  }
}
</style>
