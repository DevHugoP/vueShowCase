<template>
  <div class="typical-week-outer-wrapper">
    <div v-if="hasLoaded" class="typical-week-wrapper">
      <content-header v-if="$vuetify.breakpoint.smAndUp" dataId="typical-week">
        <template #breadcrumb>
          <mp-breadcrumb />
        </template>
        <template #title>
          <h1 data-id="typical-week-title">{{ $t('page.typicalWeek.title') }}</h1>
        </template>
        <template #actions-button>
          <div class="typical-week-actions">
            <mp-button
              :text="$t('action.cancel.base')"
              format="link"
              linkColor="black"
              dataId="typicalWeek-cancel"
              @click="cancel()"
            />

            <mp-button
              :text="$t('action.save')"
              format="success"
              icon="content-save-outline"
              dataId="typicalWeek-save"
              @click="submit()"
            />
          </div>
        </template>
      </content-header>

      <v-row no-gutters class="component-wrapper">
        <v-col cols="10" offset="1">
          <mp-frequency
            v-model="frequency"
            :hasWarning="capacitiesIsFilled"
            :timezone="timezone"
            :frequencyAvailable="frequencyAvailable"
          />

          <mp-capacity
            v-model="capacities"
            :frequency="frequency"
            :openingHours="openingHours"
            :timezone="timezone"
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

    <mp-updated-slots-modal :dataId="`exchangeplace-updated-slots-modal`" :timezone="timezone" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import contentHeader from '@/components/contentHeader/contentHeader.vue'
import mpBreadcrumb from '@/components/breadcrumb/breadcrumb.vue'
import mpFrequency from '@/views/TypicalWeek/frequency/frequency.vue'
import mpCapacity from '@/views/TypicalWeek/capacity/capacity.vue'
import mpUpdatedSlotsModal from '@/views/TypicalWeek/updatedSlotsModal/updatedSlotsModal.vue'

import ExchangePlaceService from '@/services/exchangePlace/ExchangePlaceService'

import { ROUTES } from '@/constants'

import { SET_BREADCRUMBS_LABEL, SET_HEADER_TITLE } from '@/store/mutation-types'
import StoreService from '@/services/store/StoreService'
import RetailerService from '@/services/retailer/RetailerService'
import { DayCapacity, ExchangePlaceEntity, FrequencyAvailable, OpeningHours } from '@/types'
import { SnackBarType } from '@/store/types'

export default Vue.extend({
  name: 'mp-typical-week',
  components: {
    contentHeader,
    mpBreadcrumb,
    mpFrequency,
    mpCapacity,
    mpUpdatedSlotsModal,
  },
  data: () => ({
    hasLoaded: false,
    frequency: { type: '', planning: {} as OpeningHours },
    capacities: {} as Record<string, DayCapacity[]>,
    openingHours: null as OpeningHours | null,
    capacitiesIsFilled: false,
    timezone: '',
  }),
  computed: {
    frequencyAvailable() {
      return Object.values(FrequencyAvailable).filter(
        frequency => frequency !== FrequencyAvailable.CLOSED,
      )
    },
  },
  async mounted() {
    try {
      const exchangePlace: ExchangePlaceEntity = await ExchangePlaceService.get(
        parseInt(this.$route.params.exchangePlaceId as string, 10),
      )

      this.timezone = exchangePlace.timezone

      this.frequency = {
        type: exchangePlace.schedule?.slotsFrequency || '',
        planning:
          exchangePlace.schedule &&
          exchangePlace.schedule.slotsFrequency === FrequencyAvailable.CUSTOM
            ? exchangePlace.schedule.slots
            : {},
      }

      for (const day in exchangePlace.schedule?.slots) {
        if (exchangePlace.schedule?.slots[day]) {
          exchangePlace.schedule.slots[day] = exchangePlace.schedule?.slots[day].map(capacity => {
            if (capacity.capacity === 0) {
              return { ...capacity, capacity: null }
            }
            return capacity
          })
        }
      }
      this.capacities = exchangePlace.schedule?.slots || {}

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

      this.openingHours = exchangePlace.openingHours

      this.$store.commit(SET_HEADER_TITLE, this.$t('page.typicalWeek.title'))

      // data for breadcrumb
      const breadcrumbsLabel = {
        retailers: exchangePlace.Store.Retailer?.name,
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
      this.$router.push({
        name: ROUTES.exchangePlace,
        params: {
          id: this.$route.params.id,
          storeId: this.$route.params.storeId,
          exchangePlaceId: this.$route.params.exchangePlaceId,
        },
      })
    },
    async submit() {
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
        await ExchangePlaceService.updateSchedules(this.$route.params.exchangePlaceId, {
          slotsFrequency: this.frequency.type,
          slots: this.capacities,
        })

        this.$store.dispatch('setSnackbar', {
          message:
            this.$route.name === ROUTES.editTypicalWeek
              ? this.$t('messages.typicalWeekUpdated')
              : this.$t('messages.typicalWeekCreated'),
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
  },
  watch: {
    capacities: {
      deep: true,
      handler(next: Record<string, DayCapacity[]>) {
        let filledCapacity = 0

        for (const [key] of Object.entries(next)) {
          filledCapacity += next[key].filter(capacity => capacity.capacity).length
        }

        this.capacitiesIsFilled = Boolean(filledCapacity)
      },
    },
    'frequency.planning'(next) {
      if (Object.keys(next).length) {
        this.openingHours = { ...next }
      }
    },
    async 'frequency.type'(next, previous) {
      if (!previous && this.$route.name === ROUTES.editTypicalWeek) {
        return
      }

      if (previous === FrequencyAvailable.CUSTOM && next !== FrequencyAvailable.CUSTOM) {
        try {
          const { openingHours } = await ExchangePlaceService.get(
            parseInt(this.$route.params.exchangePlaceId as string, 10),
          )

          this.openingHours = openingHours
        } catch (e) {
          if (e.response?.status === 403) {
            return this.$router.push({ name: ROUTES.noAccess })
          }
        }
      }
    },
  },
})
</script>

<style lang="scss" scoped>
.typical-week-outer-wrapper {
  @media #{map-get($display-breakpoints, 'sm-and-up')} {
    height: calc(100vh - 11rem);
    overflow: hidden;
  }
  .typical-week-wrapper {
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

    .typical-week-actions {
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
