<template>
  <div id="detail-weighting" data-id="detail-weighting">
    <mp-block
      id="detail-weighting-block"
      :title="$vuetify.breakpoint.smAndUp ? $t('common.weighting.title') : ''"
      :hasBorder="$vuetify.breakpoint.smAndUp"
      :hasMarginBottom="$vuetify.breakpoint.smAndUp"
      titleHasPaddingBottom
      v-if="weightingIndexes"
    >
      <v-row
        no-gutters
        v-for="(weighting, index) of weightingKeys"
        :key="`weighting-${index}`"
        :class="
          `weighting${
            index === Object.keys(weightingIndexes).length - 1 ? ' no-border-bottom' : ''
          }`
        "
        :data-id="`detail-weighting-${weighting}`"
      >
        <v-col cols="8" class="label-wrapper">
          <v-icon v-if="weighting === 'price'" class="main-color" size="1.8rem">mdi-currency-usd</v-icon>
          <v-icon v-else-if="weighting === 'environment'" class="main-color" size="1.8rem">mdi-leaf</v-icon>
          <v-icon v-else-if="weighting === 'quality'" class="main-color" size="1.8rem">mdi-diamond-stone</v-icon>
          <span class="regular14 main-color">{{
            $t([`common.${weighting}`, `common.weighting.${weighting}`])
          }}</span>
        </v-col>
        <v-col cols="4" class="value-wrapper" :data-id="`detail-weighting-${weighting}-value`">
          <span class="regular14 main-color">{{ getValue(weightingIndexes[weighting]) }}</span>
        </v-col>
        <v-col cols="12" class="weighting--children" v-if="IsObject(weightingIndexes[weighting])">
          <span class="regular14 main-color">{{ $t(`common.weighting.${weighting}.title`) }}</span>
          <v-row
            no-gutters
            v-for="(key, subIndex) in weightingSubKeys[weighting]"
            :key="`weighting-subContent-${subIndex}`"
            :class="
              `weighting main-lighten-28 ${
                subIndex === Object.keys(weightingIndexes[weighting].detail).length - 1
                  ? ' no-border-bottom'
                  : ''
              }`
            "
            :data-id="`detail-weighting-${weighting}-${key}`"
          >
            <v-col cols="8" class="label-wrapper">
              <span class="regular14 main-lighten-52">{{ $t(`common.weighting.${weighting}.${key}`) }}</span>
            </v-col>
            <v-col
              cols="4"
              class="value-wrapper"
              :data-id="`detail-weighting-${weighting}-${key}-value`"
            >
              <span class="regular14 main-lighten-52">{{ getValue(weightingIndexes[weighting].detail[key]) }}</span>
            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <v-row no-gutters class="btn-wrapper" v-if="isRetailer || isAuthorized(getRule)">
        <v-col md="6" cols="12" class="d-flex justify-center">
          <mp-button
            format="secondary"
            :text="$t('action.delete.base')"
            icon="trash-can-outline"
            @click="showDeleteModal = true"
            dataId="detail-weighting-delete-btn"
            v-if="!isRetailer"
          />
        </v-col>
        <v-col
          :md="isRetailer ? 12 : 6"
          cols="12"
          :class="`d-flex justify-center${$vuetify.breakpoint.xsOnly ? ' mt-2' : ''}`"
        >
          <mp-button
            class="ml-1"
            format="primary"
            :text="$t('action.modify.base')"
            icon="pencil"
            @click="showEditModal = true"
            dataId="detail-weighting-edit-btn"
          />
        </v-col>
      </v-row>
    </mp-block>

    <mp-block
      id="detail-weighting-no-data-block"
      titleHasPaddingBottom
      :title="$vuetify.breakpoint.smAndUp ? $t('common.weighting.title') : ''"
      v-else
    >
      <v-row no-gutters>
        <v-col cols="12">
          <no-data dataId="detail-weighting-noData" :content="$t('common.noData.noContent')" />
        </v-col>
        <v-col cols="12" class="d-flex justify-center btn-wrapper" v-if="isAuthorized(getRule)">
          <mp-button
            class="ml-1"
            format="primary"
            :text="$t('action.add.base')"
            icon="plus"
            @click="showEditModal = true"
            dataId="detail-weighting-edit-btn"
          />
        </v-col>
      </v-row>
    </mp-block>

    <mp-edit-weighting
      v-if="showEditModal"
      :weightings.sync="weightingIndexes"
      @close="showEditModal = false"
    />

    <v-row v-if="showDeleteModal">
      <v-col cols="12">
        <mp-dialog-confirmation
          dataId="detail-weighting-modal-delete"
          :textContent="$t('action.weighting.delete')"
          @close="showDeleteModal = false"
          @submit="deleteWeighting()"
          color="error"
          :header="{
            icon: 'mdi-trash-can-outline',
            isColorBackground: false,
            iconClose: 'mdi-close',
          }"
          :btnCancel="{ text: $t('action.cancel.base'), format: 'link', linkColor: 'black' }"
          :btnValidation="{ text: $t('action.delete.base'), format: 'error' }"
          :btnToColumn="$vuetify.breakpoint.xsOnly"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import mixins from 'vue-typed-mixins'

import { WeightingIndexes } from '@/types'
import { ROUTES } from '@/constants'
import { authorizationMixin } from '@/mixins'

import mpBlock from '@/components/block/block.vue'
import mpEditWeighting from '@/components/weighting/edit/edit.vue'
import noData from '@/components/noData/noData.vue'

import StoreService from '@/services/store/StoreService'
import ExchangePlaceService from '@/services/exchangePlace/ExchangePlaceService'

export default mixins(authorizationMixin).extend({
  name: 'mp-detail-weighting',
  components: {
    mpBlock,
    mpEditWeighting,
    noData,
  },
  data: () => ({
    weightingKeys: ['price', 'environment', 'quality'],
    weightingSubKeys: {
      quality: ['satisfaction', 'nps', 'onTimeDeliveryScore'],
    },
    showEditModal: false,
    showDeleteModal: false,
    weightingIndexes: null,
  }),
  props: {
    weightings: {
      type: Object as () => WeightingIndexes,
      required: false,
    },
  },
  mounted() {
    if (!this.weightings) {
      return
    }

    this.weightingIndexes = JSON.parse(JSON.stringify(this.weightings))
  },
  methods: {
    getValue(weighting: WeightingIndexes[keyof WeightingIndexes]): string {
      if (weighting && typeof weighting === 'object') {
        return `${weighting.value} %`
      }

      return `${weighting} %`
    },
    IsObject(weighting: WeightingIndexes[keyof WeightingIndexes]) {
      return typeof weighting === 'object'
    },
    async deleteWeighting() {
      const {
        params: { storeId, exchangePlaceId },
        name,
      } = this.$route

      if (ROUTES.detailStore === name) {
        await StoreService.updateWeightingIndexes(storeId, { weightingIndexes: null })
      }

      if (ROUTES.exchangePlace === name) {
        await ExchangePlaceService.updateWeightingIndexes(exchangePlaceId, {
          weightingIndexes: null,
        })
      }

      this.weightingIndexes = null
      this.showDeleteModal = false
    },
  },
  computed: {
    isRetailer() {
      return ROUTES.detailRetailer === this.$route.name
    },
    getRule() {
      return ROUTES.detailStore === this.$route.name
        ? 'MANAGE_STORE_WEIGHTING_INDEXES'
        : 'MANAGE_EXCHANGE_PLACE_WEIGHTING_INDEXES'
    },
  },
})
</script>

<style lang="scss" scoped>
#detail-weighting {
  padding: 0;

  @media #{map-get($display-breakpoints, 'xs-only')} {
    border-top: solid 0.1rem $main-lighten-74-color;
  }
  
  .btn-wrapper {
    margin-top: 2.5rem;
    margin-bottom: 0.1rem;
  }

  .weighting {
    border-bottom: solid 0.1rem $main-lighten-74-color;
    display: flex;
    align-items: center;
    padding: 1.6rem 0;

    &:first-child {
        padding-top: 0;
      }

    &.no-border-bottom {
      border-bottom: none;
      padding-bottom: 0;
    }

    &--children {
      background-color: $main-lighten-80-color;
      padding: 3rem;
      margin-top: 2rem;
    }

    .label-wrapper {
      display: flex;
      align-items: center;

      i {
        margin-right: 1rem;
      }
    }

    .value-wrapper {
      text-align: right;
    }
  }
}
</style>
