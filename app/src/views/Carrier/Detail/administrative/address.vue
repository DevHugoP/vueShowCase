<template>
  <v-container id="carrier-detail-address" data-id="carrier-detail-address">
    <mp-block
      id="carrier-detail-address-block"
      :title="$vuetify.breakpoint.smAndUp ? $t('page.carrier.address.title') : ''"
      :hasBorder="$vuetify.breakpoint.smAndUp"
      :hasMarginBottom="$vuetify.breakpoint.smAndUp"
      titleHasPaddingBottom
      :hasEditIcon="hasEditIcon"
      @clickOnIcon="showEditModal = true"
    >
      <v-row no-gutters class="pb-4" v-if="orderEligibility.address">
        <v-col cols="12">
          <span
            :class="$vuetify.breakpoint.smAndUp ? 'regular14' : 'regular16'"
            data-id="carrier-detail-address-addressLine1"
          >
            {{ orderEligibility.address.addressLine1 }}
          </span>
        </v-col>
      </v-row>

      <v-row no-gutters class="pb-4" v-if="orderEligibility.address.addressLine2">
        <v-col cols="12">
          <span
            :class="$vuetify.breakpoint.smAndUp ? 'regular14' : 'regular16'"
            data-id="carrier-detail-address-addressLine2"
          >
            {{ orderEligibility.address.addressLine2 }}
          </span>
        </v-col>
      </v-row>

      <v-row no-gutters class="pb-4">
        <v-col cols="12">
          <span
            :class="$vuetify.breakpoint.smAndUp ? 'regular14' : 'regular16'"
            data-id="carrier-detail-address-postalCodeAndCity"
          >
            {{ orderEligibility.address.postalCode }}
            {{ orderEligibility.address.city }}
          </span>
        </v-col>
      </v-row>

      <v-row no-gutters>
        <v-col cols="12">
          <span
            :class="$vuetify.breakpoint.smAndUp ? 'regular14' : 'regular16'"
            data-id="carrier-detail-address-country"
          >
            {{ orderEligibility.address.country }}
          </span>
        </v-col>
      </v-row>
    </mp-block>

    <mp-dialog-confirmation
      v-if="showEditModal"
      dataId="carrier-detail-administrative-address-modal"
      classWrapper="carrier-detail-administrative-address-modal"
      color="primary"
      :header="{
        iconClose: 'mdi-close',
        icon: $vuetify.breakpoint.smAndUp ? 'mdi-pencil' : '',
        isColorBackground: true,
        text: $t('page.carrier.address.modify'),
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
        showEditModal = false
        initAddress()
      "
      @submit="handleSubmit()"
    >
      <template #content>
        <v-row no-gutters class="mt-10">
          <v-col cols="10" offset="1">
            <mp-carrier-address-form
              :address="address"
              :isModal="true"
              @invalid="invalid = $event"
            />
          </v-col>
        </v-row>
      </template>
    </mp-dialog-confirmation>
  </v-container>
</template>

<script lang="ts">
import { GetCarrierParams } from '@/services/carrier/CarrierRepository'
import OrderEligibilityService from '@/services/orderEligibility/OrderEligibilityService'
import Vue from 'vue'

import { Address, CarrierEligibilityEntity } from '@/types'
import mpCarrierAddressForm from '@/views/Carrier/create/address/address.vue'
import mpBlock from '@/components/block/block.vue'

import { SnackBarType } from '@/store/types'

export default Vue.extend({
  name: 'carrier-detail-address',
  components: {
    mpBlock,
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
    hasEditIcon: {
      type: Boolean,
      default: false,
    }
  },
  data: () => ({
    loading: false,
    showEditModal: false,
    invalid: false,
    address: null as Address | null,
  }),
  beforeMount() {
    this.initAddress()
  },
  methods: {
    initAddress() {
      this.address = JSON.parse(JSON.stringify(this.orderEligibility.address))
    },
    async handleSubmit(): Promise<void> {
      try {
        this.loading = true
        const {
          addressLine1,
          addressLine2,
          postalCode,
          city,
          country,
        } = this.address!
        const address = {
          addressLine1,
          addressLine2: addressLine2 || undefined,
          postalCode,
          city,
          country,
        }

        await OrderEligibilityService.update(this.params, {
          address: address!,
        })

        this.orderEligibility.address = JSON.parse(JSON.stringify(this.address))
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
        this.showEditModal = false
      }
    },
  },
})
</script>

<style lang="scss">
#carrier-detail-address {
  padding: 0;

  @media #{map-get($display-breakpoints, 'xs-only')} {
    border-top: solid 0.1rem $main-lighten-74-color;
  }
}

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
