<template>
  <v-container id="carrier-detail-retailer" data-id="carrier-detail-retailer">
    <mp-block
      id="carrier-detail-retailer-block"
      :hasBorder="$vuetify.breakpoint.smAndUp"
      :hasMarginBottom="$vuetify.breakpoint.smAndUp"
      :title="$vuetify.breakpoint.smAndUp ? $t('common.retailer') : ''"
      titleHasPaddingBottom
    >
      <no-data
        v-if="retailers && !retailers.length"
        dataId="carrrier-detail-service-block-noData"
        :content="$t('common.noData.retailer')"
      />
      <div class="retailer-wrapper" :style="{ maxHeight }">
        <v-row
          v-for="(retailer, index) in retailers"
          :key="`retailer-${index}`"
          :ref="`retailer-${index}`"
          :class="`retailer${index === retailers.length - 1 ? ' no-border-bottom' : ''}`"
          :data-id="`carrier-detail-retailer-${index}`"
          no-gutters
        >
          <v-col class="infos-wrapper d-flex" cols="12">
            <router-link
              :to="{ name: ROUTES.detailRetailer, params: { id: retailer.id } }"
              class="infos-link_wrapper"
            >
              <div class="infos">
                <div class="logo">
                  <v-img
                    class="logo"
                    contain
                    :src="retailer.logo"
                    :alt="retailer.name"
                    v-if="retailer.logo"
                    :data-id="`retailer-${index}-name`"
                  />
                </div>
                <span
                  :data-id="`retailer-${index}-name`"
                  :class="`name regular14${$vuetify.breakpoint.smAndUp ? ' pl-2' : ''}`"
                >
                  {{ retailer.name }}
                </span>
              </div>
              <v-spacer />
              <v-icon size="1.8rem" class="main-color">mdi-chevron-right</v-icon>
            </router-link>
          </v-col>
        </v-row>
      </div>
    </mp-block>
  </v-container>
</template>

<script lang="ts">
import mpBlock from '@/components/block/block.vue'
import noData from '@/components/noData/noData.vue'

import { ROUTES } from '@/constants'
import Vue from 'vue'

export default Vue.extend({
  name: 'carrier-detail-retailer',
  components: {
    mpBlock,
    noData,
  },
  props: {
    retailers: {
      type: Array,
      required: true,
    },
  },
  data: () => ({
    ROUTES,
    maxHeight: 'fit-content',
  }),
  mounted() {
    if (this.$vuetify.breakpoint.xsOnly) {
      return
    }
    this.$nextTick(() => {
      if (this.$refs['retailer-0']) {
        const oneElementHeight = (this.$refs['retailer-0'] as any)[0].offsetHeight

        const numberOfElement = Object.keys(this.$refs).filter(retailerName =>
          retailerName.includes('retailer'),
        ).length

        if (numberOfElement > 5) {
          this.maxHeight = `${oneElementHeight * 5}px`
        }
      }
    })
  },
})
</script>

<style lang="scss" scoped>
@import '../../../../styles/mixins/macScrollbar';

#carrier-detail-retailer {
  padding: 0;

  @media #{map-get($display-breakpoints, 'xs-only')} {
    border-top: solid 0.1rem $main-lighten-74-color;
  }

  .retailer-wrapper {
    overflow-y: auto;
    overflow-x: hidden;
    @include setMacScrollbar('&');
  }

  .retailer {
    display: flex;
    align-items: center;
    border-bottom: solid 0.1rem $main-lighten-74-color;
    padding-bottom: 1.6rem;
    margin-bottom: 1.6rem;

    &.no-border-bottom {
      border-bottom: none;
      padding-bottom: 0;
      margin-bottom: 0;
    }

    .infos-link_wrapper {
      text-decoration: none;
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .infos {
      padding-left: 1rem;
      cursor: pointer;
      display: flex;
      align-items: center;

      .logo {
        max-height: 4rem;
        max-width: 7rem;
        margin-bottom: 0.2rem;

        @media #{map-get($display-breakpoints, 'xs-only')} {
          margin-right: 1rem;
        }
      }
    }

    .name {
      color: $main-lighten-52-color;
      cursor: pointer;
    }

    .append-icon {
      cursor: pointer;
      display: flex;
      justify-content: center;
    }
  }
}
</style>
