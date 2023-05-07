<template>
  <v-row
    no-gutters
    class="block"
    id="create-order-pickup-point"
    data-id="order-create-block-pickupPoint"
  >
    <v-col cols="12" class="header">
      <h2>{{ $t('page.createOrder.titles.pickupPoint') }}</h2>
      <span class="block-info">{{ $t('page.createOrder.infos.pickupPoint') }}</span>
    </v-col>
    <v-col cols="12" class="content">
      <div class="search-pickup-point">
        <mp-radio-group
          row
          required
          dataId="order-create-pickupPoint-radioGroup"
          v-model="searchById"
          :radioValues="[
            { value: false, label: $t('common.address.base') },
            { value: true, label: $t('common.id') },
          ]"
          :propsRadio="{
            class: 'shadow-hover',
          }"
        />

        <div v-if="!searchById" class="d-flex autocomplete-wrapper">
          <mp-autocomplete
            :label="$t('page.order.pickupPoint.searchLabel')"
            v-model="search.apiAddress"
            :errors="[$t('validation.address')]"
            :loading="search.loading"
            :items="search.suggestions"
            @loadItems="onDebounceInputChange($event)"
            @change="handleChangeApiAddress()"
            displayName="address"
            dataId="order-create-pickupPoint-pickupPoint-address"
            id="order-create-delivery-pickup-point-address"
            attach="#pickupPointAddressDropdown"
            dropdownId="pickupPointAddressDropdown"
            @clickClear="search.apiAddress = null"
          />
        </div>
        <div v-else class="two-field">
          <mp-textfield
            class="mb-5"
            :label="$t('page.order.pickupPoint.searchById')"
            v-model="searchIdPP"
            dataId="order-create-pickupPoint-searchById"
            :errors="[]"
            :isDirty="false"
            @input="searchDebouncePickupPoint()"
          />

          <mp-select
            :label="$t('common.carrier')"
            v-model="searchCarrier"
            :items="getEligibleCarriers"
            clearable
            dataId="order-create-pickupPoint-carrier"
            attach="#order-create-pickupPoint-carrier-select"
            dropdownId="order-create-pickupPoint-carrier-select"
            :errors="[]"
            :isDirty="false"
            @input="searchDebouncePickupPoint()"
          />
        </div>
      </div>

      <div class="pickup-point-filters" v-if="hasResultDisplayed && !searchById">
        <div class="mt-7 d-flex align-center">
          <span class="medium14">{{ $t('action.filter.base') }}</span>
          <div v-if="numberOfFilters" class="d-flex align-center ml-1">
            <span class="medium14">{{ `(${numberOfFilters})` }}</span>
            <v-chip class="ml-3 erase-all" @click="handleResetFilters()">
              {{ $t('action.erase.all') }}
            </v-chip>
          </div>
        </div>

        <div class="pickup-point-filter-carrier">
          <div class="pickup-point-filter-carrier-title pr-2">
            <span class="italic12 main-lighten-52"> {{ $t('action.filter.carrier') }} : </span>
          </div>

          <div class="pickup-point-filter-carrier-carriers">
            <div
              v-for="(carrier, index) in getCarrierFilter"
              :key="`order-create-pickup-point-filters-carriers-${index}`"
              :class="
                `carrier${
                  selectedCarriers?.length &&
                  selectedCarriers.some(lcarrier => lcarrier.code === carrier.code)
                    ? ' selected'
                    : ''
                }`
              "
              @click="handleSelectedCarriers(carrier)"
            >
              <span class="regular16 main-lighten-28">
                {{ carrier.name || carrier.code }}
              </span>
            </div>
          </div>
        </div>

        <div class="pickup-point-filter-pickup-point-type">
          <div class="pickup-point-filter-pickup-point-type-title pr-2">
            <span class="italic12 main-lighten-52">
              {{ $t('action.filter.pickupPointTypes') }} :
            </span>
          </div>

          <div class="pickup-point-filter-pickup-point-types">
            <div
              v-for="localType in getFilterPickupPointTypes"
              :key="`order-create-pickup-point-filters-pickpuPointTypes-${localType}`"
              @click="handleSelectedPickupPointType(localType)"
              :class="
                `pickup-point-type${
                  selectedPickupPointTypes?.length &&
                  selectedPickupPointTypes.some(ltype => ltype === localType)
                    ? ' selected'
                    : ''
                }`
              "
            >
              <span class="regular16 main-lighten-28">
                {{ $t(`technical.pickupPointTypes.${localType}`) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div v-if="hasResultDisplayed" class="mt-6 mb-4">
        <span class="success-color medium14">
          {{ $t('page.order.pickupPoint.numberFind', { number: getPickupPointsLength }) }}
        </span>
      </div>

      <div v-if="!hasResultDisplayed && hasSearched" class="d-flex justify-center">
        <h2 class="mt-10">
          {{ $t('page.order.pickupPoint.noPickupPoint') }}
        </h2>
      </div>

      <div class="pickup-point-list" v-if="hasResultDisplayed">
        <div
          v-for="(localPickupPoint, index) of getPickupPointList"
          :key="`create-order-pickup-points-${index}`"
          :class="
            `pickup-point-wrapper${
              selectedPickupPoint && localPickupPoint.id === pickupPoint?.pickupPoint?.id
                ? ' selected'
                : ''
            }`
          "
          @click="selectedPickupPoint = localPickupPoint"
        >
          <div class="d-flex justify-space-between align-center">
            <span class="regular16">{{ localPickupPoint.address.title }}</span>
            <div v-if="localPickupPoint.type" class="pickup-point-type align-center">
              <v-icon size="1.8rem" class="main-color mr-2">
                {{ getIcon(localPickupPoint.type) }}
              </v-icon>
              <span class="medium12">
                {{ $t(`technical.pickupPointTypes.${localPickupPoint.type}`) }}
              </span>
            </div>
          </div>

          <div class="mt-3">
            <span class="regular14 main-lighten-28">
              {{ OrderMapper.getFormatedAddress(localPickupPoint.address) }}
            </span>
          </div>

          <div
            v-if="selectedPickupPoint && selectedPickupPoint.id === localPickupPoint.id"
            class="mt-4"
          >
            <div
              class="pickup-point-category"
              v-if="localPickupPoint.type || localPickupPoint.category"
            >
              <div class="chip" v-if="localPickupPoint.type">
                <span class="regular14 main-color">{{ localPickupPoint.type }}</span>
              </div>

              <div
                :class="`chip${localPickupPoint.type ? ' ml-2' : ''}`"
                v-if="localPickupPoint.category"
              >
                <span class="regular14 main-color">{{ localPickupPoint.category }}</span>
              </div>
            </div>

            <div class="mb-1">
              <span class="medium14">
                {{ $t('common.schedule_plural') }}
              </span>
            </div>

            <div
              v-for="day in week"
              :key="`create-order-week-${day}`"
              class="mt-2 d-flex justify-space-between"
            >
              <span class="regular14"> {{ $t(`common.days.${day.substring(0, 3)}`) }} </span>

              <div
                v-if="localPickupPoint.openingHours[day].length"
                :class="$vuetify.breakpoint.smAndUp ? 'd-flex' : ''"
              >
                <div
                  v-for="(hours, hoursIndex) in localPickupPoint.openingHours[day]"
                  :key="`create-order-week-${day}-hours-${hoursIndex}`"
                >
                  <span class="regular14">
                    {{
                      `${hours.start} - ${hours.end}${
                        localPickupPoint.openingHours[day].length > hoursIndex + 1 &&
                        $vuetify.breakpoint.smAndUp
                          ? ' / '
                          : ''
                      }`
                    }}
                  </span>
                </div>
              </div>
              <div v-else>
                <span class="regular14">
                  {{ $t('action.close.base') }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="see-more" @click="seeMore = !seeMore" v-if="getPickupPointsLength > 5">
          <h4>
            {{ $t('page.order.pickupPoint.see', { context: !seeMore ? 'more' : 'less' }) }}
          </h4>
        </div>
      </div>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import AddressService from '@/services/address/AddressService'
import pickupPointsService from '@/services/pickupPoints/pickupPointsService'
import { CreateOrderStatePickupPoint } from '@/store/modules/createOrder/pickupPoint/types'
import {
  CreateOrderStateEligibility,
  CreateOrderStateMiscellaneous,
} from '@/store/modules/createOrder/types'
import { SnackBarType } from '@/store/types'
import {
  Address,
  CreateOrderItinerayAddress,
  PickupPoint,
  PICKUP_POINT_TYPES,
  SelectItem,
} from '@/types'
import { debounce } from 'debounce'
import { v4 } from 'uuid'
import Vue from 'vue'
import OrderMapper from '@/services/order/OrderMapper'
import { mapActions } from 'vuex'
import { CreateOrderStateArrival } from '@/store/modules/createOrder/arrival/types'
import { CreateOrderStateSenderIdentity } from '@/store/modules/createOrder/senderIdentity/types'
import { CreateOrderStateShippingDate } from '@/store/modules/createOrder/shippingDate/types'
import { CreateOrderStateOrderContent } from '@/store/modules/createOrder/orderContent/types'

export default Vue.extend({
  name: 'order-create-pickupPoint',
  props: {
    isEditing: {
      type: Boolean,
      required: true,
    },
  },
  data: () => ({
    searchById: false,
    selectedCarriers: [] as { name: string; code: string }[],
    selectedPickupPointTypes: [] as string[],
    search: {
      apiAddress: null,
      loading: false,
      suggestions: [],
      showMore: false,
    } as CreateOrderItinerayAddress,
    sessionToken: null as string | null,
    address: null as Address | null,
    searchCarrier: null as any,
    searchIdPP: '',
    localPickupPoints: [] as PickupPoint[],
    hasSearched: false,
    seeMore: false,
    OrderMapper,
    selectedPickupPoint: null as PickupPoint | null,
    week: {
      monday: 'monday',
      tuesday: 'tuesday',
      wednesday: 'wednesday',
      thursday: 'thursday',
      friday: 'friday',
      saturday: 'saturday',
      sunday: 'sunday',
    },
    hasAlreadyBeenSet: false,
    carriersCode: [] as string[],
  }),
  computed: {
    arrival(): CreateOrderStateArrival {
      return this.$store.getters['createOrder/arrival/arrival']
    },
    miscellaneous(): CreateOrderStateMiscellaneous {
      return this.$store.getters['createOrder/miscellaneous']
    },
    senderIdentity(): CreateOrderStateSenderIdentity {
      return this.$store.getters['createOrder/senderIdentity/senderIdentity']
    },
    shippingDate(): CreateOrderStateShippingDate {
      return this.$store.getters['createOrder/shippingDate/shippingDate']
    },
    eligibility(): CreateOrderStateEligibility {
      return this.$store.getters['createOrder/eligibility']
    },
    orderContent(): CreateOrderStateOrderContent {
      return this.$store.getters['createOrder/orderContent/orderContent']
    },
    pickupPoint(): CreateOrderStatePickupPoint {
      return this.$store.getters['createOrder/pickupPoint/pickupPoint']
    },
    getEligibleCarriers(): SelectItem[] {
      return this.eligibility.filteredCarriers
        .filter(carrier => {
          // get momentary eligible carriers
          return this.miscellaneous.selectedCarrierIds.length
            ? this.miscellaneous.selectedCarrierIds.some(
                carrierId => carrierId === carrier.Carrier.id,
              )
            : true
        })
        .map(carrier => ({
          // format carriers for mp select
          text: carrier.Carrier.name,
          value: carrier.Carrier.code,
        }))
    },
    getCarrierFilter(): Array<{ name: string; code: string }> {
      return this.eligibility.filteredCarriers.map(({ Carrier }) => ({
        name: Carrier.name,
        code: Carrier.code!,
      }))
    },
    getPickupPointsLength(): number {
      return this.localPickupPoints.length
    },
    getPickupPointList(): PickupPoint[] {
      return this.seeMore ? this.localPickupPoints : this.localPickupPoints.slice(0, 5)
    },
    numberOfFilters(): number {
      return this.selectedCarriers.length + this.selectedPickupPointTypes.length
    },
    hasResultDisplayed(): boolean {
      if (this.localPickupPoints.length) {
        return true
      }

      return (
        Boolean(this.selectedCarriers?.length) || Boolean(this.selectedPickupPointTypes?.length)
      )
    },
    getFilterPickupPointTypes(): string[] {
      const listOfCarrier = this.selectedCarriers.length
        ? this.eligibility.filteredCarriers.filter(filteredCarrier =>
            this.selectedCarriers.find(
              selectedCarrier => selectedCarrier.code === filteredCarrier.Carrier.code,
            ),
          )
        : this.eligibility.filteredCarriers

      return listOfCarrier.find(filteredCarrier => !filteredCarrier.pickupPointTypes)
        ? Object.values(PICKUP_POINT_TYPES)
        : [
            ...new Set(
              listOfCarrier.flatMap(
                filteredCarrier => filteredCarrier.pickupPointTypes,
              ) as string[],
            ),
          ]
    },
  },
  async mounted() {
    if (this.isEditing && this.arrival.type === 'pickupPoint' && !this.pickupPoint.pickupPoint) {
      this.pickupPoint.pickupPoint = await pickupPointsService.getPickupPointById({
        id: this.arrival.pickupPointId!,
        carrierCode: this.arrival.carrierCode!,
        retailerId: this.senderIdentity.retailerId!,
        forRule: 'CREATE_ORDERS',
      })
    }

    if (this.pickupPoint.pickupPoint) {
      this.filterEligibleCarriers({
        stepNumber: parseInt(this.$route.query.stepNumber as string, 10),
      })

      await this.onInputChange(OrderMapper.getFormatedAddress(this.pickupPoint.pickupPoint.address))
    }
  },
  methods: {
    ...mapActions({
      filterEligibleCarriers: 'createOrder/filterEligibleCarriers',
    }),
    getIcon(pickupPointType: string): string {
      switch (pickupPointType) {
        case PICKUP_POINT_TYPES.AGENCY:
          return 'mdi-home-map-marker'
        case PICKUP_POINT_TYPES.POST_OFFICE:
          return 'mdi-mailbox'
        case PICKUP_POINT_TYPES.RELAY_WITHOUT_LOCKER:
          return 'mdi-cancel'
        case PICKUP_POINT_TYPES.RELAY_WITH_LOCKER:
          return 'mdi-locker'
        case PICKUP_POINT_TYPES.DRIVE:
          return 'mdi-car'
      }
      return ''
    },
    handleResetFilters(): void {
      this.selectedCarriers = []
      this.selectedPickupPointTypes = []
      this.searchPickupPoint()
    },
    handleSelectedPickupPointType(type: string): void {
      const index = this.selectedPickupPointTypes.findIndex(ltype => ltype === type)

      if (index === -1) {
        this.selectedPickupPointTypes.push(type)
        this.searchPickupPoint()

        return
      }

      this.selectedPickupPointTypes.splice(index, 1)
      this.searchPickupPoint()
    },
    handleSelectedCarriers(carrier: { name: string; code: string }): void {
      const index = this.selectedCarriers.findIndex(lcarrier => lcarrier.code === carrier.code)

      if (index === -1) {
        this.selectedCarriers.push(carrier)
        this.searchPickupPoint()
        return
      }

      this.selectedCarriers.splice(index, 1)
      this.searchPickupPoint()
    },
    async onInputChange(text: string) {
      // Display style on input when loading address
      this.search.loading = true

      try {
        if (!this.sessionToken) {
          this.sessionToken = v4()
        }

        // Get addresses
        const addresses = await AddressService.autoComplete({
          input: text,
          sessionToken: this.sessionToken,
        })

        // Set addresses in data
        this.search.suggestions = [...addresses]

        // Set the local google autocomplete with data from Store
        if (
          (this.isEditing || (!this.isEditing && this.pickupPoint?.pickupPoint)) &&
          !this.hasAlreadyBeenSet &&
          this.search.suggestions.length === 1
        ) {
          this.hasAlreadyBeenSet = true
          this.search.apiAddress = this.search.suggestions[0]
          this.handleChangeApiAddress()
        }
      } catch {
        this.$store.dispatch('setSnackbar', {
          type: SnackBarType.ERROR,
          message: this.$t('messages.error'),
        })
      } finally {
        // Stop loading style
        this.search.loading = false
      }
    },
    onDebounceInputChange: debounce(async function(this: any, text: string) {
      this.onInputChange(text)
    }, 250),
    async handleChangeApiAddress(): Promise<void> {
      try {
        // get detail of address
        if (this.search.apiAddress?.placeId) {
          this.address = await AddressService.getDetail({
            placeId: this.search.apiAddress.placeId,
            sessionToken: this.sessionToken || v4(),
          })

          this.sessionToken = null

          this.searchPickupPoint()
        }
      } catch {
        this.$store.dispatch('setSnackbar', {
          type: SnackBarType.ERROR,
          message: this.$t('messages.error'),
        })
      }
    },
    async searchPickupPoint() {
      if (!this.senderIdentity.retailerId) {
        return
      }

      try {
        if (this.searchById) {
          if (!this.searchCarrier || !this.searchCarrier.length || !this.searchIdPP) {
            return
          }

          this.localPickupPoints = [
            await pickupPointsService.getPickupPointById({
              id: this.searchIdPP,
              carrierCode: this.searchCarrier,
              retailerId: this.senderIdentity.retailerId!,
              forRule: 'CREATE_ORDERS',
            }),
          ]
        } else {
          const packages = this.orderContent.packages.map(
            ({ attributes, references, ...packagesFormatted }) => packagesFormatted,
          )
          this.carriersCode = this.eligibility.filteredCarriers
            .filter(carrier => {
              if (this.miscellaneous.selectedCarrierIds?.length) {
                return this.miscellaneous.selectedCarrierIds.find(
                  carrierId => carrierId === carrier.Carrier.id,
                )
              }
              return true
            })
            .map(carrier => carrier.Carrier.code!)

          const carriersCode = this.selectedCarriers?.length
            ? this.selectedCarriers.map(localCarrier => localCarrier.code)
            : this.carriersCode

          const types = carriersCode.reduce((acc, carrierCode) => {
            const eligibleCarrierPickupPointTypes = this.eligibility.filteredCarriers.find(
              filteredCarrier => filteredCarrier.Carrier.code === carrierCode,
            )?.pickupPointTypes

            return {
              ...acc,
              [carrierCode]: this.selectedPickupPointTypes?.length
                ? this.selectedPickupPointTypes.filter(selectedPickupPointType => {
                    if (
                      Array.isArray(eligibleCarrierPickupPointTypes) &&
                      eligibleCarrierPickupPointTypes?.length &&
                      eligibleCarrierPickupPointTypes.includes(selectedPickupPointType as any)
                    ) {
                      return selectedPickupPointType
                    }

                    return Array.isArray(eligibleCarrierPickupPointTypes)
                      ? undefined
                      : selectedPickupPointType
                  })
                : eligibleCarrierPickupPointTypes?.length
                ? eligibleCarrierPickupPointTypes
                : Object.values(PICKUP_POINT_TYPES),
            }
          }, {})

          this.localPickupPoints = await pickupPointsService.getPickupPoints({
            address: this.address!,
            carriersCode,
            depositDate: this.shippingDate.interval[0].start,
            forRule: 'CREATE_ORDERS',
            packages,
            types,
          })
        }

        if (
          (this.isEditing || (!this.isEditing && this.pickupPoint.pickupPoint)) &&
          this.localPickupPoints?.length &&
          this.pickupPoint.pickupPoint?.id
        ) {
          this.selectedPickupPoint = this.localPickupPoints.find(
            (pickupPoint: any) => pickupPoint.id === this.pickupPoint.pickupPoint!.id,
          )!
        }
      } catch (e) {
        this.localPickupPoints = []
        this.$store.dispatch('setSnackbar', {
          type: SnackBarType.ERROR,
          message: this.$t('messages.error'),
        })
      } finally {
        this.hasSearched = true
      }
    },
    searchDebouncePickupPoint: debounce(async function(this: any) {
      if (this.searchCarrier && this.searchIdPP) {
        this.searchPickupPoint()
      }
    }, 250),
  },
  watch: {
    selectedPickupPoint: {
      deep: true,
      handler(next) {
        this.pickupPoint.pickupPoint = !next ? null : next
      },
    },
    'deliveryDate.interval': {
      deep: true,
      handler() {
        if (this.address) {
          this.selectedCarriers = []
          this.searchPickupPoint()
        }
      },
    },
    searchById(next) {
      if (next) {
        this.search = {
          apiAddress: null,
          loading: false,
          suggestions: [],
          showMore: false,
        }
      } else {
        this.searchCarrier = null
        this.searchIdPP = ''
      }

      this.hasSearched = false
      this.localPickupPoints = []
    },
    getPickupPointList() {
      if (
        this.getPickupPointList.filter(pp => pp.id === this.pickupPoint?.pickupPoint?.id).length
      ) {
        return
      }
      this.selectedPickupPoint = null
      this.pickupPoint.pickupPoint = null
    },
  },
})
</script>

<style lang="scss" scoped>
#create-order-pickup-point {
  @import '../../../../styles/mixins/macScrollbar';

  .content {
    .pickup-point-filters {
      .erase-all {
        background-color: $main-color;
        color: $white;
        height: 3rem;
      }
    }
    .search-pickup-point {
      background-color: $main-lighten-80-color;
      border-radius: 0.4rem;
      padding: 2.2rem;
    }

    .pickup-point-filter-carrier,
    .pickup-point-filter-pickup-point-type {
      margin-top: 2rem;
      cursor: pointer;
      display: flex;
      flex-direction: column;

      .pickup-point-filter-carrier-title,
      .pickup-point-filter-pickup-point-type-title {
        display: flex;
        align-items: center;
        margin-bottom: 1rem;

        span {
          width: max-content;
        }
      }

      .pickup-point-filter-carrier-carriers,
      .pickup-point-filter-pickup-point-types {
        display: flex;
        flex-wrap: wrap;
      }

      .carrier,
      .pickup-point-type {
        border: 0.1rem solid $main-lighten-52-color;
        padding: 1rem 2rem;
        margin-right: 1rem;
        margin-bottom: 1rem;
        border-radius: 0.4rem;

        &.selected {
          border: 0.2rem solid $main-color;
        }
      }
    }

    .pickup-point-list {
      .pickup-point-wrapper {
        border: 0.1rem solid $main-lighten-65-color;
        border-radius: 0.4rem;
        margin-bottom: 2rem;
        padding: 2rem;
        cursor: pointer;

        &.selected {
          border: 0.2rem solid $main-color;
        }

        .pickup-point-type {
          border: 0.1rem solid $main-lighten-65-color;
          display: flex;
          padding: 0.8rem 1rem;
          border-radius: 5rem;
        }

        .chip {
          border: 0.1rem solid $main-lighten-65-color;
          width: fit-content;
          padding: 0.5rem 1rem;
          border-radius: 4rem;
        }

        .pickup-point-category {
          display: flex;
          margin-bottom: 2rem;
          overflow-x: auto;
          @include setMacScrollbar('&');
        }
      }

      .see-more {
        display: flex;
        justify-content: center;
        cursor: pointer;
      }
    }
  }
}
</style>
