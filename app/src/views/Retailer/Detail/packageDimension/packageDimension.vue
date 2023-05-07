<template>
  <v-container id="retailer-package-dimension" data-id="retailer-package-dimension">
    <mp-block
      id="retailer-package-dimension-block"
      :title="$vuetify.breakpoint.smAndUp ? $t('page.retailerDetail.packageDimension.title') : ''"
      :hasBorder="$vuetify.breakpoint.smAndUp"
      :hasMarginBottom="$vuetify.breakpoint.smAndUp"
      titleHasPaddingBottom
    >
      <v-row class="package-dimension-wrapper" no-gutters>
        <v-col cols="12">
          <v-expansion-panels
            flat
            class="expension-panels"
            v-if="packagesDimensions && packagesDimensions.length > 0"
          >
            <mp-collapse
              v-for="(packageDimension, index) in packagesDimensions"
              :key="`package-dimension-${index}`"
              :title="packageDimension.label"
              hasBorder
              leftIcon="mdi-package"
              leftIconSize="1.8rem"
              :dataId="`retailer-detail-package-dimension-collapse-${index}-info`"
            >
              <v-row no-gutters class="data-container">
                <v-col cols="6">
                  <span class="regular14 main-lighten-52">
                    {{ $t('common.length') }}
                  </span>
                </v-col>
                <v-col cols="6" class="value">
                  <span class="regular14 main-color">
                    {{ packageDimension.dimension.length.value }}
                    {{ packageDimension.dimension.length.unit }}
                  </span>
                </v-col>
              </v-row>

              <v-row no-gutters class="data-container">
                <v-col cols="6">
                  <span class="regular14 main-lighten-52">
                    {{ $t('common.width') }}
                  </span>
                </v-col>
                <v-col cols="6" class="value">
                  <span class="regular14 main-color">
                    {{ packageDimension.dimension.width.value }}
                    {{ packageDimension.dimension.width.unit }}
                  </span>
                </v-col>
              </v-row>

              <v-row no-gutters class="data-container last">
                <v-col cols="6">
                  <span class="regular14 main-lighten-52">
                    {{ $t('common.height') }}
                  </span>
                </v-col>
                <v-col cols="6" class="value">
                  <span class="regular14 main-color">
                    {{ packageDimension.dimension.height.value }}
                    {{ packageDimension.dimension.height.unit }}
                  </span>
                </v-col>
              </v-row>
            </mp-collapse>
          </v-expansion-panels>

          <no-data v-else dataId="retailer-data-package-dimension-noData" />
        </v-col>
      </v-row>
    </mp-block>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'

import noData from '@/components/noData/noData.vue'
import mpBlock from '@/components/block/block.vue'

export default Vue.extend({
  name: 'package-dimension',
  components: {
    noData,
    mpBlock,
  },
  props: {
    packagesDimensions: {
      type: Array,
      default: () => [],
    },
  },
})
</script>

<style lang="scss">
@import '../../../../styles/mixins/macScrollbar';

#retailer-package-dimension {
  padding: 0;

  @media #{map-get($display-breakpoints, 'xs-only')} {
    border-top: solid 0.1rem $main-lighten-74-color;
  }

  .expension-panels {
    overflow: auto;
    @include setMacScrollbar('&');

    i {
      color: $main-color;
    }

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

  .package-dimension-wrapper {
    max-height: 34rem;
    overflow: auto;
    @include setMacScrollbar('&');
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
}
</style>
