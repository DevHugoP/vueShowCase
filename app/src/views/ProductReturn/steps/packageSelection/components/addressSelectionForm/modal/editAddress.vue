<template>
  <mp-dialog-confirmation
    v-if="hasData"
    classWrapper="edit-address-modal"
    :dataId="dataId"
    persistent
    color="primary"
    :header="{
      iconClose: 'mdi-close',
      icon: $vuetify.breakpoint.smAndUp ? 'mdi-pencil' : undefined,
      isColorBackground: true,
      text: $t('action.modify.productReturnPickingAddress'),
      textPolice: 'regular14',
    }"
    :btnCancel="{
      text: $t('action.cancel.base'),
      format: $vuetify.breakpoint.smAndUp ? 'link' : 'sticky',
      linkColor: $vuetify.breakpoint.smAndUp ? 'black' : undefined,
      stickyColor: $vuetify.breakpoint.smAndUp ? undefined : 'yellow',
    }"
    :btnValidation="{
      text: $t('action.confirm.base'),
      format: $vuetify.breakpoint.smAndUp ? 'success' : 'sticky',
      stickyColor: $vuetify.breakpoint.smAndUp ? undefined : 'yellow',
      disabled: invalid,
    }"
    :fullscreen="$vuetify.breakpoint.xsOnly"
    @submit="$emit('confirm', selectedAddress)"
    @close="$emit('close')"
  >
    <template #content>
      <v-row class="mb-5 mt-6" no-gutters>
        <v-col cols="10" offset="1">
          <mp-autocomplete
            :label="`${$t('common.address.base')} *`"
            id="order-create-pickingApiAddress"
            v-model="apiAddress"
            searchingMode
            mandatory
            :errors="[$t('validation.address')]"
            :loading="loadingPickingApiAddress"
            :items="suggestionsPickingApiAddress"
            @loadItems="onInputChange($event, false)"
            @change="handleChangeApiAddress(false)"
            displayName="address"
            dataId="order-create-pickingApiAddress"
            attach="#deliveryApiAddressDropdown"
            dropdownId="deliveryApiAddressDropdown"
            bottom
            @clickClear="handleApiAddressClear()"
          />
        </v-col>
      </v-row>
      <v-row class="mb-5" no-gutters>
        <v-col cols="10" offset="1">
          <create-order-custom-address
            :address="selectedAddress"
            :validations="$v.selectedAddress"
            dataId="return-order-departure"
          />
        </v-col>
      </v-row>

      <v-row class="mb-5 delivery-address-outer-wrapper" no-gutters>
        <v-col cols="10" offset="1" class="delivery-address-wrapper">
          <mp-textfield
            dataId="order-create-startingPoingtStep-deliveryOtherAddressAddressLine2"
            :label="$t('common.address.additional')"
            v-model="selectedAddress.addressLine2"
          />
        </v-col>
      </v-row>

      <v-row class="mb-5" no-gutters>
        <v-col
          cols="10"
          offset="1"
          :class="`d-flex ${$vuetify.breakpoint.xsOnly ? 'flex-column' : ''}`"
        >
          <div class="d-flex">
            <mp-textfield
              name="contactDigicode"
              dataId="order-create-contactStep-digicode"
              :label="$t('common.digicode')"
              v-model="selectedAddress.doorCode"
            />

            <mp-textfield
              class="pl-5"
              name="contactFloor"
              type="number"
              dataId="order-create-contactStep-floor"
              :label="$t('common.floor')"
              v-model="selectedAddress.floor"
            />
          </div>

          <mp-checkbox
            :class="$vuetify.breakpoint.smAndUp ? 'pl-5' : 'pt-5'"
            dataId="order-create-contactStep-elevator"
            :label="$t('common.elevator')"
            @change="handleChangeElevator"
            :input-value="selectedAddress.elevator"
          />
        </v-col>
      </v-row>

      <v-row class="mb-5" no-gutters>
        <v-col cols="10" offset="1">
          <mp-textarea
            :label="$t('common.comment')"
            class="textarea"
            :rows="8"
            noResize
            dataId="order-create-contactStep-comments"
            v-model="selectedAddress.comment"
            :isDirty="$v.comment.$dirty"
          />
        </v-col>
      </v-row>
    </template>
  </mp-dialog-confirmation>
</template>

<script lang="ts">
import mixins from 'vue-typed-mixins'
import validationMixin from '@/mixins/validationMixin/validationMixin'
import { Address, AddressDescription } from '@/types'
import { required } from 'vuelidate/lib/validators'
import { wait } from '@/helpers/helper'
import debounce from 'debounce'
import AddressService from '@/services/address/AddressService'
import createOrderCustomAddress from '@/views/Order/Create/components/customAddress.vue'
import { v4 } from 'uuid'

const DEBOUNCE_DELAY = 250

export default mixins(validationMixin).extend({
  name: 'edit-address-modal',
  components: {
    createOrderCustomAddress,
  },
  validations: {
    apiAddress: { required },
    comment: {},
    selectedAddress: {
      addressLine1: { required },
      postalCode: { required },
      city: { required },
      country: { required },
    },
  },
  props: {
    showDialog: {
      type: Boolean,
      required: true,
    },
    address: {
      type: Object as () => Address,
      required: true,
    },
    dataId: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    hasData: false,
    loadingPickingApiAddress: false,
    suggestionsPickingApiAddress: [] as AddressDescription[],
    isLoadingDetails: false,
    apiAddress: null as AddressDescription | null,
    hasLoaded: false,
    sessionToken: null as string | null,
    selectedAddress: {} as Address | null,
    invalid: false,
  }),
  async mounted() {
    const { address } = this
    this.isLoadingDetails = true
    this.invalid = this.$v.selectedAddress.$invalid

    this.suggestionsPickingApiAddress.push({
      address: `${address.addressLine1}, ${address.postalCode} ${address.city}`,
      placeId: '',
    })

    this.selectedAddress = { ...address }
    this.apiAddress = this.suggestionsPickingApiAddress[0]
    this.hasData = true
    await wait(500)
    this.isLoadingDetails = false
  },
  methods: {
    onInputChange: debounce(async function(this: any, text: string, isInit?: boolean) {
      if (this.isLoadingDetails || !text) {
        return
      }

      this.loadingPickingApiAddress = true

      if (!this.sessionToken) {
        this.sessionToken = v4()
      }

      const addresses = await AddressService.autoComplete({
        input: text,
        sessionToken: this.sessionToken,
      })

      this.suggestionsPickingApiAddress = [...addresses]

      if (isInit) {
        this.apiAddress = this.suggestionsPickingApiAddress[0]
        await this.handleChangeApiAddress()
      }

      this.loadingPickingApiAddress = false
    }, DEBOUNCE_DELAY),
    handleChangeElevator(label: string, value: boolean) {
      this.selectedAddress!.elevator = value
    },
    handleApiAddressClear(): void {
      this.apiAddress = null
    },
    async handleChangeApiAddress() {
      // get detail of address
      if (!this.apiAddress?.placeId) {
        return
      }

      const detail = await AddressService.getDetail({
        placeId: this.apiAddress!.placeId,
        sessionToken: this.sessionToken || v4(),
      })

      this.isLoadingDetails = true

      this.sessionToken = null
      this.selectedAddress = { ...detail, type: this.selectedAddress.type }

      await wait(150)
      this.isLoadingDetails = false
    },
  },
  watch: {
    '$v.selectedAddress.$invalid'(next) {
      this.invalid = next
    },
  },
})
</script>

<style lang="scss">
@import '../../../../../../../styles/mixins/macScrollbar';
.edit-address-modal {
  overflow: hidden;

  .main-dialog-content {
    @media #{map-get($display-breakpoints, 'sm-and-up')} {
      max-height: calc(100vh - 30rem);
      height: calc(100vh - 30rem);
      padding: 2.1rem 4.1rem 3.5rem 3.5rem;
      overflow-y: auto;
      overflow-x: hidden;
    }
    @media #{map-get($display-breakpoints, 'xs-only')} {
      padding: 0 2.4rem;
      overflow-y: auto;
      max-height: calc(100vh - 5.2rem - 8rem);
      min-height: calc(100vh - 5.2rem - 8rem);
    }
    @include setMacScrollbar('&');
    color: $main-color;
  }
}
</style>
