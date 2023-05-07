<template>
  <div v-if="hasData" id="carrier-selection">
    <v-card
      class="py-4 px-3 m-4 d-flex justify-space-between align-center"
      outlined
      :ripple="false"
      v-if="carriers.length"
    >
      <div :class="`d-flex align-center${$vuetify.breakpoint.xsOnly ? ' flex-column' : ''}`">
        <v-img
          data-id="carrier-selection-logo"
          class="logo"
          :src="selectedCarrier.logo"
          v-if="selectedCarrier.logo"
          contain
        />

        <span :class="`regular12 main-lighten-52 ${$vuetify.breakpoint.smAndUp ? 'pl-2' : 'pt-2'}`">
          {{ selectedCarrier.name }}
        </span>
      </div>

      <mp-button
        :text="$t('action.modify.base')"
        format="link"
        linkColor="black"
        icon="pencil"
        @click="editCarrier = true"
        dataId="product-return-select-products"
      />
    </v-card>

    <div v-else>
      <no-data dataId="carrier-selection-noData" />
    </div>

    <change-carrier-modal
      v-if="editCarrier"
      :showDialog="editCarrier"
      :carriers="carriersEligibility"
      @confirm="updateCarrier"
      @close="editCarrier = false"
      :selectedCarrier="selectedCarrierCode"
    />
  </div>
</template>

<script lang="ts">
import { AVAILABLE_LEVEL_SERVICES, COUNTRY } from '@/constants/shared'
import mixins from 'vue-typed-mixins'
import OrderEligibilityService from '@/services/orderEligibility/OrderEligibilityService'
import ChangeCarrierModal from './modal/changeCarrier.vue'
import { authorizationMixin } from '@/mixins'
import noData from '@/components/noData/noData.vue'
import { CarrierEligibilityEntity, CarrierEntity, PickingInformations } from '@/types'

export default mixins(authorizationMixin).extend({
  name: 'carrier-selection',
  components: {
    ChangeCarrierModal,
    noData,
  },
  props: {
    storeId: {
      type: Number,
      required: true,
    },
    retailerId: {
      type: Number,
      required: true,
    },
    exchangePlaceId: {
      type: Number,
      default: null,
    },
    initialCarrier: {
      type: String,
      default: null,
    },
    picking: {
      type: Object as () => PickingInformations,
      required: true,
    },
  },
  data: () => ({
    carriers: [] as CarrierEligibilityEntity[],
    hasData: false,
    editCarrier: false,
    selectedCarrierCode: '',
  }),
  async mounted() {
    const { parents, orderEligibilities } = await OrderEligibilityService.getAll({
      retailerId: this.retailerId,
      storeId: this.storeId,
      exchangePlaceId: this.exchangePlaceId,
      services: [AVAILABLE_LEVEL_SERVICES.RETURN],
      isActive: true,
    })

    this.carriers = OrderEligibilityService.getAvailableList(parents, orderEligibilities)
    this.selectedCarrierCode = this.initialCarrier || this.carriers[0]?.Carrier.code || ''
    this.$emit('updateCarrier', this.selectedCarrierCode)
    this.hasData = true
  },
  methods: {
    updateCarrier(newCarrierCode: string) {
      this.selectedCarrierCode = newCarrierCode
      this.editCarrier = false
      this.$emit('updateCarrier', newCarrierCode)
    },
  },
  computed: {
    selectedCarrier(): CarrierEntity | null {
      return (
        this.carriers.find(({ Carrier: { code } }) => this.selectedCarrierCode === code)?.Carrier ||
        null
      )
    },
    carriersEligibility(): CarrierEligibilityEntity[] {
      const {
        address: { postalCode, country },
      } = this.picking
      const department = postalCode.substring(0, postalCode.indexOf('97') === 0 ? 3 : 2)

      return this.carriers.filter(({ departments }) => {
        if (departments?.[`${country}`] && Array.isArray(departments[`${country}`])) {
          if (department.includes('20') && country === COUNTRY.FRANCE) {
            return (
              departments[`${country}`].includes('2A') || departments[`${country}`].includes('2B')
            )
          }

          return departments[`${country}`].includes(department)
        }

        return departments![`${country}`]
      })
    },
  },
})
</script>

<style lang="scss">
#carrier-selection {
  .logo {
    height: 5rem;
    flex-grow: 0;
    width: 100px;
  }
}
</style>
