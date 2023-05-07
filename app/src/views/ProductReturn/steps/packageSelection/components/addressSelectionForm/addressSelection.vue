<template>
  <div id="address-selection-form" class="pt-4">
    <v-row no-gutters class="mb-5 address-size-wrapper">
      <div
        :class="`address-wrapper${index === selectedAddress ? ' selected' : ''}`"
        v-for="(address, index) in addresses"
        :key="`address-selection-${index}`"
        @click="selectedAddress = index"
      >
        <div
          class="d-flex flex-column justify-space-between"
          :key="address.value"
          :data-id="`carrier-create-notification-state-channel-${address.type}`"
        >
          <div class="address-header d-flex align-center justify-space-between">
            <p :class="`text-center${$vuetify.breakpoint.xsOnly ? ' mb-0' : ''}`">
              <span class="regular16">{{ address.label }}</span>
            </p>
            <mp-button
              :class="`address-btn-modify mt-0 pt-0${$vuetify.breakpoint.xsOnly ? ' pa-0' : ''}`"
              :dataId="`${index}-edit-return-place`"
              :text="address.buttonLabel"
              format="link"
              linkColor="black"
              :icon="address.buttonIcon"
              @click="address.clickEvent"
            />
          </div>
          <div v-if="address.details">
            <p class="regular14">
              {{ address.details.addressLine1 }}<br />
              {{
                $t(
                  address.details.elevator
                    ? 'page.detailOrder.itinerary.withElevator'
                    : 'page.detailOrder.itinerary.withoutElevator',
                )
              }}<br />
              {{ address.details.postalCode }}
              {{ address.details.city }}<br />
              <span v-if="address.details.floor">
                {{ $t('page.detailOrder.itinerary.floor') }}:
                {{ address.details.floor }}
              </span>
              <span v-if="address.details.doorCode">
                {{ $t('page.detailOrder.itinerary.doorCode') }}:
                {{ address.details.doorCode }}
              </span>
            </p>
          </div>
        </div>
      </div>
    </v-row>

    <edit-address-modal
      v-if="showEditAddressModal"
      :showDialog="showEditAddressModal"
      dataId="address-edit-modal"
      :address="pickupAddress"
      @close="showEditAddressModal = false"
      @confirm="handleChangeAddress"
    />
  </div>
</template>

<script lang="ts">
import mixins from 'vue-typed-mixins'

import editAddressModal from './modal/editAddress.vue'

import { validationMixin } from '@/mixins'
import { Address } from '@/types'

export default mixins(validationMixin).extend({
  name: 'address-selection-step',
  components: { editAddressModal },
  props: {
    pickupAddress: {
      type: Object as () => Address,
      required: true,
    },
  },
  data: () => ({
    addresses: [] as Array<Record<string, any>>,
    selectedAddress: 0,
    showEditAddressModal: false,
  }),
  beforeMount() {
    const { pickupAddress } = this

    this.addresses = [
      {
        label: this.$t('common.address.base'),
        type: 'address',
        details: pickupAddress,
        value: 0,
        buttonLabel: this.$t('action.modify.base'),
        buttonIcon: 'pencil',
        clickEvent: this.handleEdit,
      },
    ]
  },
  methods: {
    handleChangeAddress(returnAddress: Address) {
      this.showEditAddressModal = false
      this.addresses[0].details = returnAddress
      this.$emit('updatePickingAddress', returnAddress)
    },
    handleEdit() {
      this.showEditAddressModal = true
    },
  },
})
</script>

<style lang="scss">
#address-selection-form {
  .ship {
    background-color: $main-lighten-80-color !important;
  }

  .address-size-wrapper {
    width: 100%;

    .address-wrapper {
      width: 100%;
      padding: 2rem;
      border: $main-lighten-65-color 0.1rem solid;
      border-radius: 0.4rem;
      align-items: flex-start;

      &.selected {
        border: $main-color 0.2rem solid;
      }

      &:not(:first-child) {
        margin-top: 2rem;
      }

      @media #{map-get($display-breakpoints, 'xs-only') } {
        .address-header {
          margin-bottom: 2rem;

          .address-btn-modify {
            height: fit-content;
          }
        }
      }
    }
    .v-item--active {
      border: $main-color 0.1rem solid;
    }
  }
}
</style>
