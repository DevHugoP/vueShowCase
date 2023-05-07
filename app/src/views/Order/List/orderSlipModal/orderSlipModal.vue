<template>
  <mp-dialog-confirmation
    dataId="order-slip-modal"
    color="primary"
    :header="{
      icon: $vuetify.breakpoint.smAndUp ? 'mdi-file-download' : '',
      isColorBackground: true,
      text: $t('components.orderSlip.title'),
      textPolice: 'regular14',
      iconClose: 'mdi-close',
    }"
    :btnCancel="{
      text: $t('action.cancel.base'),
      format: $vuetify.breakpoint.xsOnly ? 'sticky' : 'link',
      ...($vuetify.breakpoint.smAndUp && { linkColor: 'black' }),
      ...($vuetify.breakpoint.xsOnly && { stickyColor: 'yellow' }),
    }"
    :btnValidation="{
      text: $t('action.download'),
      format: $vuetify.breakpoint.xsOnly ? 'sticky' : 'success',
      ...($vuetify.breakpoint.xsOnly && { stickyColor: 'yellow' }),
      disabled: $v.$invalid,
    }"
    @submit="downloadOrderSlip()"
    @close="$emit('hide')"
    :fullscreen="$vuetify.breakpoint.xsOnly"
    classWrapper="order-slip-dialog"
  >
    <template #content>
      <v-form ref="form" id="order-slip-form">
        <v-row no-gutters justify="center" class="mt-5">
          <v-col cols="10" class="mb-5" v-if="carrierIds.length !== 1">
            <mp-select
              :label="`${translate('carrier')} *`"
              v-model="carrierId"
              :items="getSelectItems('carrier')"
              cacheItems
              clearable
              dataId="order-slip-retailer"
              @input="$v.carrierId.$touch()"
              @blur="$v.carrierId.$touch()"
              :errors="getModelErrors($v.carrierId)"
              :isDirty="$v.carrierId.$dirty"
            />
          </v-col>

          <v-col cols="10" class="mb-5" v-if="retailerIds.length !== 1">
            <mp-select
              :label="`${translate('retailer')} *`"
              v-model="retailerId"
              :items="getSelectItems('retailer')"
              @change="getStores($event)"
              cacheItems
              clearable
              dataId="order-slip-retailer"
              @input="$v.retailerId.$touch()"
              @blur="$v.retailerId.$touch()"
              :errors="getModelErrors($v.retailerId)"
              :isDirty="$v.retailerId.$dirty"
            />
          </v-col>

          <v-col cols="10" class="mb-5" v-if="retailerIds.length !== 1 || storeIds.length !== 1">
            <mp-select
              :label="`${translate('store')} *`"
              v-model="storeId"
              :items="getSelectItems('store')"
              @change="getExchangeplaces($event)"
              :disabled="!stores.length"
              clearable
              dataId="order-slip-store"
              @input="$v.storeId.$touch()"
              @blur="$v.storeId.$touch()"
              :errors="getModelErrors($v.storeId)"
              :isDirty="$v.storeId.$dirty"
            />
          </v-col>

          <v-col
            cols="10"
            class="mb-5"
            v-if="storeIds.length !== 1 || exchangePlaceIds.length !== 1"
          >
            <mp-select
              ref="exchangePlace"
              :label="`${translate('exchangePlace')} *`"
              v-model="exchangePlaceId"
              :items="getSelectItems('exchangePlace')"
              :disabled="!exchangePlaces.length"
              clearable
              dataId="order-slip-store"
              @input="$v.exchangePlaceId.$touch()"
              @blur="$v.exchangePlaceId.$touch()"
              :errors="getModelErrors($v.exchangePlaceId)"
              :isDirty="$v.exchangePlaceId.$dirty"
            />
          </v-col>

          <v-col cols="10" class="mb-5">
            <mp-select
              ref="status"
              :label="`${translate('deliveryStatus')} *`"
              v-model="status"
              :items="getSelectItems('delivery')"
              cacheItems
              multiple
              chips
              smallChips
              clearable
              deletableChips
              hideSelected
              dataId="order-slip-status"
              @input="$v.status.$touch()"
              @blur="$v.status.$touch()"
              :errors="getModelErrors($v.status)"
              :isDirty="$v.status.$dirty"
            />
          </v-col>

          <v-col cols="10" class="mb-5">
            <mp-date-range
              clearable
              dataId="order-slip-pickingDate"
              :actions="{
                today: $t('common.today'),
                yesterday: $t('common.yesterday'),
                past30days: $t('components.daterange.past30days'),
              }"
              :label="translate('pickingDate')"
              v-model="pickDate"
              :dateHelper="dateHelper"
              @input="$v.pickDate.$touch()"
              @blur="$v.pickDate.$touch()"
              :errors="getModelErrors($v.pickDate)"
              :isDirty="$v.pickDate.$dirty"
            />
          </v-col>
        </v-row>
      </v-form>
    </template>
  </mp-dialog-confirmation>
</template>

<script lang="ts">
import { ORDER_STATUS } from '@/constants/shared'
import { EXCHANGE_PLACE_TYPE } from '@/constants'
import { dateHelper } from '@/helpers/dateHelper'
import { validationMixin } from '@/mixins'
import AuthorizationService from '@/services/authorization/AuthorizationService'
import CarrierService from '@/services/carrier/CarrierService'
import ExchangePlaceService from '@/services/exchangePlace/ExchangePlaceService'
import RetailerService from '@/services/retailer/RetailerService'
import StoreService from '@/services/store/StoreService'
import { SnackBarType } from '@/store/types'
import { Filters, RulesKey } from '@/types'

import FileDownload from 'js-file-download'
import Vue from 'vue'
import { required } from 'vuelidate/lib/validators'
import DeliveryService from '@/services/delivery/DeliveryService'
import { DELIVERY_STATUS, DELIVERY_STATUS_DETAIL } from '@/constants'

const rule: RulesKey = 'DOWNLOAD_DELIVERY_NOTE'

export default Vue.extend({
  name: 'order-slip-modal',
  mixins: [validationMixin],
  data: () => ({
    retailers: [] as Filters[],
    stores: [] as Filters[],
    carriers: [] as Filters[],
    exchangePlaces: [] as Filters[],
    retailerId: null as string | number | null,
    storeId: null as string | number | null,
    exchangePlaceId: null as string | number | null,
    pickDate: {} as { start: string; end: string } | Record<string, unknown>,
    carrierId: null as string | number | null,
    status: [
      { status: DELIVERY_STATUS.INIT },
      { status: DELIVERY_STATUS.PICK_UP_STARTED },
    ] as Array<Record<string, any>> | null,
    dateHelper,
    retailerIds: [] as number[],
    storeIds: [] as number[],
    exchangePlaceIds: [] as number[],
    carrierIds: [] as number[],
  }),
  validations: {
    carrierId: { required },
    retailerId: { required },
    storeId: { required },
    exchangePlaceId: { required },
    status: { required },
    pickDate: {},
  },
  beforeMount() {
    this.getCarriers()
    const { permissions } = this.$store.getters['auth/currentUser']
    const { retailerIds, storeIds, carrierIds, exchangePlaceIds } = AuthorizationService.getContext(
      permissions,
      rule,
    )

    this.retailerIds = retailerIds
    this.storeIds = storeIds
    this.exchangePlaceIds = exchangePlaceIds
    this.carrierIds = carrierIds

    if (carrierIds.length === 1) {
      this.carrierId = carrierIds[0]
    }

    if (retailerIds.length === 1) {
      this.retailerId = retailerIds[0]

      if (storeIds.length === 1) {
        this.storeId = storeIds[0]
        this.getExchangeplaces(this.storeId)
        return
      }

      this.getStores(this.retailerId)
      return
    }

    this.getRetailers()
  },
  methods: {
    translate(key: string) {
      return this.$t(`page.orders.filters.${key}`)
    },
    getSelectItems(type: string) {
      let items = {}
      let translationKey = ''

      switch (type) {
        case 'order':
          items = ORDER_STATUS
          translationKey = 'technical.status.order'
          break

        case 'delivery':
          return DELIVERY_STATUS_DETAIL.map(deliveryStatus => ({
            value: deliveryStatus,
            text: this.$t([
              `technical.status.delivery.${deliveryStatus.status}.${deliveryStatus.subStatus}`,
              `technical.status.delivery.${deliveryStatus.status}.default`,
            ]),
          }))

        case 'retailer':
          return this.retailers.length
            ? this.retailers.map(({ id, name }) => ({
                value: id,
                text: name,
              }))
            : []

        case 'store':
          return this.stores
            ? this.stores.map(({ id, name }) => ({
                value: id,
                text: name,
              }))
            : []

        case 'carrier':
          return this.carriers
            ? this.carriers.map(({ id, name }) => ({
                value: id,
                text: name,
              }))
            : []

        case 'exchangePlace':
          return this.exchangePlaces
            ? this.exchangePlaces.map(({ id, name }) => ({
                value: id,
                text: name,
              }))
            : []

        default:
          return
      }

      return Object.values(items).map(item => ({
        value: item,
        text: this.$t(`${translationKey}.${item}`),
      }))
    },
    async getRetailers() {
      this.retailers = await RetailerService.getFilters({ forRule: rule })
    },
    async getCarriers() {
      this.carriers = await CarrierService.getFilters({ forRule: rule })
    },
    async getStores(retailerId: string | number | null = null) {
      if (retailerId) {
        this.stores = await StoreService.getFilters({ forRule: rule, retailerId })
      } else {
        this.resetStores()
      }
    },
    async getExchangeplaces(storeId: string | number | null = null) {
      if (storeId) {
        this.exchangePlaces = await ExchangePlaceService.getFilters({
          forRule: rule,
          storeId,
          type: [
            EXCHANGE_PLACE_TYPE.EXCHANGE_PLACE_PFU,
            EXCHANGE_PLACE_TYPE.EXCHANGE_PLACE_STORAGE,
            EXCHANGE_PLACE_TYPE.EXCHANGE_PLACE_STORE,
          ],
        })

        if (this.exchangePlaces.length === 1) {
          this.exchangePlaceId = this.exchangePlaces[0].id
        }
      } else {
        this.resetExchangePlaces()
      }
    },
    resetStores() {
      this.resetExchangePlaces()
      this.storeId = null
      this.stores = []
      this.$nextTick(() => {
        this.$v.storeId.$reset()
      })
    },
    resetExchangePlaces() {
      this.exchangePlaceId = null
      this.exchangePlaces = []
      this.$nextTick(() => {
        this.$v.exchangePlaceId.$reset()
      })
    },
    async downloadOrderSlip() {
      try {
        const { retailerId, storeId, exchangePlaceId, carrierId, status, pickDate } = this

        const { statuses, subStatus } = status!.reduce(
          (acc: Record<string, any>, deliveryStatus: Record<string, any>) => {
            if (deliveryStatus.status) {
              acc.statuses.push(deliveryStatus.status)
            }

            if (deliveryStatus.subStatus) {
              acc.subStatus.push(deliveryStatus.subStatus)
            }

            return acc
          },
          {
            statuses: [],
            subStatus: [],
          },
        )

        const orderSlip = await DeliveryService.downloadSlip({
          retailerId,
          storeId,
          exchangePlaceId,
          carrierId,
          status: statuses,
          ...(subStatus?.length && { subStatus }),
          pickDate,
        })
        FileDownload(orderSlip, `${this.$t('common.slipName', { timestamp: Date.now() })}.pdf`)
      } catch (err) {
        this.$store.dispatch('setSnackbar', {
          type: SnackBarType.ERROR,
          message: this.$t('messages.impossibleDownloadOrderSlip'),
        })
      } finally {
        this.$emit('hide')
      }
    },
  },
})
</script>

<style lang="scss">
@import '../../../../styles/mixins/macScrollbar';
.order-slip-dialog {
  .main-dialog-content {
    overflow-y: scroll;
    overflow-x: hidden;
    @include setMacScrollbar('&');

    @media #{map-get($display-breakpoints, 'sm-and-up')} {
      max-height: calc(60vh - 8rem);
    }

    @media #{map-get($display-breakpoints, 'xs-only')} {
      min-height: calc(100vh - 8rem);
    }
  }
}
</style>
