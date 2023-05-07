<template>
  <div>
    <v-row no-gutters id="carrier-detail-technical" v-if="$vuetify.breakpoint.smAndUp">
      <v-col cols="12" md="5" class="left-column">
        <mp-specification
          v-if="orderEligibility"
          :orderEligibility="orderEligibility"
          :parent="parent"
          :params="params"
          :hasEditIcon="canEditEligibilities"
        />

        <mp-technical-characteristics v-if="carrier" :carrier="carrier" :hasEditIcon="!parent && isAuthorized('EDIT_CARRIERS', { carrierId: carrier.id })" />

        <status-mapping
          v-if="
            isAuthorized('READ_CARRIERS_TECHNICAL') &&
              $route.name === ROUTES.detailCarrier
          "
        />

        <ftp-account-block
          v-if="isAuthorized('LIST_CARRIER_FTP') && $route.name === ROUTES.detailCarrier"
        />
      </v-col>
      <v-col cols="12" md="7" class="right-column">
        <mp-subscription
          v-if="
            showSubscription &&
              isAuthorized('READ_CARRIERS_TECHNICAL') &&
              $route.name === ROUTES.detailCarrier
          "
          title="page.subscriptions.titleVariant"
          @showEditModal="showSubscriptionModal = true"
        />
      </v-col>
    </v-row>

    <v-row no-gutters id="carrier-detail-technical-mobile" v-else>
      <v-expansion-panels flat>
        <mp-collapse
          v-if="orderEligibility"
          ref="specification"
          @click="scrollTo('specification')"
          :title="$t('page.carrier.specifications.title')"
          noPadding
          typographyClass="medium16"
          data-id="carrier-detail-collapse-specification"
        >
          <mp-specification :orderEligibility="orderEligibility" :parent="parent" :hasEditIcon="canEditEligibilities" :params="params" />
        </mp-collapse>

        <mp-collapse
          v-if="carrier"
          ref="characteristics"
          @click="scrollTo('characteristics')"
          :title="$t('page.carrier.characteristics.title')"
          noPadding
          typographyClass="medium16"
          data-id="carrier-detail-collapse-characteristics"
        >
          <mp-technical-characteristics :carrier="carrier" :hasEditIcon="!parent && isAuthorized('EDIT_CARRIERS', { carrierId: carrier.id })" />
        </mp-collapse>

        <mp-collapse
          ref="statusMapping"
          @click="scrollTo('statusMapping')"
          :title="$t('page.statusMappings.title')"
          noPadding
          typographyClass="medium16"
          dataId="carrier-detail-collapse-status-mapping"
          v-if="
            isAuthorized('READ_CARRIERS_TECHNICAL') &&
              $route.name === ROUTES.detailCarrier
          "
        >
          <status-mapping />
        </mp-collapse>

        <mp-collapse
          ref="subscription"
          @click="scrollTo('subscription')"
          :title="$t('page.subscriptions.title')"
          noPadding
          typographyClass="medium16"
          dataId="carrier-detail-collapse-subscription"
          v-if="
            orderEligibility &&
              isAuthorized('READ_CARRIERS_TECHNICAL', {
                retailerId: (orderEligibility && orderEligibility.retailerId) || null,
                storeId: (orderEligibility && orderEligibility.storeId) || null,
              }) &&
              $route.name === ROUTES.detailCarrier
          "
        >
          <mp-subscription
            v-if="showSubscription"
            title="page.subscriptions.titleVariant"
            @showEditModal="showSubscriptionModal = true"
          />
        </mp-collapse>
      </v-expansion-panels>
    </v-row>
  </div>
</template>

<script lang="ts">
import { ROUTES } from '@/constants'
import { authorizationMixin } from '@/mixins'
import { GetCarrierParams } from '@/services/carrier/CarrierRepository'
import { CarrierEligibilityEntity, CarrierEntity } from '@/types'
import mpTechnicalCharacteristics from '@/views/Carrier/Detail/technical/characteristics.vue'

import mixins from 'vue-typed-mixins'

import mpSubscription from '@/views/Subscription/Detail/detail.vue'
import statusMapping from '@/views/Carrier/Detail/technical/statusMapping.vue'
import mpSpecification from '@/views/Carrier/Detail/technical/specifications/specification.vue'
import ftpAccountBlock from '@/views/Carrier/Detail/technical/ftpAccount.vue'

export default mixins(authorizationMixin).extend({
  name: 'mp-carrier-detail-technical',
  components: {
    mpTechnicalCharacteristics,
    mpSubscription,
    statusMapping,
    mpSpecification,
    ftpAccountBlock,
  },
  props: {
    orderEligibility: {
      type: Object as () => CarrierEligibilityEntity | null,
      required: true,
    },
    parent: {
      validator: prop => typeof prop === 'object' || prop === null,
      required: true,
    },
    carrier: {
      type: Object as () => CarrierEntity,
      required: true,
    },
    params: {
      type: Object as () => GetCarrierParams,
      required: true,
    },
    canEditEligibilities: {
      type: Boolean,
      required: true,
    },
  },
  data: () => ({
    ROUTES,
    showSubscriptionModal: false,
    showSubscription: true,
  }),
  methods: {
    scrollTo(refToScroll: string) {
      setTimeout(() => {
        ;(this.$refs[refToScroll] as any).$el.scrollIntoView(true, {
          behavior: 'smooth',
          block: 'end',
          inline: 'nearest',
        })
      }, 300)
    },
  },
  watch: {
    showSubscription(next) {
      if (!next) {
        this.$nextTick(() => {
          this.showSubscription = true
        })
      }
    },
  },
})
</script>

<style lang="scss" scoped>
#carrier-detail-technical {
  .left-column {
    padding-right: calc(100vw / (38 * 2));
  }

  .right-column {
    padding-left: calc(100vw / (38 * 2));
  }
}
</style>
