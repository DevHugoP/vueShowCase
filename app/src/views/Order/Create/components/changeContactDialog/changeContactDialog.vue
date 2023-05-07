<template>
  <mp-dialog-confirmation
    dataId="create-order-dialog-change-contact"
    persistent
    :showIconClose="false"
    @submit="saveContact()"
    color="primary"
    :header="{
      icon: $vuetify.breakpoint.smAndUp ? 'mdi-exclamation-thick' : '',
      isColorBackground: true,
      text: getTitle,
      textPolice: 'h4',
    }"
    :btnValidation="{
      text: $t('action.valid.base'),
      format: $vuetify.breakpoint.smAndUp ? 'success' : 'sticky',
      stickyColor: $vuetify.breakpoint.smAndUp ? undefined : 'yellow',
      disabled: isSubmitDisabled,
    }"
    :btnToColumn="$vuetify.breakpoint.smAndDown"
    classWrapper="order-create-dialog-change-contact"
    :fullscreen="$vuetify.breakpoint.xsOnly"
  >
    <template #content>
      <v-row no-gutters>
        <v-col cols="12" v-if="hasPickingAddressChanged && hasDeliveryAddressChanged">
          <div class="chips-wrapper">
            <div
              :class="`chip${selectedChip === 'picking' ? ' selected' : ''}`"
              @click="selectedChip = 'picking'"
              data-id="select-picking"
            >
              <span class="regular14">
                {{ $t('page.order.contact.dialog.picking.shortTitle') }}
              </span>
              <v-icon
                size="1.6rem"
                :class="`pl-2 ${pickingChoice ? 'success-color' : 'main-lighten-74'}`"
              >
                mdi-checkbox-marked-circle
              </v-icon>
            </div>

            <div
              :class="`chip${selectedChip === 'delivery' ? ' selected' : ''}`"
              @click="selectedChip = 'delivery'"
              data-id="select-delivery"
            >
              <span class="regular14">
                {{ $t('page.order.contact.dialog.delivery.shortTitle') }}
              </span>
              <v-icon
                size="1.6rem"
                :class="`pl-2 ${deliveryChoice ? 'success-color' : 'main-lighten-74'}`"
              >
                mdi-checkbox-marked-circle
              </v-icon>
            </div>
          </div>

          <v-row no-gutters>
            <v-col cols="10" offset="1">
              <change-contact-dialog-content
                :choice.sync="pickingChoice"
                type="picking"
                v-if="selectedChip === 'picking'"
              />

              <change-contact-dialog-content :choice.sync="deliveryChoice" type="delivery" v-else />
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="10" offset="1" v-else>
          <change-contact-dialog-content
            :choice.sync="pickingChoice"
            type="picking"
            v-if="hasPickingAddressChanged"
          />

          <change-contact-dialog-content :choice.sync="deliveryChoice" type="delivery" v-else />
        </v-col>
      </v-row>
    </template>
  </mp-dialog-confirmation>
</template>

<script lang="ts">
import changeContactDialogContent from './changeContactDialogContent.vue'

import Vue from 'vue'
import { CreateOrderStateMiscellaneous } from '@/store/modules/createOrder/types'
import { defaultContact as defaultShippingContact } from '@/store/modules/createOrder/shippingContact'
import { defaultContact as defaultDeliveryContact } from '@/store/modules/createOrder/deliveryContact'
import { CreateOrderStateShippingContact } from '@/store/modules/createOrder/shippingContact/types'
import { CreateOrderStateDeliveryContact } from '@/store/modules/createOrder/deliveryContact/types'
import { CreateOrderStateDeparture } from '@/store/modules/createOrder/departure/types'
import { CreateOrderStateArrival } from '@/store/modules/createOrder/arrival/types'

export enum changeContact {
  OLD = 'old',
  NEW = 'new',
  EMPTY = 'empty',
}

export default Vue.extend({
  name: 'change-contact-dialog',
  components: {
    changeContactDialogContent,
  },
  data: () => ({
    hasPickingAddressChanged: false,
    hasDeliveryAddressChanged: false,
    changeContact,
    pickingChoice: null as changeContact | null,
    deliveryChoice: null as changeContact | null,
    selectedChip: 'picking',
  }),
  computed: {
    shippingContact(): CreateOrderStateShippingContact {
      return this.$store.getters['createOrder/shippingContact/shippingContact']
    },
    deliveryContact(): CreateOrderStateDeliveryContact {
      return this.$store.getters['createOrder/deliveryContact/deliveryContact']
    },
    departure(): CreateOrderStateDeparture {
      return this.$store.getters['createOrder/departure/departure']
    },
    arrival(): CreateOrderStateArrival {
      return this.$store.getters['createOrder/arrival/arrival']
    },
    miscellaneous(): CreateOrderStateMiscellaneous {
      return this.$store.getters['createOrder/miscellaneous']
    },
    getTitle(): string {
      if (this.hasPickingAddressChanged && this.hasDeliveryAddressChanged) {
        return this.$t('page.order.contact.dialog.title')
      }

      if (this.hasPickingAddressChanged && !this.hasDeliveryAddressChanged) {
        return this.$t('page.order.contact.dialog.picking.title')
      }

      return this.$t('page.order.contact.dialog.delivery.title')
    },
    isSubmitDisabled(): boolean {
      if (this.hasPickingAddressChanged && this.hasDeliveryAddressChanged) {
        return !this.pickingChoice || !this.deliveryChoice
      }

      if (this.hasPickingAddressChanged) {
        return !this.pickingChoice
      }

      return !this.deliveryChoice
    },
  },
  async beforeMount() {
    this.hasPickingAddressChanged = await this.$store.dispatch(
      'createOrder/hasAddressChanged',
      'departure',
    )
    this.hasDeliveryAddressChanged = await this.$store.dispatch(
      'createOrder/hasAddressChanged',
      'arrival',
    )
  },
  methods: {
    saveContact() {
      // Picking
      switch (this.pickingChoice) {
        case changeContact.NEW:
          this.shippingContact.contact = JSON.parse(
            JSON.stringify(this.miscellaneous.saveAddress.departure.newContact!),
          )
          break
        case changeContact.EMPTY:
          this.shippingContact.contact = defaultShippingContact()
          break
      }

      // Delivery
      switch (this.deliveryChoice) {
        case changeContact.NEW:
          this.deliveryContact.contact = JSON.parse(
            JSON.stringify(this.miscellaneous.saveAddress!.arrival.newContact!),
          )
          break
        case changeContact.EMPTY:
          this.deliveryContact.contact = defaultDeliveryContact()
          break
      }

      // reste the save
      this.miscellaneous.saveAddress = JSON.parse(
        JSON.stringify({
          departure: {
            address: this.departure,
            contact: this.shippingContact.contact,
          },
          arrival: {
            address: this.arrival,
            contact: this.deliveryContact.contact,
          },
        }),
      )

      this.$emit('submit')
    },
  },
})
</script>

<style lang="scss">
@import '../../../../../styles/mixins/macScrollbar';

.order-create-dialog-change-contact {
  .main-dialog-content {
    overflow-y: auto;
    @include setMacScrollbar('&');

    @media #{map-get($display-breakpoints, 'sm-and-up')} {
      max-height: calc(80vh - 10.9rem - 9.8rem);
    }

    @media #{map-get($display-breakpoints, 'xs-only')} {
      max-height: calc(100vh - 5.2rem - 8rem);
      min-height: calc(100vh - 5.2rem - 8rem);
    }
  }

  .chips-wrapper {
    display: flex;
    padding: 2rem 1rem;
    overflow-x: auto;
    background-color: $main-lighten-74-color;
    @include setMacScrollbar('&');

    .chip {
      border: 0.1rem solid $main-lighten-74-color;
      border-radius: 5rem;
      padding: 0.6rem 2.2rem;
      min-width: fit-content;
      background-color: $white;
      display: flex;
      align-items: center;
      cursor: pointer;

      &:not(:first-child) {
        margin-left: 2rem;
      }

      &.selected {
        border: 0.2rem solid $main-color;
      }
    }
  }
}
</style>
