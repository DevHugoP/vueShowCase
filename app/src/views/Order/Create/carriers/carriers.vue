<template>
  <v-row no-gutters class="block" id="create-order-carriers" data-id="order-create-block-carriers">
    <v-col cols="12" class="header">
      <h2>{{ $t('page.createOrder.titles.carriers') }}</h2>
      <span class="block-info">{{ $t('page.createOrder.infos.carriers') }}</span>
    </v-col>

    <v-col cols="12" class="content">
      <div class="carrier-choices-wrapper d-flex">
        <v-row
          :class="
            `carrier-choices-inner-wrapper${
              selectedCarrier && selectedCarrier.carrierId === carrier.carrierId ? ' selected' : ''
            }`
          "
          v-for="(carrier, index) in filteredCarriers"
          :key="`carrier-choices-${index}`"
          :data-id="`create-order-carriers-carriers-${index}`"
          @click="selectCarrier(carrier)"
          no-gutters
        >
          <v-col cols="6">
            <v-img :src="carrier.Carrier.logo" contain max-width="5.4rem" class="ml-4" />
          </v-col>
          <v-col cols="6">
            <span class="regular12 main-lighten-52"> {{ carrier.Carrier.name }} </span>
          </v-col>
        </v-row>

        <div v-if="!filteredCarriers.length" class="mb-5 mt-2 text-center">
          <h3>
            {{ $t('page.order.delivery.noCarrier') }}
          </h3>
        </div>
      </div>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { CreateOrderStateCarriers } from '@/store/modules/createOrder/carriers/types'
import { CreateOrderStateOrderContent } from '@/store/modules/createOrder/orderContent/types'
import { CreateOrderStateSenderIdentity } from '@/store/modules/createOrder/senderIdentity/types'
import { CreateOrderStateService } from '@/store/modules/createOrder/service/types'
import {
  CreateOrderStateEligibility,
  CreateOrderStateMiscellaneous,
  displayRadioType,
  displayType,
} from '@/store/modules/createOrder/types'
import { CarrierEligibilityEntity, CarrierSelectionMode } from '@/types'
import Vue from 'vue'

export default Vue.extend({
  name: 'order-create-carriers',
  data: () => ({
    selectedCarrier: null as CarrierEligibilityEntity | null,
  }),
  computed: {
    senderIdentity(): CreateOrderStateSenderIdentity {
      return this.$store.getters['createOrder/senderIdentity/senderIdentity']
    },
    service(): CreateOrderStateService {
      return this.$store.getters['createOrder/service/service']
    },
    orderContent(): CreateOrderStateOrderContent {
      return this.$store.getters['createOrder/orderContent/orderContent']
    },
    miscellaneous(): CreateOrderStateMiscellaneous {
      return this.$store.getters['createOrder/miscellaneous']
    },
    carriers(): CreateOrderStateCarriers {
      return this.$store.getters['createOrder/carriers/carriers']
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
      } else if (
        this.miscellaneous.deliveryDateTypeToDisplay === displayType.MIXED &&
        this.miscellaneous.deliveryTypeRadioType === displayRadioType.DEFAULT
      ) {
        return this.eligibility.filteredCarriers.filter(carrier =>
          Boolean(
            this.miscellaneous.carrierWithoutTypicalWeek.find(
              carrierId => carrierId === carrier.Carrier.id,
            ),
          ),
        )
      }
      return this.eligibility.filteredCarriers
    },
  },
  async mounted() {
    const { carrierSelection } = this.carriers

    if (carrierSelection) {
      this.selectedCarrier =
        this.eligibility.filteredCarriers.find(
          carrier => carrier.Carrier.code === carrierSelection.carrierCodes[0],
        ) || null
    } else if (this.eligibility.filteredCarriers.length === 1) {
      this.selectedCarrier = this.eligibility.filteredCarriers[0]
    }
  },
  methods: {
    selectCarrier(carrier: CarrierEligibilityEntity) {
      if (this.selectedCarrier?.id === carrier.id) {
        this.selectedCarrier = null
        return
      }

      this.selectedCarrier = carrier
    },
  },
  watch: {
    selectedCarrier(next) {
      if (!next) {
        this.carriers.carrierSelection = null

        return
      }

      this.carriers.carrierSelection = {
        mode: CarrierSelectionMode.INCLUSION,
        carrierCodes: [next.Carrier.code!],
      }
    },
    'eligibility.filteredCarriers'(
      next: CarrierEligibilityEntity[],
      previous: CarrierEligibilityEntity[],
    ) {
      if (next?.length && !previous?.length) {
        const { carrierSelection } = this.carriers
        if (carrierSelection) {
          this.selectedCarrier =
            this.eligibility.filteredCarriers.find(
              carrier => carrier.Carrier.code === carrierSelection.carrierCodes[0],
            ) || null
        }
      }
    },
    filteredCarriers(next: CarrierEligibilityEntity[]) {
      if (this.selectedCarrier) {
        if (!next.find(carrier => carrier.id === this.selectedCarrier!.id)) {
          this.selectCarrier(this.selectedCarrier!)
        }
      }
    },
  },
})
</script>

<style lang="scss" scoped>
#create-order-carriers {
  .carrier-choices-wrapper {
    display: flex;
    flex-wrap: wrap;
    row-gap: 1rem;
    column-gap: 2rem;

    .carrier-choices-inner-wrapper {
      max-height: 7rem;
      min-height: 7rem;
      max-width: 25rem;
      min-width: 25rem;
      border: 0.1rem solid $main-lighten-65-color;
      border-radius: 0.4rem;
      cursor: pointer;
      display: flex;
      align-items: center;

      &.selected {
        border: 0.2rem solid $main-color;
      }

      .best-price {
        text-align: center;
      }
    }
  }
}
</style>
