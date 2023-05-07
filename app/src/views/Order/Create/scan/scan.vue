<template>
  <v-row no-gutters class="block" data-id="order-create-block-scan">
    <v-col cols="12" class="header">
      <h2>{{ $t('page.createOrder.titles.scan') }}</h2>
      <span class="block-info">{{ $t('page.createOrder.infos.scan') }}</span>
    </v-col>

    <v-col cols="12" class="content">
      <mp-textfield
        :label="$t('page.createOrder.scan.ticket')"
        v-model="localTicket"
        @input="$v.localTicket.$touch()"
        @blur="$v.localTicket.$touch()"
        :errors="getModelErrors($v.localTicket)"
        :isDirty="$v.localTicket.$dirty"
        dataId="order-create-scan-ticket"
        @press-enter="submitApply()"
        :disabled="isEditing"
      />

      <div class="d-flex">
        <mp-button
          v-if="!isEditing"
          class="mt-6 ml-auto"
          format="secondary"
          :text="$t('action.apply')"
          dataId="order-create-scan-apply"
          @click="submitApply()"
          :disabled="!localTicket"
          :loading="showLoadingBtn"
        />
      </div>
    </v-col>

    <mp-dialog-confirmation
      v-if="showDialog"
      dataId="order-create-scan-dialog"
      color="error"
      :header="{
        iconClose: 'mdi-close',
        icon: $vuetify.breakpoint.smAndUp ? 'mdi-exclamation-thick' : '',
        isColorBackground: false,
      }"
      :btnCancel="{ text: $t('action.cancel.base'), format: 'link', linkColor: 'black' }"
      :btnValidation="{
        text: $t(`action.confirm.base`),
        format: 'error',
      }"
      :btnToColumn="$vuetify.breakpoint.xsOnly"
      :textContent="$t('page.order.scan.dialog.infos')"
      @close="
        showDialog = false
        localTicket = scan.ticket
      "
      @submit="
        hasBeenSet = false
        submitApply()
        showDialog = false
      "
      :fullscreen="$vuetify.breakpoint.xsOnly"
    />
  </v-row>
</template>

<script lang="ts">
import postalCodeHelper from '@/helpers/postalCodeHelper'
import { validationMixin } from '@/mixins'
import OrderMapper from '@/services/order/OrderMapper'
import receiptsService from '@/services/receipts/receiptsService'
import { defaultAddress } from '@/store/modules/createOrder/arrival'
import { CreateOrderStateArrival } from '@/store/modules/createOrder/arrival/types'
import { CreateOrderStateCustomerCode } from '@/store/modules/createOrder/customerCode/types'
import { CreateOrderStateDeliveryContact } from '@/store/modules/createOrder/deliveryContact/types'
import { defaultPackage, defaultProduct } from '@/store/modules/createOrder/orderContent'
import { CreateOrderStateOrderContent } from '@/store/modules/createOrder/orderContent/types'
import { CreateOrderStateScan } from '@/store/modules/createOrder/scan/types'
import { CreateOrderStateSenderIdentity } from '@/store/modules/createOrder/senderIdentity/types'
import { CreateOrderStateMiscellaneous } from '@/store/modules/createOrder/types'
import { SnackBarType } from '@/store/types'
import { Address, CHECKOUT_BLOCKS } from '@/types'
import mixins from 'vue-typed-mixins'
import { required, maxLength } from 'vuelidate/lib/validators'

export default mixins(validationMixin).extend({
  name: 'order-create-scan',
  props: {
    isEditing: {
      type: Boolean,
      required: true,
    },
  },
  validations: {
    localTicket: { required, maxLength: maxLength(50) },
  },
  data: () => ({
    hasBeenSet: false,
    showDialog: false,
    showLoadingBtn: false,
    localTicket: '',
  }),
  computed: {
    senderIdentity(): CreateOrderStateSenderIdentity {
      return this.$store.getters['createOrder/senderIdentity/senderIdentity']
    },
    deliveryContact(): CreateOrderStateDeliveryContact {
      return this.$store.getters['createOrder/deliveryContact/deliveryContact']
    },
    arrival(): CreateOrderStateArrival {
      return this.$store.getters['createOrder/arrival/arrival']
    },
    orderContent(): CreateOrderStateOrderContent {
      return this.$store.getters['createOrder/orderContent/orderContent']
    },
    customerCode(): CreateOrderStateCustomerCode {
      return this.$store.getters['createOrder/customerCode/customerCode']
    },
    miscellaneous(): CreateOrderStateMiscellaneous {
      return this.$store.getters['createOrder/miscellaneous']
    },
    scan(): CreateOrderStateScan {
      return this.$store.getters['createOrder/scan/scan']
    },
    validations(): any {
      return this.$store.getters['createOrder/scan/$v']
    },
    checkoutHasScan(): boolean {
      if (!this.miscellaneous.checkout) {
        return false
      }

      const blocks = Object.values(this.miscellaneous.checkout.steps).reduce((acc, step) => {
        return [...acc, ...step]
      }, [])

      return blocks.includes(CHECKOUT_BLOCKS.TICKET_CONTENT)
    },
  },
  beforeMount() {
    if (this.scan.ticket) {
      this.localTicket = this.scan.ticket
      this.hasBeenSet = true
    }
  },
  methods: {
    async submitApply(): Promise<void> {
      if (this.hasBeenSet) {
        this.showDialog = true
        return
      }

      try {
        this.showLoadingBtn = true

        const response = await receiptsService.get(this.localTicket, {
          retailerId: this.senderIdentity.retailerId!,
        })

        // Fill contact
        if (response.delivery?.contact) {
          this.deliveryContact.contact = response.delivery.contact
          this.miscellaneous.saveAddress.arrival.contact = response.delivery.contact
        }

        // Fill address
        if (!response.delivery?.addresses?.length) {
          this.miscellaneous.availableAddresses = []
        } else {
          const localAvailableAddresses = []

          response.delivery.addresses.map((address: Address) => {
            if (address.addressLine1 && address.postalCode && address.country && address.city) {
              const regex = postalCodeHelper.isValid(address.country)

              if (regex && regex.test(address.postalCode)) {
                localAvailableAddresses.push({
                  ...address,
                  text: OrderMapper.getFormatedAddress(address),
                  value: OrderMapper.getFormatedAddress(address),
                })
              }
            }
          })

          if (localAvailableAddresses?.length) {
            localAvailableAddresses.push({
              ...defaultAddress(),
              text: this.$t('common.otherAddress'),
              value: -1,
            })

            this.miscellaneous.availableAddresses = localAvailableAddresses
            this.arrival.scanVariant = true
          }
        }
        //fill adress form from scan/ticket
        if (this.miscellaneous.availableAddresses.length > 1) {
          this.arrival = {
            ...this.arrival,
            ...this.miscellaneous.availableAddresses[0],
          }
          this.miscellaneous.saveAddress.arrival.address = { ...this.arrival }
        }

        this.arrival.typeFront = -1

        // Fill packages
        this.orderContent.packages = response.packages.map(localPackage => {
          // return
          return {
            ...defaultPackage(),
            ...localPackage,
            products: localPackage.products?.length
              ? localPackage.products.map(product => {
                  return {
                    ...defaultProduct(),
                    label: this.$t('common.productUnknown'),
                    ...product,
                  }
                })
              : [],
          } as any
        })

        this.$store.dispatch('setSnackbar', {
          type: SnackBarType.SUCCESS,
          message: this.$t('page.order.ticketContent.getTicketContent'),
        })

        this.scan.ticket = this.localTicket
        this.showLoadingBtn = false
        this.hasBeenSet = true
      } catch (e) {
        this.scan.ticket = this.localTicket
        this.$store.dispatch('setSnackbar', {
          type: SnackBarType.ERROR,
          message: this.$t('messages.error'),
        })
        this.showLoadingBtn = false
      } finally {
        // Fill externalOrderId
        this.customerCode.externalOrderId = this.localTicket
      }
    },
  },
  watch: {
    senderIdentity: {
      deep: true,
      handler() {
        this.scan.ticket = null
        this.customerCode.externalOrderId = ''
        this.arrival = defaultAddress()

        this.$nextTick(() => {
          this.validations.scan.$reset()
        })
      },
    },
  },
})
</script>
