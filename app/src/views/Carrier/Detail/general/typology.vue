<template>
  <v-container id="carrier-detail-typology" data-id="carrier-detail-typology">
    <mp-block
      id="carrrier-detail-typology-block"
      :title="$vuetify.breakpoint.smAndUp ? $t('page.carrier.typology.title') : ''"
      :hasBorder="$vuetify.breakpoint.smAndUp"
      :hasMarginBottom="$vuetify.breakpoint.smAndUp"
      titleHasPaddingBottom
      :hasEditIcon="hasEditIcon && localTypos && !!localTypos.length"
      @clickOnIcon="showModal = true"
      class="padding-bottom"
    >
      <div
        class="typology-wrapper"
        v-if="localTypos && localTypos.length"
      >
        <v-row
          v-for="(typology, index) in localTypos"
          :key="`carrier-detail-typology-${index}`"
          class="typology-detail"
          no-gutters
        >
          <img class="typology-icon" :src="imgs[index]" />
          <span
            :class="$vuetify.breakpoint.smAndUp ? 'regular14' : 'regular16'"
            :data-id="`carrier-detail-typology-${typology}`"
          >
            {{ $t(`technical.typologies.${typology}`) }}
          </span>
        </v-row>
      </div>

      <v-row no-gutters v-else>
        <v-col cols="12" class="no-data-wrapper">
          <no-data
            dataId="carrrier-detail-typology-block-noData"
            :content="$t('common.noData.typology')"
          />

          <mp-button
            v-if="hasEditIcon && $vuetify.breakpoint.smAndUp"
            format="primary"
            :text="$t('action.add.base')"
            icon="plus"
            class="mp-button"
            @click="showModal = true"
            dataId="carrrier-detail-typology-block-add"
          />
        </v-col>
      </v-row>

      <mp-dialog-confirmation
        v-if="showModal"
        dataId="carrier-delivery-typology-modal"
        classWrapper="carrier-delivery-typology-modal"
        color="primary"
        :fullscreen="$vuetify.breakpoint.xsOnly"
        :header="{
          iconClose: 'mdi-close',
          icon: $vuetify.breakpoint.smAndUp ? 'mdi-pencil' : '',
          isColorBackground: true,
          text: $t('action.modify.typology'),
          textPolice: 'medium16',
        }"
        :btnValidation="{
          text: $t('action.save'),
          format: 'success',
          icon: 'content-save-outline',
          disabled: !editTypologies.length,
          loading,
        }"
        :btnCancel="{ text: $t('action.cancel.base'), format: 'link', linkColor: 'black' }"
        @close="showModal = !showModal"
        @submit="handleSubmit()"
      >
        <template #content>
          <v-row no-gutters>
            <v-col
              cols="10"
              offset="1"
              class="row-wrapper"
              v-for="(typology, index) in allowedTypologies"
              :key="`typologies-${index}`"
            >
              <mp-checkbox-new
                :label="$t(`technical.typologies.${typology}`)"
                v-model="editTypologies"
                :value="typology"
                :hide-details="true"
                :data-id="`carrier-typologies-checkbox-${typology}`"
              />
            </v-col>
          </v-row>
        </template>
      </mp-dialog-confirmation>
    </mp-block>
  </v-container>
</template>

<script lang="ts">
/* eslint no-undef: off, @typescript-eslint/no-var-requires: off */
import { AVAILABLE_PRODUCT_TYPOLOGIES } from '@/constants/shared'
import { GetCarrierParams } from '@/services/carrier/CarrierRepository'
import OrderEligibilityService from '@/services/orderEligibility/OrderEligibilityService'
import Vue from 'vue'

import mpBlock from '@/components/block/block.vue'
import noData from '@/components/noData/noData.vue'

import { CarrierEligibilityEntity } from '@/types'
import { SnackBarType } from '@/store/types'

export default Vue.extend({
  name: 'carrier-detail-typology',
  components: {
    mpBlock,
    noData,
  },
  props: {
    orderEligibility: {
      type: Object as () => CarrierEligibilityEntity,
      required: true,
    },
    parent: {
      type: Object as () => CarrierEligibilityEntity | null,
      default: null,
    },
    params: {
      type: Object as () => GetCarrierParams,
      required: true,
    },
    hasEditIcon: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      loading: false,
      localTypos: [] as string[] | undefined,
      imgs: [] as NodeRequire[],
      showModal: false,
      editTypologies: [] as string[],
      allowedTypologies: AVAILABLE_PRODUCT_TYPOLOGIES as unknown as string[],
    }
  },
  mounted() {
    const { typologies } = this.orderEligibility
    this.localTypos = typologies

    if (this.parent?.typologies?.length) {
      this.allowedTypologies = this.parent.typologies
    }

    this.loadImages()
  },
  methods: {
    loadImages() {
      this.localTypos?.forEach(current => {
        this.imgs.push(require(`@/assets/icons/typologies/${current.toLowerCase()}.svg`))
      })
    },
    async handleSubmit() {
      try {
        this.loading = true
        await OrderEligibilityService.update(this.params, {
          typologies: this.editTypologies,
        })
        this.orderEligibility.typologies = this.editTypologies
        this.localTypos = this.editTypologies
        this.$store.dispatch('setSnackbar', {
          message: this.$t('messages.carrierUpdated'),
          type: SnackBarType.SUCCESS,
        })
        this.loadImages()
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
        this.editTypologies = []
        return
      }

      this.editTypologies = this.localTypos || []
    },
  },
})
</script>

<style lang="scss">
.carrier-delivery-typology-modal {
  .main-dialog-content {
    @media #{map-get($display-breakpoints, 'sm-and-up')} {
      @import '../../../../styles/mixins/macScrollbar';
      @include setMacScrollbar('&');
      max-height: calc(100vh - 33rem);
      overflow-y: scroll;
    }

    .row-wrapper {
      display: flex;
      justify-content: space-between;
      padding-bottom: 2rem !important;

      &:first-of-type {
        padding-top: 4.1rem;
      }

      &:last-of-type {
        border-bottom: none;
      }
    }
  }
  .v-card__actions {
    border-top: 0.1rem solid $main-lighten-74-color;
  }
}

#carrier-detail-typology {
  padding: 0;
  .padding-bottom {
    padding-bottom: 0 !important;
  }

  @media #{map-get($display-breakpoints, 'xs-only')} {
    border-top: solid 0.1rem $main-lighten-74-color;
  }

  .no-data-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-bottom: 2.6rem;

    .action-outer-wrapper {
      padding-bottom: 2.5rem;
    }

    .mp-button {
      margin-top: 2.5rem;
      margin-bottom: 0.1rem;
    }
  }

  .typology-wrapper {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    width: 100%;
    flex-wrap: wrap;

    .typology-detail {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 17.7rem;
      margin-bottom: 5.2rem;

      @media #{map-get($display-breakpoints, 'xs-only')} {
        width: 14.2rem;
      }

      text-align: center;
      white-space: pre-wrap;

      .typology-icon {
        height: 5rem;
        width: 5rem;
      }

      span {
        margin-top: 1rem;
      }
    }
  }
}
</style>
