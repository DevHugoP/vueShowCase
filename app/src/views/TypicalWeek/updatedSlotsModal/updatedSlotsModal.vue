<template>
  <mp-dialog-confirmation
    v-if="showOpeningHoursUpdatedModal"
    :dataId="`${dataId}`"
    @close="showOpeningHoursUpdatedModal = false"
    @submit="showOpeningHoursUpdatedModal = false"
    color="error"
    :header="{
      icon: 'mdi-exclamation-thick',
      isColorBackground: false,
      iconClose: 'mdi-close',
    }"
    :btnValidation="{ text: $t('action.close.base'), format: 'error' }"
  >
    <template #content>
      <div id="updated-slots-modal-content">
        <div v-if="Object.keys(removedSlots).length > 0">
          <mp-updated-slots
            :dataId="`${dataId}-removed-slots`"
            :updatedSlots="removedSlots"
            :infoOne="$t('page.typicalWeek.updatedSlotsModal.slotsRemoved.infoOne')"
            :infoTwo="$t('page.typicalWeek.updatedSlotsModal.slotsRemoved.infoTwo')"
            :timezone="timezone"
          />
        </div>

        <div v-if="Object.keys(addedSlots).length > 0">
          <mp-updated-slots
            :dataId="`${dataId}-added-slots`"
            :updatedSlots="addedSlots"
            :infoOne="
              Object.keys(removedSlots).length === 0
                ? $t('page.typicalWeek.updatedSlotsModal.slotsAdded.infoOne')
                : ''
            "
            :infoTwo="$t('page.typicalWeek.updatedSlotsModal.slotsAdded.infoTwo')"
            :timezone="timezone"
          />
        </div>
      </div>
    </template>

    <template #actions>
      <v-row no-gutters class="actions-outer-wrapper">
        <v-col cols="12">
          <mp-button
            :text="$t('action.close.base')"
            format="error"
            dataId="order-detail-confirmValidDelivery-submit"
            @click="showOpeningHoursUpdatedModal = false"
          />
        </v-col>
      </v-row>
    </template>
  </mp-dialog-confirmation>
</template>

<script lang="ts">
import Vue from 'vue'

import mpUpdatedSlots from './updatedSlots/updatedSlots.vue'

import { SET_UPDATED_SLOTS } from '@/store/modules/exchangePlace/mutations-type'
import { DayCapacity, Week } from '@/types'

export default Vue.extend({
  name: 'mp-updated-slots-modal',
  components: {
    mpUpdatedSlots,
  },
  props: {
    dataId: {
      type: String,
      required: true,
    },
    timezone: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      hasLoaded: false,
      addedSlots: {} as Record<string, DayCapacity[]>,
      removedSlots: {} as Record<string, DayCapacity[]>,
      showOpeningHoursUpdatedModal: false,
    }
  },
  mounted() {
    const updatedSlots = this.$store.getters['exchangePlace/updatedSlots']

    this.$store.commit(`exchangePlace/${SET_UPDATED_SLOTS}`)

    if (updatedSlots && Object.keys(updatedSlots).length) {
      this.addedSlots = updatedSlots.added
      this.removedSlots = updatedSlots.removed

      Object.values(Week).forEach((day: any) => {
        if (this.addedSlots[day] && !this.addedSlots[day].length) {
          delete this.addedSlots[day]
        }
        if (this.removedSlots[day] && !this.removedSlots[day].length) {
          delete this.removedSlots[day]
        }
      })

      this.showOpeningHoursUpdatedModal = Boolean(
        Object.keys(this.addedSlots).length || Object.keys(this.removedSlots).length,
      )
    }

    this.hasLoaded = true
  },
})
</script>

<style lang="scss">
@import '../../../styles/mixins/macScrollbar';

#updated-slots-modal-content {
  overflow-y: scroll;
  @include setMacScrollbar('&');
  max-height: calc(80vh - 12.6rem - 8.8rem);
}
</style>
