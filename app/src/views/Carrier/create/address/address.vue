<template>
  <div id="carrier-create-address" data-id="carrier-create-address">
    <v-row no-gutters class="mp-row">
      <v-col cols="12">
        <mp-textfield
          dataId="carrier-create-address-line1"
          :label="`${$t('common.address.base')} *`"
          v-model="address.addressLine1"
          name="carrier-create-address-line1"
          @input="$v.address.addressLine1.$touch()"
          @blur="$v.address.addressLine1.$touch()"
          :errors="getModelErrors($v.address.addressLine1)"
          :isDirty="$v.address.addressLine1.$dirty"
        />
      </v-col>
    </v-row>

    <v-row no-gutters class="mp-row">
      <v-col cols="12">
        <mp-textfield
          dataId="carrier-create-address-line2"
          :label="$t('common.address.additional')"
          v-model="address.addressLine2"
          name="carrier-create-address-line2"
        />
      </v-col>
    </v-row>

    <v-row no-gutters class="mp-row">
      <v-col cols="12">
        <mp-textfield
          dataId="carrier-create-address-postalCode"
          :label="`${$t('common.address.zipcode')} *`"
          v-model="address.postalCode"
          name="carrier-create-address-postalCode"
          @input="$v.address.postalCode.$touch()"
          @blur="$v.address.postalCode.$touch()"
          :errors="getModelErrors($v.address.postalCode)"
          :isDirty="$v.address.postalCode.$dirty"
        />
      </v-col>
    </v-row>

    <v-row no-gutters class="mp-row">
      <v-col cols="12">
        <mp-textfield
          dataId="carrier-create-address-city"
          :label="`${$t('common.address.city')} *`"
          v-model="address.city"
          name="carrier-create-address-city"
          @input="$v.address.city.$touch()"
          @blur="$v.address.city.$touch()"
          :errors="getModelErrors($v.address.city)"
          :isDirty="$v.address.city.$dirty"
        />
      </v-col>
    </v-row>

    <v-row no-gutters class="mp-row">
      <v-col cols="12">
        <mp-select
          :label="`${$t('common.country.base')} *`"
          dataId="carrier-create-address-country"
          v-model="address.country"
          :items="getCountries"
          @input="$v.address.country.$touch()"
          @blur="$v.address.country.$touch()"
          :errors="getModelErrors($v.address.country)"
          :isDirty="$v.address.country.$dirty"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { COUNTRY } from '@/constants/shared'
import mixins from 'vue-typed-mixins'
import { Address, SelectItem } from '@/types'
import { validationMixin } from '@/mixins'
import { required } from 'vuelidate/lib/validators'

export default mixins(validationMixin).extend({
  name: 'carrier-create-address',
  props: {
    address: {
      type: Object as () => Address,
      required: true,
    },
  },
  computed: {
    getCountries(): SelectItem[] {
      return Object.values(COUNTRY).map(value => ({
        text: this.$t(`common.country.${value}`),
        value: value as string,
      }))
    },
  },
  validations: {
    address: {
      addressLine1: { required },
      postalCode: { required },
      city: { required },
      country: { required },
    },
  },
  mounted() {
    this.$emit('invalid', this.$v.address.$invalid)
  },
  watch: {
    '$v.address.$invalid'(next) {
      this.$emit('invalid', next)
    },
  },
})
</script>

<style lang="scss" scoped>
#carrier-create-address {
  padding: 0;
}
</style>
