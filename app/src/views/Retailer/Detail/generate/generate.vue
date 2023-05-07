<template>
  <v-container id="retailer-detail-generate" data-id="retailer-detail-generate">
    <mp-block
      id="retailer-detail-generate-block"
      :title="$vuetify.breakpoint.smAndUp ? $t('page.retailerDetail.generate.title') : ''"
      :hasBorder="$vuetify.breakpoint.smAndUp"
      :hasMarginBottom="$vuetify.breakpoint.smAndUp"
      titleHasPaddingBottom
    >
      <v-row no-gutters>
        <v-col cols="12" class="icon-text-wrapper">
          <v-icon class="icon" size="1.6rem"> mdi-check-bold </v-icon>
          <span class="regular14" data-id="retailer-detail-generate-generate">
            {{
              generateInfos.generate
                ? $t('page.retailerDetail.generate.automatic')
                : $t('page.retailerDetail.generate.manual')
            }}
          </span>
        </v-col>
      </v-row>
      <v-row no-gutters v-if="generateInfos.generate" class="generate-wrapper">
        <v-col cols="12">
          <span class="medium16">
            {{
              generateInfos.prefix && generateInfos.generate
                ? $t(`page.createOrder.generateOrder.${generateInfos.prefix}`)
                : null
            }}
            {{ generateInfos.prefix && generateInfos.generate ? '+' : null }}
            {{ $t('page.detailOrder.billing.timestamp') }}
            {{ generateInfos.suffix && generateInfos.generate ? '+' : null }}
            {{
              generateInfos.suffix
                ? $t(`page.createOrder.generateOrder.${generateInfos.suffix}`)
                : null
            }}</span>
        </v-col>
      </v-row>
    </mp-block>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'

import { IdConfig } from '@/types'

import mpBlock from '@/components/block/block.vue'

export default Vue.extend({
  name: 'mp-retailer-detail-generate',
  components: {
    mpBlock,
  },
  props: {
    generateInfos: {
      type: Object as () => IdConfig,
      required: true,
    },
  },
})
</script>

<style lang="scss" scoped>
#retailer-detail-generate {
  padding: 0;

  @media #{map-get($display-breakpoints, 'xs-only')} {
    border-top: solid 0.1rem $main-lighten-74-color;
  }

  .prefix-label-outer-wrapper {
    margin-top: 2.1rem;

    span {
      color: $main-lighten-52-color;
    }
  }

  .prefix-value-outer-wrapper {
    margin-top: 0.5rem;
    padding-bottom: 0.6rem;
    border-bottom: dashed 0.1rem $main-lighten-52-color;

    span {
      color: $main-lighten-65-color;
    }
  }

  .suffix-label-outer-wrapper {
    margin-top: 2.1rem;

    span {
      color: $main-lighten-52-color;
    }
  }

  .suffix-value-outer-wrapper {
    margin-top: 0.5rem;
    padding-bottom: 0.6rem;
    border-bottom: dashed 0.1rem $main-lighten-52-color;

    span {
      color: $main-lighten-65-color;
    }
  }

  .icon-text-wrapper {
    display: flex;
    gap: 1.2rem;
  }

  .generate-wrapper {
    padding: 2rem;
    margin-top: 2.4rem;
    background-color: $main-lighten-80-color;
  }
}
</style>
