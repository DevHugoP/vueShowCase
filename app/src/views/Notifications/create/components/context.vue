<template>
  <div id="notification-context">
    <v-row no-gutters class="mt-6 bg-grey notification-context-bloc">
      <v-col cols="10" offset="1">
        <v-row no-gutters>
          <v-col cols="12">
            <h2>{{ $t('technical.notifications.contextComponentTitle') }}</h2>
          </v-col>
        </v-row>
        <v-row no-gutters class="mt-6" justify="space-between">
          <v-col :cols="fieldWrapperCols" class="px-5">
            <mp-select
              :label="`${$t('common.retailer')} *`"
              v-model="retailerId"
              :items="getSelectItems(NotificationsItems.RETAILER)"
              @change="getRetailers($event)"
              clearable
              attach="#notifications-context-retailer-select"
              dropdownId="notifications-context-retailer-select"
              dataId="notifications-context-retailer"
              :disabled="isEditing || disableRetailer"
              :search="{ model: '', label: $t('action.search.base') }"
            />
          </v-col>
          <v-col :cols="fieldWrapperCols" class="px-5">
            <mp-select
              :label="$t('technical.notifications.storesContext')"
              v-model="selectedStores"
              :items="getSelectItems(NotificationsItems.STORE)"
              @change="disableExchangePlacesField($event)"
              multiple
              clearable
              attach="#notifications-context-stores-select"
              dropdownId="notifications-context-stores-select"
              dataId="notifications-context-stores"
              :disabled="!retailerId || isEditing || disableStores"
              chips
              smallChips
              deletableChips
              hideSelected
              :search="{ model: '', label: $t('action.search.base') }"
            />
          </v-col>
          <v-col :cols="fieldWrapperCols" class="px-5">
            <mp-select
              :label="$t('technical.notifications.exchangePlacesContext')"
              v-model="selectedExchangePlaces"
              :items="getSelectItems(NotificationsItems.EXCHANGE_PLACES)"
              multiple
              :disabled="disableExchangePlaces || isEditing"
              chips
              smallChips
              deletableChips
              hideSelected
              clearable
              attach="#notifications-context-exchangePlaces-select"
              dropdownId="notifications-context-exchangePlaces-select"
              dataId="notifications-context-exchangePlaces"
              :search="{ model: '', label: $t('action.search.base') }"
            />
          </v-col>
          <v-col :cols="fieldWrapperCols" class="px-5">
            <mp-select
              :label="$t('page.customCheckout.dialogDetail.carriers.title')"
              v-model="selectedCarriers"
              :items="getSelectItems(NotificationsItems.CARRIER)"
              :disabled="
                isEditing || showCarrierSetAside || !retailerId || typeOfEvent === 'COLLECT'
              "
              multiple
              clearable
              chips
              smallChips
              deletableChips
              hideSelected
              attach="#notifications-context-carriers-select"
              dropdownId="notifications-context-carriers-select"
              dataId="notifications-context-carriers"
              :search="{ model: '', label: $t('action.search.base') }"
            />
          </v-col>
        </v-row>
        <v-row no-gutters class="mt-6">
          <v-col class="d-flex align-center">
            <mp-switch
              name="showCarrierSetAside"
              dataId="notifications-context-switch-setAside"
              v-model="showCarrierSetAside"
              :disabled="
                (Object.values(selectedCarriers)[0] ? true : false) || typeOfEvent === 'COLLECT'
              "
            />
            <span :class="`regular16 ${showCarrierSetAside ? '' : 'main-lighten-52'}`">{{
              $t('technical.notifications.setAsideCarrier')
            }}</span>
          </v-col>
        </v-row>
        <v-row no-gutters v-if="showCarrierSetAside" class="mt-5">
          <v-col cols="4">
            <mp-select
              :label="$t('technical.notifications.isCarrierSetAside')"
              v-model="selectedSetAsideCarrier"
              :items="getSelectItems(NotificationsItems.CARRIER)"
              multiple
              clearable
              chips
              smallChips
              deletableChips
              hideSelected
              attach="#notifications-context-carriers-setAside"
              dropdownId="notifications-context-carriers-setAside"
              dataId="notifications-context-carriers-setAside"
              :search="{ model: '', label: $t('action.search.base') }"
            />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { RulesKey, SelectItem, NotificationsItems, MappedItem } from '@/types'
import RetailerService from '@/services/retailer/RetailerService'
import { ROUTES } from '@/constants'
import StoreService from '@/services/store/StoreService'
import ExchangePlaceService from '@/services/exchangePlace/ExchangePlaceService'
import OrderEligibilityService from '@/services/orderEligibility/OrderEligibilityService'
import CarrierService from '@/services/carrier/CarrierService'
import Vue from 'vue'
import AuthorizationService from '@/services/authorization/AuthorizationService'

const rule: RulesKey = 'WRITE_NOTIFICATION_STATE'

export default Vue.extend({
  name: 'notification-context',
  data: () => ({
    NotificationsItems,
    selectedSetAsideCarrier: [] as number[] | null,
    showCarrierSetAside: false,
    exchangePlaces: [] as MappedItem[],
    stores: [] as MappedItem[],
    retailers: [] as MappedItem[],
    carriers: [] as MappedItem[],
    isCarrierSetAside: [] as any[],
    retailerId: null as number | null,
    selectedStores: [] as number[] | null,
    selectedExchangePlaces: [] as number[] | null,
    selectedCarriers: [] as MappedItem[] | null,
    disableExchangePlaces: false,
    contextFlatten: null as any,
    disableRetailer: false,
    disableStores: false,
    contextStoreId: null as number | null,
    contextExchangePlaceId: null as number | null,
  }),
  props: {
    typeOfEvent: {
      type: String,
      required: false,
      default: null,
    },
    editRetailerId: {
      type: Number,
      required: false,
      default: null,
    },
    editStoreIds: {
      type: Number,
      required: false,
      default: null,
    },
    editCarriersIds: {
      type: Number,
      required: false,
      default: null,
    },
    editExchangePlaceIds: {
      type: Number,
      required: false,
      default: null,
    },
    editSetAsideCarrierIds: {
      type: Array,
      required: false,
      default: null,
    },
  },
  computed: {
    fieldWrapperCols(): number {
      const { xsOnly, mdAndDown } = this.$vuetify.breakpoint
      if (xsOnly) {
        return 12
      } else if (mdAndDown) {
        return 6
      }
      return 3
    },
    isEditing(): boolean {
      return this.$route.name === ROUTES.editNotification
    },
  },
  beforeMount() {
    const { permissions } = this.$store.getters['auth/currentUser']
    this.contextFlatten = AuthorizationService.getContext(permissions)
  },
  async mounted() {
    await this.getRetailers()

    this.fillContext()

    if (this.$route.name === ROUTES.editNotification) {
      this.retailerId = this.editRetailerId

      this.selectedStores!.push(this.editStoreIds)

      this.selectedCarriers!.push(this.editCarriersIds)

      if (this.editSetAsideCarrierIds?.length) {
        this.showCarrierSetAside = true
        this.selectedSetAsideCarrier!.push(...this.editSetAsideCarrierIds)
      }
      this.selectedExchangePlaces = this.editExchangePlaceIds
    }
  },
  methods: {
    fillContext() {
      if (this.contextFlatten.retailerIds.length === 1) {
        this.retailerId = this.contextFlatten.retailerIds[0]
        this.disableRetailer = true
      }

      if (this.contextFlatten.storeIds.length === 1) {
        this.selectedStores.push(this.contextFlatten.storeIds[0])
        this.disableStores = true
      }

      if (this.contextFlatten.exchangePlaceIds.length === 1) {
        this.selectedExchangePlaces.push(this.contextFlatten.exchangePlaceIds[0])
        this.disableExchangePlaces = true
      }
    },
    disableExchangePlacesField(event?: any): void {
      if (event.length > 1) {
        this.disableExchangePlaces = true
      } else {
        this.disableExchangePlaces = false
      }
    },
    async getRetailers(): Promise<void> {
      if (this.retailerId) {
        this.retailers = []
        this.retailerId = null
      }
      this.retailers = await RetailerService.getFilters({ forRule: rule })
      this.getStores()
    },
    async getStores(retailerId: number): Promise<void> {
      if (this.stores && !this.contextFlatten.storeIds.length) {
        this.stores = []
        this.selectedStores = []
      }
      if (retailerId) {
        this.stores = await StoreService.getFilters({
          retailerId,
          forRule: rule,
        })
      }
      this.getExchangePlaces(this.selectedStores![0])
    },
    async getExchangePlaces(storeId: number): Promise<void> {
      if (this.exchangePlaces) {
        this.exchangePlaces = []
      }
      if (storeId) {
        this.exchangePlaces = await ExchangePlaceService.getFilters({
          retailerId: this.retailerId,
          storeId,
          forRule: rule,
        })
      }
    },
    async getCarriers(): Promise<void> {
      this.carriers = []
      if (
        this.contextFlatten.carrierIds.length >= 1 &&
        this.contextFlatten.retailerIds.length === 0 &&
        this.contextFlatten.storeIds.length === 0 &&
        this.contextFlatten.exchangePlaceIds.length === 0
      ) {
        const { carriers } = await CarrierService.getAll({
          ids: this.contextFlatten.carrierIds,
        })
        this.carriers = carriers.map(elem => ({
          id: elem.id,
          name: elem.name,
        }))
      }
      if (
        (this.contextFlatten.exchangePlaceIds.length && this.selectedExchangePlaces?.length > 1) ||
        (this.selectedStores?.length === 1 && this.selectedExchangePlaces?.length === 0)
      ) {
        this.contextStoreId = this.selectedStores[0]
      } else if (this.selectedExchangePlaces?.length === 1) {
        this.contextStoreId = this.selectedStores[0]
        this.contextExchangePlaceId = this.selectedExchangePlaces[0]
      } else {
        this.contextStoreId = null
        this.contextExchangePlaceId = null
      }

      if (this.retailerId) {
        const { orderEligibilities } = await OrderEligibilityService.getAll({
          retailerId: this.retailerId,
          storeId: this.contextStoreId,
          exchangePlaceId: this.contextExchangePlaceId,
          isActive: true,
        })
        this.carriers = orderEligibilities.map(elem => ({
          id: elem.Carrier.id,
          name: elem.Carrier.name,
        }))
      }
    },
    getSelectItems(type: string): SelectItem[] | undefined {
      switch (type) {
        case NotificationsItems.RETAILER: {
          return this.retailers.length
            ? this.retailers.map(({ id, name }) => ({
                value: id,
                text: name,
              }))
            : []
        }
        case NotificationsItems.STORE:
          return this.stores.length
            ? this.stores.map(({ id, name }) => ({
                value: id,
                text: name,
              }))
            : []
        case NotificationsItems.CARRIER:
          return this.carriers.length
            ? this.carriers.map(({ id, name }) => ({
                value: id,
                text: name,
              }))
            : []
        case NotificationsItems.EXCHANGE_PLACES:
          return this.exchangePlaces.length
            ? this.exchangePlaces.map(({ id, name }) => ({
                value: id,
                text: name,
              }))
            : []

        default:
          return []
      }
    },
  },
  watch: {
    retailerId(next, previous) {
      this.$emit('selectedRetailerId', this.retailerId)
      this.getStores(next)
      if (next || previous) {
        this.getCarriers()
      }
      if (!next && !this.isEditing) {
        this.exchangePlaces = []
        this.selectedExchangePlaces = []
        this.selectedCarriers = []
      }
    },
    selectedStores(next, previous) {
      if (next?.length || previous?.length) {
        this.getCarriers()
      }
      this.$emit('selectedStores', this.selectedStores)

      if (next?.length === 1) {
        this.getExchangePlaces(next[0])
        return
      }
      if (!this.isEditing) {
        this.selectedExchangePlaces = []
        this.exchangePlaces = []
      }
      if (!next?.length) {
        this.disableExchangePlaces = true
      }
    },
    selectedExchangePlaces(next, previous) {
      if (next?.length || previous?.length) {
        this.getCarriers()
      }
      this.$emit('selectedExchangePlaces', this.selectedExchangePlaces)
      if (!next && !this.isEditing) {
        this.selectedExchangePlaces = []
      }
    },
    selectedCarriers() {
      this.$emit('selectedCarriers', this.selectedCarriers)
    },
    selectedSetAsideCarrier() {
      this.$emit('selectedSetAsideCarrier', this.selectedSetAsideCarrier)
    },
    showCarrierSetAside() {
      if (!this.showCarrierSetAside) {
        this.selectedSetAsideCarrier = []
      }
      this.$emit('selectedSetAsideCarrier', this.selectedSetAsideCarrier)
    },
  },
})
</script>

<style lang="scss">
#notification-context {
  .notification-context-bloc {
    padding: 4.7rem 0;
    min-height: 25rem;
  }

  .bg-grey {
    background-color: $main-lighten-80-color;
  }
}
</style>
