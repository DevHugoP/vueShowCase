<template>
  <div id="summary-upper-container">
    <div id="summary-container" v-if="$vuetify.breakpoint.smAndUp">
      <h2 class="padding-block">{{ $t('page.order.summary.title') }}</h2>

      <div :class="`carriers-wrapper padding-block${!filteredCarriers.length ? ' empty' : ''}`">
        <div class="d-flex align-baseline">
          <h2>{{ filteredCarriers.length }}</h2>
          <span class="regular16">
            {{
              $t('page.order.summary.eligibleCarriers', {
                count: filteredCarriers.length,
              })
            }}
          </span>
        </div>
        <div class="d-flex align-center" v-if="filteredCarriers.length">
          <span class="medium16 show-dialog-btn " @click="showCarrier = true">
            {{ $t('common.detail_plural') }}
          </span>
        </div>
      </div>

      <div class="block-divider" v-if="stepNumber > 1" />

      <div class="step-container" v-if="miscellaneous.checkout">
        <div v-for="(step, stepName) in miscellaneous.checkout.steps" :key="`step-${stepName}`">
          <div v-if="stepName[4] < stepNumber" class="step-wrapper padding-block">
            <!-- stepNumer -->
            <div class="step-number">
              <span class="medium14">{{ stepName[4] }}</span>
            </div>

            <!-- blocks -->
            <div class="block-container">
              <div
                class="block-wrapper"
                v-for="block in step.filter(s => sendToSummaryBlock(s))"
                :key="`step-${stepName}-${block}`"
              >
                <summary-block :block="block" />
              </div>
            </div>

            <!-- Edit -->
            <div class="edit-wrapper" @click="$emit('goToStep', stepName[4])">
              <v-icon size="1.6rem" class="main-lighten-65">mdi-pencil</v-icon>
            </div>
          </div>

          <div class="block-divider" v-if="parseInt(stepName[4], 10) + 1 < stepNumber" />
        </div>
      </div>
    </div>

    <div class="summary-wrapper-mobile" v-else-if="$vuetify.breakpoint.smAndDown">
      <v-btn
        v-if="arrival.arrivalType === 'HOME'"
        fab
        class="fab-button"
        @click="showCarrier = true"
      >
        <v-icon>mdi-truck</v-icon>
      </v-btn>
    </div>

    <mp-dialog-confirmation
      v-if="showCarrier"
      classWrapper="order-create-summary-carrier-eligible"
      dataId="order-create-summary-carrierEligible"
      color="primary"
      @close="showCarrier = false"
      :header="{
        iconClose: 'mdi-close',
        icon: $vuetify.breakpoint.smAndUp ? 'mdi-truck' : '',
        isColorBackground: true,
        text: $t('page.order.summary.eligibleCarriers'),
        textPolice: 'regular14',
      }"
      :fullscreen="$vuetify.breakpoint.xsOnly"
    >
      <template #content>
        <v-row no-gutters v-if="filteredCarriers.length">
          <v-col
            cols="10"
            offset="1"
            class="carrier-wrapper"
            v-for="(carrier, index) in filteredCarriers"
            :key="`carriers-${index}`"
          >
            <h4>{{ carrier.Carrier.name }}</h4>
            <v-img
              :src="carrier.Carrier.logo"
              max-height="6rem"
              max-width="13rem"
              contain
              class="ml-auto"
            />
          </v-col>
        </v-row>
        <v-row no-gutters v-else class="mt-11 mb-5">
          <v-col cols="10" offset="1" class="mb-2">
            <div>
              <div class="d-flex align-center mb-3">
                <v-icon color="error-color" size="1.8rem">mdi-alert-decagram</v-icon>
                <span class="error-color ml-2 medium14">
                  {{ $t('page.order.summary.noCarriers') }}
                </span>
              </div>

              <h3 class="mb-3">
                {{ $t('page.order.summary.noCarriersInfo') }}
              </h3>
              <div
                v-for="(error, index) in miscellaneous.errorMessages"
                :key="`eligibility-errors-${index}`"
              >
                <span class="regular14"> - {{ $t(error) }} </span>
              </div>
            </div>
          </v-col>
        </v-row>
      </template>
    </mp-dialog-confirmation>
  </div>
</template>

<script lang="ts">
import { AVAILABLE_LEVEL_SERVICES } from '@/constants/shared'
import {
  CreateOrderStateEligibility,
  CreateOrderStateMiscellaneous,
} from '@/store/modules/createOrder/types'

import summaryBlock from './summaryBlock.vue'
import Vue from 'vue'
import { CHECKOUT_BLOCKS, CarrierEligibilityEntity } from '@/types'
import { CreateOrderStateService } from '@/store/modules/createOrder/service/types'
import { CreateOrderStateArrival } from '@/store/modules/createOrder/arrival/types'

export default Vue.extend({
  name: 'order-create-summary',
  components: {
    summaryBlock,
  },
  props: {
    stepNumber: {
      type: Number,
      required: true,
    },
  },
  data: () => ({
    showCarrier: false,
    AVAILABLE_LEVEL_SERVICES,
    CHECKOUT_BLOCKS,
  }),
  computed: {
    service(): CreateOrderStateService {
      return this.$store.getters['createOrder/service/service']
    },
    arrival(): CreateOrderStateArrival {
      return this.$store.getters['createOrder/arrival/arrival']
    },
    miscellaneous(): CreateOrderStateMiscellaneous {
      return this.$store.getters['createOrder/miscellaneous']
    },
    eligibility(): CreateOrderStateEligibility {
      return this.$store.getters['createOrder/eligibility']
    },
    filteredCarriers(): CarrierEligibilityEntity[] {
      if (this.miscellaneous.selectedCarrierIds?.length) {
        return this.eligibility.filteredCarriers.filter(carrier =>
          Boolean(
            this.miscellaneous.selectedCarrierIds.find(
              carrierId => carrierId === carrier.Carrier.id,
            ),
          ),
        )
      }
      return this.eligibility.filteredCarriers
    },
  },
  methods: {
    sendToSummaryBlock(block: string): boolean {
      return (
        (block === CHECKOUT_BLOCKS.CARRIERS &&
          !this.service.services.includes(AVAILABLE_LEVEL_SERVICES.PICKUP_POINT)) ||
        (block === CHECKOUT_BLOCKS.PICKUP_POINT &&
          this.service.services.includes(AVAILABLE_LEVEL_SERVICES.PICKUP_POINT)) ||
        (block !== CHECKOUT_BLOCKS.CARRIERS && block !== CHECKOUT_BLOCKS.PICKUP_POINT)
      )
    },
  },
})
</script>

<style lang="scss">
@import '../../../../styles/mixins/macScrollbar';
#summary-upper-container {
  #summary-container {
    border: 0.1rem solid $main-lighten-65-color;
    border-radius: 0.4rem;
    background-color: $white;
    padding-top: 3.5rem;
    padding-bottom: 3.5rem;

    .carriers-wrapper {
      margin-top: 1.2rem;
      color: $success-color;
      display: flex;
      justify-content: space-between;

      &.empty {
        color: $error-color;
      }

      h2 {
        margin-right: 0.8rem;
      }

      .show-dialog-btn {
        color: $main-color;
        cursor: pointer;
      }
    }

    .step-container {
      overflow-wrap: break-word;

      .step-wrapper {
        display: flex;
        align-items: flex-start;

        .step-number {
          margin-top: 1.6rem;
          min-width: 2.6rem;
          min-height: 2.6rem;
          max-width: 2.6rem;
          max-height: 2.6rem;
          background-color: $main-color;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: $white;
        }

        .block-container {
          display: flex;
          flex-direction: column;
          width: 100%;
          margin-left: 1.5rem;
          margin-right: 1.5rem;

          .block-wrapper {
            border-bottom: 0.1rem solid $main-lighten-74-color;
            border-radius: 0.4rem;
            padding: 2rem 1.5rem 2rem 1.5rem;
            margin-top: 0;

            &:last-of-type {
              border-bottom: none;
              margin-bottom: 0;
            }
          }
        }

        .edit-wrapper {
          margin-top: 1.6rem;
          cursor: pointer;
        }
      }
    }
  }

  .summary-wrapper-mobile {
    display: flex;
    justify-content: flex-end;
    position: absolute;
    right: 2rem;
    top: calc(100vh - 6rem - 5.4rem - 7.8rem);
    z-index: 8;

    .fab-button {
      background-color: $main-color !important;
      border: 0.2rem solid $white;

      i {
        color: $white !important;
      }
    }
  }

  .padding-block {
    padding-left: 3.5rem;
    padding-right: 3.5rem;
  }

  .block-divider {
    max-height: 0.1rem;
    min-height: 0.1rem;
    background-color: $main-lighten-65-color;
    margin-top: 2.5rem;
    margin-bottom: 2.5rem;
  }
}

.order-create-summary-carrier-eligible {
  .modal-header-text-wrapper {
    span {
      &:first-letter {
        text-transform: uppercase;
      }
    }
  }

  .main-dialog-content {
    @include setMacScrollbar('&');
    overflow-y: scroll;
    min-height: calc(100vh - 12.5rem - 4.8rem - 33%);
    max-height: calc(100vh - 18rem - 12.6rem);
    padding-top: 2rem;
    padding-bottom: 2rem;

    @media #{map-get($display-breakpoints, 'sm-and-down')} {
      min-height: calc(100vh - 5.2rem);
      max-height: calc(100vh - 5.2rem);
    }

    .carrier-wrapper {
      min-height: 8.5rem;
      max-height: 8.5rem;
      border-bottom: 0.1rem solid $main-lighten-74-color;
      display: flex;
      align-items: center;
      justify-content: space-between;

      &:last-of-type {
        border-bottom: none;
      }
    }
  }
}
</style>
