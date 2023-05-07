<template>
  <mp-block
    id="carrier-detail-pickup-point-block"
    :title="$vuetify.breakpoint.smAndUp ? $t('page.carrier.pickupPointType.title') : ''"
    :hasBorder="$vuetify.breakpoint.smAndUp"
    :hasMarginBottom="$vuetify.breakpoint.smAndUp"
    titleHasPaddingBottom
    :hasEditIcon="
      $vuetify.breakpoint.smAndUp && hasEditIcon && Boolean(parentPickupPointTypes.length)
    "
    @clickOnIcon="showModal = true"
  >
    <v-row no-gutters v-if="parentPickupPointTypes.length">
      <v-col
        cols="12"
        v-for="localType in parentPickupPointTypes"
        :key="`promises-${localType}`"
        class="pickup-point-type-wrapper"
      >
        <v-icon
          size="1.8rem"
          class="success-color mr-3"
          v-if="savePickupPointTypes?.length && savePickupPointTypes.includes(localType)"
        >
          mdi-check-bold
        </v-icon>
        <v-icon size="1.8rem" class="error-color mr-3" v-else>mdi-close-thick</v-icon>
        <span class="regular14 main-color">
          {{ $t(`technical.pickupPointTypes.${localType}`) }}
        </span>
      </v-col>
    </v-row>
    <v-row no-gutters v-else>
      <no-data
        dataId="carrier-pickup-point-types-dialog-noData"
        :content="$t('common.noData.pickupPointType')"
      />
    </v-row>

    <mp-dialog-confirmation
      v-if="showModal"
      dataId="carrier-pickup-point-types-dialog"
      classWrapper="carrier-pickup-point-types-dialog"
      color="primary"
      :header="{
        iconClose: 'mdi-close',
        icon: $vuetify.breakpoint.smAndUp ? 'mdi-pencil' : '',
        isColorBackground: true,
        text: $t('action.modify.pickupPointTypes'),
        textPolice: 'medium16',
      }"
      :btnValidation="{
        text: $t('action.save'),
        format: 'success',
        icon: 'content-save-outline',
        loading: requestOnGoing,
      }"
      :btnCancel="{ text: $t('action.cancel.base'), format: 'link', linkColor: 'black' }"
      @close="showModal = !showModal"
      @submit="handleSubmit()"
    >
      <template #content>
        <v-row no-gutters>
          <v-col
            cols="10"
            offset="1"
            v-for="(localType, index) in parentPickupPointTypes"
            :key="`pickup-point-types-${index}`"
            class="row-wrapper"
          >
            <mp-checkbox-new
              :label="$t(`technical.pickupPointTypes.${localType}`)"
              v-model="editPickupPointTypes"
              :value="localType"
              :hide-details="true"
              :data-id="`carrier-pickup-point-types-checkbox-${index}`"
            />
          </v-col>
        </v-row>
      </template>
    </mp-dialog-confirmation>
  </mp-block>
</template>

<script lang="ts">
import Vue from 'vue'

import mpBlock from '@/components/block/block.vue'
import noData from '@/components/noData/noData.vue'

import { CarrierEligibilityEntity, PICKUP_POINT_TYPES } from '@/types'
import { SnackBarType } from '@/store/types'
import OrderEligibilityService from '@/services/orderEligibility/OrderEligibilityService'
import { GetCarrierParams } from '@/services/carrier/CarrierRepository'

export default Vue.extend({
  name: 'mp-carrier-detail-pickuppointtype',
  components: {
    mpBlock,
    noData,
  },
  props: {
    orderEligibility: {
      type: Object as () => CarrierEligibilityEntity | null,
      required: true,
    },
    parent: {
      validator: prop => typeof prop === 'object' || prop === null,
      type: Object as () => CarrierEligibilityEntity | null,
      required: true,
    },
    hasEditIcon: {
      type: Boolean,
      required: true,
    },
    params: {
      type: Object as () => GetCarrierParams,
      required: true,
    },
  },
  data: () => ({
    PICKUP_POINT_TYPES,
    showModal: false,
    editPickupPointTypes: [] as PICKUP_POINT_TYPES[],
    requestOnGoing: false,
  }),
  computed: {
    savePickupPointTypes(): string[] {
      if (!this.orderEligibility?.pickupPointTypes?.length) {
        return []
      }

      return this.orderEligibility.pickupPointTypes
    },
    parentPickupPointTypes(): string[] {
      return this.parent ? this.parent.pickupPointTypes || [] : Object.values(PICKUP_POINT_TYPES)
    },
  },
  methods: {
    async handleSubmit(): Promise<void> {
      if (this.requestOnGoing) {
        return
      }

      try {
        this.requestOnGoing = true
        const params = this.editPickupPointTypes
        await OrderEligibilityService.update(this.params, {
          pickupPointTypes: params,
        })
        this.orderEligibility!.pickupPointTypes = params

        this.$store.dispatch('setSnackbar', {
          message: this.$t('messages.carrierUpdated'),
          type: SnackBarType.SUCCESS,
        })
      } catch (e) {
        this.$store.dispatch('setSnackbar', {
          type: SnackBarType.ERROR,
          message: this.$t('messages.error'),
        })
      } finally {
        this.requestOnGoing = false
        this.showModal = false
      }
    },
  },
  watch: {
    showModal(next: boolean) {
      if (!next) {
        this.editPickupPointTypes = []
        return
      }

      this.editPickupPointTypes = this.orderEligibility!.pickupPointTypes || []
    },
  },
})
</script>
<style lang="scss">
#carrier-detail-pickuppoint-block {
  .pickup-point-type-wrapper {
    margin-bottom: 1.6rem;
    display: flex;
    align-items: center;

    &:last-of-type {
      margin-bottom: 0;
    }
  }
}

.carrier-pickup-point-types-dialog {
  .main-dialog-content {
    @media #{map-get($display-breakpoints, 'sm-and-up')} {
      @import '../../../../../styles/mixins/macScrollbar';
      @include setMacScrollbar('&');
      max-height: calc(100vh - 33rem);
      overflow-y: scroll;
    }

    .row-wrapper {
      display: flex;
      padding-bottom: 2rem !important;

      &:first-of-type {
        padding-top: 4.1rem;
      }
    }
  }
  .v-card__actions {
    border-top: 0.1rem solid $main-lighten-74-color;
  }
}
</style>
