<template>
  <v-row no-gutters id="carrier-detail-general" v-if="$vuetify.breakpoint.smAndUp">
    <v-col cols="12" md="5" class="left-column">
      <mp-promise
        :carrier="carrier"
        :hasEditIcon="!parent && isAuthorized('EDIT_CARRIERS', { carrierId: carrier.id })"
      />

      <mp-vehicle-type
        :carrier="carrier"
        :hasEditIcon="!parent && isAuthorized('EDIT_CARRIERS', { carrierId: carrier.id })"
      />

      <mp-model
        :carrier="carrier"
        :hasEditIcon="!parent && isAuthorized('EDIT_CARRIERS', { carrierId: carrier.id })"
      />

      <mp-logistic
        :carrier="carrier"
        :hasEditIcon="!parent && isAuthorized('EDIT_CARRIERS', { carrierId: carrier.id })"
      />

      <mp-plus
        :carrier="carrier"
        :hasEditIcon="!parent && isAuthorized('EDIT_CARRIERS', { carrierId: carrier.id })"
      />
      <mp-retailer
        :retailers="retailers"
        v-if="!parent && isAuthorized('READ_CARRIERS_RETAILERS_LIST')"
      />
    </v-col>

    <v-col cols="12" md="7" class="right-column">
      <mp-service
        v-if="orderEligibility"
        :params="params"
        :orderEligibility="orderEligibility"
        :parentServices="parent ? parent.services : null"
        :hasEditIcon="canEditEligibilities"
      />

      <mp-typology
        v-if="orderEligibility"
        :params="params"
        :orderEligibility="orderEligibility"
        :parent="parent"
        :hasEditIcon="canEditEligibilities"
      />

      <mp-perimeter
        v-if="orderEligibility"
        :orderEligibility="orderEligibility"
        :params="params"
        :parentDepartments="parent ? parent.departments : null"
        :hasEditIcon="canEditEligibilities"
      />

      <mp-process
        :carrier="carrier"
        :hasEditIcon="!parent && isAuthorized('EDIT_CARRIERS', { carrierId: carrier.id })"
      />
    </v-col>
  </v-row>
  <v-row no-gutters id="carrier-detail-general-mobile" v-else>
    <v-expansion-panels flat>
      <mp-collapse
        ref="promise"
        @click="scrollTo('promise')"
        :title="$t('page.carrier.promises.title')"
        data-id="carrier-detail-collapse-promise"
        noPadding
        typographyClass="medium16"
        v-if="carrier"
      >
        <mp-promise
          :carrier="carrier"
          :hasEditIcon="!parent && isAuthorized('EDIT_CARRIERS', { carrierId: carrier.id })"
        />
      </mp-collapse>

      <mp-collapse
        ref="vehicleType"
        @click="scrollTo('vehicleType')"
        :title="$t('page.carrier.vehicleType.title')"
        data-id="carrier-detail-collapse-promise"
        noPadding
        typographyClass="medium16"
        v-if="carrier"
      >
        <mp-vehicle-type
          :carrier="carrier"
          :hasEditIcon="!parent && isAuthorized('EDIT_CARRIERS', { carrierId: carrier.id })"
        />
      </mp-collapse>

      <mp-collapse
        ref="model"
        @click="scrollTo('model')"
        :title="$t('page.carrier.deliveryModel.title')"
        data-id="carrier-detail-collapse-model"
        noPadding
        typographyClass="medium16"
        v-if="carrier"
      >
        <mp-model
          :carrier="carrier"
          :hasEditIcon="!parent && isAuthorized('EDIT_CARRIERS', { carrierId: carrier.id })"
        />
      </mp-collapse>

      <mp-collapse
        ref="logistics"
        @click="scrollTo('logistics')"
        :title="$t('page.carrier.logistics.title')"
        data-id="carrier-detail-collapse-logistics"
        noPadding
        typographyClass="medium16"
        v-if="carrier"
      >
        <mp-logistic
          :carrier="carrier"
          :hasEditIcon="!parent && isAuthorized('EDIT_CARRIERS', { carrierId: carrier.id })"
        />
      </mp-collapse>

      <mp-collapse
        ref="plus"
        @click="scrollTo('plus')"
        :title="$t('page.carrier.plus.title')"
        data-id="carrier-detail-collapse-plus"
        noPadding
        typographyClass="medium16"
        v-if="carrier"
      >
        <mp-plus
          :carrier="carrier"
          :hasEditIcon="!parent && isAuthorized('EDIT_CARRIERS', { carrierId: carrier.id })"
        />
      </mp-collapse>

      <mp-collapse
        v-if="orderEligibility"
        ref="service"
        @click="scrollTo('service')"
        :title="$t('page.carrier.service.title')"
        noPadding
        typographyClass="medium16"
        data-id="carrier-detail-collapse-services"
      >
        <mp-service
          :orderEligibility="orderEligibility"
          :params="params"
          :parentServices="parent ? parent.services : null"
          :hasEditIcon="canEditEligibilities"
        />
      </mp-collapse>

      <mp-collapse
        v-if="orderEligibility"
        ref="typology"
        @click="scrollTo('typology')"
        :title="$t('page.carrier.typology.title')"
        noPadding
        typographyClass="medium16"
        data-id="carrier-detail-collapse-typologies"
      >
        <mp-typology
          :orderEligibility="orderEligibility"
          :params="params"
          :parent="parent"
          :hasEditIcon="canEditEligibilities"
        />
      </mp-collapse>

      <mp-collapse
        v-if="orderEligibility"
        ref="perimeter"
        @click="scrollTo('perimeter')"
        :title="$t('page.carrier.perimeter.title')"
        noPadding
        typographyClass="medium16"
        data-id="carrier-detail-collapse-perimeter"
      >
        <mp-perimeter
          :orderEligibility="orderEligibility"
          :params="params"
          :parentDepartments="parent ? parent.departments : null"
          :hasEditIcon="canEditEligibilities"
        />
      </mp-collapse>

      <mp-collapse
        ref="retailers"
        @click="scrollTo('retailers')"
        :title="$t('common.retailer')"
        data-id="carrier-detail-collapse-retailer"
        noPadding
        typographyClass="medium16"
        v-if="retailers.length"
      >
        <mp-retailer :retailers="retailers" />
      </mp-collapse>

      <mp-collapse
        ref="process"
        @click="scrollTo('process')"
        :title="$t('page.carrier.process.title')"
        data-id="carrier-detail-collapse-process"
        noPadding
        typographyClass="medium16"
        v-if="carrier"
      >
        <mp-process
          :carrier="carrier"
          :hasEditIcon="!parent && isAuthorized('EDIT_CARRIERS', { carrierId: carrier.id })"
        />
      </mp-collapse>
    </v-expansion-panels>
  </v-row>
</template>

<script lang="ts">
import { authorizationMixin } from '@/mixins'
import { GetCarrierParams } from '@/services/carrier/CarrierRepository'
import { CarrierEligibilityEntity, CarrierEntity, RetailerEntity } from '@/types'

import mpRetailer from '@/views/Carrier/Detail/general/retailer.vue'
import mpService from '@/views/Carrier/Detail/general/service.vue'
import mpTypology from '@/views/Carrier/Detail/general/typology.vue'
import mpPerimeter from '@/views/Carrier/Detail/general/perimeter.vue'
import mpModel from '@/views/Carrier/Detail/general/model.vue'
import mpPromise from '@/views/Carrier/Detail/general/promise.vue'
import mpVehicleType from '@/views/Carrier/Detail/general/vehicleType.vue'
import mpLogistic from '@/views/Carrier/Detail/general/logistic.vue'
import mpPlus from '@/views/Carrier/Detail/general/plus.vue'
import mpProcess from '@/views/Carrier/Detail/general/process.vue'

import mixins from 'vue-typed-mixins'

export default mixins(authorizationMixin).extend({
  name: 'mp-carrier-detail-general',
  components: {
    mpRetailer,
    mpService,
    mpTypology,
    mpPerimeter,
    mpModel,
    mpPromise,
    mpVehicleType,
    mpLogistic,
    mpPlus,
    mpProcess,
  },
  props: {
    retailers: {
      type: Array as () => RetailerEntity[],
      required: true,
    },
    orderEligibility: {
      type: Object as () => CarrierEligibilityEntity | null,
    },
    carrier: {
      type: Object as () => CarrierEntity,
      required: true,
    },
    parent: {
      validator: prop => typeof prop === 'object' || prop === null,
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
})
</script>

<style lang="scss" scoped>
#carrier-detail-general {
  .left-column {
    padding-right: calc(100vw / (38 * 2));
  }

  .right-column {
    padding-left: calc(100vw / (38 * 2));
  }
}
</style>
