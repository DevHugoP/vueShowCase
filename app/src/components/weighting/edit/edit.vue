<template>
  <mp-dialog-confirmation
    dataId="modal-edit-weighting"
    color="primary"
    @submit="update()"
    :header="{
      icon: 'mdi-pencil',
      isColorBackground: true,
      iconClose: 'mdi-close',
      text: $t('action.weighting.edit'),
    }"
    :btnCancel="{
      text: $t('action.cancel.base'),
      format: 'link',
      linkColor: 'black',
    }"
    :btnValidation="{
      text: $t('action.valid.base'),
      format: 'success',
      disabled: $v.$invalid,
    }"
    :btnToColumn="$vuetify.breakpoint.xsOnly"
    classWrapper="edit-weighting-indexes-dialog"
    @close="$emit('close')"
    :fullscreen="$vuetify.breakpoint.xsOnly"
  >
    <template #content>
      <v-row id="edit-weighting-indexes-container" no-gutters class="weighting" data-id="edit-weighting-indexes-container">
        <v-col cols="12" class="mb-5">
          <mp-textfield
            dataId="weighting-price"
            :label="`${$t('common.weighting.price')} *`"
            v-model="weightingIndexes.price"
            name="weighting-price"
            type="number"
            suffix="%"
            @input="$v.weightingIndexes.price.$touch()"
            @blur="$v.weightingIndexes.price.$touch()"
            :errors="getModelErrors($v.weightingIndexes.price)"
            :isDirty="$v.weightingIndexes.price.$dirty"
          />
        </v-col>

        <v-col cols="12" class="mb-5">
          <mp-textfield
            dataId="weighting-environment"
            :label="`${$t('common.weighting.environment')} *`"
            v-model="weightingIndexes.environment"
            name="weighting-environment"
            type="number"
            suffix="%"
            @input="$v.weightingIndexes.environment.$touch()"
            @blur="$v.weightingIndexes.environment.$touch()"
            :errors="getModelErrors($v.weightingIndexes.environment)"
            :isDirty="$v.weightingIndexes.environment.$dirty"
          />
        </v-col>

        <v-col cols="12">
          <mp-textfield
            dataId="weighting-quality"
            :label="`${$t('common.quality')} *`"
            v-model="weightingIndexes.quality.value"
            name="weighting-quality"
            type="number"
            suffix="%"
            @input="$v.weightingIndexes.quality.value.$touch()"
            @blur="$v.weightingIndexes.quality.value.$touch()"
            :errors="getModelErrors($v.weightingIndexes.quality.value)"
            :isDirty="$v.weightingIndexes.quality.value.$dirty"
          />
        </v-col>
        <v-col cols="12" class="weighting--children">
          <span class="medium14">{{ $t(`common.weighting.quality.title`) }}</span>
          <v-row
            no-gutters
            class="weighting main-lighten-28 mt-4"
            data-id="edit-weighting-quality-detail"
          >
            <v-col cols="12" class="mb-5">
              <mp-textfield
                dataId="weighting-quality-satisfaction"
                :label="`${$t('common.weighting.quality.satisfaction')} *`"
                v-model="weightingIndexes.quality.detail.satisfaction"
                name="weighting-quality-satisfaction"
                type="number"
                suffix="%"
                @input="$v.weightingIndexes.quality.detail.satisfaction.$touch()"
                @blur="$v.weightingIndexes.quality.detail.satisfaction.$touch()"
                :errors="getModelErrors($v.weightingIndexes.quality.detail.satisfaction)"
                :isDirty="$v.weightingIndexes.quality.detail.satisfaction.$dirty"
              />
            </v-col>
            <v-col cols="12" class="mb-5">
              <mp-textfield
                dataId="weighting-quality-nps"
                :label="`${$t('common.weighting.quality.nps')} *`"
                v-model="weightingIndexes.quality.detail.nps"
                name="weighting-quality-nps"
                type="number"
                suffix="%"
                @input="$v.weightingIndexes.quality.detail.nps.$touch()"
                @blur="$v.weightingIndexes.quality.detail.nps.$touch()"
                :errors="getModelErrors($v.weightingIndexes.quality.detail.nps)"
                :isDirty="$v.weightingIndexes.quality.detail.nps.$dirty"
              />
            </v-col>
            <v-col cols="12">
              <mp-textfield
                dataId="weighting-quality-onTimeDeliveryScore"
                :label="`${$t('common.weighting.quality.onTimeDeliveryScore')} *`"
                v-model="weightingIndexes.quality.detail.onTimeDeliveryScore"
                name="weighting-quality-onTimeDeliveryScore"
                type="number"
                suffix="%"
                @input="$v.weightingIndexes.quality.detail.onTimeDeliveryScore.$touch()"
                @blur="$v.weightingIndexes.quality.detail.onTimeDeliveryScore.$touch()"
                :errors="getModelErrors($v.weightingIndexes.quality.detail.onTimeDeliveryScore)"
                :isDirty="$v.weightingIndexes.quality.detail.onTimeDeliveryScore.$dirty"
              />
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </template>
  </mp-dialog-confirmation>
</template>

<script lang="ts">
import mixins from 'vue-typed-mixins'
import { required, maxValue, minValue } from 'vuelidate/lib/validators'

import { getDefaultWeightingIndexes, WeightingIndexes } from '@/types'
import { validationMixin } from '@/mixins'
import mpBlock from '@/components/block/block.vue'

import { ROUTES } from '@/constants'
import RetailerService from '@/services/retailer/RetailerService'
import StoreService from '@/services/store/StoreService'
import ExchangePlaceService from '@/services/exchangePlace/ExchangePlaceService'

export default mixins(validationMixin).extend({
  name: 'mp-edit-weighting',
  components: {
    mpBlock,
  },
  data: () => ({
    weightingIndexes: getDefaultWeightingIndexes(),
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
  computed: {
    sumOfIndexesIsEqualTo100() {
      const { price, environment, quality } = this.weightingIndexes

      if (price || environment || quality?.value) {
        const sum =
          parseInt((price || 0) as string, 10) +
          parseInt((environment || 0) as string, 10) +
          parseInt((quality?.value || 0) as string, 10)

        return sum === 100
      }

      return true
    },
    sumOfQualityIsEqual100() {
      const { quality } = this.weightingIndexes

      if (!quality.detail) {
        return false
      }

      return (
        Object.values(quality.detail).reduce(
          (acc: number, value) => acc + parseInt((value || 0) as string, 10),
          0,
        ) === 100
      )
    },
  },
  validations() {
    const sumOfIndexesIsEqualTo100 = JSON.parse(JSON.stringify(this.sumOfIndexesIsEqualTo100))
    const sumOfQualityIsEqual100 = JSON.parse(JSON.stringify(this.sumOfQualityIsEqual100))

    return {
      weightingIndexes: {
        price: {
          required,
          minValue: minValue(0),
          maxValue: maxValue(100),
          maxCombined() {
            return sumOfIndexesIsEqualTo100
          },
        },
        environment: {
          required,
          minValue: minValue(0),
          maxValue: maxValue(100),
          maxCombined() {
            return sumOfIndexesIsEqualTo100
          },
        },
        quality: {
          value: {
            required,
            minValue: minValue(0),
            maxValue: maxValue(100),
            maxCombined() {
              return sumOfIndexesIsEqualTo100
            },
          },
          detail: {
            satisfaction: {
              required,
              minValue: minValue(0),
              maxValue: maxValue(100),
              maxCombined() {
                return sumOfQualityIsEqual100
              },
            },
            nps: {
              required,
              minValue: minValue(0),
              maxValue: maxValue(100),
              maxCombined() {
                return sumOfQualityIsEqual100
              },
            },
            onTimeDeliveryScore: {
              required,
              minValue: minValue(0),
              maxValue: maxValue(100),
              maxCombined() {
                return sumOfQualityIsEqual100
              },
            },
          },
        },
      },
    }
  },
  methods: {
    async update() {
      const {
        params: { id, storeId, exchangePlaceId },
        name,
      } = this.$route
      const { weightingIndexes } = this

      if (ROUTES.detailRetailer === name) {
        await RetailerService.update(id, { weightingIndexes })
      }

      if (ROUTES.detailStore === name) {
        await StoreService.updateWeightingIndexes(storeId, { weightingIndexes })
      }

      if (ROUTES.exchangePlace === name) {
        await ExchangePlaceService.updateWeightingIndexes(exchangePlaceId, { weightingIndexes })
      }

      this.$emit('close')
      this.$emit('update:weightings', weightingIndexes)
    },
  },
})
</script>

<style lang="scss">
@import '../../../styles/mixins/macScrollbar';

.edit-weighting-indexes-dialog {
  @media #{map-get($display-breakpoints, 'sm-and-up')} {
    .main-dialog-content {
      max-height: calc(60vh - 8rem);

      overflow-y: scroll;
      overflow-x: hidden;
      @include setMacScrollbar('&');
    }
  }
}

#edit-weighting-indexes-container {
  padding: 3rem;

  .weighting {
    &--children {
      background-color: $main-lighten-80-color;
      padding: 3rem;
      margin-top: 2rem;
    }
  }
}
</style>
