<template>
  <mp-block
    id="carrier-detail-capacity"
    :title="$vuetify.breakpoint.smAndUp ? $t('page.carrier.capacities') : ''"
    :hasBorder="$vuetify.breakpoint.smAndUp"
    :hasMarginBottom="$vuetify.breakpoint.smAndUp"
    titleHasPaddingBottom
    v-if="orderEligibility"
    :hasEditIcon="hasEditIcon"
    @clickOnIcon="showModal = true"
  >
    <v-row no-gutters class="chip-outer-wrapper">
      <v-chip
        v-for="(capacityBlock, key) in availableCapacityBlocks"
        :key="`carrier-detail-capacity-block-${key}`"
        :class="
          `chip chip-${
            currentCapacityBlock === capacityBlock.value ? 'selected' : 'no-selected'
          } chip-${$vuetify.breakpoint.smAndUp ? 'dsk' : 'mobile'}`
        "
        @click="changeBlock(capacityBlock.value)"
        :data-id="`carrier-detail-capacity-block-${key}`"
      >
        {{ capacityBlock.label }}
      </v-chip>
    </v-row>

    <v-row
      no-gutters
      class="weight-outer-wrapper"
      v-if="currentCapacityBlock === CapacityType.WEIGHT"
    >
      <v-col cols="12" class="info-wrapper">
        <span class="regular14 main-lighten-52">
          {{ $t('page.carrier.capacity.labels.minWeight') }}
        </span>
        <span class="regular14 text-right value-capacity">
          {{
            orderEligibility.minKilogramCapacity && orderEligibility.minKilogramCapacity !== '0'
              ? `${orderEligibility.minKilogramCapacity} ${$t('common.unit.kilogram')}`
              : '--'
          }}
        </span>
      </v-col>

      <v-col cols="12" class="info-wrapper">
        <span class="regular14 main-lighten-52">
          {{ $t('page.carrier.capacity.labels.maxWeight') }}
        </span>
        <span class="regular14 text-right value-capacity">
          {{
            orderEligibility.maxKilogramCapacity && orderEligibility.maxKilogramCapacity !== '0'
              ? `${orderEligibility.maxKilogramCapacity} ${$t('common.unit.kilogram')}`
              : '--'
          }}
        </span>
      </v-col>

      <v-col cols="12" class="info-wrapper">
        <span class="regular14 main-lighten-52">
          {{ $t('page.carrier.capacity.labels.packageMinWeight') }}
        </span>
        <span class="regular14 text-right value-capacity">
          {{
            orderEligibility.packageMinWeight && orderEligibility.packageMinWeight !== 0
              ? `${orderEligibility.packageMinWeight} ${$t('common.unit.kilogram')}`
              : '--'
          }}
        </span>
      </v-col>

      <v-col cols="12" class="info-wrapper">
        <span class="regular14 main-lighten-52">
          {{ $t('page.carrier.capacity.labels.packageMaxWeight') }}
        </span>
        <span class="regular14 text-right value-capacity">
          {{
            orderEligibility.packageMaxWeight && orderEligibility.packageMaxWeight !== 0
              ? `${orderEligibility.packageMaxWeight} ${$t('common.unit.kilogram')}`
              : '--'
          }}
        </span>
      </v-col>
    </v-row>

    <v-row
      no-gutters
      class="weight-outer-wrapper"
      v-if="currentCapacityBlock === CapacityType.DIMENSION"
    >
      <v-col cols="12" class="info-wrapper" id="minCombinedLength">
        <span class="regular14 main-lighten-52">
          {{ $t('page.carrier.capacity.labels.minCombinedLength') }}
        </span>
        <v-tooltip bottom attach="#minCombinedLength">
          <template v-slot:activator="{ on, attrs }">
            <v-icon size="2.0rem" class="ml-4 main-lighten-52" v-bind="attrs" v-on="on">
              mdi-information-outline
            </v-icon>
          </template>
          <span>{{ $t('page.carrier.capacity.tooltips.combinedLength') }}</span>
        </v-tooltip>
        <v-spacer />
        <span class="regular14 text-right value-capacity">
          {{
            orderEligibility.minCombinedLength && orderEligibility.minCombinedLength !== 0
              ? `${orderEligibility.minCombinedLength} ${$t('common.unit.centimeter')}`
              : '--'
          }}
        </span>
      </v-col>

      <v-col cols="12" class="info-wrapper" id="maxCombinedLength">
        <span class="regular14 main-lighten-52">
          {{ $t('page.carrier.capacity.labels.maxCombinedLength') }}
        </span>
        <v-tooltip bottom attach="#maxCombinedLength">
          <template v-slot:activator="{ on, attrs }">
            <v-icon size="2.0rem" class="ml-4 main-lighten-52" v-bind="attrs" v-on="on">
              mdi-information-outline
            </v-icon>
          </template>
          <span>{{ $t('page.carrier.capacity.tooltips.combinedLength') }}</span>
        </v-tooltip>
        <v-spacer />
        <span class="regular14 text-right value-capacity">
          {{
            orderEligibility.maxCombinedLength && orderEligibility.maxCombinedLength !== 0
              ? `${orderEligibility.maxCombinedLength} ${$t('common.unit.centimeter')}`
              : '--'
          }}
        </span>
      </v-col>

      <v-col cols="12" class="info-wrapper">
        <span class="regular14 main-lighten-52">
          {{ $t('page.carrier.capacity.labels.minLength') }}
        </span>
        <span class="regular14 text-right value-capacity">
          {{
            orderEligibility.minLength && orderEligibility.minLength !== 0
              ? `${orderEligibility.minLength} ${$t('common.unit.centimeter')}`
              : '--'
          }}
        </span>
      </v-col>

      <v-col cols="12" class="info-wrapper">
        <span class="regular14 main-lighten-52">
          {{ $t('page.carrier.capacity.labels.maxLength') }}
        </span>
        <span class="regular14 text-right value-capacity">
          {{
            orderEligibility.maxLength && orderEligibility.maxLength !== 0
              ? `${orderEligibility.maxLength} ${$t('common.unit.centimeter')}`
              : '--'
          }}
        </span>
      </v-col>

      <v-col cols="12" class="info-wrapper" id="maxDevelopedDimensions">
        <span class="regular14 main-lighten-52">
          {{ $t('page.carrier.capacity.labels.maxDevelopedDimensions') }}
        </span>
        <v-tooltip bottom attach="#maxDevelopedDimensions">
          <template v-slot:activator="{ on, attrs }">
            <v-icon size="2.0rem" class="ml-4 main-lighten-52" v-bind="attrs" v-on="on">
              mdi-information-outline
            </v-icon>
          </template>
          <span>{{ $t('page.carrier.capacity.tooltips.maxDevelopedDimensions') }}</span>
        </v-tooltip>
        <v-spacer />
        <span class="regular14 text-right value-capacity">
          {{
            orderEligibility.maxDevelopedDimensions && orderEligibility.maxDevelopedDimensions !== 0
              ? `${orderEligibility.maxDevelopedDimensions} ${$t('common.unit.centimeter')}`
              : '--'
          }}
        </span>
      </v-col>

      <v-col cols="12" class="info-wrapper">
        <span class="regular14 main-lighten-52">
          {{ $t('page.carrier.capacity.labels.maxHeight') }}
        </span>
        <span class="regular14 text-right value-capacity">
          {{
            orderEligibility.maxHeight && orderEligibility.maxHeight !== 0
              ? `${orderEligibility.maxHeight} ${$t('common.unit.centimeter')}`
              : '--'
          }}
        </span>
      </v-col>
    </v-row>

    <v-row
      no-gutters
      class="weight-outer-wrapper"
      v-if="currentCapacityBlock === CapacityType.DISTANCE"
    >
      <v-col cols="12" class="info-wrapper">
        <span class="regular14 main-lighten-52">
          {{ $t('page.carrier.capacity.labels.minKilometricDistance') }}
        </span>
        <span class="regular14 text-right value-capacity">
          {{
            orderEligibility.minKilometricDistance && orderEligibility.minKilometricDistance !== 0
              ? `${orderEligibility.minKilometricDistance} ${$t('common.unit.kilometer')}`
              : '--'
          }}
        </span>
      </v-col>

      <v-col cols="12" class="info-wrapper">
        <span class="regular14 main-lighten-52">
          {{ $t('page.carrier.capacity.labels.maxKilometricDistance') }}
        </span>
        <span class="regular14 text-right value-capacity">
          {{
            orderEligibility.maxKilometricDistance && orderEligibility.maxKilometricDistance !== 0
              ? `${orderEligibility.maxKilometricDistance} ${$t('common.unit.kilometer')}`
              : '--'
          }}
        </span>
      </v-col>
    </v-row>

    <v-row
      no-gutters
      class="weight-outer-wrapper"
      v-if="currentCapacityBlock === CapacityType.PACKAGE"
    >
      <v-col cols="12" class="info-wrapper">
        <span class="regular14 main-lighten-52">
          {{ $t('page.carrier.capacity.labels.maxPackageQuantity') }}
        </span>
        <span class="regular14 text-right value-capacity">
          {{
            orderEligibility.maxPackageQuantity && orderEligibility.maxPackageQuantity !== 0
              ? orderEligibility.maxPackageQuantity
              : '--'
          }}
        </span>
      </v-col>
    </v-row>

    <capacity-modal
      v-if="showModal"
      @close="showModal = false"
      :orderEligibility="orderEligibility"
      :carrierParent="carrierParent"
      :params="params"
      @submit="showModal = false"
    />
  </mp-block>
</template>

<script lang="ts">
import { GetCarrierParams } from '@/services/carrier/CarrierRepository'
import Vue from 'vue'
import { CarrierEligibilityEntity } from '@/types'
import mpBlock from '@/components/block/block.vue'

import capacityModal from './capacityModal.vue'

export enum CapacityType {
  WEIGHT = 'WEIGHT',
  DIMENSION = 'DIMENSION',
  DISTANCE = 'DISTANCE',
  PACKAGE = 'PACKAGE',
}

export default Vue.extend({
  name: 'mp-carrier-detail-capacity',
  components: {
    mpBlock,
    capacityModal,
  },
  props: {
    orderEligibility: {
      type: Object as () => CarrierEligibilityEntity,
      required: true,
    },
    carrierParent: {
      type: Object as () => CarrierEligibilityEntity | null,
      default: null,
    },
    params: {
      type: Object as () => GetCarrierParams,
      required: true,
    },
    hasEditIcon: {
      type: Boolean,
      required: true,
    },
  },
  data: () => ({
    currentCapacityBlock: CapacityType.WEIGHT,
    CapacityType,
    showModal: false,
  }),
  computed: {
    availableCapacityBlocks() {
      return Object.values(CapacityType).map(value => ({
        label: this.$t(`technical.capacity.type.${value}`),
        value,
      }))
    },
  },
  methods: {
    changeBlock(currentBlock: CapacityType) {
      this.currentCapacityBlock = currentBlock
    },
  },
})
</script>

<style lang="scss" scoped>
@import '../../../../../styles/mixins/macScrollbar';

#carrier-detail-capacity {
  @media #{map-get($display-breakpoints, 'sm-and-up')} {
    border: solid 0.1rem $main-lighten-65-color;
    border-radius: 0.4rem;
    padding: 1.7rem 2.3rem 2rem 2.7rem;
  }

  @media #{map-get($display-breakpoints, 'xs-only')} {
    border-top: solid 0.1rem $main-lighten-74-color;
    padding-top: 1rem;
    padding-left: 2.5rem;
    padding-right: 3.6rem;
  }

  .title-outer-wrapper {
    margin-bottom: 2.3rem;
  }

  .weight-outer-wrapper {
    display: flex;
    align-items: center;

    .max-kilogram-wrapper,
    .min-kilogram-wrapper {
      display: flex;
      justify-content: flex-end;
      align-items: center;

      .carrier-detail-capacity-maxKilogramCapacity,
      .carrier-detail-capacity-minKilogramCapacity {
        display: flex;
        word-break: break-all;
        text-align: right;
      }

      span {
        margin-left: 0.2rem;
      }
    }
  }

  .weight-outer-wrapper {
    .info-wrapper {
      display: flex;
      justify-content: space-between;
      border-bottom: 0.1rem solid $main-lighten-74-color;
      padding-bottom: 1.6rem;
      padding-top: 1.6rem;

      &:first-of-type {
        padding-top: 0;
      }

      &:last-of-type {
        padding-bottom: 0;
        border-bottom: none;
      }
    }
  }

  .chip-outer-wrapper {
    margin-bottom: 1.5rem;
    display: flex;
    row-gap: 1rem;
    column-gap: 1rem;
    overflow: auto;
    flex-wrap: nowrap;
    @include setMacScrollbar('&');

    .chip {
      cursor: pointer;
      max-width: fit-content;
      min-width: fit-content;

      &.chip-dsk {
        .v-chip__content {
          @include regular-14;
        }
      }

      &.chip-mobile {
        .v-chip__content {
          @include regular-16;
        }
      }

      &.chip-selected {
        background-color: $white;
        border: solid 0.2rem $main-color;
        border-radius: 5rem;
        cursor: default;
      }

      &.chip-no-selected {
        background-color: $white;
        border: solid 0.1rem $main-lighten-74-color;
      }
    }
  }

  .value-capacity {
    min-width: 3rem;
    display: flex;
    align-items: center;
    padding-left: 1rem;
  }
}
</style>
