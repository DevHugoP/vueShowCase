<template>
  <mp-block
    id="retailer-client-page-header-block"
    :title="$vuetify.breakpoint.smAndUp ? $t('page.clientPage.header.title') : ''"
    :hasBorder="$vuetify.breakpoint.smAndUp"
    :hasMarginBottom="$vuetify.breakpoint.smAndUp"
    titleHasPaddingBottom
  >
    <v-row
      no-gutters
      v-for="[key, value] in Object.entries(header)"
      :key="key"
      class="d-flex align-center client-page-detail-header-detail"
    >
      <v-icon>{{ value ? 'mdi-check-bold' : 'mdi-close-thick' }}</v-icon>
      <span class="regular14 pl-4">{{ $t(`page.clientPage.header.${key}`) }}</span>
    </v-row>
  </mp-block>
</template>

<script lang="ts">
import Vue from 'vue'

import mpBlock from '@/components/block/block.vue'

export default Vue.extend({
  name: 'client-page-detail-header',
  components: {
    mpBlock,
  },
  props: {
    header: {
      type: Object as () => Record<string, boolean>,
      required: true,
    },
  },
})
</script>

<style lang="scss">
#retailer-client-page-header-block {
  .mdi-close-thick {
    color: $error-color;
  }

  .client-page-detail-header-detail {
    flex-flow: nowrap;
    padding-bottom: 1.6rem;

    &:last-child {
      padding-bottom: 0;
      }

  }
}
</style>
