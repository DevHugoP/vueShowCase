<template>
  <v-container id="retailer-detail-typology">
    <v-row no-gutters class="title-outer-wrapper" v-if="$vuetify.breakpoint.smAndUp">
      <v-col cols="12">
        <h2>{{ $t('page.retailerDetail.typologies.title') }}</h2>
      </v-col>
    </v-row>

    <v-row
      no-gutters
      v-for="(localTypology, index) in localTypologies"
      :key="`typology-${index}`"
      :class="`typology${index === localTypologies.length - 1 ? ' last' : ''}`"
    >
      <v-col cols="10">
        <span class="regular14">{{ $t(`technical.typologies.${localTypology.typologie}`) }}</span>
      </v-col>
      <v-col cols="2">
        <mp-switch v-model="localTypology.active" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { AVAILABLE_PRODUCT_TYPOLOGIES } from '@/constants/shared'
import Vue from 'vue'

export default Vue.extend({
  name: 'mp-retailer-detail-typology',
  props: {
    typologies: {
      type: Array,
      required: true,
    },
  },
  data: () => ({
    localTypologies: [] as Array<{ typologie: string; active: boolean }> | null,
  }),
  mounted() {
    this.localTypologies = Object.values(AVAILABLE_PRODUCT_TYPOLOGIES as unknown as string[]).map(
      typologie => {
        return {
          typologie,
          active: this.typologies.includes(typologie),
        }
      },
    )
  },
})
</script>

<style lang="scss">
#retailer-detail-typology {
  @media #{map-get($display-breakpoints, 'sm-and-up')} {
    border: solid 0.1rem $main-lighten-65-color;
    border-radius: 0.4rem;
    padding: 1.7rem 2.8rem 2rem 2.6rem;
    margin-top: 3.8rem;
  }

  @media #{map-get($display-breakpoints, 'xs-only')} {
    border-top: solid 0.1rem $main-lighten-74-color;
    padding-top: 1rem;
    padding-left: 2.5rem;
    padding-right: 2rem;
  }

  .title-outer-wrapper {
    margin-bottom: 2.3rem;
  }

  .typology {
    min-height: 5.4rem;
    border-bottom: solid 0.1rem $main-lighten-65-color;
    display: flex;
    align-items: center;

    &.last {
      border-bottom: none;
    }

    .v-input--switch {
      .v-input__slot {
        margin: 0;
      }

      .v-messages {
        display: none;
      }
    }
  }
}
</style>
