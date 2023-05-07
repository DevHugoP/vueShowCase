<template>
  <div id="package-selection-form" class="pt-4">
    <v-row no-gutters class="mb-5 package-size-wrapper">
      <header class="radio-group-header regular12">
        <span>
          {{ $t('page.createOrder.steps.step2.packageForm.size') }}
          <v-chip small class="ship">
            {{
              $t('page.createOrder.steps.step2.packageForm.dimension', {
                ...getDimension(),
              })
            }}
          </v-chip>
        </span>
      </header>

      <mp-radio-group
        :disabled="useCustomDimension"
        class="radio-group-custom"
        row
        dataId="product-return-package-step-formPackage-size"
        name="packageSize"
        v-model="packages.packageSize"
        @input="$v.packages.packageSize.$touch()"
        @blur="$v.packages.packageSize.$touch()"
        :errors="getModelErrors($v.packages.packageSize)"
        :radioValues="availablePackageSize"
      />

      <div class="py-6 px-6 use-custom-dimension">
        <div class="swith-wrapper">
          <span class="regular14">{{ $t('page.productReturn.packages.size.custom') }}</span>
          <mp-switch
            name="customDimension"
            :value="useCustomDimension"
            @change="handleCustomDimension()"
            dataId="product-return-package-step-formPackage-custom-dimension"
          />
        </div>

        <div class="mt-6" v-if="useCustomDimension">
          <v-row no-gutters class="mb-3">
            <v-col
              cols="12"
              space-between
              :class="`pr-5 ${$vuetify.breakpoint.xsOnly ? 'flex-column' : 'd-flex'}`"
            >
              <mp-textfield
                :class="$vuetify.breakpoint.smAndUp ? 'pr-2' : ''"
                :label="`${$t('page.createOrder.steps.step2.productForm.length')} *`"
                type="number"
                name="package-length"
                v-model="packages.customDimension.length"
                @input="$v.packages.customDimension.length.$touch()"
                @blur="$v.packages.customDimension.length.$touch()"
                :errors="getModelErrors($v.packages.customDimension.length)"
                :isDirty="$v.packages.customDimension.length.$dirty"
                dataId="product-return-package-step-formPackage-length"
                suffix="cm"
              />

              <mp-textfield
                :class="$vuetify.breakpoint.smAndUp ? 'pr-2' : ''"
                :label="`${$t('page.createOrder.steps.step2.productForm.width')} *`"
                type="number"
                name="package-width"
                v-model="packages.customDimension.width"
                @input="$v.packages.customDimension.width.$touch()"
                @blur="$v.packages.customDimension.width.$touch()"
                :errors="getModelErrors($v.packages.customDimension.width)"
                :isDirty="$v.packages.customDimension.width.$dirty"
                dataId="product-return-package-step-formPackage-width"
                suffix="cm"
              />

              <mp-textfield
                :label="`${$t('page.createOrder.steps.step2.productForm.height')} *`"
                type="number"
                name="package-height"
                v-model="packages.customDimension.height"
                @input="$v.packages.customDimension.height.$touch()"
                @blur="$v.packages.customDimension.height.$touch()"
                :errors="getModelErrors($v.packages.customDimension.height)"
                :isDirty="$v.packages.customDimension.height.$dirty"
                dataId="product-return-package-step-formPackage-height"
                suffix="cm"
              />
            </v-col>
          </v-row>
        </div>
      </div>

      <v-row no-gutters class="mt-8 weight-unit-outer-wrapper">
        <v-col cols="6" sm="6" class="weight-wrapper">
          <mp-textfield
            :label="`${$t('page.createOrder.steps.step2.productForm.weight')} *`"
            type="number"
            name="packageWeight"
            v-model="packages.packageWeight"
            @input="$v.packages.packageWeight.$touch()"
            @blur="$v.packages.packageWeight.$touch()"
            :errors="getModelErrors($v.packages.packageWeight)"
            :isDirty="$v.packages.packageWeight.$dirty"
            dataId="product-return-package-step-formPackage-weight"
            suffix="kg"
          />
        </v-col>
      </v-row>
    </v-row>
  </div>
</template>

<script lang="ts">
import mixins from 'vue-typed-mixins'
import { required, requiredIf, decimal, minValue } from 'vuelidate/lib/validators'
import { AVAILABLE_PACKAGE_SIZE, AVAILABLE_PACKAGE_SIZE_TYPE } from '@/constants'
import { validationMixin } from '@/mixins'

export default mixins(validationMixin).extend({
  name: 'package-form',
  data: () => ({
    packages: {
      packageSize: 1,
      packageWeight: null,
      weightUnit: 'kg',
      customDimension: {
        length: '',
        width: '',
        height: '',
        unit: 'cm',
      },
    },
    useCustomDimension: false,
    availablePackageSize: AVAILABLE_PACKAGE_SIZE.filter(
      ({ type }) => type !== AVAILABLE_PACKAGE_SIZE_TYPE.OTHER,
    ),
  }),
  validations() {
    const useCustomDimension = this.useCustomDimension

    return {
      packages: {
        packageSize: { required },
        packageWeight: { required, decimal, minValue: minValue(0.01) },
        customDimension: {
          length: {
            required: requiredIf((): boolean => useCustomDimension),
            decimal,
            minValue: minValue(0.01),
          },
          width: {
            required: requiredIf((): boolean => useCustomDimension),
            decimal,
            minValue: minValue(0.01),
          },
          height: {
            required: requiredIf((): boolean => useCustomDimension),
            decimal,
            minValue: minValue(0.01),
          },
          unit: { required: requiredIf((): boolean => useCustomDimension) },
        },
      },
    }
  },
  mounted() {
    this.$emit('invalid', this.$v.$invalid)
    this.$emit('updateDimensions', this.getDimension())
  },
  methods: {
    handleCustomDimension() {
      this.useCustomDimension = !this.useCustomDimension
    },
    getDimension() {
      if (this.useCustomDimension) {
        return {
          ...this.packages.customDimension,
          weight: { value: this.packages.packageWeight, unit: this.packages.weightUnit },
        }
      }
      for (const availablePackageSize in this.availablePackageSize) {
        if (
          parseInt(availablePackageSize, 10) + 1 ===
          ((this.packages.packageSize as unknown) as number)
        ) {
          return {
            width: this.availablePackageSize[availablePackageSize].dimension.width,
            length: this.availablePackageSize[availablePackageSize].dimension.length,
            height: this.availablePackageSize[availablePackageSize].dimension.height,
            unit: this.availablePackageSize[availablePackageSize].unit || 'cm',
            weight: { value: this.packages.packageWeight, unit: this.packages.weightUnit },
          }
        }
      }
      return {}
    },
  },
  watch: {
    '$v.packages.$invalid'(next) {
      this.$emit('invalid', next)
    },
    'packages.customDimension': {
      deep: true,
      handler() {
        this.$emit('updateDimensions', this.getDimension())
      },
    },
    'packages.packageSize'() {
      this.$emit('updateDimensions', this.getDimension())
    },
    'packages.packageWeight'() {
      this.$emit('updateDimensions', this.getDimension())
    },
    'packages.weightUnit'() {
      this.$emit('updateDimensions', this.getDimension())
    },
  },
})
</script>

<style lang="scss">
#package-selection-form {
  .ship {
    background-color: $main-lighten-80-color !important;
  }

  .use-custom-dimension {
    background-color: $main-lighten-80-color !important;
    width: 100%;

    .swith-wrapper {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }

  .weight-wrapper {
    padding-right: 1rem;
  }

  .radio-group-custom {
    margin-top: 1rem !important;
  }
}
</style>
