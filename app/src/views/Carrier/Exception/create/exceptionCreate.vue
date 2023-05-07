<template>
  <div class="exceptions-outer-wrapper">
    <div v-if="hasLoaded" class="exceptions-wrapper">
      <content-header v-if="$vuetify.breakpoint.smAndUp" dataId="exceptions">
        <template #breadcrumb>
          <mp-breadcrumb />
        </template>
        <template #title>
          <h1 data-id="exceptions-title">{{ $t('page.exception.title') }}</h1>
        </template>
        <template #actions-button>
          <div class="exception-create-actions">
            <mp-button
              :text="$t('action.cancel.base')"
              format="link"
              linkColor="black"
              dataId="exceptions-cancel"
              @click="cancel()"
            />

            <mp-button
              :text="$t('action.save')"
              format="success"
              icon="content-save-outline"
              dataId="exceptions-save"
              :disabled="isDisabled"
              @click="submit()"
            />
          </div>
        </template>
      </content-header>

      <v-row no-gutters class="component-wrapper">
        <v-col cols="10" offset="1">
          <mp-exception-date-and-schedule
            v-model="dateAndSlots"
            @invalid="invalids.dateAndSchedule = $event"
          />
          <mp-frequency-new
            v-if="showFrequency"
            v-model="frequency"
            :frequencyAvailable="frequencyAvailable"
            :hasWarning="capacitiesIsFilled"
          />
          <mp-exception-capacities
            v-if="showCapacity"
            v-model="capacities"
            :frequency="frequency"
            :openingHours="localOpeningHour"
            class="mt-14"
          />
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import contentHeader from '@/components/contentHeader/contentHeader.vue'
import mpBreadcrumb from '@/components/breadcrumb/breadcrumb.vue'
import mpExceptionDateAndSchedule from '@/views/Carrier/Exception/create/dateAndSchedule/dateAndSchedule.vue'
import mpFrequencyNew from '@/views/Carrier/TypicalWeek/Frequency/frequency.vue'
import CarrierService from '@/services/carrier/CarrierService'
import deliveryService from '@/services/delivery/DeliveryService'
import mpExceptionCapacities from '@/views/Carrier/Exception/capacity/exceptionCapacities.vue'

import {
  DayCapacity,
  FrequencyAvailableNew,
  TypicalWeekFrequencyNew,
  WorkingSchedule,
  WorkingScheduleInterval,
} from '@/types'

import ExchangePlaceService from '@/services/exchangePlace/ExchangePlaceService'
import StoreService from '@/services/store/StoreService'
import RetailerService from '@/services/retailer/RetailerService'

import { SET_BREADCRUMBS_LABEL, SET_HEADER_TITLE } from '@/store/mutation-types'
import { ROUTES } from '@/constants'
import { SnackBarType } from '@/store/types'
import { dateHelper } from '@/helpers/dateHelper'

export interface ExceptionDateAndSlots {
  dateRange: { start: string; end: string } | ''
  slots: WorkingScheduleInterval[]
}
interface Exception {
  date: { start: string; end: string }
  openingHours: Array<{ start: string; end: string }>
  slots: Array<{ start: string; end: string; capacity: number | null }>
  slotsFrequency: FrequencyAvailableNew
}

export default Vue.extend({
  name: 'mp-carrier-create-exception',
  components: {
    contentHeader,
    mpBreadcrumb,
    mpExceptionDateAndSchedule,
    mpFrequencyNew,
    mpExceptionCapacities,
  },
  data: () => ({
    scheduleConfig: {} as any,
    hasLoaded: false,
    dateAndSlots: { dateRange: '', slots: [{ start: '', end: '' }] } as ExceptionDateAndSlots,
    frequency: { type: '', planning: {} } as TypicalWeekFrequencyNew,
    capacities: {} as Record<string, DayCapacity[]>,
    capacitiesIsFilled: false,
    showFrequency: false,
    invalids: {
      dateAndSchedule: false,
    },
    localOpeningHour: { monday: [] } as WorkingSchedule,
    saveExceptions: [] as Exception[],
    timezone: '',
    isCapacitiesNotFilled: true,
    FrequencyAvailableNew,
  }),
  computed: {
    showCapacity(): any {
      return (
        this.showFrequency &&
        this.frequency.type &&
        this.frequency.type !== FrequencyAvailableNew.CLOSED
      )
    },
    frequencyAvailable() {
      return Object.values(FrequencyAvailableNew)
    },
    isDisabled(): boolean {
      if (this.frequency.type === FrequencyAvailableNew.CLOSED) {
        return false
      }

      return this.isCapacitiesNotFilled || !this.showFrequency || this.invalids.dateAndSchedule
    },
  },
  async mounted() {
    if (this.$vuetify.breakpoint.xsOnly) {
      this.$router.push({ name: ROUTES.notFound })
    }

    const params = {
      retailerId: this.$route.params.retailerId,
      exchangePlaceId: this.$route.params.exchangePlaceId,
      carrierId: this.$route.params.carrierId,
      exceptionId: this.$route.params.exceptionId,
      storeId: this.$route.params.storeId,
      scheduleId: this.$route.params.scheduleId,
    }
    try {
      const retailerId = await RetailerService.getFilters({
        id: this.$route.params.retailerId,
        forRule: 'WRITE_CARRIER_SCHEDULE_EXCEPTIONS',
      })

      const storeId = await StoreService.getFilters({
        id: this.$route.params.storeId,
        forRule: 'WRITE_CARRIER_SCHEDULE_EXCEPTIONS',
      })

      const carrierId = await CarrierService.getFilters({
        ids: this.$route.params.carrierId,
        forRule: 'WRITE_CARRIER_SCHEDULE_EXCEPTIONS',
      })

      const exchangePlaceId = await ExchangePlaceService.getFilters({
        id: this.$route.params.exchangePlaceId,
        forRule: 'WRITE_CARRIER_SCHEDULE_EXCEPTIONS',
      })

      this.scheduleConfig = await deliveryService.getSchedules(params)

      if (this.scheduleConfig.scheduleConfigs[0].exceptions) {
        this.saveExceptions = this.scheduleConfig.scheduleConfigs[0].exceptions
      }

      if (this.$route.name === ROUTES.carrierEditExceptions) {
        const exception: Exception = this.scheduleConfig.scheduleConfigs[0].exceptions![
          parseInt(this.$route.params.exceptionId, 10)
        ]

        this.dateAndSlots = { dateRange: exception.date, slots: exception.openingHours }
        // component mp-capacity await a list of days, set monday but not displayed in the vue
        this.capacities = { monday: exception.slots }
        this.frequency = {
          type: exception.slotsFrequency as any,
          planning: { monday: exception.slots },
        }
      }

      this.$store.commit(SET_HEADER_TITLE, this.$t('page.exception.title'))

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
    cancel() {
      this.$router.back()
    },
    async submit() {
      const payload: Exception = {
        date: this.dateAndSlots.dateRange as { start: string; end: string },
        openingHours: JSON.parse(JSON.stringify(this.dateAndSlots.slots)),
        slotsFrequency: this.frequency.type as FrequencyAvailableNew,
        slots:
          this.frequency.type === 'CLOSED'
            ? []
            : JSON.parse(
                JSON.stringify(
                  this.capacities.monday as Array<{ start: string; end: string; capacity: number }>,
                ),
              ),
      }

      if (this.hasExceptionsConflict(payload)) {
        this.$store.dispatch('setSnackbar', {
          type: SnackBarType.ERROR,
          message: this.$t('messages.exceptionExists'),
        })
        return
      }

      try {
        if (this.$route.name === ROUTES.carrierCreateExceptions) {
          this.saveExceptions.push(payload as any)
        } else {
          this.saveExceptions[parseInt(this.$route.params.exceptionId, 10)] = payload
        }

        await deliveryService.updateSchedules(this.$route.params.scheduleId, {
          exceptions: this.saveExceptions,
        })

        this.$store.dispatch('setSnackbar', {
          message:
            this.$route.name === ROUTES.carrierEditExceptions
              ? this.$t('messages.exceptionUpdated')
              : this.$t('messages.exceptionCreated'),
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
    hasExceptionsConflict(exception: Exception) {
      return this.saveExceptions.some((excep, index) => {
        if (index === Number(this.$route.params.exceptionId)) {
          return false
        }

        return dateHelper.areIntervalOverlapping(
          {
            start: dateHelper.parseISO(excep.date.start),
            end: dateHelper.parseISO(excep.date.end),
          },
          {
            start: dateHelper.parseISO(exception.date.start),
            end: dateHelper.parseISO(exception.date.end),
          },
        )
      })
    },
    isDateAndSlotsFilled() {
      if (this.showFrequency) {
        return
      }

      this.$nextTick(() => {
        this.showFrequency = !!(
          Object.keys(this.dateAndSlots.dateRange).length === 2 &&
          (this.dateAndSlots.dateRange as { start: string; end: string }).start &&
          (this.dateAndSlots.dateRange as { start: string; end: string }).end &&
          !this.invalids.dateAndSchedule &&
          this.dateAndSlots.slots.length > 0
        )
      })
    },
  },
  watch: {
    capacities: {
      deep: true,
      handler(next: Record<string, DayCapacity[]>) {
        // check if at least one capacity is filled
        let filledCapacity = 0
        for (const [key] of Object.entries(next)) {
          filledCapacity += next[key].filter(capacity => capacity.capacity).length
        }
        this.capacitiesIsFilled = Boolean(filledCapacity)

        // check if all capacity is filled
        this.isCapacitiesNotFilled = Object.entries(next)[0][1].length
          ? Boolean(
              (Object.entries(next)[0][1] as DayCapacity)?.some(capacity => !capacity.capacity),
            )
          : true
      },
    },
    dateAndSlots: {
      deep: true,
      handler() {
        this.isDateAndSlotsFilled()
      },
    },
    'dateAndSlots.slots': {
      deep: true,
      handler(next) {
        this.localOpeningHour = { ...this.localOpeningHour, monday: [...next] }
      },
    },
    frequency: {
      deep: true,
      handler(next, previous) {
        if (!previous.type && this.$route.name === ROUTES.carrierEditExceptions) {
          return
        }
        switch (next.type) {
          case FrequencyAvailableNew.DEMI:
          case FrequencyAvailableNew.HOUR:
          case FrequencyAvailableNew.TWO_HOURS:
          case FrequencyAvailableNew.THREE_HOURS:
          case FrequencyAvailableNew.FOUR_HOURS:
            this.localOpeningHour = {
              ...this.localOpeningHour,
              monday: [...this.dateAndSlots.slots],
            }
            break
          case FrequencyAvailableNew.CLOSED:
            this.capacities = { monday: [] }
            break
        }
      },
    },
  },
})
</script>

<style lang="scss" scoped>
.exceptions-outer-wrapper {
  @media #{map-get($display-breakpoints, 'sm-and-up')} {
    height: calc(100vh - 11rem);
    overflow: auto;
  }

  .exceptions-wrapper {
    @media #{map-get($display-breakpoints, 'sm-and-up')} {
      height: calc(100vh - 11rem);
    }

    @media #{map-get($display-breakpoints, 'xs-only')} {
      max-height: calc(100vh - 5.4rem - 6rem);
      min-height: calc(100vh - 5.4rem - 6rem);
    }

    .component-wrapper {
      margin-bottom: 5.6rem;

      @media #{map-get($display-breakpoints, 'xs-only')} {
        margin-bottom: 15rem;
      }
    }

    .exception-create-actions {
      display: flex;
      justify-content: flex-end;

      @media #{map-get($display-breakpoints, 'md-and-down')} {
        flex-direction: column;
        align-items: flex-end;
      }
    }
  }

  .action-outer-wrapper {
    margin-bottom: 10rem;

    .action-wrapper {
      display: flex;
      justify-content: flex-end;
    }
  }

  .action-outer-wrapper-mobile {
    .action-wrapper {
      padding-right: 0.1rem;
      display: flex;

      .submit-btn {
        margin-left: 0.1rem;
      }
    }

    button {
      min-height: 6rem;
      width: 100%;
    }
  }
}
</style>
