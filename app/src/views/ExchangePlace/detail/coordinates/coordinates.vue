<template>
  <v-container id="exchange-place-detail-coordinates" data-id="exchange-place-detail-coordinates">
    <mp-block
      id="exchange-place-detail-coordinates-block"
      :title="$vuetify.breakpoint.smAndUp ? $t('page.exchangePlace.coordinates.title') : ''"
      :hasBorder="$vuetify.breakpoint.smAndUp"
      :hasMarginBottom="$vuetify.breakpoint.smAndUp"
      titleHasPaddingBottom
      :padding="$vuetify.breakpoint.smAndUp ? '2.6rem' : '1.6rem 0 0 0 !important'"
    >
      <v-row
        no-gutters
        class="coordinates-outer-wrapper"
      >
        <v-col cols="8">
          <span :class="`main-lighten-52 ${$vuetify.breakpoint.smAndUp ? 'regular14' : 'regular16'}`">
            {{ $t('page.exchangePlace.coordinates.latitude') }}
          </span>
        </v-col>
        <v-col cols="4" class="coordinates-wrapper">
          <span
            :class="$vuetify.breakpoint.smAndUp ? 'main-color regular14' : 'regular16'"
            data-id="exchange-place-detail-coordinates-latitude"
          >
            {{ coordinates.latitude }}
          </span>
        </v-col>
      </v-row>

      <v-divider v-if="$vuetify.breakpoint.xsOnly" />

      <v-row
        no-gutters
        :class="
          `coordinates-outer-wrapper coordinates-outer-wrapper-last${
            $vuetify.breakpoint.xsOnly ? ' mt-4' : ''
          }`
        "
      >
        <v-col cols="8">
          <span :class="`main-lighten-52 ${$vuetify.breakpoint.smAndUp ? 'regular14' : 'regular16'}`">
            {{ $t('page.exchangePlace.coordinates.longitude') }}
          </span>
        </v-col>
        <v-col cols="4" class="coordinates-wrapper">
          <span
            :class="$vuetify.breakpoint.smAndUp ? 'main-color regular14' : 'regular16'"
            data-id="exchange-place-detail-coordinates-longitude"
          >
            {{ coordinates.longitude }}
          </span>
        </v-col>
      </v-row>
    </mp-block>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'

import { Coordinates } from '@/types'

import mpBlock from '@/components/block/block.vue'

export default Vue.extend({
  name: 'exchange-place-detail-coordinates',
  components: {
    mpBlock,
  },
  props: {
    coordinates: {
      type: Object as () => Coordinates,
      required: true,
    },
  },
})
</script>

<style lang="scss" scoped>
#exchange-place-detail-coordinates {
  padding: 0;

  @media #{map-get($display-breakpoints, 'xs-only')} {
    border-top: solid 0.1rem $main-lighten-74-color;
  }

  .coordinates-wrapper {
    text-align: right;
  }

  .coordinates-outer-wrapper {
    margin-bottom: 1.6rem;
    display: flex;
    align-items: center;

    @media #{map-get($display-breakpoints, 'sm-and-up')} {
      padding-bottom: 1.6rem;
      margin-bottom: 1.6rem;
      border-bottom: solid 0.1rem $main-lighten-74-color;
    }

    &-last {
      border-bottom: none;
      padding-bottom: 0;
      margin-bottom: 0;
    }
  }
}
</style>
