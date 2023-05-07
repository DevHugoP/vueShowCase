<template>
  <v-row no-gutters id="pickup-point-data" class="mb-5">
    <v-col cols="12" v-if="category" class="d-flex mt-3">
      <v-icon size="1.8rem" class="mr-4" v-if="activeCategories[category] !== false">
        mdi-check-bold
      </v-icon>
      <v-icon size="1.8rem" class="mr-4" color="red" v-else> mdi-close-thick </v-icon>
      <span class="regular14 main-color">
        {{ $t('page.carrier.pickupPoint.category') }} {{ category }}
      </span>
    </v-col>

    <v-col cols="12" class="data" v-if="config.packageMaxWeight">
      <span class="regular14 main-lighten-52">
        {{ $t('page.carrier.pickupPoint.packageMaxWeight') }}
      </span>
      <span data-id="carrier-detail-pickuppoint-packageMaxWeight" class="regular14 main-color ml-auto">
        {{ config.packageMaxWeight.value }} {{ $t('common.unit.kilogram') }}
      </span>
    </v-col>

    <v-col cols="12" class="data" v-if="config.packageMaxDimension">
      <span class="regular14 main-lighten-52">
        {{ $t('page.carrier.pickupPoint.packageMaxDimension') }}
      </span>
      <span data-id="carrier-detail-pickuppoint-packageMaxDimension" class="regular14 main-color ml-auto">
        {{ config.packageMaxDimension.value }} {{ $t('common.unit.centimeter') }}
      </span>
    </v-col>

    <v-col cols="12" class="data" v-if="config.packageMaxGirth">
      <span class="regular14 main-lighten-52">
        {{ $t('page.carrier.pickupPoint.packageMaxGirth') }}
      </span>
      <span data-id="carrier-detail-pickuppoint-packageMaxGirth" class="regular14 main-color ml-auto">
        {{ config.packageMaxGirth.value }} {{ $t('common.unit.centimeter') }}
      </span>
    </v-col>

    <v-col cols="12" class="data" v-if="config.packageMaxCombinedLength">
      <span class="regular14 main-lighten-52">
        {{ $t('page.carrier.pickupPoint.packageMaxCombinedLength') }}
      </span>
      <span data-id="carrier-detail-pickuppoint-packageMaxCombinedLength" class="regular14 main-color ml-auto">
        {{ config.packageMaxCombinedLength.value }} {{ $t('common.unit.centimeter') }}
      </span>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'
import { PickupPointConfig } from './pickuppoint.vue'

export default Vue.extend({
  name: 'mp-carrier-detail-pickuppointData',
  props: {
    config: {
      type: Object as () => PickupPointConfig,
      required: true,
    },
    category: {
      type: String,
      required: true
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

<style lang="scss" scoped>
#pickup-point-data {
  .data {
    display: flex;
    align-items: center;
    padding: 1.4rem 0;
    border-bottom: 0.1rem solid $main-lighten-74-color;

    &:first-of-type {
      padding-top: 0;
    }

    &:last-of-type {
      border: none;
      padding-bottom: 0;
    }
  }
}
</style>
