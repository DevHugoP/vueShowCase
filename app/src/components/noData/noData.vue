<template>
  <v-container id="no-data-container" :class="`no-data-container${blocMode == true ? '-bloc' : ''}`" :data-id="dataId">
    <v-row v-if="!blocMode" no-gutters class="title-outer-wrapper">
      <v-col cols="12" class="title-wrapper regular-14">
        <h2 class="woops-font">{{ $t('common.noData.woops') }}</h2>
      </v-col>
    </v-row>

    <v-row v-else no-gutters class="icon-outer-wrapper">
      <v-col cols="12" class="icon-wrapper">
        <v-icon size="2.4rem">mdi-cancel</v-icon>
      </v-col>
    </v-row>

    <v-row no-gutters class="text-outer-wrapper">
      <v-col cols="12" class="text-wrapper d-flex justify-center">
        <h4>{{ $t(content) }}</h4>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'no-data',
  props: {
    dataId: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      default: 'common.noData.generic',
    },
    blocMode: {
      type: Boolean,
      default: true, // change this when no-data is present everywhere else (this mimics the old one)
    },
  },
  async mounted() {
    if (!this.blocMode) {
      const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
      const header = document.getElementsByTagName('header')

      const orderFilters = document.getElementById('order-list-filter')
      const collectFilters = document.getElementById('collect-list-filter')
      const carrierFilters = document.getElementById('carrier-list-filter')
      const retailerFilters = document.getElementById('retailer-list-filter')
      const noDataContainer = document.getElementById('no-data-container')

      const selectedPage = collectFilters || orderFilters || retailerFilters || carrierFilters

      if (noDataContainer && selectedPage) {
        const headerTagsHeight = Array.from(header).reduce((acc, n) => acc += n.clientHeight, 0)
        const newHeight = vh - headerTagsHeight - selectedPage.clientHeight
        noDataContainer.style.height = `${newHeight}px`
      }
    }
  }
})
</script>

<style lang="scss" scoped>

.woops-font {
    font-family: $font-family-work !important;
}

.no-data-container-bloc {
  padding: 0;

  .icon-outer-wrapper {
    .icon-wrapper {
      display: flex;
      justify-content: center;

      i {
        color: $main-lighten-52-color;
      }
    }
  }

  .text-outer-wrapper {
    margin-top: 1.5rem;

    .text-wrapper {
      display: flex;
      justify-content: center;
      text-align: center;

      h4 {
        color: $main-lighten-52-color;
      }
    }
  }
}

.no-data-container {
  position: relative;
  background: url('~@/assets/illustrations/noData.svg') no-repeat center center ;

  @media #{map-get($display-breakpoints, 'xs-only')} {
    background-size: cover;
  }
  padding: 0;
  color: $main-lighten-52-color;

  .icon-outer-wrapper {
    margin-top: 1rem;

    .icon-wrapper {
      display: flex;
      justify-content: center;

      i {
        color: $main-lighten-52-color;
      }
    }
  }

  .title-outer-wrapper {
    margin-top: 4rem;
  }

  @media #{map-get($display-breakpoints, 'xs-only')} {
    .title-outer-wrapper {
      margin-top: 1rem;
    }
  }

  .title-outer-wrapper {
    .title-wrapper {
      display: flex;
      justify-content: center;
    }
  }

  .text-outer-wrapper {
    margin-top: 1.5rem;
    margin-bottom: 3rem;

    .text-wrapper {
      display: flex;
      justify-content: center;
      text-align: center;
    }
  }
}
</style>
