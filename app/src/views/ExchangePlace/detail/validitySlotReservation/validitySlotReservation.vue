<template>
  <div id="exchange-place-detail-validity-slot-reservation">
    <mp-block
      id="exchange-place-detail-validity-slot-reservation-block"
      :hasBorder="$vuetify.breakpoint.smAndUp"
      :hasMarginBottom="$vuetify.breakpoint.smAndUp"
      :title="$vuetify.breakpoint.smAndUp ? $t('page.exchangePlace.validitySlotReservation.title') : ''"
      titleHasPaddingBottom
    >
      <no-data
        v-if="!slotsValidity"
        dataId="subscription-detail-noData"
        :content="$t('page.exchangePlace.validitySlotReservation.empty')"
      />
      <div v-else>
        <div v-if="slotsValidity.type === 'day'">
          <v-row class="regular14" no-gutters>
            <v-col cols="1">
              <v-icon>mdi-clock</v-icon>
            </v-col>
            <v-col class="my-1" cols="9">
              <span>{{ $t('page.exchangePlace.validitySlotReservation.day') }}</span>
            </v-col>
            <v-col class="my-1" cols="1">
              <span>{{
                slotsValidity.validity.value + slotsValidity.validity.unit.substring(0, 1)
              }}</span>
            </v-col>
          </v-row>
        </div>

        <div v-else>
          <div v-for="(slot, index) in slotsValidity.slots" :key="slot.id">
            <v-row :class="`no-gutters regular14 ${index === slotsValidity.slots.length - 1 ? '' : 'mb-4'}`">
              <v-col cols="1">
                <v-icon>mdi-clock</v-icon>
              </v-col>
              <v-col class="my-1" cols="9">
                <span>{{ `${slot.start}-${slot.end}` }}</span>
              </v-col>
              <v-col class="my-1" cols="1">
                <span>{{ `${slot.validity.value}${slot.validity.unit.substring(0, 1)}` }}</span>
              </v-col>
            </v-row>
          </div>
        </div>
      </div>
      <div class="d-flex justify-center align-center btn-wrapper">
        <mp-button
          v-if="$vuetify.breakpoint.mdAndUp && isAuthorized('WRITE_EXCHANGE_PLACE_VALIDITY_PERIOD')"
          :format="$vuetify.breakpoint.xsOnly ? 'secondary' : 'primary'"
          :text="slotsValidity ? $t('action.modify.base') : $t('action.add.base')"
          :to="{ name: ROUTES.validitySlotPeriod }"
          dataId="exchange-place-detail-validity-slot-reservation-create"
          :icon="slotsValidity ? 'pencil' : 'plus'"
        />
      </div>
    </mp-block>
  </div>
</template>

<script lang="ts">
import mpBlock from '@/components/block/block.vue'

import noData from '@/components/noData/noData.vue'
import { ROUTES } from '@/constants'
import { authorizationMixin } from '@/mixins'
import { BookingValidityPeriod } from '@/types'
import mixins from 'vue-typed-mixins'

export default mixins(authorizationMixin).extend({
  name: 'mp-validity-slot-reservation',
  components: {
    mpBlock,
    noData,
  },
  props: {
    slotsValidity: {
      type: Object as () => BookingValidityPeriod,
      required: true,
    },
  },
  data: () => ({
    ROUTES,
  }),
})
</script>

<style lang="scss" scoped>
#exchange-place-detail-validity-slot-reservation{

  .btn-wrapper {
    margin-top: 2.5rem;
    margin-bottom: 0.1rem;
  }

}
</style>
