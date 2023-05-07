<template>
  <mp-dialog
    :dialog="showDialog"
    hasHeader
    hasContent
    hasAction
    maxWidth="31rem"
    @clickOutside="cancel()"
    id="order-detail-confirm-valid-delivery"
    dataId="order-detail-confirmValidDelivery"
  >
    <template #header>
      <v-row no-gutters class="modal-header-wrapper">
        <v-col
          cols="12"
          class="modal-header-delete-package"
          data-id="order-detail-confirmValidDelivery-cancel"
        >
          <div class="icon-wrapper">
            <v-icon>mdi-exclamation-thick</v-icon>
          </div>
          <v-icon class="cross-icon" @click="cancel()">mdi-close</v-icon>
        </v-col>
      </v-row>
    </template>

    <template #content>
      <v-row no-gutters class="text-wrapper">
        <v-col cols="12">
          <h4 data-id="order-detail-confirmValidDelivery-text">
            {{ $t('validation.confirmation.validDelivery') }}
          </h4>
        </v-col>
      </v-row>
    </template>

    <template #actions>
      <v-row no-gutters class="actions-outer-wrapper">
        <v-col cols="12" class="actions-wrapper">
          <mp-button
            :text="$t('action.cancel.base')"
            format="link"
            linkColor="black"
            dataId="order-detail-confirmValidDelivery-cancel"
            @click="cancel()"
          />
          <mp-button
            :text="$t('action.valid.delivery')"
            format="success"
            dataId="order-detail-confirmValidDelivery-submit"
            @click="submit()"
          />
        </v-col>
      </v-row>
    </template>
  </mp-dialog>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'mp-order-detail-confirm-valid-delivery',
  props: {
    showDialog: {
      type: Boolean,
      required: true,
    },
  },
  methods: {
    cancel() {
      this.$emit('hide')
    },
    submit() {
      this.$emit('submit')
    },
  },
})
</script>

<style lang="scss">
#order-detail-confirm-valid-delivery {
  @media #{map-get($display-breakpoints, 'xs-only')} {
    .cross-icon {
      margin-left: auto !important;
      padding-right: 1rem;
    }
  }

  // header
  .modal-header-delete-package {
    display: flex;
    margin-top: 2.2rem;

    .icon-wrapper {
      min-height: 5rem;
      margin-left: 12.5rem;
      min-width: 5rem;
      border-radius: 2.5rem;
      background-color: $success-color;
      display: flex;
      justify-content: center;

      i {
        color: $white;
      }
    }

    .cross-icon {
      align-self: start;
      margin-left: 10rem;
    }
  }

  // content
  .text-wrapper {
    text-align: center !important;
    margin-top: 1.8rem;
    color: $main-color;
  }

  // actions
  .actions-outer-wrapper {
    text-align: center;
    margin-bottom: 2.8rem;

    .actions-wrapper {
      display: flex;
      justify-content: center;
      flex-direction: column-reverse;
      align-items: center;

      @media #{map-get($display-breakpoints, 'xs-only')} {
        width: 100%;
      }

      button {
        width: fit-content;
      }
    }
  }
}
</style>
