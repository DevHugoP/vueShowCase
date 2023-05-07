<template>
  <mp-block
    dataId="carrier-detail-characteristic"
    id="carrier-detail-characteristic"
    :title="$vuetify.breakpoint.smAndUp ? $t('page.carrier.specifications.title') : ''"
    :hasBorder="$vuetify.breakpoint.smAndUp"
    :hasMarginBottom="$vuetify.breakpoint.smAndUp"
    titleHasPaddingBottom
    :hasEditIcon="hasEditIcon"
    @clickOnIcon="showModal = true"
  >
    <v-row no-gutters class="characteristic-wrapper">
      <v-col cols="auto">
        <v-icon size="1.8rem" v-if="orderEligibility.storageAvailability"> mdi-check-bold </v-icon>
        <v-icon size="1.8rem" class="icon-error" v-else> mdi-close-thick </v-icon>
      </v-col>
      <v-col
        :class="$vuetify.breakpoint.smAndUp ? 'regular14 main-color' : 'regular16'"
        data-id="carrier-detail-characteristic-capacity"
      >
        {{ $t('page.carrier.specifications.storage') }}
      </v-col>
    </v-row>

    <v-row
      no-gutters
      v-for="(spec, key, index) in orderEligibility.specifications"
      :key="`carrier-specifications-block-${index}`"
      class="characteristic-wrapper"
    >
      <v-col cols="auto">
        <v-icon size="1.8rem" v-if="spec">
          mdi-check-bold
        </v-icon>
        <v-icon size="1.8rem" class="icon-error" v-else> mdi-close-thick </v-icon>
      </v-col>
      <v-col
        :class="$vuetify.breakpoint.smAndUp ? 'regular14' : 'regular16'"
        data-id="carrier-detail-characteristic-label"
      >
        {{ $t(`page.carrier.specifications.${key}`) }}
      </v-col>
    </v-row>

    <carrier-detail-specification-modal
      v-if="showModal"
      :orderEligibility="orderEligibility"
      :parent="parent"
      @close="showModal = false"
      :params="params"
    />
  </mp-block>
</template>

<script lang="ts">
import { GetCarrierParams } from '@/services/carrier/CarrierRepository'
import Vue from 'vue'

import { CarrierEligibilityEntity, getDefaultSpecifications } from '@/types'

import mpBlock from '@/components/block/block.vue'
import carrierDetailSpecificationModal from './specificationModal.vue'

export default Vue.extend({
  name: 'mp-carrier-detail-specification',
  components: {
    mpBlock,
    carrierDetailSpecificationModal,
  },
  props: {
    orderEligibility: {
      type: Object as () => CarrierEligibilityEntity,
      required: true,
    },
    parent: {
      validator: prop => typeof prop === 'object' || prop === null,
      required: true,
    },
    hasEditIcon: {
      type: Boolean,
      default: false,
    },
    params: {
      type: Object as () => GetCarrierParams,
      required: true,
    },
  },
  data: () => ({
    showModal: false,
  }),
  beforeMount() {
    this.orderEligibility.specifications = {
      ...getDefaultSpecifications(),
      ...this.orderEligibility.specifications,
    }
  },
})
</script>

<style lang="scss" scoped>
#carrier-detail-characteristic {
  padding: 0;

  @media #{map-get($display-breakpoints, 'xs-only')} {
    border-top: solid 0.1rem $main-lighten-74-color;
  }

  .icon-error {
    color: $error-color;
  }

  .weight-outer-wrapper {
    margin-bottom: 1rem;
    display: flex;
    align-items: center;

    @media #{map-get($display-breakpoints, 'xs-only')} {
      margin-top: 2.5rem;
      margin-bottom: 4rem;
    }

    .noLimit {
      display: flex;
      justify-content: flex-end;
    }

    .max-kilogram-wrapper,
    .min-kilogram-wrapper {
      display: flex;
      justify-content: flex-end;
      align-items: center;

      .carrier-detail-characteristic-maxKilogramCapacity,
      .carrier-detail-characteristic-minKilogramCapacity {
        display: flex;
        word-break: break-all;
        text-align: right;
      }

      span {
        margin-left: 0.2rem;
      }
    }
  }

  .characteristic-wrapper {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding-bottom: 1.6rem;
    padding-left: 0;

    &:last-of-type {
      padding-bottom:0;
    }

    i {
      margin-right: 1.2rem;
    }
  }
}
</style>
