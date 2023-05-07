<template>
  <v-row no-gutters id="carrier-detail-parameter" v-if="$vuetify.breakpoint.smAndUp">
    <v-col cols="12" md="5" class="left-column">
      <mp-tag
        v-if="orderEligibility && orderEligibility.retailerId && canAccessTagsCommitments"
        :params="params"
        :tags.sync="orderEligibility.tags"
        :parentTags="(parent && parent.tags) || []"
        @update:tags="handleTagsCommitmentsConstraintsChanges"
      />

      <mp-commitment
        v-if="orderEligibility && orderEligibility.retailerId && canAccessTagsCommitments"
        :params="params"
        :commitments="orderEligibility.commitments || []"
        :parentCommitments="(parent && parent.commitments) || []"
        @commitmentsDeleted="handleTagsCommitmentsConstraintsChanges"
      />

      <mp-capacity
        v-if="orderEligibility"
        :orderEligibility="orderEligibility"
        :carrierParent="parent"
        :params="params"
        :hasEditIcon="canEditEligibilities"
      />

      <mp-delivery-constraints-carrier
        v-if="orderEligibility"
        :orderEligibility="orderEligibility"
        :carrierParent="parent"
        :params="params"
        @update:constraints="handleTagsCommitmentsConstraintsChanges"
      />

      <mp-carrier-exception
        v-if="checkRoute && isAuthorized('READ_CARRIER_SCHEDULE_EXCEPTIONS')"
        :exceptions="exceptions"
        :scheduleConfigs="scheduleConfigs"
      />
    </v-col>
    <v-col cols="12" md="7" class="right-column">
      <cut-off
        v-if="orderEligibility && orderEligibility.retailerId"
        :deliveryCutOffs.sync="orderEligibility.deliveryCutOffs"
        :params="params"
      />

      <mp-pickup-point
        v-if="
          orderEligibility &&
            orderEligibility.services.includes(AVAILABLE_LEVEL_SERVICES.PICKUP_POINT) &&
            pickupPointConfig
        "
        :config="pickupPointConfig"
        :activeCategories="{}"
      />

      <mp-pickup-point-type
        v-if="orderEligibility?.services?.includes(AVAILABLE_LEVEL_SERVICES.PICKUP_POINT)"
        :orderEligibility="orderEligibility"
        :hasEditIcon="canEditEligibilities"
        :params="params"
        :parent="parent"
      />

      <mp-carrier-typical-week-block
        v-if="checkRoute && isAuthorized('READ_CARRIER_SCHEDULES')"
        :schedule.sync="schedule"
        :scheduleConfigs.sync="scheduleConfigs"
      />
    </v-col>
  </v-row>
  <v-row no-gutters id="carrier-detail-parameter-mobile" v-else>
    <v-expansion-panels flat>
      <mp-collapse
        ref="tag"
        @click="scrollTo('tag')"
        :title="$t('page.carrier.tag.title')"
        noPadding
        typographyClass="medium16"
        dataId="carrier-detail-collapse-tag"
        v-if="orderEligibility && orderEligibility.retailerId && canAccessTagsCommitments"
      >
        <mp-tag
          :params="params"
          :tags.sync="orderEligibility.tags"
          :parentTags="(parent && parent.tags) || []"
          @update:tags="handleTagsCommitmentsConstraintsChanges"
        />
      </mp-collapse>

      <mp-collapse
        ref="commitments"
        @click="scrollTo('commitments')"
        :title="$t('page.carrier.commitment.title')"
        noPadding
        typographyClass="medium16"
        dataId="carrier-detail-collapse-commitments"
        v-if="orderEligibility && orderEligibility.retailerId && canAccessTagsCommitments"
      >
        <mp-commitment
          :params="params"
          :commitments="orderEligibility.commitments || []"
          :parentCommitments="(parent && parent.commitments) || []"
          @commitmentsDeleted="handleTagsCommitmentsConstraintsChanges"
        />
      </mp-collapse>

      <mp-collapse
        v-if="orderEligibility"
        ref="capacity"
        @click="scrollTo('capacity')"
        :title="$t('page.carrier.capacities')"
        noPadding
        typographyClass="medium16"
        data-id="carrier-detail-collapse-capacity"
      >
        <mp-capacity
          :orderEligibility="orderEligibility"
          :carrierParent="parent"
          :params="params"
          :hasEditIcon="canEditEligibilities"
        />
      </mp-collapse>

      <mp-collapse
        ref="delivery-contraint"
        @click="scrollTo('delivery-contraint')"
        :title="$t('page.deliveryConstraints.title')"
        noPadding
        typographyClass="medium16"
        data-id="carrier-detail-collapse-delivery-contraint"
        v-if="orderEligibility"
      >
        <mp-delivery-constraints-carrier
          :orderEligibility="orderEligibility"
          :carrierParent="parent"
          :params="params"
          @update:constraints="handleTagsCommitmentsConstraintsChanges"
        />
      </mp-collapse>

      <mp-collapse
        ref="carrier-exception"
        @click="scrollTo('carrier-exception')"
        :title="$t('page.exchangePlace.exceptions.title')"
        noPadding
        typographyClass="medium16"
        data-id="carrier-detail-collapse-exceptions"
        v-if="checkRoute && isAuthorized('READ_CARRIER_SCHEDULES')"
      >
        <mp-carrier-exception :exceptions="exceptions" :scheduleConfigs="scheduleConfigs" />
      </mp-collapse>

      <mp-collapse
        ref="cutoff"
        @click="scrollTo('cutoff')"
        :title="$t('components.cutoff.title')"
        noPadding
        typographyClass="medium16"
        data-id="carrier-detail-collapse-cutoff"
        v-if="orderEligibility && orderEligibility.retailerId"
      >
        <cut-off :deliveryCutOffs.sync="orderEligibility.deliveryCutOffs" :params="params" />
      </mp-collapse>

      <mp-collapse
        ref="pickupPoint"
        @click="scrollTo('pickupPoint')"
        :title="$t('page.carrier.pickupPoint.title')"
        noPadding
        typographyClass="medium16"
        data-id="carrier-detail-collapse-pickupPoint"
        v-if="
          orderEligibility &&
            orderEligibility.services.includes(AVAILABLE_LEVEL_SERVICES.PICKUP_POINT) &&
            pickupPointConfig
        "
      >
        <mp-pickup-point :config="pickupPointConfig" :activeCategories="{}" />
      </mp-collapse>

      <mp-collapse
        ref="pickupPointType"
        @click="scrollTo('pickupPointType')"
        :title="$t('page.carrier.pickupPointType.title')"
        noPadding
        typographyClass="medium16"
        data-id="carrier-detail-collapse-pickupPointType"
        v-if="orderEligibility?.services?.includes(AVAILABLE_LEVEL_SERVICES.PICKUP_POINT)"
      >
        <mp-pickup-point-type
          :orderEligibility="orderEligibility"
          :hasEditIcon="canEditEligibilities"
          :params="params"
          :parent="parent"
        />
      </mp-collapse>

      <mp-collapse
        ref="typical-week"
        @click="scrollTo('typical-week')"
        :title="$t('page.exchangePlace.typicalWeek.title')"
        noPadding
        typographyClass="medium16"
        data-id="carrier-detail-collapse-typical-week"
        v-if="checkRoute && isAuthorized('READ_CARRIER_SCHEDULES')"
      >
        <mp-carrier-typical-week-block :schedule="schedule" :scheduleConfigs="scheduleConfigs" />
      </mp-collapse>
    </v-expansion-panels>
  </v-row>
</template>

<script lang="ts">
import { AVAILABLE_LEVEL_SERVICES } from '@/constants/shared'
import { authorizationMixin } from '@/mixins'
import { CarrierEligibilityEntity, Schedule } from '@/types'

import mixins from 'vue-typed-mixins'

import mpCapacity from '@/views/Carrier/Detail/parameter/capacity/capacity.vue'
import mpCommitment from '@/views/Carrier/Detail/parameter/commitment/commitment.vue'
import mpPickupPoint from '@/views/Carrier/Detail/parameter/pickuppoint/pickuppoint.vue'
import mpPickupPointType from '@/views/Carrier/Detail/parameter/pickuppoint/pickupPointType.vue'
import mpTag from '@/views/Carrier/Detail/parameter/tag/tag.vue'
import mpCarrierException from '@/views/Carrier/Detail/parameter/exceptionsBlock/carrierExceptionsBlock.vue'
import mpExchangePlaceExceptions from '@/views/ExchangePlace/detail/exceptions/exceptions.vue'
import mpCarrierTypicalWeekBlock from '@/views/Carrier/Detail/parameter/typicalWeekBlock/carrierTypicalWeekBlock.vue'
import mpDeliveryConstraintsCarrier from '@/views/Carrier/Detail/parameter/deliveryConstraints/deliveryConstraints.vue'
import { ROUTES } from '@/constants'
import { GetCarrierParams } from '@/services/carrier/CarrierRepository'
import cutOff from '@/views/Carrier/Detail/parameter/cutoff.vue'

import { SchedulesConfigRecord, Exceptions } from '@/types'
import deliveryService from '@/services/delivery/DeliveryService'

export default mixins(authorizationMixin).extend({
  name: 'mp-carrier-detail-parameter',
  components: {
    mpTag,
    mpCapacity,
    mpCommitment,
    mpPickupPoint,
    mpPickupPointType,
    mpCarrierTypicalWeekBlock,
    mpDeliveryConstraintsCarrier,
    mpCarrierException,
    mpExchangePlaceExceptions,
    cutOff,
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
    pickupPointConfig: {
      validator: prop => typeof prop === 'object' || prop === null,
      required: false,
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
    AVAILABLE_LEVEL_SERVICES,
    scheduleConfigs: {} as SchedulesConfigRecord,
    scheduleConfigsData: {} as any,
    schedule: {} as Schedule | null | undefined,
    checkRoute: false as boolean,
    exceptions: {} as Exceptions[] | undefined,
  }),
  async mounted() {
    this.checkRoute = this.$route.name === ROUTES.detailCarrierExchangePlace
    if (this.$route.name === ROUTES.detailCarrierExchangePlace) {
      const params = {
        retailerId: this.$route.params.retailerId,
        exchangePlaceId: this.$route.params.exchangePlaceId,
        carrierId: this.$route.params.carrierId,
      }
      this.scheduleConfigsData = await deliveryService.getSchedules(params)
      this.scheduleConfigs = this.scheduleConfigsData.scheduleConfigs[0]
      if (typeof this.scheduleConfigs !== 'undefined') {
        this.schedule = this.scheduleConfigs.schedule
        this.exceptions = this.scheduleConfigs.exceptions
      }
    }
  },
  computed: {
    canAccessTagsCommitments(): boolean {
      if (this.orderEligibility?.retailerId) {
        return this.isAuthorized('READ_CARRIERS_PARAMETERS_CHILD', {
          retailerId: this.orderEligibility.retailerId,
          storeId: this.orderEligibility?.storeId || null,
        })
      }

      return this.isAuthorized('READ_CARRIERS_PARAMETERS')
    },
    getCreateRoute(): string {
      const { retailerId, exchangePlaceId, storeId } = this.params

      if (exchangePlaceId) {
        return ROUTES.createCarrierExchangePlaceNotificationState
      }

      if (storeId) {
        return ROUTES.createCarrierStoreNotificationState
      }

      if (retailerId) {
        return ROUTES.createCarrierRetailerNotificationState
      }

      return ROUTES.createCarrierNotificationState
    },
    getDetailRoute(): string {
      const { retailerId, exchangePlaceId, storeId } = this.params

      if (exchangePlaceId) {
        return ROUTES.detailCarrierExchangePlaceNotificationState
      }

      if (storeId) {
        return ROUTES.detailCarrierStoreNotificationState
      }

      if (retailerId) {
        return ROUTES.detailCarrierRetailerNotificationState
      }

      return ROUTES.detailCarrierNotificationState
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
    handleTagsCommitmentsConstraintsChanges(params?: Record<string, any>) {
      if (
        !this.orderEligibility?.tags?.length ||
        params?.fromCommitment ||
        this.orderEligibility?.deliveryNoticePeriod?.value ||
        this.orderEligibility?.minDeliveryTime?.value ||
        this.orderEligibility?.deliveryPromise?.value
      ) {
        this.$emit('needEligibilityReload')
      }
    },
  },
})
</script>

<style lang="scss" scoped>
#carrier-detail-parameter {
  .left-column {
    padding-right: calc(100vw / (38 * 2));
  }

  .right-column {
    padding-left: calc(100vw / (38 * 2));
  }
}
</style>
