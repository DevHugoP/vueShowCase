<template>
  <div id="retailer-create-weighting" data-id="edit-weighting">
    <!-- title -->
    <v-row no-gutters class="title-outer-wrapper mb-5">
      <v-col cols="12">
        <h2 data-id="retailer-create-weightings-title">{{ $t('common.weightingIndex') }}</h2>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="8" lg="6">
        <mp-textfield
          dataId="retailer-create-weighting-price"
          :label="`${$t('common.weighting.price')} *`"
          v-model="retailer.weightingIndexes.price"
          name="weighting-price"
          type="number"
          suffix="%"
          @input="$v.retailer.weightingIndexes.price.$touch()"
          @blur="$v.retailer.weightingIndexes.price.$touch()"
          :errors="getModelErrors($v.retailer.weightingIndexes.price)"
          :isDirty="$v.retailer.weightingIndexes.price.$dirty"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="8" lg="6">
        <mp-textfield
          dataId="retailer-create-weighting-environment"
          :label="`${$t('common.weighting.environment')} *`"
          v-model="retailer.weightingIndexes.environment"
          name="weighting-environment"
          type="number"
          suffix="%"
          @input="$v.retailer.weightingIndexes.environment.$touch()"
          @blur="$v.retailer.weightingIndexes.environment.$touch()"
          :errors="getModelErrors($v.retailer.weightingIndexes.environment)"
          :isDirty="$v.retailer.weightingIndexes.environment.$dirty"
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="8" lg="6">
        <mp-textfield
          dataId="retailer-create-weighting-quality"
          :label="`${$t('common.quality')} *`"
          v-model="retailer.weightingIndexes.quality.value"
          name="weighting-quality"
          type="number"
          suffix="%"
          @input="$v.retailer.weightingIndexes.quality.value.$touch()"
          @blur="$v.retailer.weightingIndexes.quality.value.$touch()"
          :errors="getModelErrors($v.retailer.weightingIndexes.quality.value)"
          :isDirty="$v.retailer.weightingIndexes.quality.value.$dirty"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="8" lg="6" class="weighting-children">
        <span class="medium14">{{ $t(`common.weighting.quality.title`) }}</span>
        <v-row
          no-gutters
          class="weighting main-lighten-28 mt-4"
          data-id="retailer-create-weighting-quality-detail"
        >
          <v-col cols="12">
            <mp-textfield
              dataId="retailer-create-weighting-quality-satisfaction"
              :label="`${$t('common.weighting.quality.satisfaction')} *`"
              v-model="retailer.weightingIndexes.quality.detail.satisfaction"
              name="weighting-quality-satisfaction"
              type="number"
              suffix="%"
              @input="$v.retailer.weightingIndexes.quality.detail.satisfaction.$touch()"
              @blur="$v.retailer.weightingIndexes.quality.detail.satisfaction.$touch()"
              :errors="getModelErrors($v.retailer.weightingIndexes.quality.detail.satisfaction)"
              :isDirty="$v.retailer.weightingIndexes.quality.detail.satisfaction.$dirty"
            />
          </v-col>
          <v-col cols="12">
            <mp-textfield
              dataId="retailer-create-weighting-quality-nps"
              :label="`${$t('common.weighting.quality.nps')} *`"
              v-model="retailer.weightingIndexes.quality.detail.nps"
              name="weighting-quality-nps"
              type="number"
              suffix="%"
              @input="$v.retailer.weightingIndexes.quality.detail.nps.$touch()"
              @blur="$v.retailer.weightingIndexes.quality.detail.nps.$touch()"
              :errors="getModelErrors($v.retailer.weightingIndexes.quality.detail.nps)"
              :isDirty="$v.retailer.weightingIndexes.quality.detail.nps.$dirty"
            />
          </v-col>
          <v-col cols="12">
            <mp-textfield
              dataId="retailer-createweighting-quality-onTimeDeliveryScore"
              :label="`${$t('common.weighting.quality.onTimeDeliveryScore')} *`"
              v-model="retailer.weightingIndexes.quality.detail.onTimeDeliveryScore"
              name="weighting-quality-onTimeDeliveryScore"
              type="number"
              suffix="%"
              @input="$v.retailer.weightingIndexes.quality.detail.onTimeDeliveryScore.$touch()"
              @blur="$v.retailer.weightingIndexes.quality.detail.onTimeDeliveryScore.$touch()"
              :errors="
                getModelErrors($v.retailer.weightingIndexes.quality.detail.onTimeDeliveryScore)
              "
              :isDirty="$v.retailer.weightingIndexes.quality.detail.onTimeDeliveryScore.$dirty"
            />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import mixins from 'vue-typed-mixins'

import { RetailerEntity } from '@/types'

import { validationMixin } from '@/mixins'
import { required, maxValue, minValue } from 'vuelidate/lib/validators'

export default mixins(validationMixin).extend({
  name: 'retailer-create-weightings',
  props: {
    retailer: {
      type: Object as () => RetailerEntity,
      required: true,
    },
  },
  computed: {
    sumOfIndexesIsEqualTo100() {
      const { price, environment, quality } = this.retailer.weightingIndexes

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
      const { quality } = this.retailer.weightingIndexes

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
      retailer: {
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
      },
    }
  },
  mounted() {
    this.$emit('invalid', this.$v.retailer.$invalid)
  },
  watch: {
    '$v.retailer.$invalid'(next) {
      this.$emit('invalid', next)
    },
  },
})
</script>

<style lang="scss" scoped>
#retailer-create-weighting {
  .weighting-children {
    background-color: $main-lighten-80-color;
    padding: 3rem;
  }
}
</style>
