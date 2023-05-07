<template>
  <mp-dialog-confirmation
    dataId="carrier-detail-administrative-address-modal"
    classWrapper="carrier-detail-administrative-address-modal"
    color="primary"
    :header="{
      iconClose: 'mdi-close',
      icon: $vuetify.breakpoint.smAndUp ? 'mdi-pencil' : '',
      isColorBackground: true,
      text: $t('page.carrier.address.add'),
      textPolice: 'medium16',
    }"
    :btnValidation="{
      text: $t('action.save'),
      format: 'success',
      icon: 'content-save-outline',
      disabled: invalid,
      loading,
    }"
    :btnCancel="{ text: $t('action.cancel.base'), format: 'link', linkColor: 'black' }"
    @close="
      $emit('close')
      initAddress()
    "
    @submit="handleSubmit()"
  >
    <template #content>
      <v-row no-gutters class="mt-10">
        <v-col cols="10" offset="1">
          <mp-carrier-address-form
            :address="editAddress"
            :isModal="true"
            @invalid="invalid = $event"
          />
        </v-col>
      </v-row>
    </template>
  </mp-dialog-confirmation>
</template>

<script lang="ts">
import { GetCarrierParams } from '@/services/carrier/CarrierRepository'
import OrderEligibilityService from '@/services/orderEligibility/OrderEligibilityService'
import Vue from 'vue'

import mpCarrierAddressForm from '@/views/Carrier/create/address/address.vue'
import { Address, CarrierEligibilityEntity, getDefaultAddress } from '@/types'
import { SnackBarType } from '@/store/types'

export default Vue.extend({
  name: 'mp-carrier-detail-administrative-address-modal',
  components: {
    mpCarrierAddressForm,
  },
  props: {
    orderEligibility: {
      type: Object as () => CarrierEligibilityEntity,
      required: true,
    },
    params: {
      type: Object as () => GetCarrierParams,
      required: true,
    },
  },
  data: () => ({
    loading: false,
    editAddress: getDefaultAddress() as Address,
    invalid: false,
  }),
  beforeMount() {
    this.initAddress()
  },
  methods: {
    initAddress() {
      const { address } = this.orderEligibility
      this.editAddress = address && Object.values(address).length
          ? JSON.parse(JSON.stringify(address))
          : getDefaultAddress()
    },
    async handleSubmit(): Promise<void> {
      try {
        this.loading = true
        await OrderEligibilityService.update(this.params, {
          address: this.editAddress,
        })
        this.orderEligibility.address = JSON.parse(JSON.stringify(this.editAddress))
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
.carrier-detail-administrative-address-modal {
  .main-dialog-content {
    @media #{map-get($display-breakpoints, 'sm-and-up')} {
      @import '../../../../styles/mixins/macScrollbar';
      @include setMacScrollbar('&');
      max-height: calc(100vh - 33rem);
      overflow-y: scroll;
    }
  }

  .v-card__actions {
    border-top: 0.1rem solid $main-lighten-74-color;
  }
}
</style>
