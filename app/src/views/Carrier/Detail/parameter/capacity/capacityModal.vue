<template>
  <mp-dialog-confirmation
    dataId="carrier-delivery-capacity-modal"
    classWrapper="carrier-delivery-capacity-modal"
    color="primary"
    :header="{
      iconClose: 'mdi-close',
      icon: $vuetify.breakpoint.smAndUp ? 'mdi-pencil' : '',
      isColorBackground: true,
      text: $t('action.modify.capacity'),
      textPolice: 'medium16',
    }"
    :btnValidation="{
      text: $t('action.save'),
      format: 'success',
      icon: 'content-save-outline',
      disabled: $v.$invalid,
      loading,
    }"
    :btnCancel="{ text: $t('action.cancel.base'), format: 'link', linkColor: 'black' }"
    @close="$emit('close')"
    @submit="handleSubmit()"
  >
    <template #content>
      <v-row no-gutters>
        <v-col cols="10" offset="1">
          <mp-chips-wrapper
            class="mt-8"
            :chips="chipsCapacityTypes"
            v-model="selectedType"
            :maxChips="chipsCapacityTypes.length"
            dataId="chips-wrapper-capacity-types"
          />
        </v-col>

        <v-col
          cols="10"
          offset="1"
          class="mt-6 mb-5"
          v-if="selectedType.value === CapacityType.WEIGHT"
        >
          <mp-textfield
            class="mb-5"
            type="number"
            dataId="carrier-detail-capacity-modal-minKgCapacity"
            :label="
              `${$t('page.carrier.capacity.minWeight')}${
                Boolean(parentMinKilogramCapacity) ? ' *' : ''
              }`
            "
            :suffix="$t('common.unit.kilogram')"
            v-model="editOrderEligibility.minKilogramCapacity"
            @input="
              $v.editOrderEligibility.minKilogramCapacity.$touch()
              $v.editOrderEligibility.maxKilogramCapacity.$touch()
            "
            @blur="
              $v.editOrderEligibility.minKilogramCapacity.$touch()
              $v.editOrderEligibility.maxKilogramCapacity.$touch()
            "
            :errors="getModelErrors($v.editOrderEligibility.minKilogramCapacity)"
            :isDirty="$v.editOrderEligibility.minKilogramCapacity.$dirty"
          />

          <mp-textfield
            class="mb-5"
            type="number"
            dataId="carrier-detail-capacity-modal-maxKgCapacity"
            :label="
              `${$t('page.carrier.capacity.maxWeight')}${parentMaxKilogramCapacity ? ' *' : ''}`
            "
            :suffix="$t('common.unit.kilogram')"
            v-model="editOrderEligibility.maxKilogramCapacity"
            @input="
              $v.editOrderEligibility.maxKilogramCapacity.$touch()
              $v.editOrderEligibility.minKilogramCapacity.$touch()
            "
            @blur="
              $v.editOrderEligibility.maxKilogramCapacity.$touch()
              $v.editOrderEligibility.minKilogramCapacity.$touch()
            "
            :errors="getModelErrors($v.editOrderEligibility.maxKilogramCapacity)"
            :isDirty="$v.editOrderEligibility.maxKilogramCapacity.$dirty"
          />

          <mp-textfield
            class="mb-5"
            type="number"
            dataId="carrier-detail-capacity-modal-packageMinWeight"
            :label="
              `${$t('page.carrier.capacity.packageMinWeight')}${parentPackageMinWeight ? ' *' : ''}`
            "
            v-model="editOrderEligibility.packageMinWeight"
            :suffix="$t('common.unit.kilogram')"
            @input="
              $v.editOrderEligibility.packageMinWeight.$touch()
              $v.editOrderEligibility.packageMaxWeight.$touch()
            "
            @blur="
              $v.editOrderEligibility.packageMinWeight.$touch()
              $v.editOrderEligibility.packageMaxWeight.$touch()
            "
            :errors="getModelErrors($v.editOrderEligibility.packageMinWeight)"
            :isDirty="$v.editOrderEligibility.packageMinWeight.$dirty"
          />

          <mp-textfield
            type="number"
            dataId="carrier-detail-capacity-modal-packageMaxWeight"
            :label="
              `${$t('page.carrier.capacity.packageMaxWeight')}${parentPackageMaxWeight ? ' *' : ''}`
            "
            v-model="editOrderEligibility.packageMaxWeight"
            :suffix="$t('common.unit.kilogram')"
            @input="
              $v.editOrderEligibility.packageMaxWeight.$touch()
              $v.editOrderEligibility.packageMinWeight.$touch()
            "
            @blur="
              $v.editOrderEligibility.packageMaxWeight.$touch()
              $v.editOrderEligibility.packageMinWeight.$touch()
            "
            :errors="getModelErrors($v.editOrderEligibility.packageMaxWeight)"
            :isDirty="$v.editOrderEligibility.packageMaxWeight.$dirty"
          />
        </v-col>

        <v-col
          cols="10"
          offset="1"
          class="mt-6 mb-5"
          v-if="selectedType.value === CapacityType.DIMENSION"
        >
          <mp-textfield
            class="mb-5"
            type="number"
            dataId="carrier-detail-capacity-modal-minCombinedLength"
            :label="
              `${$t('page.carrier.capacity.minCombinedLength')}${
                parentMinCombinedLength ? ' *' : ''
              }`
            "
            :suffix="$t('common.unit.centimeter')"
            v-model="editOrderEligibility.minCombinedLength"
            @input="
              $v.editOrderEligibility.minCombinedLength.$touch()
              $v.editOrderEligibility.maxCombinedLength.$touch()
            "
            @blur="
              $v.editOrderEligibility.minCombinedLength.$touch()
              $v.editOrderEligibility.maxCombinedLength.$touch()
            "
            :errors="getModelErrors($v.editOrderEligibility.minCombinedLength)"
            :isDirty="$v.editOrderEligibility.minCombinedLength.$dirty"
          />

          <mp-textfield
            class="mb-5"
            type="number"
            dataId="carrier-detail-capacity-modal-maxCombinedLength"
            :label="
              `${$t('page.carrier.capacity.maxCombinedLength')}${
                parentMaxCombinedLength ? ' *' : ''
              }`
            "
            :suffix="$t('common.unit.centimeter')"
            v-model="editOrderEligibility.maxCombinedLength"
            @input="
              $v.editOrderEligibility.maxCombinedLength.$touch()
              $v.editOrderEligibility.minCombinedLength.$touch()
            "
            @blur="
              $v.editOrderEligibility.maxCombinedLength.$touch()
              $v.editOrderEligibility.minCombinedLength.$touch()
            "
            :errors="getModelErrors($v.editOrderEligibility.maxCombinedLength)"
            :isDirty="$v.editOrderEligibility.maxCombinedLength.$dirty"
          />

          <mp-textfield
            class="mb-5"
            type="number"
            dataId="carrier-detail-capacity-modal-minLength"
            :label="`${$t('page.carrier.capacity.minLength')}${parentMinLength ? ' *' : ''}`"
            :suffix="$t('common.unit.centimeter')"
            v-model="editOrderEligibility.minLength"
            @input="
              $v.editOrderEligibility.minLength.$touch()
              $v.editOrderEligibility.maxLength.$touch()
            "
            @blur="
              $v.editOrderEligibility.minLength.$touch()
              $v.editOrderEligibility.maxLength.$touch()
            "
            :errors="getModelErrors($v.editOrderEligibility.minLength)"
            :isDirty="$v.editOrderEligibility.minLength.$dirty"
          />

          <mp-textfield
            class="mb-5"
            type="number"
            dataId="carrier-detail-capacity-modal-maxLength"
            :label="`${$t('page.carrier.capacity.maxLength')}${parentMaxLength ? ' *' : ''}`"
            :suffix="$t('common.unit.centimeter')"
            v-model="editOrderEligibility.maxLength"
            @input="
              $v.editOrderEligibility.maxLength.$touch()
              $v.editOrderEligibility.minLength.$touch()
            "
            @blur="
              $v.editOrderEligibility.maxLength.$touch()
              $v.editOrderEligibility.minLength.$touch()
            "
            :errors="getModelErrors($v.editOrderEligibility.maxLength)"
            :isDirty="$v.editOrderEligibility.maxLength.$dirty"
          />

          <mp-textfield
            class="mb-5"
            type="number"
            dataId="carrier-detail-capacity-modal-maxDevelopedDimensions"
            :label="
              `${$t('page.carrier.capacity.maxDevelopedDimensions')}${
                parentMaxDevelopedDimensions ? ' *' : ''
              }`
            "
            :suffix="$t('common.unit.centimeter')"
            v-model="editOrderEligibility.maxDevelopedDimensions"
            @input="$v.editOrderEligibility.maxDevelopedDimensions.$touch()"
            @blur="$v.editOrderEligibility.maxDevelopedDimensions.$touch()"
            :errors="getModelErrors($v.editOrderEligibility.maxDevelopedDimensions)"
            :isDirty="$v.editOrderEligibility.maxDevelopedDimensions.$dirty"
          />

          <mp-textfield
            type="number"
            dataId="carrier-detail-capacity-modal-maxHeight"
            :label="`${$t('page.carrier.capacity.maxHeight')}${parentMaxHeight ? ' *' : ''}`"
            :suffix="$t('common.unit.centimeter')"
            v-model="editOrderEligibility.maxHeight"
            @input="$v.editOrderEligibility.maxHeight.$touch()"
            @blur="$v.editOrderEligibility.maxHeight.$touch()"
            :errors="getModelErrors($v.editOrderEligibility.maxHeight)"
            :isDirty="$v.editOrderEligibility.maxHeight.$dirty"
          />
        </v-col>

        <v-col
          cols="10"
          offset="1"
          class="mt-6 mb-5"
          v-if="selectedType.value === CapacityType.DISTANCE"
        >
          <mp-textfield
            class="mb-5"
            type="number"
            dataId="carrier-detail-capacity-modal-minKilometricDistance"
            :label="
              `${$t('page.carrier.capacity.minKilometricDistance')}${
                parentMinKilometricDistance ? ' *' : ''
              }`
            "
            :suffix="$t('common.unit.kilometer')"
            v-model="editOrderEligibility.minKilometricDistance"
            @input="
              $v.editOrderEligibility.minKilometricDistance.$touch()
              $v.editOrderEligibility.maxKilometricDistance.$touch()
            "
            @blur="
              $v.editOrderEligibility.minKilometricDistance.$touch()
              $v.editOrderEligibility.maxKilometricDistance.$touch()
            "
            :errors="getModelErrors($v.editOrderEligibility.minKilometricDistance)"
            :isDirty="$v.editOrderEligibility.minKilometricDistance.$dirty"
          />

          <mp-textfield
            type="number"
            dataId="carrier-detail-capacity-modal-maxKilometricDistance"
            :label="
              `${$t('page.carrier.capacity.maxKilometricDistance')}${
                parentMaxKilometricDistance ? ' *' : ''
              }`
            "
            :suffix="$t('common.unit.kilometer')"
            v-model="editOrderEligibility.maxKilometricDistance"
            @input="
              $v.editOrderEligibility.maxKilometricDistance.$touch()
              $v.editOrderEligibility.minKilometricDistance.$touch()
            "
            @blur="
              $v.editOrderEligibility.maxKilometricDistance.$touch()
              $v.editOrderEligibility.minKilometricDistance.$touch()
            "
            :errors="getModelErrors($v.editOrderEligibility.maxKilometricDistance)"
            :isDirty="$v.editOrderEligibility.maxKilometricDistance.$dirty"
          />
        </v-col>

        <v-col
          cols="10"
          offset="1"
          class="mt-6 mb-5"
          v-if="selectedType.value === CapacityType.PACKAGE"
        >
          <mp-textfield
            class="mb-5"
            type="number"
            dataId="carrier-detail-capacity-modal-maxPackageQuantity"
            :label="$t('page.carrier.capacity.labels.maxPackageQuantity')"
            v-model="editOrderEligibility.maxPackageQuantity"
            @input="
              $v.editOrderEligibility.maxPackageQuantity.$touch()
              $v.editOrderEligibility.maxKilometricDistance.$touch()
            "
            @blur="
              $v.editOrderEligibility.maxPackageQuantity.$touch()
              $v.editOrderEligibility.maxKilometricDistance.$touch()
            "
            :errors="getModelErrors($v.editOrderEligibility.maxPackageQuantity)"
            :isDirty="$v.editOrderEligibility.maxPackageQuantity.$dirty"
          />
        </v-col>
      </v-row>
    </template>
  </mp-dialog-confirmation>
</template>

<script lang="ts">
import { GetCarrierParams } from '@/services/carrier/CarrierRepository'
import OrderEligibilityService from '@/services/orderEligibility/OrderEligibilityService'
import { between, integer, minValue, requiredIf } from 'vuelidate/lib/validators'
import { CapacityType } from './capacity.vue'
import { CarrierEligibilityEntity } from '@/types'
import { maxInt } from '@/constants'
import { validationMixin } from '@/mixins'

import mixins from 'vue-typed-mixins'
import { SnackBarType } from '@/store/types'

export default mixins(validationMixin).extend({
  name: 'mp-carrier-detail-modal',
  props: {
    orderEligibility: {
      type: Object as () => CarrierEligibilityEntity,
      required: true,
    },
    carrierParent: {
      type: Object as () => CarrierEligibilityEntity,
      required: false,
    },
    params: {
      type: Object as () => GetCarrierParams,
      required: true,
    },
  },
  data: () => ({
    loading: false,
    CapacityType,
    selectedType: CapacityType.WEIGHT as CapacityType,
    editOrderEligibility: null as CarrierEligibilityEntity | null,
  }),
  computed: {
    chipsCapacityTypes(): Array<{ text: string; value: string }> {
      return Object.values(CapacityType).map(type => {
        return {
          text: this.$t(`technical.capacity.type.${type}`),
          value: type,
        }
      })
    },
    parentMaxKilogramCapacity(): number {
      if (this.carrierParent) {
        return typeof this.carrierParent.maxKilogramCapacity === 'string'
          ? parseInt(this.carrierParent.maxKilogramCapacity, 10)
          : this.carrierParent.maxKilogramCapacity
      }
      return 0
    },
    parentMinKilogramCapacity(): number {
      if (this.carrierParent) {
        return typeof this.carrierParent.minKilogramCapacity === 'string'
          ? parseInt(this.carrierParent.minKilogramCapacity, 10)
          : this.carrierParent.minKilogramCapacity
      }
      return 0
    },
    parentMaxKilometricDistance(): number {
      if (this.carrierParent?.maxKilometricDistance) {
        return this.carrierParent.maxKilometricDistance
      }
      return 0
    },
    parentMaxDevelopedDimensions(): number {
      if (this.carrierParent?.maxDevelopedDimensions) {
        return this.carrierParent.maxDevelopedDimensions
      }
      return 0
    },
    parentMaxHeight(): number {
      if (this.carrierParent?.maxHeight) {
        return this.carrierParent.maxHeight
      }
      return 0
    },
    parentMinKilometricDistance(): number {
      if (this.carrierParent?.minKilometricDistance) {
        return this.carrierParent.minKilometricDistance
      }
      return 0
    },
    parentPackageMinWeight(): number {
      if (this.carrierParent?.packageMinWeight) {
        return this.carrierParent.packageMinWeight
      }
      return 0
    },
    parentPackageMaxWeight(): number {
      if (this.carrierParent?.packageMaxWeight) {
        return this.carrierParent.packageMaxWeight
      }
      return 0
    },
    parentMinCombinedLength(): number {
      if (this.carrierParent?.minCombinedLength) {
        return this.carrierParent.minCombinedLength
      }
      return 0
    },
    parentMaxCombinedLength(): number {
      if (this.carrierParent?.maxCombinedLength) {
        return this.carrierParent.maxCombinedLength
      }
      return 0
    },
    parentMinLength(): number {
      if (this.carrierParent?.minLength) {
        return this.carrierParent.minLength
      }
      return 0
    },
    parentMaxLength(): number {
      if (this.carrierParent?.maxLength) {
        return this.carrierParent.maxLength
      }
      return 0
    },
    parentMaxPackageQuantity(): number {
      if (this.carrierParent?.maxPackageQuantity) {
        return this.carrierParent.maxPackageQuantity
      }
      return 0
    },
  },
  validations() {
    const {
      parentMaxKilogramCapacity,
      parentMinKilogramCapacity,
      parentMaxKilometricDistance,
      parentMaxDevelopedDimensions,
      parentMaxHeight,
      parentMinKilometricDistance,
      parentPackageMinWeight,
      parentPackageMaxWeight,
      parentMinCombinedLength,
      parentMaxCombinedLength,
      parentMinLength,
      parentMaxLength,
      parentMaxPackageQuantity,
      editOrderEligibility,
    } = this

    const computeMaxForMin = (currentMax: string | number, parentMax: number) =>
      ((currentMax as unknown) as number) > 0
        ? ((currentMax as unknown) as number)
        : ((parentMax as unknown) as number) > 0
        ? ((parentMax as unknown) as number)
        : maxInt

    const computeMinForMax = (currentMin: string | number, parentMin: number) =>
      ((currentMin as unknown) as number) > 0
        ? ((currentMin as unknown) as number)
        : ((parentMin as unknown) as number) || 0

    // weight
    const minKilogramCapacities: { min: number; max: number } = {
      min: !parentMinKilogramCapacity ? 0 : parentMinKilogramCapacity,
      max: computeMaxForMin(editOrderEligibility!.maxKilogramCapacity, parentMaxKilogramCapacity),
    }
    const maxKilogramCapacities: { min: number; max: number } = {
      min: computeMinForMax(editOrderEligibility!.minKilogramCapacity, parentMinKilogramCapacity),
      max: !parentMaxKilogramCapacity ? maxInt : parentMaxKilogramCapacity,
    }

    // distance
    const maxKilometricDistances: { min: number; max: number } = {
      min: computeMinForMax(
        editOrderEligibility!.minKilometricDistance || 0,
        parentMinKilometricDistance,
      ),
      max: !parentMaxKilometricDistance ? maxInt : parentMaxKilometricDistance,
    }
    const minKilometricDistances: { min: number; max: number } = {
      min: !parentMinKilometricDistance ? 0 : parentMinKilometricDistance,
      max: computeMaxForMin(
        editOrderEligibility!.maxKilometricDistance || 0,
        parentMaxKilometricDistance,
      ),
    }

    // packageWeight
    const packageMinWeights: { min: number; max: number } = {
      min: !parentPackageMinWeight ? 0 : parentPackageMinWeight,
      max: computeMaxForMin(editOrderEligibility!.packageMaxWeight || 0, parentPackageMaxWeight),
    }
    const packageMaxWeights: { min: number; max: number } = {
      min: computeMinForMax(editOrderEligibility!.packageMinWeight || 0, parentPackageMinWeight),
      max: !parentPackageMaxWeight ? maxInt : parentPackageMaxWeight,
    }

    // combinedLength
    const minCombinedLengths: { min: number; max: number } = {
      min: !parentMinCombinedLength ? 0 : parentMinCombinedLength,
      max: computeMaxForMin(editOrderEligibility!.maxCombinedLength || 0, parentMaxCombinedLength),
    }
    const maxCombinedLengths: { min: number; max: number } = {
      min: computeMinForMax(editOrderEligibility!.minCombinedLength || 0, parentMinCombinedLength),
      max: !parentMaxCombinedLength ? maxInt : parentMaxCombinedLength,
    }

    // Length
    const minLengths: { min: number; max: number } = {
      min: !parentMinLength ? 0 : parentMinLength,
      max: computeMaxForMin(editOrderEligibility!.maxLength || 0, parentMaxLength),
    }
    const maxLengths: { min: number; max: number } = {
      min: computeMinForMax(editOrderEligibility!.minLength || 0, parentMinLength),
      max: !parentMaxLength ? maxInt : parentMaxLength,
    }

    const maxDevelopedDimensions: { min: number; max: number } = {
      min: 0,
      max: !parentMaxDevelopedDimensions
        ? maxInt
        : ((parentMaxDevelopedDimensions as unknown) as number),
    }

    const maxHeight: { min: number; max: number } = {
      min: 0,
      max: !parentMaxHeight ? maxInt : ((parentMaxHeight as unknown) as number),
    }

    const maxPackageQuantity: { min: number; max: number } = {
      min: 0,
      max: !parentMaxPackageQuantity ? maxInt : ((parentMaxPackageQuantity as unknown) as number),
    }

    const maxKilogramCapacitiesMin: number =
      editOrderEligibility!.maxKilogramCapacity === 0 ? 0 : maxKilogramCapacities.min

    const carrierEligibilityMaxKilometricDistance: number =
      editOrderEligibility!.maxKilometricDistance === 0 ? 0 : maxKilometricDistances.min

    const carrierEligibilityPackageMaxWeight: number =
      editOrderEligibility!.packageMaxWeight === 0 ? 0 : packageMaxWeights.min

    const carrierEligibilityMaxCombinedLength: number =
      editOrderEligibility!.maxCombinedLength === 0 ? 0 : maxCombinedLengths.min

    const carrierEligibilityMaxLength: number =
      editOrderEligibility!.maxLength === 0 ? 0 : maxLengths.min

    return {
      editOrderEligibility: {
        minKilogramCapacity: {
          between: between(minKilogramCapacities.min, minKilogramCapacities.max),
          required: requiredIf((): boolean => {
            return Boolean(parentMinKilogramCapacity)
          }),
          integer,
        },
        maxKilogramCapacity: {
          between: between(maxKilogramCapacitiesMin, maxKilogramCapacities.max),
          required: requiredIf((): boolean => {
            return Boolean(parentMaxKilogramCapacity)
          }),
          integer,
        },
        maxKilometricDistance: {
          between: between(carrierEligibilityMaxKilometricDistance, maxKilometricDistances.max),
          required: requiredIf((): boolean => {
            return Boolean(parentMaxKilometricDistance)
          }),
          integer,
        },
        maxDevelopedDimensions: {
          between: between(maxDevelopedDimensions.min, maxDevelopedDimensions.max),
          required: requiredIf((): boolean => {
            return Boolean(parentMaxDevelopedDimensions)
          }),
          integer,
        },
        maxHeight: {
          between: between(maxHeight.min, maxHeight.max),
          required: requiredIf((): boolean => {
            return Boolean(parentMaxHeight)
          }),
          integer,
        },
        minKilometricDistance: {
          between: between(minKilometricDistances.min, minKilometricDistances.max),
          required: requiredIf((): boolean => {
            return Boolean(parentMinKilometricDistance)
          }),
          integer,
        },
        packageMinWeight: {
          between: between(packageMinWeights.min, packageMinWeights.max),
          required: requiredIf((): boolean => {
            return Boolean(parentPackageMinWeight)
          }),
          integer,
        },
        packageMaxWeight: {
          between: between(carrierEligibilityPackageMaxWeight, packageMaxWeights.max),
          required: requiredIf((): boolean => {
            return Boolean(parentPackageMaxWeight)
          }),
          integer,
        },
        minCombinedLength: {
          between: between(minCombinedLengths.min, minCombinedLengths.max),
          required: requiredIf((): boolean => {
            return Boolean(parentMinCombinedLength)
          }),
          integer,
        },
        maxCombinedLength: {
          between: between(carrierEligibilityMaxCombinedLength, maxCombinedLengths.max),
          required: requiredIf((): boolean => {
            return Boolean(parentMaxCombinedLength)
          }),
          integer,
        },
        minLength: {
          between: between(minLengths.min, minLengths.max),
          required: requiredIf((): boolean => {
            return Boolean(parentMinLength)
          }),
          integer,
        },
        maxLength: {
          between: between(carrierEligibilityMaxLength, maxLengths.max),
          required: requiredIf((): boolean => {
            return Boolean(parentMaxLength)
          }),
          integer,
        },
        maxPackageQuantity: {
          between: between(maxPackageQuantity.min, maxPackageQuantity.max),
          integer,
          minValue: minValue(0),
        },
      },
    }
  },
  beforeMount() {
    this.editOrderEligibility = JSON.parse(JSON.stringify(this.orderEligibility))
  },
  methods: {
    async handleSubmit(): Promise<void> {
      this.loading = true
      const {
        minKilogramCapacity,
        maxKilogramCapacity,
        packageMinWeight,
        packageMaxWeight,
        minCombinedLength,
        maxCombinedLength,
        minLength,
        maxLength,
        maxDevelopedDimensions,
        maxHeight,
        minKilometricDistance,
        maxKilometricDistance,
        maxPackageQuantity,
      } = this.editOrderEligibility!
      try {
        await OrderEligibilityService.update(this.params, {
          minKilogramCapacity: (minKilogramCapacity || 0) as number,
          maxKilogramCapacity: (maxKilogramCapacity || 0) as number,
          packageMinWeight: (packageMinWeight || 0) as number,
          packageMaxWeight: (packageMaxWeight || 0) as number,
          minCombinedLength: (minCombinedLength || 0) as number,
          maxCombinedLength: (maxCombinedLength || 0) as number,
          minLength: (minLength || 0) as number,
          maxLength: (maxLength || 0) as number,
          maxDevelopedDimensions: (maxDevelopedDimensions || 0) as number,
          maxHeight: (maxHeight || 0) as number,
          minKilometricDistance: (minKilometricDistance || 0) as number,
          maxKilometricDistance: (maxKilometricDistance || 0) as number,
          maxPackageQuantity: (maxPackageQuantity || 0) as number,
        })
        this.orderEligibility.minKilogramCapacity = minKilogramCapacity
        this.orderEligibility.maxKilogramCapacity = maxKilogramCapacity
        this.orderEligibility.packageMinWeight = packageMinWeight
        this.orderEligibility.packageMaxWeight = packageMaxWeight
        this.orderEligibility.minCombinedLength = minCombinedLength
        this.orderEligibility.maxCombinedLength = maxCombinedLength
        this.orderEligibility.minLength = minLength
        this.orderEligibility.maxLength = maxLength
        this.orderEligibility.maxDevelopedDimensions = maxDevelopedDimensions
        this.orderEligibility.maxHeight = maxHeight
        this.orderEligibility.minKilometricDistance = minKilometricDistance
        this.orderEligibility.maxKilometricDistance = maxKilometricDistance
        this.orderEligibility.maxPackageQuantity = maxPackageQuantity
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
        this.loading = false
        this.$emit('submit', this.editOrderEligibility)
      }
    },
  },
})
</script>

<style lang="scss">
.carrier-delivery-capacity-modal {
  .main-dialog-content {
    @media #{map-get($display-breakpoints, 'sm-and-up')} {
      @import '../../../../../styles/mixins/macScrollbar';
      @include setMacScrollbar('&');
      max-height: calc(100vh - 33rem);
      overflow-y: scroll;
    }
  }
  .v-card__actions {
    border-top: 0.1rem solid $main-lighten-74-color;
  }
}
</style>
