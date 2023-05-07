<template>
  <v-container id="carrier-detail-pickuppoint" data-id="carrier-detail-pickupoint">
    <mp-block
      id="carrier-detail-pickuppoint-block"
      :title="$vuetify.breakpoint.smAndUp ? $t('page.carrier.pickupPoint.title') : ''"
      :hasBorder="$vuetify.breakpoint.smAndUp"
      :hasMarginBottom="$vuetify.breakpoint.smAndUp"
      titleHasPaddingBottom
    >
      <v-row no-gutters>
        <v-col cols="12" v-if="!config.categories">
          <mp-pickup-point-data :config="config" :activeCategories="activeCategories" />
        </v-col>
        <v-col
          cols="12"
          v-else
          v-for="(categoryConfig, category) in config.categories"
          :key="category"
        >
          <mp-pickup-point-data
            :config="categoryConfig"
            :category="category"
            :activeCategories="activeCategories"
          />
        </v-col>
      </v-row>
    </mp-block>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'

import mpBlock from '@/components/block/block.vue'
import mpPickupPointData from './pickupPointData.vue'
import { Unit } from '@/types'

export type PickupPointConfig = Record<
  string,
  | {
      packageMaxWeight?: Unit
      packageMaxGirth?: Unit
      packageMaxCombinedLength?: Unit
      packageMaxDimension?: Unit
      types?: string[]
    }
  | {
      types?: string[]
      categories: Record<
        string,
        {
          packageMaxWeight?: Unit
          packageMaxGirth?: Unit
          packageMaxCombinedLength?: Unit
          packageMaxDimension?: Unit
        }
      >
    }
>

export default Vue.extend({
  name: 'mp-carrier-detail-pickuppoint',
  components: {
    mpBlock,
    mpPickupPointData,
  },
  props: {
    config: {
      type: Object as () => PickupPointConfig,
      required: true,
    },
    activeCategories: {
      type: Object as () => Record<string, boolean>,
      default: () => {
        return {}
      },
    },
  },
})
</script>

<style lang="scss">
@import '../../../../../styles/mixins/macScrollbar';

#carrier-detail-pickuppoint {
  padding: 0;

  @media #{map-get($display-breakpoints, 'xs-only')} {
    border-top: solid 0.1rem $main-lighten-74-color;
  }

  .characteristic-outer-wrapper {
    margin-bottom: 1rem;
    display: flex;
    align-items: center;

    .characteristic-wrapper {
      display: flex;
      justify-content: flex-end;
      align-items: center;

      .characteristic-detail-wrapper {
        display: flex;
        word-break: break-all;
        text-align: right;
      }

      span {
        margin-left: 0.2rem;
      }
    }
  }
}
.types-wrapper {
  margin-bottom: 0.5rem;
}
.category-wrapper {
  min-height: 6.2rem;

  h4 {
    display: inline-flex;
  }
  @media #{map-get($display-breakpoints, 'xs-only')} {
    min-height: 3.2rem;
  }

  border-bottom: solid 0.1rem $main-lighten-74-color;
  &:last-child {
    border-bottom: 0;
  }

  .category-wrapper-title {
    display: flex;
    i {
      margin-right: 1rem;
    }
  }
}
</style>
