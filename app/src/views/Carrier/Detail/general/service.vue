<template>
  <v-container
    id="carrier-detail-service"
    :class="lightMode ? 'is-light' : ''"
    data-id="carrier-detail-service"
  >
    <mp-block
      id="carrier-detail-service-block"
      :title="$vuetify.breakpoint.smAndUp ? $t('page.carrier.service.title') : ''"
      :hasBorder="$vuetify.breakpoint.smAndUp"
      :hasMarginBottom="$vuetify.breakpoint.smAndUp"
      titleHasPaddingBottom
      :hasEditIcon="hasEditIcon && !lightMode && !!(oeServices && oeServices.length)"
      @clickOnIcon="showModal = true"
    >
      <div v-if="sortedOeServices && sortedOeServices.length">
        <v-row no-gutters>
          <v-col
            cols="12"
            v-for="(service, index) in sortedOeServices"
            :key="`carrier-detail-service-${index}`"
            class="row-wrapper"
          >
            <v-icon
              size="1.8rem"
              class="main-service-icon success-color"
              :data-id="`carrier-detail-service-${service}`"
            >
              mdi-check-bold
            </v-icon>
            <span class="regular14 main-color">{{ $t(`technical.services.${service}`) }}</span>
          </v-col>
        </v-row>
      </div>

      <v-row no-gutters v-else>
        <v-col cols="12" class="no-data-wrapper">
          <no-data
            dataId="carrrier-detail-service-block-noData"
            :content="$t('common.noData.noContent')"
          />

          <mp-button
            v-if="hasEditIcon && $vuetify.breakpoint.smAndUp"
            format="primary"
            :text="$t('action.add.base')"
            icon="plus"
            class="mp-button"
            @click="showModal = true"
            dataId="carrrier-detail-service-block-add"
          />
        </v-col>
      </v-row>
    </mp-block>

    <mp-dialog-confirmation
      :fullscreen="$vuetify.breakpoint.xsOnly"
      v-if="showModal"
      dataId="carrier-delivery-services-modal"
      classWrapper="carrier-delivery-services-modal"
      color="primary"
      :header="{
        iconClose: 'mdi-close',
        icon: $vuetify.breakpoint.smAndUp ? 'mdi-pencil' : '',
        isColorBackground: true,
        text: $t('action.modify.service'),
        textPolice: 'medium16',
      }"
      :btnValidation="{
        text: $t('action.save'),
        format: 'success',
        icon: 'content-save-outline',
        disabled: !editServices.length,
        loading,
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
            class="row-wrapper"
            v-for="(service, index) in sortedAllowedservices"
            :key="`services-${index}`"
          >
            <mp-checkbox-new
              :label="$t(`technical.services.${service}`)"
              v-model="editServices"
              :value="service"
              :hide-details="true"
              :data-id="`carrier-services-checkbox-${service}`"
            />
          </v-col>
        </v-row>
      </template>
    </mp-dialog-confirmation>
  </v-container>
</template>

<script lang="ts">
import noData from '@/components/noData/noData.vue'
import { AVAILABLE_LEVEL_SERVICES, NEW_AVAILABLE_SERVICES } from '@/constants/shared'
import { GetCarrierParams } from '@/services/carrier/CarrierRepository'
import OrderEligibilityService from '@/services/orderEligibility/OrderEligibilityService'
import { SnackBarType } from '@/store/types'
import { CarrierEligibilityEntity } from '@/types'
import Vue from 'vue'
import mpBlock from '@/components/block/block.vue'

export default Vue.extend({
  name: 'mp-carrier-detail-service',
  components: {
    mpBlock,
    noData,
  },
  props: {
    orderEligibility: {
      type: Object as () => CarrierEligibilityEntity,
      required: true,
    },
    parentServices: {
      type: Array as () => string[] | null,
      default: null,
    },
    lightMode: {
      type: Boolean,
      default: false,
    },
    params: {
      type: Object as () => GetCarrierParams,
      required: true,
    },
    hasEditIcon: {
      type: Boolean,
      required: true,
    },
  },
  data: () => ({
    loading: false,
    oeServices: [] as string[] | undefined,
    NEW_AVAILABLE_SERVICES,
    AVAILABLE_LEVEL_SERVICES,
    showModal: false,
    editServices: [] as string[],
    allowedservices: AVAILABLE_LEVEL_SERVICES as string[],
  }),
  mounted() {
    const { services } = this.orderEligibility
    if (this.parentServices?.length) {
      this.allowedservices = this.parentServices
    }

    this.oeServices = services
  },
  computed: {
    sortedOeServices(): string[]  {
      return this.oeServices
        .slice(0)
        .sort((service1, service2) =>
          this.$t(`technical.services.${service1}`).localeCompare(
            this.$t(`technical.services.${service2}`),
          ),
        )
    },
    sortedAllowedservices(): string[] {
      return Object.values(this.allowedservices).sort((service1, service2) => {
        const service1Checked = this.oeServices.includes(service1)
        const service2Checked = this.oeServices.includes(service2)

        if (service1Checked != service2Checked) {
          return service1Checked ? -1 : 1
        }

        return this.$t(`technical.services.${service1}`).localeCompare(
          this.$t(`technical.services.${service2}`),
        )
      })
    },
  },
  methods: {
    optionService(mainService: string): string[] {
      const returnValue = []
      if (NEW_AVAILABLE_SERVICES[mainService]) {
        const options = NEW_AVAILABLE_SERVICES[mainService].options
        if (options && this.oeServices?.length) {
          for (const service of this.oeServices) {
            if (options.includes(service)) {
              returnValue.push(service)
            }
          }
        }
      }
      return returnValue
    },
    async handleSubmit() {
      try {
        this.loading = true
        await OrderEligibilityService.update(this.params, {
          services: this.editServices,
        })
        this.oeServices = this.editServices
        this.orderEligibility.services = this.editServices
        this.$store.dispatch('setSnackbar', {
          message: this.$t('messages.carrierUpdated'),
          type: SnackBarType.SUCCESS,
        })
      } catch (err) {
        this.$store.dispatch('setSnackbar', {
          type: SnackBarType.ERROR,
          message: this.$t('messages.error'),
        })
      } finally {
        this.loading = false
        this.showModal = false
      }
    },
  },
  watch: {
    showModal(next: boolean) {
      const { services } = this.orderEligibility
      if (!next) {
        this.editServices = []
        return
      }

      this.editServices = services || []
    },
  },
})
</script>

<style lang="scss">
.carrier-delivery-services-modal {
  .main-dialog-content {
    @media #{map-get($display-breakpoints, 'sm-and-up')} {
      @import '../../../../styles/mixins/macScrollbar';
      @include setMacScrollbar('&');
      max-height: calc(100vh - 33rem);
      overflow-y: scroll;
    }

    .row-wrapper {
      display: flex;
      justify-content: space-between;
      padding-bottom: 2rem !important;

      &:first-of-type {
        padding-top: 4.1rem;
      }

      &:last-of-type {
        border-bottom: none;
      }
    }
  }

  .v-card__actions {
    border-top: 0.1rem solid $main-lighten-74-color;
  }
}

#carrier-detail-service:not(.is-light) {
  padding: 0;

  @media #{map-get($display-breakpoints, 'xs-only')} {
    border-top: solid 0.1rem $main-lighten-74-color;
  }

  .no-data-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-bottom: 2.5rem;

    .mp-button {
      margin-top: 2.5rem;
      margin-bottom: 0.1rem;
    }
  }

  .row-wrapper {
    display: flex;
    align-items: center;
    margin-bottom: 1.6rem;

    &:last-of-type {
      margin-bottom: 0;
    }

    i {
      margin-right: 1.2rem;
    }
  }
}

#carrier-detail-service:is(.is-light) {
  padding: 0;

  .block-wrapper {
    border: none;
    padding: 0 !important;

    .title-wrapper {
      display: none;
    }
  }

  .row-wrapper {
    display: flex;
    align-items: center;
    margin-bottom: 1.6rem;

    &:last-of-type {
      margin-bottom: 0;
    }

    i {
      margin-right: 1.2rem;
    }
  }
}
</style>
