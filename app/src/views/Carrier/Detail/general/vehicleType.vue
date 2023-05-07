<template>
  <mp-block
    id="carrier-delivery-vehicle-type-block"
    :title="$vuetify.breakpoint.smAndUp ? $t('page.carrier.vehicleType.title') : ''"
    :hasBorder="$vuetify.breakpoint.smAndUp"
    :hasMarginBottom="$vuetify.breakpoint.smAndUp"
    titleHasPaddingBottom
    :hasEditIcon="localVehicles && !!localVehicles.length && hasEditIcon"
    @clickOnIcon="showModal = true"
  >
    <div v-if="localVehicles && localVehicles.length">
      <v-row
        no-gutters
        v-for="(vehicleType, index) in localVehicles"
        :key="`vehicle-types-${index}`"
        class="vehicle-type-wrapper"
      >
        <v-icon size="1.4rem" class="main-color">{{ `mdi-${listIcons[vehicleType]}` }}</v-icon>
        <span class="regular14 main-color">
          {{ $t(`technical.vehicleType.${vehicleType}`) }}
        </span>
      </v-row>
    </div>

    <v-row
      no-gutters
      v-else
    >
      <v-col cols="12" class="no-data-wrapper">
        <no-data
          dataId="carrier-delivery-vehicle-type-block-noData"
          :content="$t('common.noData.vehicleType')"
        />

        <mp-button
          v-if="hasEditIcon && $vuetify.breakpoint.smAndUp"
          format="primary"
          :text="$t('action.add.base')"
          icon="plus"
          class="mp-button"
          @click="showModal = true"
          dataId="carrier-delivery-vehicle-type-block-add"
        />
      </v-col>
    </v-row>

    <mp-dialog-confirmation
      :fullscreen="$vuetify.breakpoint.xsOnly"
      v-if="showModal"
      dataId="carrier-delivery-vehicle-type-modal"
      classWrapper="carrier-delivery-vehicle-type-modal"
      color="primary"
      :header="{
        iconClose: 'mdi-close',
        icon: $vuetify.breakpoint.smAndUp ? 'mdi-pencil' : '',
        isColorBackground: true,
        text: $t('action.modify.vehicleType'),
        textPolice: 'medium16',
      }"
      :btnValidation="{ text: $t('action.save'), format: 'success', icon: 'content-save-outline' }"
      :btnCancel="{ text: $t('action.cancel.base'), format: 'link', linkColor: 'black' }"
      @close="showModal = !showModal"
      @submit="handleSubmit()"
    >
      <template #content>
        <v-row no-gutters>
          <v-col
            cols="10"
            offset="1"
            v-for="(vehicleType, index) in ALLOWED_VEHICLE_TYPES"
            :key="`vehicle-types-${index}`"
            class="row-wrapper"
          >
            <mp-checkbox-new
              :label="$t(`technical.vehicleType.${vehicleType}`)"
              v-model="editVehicleTypes"
              :value="vehicleType"
              :hide-details="true"
              :dataId="`vehicleType-switch-${index}`"
            />
          </v-col>
        </v-row>
      </template>
    </mp-dialog-confirmation>
  </mp-block>
</template>

<script lang="ts">
import { ALLOWED_VEHICLE_TYPES } from '@/constants/shared'
import Vue from 'vue'

import mpBlock from '@/components/block/block.vue'
import noData from '@/components/noData/noData.vue'

import { CarrierEntity } from '@/types'
import CarrierService from '@/services/carrier/CarrierService'
import { SnackBarType } from '@/store/types'

const listIcons = {
  VEHICLE_TYPE_PEDESTRIAN: 'walk',
  VEHICLE_TYPE_BIKE: 'bike',
  VEHICLE_TYPE_E_BIKE: 'motorbike-electric',
  VEHICLE_TYPE_BIKE_CARGO: 'bicycle-cargo',
  VEHICLE_TYPE_E_BIKE_CARGO: 'lightning-bolt',
  VEHICLE_TYPE_TRAILER_BIKE: 'truck-trailer',
  VEHICLE_TYPE_E_TRAILER_BIKE: 'lightning-bolt',
  VEHICLE_TYPE_SCOOTER: 'moped',
  VEHICLE_TYPE_E_SCOOTER: 'moped-electric',
  VEHICLE_TYPE_CAR: 'car',
  VEHICLE_TYPE_E_CAR: 'car-electric',
  VEHICLE_TYPE_HYBRID_CAR: 'car-outline',
  VEHICLE_TYPE_VAN_SMALL: 'van-utility',
  VEHICLE_TYPE_GAZ_VAN_SMALL: 'fire',
  VEHICLE_TYPE_E_VAN_SMALL: 'lightning-bolt',
  VEHICLE_TYPE_VAN_MEDIUM: 'van-utility',
  VEHICLE_TYPE_E_VAN_MEDIUM: 'lightning-bolt',
  VEHICLE_TYPE_GAZ_VAN_MEDIUM: 'fire',
  VEHICLE_TYPE_VAN_BIG: 'van-utility',
  VEHICLE_TYPE_E_VAN_BIG: 'lightning-bolt',
  VEHICLE_TYPE_GAZ_VAN_BIG: 'fire',
  VEHICLE_TYPE_TRUCK: 'truck',
  VEHICLE_TYPE_E_TRUCK: 'lightning-bolt',
  VEHICLE_TYPE_GAZ_TRUCK: 'fire',
  VEHICLE_TYPE_MAXI_TRUCK: 'tanker-truck',
  VEHICLE_TYPE_MAXI_E_TRUCK: 'lightning-bolt',
  VEHICLE_TYPE_MAXI_GAZ_TRUCK: 'fire',
  VEHICLE_TYPE_UNKNOWN: 'help-box',
}

export default Vue.extend({
  name: 'mp-carrier-detail-vehicle-type',
  components: {
    mpBlock,
    noData,
  },
  props: {
    carrier: {
      type: Object as () => CarrierEntity,
      required: true,
    },
    hasEditIcon: {
      type: Boolean,
      default: true,
    },
  },
  data: () => ({
    localVehicles: [] as string[],
    ALLOWED_VEHICLE_TYPES,
    showModal: false,
    editVehicleTypes: [] as string[],
    listIcons,
  }),
  beforeMount() {
    const { vehicleTypes } = this.carrier
    this.localVehicles = vehicleTypes || []
  },
  methods: {
    async handleSubmit(): Promise<void> {
      try {
        await CarrierService.update(this.carrier.id, {
          vehicleTypes: this.editVehicleTypes.length ? this.editVehicleTypes : null,
        })
        this.carrier.vehicleTypes = this.editVehicleTypes
        this.localVehicles = this.editVehicleTypes
        this.$store.dispatch('setSnackbar', {
          message: this.$t('messages.carrierUpdated'),
          type: SnackBarType.SUCCESS,
        })
      } catch (err) {
        this.$store.dispatch('setSnackbar', {
          type: SnackBarType.ERROR,
          message: this.$t('messages.error'),
        })
      } finally {
        this.showModal = false
      }
    },
  },
  watch: {
    showModal(next: boolean) {
      if (!next) {
        this.editVehicleTypes = []
        return
      }

      this.editVehicleTypes = this.localVehicles || []
    },
  },
})
</script>

<style lang="scss">
#carrier-delivery-vehicle-type-block {
  .vehicle-type-wrapper {
    margin-bottom: 1.6rem;
    display: flex;
    align-items: center;

    &:last-of-type {
      margin-bottom: 0;
    }

    i {
      margin-right: 1.2rem;
    }
  }

  .no-data-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;

    .mp-button {
      margin-top: 2.5rem;
      margin-bottom: 0.1rem;
    }
  }
}

.carrier-delivery-vehicle-type-modal {
  .main-dialog-content {
    @media #{map-get($display-breakpoints, 'sm-and-up')} {
      @import '../../../../styles/mixins/macScrollbar';
      @include setMacScrollbar('&');
      max-height: calc(100vh - 33rem);
      overflow-y: scroll;
    }

    .row-wrapper {
      display: flex;
      padding-bottom: 2rem !important;

      &:first-of-type {
        padding-top: 4.1rem;
      }
    }
  }
  .v-card__actions {
    border-top: 0.1rem solid $main-lighten-74-color;
  }
}
</style>
