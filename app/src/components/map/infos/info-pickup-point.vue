<template>
  <div class="map-google-info-pickup-point">
    <div class="mb-3">
      <span class="regular14">
        {{ item.address.title }}
      </span>
    </div>

    <div class="mb-3">
      <span class="regular12 main-lighten-28">
        {{ OrderMapper.getFormatedAddress(item.address) }}
      </span>
    </div>

    <div
      class="d-flex align-center mb-3"
      :style="{ cursor: 'pointer' }"
      @click="showHidden = !showHidden"
    >
      <span>{{ getTranslation('common.moreInfo') }} </span>
      <span class="icon-chevron-down" v-if="!showHidden">
        &#x2304;
      </span>
      <span class="icon-chevron-up" v-else>
        &#8963;
      </span>
    </div>

    <div v-if="showHidden">
      <div class="mb-5 d-flex" v-if="item.type || item.category">
        <div class="chip" v-if="item.type">
          <span class="regular14 main-color">{{ item.type }}</span>
        </div>

        <div :class="`chip${item.type ? ' ml-2' : ''}`" v-if="item.category">
          <span class="regular14 main-color">{{ item.category }}</span>
        </div>
      </div>

      <div class="mt-4">
        <div class="mb-1">
          <span class="medium12">
            {{ getTranslation('common.schedule_plural') }}
          </span>
        </div>

        <div
          v-for="day in week"
          :key="`create-order-week-${day}`"
          class="mt-2 d-flex justify-space-between"
        >
          <span class="regular12">
            {{ getTranslation(`common.days.${day.substring(0, 3)}`) }}
          </span>

          <div v-if="item.openingHours[day].length" class="text-right">
            <span
              class="regular12"
              v-for="(hours, hoursIndex) in item.openingHours[day]"
              :key="`create-order-week-${day}-hours-${hoursIndex}`"
            >
              {{
                `${hours.start} - ${hours.end}${
                  item.openingHours[day].length > hoursIndex + 1 ? ' / ' : ''
                }`
              }}
            </span>
          </div>
          <div v-else>
            <span class="regular12">
              {{ getTranslation('action.close.base') }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import OrderMapper from '@/services/order/OrderMapper'

export default Vue.extend({
  name: 'mp-map-google-infos-pickup-point',
  props: {
    item: {
      type: Object,
      required: true,
    },
    getTranslation: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      showHidden: false,
      OrderMapper: OrderMapper as typeof OrderMapper,
      week: {
        monday: 'monday',
        tuesday: 'tuesday',
        wednesday: 'wednesday',
        thursday: 'thursday',
        friday: 'friday',
        saturday: 'saturday',
        sunday: 'sunday',
      },
    }
  },
})
</script>

<style lang="scss">
.gm-style-iw {
  padding: 0 !important;
}
.gm-style-iw-d {
  padding: 2rem !important;
  overflow: auto;
}
.map-google-info-pickup-point {
  .chip {
    border: 0.1rem solid $main-lighten-65-color;
    border-radius: 5rem;
    max-width: fit-content;
    padding: 0.3rem 0.8rem;
  }

  .icon-chevron-down {
    font-size: 2.6rem;
    padding-bottom: 1rem;
  }

  .icon-chevron-up {
    font-size: 2.6rem;
    padding-top: 1rem;
  }
}
</style>
