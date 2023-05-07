<template>
  <mp-block
    id="carrier-delivery-characteristic-block"
    :title="$vuetify.breakpoint.smAndUp ? $t('page.carrier.characteristics.title') : ''"
    :hasBorder="$vuetify.breakpoint.smAndUp"
    :hasMarginBottom="$vuetify.breakpoint.smAndUp"
    titleHasPaddingBottom
    :hasEditIcon="hasEditIcon"
    @clickOnIcon="showModal = true"
  >
    <v-row no-gutters>
      <v-col
        cols="12"
        v-for="(characteristic, index) in characteristicsList"
        :key="`characteristics-${index}`"
        class="row-wrapper"
      >
        <v-icon
          size="1.8rem"
          class="success-color"
          v-if="carrier.characteristics && carrier.characteristics.includes(characteristic.id)"
        >
          mdi-check-bold
        </v-icon>
        <v-icon size="1.8rem" class="error-color" v-else>mdi-close-thick</v-icon>
        <span class="regular14">{{ characteristic.name }}</span>
      </v-col>
    </v-row>

    <mp-dialog-confirmation
      v-if="showModal"
      dataId="carrier-delivery-characteristic-modal"
      classWrapper="carrier-delivery-characteristic-modal"
      color="primary"
      :header="{
        iconClose: 'mdi-close',
        icon: $vuetify.breakpoint.smAndUp ? 'mdi-pencil' : '',
        isColorBackground: true,
        text: $t('action.modify.characteristics'),
        textPolice: 'medium16',
      }"
      :btnValidation="{ text: $t('action.save'), format: 'success', icon: 'content-save-outline', loading }"
      :btnCancel="{ text: $t('action.cancel.base'), format: 'link', linkColor: 'black' }"
      @close="showModal = !showModal"
      @submit="handleSubmit()"
    >
      <template #content>
        <v-row no-gutters>
          <v-col
            cols="10"
            offset="1"
            v-for="(characteristic, index) in characteristicsList"
            :key="`characteristics-${index}`"
            class="row-wrapper"
          >
            <mp-checkbox-new
              :label="characteristic.name"
              v-model="editCharacteristics"
              :value="characteristic.id"
              :hide-details="true"
              :data-id="`carrier-delivery-characteristics-checkbox-${index}`"
            />
          </v-col>
        </v-row>
      </template>
    </mp-dialog-confirmation>
  </mp-block>
</template>

<script lang="ts">
import mpBlock from '@/components/block/block.vue'
import CarrierService from '@/services/carrier/CarrierService'
import { SnackBarType } from '@/store/types'
import { CarrierEntity, CHARACTERISTICS } from '@/types'
import Vue from 'vue'

export default Vue.extend({
  name: 'mp-carrier-detail-characteristics',
  components: {
    mpBlock,
  },
  props: {
    carrier: {
      type: Object as () => CarrierEntity,
      required: true,
    },
    hasEditIcon: {
      type: Boolean,
      default: true,
    },
  },
  data: () => ({
    loading: false,
    CHARACTERISTICS,
    showModal: false,
    editCharacteristics: [] as CHARACTERISTICS[],
    characteristicsList: [] as Array<{ id: CHARACTERISTICS; name: string }>,
  }),
  beforeMount() {
    this.characteristicsList = [
      {
        id: CHARACTERISTICS.REAL_TIME_STATUS,
        name: this.$t('page.carrier.characteristics.realtimeStatus'),
      },
      {
        id: CHARACTERISTICS.CARRIER_TRACKING,
        name: this.$t('page.carrier.characteristics.carrierTracking'),
      },
      {
        id: CHARACTERISTICS.BEST_PRACTICES,
        name: this.$t('page.carrier.characteristics.bestPractices'),
      },
      {
        id: CHARACTERISTICS.API_IMPLEMENTATION,
        name: this.$t('page.carrier.characteristics.apiImplementation'),
      }
    ]
  },
  methods: {
    async handleSubmit(): Promise<void> {
      this.loading = true
      try {
        await CarrierService.update(this.carrier.id, {
          characteristics: this.editCharacteristics.length ? this.editCharacteristics : null,
        })
        this.carrier.characteristics = this.editCharacteristics
        this.$store.dispatch('setSnackbar', {
          message: this.$t('messages.carrierUpdated'),
          type: SnackBarType.SUCCESS,
        })
      } catch (err) {
        this.$store.dispatch('setSnackbar', {
          type: SnackBarType.ERROR,
          message: this.$t('messages.error'),
        })
      } finally {
        this.loading = false
        this.showModal = false
      }
    },
  },
  watch: {
    showModal(next: boolean) {
      if (!next) {
        this.editCharacteristics = []
        return
      }

      this.editCharacteristics = this.carrier.characteristics || []
    },
  },
})
</script>

<style lang="scss">
#carrier-delivery-characteristic-block {
  .row-wrapper {
    display: flex;
    align-items: center;
    margin-bottom: 1.6rem;

    &:last-of-type {
      margin-bottom:0;
    }

    i {
      margin-right: 1.2rem;
    }
  }
}

.carrier-delivery-characteristic-modal {
  .main-dialog-content {
    @media #{map-get($display-breakpoints, 'sm-and-up')} {
      @import '../../../../styles/mixins/macScrollbar';
      @include setMacScrollbar('&');
      max-height: calc(100vh - 33rem);
      overflow-y: scroll;
    }

    .row-wrapper {
      display: flex;
      padding-bottom: 2rem !important;

      &:first-of-type {
        padding-top: 4.1rem;
      }
    }
  }
  .v-card__actions {
    border-top: 0.1rem solid $main-lighten-74-color;
  }
}
</style>
