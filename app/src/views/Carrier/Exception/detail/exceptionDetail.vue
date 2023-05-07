<template>
  <div class="exception-detail-outer-wrapper">
    <div v-if="hasLoaded" class="exception-detail-wrapper">
      <content-header v-if="$vuetify.breakpoint.smAndUp" dataId="exception-detail">
        <template #breadcrumb>
          <mp-breadcrumb />
        </template>
        <template #title>
          <h1 data-id="exception-detail-title">{{ $t('page.exception.title') }}</h1>
        </template>
        <template #actions-button>
          <div class="exception-detail-actions">
            <mp-button
              :class="`${$vuetify.breakpoint.lgAndUp ? 'mr-3' : 'mb-3'}`"
              :text="$t('action.delete.base')"
              format="error"
              dataId="exception-detail-cancel"
              @click="showDeleteModal = true"
              v-if="isAuthorized('WRITE_CARRIER_SCHEDULE_EXCEPTIONS')"
            />

            <mp-button
              :text="$t('action.modify.base')"
              format="secondary"
              icon="pencil"
              dataId="exception-detail-save"
              :to="getEditExceptionDetail"
              v-if="isAuthorized('WRITE_CARRIER_SCHEDULE_EXCEPTIONS')"
            />
          </div>
        </template>
      </content-header>

      <v-row no-gutters class="component-wrapper mt-6">
        <v-col cols="10" offset="1">
          <!-- Date and schedule -->
          <div class="date-and-schedule">
            <h2>{{ $t('page.exception.dateAndSchedule.title') }}</h2>

            <div class="d-flex mt-7">
              <v-icon size="1.8rem">mdi-calendar-month</v-icon>
              <h4 class="ml-3">{{ getDate }}</h4>
            </div>

            <div class="d-flex mt-4">
              <v-icon size="1.8rem">mdi-clock-outline</v-icon>
              <h4
                v-for="(openingHours, index) in exception.openingHours"
                :key="`exception-detail-${index}`"
                :class="index === 0 ? 'ml-3' : 'ml-2'"
              >
                {{ openingHours.start }} -
                {{ openingHours.end }}
                {{ exception.openingHours[index + 1] ? ' / ' : '' }}
              </h4>
            </div>

            <!-- Frequency -->
            <div class="frequency-outer-wrapper">
              <h2>{{ $t('page.typicalWeek.frequency.title') }}</h2>

              <div class="frequency-wrapper">
                <span class="regular16">
                  {{ $t(`page.typicalWeek.frequency.${exception.slotsFrequency}`) }}
                </span>
              </div>
            </div>

            <!-- Capacities -->
            <div class="capacities-outer-wrapper" v-if="showCapacity">
              <h2>{{ $t('page.exception.capacity') }}</h2>

              <div class="slots-wrapper">
                <div
                  :class="`slot${slot.capacity ? '' : ' empty'}`"
                  v-for="(slot, index) of exception.slots"
                  :key="`slot-${index}`"
                >
                  <span class="regular16">
                    {{ `${slot.start} - ${slot.end}` }}
                  </span>
                  <div class="capacity-wrapper">
                    <span class="medium12 capacity-value"> {{ slot.capacity }} </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </v-col>
      </v-row>
    </div>

    <v-row v-if="$vuetify.breakpoint.xsOnly" no-gutters class="action-outer-wrapper-mobile">
      <v-col cols="12" class="action-wrapper">
        <mp-button
          class="close-btn"
          dataId="exception-detail-close"
          :text="$t('action.close.base')"
          format="sticky"
          stickyColor="yellow"
          @click="goBack()"
        />
      </v-col>
    </v-row>

    <mp-dialog-confirmation
      v-if="showDeleteModal"
      classWrapper="exception-detail-delete"
      dataId="exception-detail-delete"
      :textContent="$t('page.exception.deleteWarning')"
      @close="showDeleteModal = false"
      @submit="deleteExceptionDetail()"
      color="error"
      :header="{
        icon: 'mdi-exclamation-thick',
        isColorBackground: false,
        iconClose: 'mdi-close',
      }"
      :btnCancel="{ text: $t('action.cancel.base'), format: 'link', linkColor: 'black' }"
      :btnValidation="{
        text: $t('action.delete.base'),
        format: 'error',
      }"
      :btnToColumn="$vuetify.breakpoint.xsOnly"
    />
  </div>
</template>

<script lang="ts">
import mixins from 'vue-typed-mixins'

import contentHeader from '@/components/contentHeader/contentHeader.vue'
import mpBreadcrumb from '@/components/breadcrumb/breadcrumb.vue'

import { FrequencyAvailableNew } from '@/types'

import deliveryService from '@/services/delivery/DeliveryService'
import CarrierService from '@/services/carrier/CarrierService'
import RetailerService from '@/services/retailer/RetailerService'
import StoreService from '@/services/store/StoreService'
import ExchangePlaceService from '@/services/exchangePlace/ExchangePlaceService'

import { SET_BREADCRUMBS_LABEL, SET_HEADER_TITLE } from '@/store/mutation-types'

import { ROUTES } from '@/constants'
import { dateHelper } from '@/helpers/dateHelper'
import { SnackBarType } from '@/store/types'
import { authorizationMixin } from '@/mixins'
import { Exception } from '@/views/Carrier/Detail/parameter/exceptionsBlock/carrierExceptionsBlock.vue'

export default mixins(authorizationMixin).extend({
  name: 'mp-carrier-detail-exception',

  components: {
    contentHeader,
    mpBreadcrumb,
  },
  data: () => ({
    hasLoaded: false,
    exception: null as Exception | null,
    exceptions: [] as Exception[],
    showDeleteModal: false,
    timezone: '',
  }),
  computed: {
    getDate() {
      if (!this.exception) {
        return ''
      }

      if (this.exception!.date.start.substr(0, 10) === this.exception!.date.end.substr(0, 10)) {
        return this.$t('common.dateAt', {
          date: dateHelper.format(this.exception!.date.start, 'P'),
        })
      } else {
        return this.$t('common.dateBetween', {
          begin: dateHelper.format(this.exception!.date.start, 'P'),
          end: dateHelper.format(this.exception!.date.end, 'P'),
        })
      }
    },
    showCapacity() {
      if (this.exception?.slotsFrequency === FrequencyAvailableNew.CLOSED) {
        return false
      }

      return true
    },
    getEditExceptionDetail() {
      return { name: ROUTES.carrierEditExceptions }
    },
  },
  async mounted() {
    const params = {
      retailerId: this.$route.params.retailerId,
      exchangePlaceId: this.$route.params.exchangePlaceId,
      carrierId: this.$route.params.carrierId,
    }
    try {
      const scheduleConfig: any = await deliveryService.getSchedules(params)

      this.exception = scheduleConfig.scheduleConfigs[0].exceptions![
        parseInt(this.$route.params.exceptionId, 10)
      ]

      this.exceptions = scheduleConfig.scheduleConfigs[0].exceptions!

      this.$store.commit(SET_HEADER_TITLE, this.$t('page.exception.title'))

      const retailerId = await RetailerService.getFilters({
        id: this.$route.params.retailerId,
        forRule: 'LIST_CARRIERS',
      })

      const storeId = await StoreService.getFilters({
        id: this.$route.params.storeId,
        forRule: 'LIST_CARRIERS',
      })

      const carrierId = await CarrierService.getFilters({
        ids: this.$route.params.carrierId,
        forRule: 'LIST_CARRIERS',
      })

      const exchangePlaceId = await ExchangePlaceService.getFilters({
        id: this.$route.params.exchangePlaceId,
        forRule: 'LIST_CARRIERS',
      })
      // data for breadcrumb
      const breadcrumbsLabel = {
        retailers: retailerId[0].name,
        stores: storeId[0].name,
        exchangePlaces: exchangePlaceId[0].name,
        carriers: carrierId[0].name,
      }
      this.$store.commit(SET_BREADCRUMBS_LABEL, JSON.stringify(breadcrumbsLabel))
    } catch (e) {
      if (e.response?.status === 403) {
        return this.$router.push({ name: ROUTES.noAccess })
      }
    } finally {
      this.hasLoaded = true
    }
  },
  methods: {
    async goBack() {
      this.$router.push({
          name: ROUTES.detailCarrierExchangePlace,
          params: {
            retailerId: this.$route.params.retailerId,
            storeId: this.$route.params.storeId,
            exchangePlaceId: this.$route.params.exchangePlaceId,
          },
        })
    },
    async deleteExceptionDetail() {
      this.exceptions.splice(parseInt(this.$route.params.exceptionId, 10), 1)

      try {
        await deliveryService.updateSchedules(this.$route.params.scheduleId, {
          exceptions: this.exceptions,
        })

        this.$store.dispatch('setSnackbar', {
          message: this.$t('messages.exceptionDeleted'),
          type: SnackBarType.SUCCESS,
        })
        this.goBack()
      } catch (e) {
        this.$store.dispatch('setSnackbar', {
          type: SnackBarType.ERROR,
          message: this.$t('messages.error'),
        })
      } finally {
        this.showDeleteModal = false
      }
    },
  },
})
</script>

<style lang="scss" scoped>
.exception-detail-outer-wrapper {
  .exception-detail-wrapper {
    overflow-y: auto;

    @media #{map-get($display-breakpoints, 'xs-only')} {
      min-height: calc(100vh - 5.4rem - 6rem);
      max-height: calc(100vh - 5.4rem - 6rem);
    }

    .date-and-schedule {
      i {
        color: $main-lighten-65-color !important;
      }
    }

    .frequency-outer-wrapper {
      margin-top: 6rem;

      .frequency-wrapper {
        margin-top: 2.6rem;
        min-width: 14.8rem;
        min-height: 7rem;
        max-width: 14.8rem;
        max-height: 7rem;
        border: 0.1rem solid $main-lighten-65-color;
        border-radius: 0.4rem;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
      }
    }

    .capacities-outer-wrapper {
      margin-top: 6rem;
      margin-bottom: 6rem;

      .slots-wrapper {
        margin-top: 3rem;
        display: grid;
        grid-template-columns: repeat(auto-fill, 14rem);
        justify-content: flex-start;
        grid-gap: 1rem;

        .slot {
          min-height: 6rem;
          min-width: 14rem;
          max-height: 6rem;
          max-width: 14rem;
          border: 0.1rem solid $main-lighten-65-color;
          border-radius: 0.4rem;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;

          &.empty {
            color: $main-lighten-65-color;

            .capacity-value {
              background-color: transparent;
            }
          }

          .capacity-value {
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: $success-color;
            color: $white;
            width: 4rem;
            height: 2rem;
            border-radius: 6rem;
            margin-top: 0.3rem;
          }
        }
      }
    }

    .exception-detail-actions {
      display: flex;
      justify-content: flex-end;

      @media #{map-get($display-breakpoints, 'md-and-down')} {
        flex-direction: column;
        align-items: flex-end;
      }
    }
  }

  .action-outer-wrapper-mobile {
    .action-wrapper {
      padding-right: 0.1rem;
      display: flex;

      .close-btn {
        margin-left: 0.1rem;
      }
    }

    button,
    a {
      min-height: 6rem;
      width: 100%;
    }
  }
}
</style>
