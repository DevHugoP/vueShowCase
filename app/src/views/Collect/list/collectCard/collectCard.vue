<template>
  <v-card :class="`cards cards--${getColor}`" outlined :ripple="false">
    <mp-card
      :id="collect.externalCollectId"
      :title="collect.externalCollectId | truncate"
      :contents="[
        {
          icon: 'mdi-calendar-month',
          text: getCreatedAt,
        },
        {
          icon: 'mdi-storefront-outline',
          text: collect.exchangePlaceName,
        },
        {
          icon: 'mdi-cursor-default-click-outline',
          text: $t(`technical.collectMode.${collect.mode}`),
        },
      ]"
      :footer="$t(`technical.status.collect.${collect.status}`)"
      :badges="[]"
    />
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'

import { Collect, COLLECT_STATUS } from '@/types'

import { dateHelper, dateHelperGetTimezonedDate } from '@/helpers/dateHelper'

import mpCard from '@/components/card/card.vue'
import { CardColor } from '@/views/Order/List/orderCard/orderCard.vue'

export default Vue.extend({
  name: 'collect-card',
  components: {
    mpCard,
  },
  props: {
    collect: {
      type: Object as () => Collect,
      required: true,
    },
  },
  computed: {
    getColor(): string {
      switch (this.collect.status) {
        case COLLECT_STATUS.PICK_UP_FAILED:
        case COLLECT_STATUS.PICK_UP_PARTIALLY:
        case COLLECT_STATUS.BLOCKED:
        case COLLECT_STATUS.DELAYED:
          return CardColor.ORANGE
        case COLLECT_STATUS.INIT:
        case COLLECT_STATUS.STOCK_OK:
        case COLLECT_STATUS.READY:
        case COLLECT_STATUS.STARTED:
        case COLLECT_STATUS.AWAITING:
        case COLLECT_STATUS.IN_PROGRESS:
        case COLLECT_STATUS.REPLANNED:
        default:
          return CardColor.MAIN
        case COLLECT_STATUS.CANCELLED:
          return CardColor.GREY
        case COLLECT_STATUS.PICK_UP_OK:
          return CardColor.GREEN
      }
    },
    getCreatedAt(): string {
      return dateHelper.formatToTimezone(
        dateHelperGetTimezonedDate(this.collect.createdAt),
        'UTC',
        'P - p',
      )
    },
  },
})
</script>

<style lang="scss" scoped>
.collect-card-wrapper {
  border: 0.1rem solid $main-lighten-28-color;
  min-width: 17rem;
  max-width: 17rem;
  min-height: 25rem;
  max-height: 25rem;
  border-radius: 0.4rem;
  overflow: hidden;

  &.color-warning {
    border: 0.1rem solid $alert-color;

    .bottom {
      background-color: $alert-color;
    }
  }

  &.color-main-lighten-28 {
    border: 0.1rem solid $main-lighten-28-color;

    .bottom {
      background-color: $main-lighten-28-color;
    }
  }

  &.color-main-lighten-74 {
    border: 0.1rem solid $main-lighten-74-color;

    .bottom {
      background-color: $main-lighten-74-color;
    }
  }

  &.color-success {
    border: 0.1rem solid $success-color;

    .bottom {
      background-color: $success-color;
    }
  }

  @media #{map-get($display-breakpoints, 'xs-only')} {
    min-width: 15rem;
    max-width: 15rem;
  }

  .title {
    min-height: 5.6rem;
    max-height: 5.6rem;
    border-bottom: 0.1rem solid $main-lighten-74-color;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
  }

  .card-info {
    min-height: 15.7rem;
    max-height: 15.7rem;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    padding: 1rem;
  }

  .bottom {
    max-height: 3.7rem;
    min-height: 3.7rem;
    background-color: $main-lighten-28-color;
    color: $white;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
  }
}
</style>
