<template>
  <mp-dialog-confirmation
    classWrapper="edit-carrier-modal"
    dataId="edit-carrier-modal"
    persistent
    color="primary"
    :header="{
      iconClose: 'mdi-close',
      icon: $vuetify.breakpoint.smAndUp ? 'mdi-truck' : undefined,
      isColorBackground: true,
      text: $t('action.edit.carrier'),
      textPolice: 'regular14',
    }"
    :btnCancel="{
      text: $t('action.cancel.base'),
      format: $vuetify.breakpoint.smAndUp ? 'link' : 'sticky',
      linkColor: $vuetify.breakpoint.smAndUp ? 'black' : undefined,
      stickyColor: $vuetify.breakpoint.smAndUp ? undefined : 'yellow',
    }"
    :btnValidation="{
      text: $t('action.confirm.base'),
      format: $vuetify.breakpoint.smAndUp ? 'success' : 'sticky',
      stickyColor: $vuetify.breakpoint.smAndUp ? undefined : 'yellow',
    }"
    :fullscreen="$vuetify.breakpoint.xsOnly"
    @submit="$emit('confirm', selectedCarrierCode)"
    @close="$emit('close')"
  >
    <template #content>
      <v-row no-gutters class="mt-4">
        <v-col cols="10" offset="1">
          <div
            :class="
              `carrier-wrapper${selectedCarrierCode === carrier.Carrier.code ? ' selected' : ''}`
            "
            v-for="(carrier, index) in carriers"
            :key="`product-return-carriers-${index}`"
            @click="selectedCarrierCode = carrier.Carrier.code"
          >
            <div
              class="d-flex align-center"
              :key="`carrier-${carrier.Carrier.code}`"
              :data-id="`change-carrier-radio-${carrier.Carrier.code}`"
            >
              <v-img
                data-id="carrier-detail-logo"
                class="logo"
                :src="carrier.Carrier.logo"
                v-if="carrier.Carrier.logo"
                contain
              />

              <span class="regular12 main-lighten-52 ml-3">{{ carrier.Carrier.name }}</span>
            </div>
          </div>
        </v-col>
      </v-row>
    </template>
  </mp-dialog-confirmation>
</template>

<script lang="ts">
import mixins from 'vue-typed-mixins'
import validationMixin from '@/mixins/validationMixin/validationMixin'
import { CarrierEligibilityEntity } from '@/types'

export default mixins(validationMixin).extend({
  name: 'change-carrier-modal',
  props: {
    carriers: {
      type: Array as () => CarrierEligibilityEntity[],
      required: true,
    },
    selectedCarrier: {
      type: String,
      required: true,
    },
    showDialog: {
      type: Boolean,
      required: true,
    },
  },
  data: () => ({
    selectedCarrierCode: '',
  }),
  beforeMount() {
    this.selectedCarrierCode = this.selectedCarrier
  },
})
</script>

<style lang="scss">
@import '../../../../../../../styles/mixins/macScrollbar';
.edit-carrier-modal {
  .main-dialog-content {
    overflow-y: scroll;
    height: 50rem;
    @include setMacScrollbar('&');
    @media #{map-get($display-breakpoints, 'xs-only')} {
      padding: 0 2.4rem;
      overflow-y: auto;
      min-height: calc(100vh - 5.2rem - 8rem);
    }
    padding: 0;
    color: $main-color;
  }

  .carrier-wrapper {
    padding: 2rem;
    border: $main-lighten-65-color 0.1rem solid;
    border-radius: 0.4rem;
    align-items: flex-start;

    &.selected {
      border: $main-color 0.2rem solid;
    }

    &:not(:first-child) {
      margin-top: 2rem;
    }
  }
  .v-item--active {
    border: $main-color 0.1rem solid;
  }

  .logo {
    height: 5rem;
    flex-grow: 0;
    width: 100px;
  }
}
</style>
