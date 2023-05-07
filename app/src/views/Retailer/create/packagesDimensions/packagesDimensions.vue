<template>
  <div id="retailer-packages-dimensions" data-id="retailer-packages-dimensions">
    <!-- title -->
    <v-row no-gutters class="title-outer-wrapper">
      <v-col cols="12">
        <h2 data-id="retailer-packages-dimensions-title">{{ $t('common.packagesDimensions') }}</h2>
      </v-col>
    </v-row>

    <div v-if="$vuetify.breakpoint.smAndUp">
      <v-row
        justify="space-between"
        align-content="center"
        v-for="(packageDimension, index) in packagesDimensions"
        :key="index"
        no-gutters
      >
        <v-col cols="12" :key="`dimension-${index}`" class="d-flex">
          <mp-textfield
            class="pr-2"
            :label="`${$t('common.name')} *`"
            v-model="packageDimension.label"
            :dataId="`package-dimensions-label-${index}`"
            @input="$v.packagesDimensions.$each[index].label.$touch()"
            @blur="$v.packagesDimensions.$each[index].label.$touch()"
            :errors="getModelErrors($v.packagesDimensions.$each[index].label)"
            :isDirty="$v.packagesDimensions.$each[index].label.$dirty"
          />

          <mp-textfield
            class="pr-2"
            :label="`${$t('common.length')} *`"
            v-model="packageDimension.dimension.length.value"
            :dataId="`package-dimensions-length-value-${index}`"
            @input="$v.packagesDimensions.$each[index].dimension.length.value.$touch()"
            @blur="$v.packagesDimensions.$each[index].dimension.length.value.$touch()"
            :errors="getModelErrors($v.packagesDimensions.$each[index].dimension.length.value)"
            :isDirty="$v.packagesDimensions.$each[index].dimension.length.value.$dirty"
          />

          <mp-textfield
            class="pr-2"
            :label="`${$t('common.width')} *`"
            v-model="packageDimension.dimension.width.value"
            :dataId="`package-dimensions-width-value-${index}`"
            @input="$v.packagesDimensions.$each[index].dimension.width.value.$touch()"
            @blur="$v.packagesDimensions.$each[index].dimension.width.value.$touch()"
            :errors="getModelErrors($v.packagesDimensions.$each[index].dimension.width.value)"
            :isDirty="$v.packagesDimensions.$each[index].dimension.width.value.$dirty"
          />

          <mp-textfield
            class="pr-2"
            :label="`${$t('common.height')} *`"
            v-model="packageDimension.dimension.height.value"
            :dataId="`package-dimensions-height-value-${index}`"
            @input="$v.packagesDimensions.$each[index].dimension.height.value.$touch()"
            @blur="$v.packagesDimensions.$each[index].dimension.height.value.$touch()"
            :errors="getModelErrors($v.packagesDimensions.$each[index].dimension.height.value)"
            :isDirty="$v.packagesDimensions.$each[index].dimension.height.value.$dirty"
          />

          <mp-select
            class="pr-2"
            ref="package-dimension-unit"
            :dataId="`package-dimensions-unit-${index}`"
            :label="`${$t('common.unit.base')} *`"
            :items="units"
            v-model="packageDimension.dimension.height.unit"
            @input="$v.packagesDimensions.$each[index].dimension.height.unit.$touch()"
            @blur="$v.packagesDimensions.$each[index].dimension.height.unit.$touch()"
            :errors="getModelErrors($v.packagesDimensions.$each[index].dimension.height.unit)"
            :isDirty="$v.packagesDimensions.$each[index].dimension.height.unit.$dirty"
          />

          <v-icon
            size="2rem"
            @click="deleteDimension(index)"
            :key="`trash-${index}`"
          >
            mdi-trash-can-outline
          </v-icon>
        </v-col>
      </v-row>

      <mp-button
        format="link"
        linkColor="black"
        :text="`+ ${$t('action.add.packageDimension')}`"
        dataId="retailer-packages-dimensions-add"
        @click="addDimension"
      />
    </div>

    <div v-else>
      <v-row no-gutters class="chip-outer-wrapper">
        <v-col cols="12" class="chip-wrapper">
          <v-chip
            class="chip regular16 first-selection-chip"
            @click="addDimension()"
            data-id="carrier-create-addCriteria"
          >
            +
          </v-chip>
          <v-chip
            v-for="(packageDimension, index) in packagesDimensions"
            :key="index"
            outlined
            @click="selectedChips = index"
            dataId="package-dimensions-label"
            :class="`regular16 chip${index === selectedChips ? ' chip-active' : ''}`"
          >
            {{ packageDimension.label }}
          </v-chip>
        </v-col>
      </v-row>

      <v-row v-if="packagesDimensions.length > 0" no-gutters>
        <v-col cols="12">
          <mp-textfield
            class="mb-3"
            :key="`label-${selectedChips}`"
            :label="`${$t('common.name')} *`"
            v-model="packagesDimensions[selectedChips].label"
            :dataId="`package-dimensions-label-${selectedChips}`"
            @input="$v.packagesDimensions.$each[selectedChips].label.$touch()"
            @blur="$v.packagesDimensions.$each[selectedChips].label.$touch()"
            :errors="getModelErrors($v.packagesDimensions.$each[selectedChips].label)"
            :isDirty="$v.packagesDimensions.$each[selectedChips].label.$dirty"
          />
        </v-col>
        <v-col cols="12">
          <mp-textfield
            class="mb-3"
            :key="`length-${selectedChips}`"
            :label="`${$t('common.length')} *`"
            v-model="packagesDimensions[selectedChips].dimension.length.value"
            :dataId="`package-dimensions-length-value-${selectedChips}`"
            @input="$v.packagesDimensions.$each[selectedChips].dimension.length.value.$touch()"
            @blur="$v.packagesDimensions.$each[selectedChips].dimension.length.value.$touch()"
            :errors="
              getModelErrors($v.packagesDimensions.$each[selectedChips].dimension.length.value)
            "
            :isDirty="$v.packagesDimensions.$each[selectedChips].dimension.length.value.$dirty"
          />
        </v-col>
        <v-col cols="12">
          <mp-textfield
            class="mb-3"
            :key="`width-${selectedChips}`"
            :label="`${$t('common.width')} *`"
            v-model="packagesDimensions[selectedChips].dimension.width.value"
            :dataId="`package-dimensions-width-value-${selectedChips}`"
            @input="$v.packagesDimensions.$each[selectedChips].dimension.width.value.$touch()"
            @blur="$v.packagesDimensions.$each[selectedChips].dimension.width.value.$touch()"
            :errors="
              getModelErrors($v.packagesDimensions.$each[selectedChips].dimension.width.value)
            "
            :isDirty="$v.packagesDimensions.$each[selectedChips].dimension.width.value.$dirty"
          />
        </v-col>
        <v-col cols="12">
          <mp-textfield
            class="mb-3"
            :key="`height-${selectedChips}`"
            :label="`${$t('common.height')} *`"
            v-model="packagesDimensions[selectedChips].dimension.height.value"
            :dataId="`package-dimensions-height-value-${selectedChips}`"
            @input="$v.packagesDimensions.$each[selectedChips].dimension.height.value.$touch()"
            @blur="$v.packagesDimensions.$each[selectedChips].dimension.height.value.$touch()"
            :errors="
              getModelErrors($v.packagesDimensions.$each[selectedChips].dimension.height.value)
            "
            :isDirty="$v.packagesDimensions.$each[selectedChips].dimension.height.value.$dirty"
          />
        </v-col>
        <v-col cols="12">
          <mp-select
            :key="`packageDimension-${selectedChips}`"
            ref="package-dimension-unit"
            :dataId="`package-dimensions-unit-${selectedChips}`"
            :label="`${$t('common.unit.base')} *`"
            :items="units"
            v-model="packagesDimensions[selectedChips].dimension.height.unit"
            @input="$v.packagesDimensions.$each[selectedChips].dimension.height.unit.$touch()"
            @blur="$v.packagesDimensions.$each[selectedChips].dimension.height.unit.$touch()"
            :errors="
              getModelErrors($v.packagesDimensions.$each[selectedChips].dimension.height.unit)
            "
            :isDirty="$v.packagesDimensions.$each[selectedChips].dimension.height.unit.$dirty"
          />
        </v-col>

        <v-col cols="12" class="d-flex justify-center">
          <mp-button
            format="secondary"
            :text="$t('action.deletePackageDimension')"
            icon="trash-can-outline"
            :dataId="`package-dimension-delete-${selectedChips}`"
            @click="deleteDimension(selectedChips)"
          />
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script lang="ts">
import { PACKAGE_LENGTH } from '@/constants/shared'
import { maxInt } from '@/constants'
import isDecimalTooLong from '@/helpers/decimalHelper'
import mixins from 'vue-typed-mixins'

import { PackagesDimensions, RetailerEntity } from '@/types'

import RetailerService from '@/services/retailer/RetailerService'

import { validationMixin } from '@/mixins'
import { required, minValue, decimal, maxValue } from 'vuelidate/lib/validators'

export default mixins(validationMixin).extend({
  name: 'packages-dimensions',
  props: {
    retailer: {
      type: Object as () => RetailerEntity,
      required: true,
    },
  },
  data: () => ({
    packagesDimensions: [] as PackagesDimensions[],
    units: PACKAGE_LENGTH as string[],
    selectedChips: 0,
  }),
  validations: {
    packagesDimensions: {
      $each: {
        label: { required },
        dimension: {
          length: {
            value: {
              required,
              decimal,
              maxValue: maxValue(maxInt),
              minValue: minValue(0),
              isDecimalTooLong: (value): boolean => {
                return isDecimalTooLong(3)(value)
              }
            },
          },
          width: {
            value: {
              required,
              decimal,
              maxValue: maxValue(maxInt),
              minValue: minValue(0),
              isDecimalTooLong: (value): boolean => {
                return isDecimalTooLong(3)(value)
              }
            },
          },
          height: {
            value: {
              required,
              decimal,
              maxValue: maxValue(maxInt),
              minValue: minValue(0),
              isDecimalTooLong: (value): boolean => {
                return isDecimalTooLong(3)(value)
              }
            },
            unit: { required },
          },
        },
      },
    },
  },
  mounted() {
    this.packagesDimensions = this.retailer.packagesDimensions || []
    this.$emit('invalid', this.$v.packagesDimensions.$invalid)
  },
  methods: {
    addDimension() {
      const index = this.packagesDimensions.push(
        RetailerService.getDefaultPackageDimension() as any,
      )

      this.selectedChips = index - 1
    },
    deleteDimension(index: number) {
      this.packagesDimensions.splice(index, 1)

      this.selectedChips = 0
    },
  },
  watch: {
    '$v.packagesDimensions.$invalid'(next) {
      this.$emit('invalid', next)
    },
  },
})
</script>

<style lang="scss">
#retailer-packages-dimensions {
  padding: 0;
  margin-bottom: 8rem;

  .title-outer-wrapper {
    margin-bottom: 2.5rem;
  }

  .first-selection-chip {
    background-color: $primary-color;
    border: none !important;
  }

  .chip-outer-wrapper {
    margin-bottom: 3rem;

    .chip-wrapper {
      display: flex;
      overflow: scroll;

      .first-selection-chip {
        background-color: $primary-color;
        border: none !important;
      }

      .chip {
        text-transform: capitalize;
        margin-right: 1rem;
        margin-bottom: 1rem;
        border: solid 0.1rem $main-lighten-74-color;
        min-width: fit-content;

        &.chip-active {
          border: solid 0.2rem $main-color;
        }
      }
    }
  }

  @media #{map-get($display-breakpoints, 'xs-only')} {
    .mp-radio {
      padding-top: 1rem;
    }
  }
}
</style>
