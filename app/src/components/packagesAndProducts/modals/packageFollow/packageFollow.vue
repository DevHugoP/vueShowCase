<template>
  <mp-dialog-confirmation
    v-if="hasLoaded"
    dataId="detailOrder-packagesAndProducts-packageFollowDialog"
    color="primary"
    :header="{
      icon: $vuetify.breakpoint.xsOnly ? '' : 'mdi-map-marker',
      isColorBackground: true,
      iconClose: $vuetify.breakpoint.xsOnly ? 'mdi-arrow-left' : 'mdi-close',
      text: $t('page.detailOrder.packagesAndProducts.follow.title'),
      textPolice: 'h4',
    }"
    classWrapper="package-follow"
    @close="$emit('close')"
    :btnCancel="{
      text: $t('action.close.base'),
      format: $vuetify.breakpoint.xsOnly ? 'sticky' : 'primary',
      stickyColor: $vuetify.breakpoint.xsOnly ? 'yellow' : undefined,
    }"
    :fullscreen="$vuetify.breakpoint.xsOnly"
  >
    <template #content>
      <v-row no-gutters v-if="parcelsSelection.length > 1" class="header-popin">
        <v-col cols="10" offset="1" class="mt-6">
          <div class="chip-outer-wrapper mb-3">
            <mp-chips-wrapper
              dataId="follow-detail-package-chips"
              :chips="parcelsSelection"
              :maxChips="$vuetify.breakpoint.smAndUp ? 5 : parcelsSelection.length"
              v-model="currentChips"
              @input="changeParcel($event)"
            />
          </div>
        </v-col>
      </v-row>
      <v-row no-gutters class="mt-3">
        <v-col cols="10" offset="1" class="content-header">
          <div class="d-flex flex-column">
            <h4 class="medium16">
              {{
                $t([
                  `technical.status.delivery.${selectedParcel.status}.${selectedParcel.subStatus}`,
                  `technical.status.delivery.${selectedParcel.status}.default`,
                  `page.orders.noStatus`,
                ])
              }}
            </h4>
            <span class="mt-5 regular12 main-lighten-52">
              {{ $t('page.detailOrder.packagesAndProducts.follow.packageReference') }}
            </span>
            <span class="regular14 main-lighten-28">
              {{ selectedParcel.packageReference || ' -- ' }}
            </span>
            <span class="regular12 main-lighten-52 mt-2">
              {{ $t('page.detailOrder.packagesAndProducts.follow.followNumber') }}
            </span>
            <span class="regular14 main-lighten-28">
              {{ selectedParcel.externalParcelId }}
            </span>
          </div>
        </v-col>
      </v-row>
      <v-row
        class="mt-3"
        v-if="selectedParcel.ParcelStatus.length"
        :class="`to-scroll${parcels.length > 1 ? ' to-scroll-with-selection' : ''}`"
        no-gutters
      >
        <v-col cols="10" offset="1" class="mt-3 history">
          <div
            v-for="(history, index) in selectedParcel.ParcelStatus"
            :key="`${history.id}-${index}`"
          >
            <div
              :class="`d-flex justify-space-between 
                ${$vuetify.breakpoint.smAndUp ? '' : ' wrap'}`"
            >
              <v-chip
                small
                class="package-chips"
                :data-id="`order-detail-packagesAndProducts-packages-${index}-externalStatus`"
              >
                <span class="externalStatus medium12">
                  {{ history.externalStatus || ' -- ' }}
                </span>
              </v-chip>
              <mp-date-hour
                :class="`${$vuetify.breakpoint.smAndUp ? '' : 'mt-phone'}`"
                :date="dateHelper.format(history.date, 'P')"
                :hour="dateHelper.format(history.date, 'p')"
                dataId="order-detail-packagesAndProducts-packageFollow"
              />
            </div>

            <div class="mt-2">
              <span class="regular14 status">
                {{
                  $t([
                    `technical.status.delivery.${history.status}.${history.subStatus}`,
                    `technical.status.delivery.${
                      history.appointment ? 'DELIVERY_DATE_UPDATED' : history.status
                    }.default`,
                    `page.orders.noStatus`,
                  ])
                }}
              </span>
            </div>
            <span class="main-lighten-52 italic12">
              {{
                history.appointment
                  ? $t('common.dateBetween', {
                    begin: dateHelper.format(history.appointment.start),
                    end: dateHelper.format(history.appointment.end),
                  })
                  : ''
              }}
              {{ history.appointment ? history.comment || '' : history.comment || ' -- ' }}
            </span>
            <v-divider
              v-if="index !== selectedParcel.ParcelStatus.length - 1"
              class="divider mt-3"
            />
          </div>
        </v-col>
      </v-row>
    </template>
  </mp-dialog-confirmation>
</template>

<script lang="ts">
import Vue from 'vue'

import ParcelService from '@/services/parcels/ParcelService'
import { Parcel, ParcelStatus, SelectItem } from '@/types'
import { dateHelper } from '@/helpers/dateHelper'

export default Vue.extend({
  name: 'mp-packages-and-products-package-follow-dialog',
  props: {
    selectedPackageId: {
      type: String,
      required: true,
    },
    deliveryId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      parcels: [] as Parcel[],
      hasLoaded: false,
      dateHelper,
      selectedParcelIndex: 0,
      currentChips: null,
    }
  },
  computed: {
    selectedParcel(): Parcel {
      return this.parcels[this.selectedParcelIndex]
    },
    parcelsSelection(): SelectItem[] {
      return this.parcels.map((p, index) => {
        return {
          value: index,
          text: `${this.$t('common.package')} ${index + 1}`,
          index,
        }
      })
    },
  },
  async mounted() {
    const parcels = await ParcelService.getAll({
      deliveryId: this.deliveryId,
      packageId: this.selectedPackageId,
    })

    this.parcels = parcels

    for (const parcel of this.parcels) {
      const eventsAsStatus = parcel.ParcelEvent.map(parcelEvent => {
        if (
          parcel.ParcelStatus.find(
            parcelStatus =>
              parcelStatus.date === parcelEvent.date &&
              parcelStatus.externalStatus === parcelEvent.event.externalStatus,
          )
        ) {
          return null
        }
        const {
          id,
          parcelId,
          type,
          event: { subStatus, externalStatus, appointment, date, comment },
        } = parcelEvent
        return {
          id,
          parcelId,
          type,
          subStatus,
          externalStatus,
          date,
          comment,
          appointment,
        }
      }).filter(parcelEvent => parcelEvent)

      parcel.ParcelStatus = parcel.ParcelStatus.concat(eventsAsStatus as ParcelStatus[]).sort(
        (parcelA: any, parcelB: any) =>
          new Date(parcelB.date).getTime() - new Date(parcelA.date).getTime(),
      )
    }

    this.hasLoaded = true
  },
  methods: {
    changeParcel(key: { value: number }) {
      this.selectedParcelIndex = key.value
    },
  },
})
</script>

<style lang="scss">
@import '../../../../styles/mixins/macScrollbar';

.package-follow {
  .main-dialog-content {
    overflow-y: auto;
    overflow-x: hidden;

    @include setMacScrollbar('&');

    @media #{map-get($display-breakpoints, 'sm-and-up')} {
      max-height: calc(100vh - 33rem);
    }

    .mp-badge-margin {
      margin-left: -0.3rem;
      justify-content: flex-start;
      display: flex;
    }

    .content-header {
      margin-top: 0.5rem;
      border: 0.1rem solid $main-lighten-74-color;
      border-radius: 0.4rem;
      padding: 1rem !important;
      color: $main-color;
    }

    .header-popin {
      background-color: $main-lighten-80-color;
      width: 100%;
    }

    .align-center {
      justify-content: center;
    }

    .mt-phone {
      @media #{map-get($display-breakpoints, 'xs-only')} {
        margin-top: 0.6rem;
      }
    }

    .wrap {
      flex-direction: column;
    }
    .divider {
      margin-bottom: 1.3rem;
      background-color: $main-lighten-74-color;
    }

    .history {
      color: $main-color;

      .status {
        font-weight: 600 !important;
      }
    }

    .externalStatus {
      color: $white;
    }

    .chips-wrapper {
      position: absolute;
      overflow-x: auto;
      white-space: nowrap;
      margin-left: 0;
      min-width: 100%;
      padding-left: 8.3333%;

      .chip {
        text-transform: capitalize;
        margin-right: 1rem;
        margin-bottom: 1rem;
        border: solid 0.1rem $main-lighten-74-color;
        min-width: fit-content;

        &.chip-active {
          border: solid 0.2rem $main-color;
        }
      }
    }
  }
  @media #{map-get($display-breakpoints, 'sm-and-up')} {
    .v-card__actions {
      margin-top: 1rem;
      border-top: 0.1rem solid $main-lighten-74-color;
    }
  }
  @media #{map-get($display-breakpoints, 'xs-only')} {
    .v-card__text {
      min-height: calc(100vh - 3.25rem - 5rem);
    }
  }
  .info-wrapper {
    display: flex;
    justify-content: space-between;

    @media #{map-get($display-breakpoints, 'xs-only')} {
      flex-direction: column;
    }
  }
  .package-chips {
    background-color: $main-lighten-52-color !important;
    height: 2.6rem;
    width: fit-content;
  }
}
</style>
