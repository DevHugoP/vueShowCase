<template>
  <div
    v-if="$vuetify.breakpoint.smAndUp"
    no-gutters
    id="merge-control-panel"
    data-id="order-list-controlPanel"
    class="d-flex"
  >
    <v-row v-if="type === ORDER_LIST_PANEL_TYPE.MERGE" class="d-flex max-width-chips">
      <v-col cols="5" lg="3" class="main-panel__wrapper">
        <v-col cols="12" class="pa-0 mb-3">
          <span class="panel-title" data-id="order-list-controlPanel-title">
            {{ $t('page.orders.merge.mainOrder') }}
          </span>
        </v-col>
        <v-col cols="12" class="pa-0">
          <v-chip
            v-if="main"
            close
            small
            @click:close="removeMain()"
            data-id="order-list-controlPanel-removeMain"
          >
            {{ main.externalOrderId | truncate(12) }}
          </v-chip>
          <v-chip class="empty-chip" small v-else />
        </v-col>
      </v-col>

      <v-col cols="1" class="merge-icon__wrapper">
        <v-icon>mdi-link-variant</v-icon>
      </v-col>

      <v-col cols="7" class="orders-merge__wrapper">
        <v-col cols="12" class="pa-0 mb-3">
          <span class="panel-title">{{ $t('page.orders.merge.orderToMerge_plural') }}</span>
        </v-col>
        <v-col cols="12" class="pa-0">
          <v-chip
            v-for="order in toMerge"
            :key="order.orderId"
            close
            small
            @click:close="removeOrderToMerge(order)"
            :data-id="`order-list-orderToMerge-${order}`"
          >
            {{ order.externalOrderId | truncate(12) }}
          </v-chip>
          <v-chip class="empty-chip" small />
        </v-col>
      </v-col>
    </v-row>
    <v-row
      no-gutters
      v-else-if="type === ORDER_LIST_PANEL_TYPE.LABEL"
      class="d-flex max-width-chips"
    >
      <v-col cols="12">
        <span class="panel-title">{{ $t('page.orders.label.title') }}</span>
      </v-col>
      <v-col cols="12" class="d-flex justify-space-between mt-3 align-center">
        <div>
          <v-chip
            v-for="(label, index) in labels"
            :key="`label.orderId-${index}`"
            close
            small
            @click:close="removeOrderToLabel(label)"
            :data-id="`order-list-labelMode-labelToDownload-${label.orderId}`"
            :class="`${index !== 0 ? 'ml-2' : ''}`"
          >
            {{ label.externalOrderId | truncate(12) }}
          </v-chip>
          <v-chip :class="`empty-chip ${labels.length > 0 ? ' ml-2' : ''}`" small />
        </div>
      </v-col>
    </v-row>

    <div class="d-flex align-center btn-wrapper">
      <mp-button
        format="link"
        linkColor="black"
        :text="$t('action.cancel.base')"
        @click="cancelPanel()"
        dataId="order-list-controlPanel-cancel"
      />
      <mp-button
        :class="type !== ORDER_LIST_PANEL_TYPE.MERGE ? 'download-action' : ''"
        format="black"
        :text="
          type === ORDER_LIST_PANEL_TYPE.MERGE ? $t('action.merge.base') : $t('action.download')
        "
        :loading="submitPanelOnGoing"
        :disabled="isSubmitButtonDisabled"
        @click="submitPanel()"
        dataId="order-list-controlPanel-submit"
      />
    </div>
  </div>

  <div v-else>
    <v-row
      no-gutters
      data-id="order-list-controlPanel"
      id="merge-control-panel-mobile"
      v-if="type === ORDER_LIST_PANEL_TYPE.MERGE"
    >
      <v-col cols="2" class="main-panel__wrapper">
        <v-col cols="12" class="pa-0">
          <v-chip
            v-if="main"
            close
            small
            @click:close="removeMain()"
            data-id="order-list-controlPanel-removeMain"
          >
            {{ main.externalOrderId | truncate(12) }}
          </v-chip>
          <v-chip class="empty-chip" small v-else />
        </v-col>
      </v-col>

      <v-col cols="1" class="merge-icon__wrapper">
        <v-icon>mdi-link-variant</v-icon>
      </v-col>

      <v-col cols="7" sm="6" class="orders-merge__wrapper">
        <v-col cols="12" class="pa-0">
          <v-chip
            v-for="order in toMerge"
            :key="order.orderId"
            close
            small
            @click:close="removeOrderToMerge(order)"
            :data-id="`order-list-mergeMode-orderToMerge-${order}`"
          >
            {{ order.externalOrderId | truncate(12) }}
          </v-chip>
          <v-chip class="empty-chip" small />
        </v-col>
      </v-col>
    </v-row>
    <v-row no-gutters id="merge-control-panel-mobile" v-else-if="ORDER_LIST_PANEL_TYPE.LABEL">
      <v-col cols="12" class="pa-0">
        <v-chip
          v-for="(label, index) in labels"
          :key="`label.orderId-${index}`"
          close
          small
          @click:close="removeOrderToLabel(label)"
          :data-id="`order-list-labelMode-labelToDownload-${label.orderId}`"
        >
          {{ label.externalOrderId | truncate(12) }}
        </v-chip>
        <v-chip class="empty-chip ml-2" small />
      </v-col>
    </v-row>
    <v-row id="merge-control-panel__actions" no-gutters>
      <v-col cols="6" class="merge-action__cancel__wrapper">
        <mp-button
          format="sticky"
          stickyColor="black"
          :text="$t('action.cancel.base')"
          @click="cancelPanel()"
          dataId="order-list-panel-cancel"
        />
      </v-col>
      <v-col class="merge-action__merge__wrapper" cols="6">
        <mp-button
          format="sticky"
          stickyColor="black"
          :loading="submitPanelOnGoing"
          :disabled="isSubmitButtonDisabled"
          :text="
            type === ORDER_LIST_PANEL_TYPE.MERGE ? $t('action.merge.base') : $t('action.download')
          "
          @click="submitPanel()"
          dataId="order-list-panel-submit"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters } from 'vuex'

import { SnackBarType } from '@/store/types'
import {
  RESET_MERGE,
  SET_MAIN_ORDER_TO_MERGE,
  REMOVE_ORDER_TO_MERGE,
  REMOVE_LABELS,
  RESET_LABELS,
} from '@/store/modules/orders/mutations-types'
import { OrderLightEntity } from '@/types'

import OrderService from '@/services/order/OrderService'
import { ROUTES, ORDER_LIST_PANEL_TYPE } from '@/constants'
import FileDownload from 'js-file-download'

export default Vue.extend({
  name: 'control-panel',
  props: {
    type: {
      type: String,
      required: true,
    },
  },
  computed: {
    ...mapGetters('orders', {
      main: 'mainOrderToMerge',
      toMerge: 'ordersToMerge',
      labels: 'labels',
    }),
    isValidMerge() {
      return this.main && this.toMerge.length > 0
    },
    isSubmitButtonDisabled(): boolean {
      switch (this.type) {
        case ORDER_LIST_PANEL_TYPE.MERGE:
          return !this.isValidMerge || this.submitPanelOnGoing
        case ORDER_LIST_PANEL_TYPE.LABEL:
          return this.labels.length === 0 || this.submitPanelOnGoing || this.labels.length > 10
        default:
          return false
      }
    },
  },
  data: () => ({
    submitPanelOnGoing: false,
    ORDER_LIST_PANEL_TYPE,
  }),
  methods: {
    cancelPanel() {
      this.$store.commit(`orders/${RESET_MERGE}`)

      if (this.type === ORDER_LIST_PANEL_TYPE.LABEL) {
        this.$store.commit(`orders/${RESET_LABELS}`)
      }

      this.$emit('cancelPanel')
    },
    removeMain() {
      this.$store.commit(`orders/${SET_MAIN_ORDER_TO_MERGE}`, '')
    },
    removeOrderToMerge(order: number) {
      this.$store.commit(`orders/${REMOVE_ORDER_TO_MERGE}`, order)
    },
    removeOrderToLabel(label: OrderLightEntity) {
      this.$store.commit(`orders/${REMOVE_LABELS}`, label)
    },
    async submitPanel() {
      this.submitPanelOnGoing = true
      try {
        switch (this.type) {
          case ORDER_LIST_PANEL_TYPE.MERGE: {
            const { id } = await OrderService.merge({
              from: this.main.orderId,
              to: this.toMerge.map((order: OrderLightEntity) => order.orderId),
            })

            this.$emit('submittedMerge')

            this.$router.push({
              name: ROUTES.detailOrder,
              params: { id: id.toString() },
            })
            break
          }
          case ORDER_LIST_PANEL_TYPE.LABEL: {
            const labels = await OrderService.getLabels(this.labels)
            if (!labels.byteLength) {
              this.$store.commit(`orders/${RESET_LABELS}`)
              return this.$emit('noLabels')
            }

            FileDownload(labels, `${this.$t('common.labelsZip', { timestamp: Date.now() })}.zip`)
            this.$emit('submittedLabel')
            this.$store.commit(`orders/${RESET_LABELS}`)
            break
          }
        }
      } catch (e) {
        this.$store.dispatch('setSnackbar', {
          type: SnackBarType.ERROR,
          clearable: true,
          timeout: 4000,
          message: this.$t('messages.error'),
        })
      } finally {
        this.$store.commit(`orders/${RESET_MERGE}`)
        this.submitPanelOnGoing = false
      }
    },
  },
})
</script>

<style lang="scss">
#merge-control-panel,
#merge-control-panel-mobile {
  z-index: 10;
  background-color: $white;

  @media #{map-get($display-breakpoints, 'xs-only')} {
    white-space: nowrap;
    overflow: scroll;
    height: 5rem;
    display: flex;
    justify-content: center;
    align-items: center;
    border-top: 0.2rem solid $main-color;
  }

  @media #{map-get($display-breakpoints, 'sm-and-up')} {
    position: sticky;
    bottom: 3rem;
    min-height: 8.4rem;
    margin: 1.2rem 3.4rem 0;
    padding: 1.8rem 2.6rem;
    border: 0.2rem solid $main-color;
    border-radius: 1rem;
  }

  .btn-wrapper {
    flex-wrap: wrap;
    justify-content: center;
  }

  .panel-title {
    @include h4-16-medium();
  }

  .main-panel__wrapper {
    max-width: fit-content;
  }

  .merge-icon__wrapper {
    text-align: center;

    .v-icon {
      color: $main-color;
    }
  }

  .orders-merge__wrapper {
    .v-chip {
      margin-right: 0.5rem;
    }

    @media #{map-get($display-breakpoints, 'xs-only')} {
      overflow-x: scroll;
    }
  }

  .empty-chip {
    width: 10rem;
    background-color: $white;
    border: 0.1rem dashed $main-color;
  }

  .max-width-chips {
    width: 85%;
  }

  .v-chip {
    height: 2rem;
    margin: 0;
    margin-bottom: 0.5rem;
    @include regular-12();

    &:not(.empty-chip) {
      background-color: $primary-color;
    }

    @media #{map-get($display-breakpoints, 'xs-only')} {
      margin-bottom: 0;
    }

    .v-chip__close {
      color: $main-color;
    }
  }

  .actions-wrapper {
    .download-action {
      .v-btn__content {
        max-width: max-content;
      }
    }
  }
}

#merge-control-panel__actions {
  .merge-action__cancel__wrapper {
    padding-right: 0.1rem;
  }

  .merge-action__merge__wrapper {
    padding-left: 0.1rem;
  }

  .v-btn {
    width: 100%;
    height: 6rem !important;
    border-radius: 0;
  }
}
</style>
