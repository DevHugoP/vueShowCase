<template>
  <v-row no-gutters class="block" data-id="order-create-block-departure">
    <v-col cols="12" class="header">
      <h2>{{ $t('page.createOrder.titles.departure') }}</h2>
      <span class="block-info">{{ $t('page.createOrder.infos.departure') }}</span>
    </v-col>

    <v-col cols="12" class="content">
      <mp-select
        class="mb-5"
        :label="`${$t('page.createOrder.steps.step1.labels.startingPoint')} *`"
        v-model="departure.exchangePlaceId"
        @input="validations.departure.exchangePlaceId.$touch()"
        @blur="validations.departure.exchangePlaceId.$touch()"
        :errors="getModelErrors(validations.departure.exchangePlaceId)"
        :isDirty="validations.departure.exchangePlaceId.$dirty"
        :items="getExchangePlacesItems"
        itemText="name"
        itemValue="id"
        :disabled="!senderIdentity.storeId"
        clearable
        dataId="order-create-departure-exchangePlaceId"
        @change="departureHandleChangeExchangePlaces($event)"
        :attach="`#order-create-departure-exchangePlace`"
        :dropdownId="`order-create-departure-exchangePlace`"
      />

      <!-- picking address from API -->
      <mp-autocomplete
        v-if="departure.exchangePlaceId === -1"
        class="mb-5"
        :label="`${$t('action.search.departure')}`"
        v-model="departureApiAddress.apiAddress"
        :errors="[$t('validation.address')]"
        searchingMode
        mandatory
        :loading="departureApiAddress.loading"
        :items="departureApiAddress.suggestions"
        @loadItems="departureOnDebounceInputChange($event)"
        @change="departureHandleChangeApiAddress()"
        displayName="address"
        dataId="order-create-departure-apiAddress"
        id="order-create-departure-api-address"
        attach="#apiAddressApiAddressDropdown"
        dropdownId="apiAddressApiAddressDropdown"
        :appendIcon="null"
      />

      <!-- Custom apiAddress address -->
      <create-order-custom-address
        v-if="departure.exchangePlaceId === -1"
        class="mb-5"
        :address="departure"
        :validations="validations.departure"
        @resetFormated="resetFormated()"
        dataId="create-order-departure"
        :searchLabel="`${$t('common.address.departure')}`"
      />

      <!-- Address complement -->
      <create-order-itinerary-more-detail
        v-if="departure.exchangePlaceId === -1"
        :address="departure"
        :validations="validations.departure"
        dataId="create-order-departure"
        :showMore.sync="departureApiAddress.showMore"
      />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { departureMixin, validationMixin } from '@/mixins'

import mixins from 'vue-typed-mixins'

import createOrderCustomAddress from '@/views/Order/Create/components/customAddress.vue'
import createOrderItineraryMoreDetail from '@/views/Order/Create/components/moreDetailAddress.vue'
import { ROUTES } from '@/constants'

export default mixins(validationMixin, departureMixin).extend({
  name: 'order-create-departure',
  components: {
    createOrderCustomAddress,
    createOrderItineraryMoreDetail,
  },
  computed: {
    rule(): string {
      return this.isEditing ? 'EDIT_ORDERS' : 'CREATE_ORDERS'
    },
    isMoreDetailFilled(): boolean {
      const { addressLine2, doorCode, floor, elevator, comment } = this.departure

      return (
        Boolean(addressLine2) ||
        Boolean(doorCode) ||
        Boolean(floor) ||
        Boolean(elevator) ||
        Boolean(comment)
      )
    },
    getExchangePlacesItems(): Array<{ id: number; name: string }> {
      if (this.arrival.exchangePlaceId) {
        const filter = this.departureExchangePlaces.filter(
          exchangePlace =>
            exchangePlace.id === -1 ||
            (exchangePlace.id && exchangePlace.id !== this.arrival.exchangePlaceId),
        )

        return filter?.length
          ? filter
          : [
              {
                id: -1,
                name: this.$t('page.createOrder.steps.step1.labels.personalAddress'),
              },
            ]
      }

      return this.departureExchangePlaces?.length
        ? this.departureExchangePlaces
        : [
            {
              id: -1,
              name: this.$t('page.createOrder.steps.step1.labels.personalAddress'),
            },
          ]
    },
  },
  async beforeMount() {
    if (!this.departure.exchangePlaceId) {
      this.departure.exchangePlaceId = -1
    }
    if (this.departure.formated) {
      await this.departureOnInputChange(this.departure.formated || '')
    }
    if (this.$route.name !== ROUTES.editOrder && this.validations.$invalid) {
      this.departureInitialize = true
      return
    }

    setTimeout(() => {
      if (this.departure.exchangePlaceId === -1) {
        this.departureApiAddress.showMore = this.isMoreDetailFilled
      }
      this.validations.departure.$touch()
    }, 250)
  },

  destroyed() {
    this.miscellaneous.saveAddress.departure = JSON.parse(
      JSON.stringify({
        address: this.departure,
        contact: this.shippingContact.contact,
      }),
    )

    this.miscellaneous.hasDepartureContactAlreadyBeenSet = true

    this.$emit('destroyed')
  },
})
</script>
