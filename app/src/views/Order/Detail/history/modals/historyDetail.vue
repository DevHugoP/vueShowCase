<template>
  <mp-dialog
    id="history-detail-modal"
    :dialog="showDialog"
    hasHeader
    hasContent
    persistent
    :fullscreen="$vuetify.breakpoint.xsOnly"
    @clickOutside="$emit('hide')"
    :maxWidth="$vuetify.breakpoint.smAndUp ? '58.6rem' : null"
    :dataId="dataId"
  >
    <template #header>
      <v-container class="header-container" v-if="$vuetify.breakpoint.smAndUp">
        <v-row no-gutters>
          <v-col cols="12" class="modal-header-wrapper">
            <div class="icon">
              <v-icon size="1.8rem">mdi-update</v-icon>
            </div>
            <v-icon class="cross-icon" @click="$emit('hide')" :data-id="`${dataId}-cancel`">
              mdi-close
            </v-icon>
          </v-col>
        </v-row>

        <v-row no-gutters>
          <v-col cols="12">
            <h4 class="modal-title d-flex align-center justify-center">
              {{ getDate(historyDetail.updatedAt, 'P') }}
              -
              {{ getDate(historyDetail.updatedAt, 'p') }}
              -
              {{ $t(`technical.history.${historyDetail.type}`) }}
              <br />
              {{ historyDetail.author.name }}
            </h4>
          </v-col>
        </v-row>
      </v-container>
      <v-container class="mobile-header-container" v-else>
        <v-row no-gutters class="header-wrapper" :data-id="`${dataId}-cancel`">
          <v-col cols="12" class="header">
            <v-icon @click="$emit('hide')" class="cross-icon">mdi-close</v-icon>
            <span class="regular14 modal-title">
              {{ getDate(historyDetail.updatedAt, 'P') }}
              -
              {{ getDate(historyDetail.updatedAt, 'p') }}
              -
              {{ $t(`technical.history.${historyDetail.type}`) }}
              <br />
              {{ historyDetail.author.name }}
            </span>
          </v-col>
        </v-row>
      </v-container>
    </template>

    <template #content>
      <v-container class="content-container">
        <vue-json-compare :oldData="historyDetail.before" :newData="historyDetail.after" />
      </v-container>
    </template>
  </mp-dialog>
</template>

<script lang="ts">
import Vue from 'vue'
import vueJsonCompare from 'vue-json-compare'

import { OrderHistory } from '@/types'
import { dateHelper, dateHelperGetTimezonedDate } from '@/helpers/dateHelper'

export default Vue.extend({
  name: 'history-detail',
  components: {
    vueJsonCompare,
  },
  props: {
    showDialog: {
      type: Boolean,
      required: true,
    },
    historyDetail: {
      type: Object as () => OrderHistory,
      required: true,
    },
    dataId: {
      type: String,
      required: true,
    },
  },
  methods: {
    getDate(date: string, format: string) {
      return dateHelper.formatToTimezone(dateHelperGetTimezonedDate(date), 'UTC', format)
    },
  },
})
</script>

<style lang="scss">
@import '../../../../../styles/mixins/macScrollbar';

#history-detail-modal {
  .header-container {
    padding: 0;
    min-height: 12.7rem;
    background: $primary-color !important;
    display: flex;
    flex-direction: column;
    text-align: center;

    .modal-header-wrapper {
      display: flex;

      .icon {
        height: 5rem;
        width: 5rem;
        border: solid 0.1rem $main-color;
        border-radius: 2.5rem;
        display: flex;
        justify-content: center;
        margin-left: 26.8rem;
        margin-top: 2.4rem;

        i {
          color: $main-color !important;
        }
      }

      .cross-icon {
        margin-left: 23rem;
        align-self: start;
        margin-top: 1.4rem;
        color: $main-color !important;
      }
    }

    .modal-title {
      color: $main-color !important;
    }
  }

  .mobile-header-container {
    min-height: 5.2rem;
    background-color: $primary-color;
    width: 100%;
    display: flex;
    align-items: center;
    color: $main-color;

    .header {
      display: flex;
      justify-content: center;
      align-items: center;

      .cross-icon {
        color: $main-color;
        margin-right: auto;
      }

      .modal-title {
        position: absolute;
        text-align: center;
      }
    }
  }

  .main-dialog-content {
    padding: 0;
    color: $main-color;

    @include setMacScrollbar('&');
    overflow-y: scroll;

    @media #{map-get($display-breakpoints, 'sm-and-up')} {
      height: calc(100vh - 27rem);
      max-height: 50rem;
    }

    @media #{map-get($display-breakpoints, 'xs-only')} {
      height: calc(100vh - 5.4rem);
    }

    .content-container {
      .c-json-view {
        padding: 0;
        padding-left: 4rem;

        .c-json-outter {
          display: none;
        }

        p.c-json-p {
          margin: 0;
        }
      }
    }
  }
}
</style>
