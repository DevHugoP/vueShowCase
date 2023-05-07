<template>
  <v-row no-gutters id="carrier-create-typical-week" v-if="hasLoaded">
    <!-- Header -->
    <v-col cols="12">
      <content-header v-if="$vuetify.breakpoint.smAndUp" dataId="carrier-typical-week">
        <template #breadcrumb>
          <mp-breadcrumb />
        </template>
        <template #title>
          <h1 data-id="carrier-typical-week-title">{{ $t('page.typicalWeek.title') }}</h1>
        </template>

        <template #actions-button>
          <div class="carrier-typical-week-actions">
            <mp-button
              :text="$t('action.cancel.base')"
              format="link"
              linkColor="black"
              dataId="carrier-typical-week-cancel"
              @click="cancel()"
            />
            <mp-button
              :text="$t('action.save')"
              format="success"
              icon="content-save-outline"
              dataId="carrier-typical-week-save"
              @click="submit()"
              :disabled="isInvalid"
            />
          </div>
        </template>
      </content-header>
    </v-col>

    <v-col cols="12" class="scroll">
      <v-row no-gutters>
        <v-col cols="10" offset="1">
          <h2 class="mt-3 mb-10">{{ $t('page.typicalWeek.capacity.title') }}</h2>

          <v-row no-gutters>
            <v-col cols="12" sm="8" md="6" lg="4">
              <timezone-autocomplete
                :timezone="timezone"
                @updateTimezone="timezone = $event"
                dataId="carrier-typical-week-timezone"
                :label="`${$t('common.timezone')} *`"
                @input="$v.timezone.$touch()"
                @blur="$v.timezone.$touch()"
                :errors="getModelErrors($v.timezone)"
                :isDirty="$v.timezone.$dirty"
              />
            </v-col>
          </v-row>

          <carrier-typical-week-frequency
            class="mt-10"
            :frequency.sync="frequency"
            :subFrequency.sync="subFrequency"
          />

          <carrier-typical-week-capacity
            class="mt-15"
            :frequency="frequency"
            :subFrequency="subFrequency"
            :form="{ capacityType, selectType, dayWorkingRange, capacities }"
            @updateCapacityType="capacityType = $event"
            @updateSelectType="selectType = $event"
            @updateDayWorkingRange="dayWorkingRange = $event"
            @updateCapacities="capacities = $event"
          />
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import mixins from 'vue-typed-mixins'
import { validationMixin } from '@/mixins'

import { required } from 'vuelidate/lib/validators'
import { ROUTES } from '@/constants'
import { SET_BREADCRUMBS_LABEL, SET_HEADER_TITLE } from '@/store/mutation-types'

import contentHeader from '@/components/contentHeader/contentHeader.vue'
import mpBreadcrumb from '@/components/breadcrumb/breadcrumb.vue'
import TimezoneAutocomplete from '@/components/form/timezoneAutocomplete/timezoneAutocomplete.vue'
import CarrierTypicalWeekFrequency from '@/views/Carrier/Detail/parameter/typicalWeekBlock/carrierCreateTypicalWeekFrequency.vue'
import CarrierTypicalWeekCapacity from '@/views/Carrier/Detail/parameter/typicalWeekBlock/carrierCreateTypicalWeekCapacity.vue'

import RetailerService from '@/services/retailer/RetailerService'
import StoreService from '@/services/store/StoreService'
import CarrierService from '@/services/carrier/CarrierService'
import ExchangePlaceService from '@/services/exchangePlace/ExchangePlaceService'
import { CarrierFrequencyAvailable, DayCapacity, SchedulesConfigType, Week } from '@/types'
import { v4 } from 'uuid'
import DeliveryService from '@/services/delivery/DeliveryService'
import { SnackBarType } from '@/store/types'

export default mixins(validationMixin).extend({
  name: 'carrier-typical-week-create',
  components: {
    contentHeader,
    mpBreadcrumb,
    TimezoneAutocomplete,
    CarrierTypicalWeekCapacity,
    CarrierTypicalWeekFrequency,
  },
  data: () => ({
    timezone: '',
    frequency: '',
    subFrequency: '',
    capacityType: '',
    selectType: '',
    dayWorkingRange: {} as any,
    capacities: null as Record<string, DayCapacity[]> | null,
    hasLoaded: false,
    SchedulesConfigType,
  }),
  computed: {
    isInvalid(): boolean {
      return !(
        Boolean(this.frequency) &&
        (this.frequency !== CarrierFrequencyAvailable.CUSTOM ? Boolean(this.subFrequency) : true) &&
        Boolean(this.timezone) &&
        Boolean(this.capacityType) &&
        (this.capacityType === SchedulesConfigType.OTHER ? Boolean(this.selectType) : true) &&
        this.capacities &&
        Boolean(Object.keys(this.capacities).length)
      )
    },
  },
  validations() {
    return {
      timezone: { required },
    }
  },
  async beforeMount() {
    if (this.$vuetify.breakpoint.xsOnly) {
      this.$router.push({ name: ROUTES.notFound })
    }

    const { retailerId, exchangePlaceId, carrierId, scheduleId, storeId } = this.$route.params

    try {
      const [[retailer], [store], [carrier], [exchangePlace]] = await Promise.all([
        RetailerService.getFilters({
          id: retailerId,
          forRule: 'WRITE_CARRIER_SCHEDULES',
        }),
        StoreService.getFilters({
          id: storeId,
          forRule: 'WRITE_CARRIER_SCHEDULES',
        }),
        CarrierService.getFilters({
          ids: carrierId,
          forRule: 'WRITE_CARRIER_SCHEDULES',
        }),
        ExchangePlaceService.getFilters({
          id: exchangePlaceId,
          forRule: 'WRITE_CARRIER_SCHEDULES',
        }),
      ])

      this.$store.commit(SET_HEADER_TITLE, this.$t('page.typicalWeek.title'))

      // data for breadcrumb
      const breadcrumbsLabel = {
        retailers: retailer?.name,
        stores: store?.name,
        exchangePlaces: exchangePlace?.name,
        carriers: carrier?.name,
      }
      this.$store.commit(SET_BREADCRUMBS_LABEL, JSON.stringify(breadcrumbsLabel))
    } catch (e) {
      if (e.response?.status === 403) {
        return this.$router.push({ name: ROUTES.noAccess })
      }
    }

    if (this.$route.name === ROUTES.editCarrierTypicalWeek) {
      const deliverySchedules = await DeliveryService.getScheduleById(scheduleId)
      const dayWorkingRange: any = {}

      for (const workingScheduleIndex in deliverySchedules.scheduleConfig.workingSchedule) {
        if (deliverySchedules.scheduleConfig.workingSchedule[workingScheduleIndex]) {
          dayWorkingRange[workingScheduleIndex] = deliverySchedules.scheduleConfig.workingSchedule[
            workingScheduleIndex
          ].map((schedule: any) => {
            return { ...schedule, fakeId: v4() }
          })
        }
      }

      this.capacities = deliverySchedules.scheduleConfig.schedule.slots
      this.frequency = deliverySchedules.scheduleConfig.schedule.slotsFrequency
      this.subFrequency = deliverySchedules.scheduleConfig.schedule.slotsSubFrequency || ''
      this.timezone = deliverySchedules.scheduleConfig.timezone
      this.dayWorkingRange = dayWorkingRange

      if (
        !deliverySchedules.scheduleConfig.type ||
        deliverySchedules.scheduleConfig.type === SchedulesConfigType.ORDERS_QUANTITY
      ) {
        this.capacityType = SchedulesConfigType.ORDERS_QUANTITY
      } else {
        this.capacityType = SchedulesConfigType.OTHER
        this.selectType = deliverySchedules.scheduleConfig.type
      }

      this.hasLoaded = true
      return
    }

    this.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone

    this.dayWorkingRange = Object.values(Week).reduce((acc, current) => {
      return { ...acc, [current]: [{ start: '', end: '', fakeId: v4() }] }
    }, {})

    this.capacities = Object.values(Week).reduce((acc, current) => {
      return { ...acc, [current]: [] }
    }, {})

    this.capacityType = SchedulesConfigType.ORDERS_QUANTITY

    this.hasLoaded = true
  },
  methods: {
    async submit() {
      const params = {
        retailerId: this.$route.params.retailerId,
        exchangePlaceId: this.$route.params.exchangePlaceId,
        carrierId: this.$route.params.carrierId,
      }

      for (const day in this.capacities) {
        if (this.capacities[day]) {
          this.capacities[day] = this.capacities[day].map(capacity => {
            if (capacity.capacity === null) {
              return { ...capacity, capacity: 0 }
            }
            return capacity
          })
        }
      }

      for (const dayWorking in this.dayWorkingRange) {
        if (this.dayWorkingRange[dayWorking]) {
          const day = this.dayWorkingRange[dayWorking]

          if (day?.length === 1 && !day[0].start && !day[0].end) {
            this.dayWorkingRange[dayWorking] = []
          }
        }
      }

      try {
        if (this.$route.name === ROUTES.editCarrierTypicalWeek) {
          if (this.frequency) {
            if (Object.values(this.capacities!).some(day => day.some(({ capacity }) => capacity))) {
              await DeliveryService.updateSchedules(this.$route.params.scheduleId, {
                schedule: {
                  slotsFrequency: this.frequency,
                  slotsSubFrequency: this.subFrequency,
                  slots: this.capacities,
                },
                workingSchedule: this.dayWorkingRange,
                timezone: this.timezone,
                type:
                  this.capacityType === SchedulesConfigType.OTHER
                    ? this.selectType
                    : this.capacityType,
              })
            } else {
              this.$store.dispatch('setSnackbar', {
                type: SnackBarType.ERROR,
                message: this.$t('messages.noCapacity'),
              })
              return
            }
          } else {
            this.$store.dispatch('setSnackbar', {
              type: SnackBarType.ERROR,
              message: this.$t('messages.noFrequency'),
            })
            return
          }
        } else if (this.frequency) {
          if (Object.values(this.capacities!).some(day => day.some(({ capacity }) => capacity))) {
            await DeliveryService.createSchedules({
              ...params,
              schedule: {
                slotsFrequency: this.frequency,
                slotsSubFrequency: this.subFrequency,
                slots: this.capacities,
              },
              workingSchedule: this.dayWorkingRange,
              timezone: this.timezone,
              type:
                this.capacityType === SchedulesConfigType.OTHER
                  ? this.selectType
                  : this.capacityType,
            })
          } else {
            this.$store.dispatch('setSnackbar', {
              type: SnackBarType.ERROR,
              message: this.$t('messages.noCapacity'),
            })
            return
          }
        } else {
          this.$store.dispatch('setSnackbar', {
            type: SnackBarType.ERROR,
            message: this.$t('messages.noFrequency'),
          })
          return
        }
        this.$store.dispatch('setSnackbar', {
          message:
            this.$route.name === ROUTES.editCarrierTypicalWeek
              ? this.$t('messages.typicalWeekUpdated')
              : this.$t('messages.typicalWeekCreated'),
          type: SnackBarType.SUCCESS,
        })

        this.$router.push({
          name: ROUTES.detailCarrierExchangePlace,
          params: {
            retailerId: this.$route.params.retailerId,
            storeId: this.$route.params.storeId,
            exchangePlaceId: this.$route.params.exchangePlaceId,
          },
        })
      } catch (e) {
        this.$store.dispatch('setSnackbar', {
          type: SnackBarType.ERROR,
          message: this.$t('messages.error'),
        })
      }
    },
    cancel() {
      this.$router.back()
    },
  },
})
</script>

<style lang="scss" scoped>
@import '../../../../../styles/mixins/macScrollbar';

#carrier-create-typical-week {
  .scroll {
    overflow: auto;
    max-height: calc(100vh - 8.5rem - 15.3rem);
    @include setMacScrollbar('&');
    padding-bottom: 5rem;
  }
}
</style>
