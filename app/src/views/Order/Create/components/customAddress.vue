<template>
  <v-row no-gutters>
    <v-col cols="12" class="mb-5">
      <mp-textfield
        :dataId="`${dataId}-addressLine1`"
        :label="`${searchLabel || $t('common.address.base')} *`"
        v-model="address.addressLine1"
        @input="validations.addressLine1.$touch()"
        @blur="validations.addressLine1.$touch()"
        :errors="getModelErrors(validations.addressLine1)"
        :isDirty="validations.addressLine1.$dirty"
      />
    </v-col>

    <v-col cols="12" class="mb-5">
      <mp-select
        :dataId="`${dataId}-country`"
        :label="`${$t('common.address.country')} *`"
        v-model="address.country"
        @input="validations.country.$touch()"
        @blur="validations.country.$touch()"
        :errors="getModelErrors(validations.country)"
        :isDirty="validations.country.$dirty"
        :items="getCountries"
        :attach="`#${dataId}OtherAddressCountryDropdown`"
        :dropdownId="`${dataId}OtherAddressCountryDropdown`"
      />
    </v-col>

    <v-col cols="4" class="mb-5">
      <mp-textfield
        :dataId="`${dataId}-postalCode`"
        :label="`${$t('common.address.zipcode')} *`"
        v-model="address.postalCode"
        @input="validations.postalCode.$touch()"
        @blur="validations.postalCode.$touch()"
        :errors="getModelErrors(validations.postalCode)"
        :isDirty="validations.postalCode.$dirty"
      />
    </v-col>

    <v-col cols="7" offset="1" class="mb-5">
      <mp-textfield
        :dataId="`${dataId}-city`"
        :label="`${$t('common.address.city')} *`"
        v-model="address.city"
        @input="validations.city.$touch()"
        @blur="validations.city.$touch()"
        :errors="getModelErrors(validations.city)"
        :isDirty="validations.city.$dirty"
      />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { COUNTRY } from '@/constants/shared'
import mixins from 'vue-typed-mixins'

import { Address } from '@/types'

import { validationMixin } from '@/mixins'

export default mixins(validationMixin).extend({
  name: 'create-order-itineray-custom-address',
  props: {
    address: {
      type: Object as () => Address,
    },
    validations: {
      type: Object as () => Record<string, any>,
    },
    dataId: {
      type: String,
      required: true,
    },
    searchLabel: {
      type: String,
      default: null
    }
  },
  computed: {
    getCountries(): {
      text: string
      value: string
    }[] {
      return Object.values(COUNTRY).map(value => ({
        text: this.$t(`common.country.${value}`),
        value,
      }))
    },
  },
  watch: {
    address: {
      deep: true,
      handler() {
        this.$emit('resetFormated')
      },
    },
  },
})
</script>

<style lang="scss" scoped>
.custom-address-wrapper {
  padding: 4.1rem 2.4rem 4.1rem 2.6rem;

  .custom-address-title {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .v-icon {
      cursor: pointer;
      color: $main-color;
    }
  }
}
</style>
