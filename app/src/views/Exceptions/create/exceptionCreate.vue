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
          <div class="exception-edit-actions">
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
              :disabled="!capacitiesIsFilled && invalids.dateAndSchedule"
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

          <mp-frequency
            v-if="showFrequency"
            v-model="frequency"
            :hasWarning="capacitiesIsFilled"
            :showDays="false"
            :timezone="timezone"
            :showTimezonedDate="false"
          />

          <mp-capacity
            v-if="showCapacity"
            v-model="capacities"
            :frequency="frequency"
            :openingHours="localOpeningHour"
            :showDays="false"
            :showDuplicate="false"
            :showTimezonedDate="false"
            class="mt-14"
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
          dataId="exceptions-cancel"
          :icon="$vuetify.breakpoint.xsOnly ? 'arrow-left' : null"
          :text="$vuetify.breakpoint.xsOnly ? null : $t('action.cancel.base')"
          :format="$vuetify.breakpoint.xsOnly ? 'sticky' : 'link'"
          :linkColor="$vuetify.breakpoint.xsOnly ? null : 'black'"
          :stickyColor="$vuetify.breakpoint.xsOnly ? 'yellow' : null"
          @click.stop="cancel()"
        />

        <mp-button
          class="submit-btn"
          dataId="exceptions-submit"
          :text="$t('action.save')"
          :format="$vuetify.breakpoint.xsOnly ? 'sticky' : 'success'"
          :stickyColor="$vuetify.breakpoint.xsOnly ? 'yellow' : null"
          :icon="$vuetify.breakpoint.xsOnly ? null : 'content-save-outline'"
          :disabled="!capacitiesIsFilled && invalids.dateAndSchedule"
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
import mpExceptionDateAndSchedule from '@/views/Exceptions/create/dateAndSchedule/dateAndSchedule.vue'
import mpFrequency from '@/views/TypicalWeek/frequency/frequency.vue'
import mpCapacity from '@/views/TypicalWeek/capacity/capacity.vue'

import {
  DateInterval,
  DayCapacity,
  ExchangePlaceEntity,
  FrequencyAvailable,
  OpeningHours,
  TypicalWeekFrequency,
} from '@/types'

import ExchangePlaceService from '@/services/exchangePlace/ExchangePlaceService'
import StoreService from '@/services/store/StoreService'
import RetailerService from '@/services/retailer/RetailerService'

import { SET_BREADCRUMBS_LABEL, SET_HEADER_TITLE } from '@/store/mutation-types'
import { ROUTES } from '@/constants'
import { SnackBarType } from '@/store/types'
import {
  dateHelper,
  dateHelperGetTimezonedDate,
  dateHelperGetUtcDate,
  dateHelperGetUTCHours,
  dateHelperGetUTCMinutes,
  dateHelperSetUtcTime,
} from '@/helpers/dateHelper'
import { Exception } from '@/views/ExchangePlace/detail/exceptions/exceptions.vue'

export interface ExceptionDateAndSlots {
  dateRange: { start: string; end: string } | ''
  slots: DateInterval[]
}

export default Vue.extend({
  name: 'mp-exception-create',
  components: {
    contentHeader,
    mpBreadcrumb,
    mpExceptionDateAndSchedule,
    mpFrequency,
    mpCapacity,
  },
  data: () => ({
    hasLoaded: false,
    dateAndSlots: { dateRange: '', slots: [{ start: '', end: '' }] } as ExceptionDateAndSlots,
    frequency: { type: '', planning: {} } as TypicalWeekFrequency,
    capacities: {} as Record<string, DayCapacity[]>,
    capacitiesIsFilled: false,
    showFrequency: false,
    invalids: {
      dateAndSchedule: false,
    },
    localOpeningHour: { monday: [] } as OpeningHours,
    saveExceptions: [] as Exception[],
    timezone: '',
  }),
  computed: {
    showCapacity() {
      return this.showFrequency && this.frequency.type !== FrequencyAvailable.CLOSED
    },
  },
  async mounted() {
    try {
      const exchangePlace: ExchangePlaceEntity = await ExchangePlaceService.get(
        parseInt(this.$route.params.exchangePlaceId as string, 10),
      )

      this.timezone = exchangePlace.timezone

      if (exchangePlace.exceptions) {
        this.saveExceptions = exchangePlace.exceptions
      }

      if (this.$route.name === ROUTES.editExceptions) {
        const exception: Exception = exchangePlace.exceptions![
          parseInt(this.$route.params.exceptionId, 10)
        ]

        if (exception.slots) {
          exception.slots = exception.slots.map(slot => {
            slot.start = dateHelper.formatToTimezone(
              dateHelperGetTimezonedDate(
                dateHelperSetUtcTime(new Date(), {
                  hours: parseInt(slot.start.split(':')[0], 10),
                  minutes: parseInt(slot.start.split(':')[1], 10),
                  seconds: 0,
                  milliseconds: 0,
                }),
                this.timezone,
              ),
              'UTC',
              'p',
            )

            slot.end = dateHelper.formatToTimezone(
              dateHelperGetTimezonedDate(
                dateHelperSetUtcTime(new Date(), {
                  hours: parseInt(slot.end.split(':')[0], 10),
                  minutes: parseInt(slot.end.split(':')[1], 10),
                  seconds: 0,
                  milliseconds: 0,
                }),
                this.timezone,
              ),
              'UTC',
              'p',
            )

            if (slot.capacity === 0) {
              return { ...slot, capacity: null }
            }
            return slot
          })
        }

        exception.openingHours = exception.openingHours.map(openingHour => {
          const start = dateHelper.formatToTimezone(
            dateHelperGetTimezonedDate(
              dateHelperSetUtcTime(new Date(), {
                hours: parseInt(openingHour.start.split(':')[0], 10),
                minutes: parseInt(openingHour.start.split(':')[1], 10),
                seconds: 0,
                milliseconds: 0,
              }),
              this.timezone,
            ),
            'UTC',
            'p',
          )

          const end = dateHelper.formatToTimezone(
            dateHelperGetTimezonedDate(
              dateHelperSetUtcTime(new Date(), {
                hours: parseInt(openingHour.end.split(':')[0], 10),
                minutes: parseInt(openingHour.end.split(':')[1], 10),
                seconds: 0,
                milliseconds: 0,
              }),
              this.timezone,
            ),
            'UTC',
            'p',
          )

          return {
            start,
            end,
          }
        })

        this.dateAndSlots = { dateRange: exception.date, slots: exception.openingHours }
        // component mp-capacity await a list of days, set monday but not displayed in the vue
        this.capacities = { monday: exception.slots }
        this.frequency = { type: exception.slotsFrequency, planning: { monday: exception.slots } }
      }

      if (!exchangePlace.Store) {
        exchangePlace.Store = await StoreService.get(parseInt(this.$route.params.storeId, 10), {
          retailerId: parseInt(this.$route.params.id, 10),
        })

        if (!exchangePlace.Store.Retailer) {
          exchangePlace.Store.Retailer = await RetailerService.get(
            parseInt(this.$route.params.id, 10),
          )
        }
      }

      this.$store.commit(SET_HEADER_TITLE, this.$t('page.exception.title'))

      // data for breadcrumb
      const breadcrumbsLabel = {
        retailers: exchangePlace.Store.Retailer!.name,
        stores: exchangePlace.Store.name,
        exchangePlaces: exchangePlace.name,
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
      const params: any = {
        id: this.$route.params.id,
        storeId: this.$route.params.storeId,
        exchangePlaceId: this.$route.params.exchangePlaceId,
      }

      if (this.$route.name === ROUTES.editExceptions) {
        params.exceptionId = this.$route.params.exceptionId
      }

      this.$router.push({
        name:
          this.$route.name === ROUTES.editExceptions
            ? ROUTES.detailExceptions
            : ROUTES.exchangePlace,
        params,
      })
    },
    async submit() {
      const payload: Exception = {
        date: this.dateAndSlots.dateRange as { start: string; end: string },
        openingHours: JSON.parse(JSON.stringify(this.dateAndSlots.slots)),
        slotsFrequency: this.frequency.type as FrequencyAvailable,
        slots:
          this.frequency.type === 'CLOSED'
            ? []
            : JSON.parse(
                JSON.stringify(
                  this.capacities.monday as Array<{ start: string; end: string; capacity: number }>,
                ),
              ),
      }

      if (payload.slots) {
        payload.slots = payload.slots.map(slot => {
          const start = dateHelperGetUtcDate(
            dateHelperSetUtcTime(new Date(), {
              hours: parseInt(slot.start.split(':')[0], 10),
              minutes: parseInt(slot.start.split(':')[1], 10),
              seconds: 0,
              milliseconds: 0,
            }).toISOString(),
            this.timezone,
          )

          const end = dateHelperGetUtcDate(
            dateHelperSetUtcTime(new Date(), {
              hours: parseInt(slot.end.split(':')[0], 10),
              minutes: parseInt(slot.end.split(':')[1], 10),
              seconds: 0,
              milliseconds: 0,
            }).toISOString(),
            this.timezone,
          )

          slot.start = `${dateHelperGetUTCHours(start)}:${dateHelperGetUTCMinutes(start)}`
          slot.end = `${dateHelperGetUTCHours(end)}:${dateHelperGetUTCMinutes(end)}`

          if (slot.capacity === null) {
            return { ...slot, capacity: 0 }
          }
          return slot
        })
      }

      payload.openingHours = payload.openingHours.map(openingHour => {
        const slipStartDate = dateHelperGetUtcDate(
          dateHelperSetUtcTime(new Date(), {
            hours: parseInt(openingHour.start.split(':')[0], 10),
            minutes: parseInt(openingHour.start.split(':')[1], 10),
            seconds: 0,
            milliseconds: 0,
          }).toISOString(),
          this.timezone,
        )

        const slipEndDate = dateHelperGetUtcDate(
          dateHelperSetUtcTime(new Date(), {
            hours: parseInt(openingHour.end.split(':')[0], 10),
            minutes: parseInt(openingHour.end.split(':')[1], 10),
            seconds: 0,
            milliseconds: 0,
          }).toISOString(),
          this.timezone,
        )

        return {
          start: `${dateHelperGetUTCHours(slipStartDate)}:${dateHelperGetUTCMinutes(
            slipStartDate,
          )}`,
          end: `${dateHelperGetUTCHours(slipEndDate)}:${dateHelperGetUTCMinutes(slipEndDate)}`,
        }
      })

      if (this.hasExceptionsConflict(payload)) {
        this.$store.dispatch('setSnackbar', {
          type: SnackBarType.ERROR,
          message: this.$t('messages.exceptionExists'),
        })
        return
      }

      try {
        if (this.$route.name === ROUTES.createExceptions) {
          this.saveExceptions.push(payload as any)
        } else {
          this.saveExceptions[parseInt(this.$route.params.exceptionId, 10)] = payload
        }

        await ExchangePlaceService.updateExceptions(
          this.$route.params.exchangePlaceId,
          this.saveExceptions,
        )

        this.$store.dispatch('setSnackbar', {
          message:
            this.$route.name === ROUTES.editExceptions
              ? this.$t('messages.exceptionUpdated')
              : this.$t('messages.exceptionCreated'),
          type: SnackBarType.SUCCESS,
        })

        this.$router.push({
          name: ROUTES.exchangePlace,
          params: {
            id: this.$route.params.id,
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
        if (!previous.type && this.$route.name === ROUTES.editExceptions) {
          return
        }

        switch (next.type) {
          case FrequencyAvailable.QUARTER:
          case FrequencyAvailable.DEMI:
          case FrequencyAvailable.HOUR:
            this.localOpeningHour = {
              ...this.localOpeningHour,
              monday: [...this.dateAndSlots.slots],
            }
            break
          case FrequencyAvailable.CLOSED:
            this.capacities = { monday: [] }
            break
          case FrequencyAvailable.CUSTOM:
            this.localOpeningHour = {
              ...this.localOpeningHour,
              monday: [...(next.planning.monday as DateInterval[])],
            }
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
    overflow: hidden;
  }

  .exceptions-wrapper {
    overflow-y: auto;

    @media #{map-get($display-breakpoints, 'sm-and-up')} {
      height: calc(100vh - 11rem);
      overflow: auto;
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

    .exception-edit-actions {
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
