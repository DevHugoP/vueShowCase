<template>
  <v-container id="collect-detail" data-id="collect-detail-picking">
    <mp-block
      id="collect-detail-block"
      :title="$vuetify.breakpoint.smAndUp ? $t('page.detailCollect.picking') : ''"
      titleHasPaddingBottom
      :hasBorder="$vuetify.breakpoint.smAndUp"
      :hasMarginBottom="$vuetify.breakpoint.smAndUp"
      :hasEditIcon="editIsAllowed() && $vuetify.breakpoint.smAndUp && hasEditIcon"
      @clickOnIcon="goToSelectSlot()"
    >
      <div>
        <div class="content-wrapper-picking" v-if="collect.start">
          <mp-date-hour :date="getDate" :hour="getHour" dataId="collect-detail-picking-dateHour" />
        </div>
        <div v-else>
          <h2 class="main-lighten-28">-</h2>
        </div>
      </div>

      <div>
        <div class="regular14 mt-6">
          <div class="pb-2 medium16" data-id="collect-detail-picking-pickingTitle">
            {{ exchangePlace.name }}
          </div>
          <div class="address" v-if="exchangePlace.address.postalCode">
            <div
              v-if="exchangePlace.address.addressLine1"
              data-id="collect-detail-picking-addressLine1"
            >
              {{ exchangePlace.address.addressLine1 }}
            </div>
            <div
              v-if="exchangePlace.address.addressLine2"
              data-id="collect-detail-picking-addressLine2"
            >
              {{ exchangePlace.address.addressLine2 }}
            </div>
            <div data-id="collect-detail-picking-postalCodeAndCityAndCountry">
              {{
                `${exchangePlace.address.postalCode} ${exchangePlace.address.city} (${exchangePlace.address.country})`
              }}
            </div>
            <div v-if="exchangePlace.address.comment" data-id="collect-detail-picking-comment">
              {{ exchangePlace.address.comment }}
            </div>
          </div>
        </div>

        <div class="d-flex justify-center mt-5" v-if="editIsAllowed() && $vuetify.breakpoint.xsOnly">
          <mp-button
            dataId="edit"
            icon="pencil"
            :text="$t('action.modify.base')"
            format="primary"
            @click="goToSelectSlot()"
          />
        </div>
      </div>
    </mp-block>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'

import { mapGetters } from 'vuex'
import mpBlock from '@/components/block/block.vue'
import { dateHelper, dateHelperGetTimezonedDate } from '@/helpers/dateHelper'
import CollectService from '@/services/collect/CollectService'

import { Collect, COLLECT_STATUS, ExchangePlaceEntity, Mode } from '@/types'

const EDIT_TYPE_FORBIDDEN = [Mode.EXPRESS]

export default Vue.extend({
  name: 'mp-picking',
  components: {
    mpBlock,
  },
  props: {
    collect: {
      type: Object as () => Collect,
      required: true,
    },
    exchangePlace: {
      type: Object as () => ExchangePlaceEntity,
      required: true,
    },
    hasEditIcon: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    ...mapGetters({
      currentUser: 'auth/currentUser',
    }),
    getDate(): string {
      return dateHelper.formatToTimezone(
        dateHelperGetTimezonedDate(this.collect.start!),
        'UTC',
        'P',
      )
    },
    getHour(): string {
      const start = dateHelperGetTimezonedDate(this.collect.start!)
      const end = dateHelperGetTimezonedDate(this.collect.end!)

      return `${dateHelper.formatToTimezone(start, 'UTC', 'p')} - ${dateHelper.formatToTimezone(
        end,
        'UTC',
        'p',
      )}`
    },
  },
  methods: {
    editIsAllowed() {
      const { collect } = this
      return (
        !EDIT_TYPE_FORBIDDEN.includes(collect.mode) && collect.status !== COLLECT_STATUS.PICK_UP_OK
      )
    },
    async goToSelectSlot() {
      const collectSlot = await CollectService.generateInternalCollectSlot(
        this.collect.id,
        this.currentUser.language,
      )
      window.open(collectSlot)
    },
  },
})
</script>

<style lang="scss">
#collect-detail {
  padding: 0;

  @media #{map-get($display-breakpoints, 'xs-only')} {
    border-top: solid 0.1rem $main-lighten-74-color;
  }

  .min-height {
    height: 6rem;
  }

  .itinerary-wrapper {
    display: flex;
    align-items: flex-start;

    .postalCodeAndCityAndCountry-public {
      .v-icon {
        color: $main-lighten-52-color;
      }
      color: $main-lighten-52-color;
      margin-top: 0.5em;
      font-size: 1.4rem !important;
    }

    .icon-container {
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;

      .border {
        height: 100%;
        width: 0.2rem;
        background-color: $main-lighten-65-color;
      }
      .icon-wrapper {
        height: 3rem;
        width: 3rem;
        min-height: 3rem;
        background-color: $main-color;
        border-radius: 1.5rem;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        flex-direction: column;

        &.icon-wrapper-picking {
          .icon-picking {
            border: solid 0.2rem $white;
            width: 1.6rem;
            height: 1.6rem;
            border-radius: 100%;
          }
          &:after {
            margin-top: -0.1rem;
            width: 0.2rem;
            height: 0.8rem;
            content: '';
            bottom: 0;
            background: $white;
            left: 50%;
          }
        }

        &.icon-wrapper-delivery {
          justify-content: end;
          .icon-delivery {
            border: solid 0.2rem $white;
            width: 1.6rem;
            height: 1.6rem;
            border-radius: 100%;
          }
          &:before {
            margin-top: -0.1rem;
            width: 0.2rem;
            height: 0.8rem;
            content: '';
            bottom: 0;
            background: $white;
            left: 50%;
          }
        }

        .icon {
          color: $white;
        }
      }
    }
    .content-wrapper-picking {
      margin-left: 1.7rem;

      .text {
        margin-top: 1.5rem;
        margin-bottom: 4.5rem;

        &.text-delivery {
          margin-bottom: 1rem;
        }

        .contact {
          margin-top: 2.5rem;
        }

        .info {
          margin-top: 2.4rem;
        }

        .action {
          i {
            margin-right: 1rem;
          }
        }
      }
    }
  }
}
</style>
