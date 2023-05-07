<template>
  <mp-block
    id="carrier-delivery-logistic-block"
    :title="$vuetify.breakpoint.smAndUp ? $t('page.carrier.logistics.title') : ''"
    :hasBorder="$vuetify.breakpoint.smAndUp"
    :hasMarginBottom="$vuetify.breakpoint.smAndUp"
    titleHasPaddingBottom
    :hasEditIcon="hasEditIcon"
    @clickOnIcon="showModal = true"
  >
    <v-row no-gutters>
      <v-col
        cols="12"
        v-for="(logistic, index) in LOGISTICS"
        :key="`logistics-${index}`"
        class="row-wrapper"
      >
        <v-icon
          size="1.8rem"
          class="success-color"
          v-if="localLogistics && localLogistics.includes(logistic)"
        >
          mdi-check-bold
        </v-icon>
        <v-icon size="1.8rem" class="error-color" v-else>mdi-close-thick</v-icon>
        <span class="regular14 main-color">{{
          $t(`page.carrier.logistics.${logistic.toLowerCase()}`)
        }}</span>
      </v-col>
    </v-row>

    <mp-dialog-confirmation
      v-if="showModal"
      dataId="carrier-delivery-logistic-modal"
      classWrapper="carrier-delivery-logistic-modal"
      color="primary"
      :header="{
        iconClose: 'mdi-close',
        icon: $vuetify.breakpoint.smAndUp ? 'mdi-pencil' : '',
        isColorBackground: true,
        text: $t('action.modify.logistic'),
        textPolice: 'medium16',
      }"
      :btnValidation="{ text: $t('action.save'), format: 'success', icon: 'content-save-outline' }"
      :btnCancel="{ text: $t('action.cancel.base'), format: 'link', linkColor: 'black' }"
      @close="showModal = !showModal"
      @submit="handleSubmit()"
    >
      <template #content>
        <v-row no-gutters>
          <v-col
            cols="10"
            offset="1"
            v-for="(logistic, index) in LOGISTICS"
            :key="`logistics-${index}`"
            class="row-wrapper"
          >
            <mp-checkbox-new
              :label="$t(`page.carrier.logistics.${logistic.toLowerCase()}`)"
              v-model="editLogistics"
              :value="logistic"
              :hide-details="true"
              :data-id="`carrier-delivery-logistics-checkbox-${index}`"
            />
          </v-col>
        </v-row>
      </template>
    </mp-dialog-confirmation>
  </mp-block>
</template>

<script lang="ts">
import Vue from 'vue'

import mpBlock from '@/components/block/block.vue'
import { CarrierEntity, LOGISTICS } from '@/types'
import CarrierService from '@/services/carrier/CarrierService'
import { SnackBarType } from '@/store/types'

export default Vue.extend({
  name: 'mp-carrier-detail-logistic',
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
    localLogistics: [] as LOGISTICS[],
    LOGISTICS,
    showModal: false,
    editLogistics: [] as LOGISTICS[],
  }),
  beforeMount() {
    const { logistics } = this.carrier
    this.localLogistics = logistics || []
  },
  methods: {
    async handleSubmit(): Promise<void> {
      try {
        await CarrierService.update(this.carrier.id, {
          logistics: this.editLogistics.length ? this.editLogistics : null,
        })
        this.carrier.logistics = this.editLogistics
        this.localLogistics = this.editLogistics
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
        this.showModal = false
      }
    },
  },
  watch: {
    showModal(next: boolean) {
      if (!next) {
        this.editLogistics = []
        return
      }

      this.editLogistics = this.localLogistics || []
    },
  },
})
</script>

<style lang="scss">
#carrier-delivery-logistic-block {
  .row-wrapper {
    display: flex;
    align-items: center;
    margin-bottom: 1.6rem;
    
    &:last-of-type {
      margin-bottom: 0;
    }

    i {
      margin-right: 1.2rem;
    }
  }
}

.carrier-delivery-logistic-modal {
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
