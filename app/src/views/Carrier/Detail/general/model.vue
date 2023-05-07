<template>
  <mp-block
    id="carrier-delivery-model-block"
    :title="$vuetify.breakpoint.smAndUp ? $t('page.carrier.deliveryModel.title') : ''"
    :hasBorder="$vuetify.breakpoint.smAndUp"
    :hasMarginBottom="$vuetify.breakpoint.smAndUp"
    titleHasPaddingBottom
    :hasEditIcon="hasEditIcon"
    @clickOnIcon="showModal = true"
  >
    <div>
      <v-row
        no-gutters
        v-for="(localModel, index) in localModels"
        class="delivery-model-wrapper"
        :key="`carrier-delivery-model-block-${index}`"
      >
        <v-col cols="12" class="delivery-model-wrapper">
          <v-icon
            size="1.8rem"
            v-if="
              carrier.models &&
                carrier.models.includes(
                  localModel,
                )
            "
          >
            mdi-check-bold
          </v-icon>
          <v-icon size="1.8rem" class="icon-error" v-else>mdi-close-thick</v-icon>
          <span
            :class="$vuetify.breakpoint.smAndUp ? 'regular14 main-color' : 'regular16'"
            :data-id="`carrier-delivery-model-${localModel.toLowerCase()}`"
          >
            {{ $t(`page.carrier.deliveryModel.${localModel.toLowerCase()}`) }}
          </span>
        </v-col>
      </v-row>
    </div>

    <mp-dialog-confirmation
      v-if="showModal"
      dataId="carrier-delivery-model-modal"
      classWrapper="carrier-delivery-model-modal"
      color="primary"
      :header="{
        iconClose: 'mdi-close',
        icon: $vuetify.breakpoint.smAndUp ? 'mdi-pencil' : '',
        isColorBackground: true,
        text: $t('action.modify.model'),
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
            v-for="(localModel, index) in localModels"
            :key="`local-model-${index}`"
            class="row-wrapper"
          >
            <mp-checkbox-new
              :label="
                $t(`page.carrier.deliveryModel.${localModel.toLowerCase()}`)
              "
              v-model="editModel"
              :value="localModel"
              :hide-details="true"
              :dataId="`carrier-delivery-model-checkbox-${index}`"
            />
          </v-col>
        </v-row>
      </template>
    </mp-dialog-confirmation>
  </mp-block>
</template>

<script lang="ts">
import { CarrierEntity, MODELS } from '@/types'

import mpBlock from '@/components/block/block.vue'

import Vue from 'vue'
import CarrierService from '@/services/carrier/CarrierService'
import { SnackBarType } from '@/store/types'

export default Vue.extend({
  name: 'mp-carrier-detail-model',
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
    localModels: [] as MODELS[],
    showModal: false,
    editModel: [] as MODELS[],
  }),
  beforeMount() {
    const localModels = Object.values(MODELS)
    this.localModels = localModels.filter((type) => type !== MODELS.MODEL && type !== MODELS.ALL)
  },
  methods: {
    async handleSubmit(): Promise<void> {
      try {
        await CarrierService.update(this.carrier.id, {
          models: this.editModel.length ? this.editModel : null,
        })
        this.carrier.models = this.editModel
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
        this.editModel = []
        return
      }

      this.editModel = this.carrier.models || []
    },
  },
})
</script>

<style lang="scss">
#carrier-delivery-model-block {
  padding: 0;

  @media #{map-get($display-breakpoints, 'xs-only')} {
    border-top: solid 0.1rem $main-lighten-74-color;
  }

  .icon-error {
    color: $error-color;
  }

  .delivery-model-wrapper {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding-left: 0;
    margin-bottom: 1.6rem;

    &:last-of-type {
      margin-bottom: 0;
    }

    i {
      margin-right: 1.2rem;
    }
  }
}

.carrier-delivery-model-modal {
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
