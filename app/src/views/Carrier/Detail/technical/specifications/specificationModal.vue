<template>
  <mp-dialog-confirmation
    dataId="carrier-delivery-specification-modal"
    classWrapper="carrier-delivery-specification-modal"
    color="primary"
    :header="{
      iconClose: 'mdi-close',
      icon: $vuetify.breakpoint.smAndUp ? 'mdi-pencil' : '',
      isColorBackground: true,
      text: $t('action.modify.specifications'),
      textPolice: 'medium16',
    }"
    :btnValidation="{ text: $t('action.save'), format: 'success', icon: 'content-save-outline', loading }"
    :btnCancel="{ text: $t('action.cancel.base'), format: 'link', linkColor: 'black' }"
    @close="$emit('close')"
    @submit="handleSubmit()"
  >
    <template #content>
      <v-row no-gutters>
        <v-col cols="10" offset="1" class="row-wrapper">
          <mp-checkbox-new
            :label="$t('page.carrier.specifications.storage')"
            v-model="editSpecifications.storageAvailability"
            :hide-details="true"
            :disabled="isParentDisable('storageAvailability')"
            data-id="carrier-delivery-specification-checkbox-storageAvailability"
          />
        </v-col>

        <v-col cols="10" offset="1" class="row-wrapper">
          <mp-checkbox-new
            :label="$t('page.carrier.specifications.label')"
            v-model="editSpecifications.specifications.label"
            :hide-details="true"
            :disabled="isParentDisable('label')"
            data-id="carrier-delivery-specification-checkbox-label"
          />
        </v-col>

        <v-col cols="10" offset="1" class="row-wrapper">
          <mp-checkbox-new
            :label="$t('page.carrier.specifications.updateOrder')"
            v-model="editSpecifications.specifications.updateOrder"
            :hide-details="true"
            :disabled="isParentDisable('updateOrder')"
            data-id="carrier-delivery-specification-checkbox-updateOrder"
          />
        </v-col>

        <v-col cols="10" offset="1" class="row-wrapper">
          <mp-checkbox-new
            :label="$t('page.carrier.specifications.cancelOrder')"
            v-model="editSpecifications.specifications.cancelOrder"
            :hide-details="true"
            :disabled="editSpecifications.specifications.closeDelivery || isParentDisable('cancelOrder')"
            data-id="carrier-delivery-specification-checkbox-cancelOrder"
          />
        </v-col>

        <v-col cols="10" offset="1" class="row-wrapper">
          <mp-checkbox-new
            :label="$t('page.carrier.specifications.carrierTracking')"
            v-model="editSpecifications.specifications.carrierTracking"
            :hide-details="true"
            :disabled="isParentDisable('carrierTracking')"
            data-id="carrier-delivery-specification-checkbox-carrierTracking"
          />
        </v-col>

        <v-col cols="10" offset="1" class="row-wrapper">
          <mp-checkbox-new
            :label="$t('page.carrier.specifications.closeDelivery')"
            v-model="editSpecifications.specifications.closeDelivery"
            :hide-details="true"
            :disabled="editSpecifications.specifications.cancelOrder || isParentDisable('closeDelivery')"
            data-id="carrier-delivery-specification-checkbox-closeDelivery"
          />
        </v-col>

        <v-col cols="10" offset="1" class="row-wrapper">
          <mp-checkbox-new
            :label="$t('page.carrier.specifications.quote')"
            v-model="editSpecifications.specifications.quote"
            hide-details
            :disabled="isParentDisable('quote')"
            data-id="carrier-delivery-specification-checkbox-quote"
          />
        </v-col>
      </v-row>
    </template>
  </mp-dialog-confirmation>
</template>

<script lang="ts">
import { GetCarrierParams } from '@/services/carrier/CarrierRepository'
import OrderEligibilityService from '@/services/orderEligibility/OrderEligibilityService'
import { SnackBarType } from '@/store/types'
import { CarrierEligibilityEntity, getDefaultSpecifications, Specifications, SPECIFICATIONS } from '@/types'
import Vue from 'vue'

export default Vue.extend({
  name: 'mp-carrier-detail-specification-modal',
  props: {
    orderEligibility: {
      type: Object as () => CarrierEligibilityEntity,
      required: true,
    },
    parent: {
      type: Object as () => CarrierEligibilityEntity | null,
      default: null,
    },
    params: {
      type: Object as () => GetCarrierParams,
      required: true,
    },
  },
  data: () => ({
    loading: false,
    editSpecifications: {
      storageAvailability: false,
      specifications: getDefaultSpecifications(),
    },
  }),
  beforeMount() {
    const { storageAvailability, specifications } = this.orderEligibility
    this.editSpecifications.storageAvailability = typeof storageAvailability !== 'undefined' ? storageAvailability : false
    this.editSpecifications.specifications = specifications &&
      Object.values(specifications).length
        ? {
          ...getDefaultSpecifications(),
          ...JSON.parse(JSON.stringify(specifications))
        }
        : getDefaultSpecifications()
  },
  methods: {
    isParentDisable(property: string): boolean {
      if (!this.parent) {
        return false
      }

      if (
        !Object.values(SPECIFICATIONS).includes(property as SPECIFICATIONS) &&
        !this.parent?.[property as keyof CarrierEligibilityEntity]
      ) {
        return true
      }

      return Object.values(SPECIFICATIONS).includes(property as SPECIFICATIONS) &&
        !this.parent?.specifications?.[property as keyof Specifications]
    },
    async handleSubmit(): Promise<void> {
      this.loading = true
      try {
        const { storageAvailability, specifications } = this.editSpecifications
        await OrderEligibilityService.update(this.params, {
          storageAvailability,
          specifications,
        })
        this.orderEligibility.storageAvailability = storageAvailability
        this.orderEligibility.specifications = specifications
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
        this.loading = false
        this.$emit('close')
      }
    },
  },
})
</script>

<style lang="scss">
.carrier-delivery-specification-modal {
  .main-dialog-content {
    @media #{map-get($display-breakpoints, 'sm-and-up')} {
      @import '../../../../../styles/mixins/macScrollbar';
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
