<template>
  <mp-dialog-confirmation
    v-if="hasData"
    classWrapper="edit-return-arrival-address-modal"
    :dataId="dataId"
    persistent
    color="primary"
    :header="{
      iconClose: 'mdi-close',
      icon: $vuetify.breakpoint.smAndUp ? 'mdi-pencil' : undefined,
      isColorBackground: true,
      text: $t('action.modify.productReturnDeliveryAddress'),
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
      <div class="content">
        <v-row class="return-arrival-radio-group" v-show="exchangePlaces.length">
          <v-col cols="10" offset="1">
            <mp-radio-group
              class="radio-group-custom"
              row
              dataId="return-order-arrival-arrivalType"
              v-model="selectedAddressType"
              :radioValues="arrivalTypesList"
            />
          </v-col>
        </v-row>
        <div v-if="selectedAddressType === AddressType.EXCHANGE_PLACE">
          <v-row class="mb-5 mt-6" no-gutters>
            <v-col cols="10" offset="1">
              <mp-select
                class="mb-5"
                :label="`${$t('action.modify.productReturnDeliveryAddress')}`"
                v-model="selectedAddress.exchangePlaceId"
                :items="exchangePlaces"
                itemText="name"
                itemValue="id"
                :disabled="!exchangePlaces.length"
                dataId="order-return-departure-exchangePlaceId"
                @change="returnHandleChangeExchangePlaces($event)"
                :attach="`#package-selection-exchangePlace`"
                :dropdownId="`package-selection-exchangePlace`"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="10" offset="1">
              <div v-if="selectedAddress">
                <p class="regular14">
                  {{ selectedAddress.addressLine1 }}<br />
                  <span v-if="selectedAddress.addressLine2">
                    {{ selectedAddress.addressLine2 }}<br />
                  </span>
                  {{
                    $t(
                      selectedAddress.elevator
                        ? 'page.detailOrder.itinerary.withElevator'
                        : 'page.detailOrder.itinerary.withoutElevator',
                    )
                  }}<br />
                  {{ selectedAddress.postalCode }}
                  {{ selectedAddress.city }}<br />
                  <span v-if="selectedAddress.floor">
                    {{ $t('page.detailOrder.itinerary.floor') }}:
                    {{ selectedAddress.floor }}
                  </span>
                  <span v-if="selectedAddress.doorCode">
                    {{ $t('page.detailOrder.itinerary.doorCode') }}:
                    {{ selectedAddress.doorCode }}
                  </span>
                </p>
              </div>
            </v-col>
          </v-row>
        </div>
        <div v-else-if="selectedAddressType === AddressType.ADDRESS">
          <v-row class="mb-5 mt-6" no-gutters>
            <v-col cols="10" offset="1">
              <mp-autocomplete
                :label="`${$t('common.address.base')} *`"
                id="return-order-deliveryApiAddress"
                v-model="apiAddress"
                searchingMode
                notRequired
                :errors="[$t('validation.address')]"
                :loading="loadingDeliveryApiAddress"
                :items="suggestionsDeliveryApiAddress"
                @loadItems="onInputChange($event, false)"
                @change="handleChangeApiAddress()"
                displayName="address"
                dataId="return-order-deliveryApiAddress"
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
                dataId="return-order-arrival"
              />
            </v-col>
          </v-row>

          <v-row class="mb-5 delivery-address-outer-wrapper" no-gutters>
            <v-col cols="10" offset="1" class="delivery-address-wrapper">
              <mp-textfield
                dataId="order-return-startingPoingtStep-deliveryOtherAddressAddressLine2"
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
                  dataId="order-return-contactStep-digicode"
                  :label="$t('common.digicode')"
                  v-model="selectedAddress.doorCode"
                />

                <mp-textfield
                  class="pl-5"
                  name="contactFloor"
                  type="number"
                  dataId="order-return-contactStep-floor"
                  :label="$t('common.floor')"
                  v-model="selectedAddress.floor"
                />
              </div>

              <mp-checkbox-new
                :class="$vuetify.breakpoint.smAndUp ? 'pl-5' : 'pt-5'"
                dataId="return-order-elevator"
                :label="$t('common.elevator')"
                v-model="selectedAddress.elevator"
                :value="selectedAddress.elevator"
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
                dataId="order-return-contactStep-comments"
                v-model="selectedAddress.comment"
                :isDirty="$v.selectedAddress.comment.$dirty"
              />
            </v-col>
          </v-row>
        </div>
      </div>
    </template>
  </mp-dialog-confirmation>
</template>

<script lang="ts">
import mixins from 'vue-typed-mixins'
import { validationMixin } from '@/mixins'
import {
  Address,
  AddressDescription,
  ExchangePlaceEntity,
  Filters,
  getDefaultAddress,
} from '@/types'
import { required } from 'vuelidate/lib/validators'
import { wait } from '@/helpers/helper'
import debounce from 'debounce'
import AddressService from '@/services/address/AddressService'
import { v4 } from 'uuid'
import { AddressType } from '@/types/entities/address'
import ExchangePlaceService from '@/services/exchangePlace/ExchangePlaceService'
import createOrderCustomAddress from '@/views/Order/Create/components/customAddress.vue'
import OrderMapper from '@/services/order/OrderMapper'
const DEBOUNCE_DELAY = 250

export default mixins(validationMixin).extend({
  name: 'edit-return-arrival-address-modal',
  components: {
    createOrderCustomAddress,
  },
  validations: {
    apiAddress: {},
    selectedAddress: {
      addressLine1: { required },
      postalCode: { required },
      city: { required },
      country: { required },
      comment: {},
    },
  },
  props: {
    showDialog: {
      type: Boolean,
      required: true,
    },
    retailer: {
      type: Object as () => Filters,
      required: true,
    },
    store: {
      type: Object as () => Filters,
      required: true,
    },
    exchangePlaces: {
      type: Array as () => Filters[],
      required: true,
    },
    exchangePlaceId: {
      type: [String, Number],
      default: null,
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
    loadingDeliveryApiAddress: false,
    suggestionsDeliveryApiAddress: [] as AddressDescription[],
    isLoadingDetails: false,
    apiAddress: null as AddressDescription | null,
    sessionToken: null as string | null,
    selectedAddress: {} as Address | null,
    exchangesPlaces: [] as Array<{ id: number; name: string }>,
    selectedAddressType: AddressType.EXCHANGE_PLACE || (AddressType.ADDRESS as string),
    invalid: false,
    AddressType,
    hasData: false,
    isEmptyStore: false,
  }),
  async mounted() {
    const { address } = this
    this.isLoadingDetails = true
    this.invalid = this.$v.selectedAddress.$invalid
    this.isEmptyStore = Boolean(!this.exchangePlaces.length && this.exchangePlaceId)
    if (this.isEmptyStore) {
      this.selectedAddressType = AddressType.ADDRESS
    } else {
      this.selectedAddressType = this.exchangePlaceId
        ? AddressType.EXCHANGE_PLACE
        : AddressType.ADDRESS
    }

    this.selectedAddress = { ...address }
    if (this.selectedAddressType === AddressType.EXCHANGE_PLACE) {
      await this.resetExchangePlace()
    } else {
      this.resetPersonalAddress()
      this.suggestionsDeliveryApiAddress.push({
        address: `${this.address.addressLine1}, ${this.address.postalCode} ${this.address.city}`,
        placeId: '',
      })
      this.apiAddress = this.suggestionsDeliveryApiAddress[0]
    }
    this.hasData = true
    await wait(500)
    this.isLoadingDetails = false
  },
  computed: {
    arrivalTypesList(): Array<{ label: string; value: string }> {
      return [
        {
          label: this.$t('common.exchangePlace'),
          value: AddressType.EXCHANGE_PLACE,
        },
        {
          label: this.$t('page.createOrder.steps.step1.labels.personalAddress'),
          value: AddressType.ADDRESS,
        },
      ]
    },
  },
  methods: {
    resetPersonalAddress() {
      if (this.address.exchangePlaceId && !this.isEmptyStore) {
        this.selectedAddress = getDefaultAddress()
      } else {
        this.selectedAddress = { ...this.address }
      }
    },
    async resetExchangePlace() {
      await this.returnHandleChangeExchangePlaces(this.exchangePlaceId || this.exchangePlaces[0].id)
    },
    async returnHandleChangeExchangePlaces(newExchangePlaceId: number | string) {
      if (newExchangePlaceId) {
        const currentExchangePlace = this.exchangePlaces.find(
          localExchangePlace => localExchangePlace.id === newExchangePlaceId,
        )
        if (currentExchangePlace) {
          const exchangePlaceEntity: ExchangePlaceEntity = await ExchangePlaceService.get(
            currentExchangePlace.id,
          )
          const newAddress = {
            ...exchangePlaceEntity.address,
            exchangePlaceId: exchangePlaceEntity.id,
            formated: OrderMapper.getFormatedAddress(exchangePlaceEntity.address),
            type: AddressType.EXCHANGE_PLACE,
          }
          this.selectedAddress = newAddress
        }
      }
    },

    onInputChange: debounce(async function(this: any, text: string, isInit?: boolean) {
      if (this.isLoadingDetails || !text) {
        return
      }
      this.loadingDeliveryApiAddress = true

      if (!this.sessionToken) {
        this.sessionToken = v4()
      }

      const addresses = await AddressService.autoComplete({
        input: text,
        sessionToken: this.sessionToken,
      })
      this.suggestionsDeliveryApiAddress = [...addresses]
      if (isInit) {
        this.apiAddress = this.suggestionsPickingApiAddress[0]
        await this.handleChangeApiAddress()
      }
      this.loadingDeliveryApiAddress = false
    }, DEBOUNCE_DELAY),
    handleApiAddressClear(): void {
      this.apiAddress = null
    },
    async handleChangeApiAddress() {
      if (!this.apiAddress?.placeId) {
        return
      }

      const detail = await AddressService.getDetail({
        placeId: this.apiAddress!.placeId,
        sessionToken: this.sessionToken || v4(),
      })

      this.isLoadingDetails = true

      this.sessionToken = null
      this.selectedAddress = {
        ...this.selectedAddress,
        ...detail,
        type: AddressType.ADDRESS,
      }

      await wait(150)
      this.isLoadingDetails = false
    },
  },
  watch: {
    selectedAddressType: {
      async handler(next, previous) {
        if (this.hasData) {
          this.isLoadingDetails = true
          if (previous !== AddressType.ADDRESS && next === AddressType.ADDRESS) {
            this.resetPersonalAddress()
          }
          if (previous !== AddressType.EXCHANGE_PLACE && next === AddressType.EXCHANGE_PLACE) {
            await this.resetExchangePlace()
          }
          await wait(500)
          this.isLoadingDetails = false
        }
      },
    },
    '$v.selectedAddress.$invalid'(next) {
      this.invalid = next
    },
  },
})
</script>

<style lang="scss">
@import '../../../../../../../styles/mixins/macScrollbar';

.edit-return-arrival-address-modal {
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
      overflow-x: hidden;
      max-height: calc(100vh - 5.2rem - 8rem);
      min-height: calc(100vh - 5.2rem - 8rem);
    }

    @include setMacScrollbar('&');
    color: $main-color;

    .return-arrival-radio-group {
      padding: 2.1rem 2.1rem 3.5rem 2.1rem;
    }
  }
}
</style>
