<template>
  <div class="typical-week-new-outer-wrapper">
    <div v-if="hasLoaded" class="typical-week-new-wrapper">
      <content-header v-if="$vuetify.breakpoint.smAndUp" dataId="typical-week-new">
        <template #breadcrumb>
          <mp-breadcrumb />
        </template>
        <template #title>
          <h1 data-id="typical-week-new-title">{{ $t('page.typicalWeek.title') }}</h1>
        </template>

        <template #actions-button>
          <div class="typical-week-new-actions">
            <mp-button
              :text="$t('action.cancel.base')"
              format="link"
              linkColor="black"
              dataId="typicalWeekNew-cancel"
              @click="cancel()"
            />
            <mp-button
              :text="$t('action.save')"
              format="success"
              icon="content-save-outline"
              dataId="typicalWeekNew-save"
              @click="submit()"
            />
          </div>
        </template>
      </content-header>

      <v-row no-gutters class="component-wrapper" v-if="displayCapacity">
        <v-col cols="4" offset="1">
          <mp-select
            :label="`${$t('page.typicalWeek.type.label')} *`"
            v-model="type"
            :items="getType"
            required
            dataId="typical-week-type"
          />
        </v-col>
        <v-col cols="10" offset="1">
          <mp-frequency-new
            v-model="frequency"
            :frequencyAvailable="frequencyAvailable"
            :hasWarning="capacitiesIsFilled"
          />
          <mp-capacity-new
            v-model="capacities"
            :frequency="frequency"
            :workingSchedule="workingSchedule"
            :editCapacities="editCapacities"
            :hasWarning="capacitiesIsFilled"
            :typicalTimezone="timezone"
            class="mt-14"
            @customChange="getDayWorkingRange($event)"
            @getTimezone="getTimezone($event)"
          />
        </v-col>
      </v-row>
    </div>

    <v-row
      no-gutters
      :class="
        `${$vuetify.breakpoint.xsOnly ? 'action-outer-wrapper-mobile' : 'action-outer-wrapper'}`
      "
    >
      <v-col
        :cols="$vuetify.breakpoint.xsOnly ? '6' : '10'"
        :offset="$vuetify.breakpoint.xsOnly ? '0' : '1'"
        class="action-wrapper"
      >
        <mp-button
          dataId="typicalWeek-cancel"
          :icon="$vuetify.breakpoint.xsOnly ? 'arrow-left' : null"
          :text="$vuetify.breakpoint.xsOnly ? null : $t('action.cancel.base')"
          :format="$vuetify.breakpoint.xsOnly ? 'sticky' : 'link'"
          :linkColor="$vuetify.breakpoint.xsOnly ? null : 'black'"
          :stickyColor="$vuetify.breakpoint.xsOnly ? 'yellow' : null"
          @click.stop="cancel()"
        />

        <mp-button
          class="submit-btn"
          dataId="typicalWeek-submit"
          :text="$t('action.save')"
          :format="$vuetify.breakpoint.xsOnly ? 'sticky' : 'success'"
          :stickyColor="$vuetify.breakpoint.xsOnly ? 'yellow' : null"
          :icon="$vuetify.breakpoint.xsOnly ? null : 'content-save-outline'"
          @click="submit()"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import contentHeader from '@/components/contentHeader/contentHeader.vue'
import mpBreadcrumb from '@/components/breadcrumb/breadcrumb.vue'
import mpFrequencyNew from '@/views/Carrier/TypicalWeek/Frequency/frequency.vue'
import mpCapacityNew from '@/views/Carrier/TypicalWeek/Capacity/capacity.vue'
import deliveryService from '@/services/delivery/DeliveryService'
import { ROUTES } from '@/constants'
import { SET_BREADCRUMBS_LABEL, SET_HEADER_TITLE } from '@/store/mutation-types'

import CarrierService from '@/services/carrier/CarrierService'
import RetailerService from '@/services/retailer/RetailerService'
import StoreService from '@/services/store/StoreService'
import ExchangePlaceService from '@/services/exchangePlace/ExchangePlaceService'

import { SnackBarType } from '@/store/types'
import {
  DayCapacityNew,
  FrequencyAvailableNew,
  WorkingSchedule,
  TypicalWeekFrequencyNew,
  SchedulesConfigType,
} from '@/types'

export default Vue.extend({
  name: 'mp-carrier-typical-week',
  components: {
    contentHeader,
    mpBreadcrumb,
    mpFrequencyNew,
    mpCapacityNew,
  },
  data: () => ({
    timezone: '',
    hasLoaded: true,
    capacitiesIsFilled: false,
    capacities: {} as Record<string, DayCapacityNew[]>,
    frequency: { type: '', planning: {} as TypicalWeekFrequencyNew },
    workingSchedule: {} as WorkingSchedule | undefined | null,
    deliverySchedules: {} as Record<string, any>,
    editCapacities: {} as Record<string, DayCapacityNew[]>,
    type: SchedulesConfigType.ORDERS_QUANTITY,
  }),
  computed: {
    frequencyAvailable() {
      return Object.values(FrequencyAvailableNew).filter(
        frequency => frequency !== FrequencyAvailableNew.CLOSED,
      )
    },
    displayCapacity() {
      return (
        this.$route.name === ROUTES.createCarrierTypicalWeek ||
        Object.keys(this.workingSchedule || {}).length
      )
    },
    getType() {
      return Object.entries(SchedulesConfigType).map(([value]) => ({
        value,
        text: this.$t(`page.typicalWeek.type.${value}`),
      }))
    },
  },
  async mounted() {
    const params = {
      retailerId: this.$route.params.retailerId,
      exchangePlaceId: this.$route.params.exchangePlaceId,
      carrierId: this.$route.params.carrierId,
      scheduleId: this.$route.params.scheduleId,
      storeId: this.$route.params.storeId,
    }

    try {
      const [[retailer], [store], [carrier], [exchangePlace]] = await Promise.all([
        RetailerService.getFilters({
          id: this.$route.params.retailerId,
          forRule: 'LIST_RETAILERS',
        }),
        StoreService.getFilters({
          id: this.$route.params.storeId,
          forRule: 'LIST_RETAILERS',
        }),
        CarrierService.getFilters({
          ids: this.$route.params.carrierId,
          forRule: 'LIST_RETAILERS',
        }),
        ExchangePlaceService.getFilters({
          id: this.$route.params.exchangePlaceId,
          forRule: 'LIST_RETAILERS',
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
    } finally {
      this.hasLoaded = true
    }

    if (this.$route.name === ROUTES.editCarrierTypicalWeek) {
      this.deliverySchedules = await deliveryService.getScheduleById(this.$route.params.scheduleId)
      this.workingSchedule = this.deliverySchedules.scheduleConfig.workingSchedule
      this.editCapacities = this.deliverySchedules.scheduleConfig.schedule.slots
      this.capacities = this.deliverySchedules.scheduleConfig.schedule.slots
      this.frequency.type = this.deliverySchedules.scheduleConfig.schedule.slotsFrequency
      this.timezone = this.deliverySchedules.scheduleConfig.timezone
      this.type = this.deliverySchedules.scheduleConfig.type
    } else {
      this.deliverySchedules = await deliveryService.getSchedules(params)
      if (this.deliverySchedules.scheduleConfigs.length) {
        this.workingSchedule = this.deliverySchedules.scheduleConfigs[0].workingSchedule
      }
    }
  },
  methods: {
    getTimezone(event: string) {
      this.timezone = event
    },
    getDayWorkingRange(dayWorkingRange: any) {
      this.workingSchedule = dayWorkingRange
    },
    cancel() {
      this.$router.back()
    },

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
      try {
        if (this.$route.name === ROUTES.editCarrierTypicalWeek) {
          if (this.frequency.type) {
            if (Object.values(this.capacities).some(day => day.some(({ capacity }) => capacity))) {
              await deliveryService.updateSchedules(this.$route.params.scheduleId, {
                schedule: {
                  slotsFrequency: this.frequency.type,
                  slots: this.capacities,
                },
                workingSchedule: this.workingSchedule,
                timezone: this.timezone,
                type: this.type,
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
        } else if (this.frequency.type) {
          if (Object.values(this.capacities).some(day => day.some(({ capacity }) => capacity))) {
            await deliveryService.createSchedules({
              ...params,
              schedule: {
                slotsFrequency: this.frequency.type,
                slots: this.capacities,
              },
              workingSchedule: this.workingSchedule,
              timezone: this.timezone,
              type: this.type,
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
  },
  watch: {
    capacities: {
      handler(next: Record<string, DayCapacityNew[]>) {
        let filledCapacity = 0
        for (const [key] of Object.entries(next)) {
          filledCapacity += next[key].filter(capacity => capacity.capacity).length
        }
        this.capacitiesIsFilled = Boolean(filledCapacity)
      },
      deep: true,
    },
  },
})
</script>

<style lang="scss" scoped>
.typical-week-new-outer-wrapper {
  @media #{map-get($display-breakpoints, 'sm-and-up')} {
    height: calc(100vh - 11rem);
    overflow: hidden;
  }
  .typical-week-new-wrapper {
    overflow-y: auto;

    @media #{map-get($display-breakpoints, 'sm-and-up')} {
      height: calc(100vh - 11rem);
      overflow: auto;
    }

    @media #{map-get($display-breakpoints, 'xs-only')} {
      max-height: calc(100vh - 5.4rem - 6rem);
    }

    .component-wrapper {
      margin-bottom: 5.6rem;

      @media #{map-get($display-breakpoints, 'xs-only')} {
        margin-bottom: 15rem;
      }
    }

    .typical-week-new-actions {
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
