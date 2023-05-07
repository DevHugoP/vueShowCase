<template>
  <div class="carrier-eligibilities" :data-id="dataId">
    <mp-block
      id="carrier-eligibilities-block"
      :title="$vuetify.breakpoint.smAndUp ? $t('common.carrier_plural') : ''"
      :hasBorder="$vuetify.breakpoint.smAndUp"
      :hasMarginBottom="$vuetify.breakpoint.smAndUp"
      titleHasPaddingBottom
    >
      <div v-if="displayResearchInput">
        <mp-textfield
          :label="$t('action.search.base')"
          v-model="researchValue"
          dataId="carrier-search"
          :errors="[]"
          :isDirty="false"
        />
      </div>
      <div
        v-if="carrierEligibilities.length"
        :class="`${carrierEligibilities.length > 5 ? 'carriers-wrapper' : ''}`"
        :style="{ maxHeight }"
      >
        <v-row
          no-gutters
          :ref="`carrier-${index}`"
          v-for="(carrier, index) in carriersFiltered"
          :key="`${dataId}-${index}`"
          :class="`carrier${index === carrierEligibilities.length - 1 ? ' no-border-bottom' : ''}`"
          :data-id="`${dataId}-${index}`"
        >
          <v-col cols="12" class="d-flex align-center pl-2">
            <mp-switch
              @click.native.prevent="toggleCarrier(carrier.carrierId, $event)"
              v-model="carrier.isActive"
              :dataId="`${dataId}-${index}-switchActive`"
              :disabled="
                !canEditOrderEligibilities ||
                  context === EligibilityContext.RETAILER ||
                  context === EligibilityContext.STORE
              "
            />

            <router-link :to="getCarrierRoute(carrier.carrierId)" class="infos-link_wrapper">
              <div class="infos">
                <v-img
                  class="logo"
                  contain
                  :src="carrier.Carrier.logo"
                  :alt="carrier.Carrier.name"
                  v-if="carrier.Carrier.logo"
                  :data-id="`${dataId}-${index}-logo`"
                />

                <span :class="`name regular14 ${!$vuetify.breakpoint.xsOnly ? 'pl-2' : ''}`">
                  {{ carrier.Carrier.name }}
                </span>
              </div>
              <v-spacer />
            </router-link>
            <v-menu
              v-if="
                (isAuthorized('EDIT_RETAILER_ELIGIBILITIES') &&
                  EligibilityContext.RETAILER === context) ||
                  (isAuthorized('EDIT_STORE_ELIGIBILITIES') && EligibilityContext.STORE === context)
              "
              bottom
              left
              offset-y
              origin="center top"
              transition="scale-transition"
            >
              <template v-slot:activator="{ on }">
                <v-icon color="main-color" v-on="on"> mdi-dots-vertical </v-icon>
              </template>
              <v-list>
                <v-list-item
                  @click="handleActivateCarrierClick(carrier.carrierId, carrier.isActive)"
                >
                  <v-list-item-title>
                    {{ $t(`action.${carrier.isActive ? 'disable' : 'enable'}.base`) }}
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>

            <router-link :to="getCarrierRoute(carrier.carrierId)" class="text-decoration-none">
              <v-icon class="main-color" size="1.8rem">mdi-chevron-right</v-icon>
            </router-link>
          </v-col>
        </v-row>
      </div>
      <div v-else>
        <no-data :dataId="`${dataId}-noData`" />
      </div>
    </mp-block>

    <mp-dialog-confirmation
      v-if="displayDisableCarrier && modalProps && modalProps.carrier"
      classWrapper="disable-carrier-modal"
      dataId="disable-carrier-modal"
      color="primary"
      :header="{
        iconClose: 'mdi-close',
        icon: $vuetify.breakpoint.smAndUp ? 'mdi-exclamation-thick' : '',
        isColorBackground: true,
      }"
      :btnCancel="{ text: $t('action.cancel.base'), format: 'link', linkColor: 'black' }"
      :btnValidation="{
        text: $t(`action.disable.base`),
        format: 'error',
        icon: 'content-save',
        loading,
      }"
      :btnToColumn="$vuetify.breakpoint.xsOnly"
      @close="closeModal"
      :textContent="
        $t(`page.eligibilities.carrier.disablingText`, { carrierName: modalProps.carrier.name })
      "
      @submit="disableCarrier(modalProps.carrier.id)"
      :fullscreen="$vuetify.breakpoint.xsOnly"
    />

    <carrier-activation-modal
      v-if="displayEnableCarrier && modalProps && modalProps.stores"
      :carrier="modalProps.carrier"
      :stores="modalProps.stores"
      :level="context"
      @close="closeModal"
      @submit="enableCarrier"
    />
  </div>
</template>

<script lang="ts">
import { authorizationMixin } from '@/mixins'
import mixins from 'vue-typed-mixins'

import noData from '@/components/noData/noData.vue'
import mpBlock from '@/components/block/block.vue'
import carrierActivationModal from '@/components/carrierActivationModal/carrierActivationModal.vue'

import AuthorizationService from '@/services/authorization/AuthorizationService'
import OrderEligibilityService from '@/services/orderEligibility/OrderEligibilityService'

import { CurrentContext, RulesKey, CarrierEligibilityEntity, EligibilityContext } from '@/types'

import { ROUTES } from '@/constants'
import { Dictionary, Location } from 'vue-router/types/router'
import StoreService from '../../services/store/StoreService'
import ExchangePlaceService from '../../services/exchangePlace/ExchangePlaceService'

const mappingRoutesEligibilityContext: Record<EligibilityContext, string> = {
  [EligibilityContext.CARRIER]: '',
  [EligibilityContext.RETAILER]: ROUTES.detailCarrierRetailer,
  [EligibilityContext.STORE]: ROUTES.detailCarrierStore,
  [EligibilityContext.EXCHANGE_PLACE]: ROUTES.detailCarrierExchangePlace,
}

export default mixins(authorizationMixin).extend({
  name: 'carrier-eligibilities',
  components: {
    noData,
    mpBlock,
    carrierActivationModal,
  },
  props: {
    context: {
      type: String,
      required: true,
      validator: value => Object.values(EligibilityContext).includes(value as EligibilityContext),
    },
    retailerId: {
      type: Number,
      required: true,
    },
    storeId: {
      type: Number,
      default: null,
    },
    exchangePlaceId: {
      type: Number,
      default: null,
    },
    dataId: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    carrierEligibilities: [] as CarrierEligibilityEntity[],
    maxHeight: 'fit-content',
    displayResearchInput: false,
    researchValue: '',
    EligibilityContext,
    displayDisableCarrier: false,
    displayEnableCarrier: false,
    modalProps: null as Record<string, any> | null,
    loading: false,
  }),
  computed: {
    canEditOrderEligibilities() {
      const { permissions } = this.$store.getters['auth/currentUser']
      const { context, retailerId, storeId } = this
      let eligibilitiesRule: RulesKey
      const eligibilitiesContext: CurrentContext = {
        retailerId,
        storeId: null,
      }

      switch (context) {
        case EligibilityContext.RETAILER: {
          eligibilitiesRule = 'EDIT_RETAILER_ELIGIBILITIES'
          eligibilitiesContext.storeId = null
          break
        }

        case EligibilityContext.STORE: {
          eligibilitiesRule = 'EDIT_STORE_ELIGIBILITIES'
          eligibilitiesContext.storeId = storeId
          break
        }

        case EligibilityContext.EXCHANGE_PLACE: {
          eligibilitiesRule = 'EDIT_EXCHANGE_PLACE_ELIGIBILITIES'
          eligibilitiesContext.storeId = storeId
          break
        }

        default:
          return false
      }

      return AuthorizationService.isAllowed(eligibilitiesRule, permissions, eligibilitiesContext)
    },
    carriersFiltered(): CarrierEligibilityEntity[] {
      if (this.displayResearchInput) {
        return this.carrierEligibilities.filter(carrier =>
          carrier.Carrier.name.toLowerCase().includes(this.researchValue.toLowerCase()),
        )
      }
      return this.carrierEligibilities
    },
  },
  async mounted() {
    this.carrierEligibilities = await this.getOrderEligibilitiesData()

    this.$nextTick(() => {
      if (this.$refs['carrier-0']) {
        const oneElementHeight = (this.$refs['carrier-0'] as any)[0].offsetHeight

        const numberOfElement = Object.keys(this.$refs).filter(carrierName =>
          carrierName.includes('carrier'),
        ).length

        if (numberOfElement > 5) {
          this.maxHeight = `${oneElementHeight * 5}px`
          this.displayResearchInput = true
        }
      }
    })
  },
  methods: {
    getParams(withoutNullValue = false): Dictionary<string | number> {
      const { retailerId, storeId, exchangePlaceId } = this

      const params = {
        retailerId,
        storeId,
        exchangePlaceId,
      }

      if (withoutNullValue) {
        return Object.entries(params).reduce((acc, param) => {
          const [key, value] = param

          if (!value) {
            return acc
          }

          return {
            ...acc,
            [key]: value,
          }
        }, {})
      }

      return params
    },
    getCarrierRoute(carrierId: number): Location {
      const params = this.getParams(true) as Dictionary<string>

      return {
        name: mappingRoutesEligibilityContext[this.context as EligibilityContext],
        params: {
          ...params,
          carrierId: carrierId.toString(),
        },
      }
    },
    async handleActivateCarrierClick(carrierId: number, previousState: boolean) {
      const carrier = this.carrierEligibilities.find(
        (carrierEligibility: CarrierEligibilityEntity) =>
          carrierEligibility.Carrier.id === carrierId,
      )

      if (previousState) {
        this.modalProps = { carrier: carrier?.Carrier }
        this.displayDisableCarrier = true
      } else {
        const { retailerId, storeId } = this

        const [stores, exchangePlaces] = await Promise.all([
          StoreService.getFilters({
            forRule: 'READ_CARRIERS',
            retailerId,
            ...(storeId && { id: storeId }),
          }),
          ExchangePlaceService.getAll({ retailerId, ...(storeId && { storeId }) }),
        ])
        const activableStores = stores.map(store => ({
          ...store,
          exchangePlaces: exchangePlaces.filter(
            ({ storeId: epStoreId, type }) =>
              epStoreId === store.id && type !== 'EXCHANGE_PLACE_DRIVE',
          ),
        }))

        this.modalProps = { carrier: carrier?.Carrier, stores: activableStores }
        this.displayEnableCarrier = true
      }
    },
    async toggleCarrier(carrierId: number, e: Event) {
      const target = e.currentTarget as HTMLElement
      const isChecked = (target.querySelector('[type="checkbox"]') as HTMLInputElement).checked

      if (isChecked) {
        this.enableCarrier(carrierId)
      } else {
        this.disableCarrier(carrierId)
      }
    },
    closeModal() {
      this.displayDisableCarrier = false
      this.displayEnableCarrier = false
      this.modalProps = null
      this.loading = false
    },
    async disableCarrier(carrierId: number) {
      const { retailerId, storeId, exchangePlaceId } = this
      this.loading = true
      await OrderEligibilityService.enableDisable(
        { carrierId, retailerId, storeId, exchangePlaceId },
        { activation: false },
      )
      this.carrierEligibilities = await this.getOrderEligibilitiesData()
      this.closeModal()
    },
    async enableCarrier(carrierId: number, stores?: { id: number; exchangePlaces: number[] }) {
      const { retailerId, storeId, exchangePlaceId } = this
      await OrderEligibilityService.enableDisable(
        { carrierId, retailerId, storeId, exchangePlaceId },
        { activation: true, stores },
      )
      this.closeModal()
      this.carrierEligibilities = await this.getOrderEligibilitiesData()
    },
    async getOrderEligibilitiesData(): Promise<CarrierEligibilityEntity[]> {
      const params = this.getParams() as Dictionary<number>

      try {
        const { parents, orderEligibilities } = await OrderEligibilityService.getAll(params)

        return OrderEligibilityService.getAvailableList(
          parents,
          orderEligibilities,
        ).sort(({ Carrier: Carrier1 }, { Carrier: Carrier2 }) =>
          Carrier1.name.localeCompare(Carrier2.name),
        )
      } catch (err) {
        return []
      }
    },
  },
})
</script>

<style lang="scss">
@import '../../styles/mixins/macScrollbar';

.carrier-eligibilities {
  padding: 0;

  @media #{map-get($display-breakpoints, 'xs-only')} {
    border-top: solid 0.1rem $main-lighten-74-color;
  }

  .title-outer-wrapper {
    margin-bottom: 2.3rem;
  }

  .carrier {
    display: flex;
    align-items: center;
    border-bottom: solid 0.1rem $main-lighten-74-color;
    padding-top: 1.6rem;
    padding-bottom: 1.6rem;

    &:last-of-type {
      padding-bottom: 0;
    }

    &.no-border-bottom {
      border-bottom: none;
    }

    .v-input--switch {
      .v-input__slot {
        margin: 0;
      }

      .v-messages {
        display: none;
      }
    }

    .infos-link_wrapper {
      text-decoration: none;
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .text-decoration-none {
      text-decoration: none;
    }

    .infos {
      padding-left: 1rem;
      cursor: pointer;
      display: flex;
      align-items: center;

      @media #{map-get($display-breakpoints, 'xs-only')} {
        display: block;
      }

      .logo {
        max-height: 4rem;
        max-width: 7rem;
        margin-bottom: 0.2rem;
      }
    }

    .name {
      color: $main-lighten-52-color;
      cursor: pointer;
    }

    .append-icon {
      cursor: pointer;
      display: flex;
      justify-content: center;
    }
  }

  .carriers-wrapper {
    overflow-y: auto;
    overflow-x: hidden;
    @include setMacScrollbar('&');
  }
}
</style>
