<template>
  <mp-dialog-confirmation
    dataId="order-detail-status-detail"
    @close="$emit('close')"
    @submit="$emit('close')"
    color="primary"
    :header="{
      icon: 'mdi-information-variant',
      isColorBackground: true,
      text: $t('page.detailOrder.status.detail.title'),
      textPolice: 'h4',
      iconClose: 'mdi-close',
    }"
    :btnValidation="{ text: $t('action.close.base'), format: 'primary' }"
    :fullscreen="$vuetify.breakpoint.xsOnly"
    classWrapper="delivery-status"
  >
    <template #content>
      <v-row no-gutters>
        <v-col cols="10" offset="1" v-if="status.comment">
          <v-row no-gutters class="delivery-status-title comment">
            <v-col cols="12">
              <h4>{{ $t('common.comment') }}</h4>
              <div class="delivery-status-title-color" />
            </v-col>
            <v-col cols="12" class="delivery-status-comment">
              <span class="regular14">{{ status.comment }}</span>
            </v-col>
          </v-row>
        </v-col>

        <v-col cols="10" offset="1" v-if="status.team">
          <v-row no-gutters class="delivery-status-title">
            <v-col cols="12">
              <h4>{{ $t('page.detailOrder.status.detail.team') }}</h4>
              <div class="delivery-status-title-color" />
            </v-col>
            <v-col
              cols="12"
              class="delivery-status-team"
              v-for="(member, index) in status.team.members"
              :key="`${member.id}-${index}`"
            >
              <v-row no-gutters class="team-wrapper">
                <v-col cols="1" class="team-icon">
                  <v-icon size="1.6rem">mdi-account</v-icon>
                </v-col>
                <v-col cols="11">
                  <h4 class="team-member">{{ member.id }}</h4>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-col>

        <v-col cols="10" offset="1" v-if="status.additionalData && status.additionalData.length">
          <v-row no-gutters class="delivery-status-title">
            <v-col cols="12" class="mt-3 mb-3">
              <h4>{{ $t('page.detailOrder.status.detail.additionalData') }}</h4>
              <div class="delivery-status-title-color" />
            </v-col>
            <v-col
              cols="12"
              class="delivery-status-additional-data"
              v-for="(data, index) in status.additionalData"
              :key="`${data.key}-${index}`"
            >
              <v-row no-gutters>
                <v-col cols="1" class="align-self-center">
                  <v-icon size="1.6rem">mdi-file-download</v-icon>
                </v-col>
                <v-col col="11">
                  <h4>
                    {{ data.key }} : <span class="regular14">{{ data.value }} </span>
                  </h4>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-col>

        <v-col cols="10" offset="1" v-if="status.appointment">
          <v-row no-gutters class="delivery-status-title">
            <v-col cols="12" class="mt-3 mb-3">
              <h4>{{ $t('page.detailOrder.status.detail.appointment.title') }}</h4>
              <div class="delivery-status-title-color" />
            </v-col>
            <v-col cols="12" class="delivery-status-appointment">
              <v-row no-gutters class="mb-3">
                <v-col cols="1" class="align-self-center">
                  <v-icon size="1.6rem">mdi-information</v-icon>
                </v-col>
                <v-col cols="11">
                  <h4>{{ $t('page.detailOrder.status.detail.appointment.new') }}</h4>
                </v-col>
              </v-row>
              <v-row no-gutters>
                <v-col offset="1" cols="11">
                  <span class="regular14">{{
                    $t('page.detailOrder.status.detail.appointment.between', {
                      start: getFormatedDate(status.appointment.new.start),
                      end: getFormatedDate(status.appointment.new.end),
                    })
                  }}</span>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12" class="delivery-status-appointment">
              <v-row no-gutters class="mb-3 mt-3">
                <v-col cols="1" class="align-self-center">
                  <v-icon size="1.6rem">mdi-information</v-icon>
                </v-col>
                <v-col cols="11">
                  <h4>{{ $t('page.detailOrder.status.detail.appointment.old') }}</h4>
                </v-col>
              </v-row>
              <v-row no-gutters>
                <v-col offset="1" cols="11">
                  <span class="regular14">{{
                    $t('page.detailOrder.status.detail.appointment.between', {
                      start: getFormatedDate(status.appointment.old.start),
                      end: getFormatedDate(status.appointment.old.end),
                    })
                  }}</span>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </template>
  </mp-dialog-confirmation>
</template>

<script lang="ts">
import Vue from 'vue'
import { DateFormat, dateHelper, dateHelperGetTimezonedDate } from '@/helpers/dateHelper'
import { OStatus } from '../../status.vue'

export default Vue.extend({
  name: 'order-detail-delivery-status-detail',
  props: {
    status: {
      type: Object as () => OStatus,
      required: true,
    },
  },
  methods: {
    getFormatedDate(date: string) {
      return dateHelper.formatToTimezone(dateHelperGetTimezonedDate(date), 'UTC', DateFormat.SHORT)
    },
  },
})
</script>

<style lang="scss">
@import '../../../../../../styles/mixins/macScrollbar';

.delivery-status {
  color: $main-color;

  .main-dialog-content {
    overflow-y: scroll;
    @include setMacScrollbar('&');

    @media #{map-get($display-breakpoints, 'sm-and-up')} {
      max-height: calc(100vh - 12.6rem - 16rem) !important;
    }

    @media #{map-get($display-breakpoints, 'xs-only')} {
      max-height: calc(100vh - 10.9rem - 8.8rem) !important;
    }

    .delivery-status-title {
      color: $main-color;

      &.comment {
        margin-top: 2rem;
        margin-bottom: 2rem;
      }

      .delivery-status-title-color {
        width: 4rem;
        height: 0.5rem;
        background-color: $primary-color;
        margin-top: 0.6rem;
      }

      .delivery-status-comment {
        margin-top: 1.2rem;
        color: $main-color;
      }

      .delivery-status-team {
        margin-top: 1.2rem;
        display: flex;
        align-items: center;

        .team-wrapper {
          .team-icon {
            max-width: fit-content;
          }

          .team-member {
            padding-left: 1.2rem;
          }
        }
      }
    }
  }
}
</style>
