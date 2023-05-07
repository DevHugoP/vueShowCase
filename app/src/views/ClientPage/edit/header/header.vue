<template>
  <div id="client-page-edit-header" class="pa-0 mt-14" data-id="client-page-edit-header">
    <v-row no-gutters class="mb-5">
      <v-col cols="12">
        <h2 data-id="client-page-edit-header-title">
          {{ $t('page.editClientPage.header.title') }}
        </h2>
      </v-col>
    </v-row>

    <v-col cols="12" md="8" lg="6" class="pa-0">
      <v-row
        no-gutters
        v-for="(headerEntry, index) in headerEntries"
        :key="`clientPage-edit-header-${index}`"
        :class="`header-field-wrapper${index === headerEntries.length - 1 ? ' last' : ''}`"
      >
        <v-col cols="12" class="header-field d-flex align-center">
          <span class="regular14">
            {{ $t(`page.editClientPage.header.${headerEntry[0]}`) }}
          </span>
          <v-spacer />
          <mp-switch
            v-model="header[headerEntry[0]]"
            :dataId="`clientPage-edit-header-${index}-active`"
            :disabled="
              disabled ||
                (isMultiTracking &&
                  ['showOrderCreationDate', 'showPickingDate'].includes(headerEntry[0]) &&
                  !headerEntry[1] &&
                  headerEntries.find(
                    entry =>
                      entry[0] ===
                      ['showOrderCreationDate', 'showPickingDate'].filter(
                        key => key !== headerEntry[0],
                      )[0],
                  )[1])
            "
          />
        </v-col>
      </v-row>
    </v-col>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import { ClientPageConfigHeader } from '@/types'
import { ClientPageType } from '@/constants'

export default Vue.extend({
  name: 'client-page-edit-header',
  props: {
    header: {
      type: Object as () => ClientPageConfigHeader,
      required: true,
    },
    disabled: {
      type: Boolean,
      required: true,
    },
    defaultHeader: {
      type: Object as () => ClientPageConfigHeader,
      required: true,
    },
    selectedType: {
      type: String,
      required: true,
    },
  },
  computed: {
    headerEntries() {
      return Object.entries({ ...this.defaultHeader, ...this.header })
    },
    isMultiTracking() {
      return this.selectedType === ClientPageType.DELIVERY.MULTI_TRACKING
    },
  },
})
</script>

<style lang="scss">
#client-page-edit-header {
  .header-field-wrapper {
    min-height: 6rem;
    display: flex;
    align-items: center;
    border-bottom: solid 0.1rem $main-lighten-65-color;

    &.last {
      border-bottom: none;
    }

    .header-field {
      text-decoration: none;
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
}
</style>
