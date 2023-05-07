<template>
  <div id="carrier-typical-week-component">
    <mp-block
      id="carrier-typical-week-block"
      :hasBorder="$vuetify.breakpoint.smAndUp"
      :hasMarginBottom="$vuetify.breakpoint.smAndUp"
      titleHasPaddingBottom
    >
      <div>
        <div class="top-block-wrapper">
          <h2 v-if="$vuetify.breakpoint.smAndUp">
            {{ $t('page.exchangePlace.typicalWeek.title') }}
          </h2>

          <v-menu
            bottom
            offset-y
            left
            origin="center top"
            transition="scale-transition"
            v-if="
              schedule.slotsFrequency &&
                isAuthorized('WRITE_CARRIER_SCHEDULES') &&
                $vuetify.breakpoint.smAndUp
            "
          >
            <template v-slot:activator="{ on, attrs }">
              <v-icon v-bind="attrs" v-on="on" data-id="commitments-actions">
                mdi-dots-vertical
              </v-icon>
            </template>
            <v-list>
              <v-list-item v-if="isAuthorized('WRITE_CARRIER_SCHEDULES')" @click="getTypicalWeekRoute('edit')">
                <v-list-item-icon>
                  <v-icon v-text="'mdi-pencil'" />
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title v-text="$t('action.modify.base')" />
                </v-list-item-content>
              </v-list-item>

              <v-list-item @click="showDeleteDialog = true">
                <v-list-item-icon>
                  <v-icon v-text="'mdi-trash-can-outline'" />
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title v-text="$t('action.delete.base')" />
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>

        <div class="d-flex mt-2 mb-6" v-if="scheduleConfigs && scheduleConfigs.type">
          <span class="regular14 main-lighten-52">
            {{
              `${$t('page.typicalWeek.detailType.unit')} : ${$t(
                `page.typicalWeek.detailType.${scheduleConfigs.type}`,
              )}`
            }}
          </span>
        </div>

        <div v-if="schedule.slotsFrequency">
          <mp-chips-wrapper
            class="mt-3 chips-wrapper"
            dataId="exchange-place-detail-typical-week-days"
            :chips="dayOfTheWeek"
            :maxChips="dayOfTheWeek.length"
            v-model="selectedChips"
            @input="selectedDay = $event.value"
          />
          <div class="capacity-wrapper carrier-typical-scroll">
            <div
              :class="`capacity${capacity.capacity ? '' : ' empty'}`"
              v-for="(capacity, index) in schedule.slots[selectedDay]"
              :key="`schedule-${selectedDay}-${index}`"
            >
              <span class="regular16">
                {{ `${capacity.start} - ${capacity.end}` }}
              </span>
              <div class="capacity-value">
                <span class="medium12">
                  {{ capacity.capacity }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div v-if="!schedule.slotsFrequency">
          <no-data
            :content="$t('page.exchangePlace.typicalWeek.empty')"
            dataId="typical-week-noData"
          />

          <v-row no-gutters class="action-outer-wrapper mt-5" v-if="$vuetify.breakpoint.smAndUp && isAuthorized('WRITE_CARRIER_SCHEDULES')">
            <v-col cols="12" class="d-flex justify-center">
              <mp-button
                icon="pencil"
                iconSize="1.8rem"
                :text="$t('action.create.base')"
                dataId="typical-week-add-btn"
                @click="getTypicalWeekRoute('create')"
              />
            </v-col>
          </v-row>
        </div>
      </div>
    </mp-block>

    <mp-dialog-confirmation
      v-if="showDeleteDialog"
      classWrapper="carrier-detail-parameter-typical-week-delete"
      dataId="delete-typical-week"
      color="error"
      :header="{
        iconClose: 'mdi-close',
        icon: 'mdi-exclamation-thick',
        isColorBackground: false,
      }"
      :textContent="$t('page.typicalWeek.delete')"
      :btnCancel="{ text: $t('action.cancel.base'), format: 'link', linkColor: 'red' }"
      :btnValidation="{
        text: $t('action.delete.base'),
        format: 'error',
      }"
      btnToColumn
      @close="showDeleteDialog = false"
      @submit="
        deleteTypicalWeek()
        showDeleteDialog = false
      "
    />
  </div>
</template>

<script lang="ts">
import mixins from 'vue-typed-mixins'

import noData from '@/components/noData/noData.vue'
import mpBlock from '@/components/block/block.vue'
import { ROUTES } from '@/constants'

import { authorizationMixin } from '@/mixins'

import { Week, Schedule, SchedulesConfigRecord, WorkingSchedule } from '@/types'
import DeliveryService from '@/services/delivery/DeliveryService'
import { SnackBarType } from '@/store/types'

export default mixins(authorizationMixin).extend({
  name: 'mp-carrier-typical-week-block',
  components: {
    noData,
    mpBlock,
  },
  props: {
    schedule: {
      type: Object as () => Schedule,
      required: false,
    },
    scheduleConfigs: {
      type: Object as () => SchedulesConfigRecord,
      required: false,
    },
  },
  data: () => ({
    showAddModal: false,
    selectedDay: '' as string | undefined,
    selectedChips: null as { text: string; value: string } | null,
    showDeleteDialog: false,
  }),
  computed: {
    dayOfTheWeek(): Array<{
      value: Week
      text: string
      disabled: boolean
      closed: boolean
    }> {
      return Object.values(Week).map(day => {
        return {
          value: day,
          text: this.$t(`common.days.${day.slice(0, 3)}`),
          disabled: this.isClosed(day),
          closed: this.isClosed(day),
        }
      })
    },
  },
  methods: {
    getTypicalWeekRoute(event: string): void {
      if (event === 'create') {
        this.$router.push({
          name: ROUTES.createCarrierTypicalWeek,
          params: {
            ...this.$route.params,
          },
        })
      } else if (event === 'edit') {
        this.$router.push({
          name: ROUTES.editCarrierTypicalWeek,
          params: {
            ...this.$route.params,
            scheduleId: this.scheduleConfigs.id,
          },
        })
      }
    },
    isClosed(day: string): boolean {
      return !this.scheduleConfigs.workingSchedule?.[day as keyof WorkingSchedule]?.length
    },
    async deleteTypicalWeek(): Promise<void> {
      try {
        await DeliveryService.deleteSchedule(this.scheduleConfigs.id)

        this.$emit('update:scheduleConfigs', {})
        this.$emit('update:schedule', {})
      } catch (e) {
        this.$store.dispatch('setSnackbar', {
          type: SnackBarType.ERROR,
          message: this.$t('messages.noFrequency'),
        })
      }
    },
  },
})
</script>

<style lang="scss">
@import '../../../../../styles/mixins/macScrollbar';

#carrier-typical-week-component {
  @media #{map-get($display-breakpoints, 'xs-only')} {
    border-top: solid 0.1rem $main-lighten-74-color;
  }

  #carrier-typical-week-block {
    scrollbar-width: none;
    -ms-overflow-style: none; /* for Internet Explorer, Edge */

    .carrier-typical-scroll {
      max-height: 50rem;
      -ms-overflow-style: none; /* for Internet Explorer, Edge */
      scrollbar-width: none; /* for Firefox */
      overflow-y: scroll;
    }

    #carrier-typical-week-block::-webkit-scrollbar {
      display: none !important;
    }

    .carrier-typical-scroll::-webkit-scrollbar {
      display: none !important;
    }

    .top-block-wrapper {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .edit-typical-week-btn {
      background-color: $white;
      border-color: $white;
      border-radius: 50%;
      padding: 1.2rem;
      color: $main-lighten-52-color;
    }

    .edit-typical-week-btn:hover {
      background-color: $main-lighten-80-color;
    }

    .v-icon.v-icon:after {
      all: initial;
    }

    .chips-wrapper {
      @include setMacScrollbar('&');
      margin-bottom: 2rem;
    }

    .capacity-wrapper {
      display: grid;
      grid-template-columns: repeat(auto-fill, 14rem);
      justify-content: space-evenly;
      grid-gap: 0.5rem;

      @media #{map-get($display-breakpoints, 'xs-only')} {
        grid-gap: 0.5rem;
      }

      .capacity {
        min-width: 14rem;
        min-height: 6rem;
        max-width: 14rem;
        max-height: 6rem;
        border: 0.1rem solid $main-lighten-65-color;
        border-radius: 0.4rem;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;

        margin-top: 1rem;

        @media #{map-get($display-breakpoints, 'xs-only')} {
          margin-top: 0.5rem;
        }

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
}

.carrier-detail-parameter-typical-week-delete {
  .actions-wrapper {
    align-items: center;
    justify-content: center;

    button {
      max-width: fit-content;
    }
  }
}
</style>
