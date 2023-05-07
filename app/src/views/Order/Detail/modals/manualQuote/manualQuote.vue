<template>
  <mp-dialog-confirmation
    classWrapper="order-detail-manual-quote"
    @close="$emit('hide')"
    @submit="save()"
    dataId="order-detail-manualQuote"
    :fullscreen="$vuetify.breakpoint.xsOnly"
    color="primary"
    :header="{
      icon: 'mdi-file-edit-outline',
      isColorBackground: true,
      text: $t('page.detailOrder.manualQuote.title'),
      textPolice: 'h4',
      iconClose: 'mdi-close',
    }"
    :btnCancel="{ text: $t('action.cancel.base'), format: 'link', linkColor: 'black' }"
    :btnValidation="{
      text: $t('action.confirm.base'),
      format: 'success',
      disabled: $v.manualQuote.$invalid || !validForm,
    }"
    :btnToColumn="$vuetify.breakpoint.xsOnly"
    maxWidth="58.6rem"
  >
    <template #content>
      <v-form
        id="order-detail-manual-quote-form"
        data-id="order-detail-manualQuote-form"
        v-if="manualQuote"
        class="mt-8"
      >
        <v-row no-gutters>
          <v-col cols="12">
            <span class="regular14">
              {{ $t('page.detailOrder.manualQuote.carrierChoice') }}
            </span>

            <mp-expand-block
              v-if="getExpandBlocks"
              :expandBlocks="getExpandBlocks"
              dataId="order-detail-manualQuote-form-expandBlocks"
              @selectedItem="
                manualQuote.eligibilityParams.carrierId = carriers.find(({ id }) => id === $event).carrierId
                validForm = true
              "
            />
          </v-col>
        </v-row>

        <mp-textfield
          class="mb-5"
          :label="`${$t('page.detailOrder.manualQuote.deliveryId')} *`"
          name="order-detail-manualQuote-form-deliveryId"
          v-model="manualQuote.externalDeliveryId"
          dataId="order-detail-manualQuote-form-deliveryId"
          @input="$v.manualQuote.externalDeliveryId.$touch()"
          @blur="$v.manualQuote.externalDeliveryId.$touch()"
          :errors="getModelErrors($v.manualQuote.externalDeliveryId)"
          :isDirty="$v.manualQuote.externalDeliveryId.$dirty"
        />

        <currency-autocomplete
          :currency="manualQuote.currency"
          dataId="order-detail-manualQuote-form-currency"
          @updateCurrency="handleChangeCurrency($event)"
          :label="$t('page.detailOrder.manualQuote.currency')"
          :isRequired="true"
          @input="$v.manualQuote.currency.$touch()"
          @blur="$v.manualQuote.currency.$touch()"
          :errors="getModelErrors($v.manualQuote.currency)"
          :isDirty="$v.manualQuote.currency.$dirty"
          :top="false"
        />

        <mp-textfield
          class="mb-5"
          :label="`${$t('page.detailOrder.manualQuote.taxExcludedAmount')} *`"
          name="order-detail-manualQuote-form-taxExcludedAmount"
          type="number"
          v-model="manualQuote.taxExcludedAmount"
          dataId="order-detail-manualQuote-form-taxExcludedAmount"
          @input="$v.manualQuote.taxExcludedAmount.$touch()"
          @blur="$v.manualQuote.taxExcludedAmount.$touch()"
          :errors="getModelErrors($v.manualQuote.taxExcludedAmount)"
          :isDirty="$v.manualQuote.taxExcludedAmount.$dirty"
        />

        <mp-textfield
          class="mb-5"
          :label="`${$t('page.detailOrder.manualQuote.taxAmount')}`"
          name="order-detail-manualQuote-form-taxAmount"
          type="number"
          v-model="manualQuote.taxAmount"
          dataId="order-detail-manualQuote-form-taxAmount"
          @input="$v.manualQuote.taxAmount.$touch()"
          @blur="$v.manualQuote.taxAmount.$touch()"
          :errors="getModelErrors($v.manualQuote.taxAmount)"
          :isDirty="$v.manualQuote.taxAmount.$dirty"
        />

        <mp-textfield
          class="mb-5"
          :label="$t('page.detailOrder.manualQuote.taxIncludedAmount')"
          name="order-detail-manualQuote-form-taxIncludedAmount"
          type="number"
          v-model="manualQuote.taxIncludedAmount"
          dataId="order-detail-manualQuote-form-taxIncludedAmount"
          @input="$v.manualQuote.taxIncludedAmount.$touch()"
          @blur="$v.manualQuote.taxIncludedAmount.$touch()"
          :errors="getModelErrors($v.manualQuote.taxIncludedAmount)"
          :isDirty="$v.manualQuote.taxIncludedAmount.$dirty"
        />

        <mp-select
          dataId="order-detail-manualQuote-form-vehicleType"
          :label="`${$t('page.detailOrder.manualQuote.usedVehicle')} *`"
          :items="usedVehicleTypes"
          v-model="manualQuote.vehicleType"
          attach="#manualQuoteVehicleType"
          dropdownId="manualQuoteVehicleType"
          top
          @input="$v.manualQuote.vehicleType.$touch()"
          @blur="$v.manualQuote.vehicleType.$touch()"
          :errors="getModelErrors($v.manualQuote.vehicleType)"
          :isDirty="$v.manualQuote.vehicleType.$dirty"
        />
      </v-form>
    </template>
  </mp-dialog-confirmation>
</template>

<script lang="ts">
import currencyAutocomplete from '@/components/form/currencyAutocomplete/currencyAutocomplete.vue'
import { ALLOWED_VEHICLE_TYPES } from '@/constants/shared'
import { SnackBarType } from '@/store/types'
import mixins from 'vue-typed-mixins'
import { validationMixin } from '@/mixins'
import { required, decimal, minValue } from 'vuelidate/lib/validators'

import {
  CarrierEligibilityEntity,
  ExpandBlockEntity,
  getDefaultManualQuote,
  ManualQuote,
  SelectItem,
} from '@/types'

import OrderService from '@/services/order/OrderService'
import OrderEligibilityService from '@/services/orderEligibility/OrderEligibilityService'

export default mixins(validationMixin).extend({
  name: 'order-detail-manual-quote',
  components: { currencyAutocomplete },
  props: {
    showDialog: {
      type: Boolean,
      required: true,
    },
  },
  data: () => ({
    validForm: false,
    usedVehicleTypes: [] as SelectItem[],
    manualQuote: null as ManualQuote | null,
    carriers: [] as CarrierEligibilityEntity[],
  }),
  validations: {
    manualQuote: {
      externalDeliveryId: { required },
      taxExcludedAmount: { required, minValue: minValue(0) },
      taxIncludedAmount: { decimal, minValue: minValue(0) },
      currency: { required },
      taxAmount: { decimal, minValue: minValue(0) },
      vehicleType: { required },
    },
  },
  computed: {
    getExpandBlocks(): ExpandBlockEntity[] {
      return this.carriers.map(({ id, Carrier, contact }) => {
        return {
          id,
          logo: Carrier.logo || undefined,
          name: Carrier.name,
          infos: [
            {
              icon: 'phone',
              text: contact.phone || '',
            },
            {
              icon: 'mail',
              text: contact.email || '',
            },
          ],
        }
      })
    },
  },
  async mounted() {
    for (const vehicleType in ALLOWED_VEHICLE_TYPES) {
      if (ALLOWED_VEHICLE_TYPES[vehicleType]) {
        const vehicle = ALLOWED_VEHICLE_TYPES[vehicleType]
        this.usedVehicleTypes.push({
          text: this.$t(`technical.vehicleType.${vehicle}`),
          value: vehicle,
        })
      }
    }

    const order = await OrderService.get(parseInt(this.$route.params.id, 10), {
      personalData: true,
    })

    this.manualQuote = getDefaultManualQuote()
    this.manualQuote.eligibilityParams = {
      retailerId: order.retailerId,
      storeId: order.storeId,
      ...(order.picking?.address?.exchangePlaceId &&
        { exchangePlaceId: Number(order.picking.address.exchangePlaceId) }
      ),
    }

    const { parents, orderEligibilities } =
      await OrderEligibilityService.getAll({
        ...this.manualQuote?.eligibilityParams, isActive: true
      })

    this.carriers = OrderEligibilityService.getAvailableList(parents, orderEligibilities)
  },
  methods: {
    handleChangeCurrency(newCurrency: string) {
      if (!this.manualQuote) {
        return
      }

      this.manualQuote.currency = newCurrency
    },
    async save() {
      if (this.manualQuote) {
        this.manualQuote.externalDeliveryId = this.manualQuote.externalDeliveryId.trim()
      }

      if(!this.manualQuote?.eligibilityParams?.carrierId) {
        return
      }

      try {
        await OrderService.createQuote(this.$route.params.id, this.manualQuote)
        this.$emit('save')
      } catch (e) {
        this.$store.dispatch('setSnackbar', {
          type: SnackBarType.ERROR,
          message: this.$t('messages.error'),
        })
      }
    },
  },
})
</script>

<style lang="scss">
.order-detail-manual-quote {
  @import '../../../../../styles/mixins/macScrollbar';

  .main-dialog-content {
    padding: 0 1rem 0 2rem !important;
    overflow-y: scroll;
    @include setMacScrollbar('&');
    max-height: calc(100vh - 18rem - 12.6rem);

    @media #{map-get($display-breakpoints, 'xs-only')} {
      max-height: calc(100vh - 25.7rem);
    }
  }

  @media #{map-get($display-breakpoints, 'xs-only')} {
    .v-card__actions {
      padding: 0;

      .actions-outer-wrapper {
        min-height: 6rem;

        .mp-button--sticky {
          min-height: 6rem;
          min-width: 100% !important;
        }
      }
    }
  }
}
</style>
