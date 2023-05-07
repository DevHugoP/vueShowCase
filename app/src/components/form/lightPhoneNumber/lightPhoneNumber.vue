<template>
  <v-container v-if="hasLoad" id="light-phone-number">
    <v-row class="label-wrapper" v-if="localPhone !== ''">
      <span class="label">{{ `${$t('common.phone')} ${(required && '*') || ''}` }}</span>
    </v-row>
    <v-row no-gutters>
      <v-col cols="11">
        <vue-tel-input
          :defaultCountry="country"
          v-model="localPhone"
          @validate="checkPhoneNumber"
          @input="onInput"
          @country-changed="updateCountry"
          :onlyCountries="countries"
          :required="isRequired"
          inputClasses="vue-tel-input-input"
          :placeholder="`${$t('common.phone')} ${(required && '*') || ''}`"
          :data-id="dataId"
        />
      </v-col>
      <v-col cols="1" class="icon-wrapper">
        <v-icon v-if="isPhoneValid && localPhone">mdi-check-bold</v-icon>
        <v-icon v-if="(!isPhoneValid && localPhone) || (!localPhone && required && isDirtyData)">
          mdi-exclamation-thick
        </v-icon>
      </v-col>
    </v-row>
    <v-row no-gutters class="error-message-wrapper">
      <span class="error-message" v-if="!isPhoneValid && localPhone">
        {{ $t('validation.badPhone') }}
      </span>
      <span class="error-message" v-if="!localPhone && required && isDirtyData">
        {{ $t('validation.required.base') }}
      </span>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { VueTelInput, VueTelInputCountryOption } from 'vue-tel-input'

import phoneHelper from '@/helpers/phoneHelper'

import { validationMixin } from '@/mixins'
import mixins from 'vue-typed-mixins'
import { requiredIf } from 'vuelidate/lib/validators'

export default mixins(validationMixin).extend({
  name: 'light-phone-number',
  components: {
    VueTelInput,
  },
  props: {
    data: {
      type: Object as () => { phone: string | null },
      required: true,
    },
    dataId: {
      type: String,
      required: true,
    },
    isRequired: {
      type: Boolean,
      default: true,
    },
  },
  data: () => ({
    countries: phoneHelper.getCountries(),
    country: 'FR',
    localPhone: '',
    isPhoneValid: false,
    hasLoad: false,
    required: true,
    isDirtyData: false,
  }),
  validations() {
    const { required, isPhoneValid } = this
    return {
      localPhone: {
        required: requiredIf(function(this: any): boolean {
          // TODO : Find a better way to do it
          return required
        }),
        validPhone(): boolean {
          return isPhoneValid
        },
      },
    }
  },
  mounted() {
    const {
      data: { phone },
      country,
      isRequired,
    } = this
    if (phone && phoneHelper.getCountryCode(phone) !== phone) {
      this.country = phoneHelper.getCountryCode(phone)!
    } else {
      this.country = country
    }
    this.localPhone = phone || ''
    if (this.localPhone || !isRequired) {
      this.isPhoneValid = true
    }
    // copy props to avoid errors
    this.required = isRequired

    if (Object.prototype.hasOwnProperty.call(this.$listeners, 'changeCountry')) {
      ;(this.$listeners as Record<string, (event: string) => void>).changeCountry(this.country)
    }

    this.hasLoad = true

    this.$emit('invalid', this.$v.localPhone.$invalid)
  },
  methods: {
    updateCountry(country: VueTelInputCountryOption) {
      // update parent value
      this.country = country.iso2

      if (Object.prototype.hasOwnProperty.call(this.$listeners, 'changeCountry')) {
        ;(this.$listeners as Record<string, (event: string) => void>).changeCountry(this.country)
      }
    },
    checkPhoneNumber({ number: phoneNumber, country, isValid }: Record<string, any>) {
      this.isPhoneValid = isValid
      if (!phoneNumber?.international || !country) {
        return
      }

      this.localPhone = phoneNumber.e164
      this.country = country.iso2

      this.validatePhoneNumber(phoneNumber.e164)
    },
    validatePhoneNumber(newPhoneNumber: string): void {
      if (this.isPhoneValid) {
        this.data.phone = newPhoneNumber
      }

      if (newPhoneNumber && newPhoneNumber[0] === '+' && this.isPhoneValid) {
        newPhoneNumber = newPhoneNumber.replace(/[^\d+]/g, '')
        this.data.phone = newPhoneNumber
      }

      if (newPhoneNumber === '' && !this.required) {
        this.isPhoneValid = true
        this.data.phone = null
      }
    },
    updateIsDirty() {
      if (this.localPhone !== '') {
        this.isDirtyData = true
      }
    },
    onInput(model: string, phoneValue: Record<string, any>) {
      if (Object.prototype.hasOwnProperty.call(this.$listeners, 'change')) {
        ;(this.$listeners as Record<string, (event: string) => void>).change(phoneValue.number.e164)
      }
      if (Object.prototype.hasOwnProperty.call(this.$listeners, 'changeCountry')) {
        ;(this.$listeners as Record<string, (event: string) => void>).changeCountry(this.country)
      }
      this.checkPhoneNumber(phoneValue)
    },
  },
  watch: {
    data() {
      // reset input with new data when parent component remove one contact
      if (this.data.phone && phoneHelper.getCountryCode(this.data.phone) === this.data.phone) {
        this.localPhone = phoneHelper.getCountryCode(this.data.phone)!
      }

      this.localPhone = this.data.phone || ''
    },
    localPhone() {
      this.updateIsDirty()
    },
    '$v.localPhone.$invalid'(next) {
      this.$emit('invalid', next)
    },
  },
})
</script>

<style lang="scss">
#light-phone-number {
  padding: 0;

  .label-wrapper {
    margin-bottom: 0rem;
    padding-left: 1.2rem;
    .label {
      color: $main-lighten-65-color;
      @include regular-14();
    }
  }

  .vue-tel-input {
    border: none !important;

    &:focus-within {
      box-shadow: none !important;
    }

    .vti__dropdown {
      border-bottom: solid 0.1rem $main-lighten-65-color;
      border-radius: 0.3rem;
      border-bottom-right-radius: initial;
    }

    .vue-tel-input-input {
      @include regular-16();
      border-bottom: solid 0.1rem $main-lighten-65-color;

      &::placeholder {
        color: $main-lighten-52-color !important;
      }
    }
    .vti__dropdown-list{
      padding-left: 0;
      top: 2.8rem;
      border-radius: 0.4rem;
      border: 0;
      box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.20);

      .vti__dropdown-item {
        @include regular-14();        
        color: $main-color !important;
        padding: 0.8rem 0 0.8rem 2rem;
        strong {
          font-weight: normal !important;
        }      
      }
    }
  }

  .icon-wrapper {
    border-bottom: solid 0.1rem $main-lighten-65-color;

    display: flex;
    justify-content: flex-end;
  }

  .error-message-wrapper {
    min-height: 2rem;
    display: flex;
    align-items: flex-end;

    .error-message {
      @include regular-12();
      color: $error-color;
    }
  }
}
</style>
